var express = require('express');
const registerUser = require('../controlars/user.controlars');
var router = express.Router();
const upload = require("../middilwere/multer.middilwer.js")

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
    


module.exports = router ;