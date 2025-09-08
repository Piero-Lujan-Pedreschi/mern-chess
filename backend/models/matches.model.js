import mongoose from 'mongoose';

const matchSchema = new mongoose.Schema({
    roomId: {
        type: String,
        required: true,

    },
    
    player1: {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },

        moves: {
            type: [String],
            default: [],
        },
    }, 

    player2: {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },

        moves: {
            type: [String],
            default: [],
        },
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
        enum: ['win', 'loss', 'draw', 'resign', 'timeout', 'abandoned', 'In Progress'],
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

const Match = mongoose.model('Match', matchSchema);
export default Match;