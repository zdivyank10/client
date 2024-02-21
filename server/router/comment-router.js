const express = require('express');
const router = express.Router();
const commentController = require('../controller/comment-controller');
const authMiddleware = require('../middlewares/auth-middleware');

router.route('/:blogid/comment').post(commentController.addcomment);

router.route('/:blogid/comment').get(commentController.getcomment);

module.exports = router;
