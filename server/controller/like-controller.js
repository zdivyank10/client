// likeController.js

const blog = require('../models/blog-model'); // Import the Blog model
const Like = require('../models/like-model'); // Import the Blog model

// Controller function for liking a blog post
const toggleLike = async (req, res) => {
  const { blogId } = req.params;
  const { userId } = req.body;

  try {
    // Check if the user has already liked the blog post
    const existingLike = await Like.findOne({ blog_id: blogId, user_id: userId });

    if (existingLike) {
      // If the like exists, remove it (unlike)
      await existingLike.remove();
      res.json({ success: true, message: 'Unliked successfully' });
    } else {
      // If the like does not exist, create a new one (like)
      const newLike = new Like({ blog_id: blogId, user_id: userId });
      await newLike.save();
      res.json({ success: true, message: 'Liked successfully' });
    }
  } catch (error) {
    console.error('Error toggling like status:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};


// // Controller function for disliking a blog post
// const dislikePost = async (req, res) => {
//   const { blogid } = req.params; // Extract blog ID from request parameters

//   try {
//     // Find the blog post by ID
//     const blog = await blog.findById(blogid);

//     // Toggle the like status (set to false to indicate dislike)
//     blog.liked = false;

//     // Save the updated blog post
//     await blog.save();

//     res.json({ success: true, liked: blog.liked });
//   } catch (error) {
//     console.error('Error toggling like status:', error);
//     res.status(500).json({ success: false, error: 'Server error' });
//   }
// };

module.exports = {
  toggleLike,
  // dislikePost
};
