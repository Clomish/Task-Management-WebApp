const express = require('express');
const router = express.Router();
const { createTask, getTasks, deleteTask, updateTask } = require('../controllers/taskController');
const auth = require('../middleware/authMiddleware'); // Import our Security Guard

// We add 'auth' as the second argument to protect this route!
router.post('/', auth, createTask);
router.get('/', auth, getTasks);
router.delete('/:id', auth, deleteTask);
router.put('/:id', auth, updateTask);

module.exports = router;