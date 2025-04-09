// routes/auth.js

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const nodemailer = require('nodemailer');
const { sendEmail } = require('../utils/email');
const config = require('../config/config');
const { validateRegistration, validateLogin } = require('../middleware/validation');
const crypto = require('crypto');

router.post('/register', validateRegistration, async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                error: existingUser.email === email ? 'Email already registered' : 'Username already taken'
            });
        }

        // Create new user
        const user = new User({
            username,
            email,
            password
        });

        // Generate verification token
        const verificationToken = user.generateVerificationToken();
        await user.save();

        // Send verification email
        const verificationUrl = `${req.headers.origin}/verify-email/${verificationToken}`;
        await sendEmail({
            to: user.email,
            subject: 'Verify your email',
            text: `Please click the following link to verify your email: ${verificationUrl}`
        });

        res.status(201).json({
            success: true,
            message: 'Registration successful. Please check your email to verify your account.'
        });
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({
            success: false,
            error: 'Error during registration'
        });
    }
});

router.post('/login', validateLogin, async (req, res) => {
    try {
        console.log('Login attempt with data:', { 
            email: req.body.email,
            username: req.body.username,
            hasPassword: !!req.body.password 
        });
        
        const { email, username, password } = req.body;
        
        // Find user by email or username and include password field
        let user;
        if (email) {
            console.log('Attempting to find user by email');
            user = await User.findOne({ email }).select('+password');
        } else if (username) {
            console.log('Attempting to find user by username');
            user = await User.findOne({ username }).select('+password');
        } else {
            console.log('Neither email nor username provided');
            return res.status(400).json({
                success: false,
                error: 'Email or username is required'
            });
        }

        if (!user) {
            console.log('No user found with provided credentials');
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
        }
        
        console.log('User found:', { userId: user._id, username: user.username });

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            console.log('Password does not match');
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
        }
        
        console.log('Password matched successfully');

        // TEMPORARILY DISABLED EMAIL VERIFICATION CHECK
        // if (!user.isVerified) {
        //     console.log('User email is not verified');
        //     return res.status(401).json({
        //         success: false,
        //         error: 'Please verify your email before logging in'
        //     });
        // }
        
        console.log('Proceeding with login (verification check disabled for testing)');

        // Update last login
        user.lastLogin = Date.now();
        await user.save();

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id },
            config.JWT_SECRET,
            { expiresIn: config.JWT_EXPIRES_IN }
        );
        
        console.log('Login successful, token generated');

        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({
            success: false,
            error: 'Error during login'
        });
    }
});

// Verify email
router.get('/verify-email/:token', async (req, res) => {
    try {
        const { token } = req.params;
        const hashedToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        const user = await User.findOne({
            verificationToken: hashedToken,
            verificationTokenExpiry: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                error: 'Invalid or expired verification token'
            });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiry = undefined;
        await user.save();

        res.json({
            success: true,
            message: 'Email verified successfully'
        });
    } catch (err) {
        console.error('Email verification error:', err);
        res.status(500).json({
            success: false,
            error: 'Error verifying email'
        });
    }
});

// Request password reset
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        const resetToken = user.generateResetToken();
        await user.save();

        const resetUrl = `${req.headers.origin}/reset-password/${resetToken}`;
        await sendEmail({
            to: user.email,
            subject: 'Password Reset Request',
            text: `Click the following link to reset your password: ${resetUrl}`
        });

        res.json({
            success: true,
            message: 'Password reset link sent to your email'
        });
    } catch (err) {
        console.error('Password reset request error:', err);
        res.status(500).json({
            success: false,
            error: 'Error processing password reset request'
        });
    }
});

// Reset password
router.post('/reset-password/:token', async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const hashedToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        const user = await User.findOne({
            resetToken: hashedToken,
            resetTokenExpiry: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                error: 'Invalid or expired reset token'
            });
        }

        user.password = password;
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;
        await user.save();

        res.json({
            success: true,
            message: 'Password reset successfully'
        });
    } catch (err) {
        console.error('Password reset error:', err);
        res.status(500).json({
            success: false,
            error: 'Error resetting password'
        });
    }
});

module.exports = router;
