import React, { useState } from 'react';

export default function TodoList() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setTodos(prev => [...prev, { id: Date.now(), text: input.trim() }]);
    setInput('');
  };

  const handleDelete = (id) => {
    setTodos(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div style={{ padding: '16px', border: '1px solid #ccc', margin: '10px 0' }}>
      <h3>Todo List</h3>
      <form onSubmit={handleAdd}>
        <input
          type="text"
          placeholder="Enter a task..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            {todo.text}{' '}
            <button onClick={() => handleDelete(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}