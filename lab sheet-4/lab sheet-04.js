const fs = require('fs');
const path = require('path');
const os = require('os');
const EventEmitter = require('events');
const http = require('http');
const url = require('url');

console.log('========== TASK 1: CUSTOM MODULES ==========');
function sum(a, b) {
  return a + b;
} //[cite: 1]

function evenOdd(num) {
  return num % 2 === 0 ? 'Even' : 'Odd';
} //[cite: 1]

console.log('Sum of 10 and 20:', sum(10, 20)); //[cite: 1]
console.log('10 is:', evenOdd(10)); //[cite: 1]
console.log('15 is:', evenOdd(15)); //[cite: 1]

console.log('\n========== TASK 2: FILE SYSTEM CRUD ==========');
const fileName = 'student.txt'; //[cite: 1]
fs.writeFileSync(fileName, 'Name: Sharansh Prajapati\nRoll Number: CU24250130\n'); //[cite: 1]
console.log('File created successfully.'); //[cite: 1]
fs.appendFileSync(fileName, 'Course: Node.js\n'); //[cite: 1]
console.log('Course name appended.'); //[cite: 1]
console.log('\nFile contents:'); //[cite: 1]
console.log(fs.readFileSync(fileName, 'utf8')); //[cite: 1]
fs.renameSync(fileName, 'student-renamed.txt'); //[cite: 1]
console.log('File renamed successfully.'); //[cite: 1]

console.log('\n========== TASK 3: DIRECTORY OPERATIONS ==========');
const folder = 'uploads'; //[cite: 1]
if (!fs.existsSync(folder)) {
  fs.mkdirSync(folder); //[cite: 1]
  console.log('Folder created.'); //[cite: 1]
}
fs.writeFileSync(`${folder}/file1.txt`, ''); //[cite: 1]
fs.writeFileSync(`${folder}/file2.txt`, ''); //[cite: 1]
fs.writeFileSync(`${folder}/file3.txt`, ''); //[cite: 1]
console.log('3 files created.'); //[cite: 1]

let files = fs.readdirSync(folder); //[cite: 1]
console.log('\nFiles in uploads:'); //[cite: 1]
files.forEach(file => console.log(file)); //[cite: 1]

files.forEach(file => fs.unlinkSync(`${folder}/${file}`)); //[cite: 1]
console.log('\nAll files deleted.'); //[cite: 1]

console.log('\n========== TASK 4: PATH MODULE ==========');
const filePath = '/home/user/data/report.pdf'; //[cite: 1]
console.log('Directory:', path.dirname(filePath)); //[cite: 1]
console.log('Base name:', path.basename(filePath)); //[cite: 1]
console.log('Extension:', path.extname(filePath)); //[cite: 1]
console.log('Absolute path:', path.resolve(filePath)); //[cite: 1]

console.log('\n========== TASK 5: OS MODULE REPORT ==========');
console.log('Platform:', os.platform()); //[cite: 1]
console.log('Architecture:', os.arch()); //[cite: 1]
console.log('Total Memory:', os.totalmem(), 'bytes'); //[cite: 1]
console.log('Free Memory:', os.freemem(), 'bytes'); //[cite: 1]
console.log('Number of CPUs:', os.cpus().length); //[cite: 1]
console.log('System Uptime:', os.uptime(), 'seconds'); //[cite: 1]

console.log('\n========== TASK 6: EVENTS MODULE ==========');
const orderEmitter = new EventEmitter(); //[cite: 1]
orderEmitter.on('orderPlaced', (order) => {
  console.log('Order placed successfully!'); //[cite: 1]
  console.log('Order ID:', order.id); //[cite: 1]
  console.log('Item:', order.item); //[cite: 1]
  console.log('Amount:', order.amount); //[cite: 1]
}); //[cite: 1]
orderEmitter.emit('orderPlaced', { id: 101, item: 'Laptop', amount: 55000 }); //[cite: 1]

console.log('\n========== TASK 9: READING A LARGE FILE WITH STREAMS ==========');
const streamFile = 'data.txt'; //[cite: 1]
let content = ''; //[cite: 1]
for (let i = 1; i <= 50; i++) {
  content += `This is line number ${i}\n`; //[cite: 1]
}
fs.writeFileSync(streamFile, content); //[cite: 1]
console.log('data.txt created with 50 lines.'); //[cite: 1]

