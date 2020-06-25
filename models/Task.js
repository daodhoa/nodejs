const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
    user_id: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    status: {
        type: Number,
        required: true,
        default: 0
    }
});

module.exports = mongoose.model('Task', taskSchema);