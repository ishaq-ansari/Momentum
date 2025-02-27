// routes/auth.js

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const nodemailer = require('nodemailer');

router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        let user = await User.findOne({ $or: [{ email }, { username }] });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        user = new User({
            username,
            email,
            password: await bcrypt.hash(password, 10)
        });

        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user._id },
            'your_jwt_secret',
            { expiresIn: '24h' }
        );

        res.json({ token });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Add password reset endpoint
router.post('/reset-password', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate reset token
        const resetToken = jwt.sign(
            { userId: user._id },
            'password_reset_secret',
            { expiresIn: '1h' }
        );

        // Store the reset token in the user document with an expiry
        user.resetToken = resetToken;
        user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
        await user.save();

        // Send email with reset link
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Password Reset',
            text: `You requested a password reset. Click the link to reset your password: ${req.headers.origin}/reset-password/${resetToken}`
        };

        await transporter.sendMail(mailOptions);

        res.json({ message: 'Password reset link sent to your email' });
    } catch (err) {
        console.error('Password reset error:', err);
        res.status(500).json({ message: 'Server error processing password reset' });
    }
});

// Define an endpoint to actually reset the password with the token
router.post('/reset-password/:token', async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    try {
        const decoded = jwt.verify(token, 'password_reset_secret');
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Clear reset token fields if you added them
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;
        user.password = newPassword; // Assuming you have a method to hash the password
        await user.save();

        res.json({ message: 'Password has been successfully reset' });
    } catch (err) {
        console.error('Password reset error:', err);
        res.status(500).json({ message: 'Server error processing password reset' });
    }
});

module.exports = router;
