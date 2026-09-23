const express = require('express');
const cors = require('cors');

// Config values (fallback to defaults if .env is absent)
const PORT = process.env.PORT || 5000;
const API_KEY = process.env.API_KEY || 'my_secure_api_key_123';

const app = express();

// ==========================================
// Q1 & Q2: SERVER CONFIG & MIDDLEWARE
// ==========================================

// Enable CORS for cross-origin requests
app.use(cors());

// Parse incoming JSON request bodies
app.use(express.json());

// In-memory array of at least 5 task objects[cite: 3]
let tasks = [
  { id: 1, title: 'Set up Express server environment', completed: true },
  { id: 2, title: 'Write custom logger and auth middleware', completed: true },
  { id: 3, title: 'Build all 5 CRUD routes', completed: false },
  { id: 4, title: 'Test endpoints with Postman / Thunder Client', completed: false },
  { id: 5, title: 'Consume API with plain JS and React', completed: false }
];

// Custom Logger Middleware applied globally (method, URL, timestamp)[cite: 3]
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  next();
});

// Auth-check middleware requiring 'x-api-key'[cite: 3]
const authMiddleware = (req, res, next) => {
  const clientKey = req.headers['x-api-key'];
  if (!clientKey || clientKey !== API_KEY) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized: Missing or invalid x-api-key header'
    });
  }
  next();
};

// ==========================================
// Q1: 5 CRUD REST API ENDPOINTS[cite: 3]
// ==========================================

// 1. GET /api/tasks (Public)[cite: 3]
app.get('/api/tasks', (req, res) => {
  res.status(200).json({ success: true, data: tasks });
});

// 2. GET /api/tasks/:id (Public)[cite: 3]
app.get('/api/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id, 10);
  const task = tasks.find((t) => t.id === taskId);
  if (!task) {
    return res.status(404).json({ success: false, error: `Task with id ${taskId} not found` });
  }
  res.status(200).json({ success: true, data: task });
});

// 3. POST /api/tasks (Protected by authMiddleware)[cite: 3]
app.post('/api/tasks', authMiddleware, (req, res) => {
  const { title } = req.body;
  if (!title || typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({ success: false, error: 'Field "title" is required and cannot be empty.' });
  }

  const nextId = tasks.length > 0 ? Math.max(...tasks.map((t) => t.id)) + 1 : 1;
  const newTask = { id: nextId, title: title.trim(), completed: false };
  tasks.push(newTask);
  res.status(201).json({ success: true, data: newTask });
});

// 4. PUT /api/tasks/:id (Protected by authMiddleware)[cite: 3]
app.put('/api/tasks/:id', authMiddleware, (req, res) => {
  const taskId = parseInt(req.params.id, 10);
  const index = tasks.findIndex((t) => t.id === taskId);
  if (index === -1) {
    return res.status(404).json({ success: false, error: `Task with id ${taskId} not found` });
  }

  const { title, completed } = req.body;
  if (title !== undefined) tasks[index].title = String(title).trim();
  if (completed !== undefined) tasks[index].completed = Boolean(completed);

  res.status(200).json({ success: true, data: tasks[index] });
});

// 5. DELETE /api/tasks/:id (Protected by authMiddleware)[cite: 3]
app.delete('/api/tasks/:id', authMiddleware, (req, res) => {
  const taskId = parseInt(req.params.id, 10);
  const index = tasks.findIndex((t) => t.id === taskId);
  if (index === -1) {
    return res.status(404).json({ success: false, error: `Task with id ${taskId} not found` });
  }

  const [removedTask] = tasks.splice(index, 1);
  res.status(200).json({ success: true, data: removedTask });
});

