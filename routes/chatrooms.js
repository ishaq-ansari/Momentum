//routes/chatrooms.js

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const ChatRoom = require('../models/ChatRoom');

// Get all chat rooms
router.get('/', auth, async (req, res) => {
    try {
        const chatRooms = await ChatRoom.find({});
        res.json(chatRooms);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Create a chat room
router.post('/', auth, async (req, res) => {
    try {
        const newChatRoom = new ChatRoom({
            name: req.body.name,
            description: req.body.description,
            users: [req.user.id]
        });

        const chatRoom = await newChatRoom.save();
        res.status(201).json(chatRoom);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Join a chat room
router.put('/:id/join', auth, async (req, res) => {
    try {
        const chatRoom = await ChatRoom.findByIdAndUpdate(
            req.params.id,
            { $addToSet: { users: req.user.id } },
            { new: true }
        );

        if (!chatRoom) {
            return res.status(404).json({ message: 'Chat room not found' });
        }

        res.json(chatRoom);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Send a message in a chat room
router.post('/:id/messages', auth, async (req, res) => {
    try {
        const chatRoom = await ChatRoom.findById(req.params.id);

        if (!chatRoom) {
            return res.status(404).json({ message: 'Chat room not found' });
        }

        const newMessage = {
            userId: req.user.id,
            text: req.body.text
        };

        chatRoom.messages.push(newMessage);
        await chatRoom.save();

        res.json(newMessage);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;