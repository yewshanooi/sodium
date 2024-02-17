const { Schema, model } = require('mongoose');
const logItemSchema = new Schema({
    _id: Schema.Types.ObjectId,
    type: String,
    userName: { type: String, default: null },
    userId: String,
    modName: String,
    modId: String,
    duration: { type: String, default: null },
    reason: String,
    timestamp: String
});

module.exports = model('LogItem', logItemSchema, 'logitems');