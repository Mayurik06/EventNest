const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EventTypeSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('EventType', EventTypeSchema);


