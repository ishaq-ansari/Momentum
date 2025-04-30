// models/User.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
        minlength: [3, 'Username must be at least 3 characters long'],
        maxlength: [30, 'Username cannot exceed 30 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters long'],
        select: false // Don't return password in queries by default
    },
    role: {
        type: String,
        enum: ['user', 'professional', 'admin'],
        default: 'user'
    },
    // New profile fields
    bio: {
        type: String,
        maxlength: [500, 'Bio cannot exceed 500 characters']
    },
    location: {
        type: String,
        maxlength: [100, 'Location cannot exceed 100 characters']
    },
    occupation: {
        type: String,
        maxlength: [100, 'Occupation cannot exceed 100 characters']
    },
    preferences: {
        emailNotifications: {
            type: Boolean,
            default: true
        },
        darkMode: {
            type: Boolean,
            default: false
        },
        notificationFrequency: {
            type: String,
            enum: ['immediate', 'daily', 'weekly', 'none'],
            default: 'immediate'
        }
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    resetToken: String,
    resetTokenExpiry: Date,
    verificationToken: String,
    verificationTokenExpiry: Date,
    lastLogin: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// Compare password method
UserSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Generate password reset token
UserSchema.methods.generateResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.resetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
    this.resetTokenExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
    return resetToken;
};

// Generate verification token
UserSchema.methods.generateVerificationToken = function() {
    const verificationToken = crypto.randomBytes(32).toString('hex');
    this.verificationToken = crypto
        .createHash('sha256')
        .update(verificationToken)
        .digest('hex');
    this.verificationTokenExpiry = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    return verificationToken;
};

module.exports = mongoose.model('User', UserSchema);