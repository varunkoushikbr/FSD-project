const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    title: {
        type: String,
        required: [true, 'Please add a task title']
    },
    completed: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['pending', 'in-progress', 'completed'],
        default: 'pending'
    },
    date: {
        type: Date,
        default: Date.now
    },
    estimatedTime: {
        type: Number, // in minutes
        default: 0
    },
    actualTime: {
        type: Number, // in minutes
        default: 0
    },
    startTime: {
        type: Date,
        default: null
    },
    points: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Task', taskSchema);
