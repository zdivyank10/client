const express = require('express');
const {blogs,blogform,approvedBlogs,getfullblog, getblogbyuserid, myapprovedblogs, mynotapprovedblogs, mypendingblogs,updateBlog,deleteBlog} = require('../controller/blog-controller');
const authMiddleware = require('../middlewares/auth-middleware')

const router = express.Router();

router.route('/blog').get(blogs);

router.route('/addblog').post(blogform);


router.route("/approvedblog").get(approvedBlogs);

// router.route("/approvedblog/:id").get(getfullblog);

router.route("/blog/:id").get(getfullblog);

// got user blog by id
router.route("/:id").get(getblogbyuserid);
router.route("/:id/approved").get(myapprovedblogs);
router.route("/:id/notapproved").get(mynotapprovedblogs);
router.route("/:id/pending").get(mypendingblogs);
router.route("/:id/update").put(updateBlog);
router.route("/:id/delete").delete(deleteBlog);
module.exports = router;