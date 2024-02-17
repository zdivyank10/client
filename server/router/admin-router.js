const express = require('express');
const router = express.Router();
const adminController = require('../controller/admin-controller');
const authMiddleware = require('../middlewares/auth-middleware');

router.route("/users").get(authMiddleware,adminController.getAllUsers);

router.route("/contactus").get(authMiddleware,adminController.getAllContacts);

router.route("/users/delete/:id").delete(authMiddleware,adminController.deleteUserById);

router.route("/users/:id").get(authMiddleware,adminController.getUserById);

router.route("/blog/:blogId/permission").put(authMiddleware,adminController.updateBlogPermission);

module.exports = router;