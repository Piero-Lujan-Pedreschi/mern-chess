import mongoose from 'mongoose';

const matchSchema = new mongoose.Schema({
    player1: {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },

        moves: {
            type: [String],
            default: [],
        }
    }, 

    player2: {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },

        moves: {
            type: [String],
            default: [],
        }
    },

    winner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },

    loser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },

    result: {
        type: String,
        enum: ['win', 'loss', 'draw', 'resign', 'timeout', 'abandoned'],
        default: 'In Progress',
    },

    eventHistory: {
        type: [String],
        default: ["Game Started"],
    },

    createdAt: {
        type: Date,
        default: Date.now,
    }
});