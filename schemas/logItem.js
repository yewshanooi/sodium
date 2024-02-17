const { Schema, model } = require('mongoose');
const logItemSchema = new Schema({
    _id: Schema.Types.ObjectId,
    type: String,
    user: {
        name: { type: String, default: null },
        id: String
    },
    mod: {
        name: String,
        id: String
    },
    duration: { type: String, default: null },
    reason: String,
    timestamp: String
});

module.exports = model('LogItem', logItemSchema, 'logitems');