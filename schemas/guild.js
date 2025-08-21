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
    logs: [logSchema],
    steam: [
        {
            steamid: String,
            discord_id: String
        }
    ],
    language: {
        type: String,
        default: 'en'
    }
});

module.exports = model('Guild', guildSchema, 'guilds');