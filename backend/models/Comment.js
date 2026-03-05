const mongoose = require('mongoose');

const CommentSchema = mongoose.Schema({
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
    postId:{
        type: String,
        unique: false,
        required: true
    }
});

const Post = mongoose.model('comment', CommentSchema);
module.exports = Post;