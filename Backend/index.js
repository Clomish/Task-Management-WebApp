const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// --- DATABASE CONNECTION ---
const pool = new Pool({
  user: 'postgres',
  host: '127.0.0.1',
  database: 'task_db',
  password: '12345678', // Your password
  port: 5432,
});

// --- 1. THE LOGIN ROUTE ---
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  console.log("--- Login Attempt Received ---");

  try {
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (user.rows.length === 0) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Direct password check
    if (user.rows[0].password === password) {
      const token = jwt.sign({ id: user.rows[0].id }, 'your_jwt_secret', { expiresIn: '1h' });
      console.log(`✅ Login Success: ${email}`);
      res.json({ token, message: 'Login Successful!' });
    } else {
      console.log("❌ Login Failed: Incorrect Password");
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (err) {
    console.error("❌ Database Error:", err.message);
    res.status(500).send('Server Error');
  }
});

// --- 2. THE GET TASKS ROUTE ---
app.get('/api/tasks', async (req, res) => {
  try {
    console.log("📥 Request received: Fetching tasks...");
    const result = await pool.query('SELECT * FROM tasks ORDER BY created_at DESC');
    
    // This sends the data that shows up as [] in your browser if empty
    res.json(result.rows);
    console.log(`📤 Sent ${result.rows.length} tasks to the frontend.`);
  } catch (err) {
    console.error("❌ Task Fetch Error:", err.message);
    res.status(500).json({ error: "Could not fetch tasks" });
  }
});

// --- 3. THE ADD TASK ROUTE ---
// Check that this is app.post
app.post('/api/tasks', async (req, res) => {
  const { title, description, priority } = req.body;

  try {
    // We force a default if priority is missing or weird
    const safePriority = priority || 'Medium'; 
    
    const newTask = await pool.query(
      'INSERT INTO tasks (title, description, priority, status) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, description, safePriority, 'pending']
    );

    res.json(newTask.rows[0]);
  } catch (err) {
    console.error("❌ SQL Error:", err.message);
    res.status(500).json({ error: "Database rejected the task. Check your column constraints!" });
  }
});

app.delete('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
    res.json({ message: "Task deleted successfully" });
    console.log(`🗑️ Deleted task ID: ${id}`);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// --- 4. THE UPDATE TASK ROUTE ---
app.put('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const updatedTask = await pool.query(
      'UPDATE tasks SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    res.json(updatedTask.rows[0]);
    console.log(`✅ Task ${id} marked as ${status}`);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// --- SERVER START ---
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 BACKEND SERVER RUNNING ON PORT ${PORT}`);
  console.log('🔗 Connected to PostgreSQL (task_db)');
});