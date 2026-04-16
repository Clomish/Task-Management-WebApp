const pool = require('./db');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// This allows your frontend to talk to your backend
app.use(cors());
// This allows your server to read JSON data sent in requests
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// A "Home" route to test if the server is alive
app.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()'); // Asks the DB for the current time
    res.send(`Database Connected! Server time: ${result.rows[0].now}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Database connection failed.');
  }
});

// Use the port from our .env file, or 5000 as a backup
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});