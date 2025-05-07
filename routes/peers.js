const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Peer = require('../models/Peer');
const User = require('../models/User');

// @route   GET /api/peers
// @desc    Get all approved peer supporters
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const peers = await Peer.find({ status: 'approved' })
            .select('-userId -connections')
            .sort({ rating: -1, sessions: -1 });
        res.json(peers);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/peers/apply
// @desc    Submit a peer supporter application
// @access  Private
router.post('/apply', auth, async (req, res) => {
    try {
        const { experience, topics, availability } = req.body;

        // Check if user already has a pending or approved application
        const existingPeer = await Peer.findOne({ userId: req.user.id });
        if (existingPeer) {
            return res.status(400).json({ 
                message: existingPeer.status === 'pending' 
                    ? 'You already have a pending application' 
                    : 'You are already a peer supporter' 
            });
        }

        // Get user's username
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Create new peer application
        const peer = new Peer({
            userId: req.user.id,
            username: user.username,
            experience,
            topics,
            availability
        });

        await peer.save();
        res.status(201).json({ message: 'Application submitted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/peers/:peerId/connect
// @desc    Send a connection request to a peer
// @access  Private
router.post('/:peerId/connect', auth, async (req, res) => {
    try {
        const peer = await Peer.findById(req.params.peerId);
        if (!peer) {
            return res.status(404).json({ message: 'Peer supporter not found' });
        }

        if (peer.status !== 'approved') {
            return res.status(400).json({ message: 'This peer supporter is not available' });
        }

        // Check if already connected
        if (peer.connections.includes(req.user.id)) {
            return res.status(400).json({ message: 'You are already connected with this peer' });
        }

        // Add user to connections array
        peer.connections.push(req.user.id);
        await peer.save();

        res.json({ message: 'Connection request sent successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/peers/me
// @desc    Get current user's peer status
// @access  Private
router.get('/me', auth, async (req, res) => {
    try {
        const peer = await Peer.findOne({ userId: req.user.id });
        if (!peer) {
            return res.status(404).json({ message: 'No peer application found' });
        }
        res.json(peer);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   PUT /api/peers/me/status
// @desc    Update peer status (admin only)
// @access  Private/Admin
router.put('/me/status', auth, async (req, res) => {
    try {
        const { status } = req.body;
        
        // Check if user is admin
        const user = await User.findById(req.user.id);
        if (!user.isAdmin) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const peer = await Peer.findOne({ userId: req.params.userId });
        if (!peer) {
            return res.status(404).json({ message: 'Peer application not found' });
        }

        peer.status = status;
        await peer.save();

        res.json({ message: 'Peer status updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 