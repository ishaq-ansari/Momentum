//routes/posts.js

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Post = require('../models/Post');
const User = require('../models/User');

// Get all posts
router.get('/', auth, async (req, res) => {
    try {
        const posts = await Post.find({})
            .populate('userId', 'username') // Populate user info to get the username
            .sort({ createdAt: -1 });
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all peer support users
router.get('/users', auth, async (req, res) => {
    try {
        const users = await Post.find({});
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});


// Get all peer support users
router.get('/peer-support', auth, async (req, res) => {
    try {
        const peers = await Post.find({
            userType: "Peer"
        });

        res.json(peers);
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
