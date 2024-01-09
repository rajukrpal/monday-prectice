var express = require('express');
const registerUser = require('../controlars/user.controlars');
var router = express.Router();

router.route("/register").post(registerUser)
    


module.exports = router ;