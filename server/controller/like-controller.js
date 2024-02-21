// likeController.js

const blog = require('../models/blog-model'); // Import the Blog model

// Controller function for liking a blog post
const likePost = async (req, res) => {
  const { blogid } = req.params; // Extract blog ID from request parameters

  try {
    // Find the blog post by ID
    const blog = await blog.findById(blogid);

    // Toggle the like status
    blog.liked = !blog.liked;

    // Save the updated blog post
    await blog.save();

    res.json({ success: true, liked: blog.liked });
  } catch (error) {
    console.error('Error toggling like status:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// Controller function for disliking a blog post
const dislikePost = async (req, res) => {
  const { blogid } = req.params; // Extract blog ID from request parameters

  try {
    // Find the blog post by ID
    const blog = await blog.findById(blogid);

    // Toggle the like status (set to false to indicate dislike)
    blog.liked = false;

    // Save the updated blog post
    await blog.save();

    res.json({ success: true, liked: blog.liked });
  } catch (error) {
    console.error('Error toggling like status:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

module.exports = {
  likePost,
  dislikePost
};
