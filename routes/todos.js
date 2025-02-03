// routes/todos.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Todo = require('../models/Todo');

// Get all todos
router.get('/', auth, async (req, res) => {
    try {
        const todos = await Todo.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(todos);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Create todo
router.post('/', auth, async (req, res) => {
    try {
        const newTodo = new Todo({
            text: req.body.text,
            userId: req.user.id
        });

        const todo = await newTodo.save();
        res.status(201).json(todo);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update todo
router.put('/:id', auth, async (req, res) => {
    try {
        const todo = await Todo.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            { $set: req.body },
            { new: true }
        );

        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        res.json(todo);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete todo
router.delete('/:id', auth, async (req, res) => {
    try {
        const todo = await Todo.findOneAndDelete({ 
            _id: req.params.id,
            userId: req.user.id
        });

        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        res.json({ message: 'Todo removed' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;