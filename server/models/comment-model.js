const mongoose = require('mongoose');

const comment_schema = new mongoose.Schema({
    blogid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'blog',
        required: true
    },
   userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'mern_test', 
        required: true
    },
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Comment = mongoose.model('comment',comment_schema)

module.exports = Comment