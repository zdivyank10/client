const Comment = require('../models/comment-model');
// const comment = require('../models/comment-model');
const mongoose = require('mongoose');
const { ObjectId } = require('mongoose').Types;

const addcomment = async(req,res)=>{
    try {
        const { blogid } = req.params;
        const {userid,content} = req.body;

        const newComment = new Comment({
            blogid, // Ensure blogid is correctly passed
            userid, // Ensure userid is correctly passed
            content, // Ensure content is correctly passed
          });
        await newComment.save();

        res.status(201).json({message: 'Comment added successfully', comment: newComment });
      

    } catch (error) {
        console.log('error adding cmt',error)
    }
}


const getcomment = async (req, res) => {
    try {
        const { blogid } = req.params;
        console.log('Received comment id:', blogid);

        // Validate blogid format
        if (!ObjectId.isValid(blogid)) {
            return res.status(400).json({ message: 'Invalid Blog ID' });
        }

        // Find comment by blogid and populate the 'userid' field to get 'username'
        const response = await Comment.find({ blogid: ObjectId.createFromHexString(blogid) });
        console.log(response);

        // Check if comment exists
        if (!response || response.length === 0) {
            return res.status(404).json({ message: 'No Comment Found' });
        }

        // Return comment
        return res.status(200).json({ message: response });
    } catch (error) {
        console.error('Error getting comment:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = {
    getcomment
};




// const getfullblog = async (req, res) => {
//     try {
//         const { id } = req.params; // Ensure that id is correctly received from the frontend
//         console.log('Received id:', id); // Log received id
//         // Fetch the blog post using the id parameter
//         const blogPost = await blog.findById(id).populate('author_id','username');
//         console.log('Full Blog Post:', blogPost); // Log the fetched blog post
//         if (!blogPost) {
//             console.log('Blog post not found for id:', id);
//             return res.status(404).json({ message: 'Blog post not found' });
//         }
//         res.json(blogPost);
//     } catch (error) {
//         console.error('Error fetching full blog post:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// };



module.exports = {addcomment,getcomment};