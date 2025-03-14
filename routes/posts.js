//routes/posts.js

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Post = require('../models/Post');

// Get all posts
router.get('/', auth, async (req, res) => {
    try {
        const posts = await Post.find({}).sort({ createdAt: -1 });
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Create a post
router.post('/', auth, async (req, res) => {
    try {
        const newPost = new Post({
            userId: req.user.id,
            text: req.body.text,
            anonymous: req.body.anonymous
        });

        const post = await newPost.save();
        res.status(201).json(post);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update a post
router.put('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            { $set: req.body },
            { new: true }
        );

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.json(post);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete a post
router.delete('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.json({ message: 'Post removed' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;