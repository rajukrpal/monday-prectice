var express = require('express');
const registerUser = require('../controlars/user.controlars');
var router = express.Router();
const upload = require("../middilwere/multer.middilwer.js")
const loginUser = require("../controlars/user.controlars.js")
const logoutUser = require("../controlars/user.controlars.js");
const  verify  = require('jsonwebtoken');

router.route("/register").post(
    upload.fields([
        {
            name:"avatar",
            maxCount:1
        },{
            name:"coverImage",
            maxCount:1
        }
    ]),
    registerUser
    )
    
    router.route("/login").post(loginUser)

    // secured routes
    router.route("/logout").post(verify, logoutUser)
    


module.exports = router ;