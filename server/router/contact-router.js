const express = require("express");
const router= express.Router();
const {contactForm,getContact} = require("../controller/contact-controller");

router.route("/contact").post(contactForm);
router.route("/contact").get(getContact);

module.exports = router;