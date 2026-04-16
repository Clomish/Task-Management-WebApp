const pool = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // 1. Added this tool

// REGISTRATION LOGIC
const registerUser = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userExists.rows.length > 0) return res.status(400).json({ message: "User exists" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await pool.query(
            'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING *',
            [username, email, hashedPassword]
        );
        res.status(201).json({ message: "User registered!", user: newUser.rows[0].username });
    } catch (err) {
        res.status(500).send("Server error");
    }
};

// LOGIN LOGIC (2. Added this whole section)
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (user.rows.length === 0) return res.status(400).json({ message: "Invalid Credentials" });

        const isMatch = await bcrypt.compare(password, user.rows[0].password_hash);
        if (!isMatch) return res.status(400).json({ message: "Invalid Credentials" });

        const token = jwt.sign(
            { userId: user.rows[0].user_id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ message: "Login successful!", token });
    } catch (err) {
        res.status(500).send("Server error");
    }
};

// 3. Make sure BOTH are exported here
module.exports = { registerUser, loginUser };