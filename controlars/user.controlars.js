const asyncHendlar = require("../utils/asyncHendlar");

const registerUser = asyncHendlar(async(req,res)=>{
        await res.status(200).json({
        message:"WEB DEVLOPER"
    })
})

module.exports = registerUser ;