const readStream = fs.createReadStream(streamFile, { encoding: 'utf8' }); //[cite: 1]
let totalData = ''; //[cite: 1]
readStream.on('data', (chunk) => {
  console.log('Chunk received:', chunk.length, 'characters'); //[cite: 1]
  totalData += chunk; //[cite: 1]
}); //[cite: 1]
readStream.on('end', () => {
  console.log('\nFinished reading file.'); //[cite: 1]
  console.log('Total characters received:', totalData.length); //[cite: 1]
  startServer();
}); //[cite: 1]
readStream.on('error', (err) => console.log('Error:', err.message)); //[cite: 1]

console.log('\n========== TASK 10: UNIQUE ID GENERATION ==========');
function generateUniqueId(length = 21) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
for (let i = 1; i <= 5; i++) {
  console.log(`Unique ID ${i}: ${generateUniqueId()}`); //[cite: 1]
}

console.log('\n========== TASK 11: COMMAND-LINE ARGUMENTS ==========');
const args = process.argv.slice(2); //[cite: 1]
const num1 = parseFloat(args[0]) || 10; //[cite: 1]
const num2 = parseFloat(args[1]) || 5; //[cite: 1]
const operator = args[2] || '+'; //[cite: 1]
let calcResult;

switch (operator) {
  case '+': calcResult = num1 + num2; break; //[cite: 1]
  case '-': calcResult = num1 - num2; break; //[cite: 1]
  case '*': calcResult = num1 * num2; break; //[cite: 1]
  case '/': calcResult = num2 !== 0 ? num1 / num2 : 'Cannot divide by zero'; break; //[cite: 1]
  default: calcResult = 'Invalid operator'; //[cite: 1]
}
console.log(`Calc CLI -> Arguments: [${num1}, ${num2}, '${operator}'] | Result:`, calcResult); //[cite: 1]

function startServer() {
  console.log('\n========== TASKS 7, 8, & 12: HTTP SERVER COMBINED ==========');
  const PORT = process.env.PORT || 3000; //[cite: 1]

  const students = [
    { id: 1, name: 'Rahul', course: 'Node.js' }, //[cite: 1]
    { id: 2, name: 'Priya', course: 'JavaScript' }, //[cite: 1]
    { id: 3, name: 'Aman', course: 'Web Development' } //[cite: 1]
  ]; //[cite: 1]

  const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true); //[cite: 1]
    const pathname = parsedUrl.pathname; //[cite: 1]

    if (req.method === 'GET' && pathname === '/') {
      res.writeHead(200, { 'Content-Type': 'application/json' }); //[cite: 1]
      res.end(JSON.stringify({ message: `Welcome! Server running on port ${PORT}` })); //[cite: 1]
    } else if (req.method === 'GET' && pathname === '/students') {
      res.writeHead(200, { 'Content-Type': 'application/json' }); //[cite: 1]
      res.end(JSON.stringify(students)); //[cite: 1]
    } else if (req.method === 'GET' && pathname.startsWith('/students/')) {
      const id = parseInt(pathname.split('/')[2]); //[cite: 1]
      const student = students.find(s => s.id === id); //[cite: 1]
      res.writeHead(student ? 200 : 404, { 'Content-Type': 'application/json' }); //[cite: 1]
      res.end(JSON.stringify(student || { error: 'Student not found' })); //[cite: 1]
    } else if (pathname === '/search') {
      const keyword = parsedUrl.query.keyword || ''; //[cite: 1]
      res.writeHead(200, { 'Content-Type': 'text/plain' }); //[cite: 1]
      res.end(`You searched for: ${keyword}`); //[cite: 1]
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' }); //[cite: 1]
      res.end(JSON.stringify({ error: '404 - Route not found' })); //[cite: 1]
    }
  }); //[cite: 1]

  server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`); //[cite: 1]
    console.log('Available routes:');
    console.log(` - http://localhost:${PORT}/`);
    console.log(` - http://localhost:${PORT}/students`);
    console.log(` - http://localhost:${PORT}/students/1`);
    console.log(` - http://localhost:${PORT}/search?keyword=NodeJS`);
  }); //[cite: 1]
}