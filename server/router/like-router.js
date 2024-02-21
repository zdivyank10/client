// In your backend server code
const express = require('express');
const router = express.Router();
const blog = require('../models/blog-model'); // Assuming you have a Post model

// Toggle like status for a post
router.post('/blog/:blogid/like', async (req, res) => {
  const postId = req.params.postId;

  try {
    // Find the post by ID
    const blog = await blog.findById(postId);

    // Toggle the like status
    blog.liked = !blog.liked;

    // Save the updated post
    await blog.save();

    res.json({ success: true, liked: blog.liked });
  } catch (error) {
    console.error('Error toggling like status:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

module.exports = router;
