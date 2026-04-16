const pool = require('../db');

const createTask = async (req, res) => {
    const { title, description, priority, deadline, team_id } = req.body;
    
    // req.user was added by our Middleware! 
    // This tells the DB exactly which user owns this task.
    const assigned_to = req.user; 

    try {
        const newTask = await pool.query(
            'INSERT INTO tasks (title, description, priority, deadline, assigned_to, team_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [title, description, priority || 'Medium', deadline, assigned_to, team_id]
        );

        res.status(201).json(newTask.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error while creating task");
    }
};

const getTasks = async (req, res) => {
    try {
        // We only get tasks where assigned_to matches the logged-in user
        const allTasks = await pool.query(
            'SELECT * FROM tasks WHERE assigned_to = $1', 
            [req.user]
        );
        res.json(allTasks.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error while fetching tasks");
    }
};

const deleteTask = async (req, res) => {
    const { id } = req.params; // We get the ID from the URL (e.g., /api/tasks/5)

    try {
        const deletedTask = await pool.query(
            'DELETE FROM tasks WHERE task_id = $1 AND assigned_to = $2 RETURNING *',
            [id, req.user]
        ); // The and assigned_to = $2 ensures only the owner of a task can delete it

        if (deletedTask.rows.length === 0) {
            return res.status(404).json({ message: "Task not found or unauthorized" });
        }

        res.json({ message: "Task deleted successfully!" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
};

const updateTask = async (req, res) => {
    const { id } = req.params;
    const { title, description, priority, status } = req.body;

    try {
        const updatedTask = await pool.query(
            'UPDATE tasks SET title = $1, description = $2, priority = $3, status = $4 WHERE task_id = $5 AND assigned_to = $6 RETURNING *',
            [title, description, priority, status, id, req.user]
        );

        if (updatedTask.rows.length === 0) {
            return res.status(404).json({ message: "Task not found or unauthorized" });
        }

        res.json(updatedTask.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
};

// Update the export
module.exports = { createTask, getTasks, deleteTask, updateTask };