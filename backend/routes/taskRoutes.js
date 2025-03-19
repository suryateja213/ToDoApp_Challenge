const express = require('express');
const Task = require('../models/Task');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Get all tasks
router.get('/', authMiddleware, async (req, res) => {
  const tasks = await Task.find({ user: req.user.id });
  res.json(tasks);
});

// Create new task
router.post('/', authMiddleware, async (req, res) => {
  const { title } = req.body;
  const task = new Task({ title, user: req.user.id });
  await task.save();
  res.json(task);
});

// Update task title
router.put('/:id', authMiddleware, async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ message: 'Task not found' });

  // Ensure the task belongs to the logged-in user
  if (task.user.toString() !== req.user.id) return res.status(401).json({ message: 'Unauthorized' });

  const { title } = req.body;
  task.title = title || task.title; // Update the title if provided
  await task.save();
  res.json(task);
});

// Toggle task completion
router.put('/:id/toggle', authMiddleware, async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ message: 'Task not found' });

  if (task.user.toString() !== req.user.id) return res.status(401).json({ message: 'Unauthorized' });

  task.completed = !task.completed;
  await task.save();
  res.json(task);
});

// Delete task
router.delete('/:id', authMiddleware, async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ message: 'Task not found' });
  if (task.user.toString() !== req.user.id) return res.status(401).json({ message: 'Unauthorized' });

  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: 'Task deleted' });
});

module.exports = router;
