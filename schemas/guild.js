const { Schema, model } = require('mongoose');
const leaderboardSchema = require('./leaderboard').schema;
const logSchema = require('./log').schema;

const guildSchema = new Schema({
    _id: Schema.Types.ObjectId,
    guild: {
        name: String,
        id: String
    },
    leaderboards: [leaderboardSchema],
    logs: [logSchema]
});

module.exports = model('Guild', guildSchema, 'guilds');