const mongoose = require('mongoose');

const PostSchema = mongoose.Schema({
    user: {
        type: String,
        unique: false,
        required: true,
        trim: true
    },
    content: {
        type: String,
        unique: false,
        required: true,
        trim: true
    },
    image: {
        type: String,
        unique: false,
        required: false
    },
    date: {
        type: Date,
        unique: false,
        required: true,
    },
    userpfp:{
        type: String,
        unique: false,
        required: true
    }
});

const Post = mongoose.model('post', PostSchema);
module.exports = Post;