const { Schema, model } = require('mongoose');
const logItemSchema = require('./logItem').schema;

const logSchema = new Schema({
    _id: Schema.Types.ObjectId,
    guildName: String,
    guildId: String,
    items: [logItemSchema]
});

module.exports = model('Log', logSchema, 'logs');