const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
    blog: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'blog', // Assuming the name of your blog schema/model is 'Blog'
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'mern_test', // Assuming the name of your user schema/model is 'mern_test'
        required: true
    }
});

// Define collection name
const Like = mongoose.model('Like', likeSchema);

module.exports = Like;
