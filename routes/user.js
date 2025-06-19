const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userController = require("../controllers/users.js");

router
    .route("/signup")
    .get(userController.getSignupRoute)
    .post(wrapAsync(userController.postSignupRoute));

router
    .route("/login")
    .get(userController.getLoginRoute)
    .post( saveRedirectUrl,
    passport.authenticate("local", { failureRedirect: '/login', failureFlash: true }),
    userController.postLoginRoute);
    
router.get("/logout", userController.logoutRoute);

module.exports = router;