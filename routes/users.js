const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const User = require('../models/User');

// Get all peer support users
router.get('/', auth, async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});


// Get all peer support users
router.get('/peer', auth, async (req, res) => {
    try {
        const peers = await User.find({
            userType: "Peer"
        });

        res.json(peers);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
