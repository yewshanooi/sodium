const { Schema, model } = require('mongoose');
const logItemSchema = require('./logItem').schema;

const logSchema = new Schema({
    _id: Schema.Types.ObjectId,
    guild: {
        name: String,
        id: String
    },
    items: [logItemSchema]
});

module.exports = model('Log', logSchema, 'logs');