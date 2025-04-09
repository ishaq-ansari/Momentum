const mongoose = require('mongoose');

const peerSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    username: {
        type: String,
        required: true
    },
    topics: [{
        type: String,
        required: true,
        enum: ['anxiety', 'depression', 'stress', 'wellness', 'relationships']
    }],
    availability: {
        type: String,
        required: true,
        enum: ['weekday-mornings', 'weekday-evenings', 'weekends', 'flexible']
    },
    experience: {
        type: String,
        required: true
    },
    sessions: {
        type: Number,
        default: 0
    },
    rating: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    connections: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt timestamp before saving
peerSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Peer', peerSchema); 