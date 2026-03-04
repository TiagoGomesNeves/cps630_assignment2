const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    password: {
        type: String,
        unique: false,
        required: true,
        trim: true
    }
});

const User = mongoose.model('user', UserSchema);
module.exports = User;