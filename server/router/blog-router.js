const express = require('express');
const {blogs,blogform,approvedBlogs,getfullblog} = require('../controller/blog-controller');
// const authMiddleware = require('../middlewares/auth-middleware')

const router = express.Router();

router.route('/blog').get(blogs);

router.route('/addblog').post(blogform);


router.route("/approvedblog").get(approvedBlogs);

// router.route("/approvedblog/:id").get(getfullblog);

router.route("/blog/:id").get(getfullblog);

module.exports = router;