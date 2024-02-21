const express = require('express');
const router = express.Router();
const likeController = require('../controller/like-controller');

// Toggle like status for a blog post
router.post('/:blogId/like', likeController.toggleLike);

module.exports = router;