// ==========================================
// Q3: SERVE PLAIN JS CLIENT AT /client[cite: 3]
// ==========================================
app.get('/client', (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Q3 - Plain JavaScript Client</title>
  <style>
    body { font-family: sans-serif; max-width: 600px; margin: 30px auto; padding: 0 16px; }
    .loading { color: #555; font-style: italic; }
    .error { background: #fee2e2; color: #991b1b; padding: 10px; border-radius: 4px; border: 1px solid #f87171; }
    li { padding: 8px; border-bottom: 1px solid #e5e7eb; }
  </style>
</head>
<body>
  <h2>Tasks (Plain JS Client)</h2>
  <p><small><a href="/">Go to React Client</a></small></p>
  <div id="status"></div>
  <ul id="task-list"></ul>

  <script>
    const statusDiv = document.getElementById('status');
    const taskList = document.getElementById('task-list');

    async function loadTasks() {
      statusDiv.innerHTML = '<p class="loading">Loading...</p>';
      taskList.innerHTML = '';
      try {
        const res = await fetch('/api/tasks');
        if (!res.ok) throw new Error('HTTP Status ' + res.status);
        const result = await res.json();
        statusDiv.innerHTML = '';
        result.data.forEach(task => {
          const li = document.createElement('li');
          li.textContent = task.id + '. ' + task.title + (task.completed ? ' [✓]' : ' [ ]');
          taskList.appendChild(li);
        });
      } catch (err) {
        statusDiv.innerHTML = '<div class="error"><strong>Fetch Error:</strong> ' + err.message + ' (Check server status)</div>';
      }
    }
    loadTasks();
  </script>
</body>
</html>`);
});

// ==========================================
// Q4 & Q5: SERVE REACT CLIENT AT /[cite: 3]
// ==========================================
app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Task Manager Mini App</title>
  <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #f8fafc; margin: 0; padding: 20px; }
    .container { max-width: 540px; margin: 20px auto; background: #fff; padding: 24px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.08); }
    .input-row { display: flex; gap: 8px; margin-bottom: 12px; }
    input[type="text"] { flex: 1; padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 4px; }
    button { padding: 8px 14px; border: none; border-radius: 4px; cursor: pointer; font-weight: 500; }
    .btn-add { background: #0284c7; color: white; }
    .btn-del { background: #ef4444; color: white; padding: 4px 8px; font-size: 13px; }
    .btn-test { background: #f59e0b; color: white; margin-bottom: 14px; font-size: 13px; }
    .task-item { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #f1f5f9; }
    .msg-error { background: #fef2f2; color: #991b1b; border: 1px solid #fca5a5; padding: 10px; border-radius: 4px; margin-bottom: 12px; }
    .msg-loading { color: #64748b; font-style: italic; }
  </style>
</head>
<body>
  <div id="root"></div>

  <script type="text/babel">
    const { useState, useEffect } = React;
    const API_URL = '/api/tasks';
    const API_KEY = '${API_KEY}';

    /*
     * AXIOS VS FETCH DIFFERENCES[cite: 3]:
     * 1. JSON Parsing: axios automatically parses the returned JSON under 'response.data',
     *    whereas fetch() requires an extra step: 'await response.json()'.
     * 2. Error Handling: axios automatically throws and routes non-2xx status codes (e.g. 401, 404)
     *    directly into the catch block (accessible via err.response.data), whereas fetch() does NOT
     *    reject on 4xx/5xx and requires manually checking 'response.ok'.
     */
    function TaskList() {
      // Full 3-state pattern (loading, error, data)[cite: 3]
      const [tasks, setTasks] = useState([]);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);
      const [newTitle, setNewTitle] = useState('');

      // Fetch tasks using Axios[cite: 3]
      const fetchTasks = async () => {
        setLoading(true);
        setError(null);
        try {
          const res = await axios.get(API_URL);
          setTasks(res.data.data);
        } catch (err) {
          setError(err.response?.data?.error || err.message);
        } finally {
          setLoading(false);
        }
      };

      useEffect(() => {
        fetchTasks();
      }, []);

      // POST new task using fetch[cite: 3]
      const handleAddTask = async (e) => {
        e.preventDefault();
        if (!newTitle.trim()) return;
        setError(null);
        try {
          const res = await fetch(API_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': API_KEY
            },
            body: JSON.stringify({ title: newTitle.trim() })
          });
          const result = await res.json();
          if (!res.ok) throw new Error(result.error || 'Failed to create task');

          // Update UI immediately without reload[cite: 3]
          setTasks(prev => [...prev, result.data]);
          setNewTitle('');
        } catch (err) {
          setError(err.message);
        }
      };

      // DELETE task[cite: 3]
      const handleDeleteTask = async (id) => {
        setError(null);
        try {
          const res = await fetch(API_URL + '/' + id, {
            method: 'DELETE',
            headers: { 'x-api-key': API_KEY }
          });
          const result = await res.json();
          if (!res.ok) throw new Error(result.error || 'Failed to delete task');

          // Remove from UI[cite: 3]
          setTasks(prev => prev.filter(t => t.id !== id));
        } catch (err) {
          setError(err.message);
        }
      };

      return (
        <div className="container">
          <h2>Task Manager Mini App</h2>
          <p><small><a href="/client">View Plain JS Client (Q3)</a></small></p>

          <form onSubmit={handleAddTask} className="input-row">
            <input
              type="text"
              placeholder="Enter new task..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <button type="submit" className="btn-add">Add Task</button>
          </form>

          {/* Test button for Q5 (Fake ID 9999 triggers 404)[cite: 3] */}
          <button onClick={() => handleDeleteTask(9999)} className="btn-test">
            Trigger 404 Test (Delete Fake ID 9999)
          </button>

          {loading && <p className="msg-loading">Loading tasks...</p>}
          {error && <div className="msg-error"><strong>Error:</strong> {error}</div>}

          <div>
            {tasks.map(task => (
              <div key={task.id} className="task-item">
                <span>#{task.id} - {task.title} {task.completed ? '✓' : ''}</span>
                <button onClick={() => handleDeleteTask(task.id)} className="btn-del">Delete</button>
              </div>
            ))}
          </div>
        </div>
      );
    }

    ReactDOM.createRoot(document.getElementById('root')).render(<TaskList />);
  </script>
</body>
</html>`);
});

// ==========================================
// Q2: 404 ROUTE HANDLER & ERROR MIDDLEWARE[cite: 3]
// ==========================================

// 404 handler for unmatched endpoints[cite: 3]
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Cannot ${req.method} ${req.originalUrl} - Route not found`
  });
});

// Centralized error-handling middleware (4 parameters)[cite: 3]
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

// Start Express server[cite: 3]
app.listen(PORT, () => {
  console.log(`Server actively running on http://localhost:${PORT}`);
  console.log(`- React Client: http://localhost:${PORT}/`);
  console.log(`- Plain JS Client: http://localhost:${PORT}/client`);
  console.log(`- REST API Root: http://localhost:${PORT}/api/tasks`);
});