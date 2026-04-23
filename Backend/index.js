const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken'); // You'll need this for tokens
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: 'postgres',
  host: '127.0.0.1',
  database: 'task_db',
  password: '12345678', // Actual password
  port: 5432,
});

// --- THE LOGIN ROUTE ---
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

// SPY LOGS
  console.log("--- Login Attempt ---");
  console.log("Browser sent Email:", email);
  console.log("Browser sent Password:", password);

  try {
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (user.rows.length === 0) {
      return res.status(401).json({ message: 'User not found' });
    }

console.log("Database found User:", user.rows[0].email);
console.log("Database found Password:", user.rows[0].password);

    // Direct password check (In production, use bcrypt.compare)
    if (user.rows[0].password === password) {
      // Create a "token" so the frontend knows we are logged in
      const token = jwt.sign({ id: user.rows[0].id }, 'your_jwt_secret', { expiresIn: '1h' });
      
      console.log(`✅ User logged in: ${email}`);
      res.json({ token, message: 'Login Successful!' });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log('🔗 Connected to task_db');
});