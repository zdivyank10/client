const Comment = require('../models/comment-model');
// const comment = require('../models/comment-model');

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
        console.log('Received blog post id:', blogid);

        const response = await Comment.findById(blogid);
        console.log('response', response);
        if (!response) {
            return res.status(404).json({ message: 'No Comment Found' });
        }
        
        return res.status(200).json({ message: response });
    } catch (error) {
        console.error('Error getting comment:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};


module.exports = {addcomment,getcomment};