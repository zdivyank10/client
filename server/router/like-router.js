const express = require('express');
const router = express.Router();
const likeController = require('../controller/like-controller');

// Toggle like status for a blog post
router.post('/', likeController.like);
router.delete('/unlike', likeController.unlike);
router.get('/totallike', likeController.likeOfblog);

module.exports = router;
