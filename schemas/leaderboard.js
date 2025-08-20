const { Schema, model } = require('mongoose');
const leaderboardSchema = new Schema({
    _id: Schema.Types.ObjectId,
    user: {
        name: { type: String, default: null },
        id: String
    },
    points: { type: Number, default: null }
});

module.exports = model('Leaderboard', leaderboardSchema, 'leaderboards');