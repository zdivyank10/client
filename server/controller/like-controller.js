// likeController.js

const blog = require('../models/blog-model'); // Import the Blog model
const Like = require('../models/like-model'); // Import the Blog model

// Controller function for liking a blog post
const like = async (req, res) => {
  const {blog,user} = req.body

  try {
    const newLike = await Like.create({
      blog,
      user,
  });
  console.log('Blog Liked successfully:', newLike);
  res.status(200).json({ message: 'Blog Liked successfully',newLike });
  } catch (error) {
    console.log('Error DOing Like',error);
  }
};
const unlike = async (req, res) => {
  const { blog, user } = req.body;

  try {
    const newunLike = await Like.findOneAndDelete({ user: user, blog: blog });
    if (newunLike) {
      console.log('Blog Unliked successfully:', newunLike);
      res.status(200).json({ message: 'Blog Unliked successfully', newunLike });
    } else {
      console.log('Blog not found or already unliked');
      res.status(404).json({ message: 'Blog not found or already unliked' });
    }
  } catch (error) {
    console.log('Error doing unlike:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


const likeOfblog = async (req, res) => {
  const { blog } = req.body;

  try {
    // Find and delete the like based on blogid and userid
    const totallike = await Like.find({ blog: blog }).countDocuments();

    if (!totallike) {
      // No likes found for the given blog
      return res.status(200).json({ totalLikes: 0 });
    }

    res.json(totallike);
  } catch (error) {
    console.log('Error removing like:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  like,unlike,likeOfblog
};
