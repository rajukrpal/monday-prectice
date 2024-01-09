const asyncHendlar = require("../utils/asyncHendlar");
const ApiError = require("../utils/apiError")
const userModel = require("../models/userModel")
// const upload = require("../middilwere/multer.middilwer.js")
const uploadOnCloudinary = require("../utils/cloudnary");
const ApiResponse = require("../utils/ApiResp")

// const registerUser = asyncHendlar(async(req,res)=>{
//         await res.status(200).json({
//         message:"WEB DEVLOPER"
//     })
// })


const registerUser = asyncHendlar(async(req,res)=>{
    // 1) get user details from frontend -----> (use postman)
            // user detail (req.body) ke andar mil jati hai
            const {userName,email,fullName,password}  = req.body;
    console.log("email",email )
    // 2) validation -----> ( not empty )

    // if (fullName === "") {
    //     throw new ApiError(400,"fullName is required")
    // }

        if (
            [userName,email,fullName,password].some((fild)=>{
        return fild?.trim() === ""
            })
        ) {
            throw new ApiError(400, "All fild are required")
        }
    // 3) ckeck if user allrady exist  ----->  (email and username)
        const existedUser = await userModel.findOne({
            $or: [ {userName } , { email } ]
        })
        if (existedUser) {
            throw new ApiError(409, "user with email or userName already exists")
        }
    // 4) // chack file le rahe hai kya? ha to dekho chack for images chack for avatar
       const avatarLocalPath =  req.files?.avatar[0]?.path // multar ne jo path upload kiya hai wo mil jaye ga
       const coverImageLocalPath = req.files.coverImage[0]?.path;
       if (!avatarLocalPath) {
         throw new ApiError(400, "Avatar file is required")
       }
    // 5) upload then cloudinary
        const avatar = await uploadOnCloudinary(avatarLocalPath)
        const coverImage = await uploadOnCloudinary(coverImageLocalPath)
        if (!avatar) {
            throw new ApiError(409, "user with email or userName already exists")
        }
    // 6) cloudinary par success uplode huaa ki nahi 
    // 7) create user object - create  entry in db
        const user = await userModel.create({
            userName:toLowerCase(),
            email,
            fullName,
            password,
            avatar: avatar.url, // avtar 100% lena hai abhi ke liye to avtar.url likhahai 
            coverImage: coverImage?.url || "" // kyu ki ye fild required nahi thi
        })
        // 8) remove password and refresh tocen field from response
        const createdUser = await user.findById(user._id).select(
            "-password -refreshToken"
        )
        // 9) check for user creation
        if (!createdUser) {
            throw new ApiError(500, "server Error")
        }
    // 10) return (res)
    // res.status(200).json({createdUser})
    res.status(200).json(
        new ApiResponse(200,createdUser,"user registar successfully")
    )

})

module.exports = registerUser ;