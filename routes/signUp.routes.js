const express = require("express");
const signUpController = require("../controllers/signUp.controller");
const router = express.Router();

// @route GET && POST - /posts/
router
    .route("/status")
    .get(signUpController.signUpStatus);
router
    .route("/event")
    .post(signUpController.signUpEvent);

module.exports = router;