const express = require('express');
const router = express.Router();
const adminController = require('../controller/admin-controller');
const authMiddleware = require('../middlewares/auth-middleware');
const validate = require('../middlewares/validate-middleware');
const {updateUserSchema } = require("../validators/auth-validator");


router.route("/users").get(authMiddleware,adminController.getAllUsers);

router.route("/contactus").get(authMiddleware,adminController.getAllContacts);

router.route("/users/delete/:id").delete(authMiddleware,adminController.deleteUserById);

router.route("/users/:id").get(authMiddleware,adminController.getUserById);

router.route("/blog/:blogId/permission").put(authMiddleware,adminController.updateBlogPermission);

router.route("/users/:id/update").put(authMiddleware,validate(updateUserSchema),adminController.updateUser);


router.route("/choice").put(authMiddleware,adminController.editorsChoice);
router.route("/alreadychoice").get(adminController.alreadyeditorsChoice);

module.exports = router;