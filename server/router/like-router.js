const express = require('express');
const router = express.Router();
const likeController = require('../controller/like-controller');

// Toggle like status for a blog post
router.post('/', likeController.like);
// router.delete('/unlike', likeController.unlike);
router.post('/totallike', likeController.likeOfblog);
router.get('/:user/liked', likeController.user_likedBlogs);

module.exports = router;
