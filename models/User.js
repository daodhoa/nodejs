const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    two_fa_type: {
        type: Number,
        required: false
    },
    auth_secret: {
        type: String,
        required: false
    }
});

module.exports = mongoose.model('User', userSchema);