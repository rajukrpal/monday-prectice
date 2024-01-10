const asyncHendlar = require("../utils/asyncHendlar");
const ApiError = require("../utils/apiError")
const userModel = require("../models/userModel")
// const upload = require("../middilwere/multer.middilwer.js")
const uploadOnCloudinary = require("../utils/cloudnary");
const ApiResponse = require("../utils/ApiResp")

const generateAccessAndRefreshTokens = async(userId)=>{
    try {
        const user = await userModel.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
            user.refreshToken = refreshToken ;
            await user.save({validateBeforeSkave: false})
            return {accessToken , refreshToken}
    } catch (err) {
        throw new ApiError(500 , " server failed ")
    }
}

// const registerUser = asyncHendlar(async(req,res)=>{
//         await res.status(200).json({
//         message:"WEB DEVLOPER"
//     })
// })


const registerUser = asyncHendlar(async(req,res)=>{
    // 1) get user details from frontend -----> (use postman)
            // user detail (req.body) ke andar mil jati hai
            const {userName,email,fullName,password}  = req.body;
            // console.log(req.body)
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
       // ------------------
        // const coverImageLocalPath = req.files?.coverImage[0]?.path;
        // ------------------------
        let coverImageLocalPath;
        if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
                coverImageLocalPath = req.files.coverImage[0].path
        }
        // console.log(req.files)
        if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
        }
        // console.log(avatarLocalPath) // public\temp\imgName.jpg
    // 5) upload then cloudinary
        const avatar = await uploadOnCloudinary(avatarLocalPath)

        const coverImage = await uploadOnCloudinary(coverImageLocalPath)
        if (!avatar) {
            throw new ApiError(409, "user with email or userName already exists")
        }
    // 6) cloudinary par success uplode huaa ki nahi 
    // 7) create user object - create  entry in db
        const user = await userModel.create({
            userName,
            email,
            fullName,
            password,
            avatar: avatar.url, // avtar 100% lena hai abhi ke liye to avtar.url likhahai 
            coverImage: coverImage?.url || "" // kyu ki ye fild required nahi thi
        })
        // console.log(user) // jo jo enter karege wo wo show hoga
        // 8) remove password and refresh tocen field from response
        const createdUser = await userModel.findById(user._id).select(
            "-password -refreshToken"
        )
        // 9) check for user creation
        if (!createdUser) {
            throw new ApiError(500, "server Error")
        }
    // 10) return (res)
    // res.status(200).json({createdUser})
    res.status(201).json(
        new ApiResponse(200 ,createdUser,"user registar successfully")
    )

})

// _________________________________________________________
// login user
const loginUser = asyncHendlar(async(req,res)=>{
        // 1) req.body se data le aao
        // 2) username or email kis ke base par login krwana hai ? ki dono ?
        // 3) find the user
        // 4) password chack
        // 5) access and refresh token gentet kar ke user ko bhejna hoga
        // 6) send cookies
        // 7) send res

        const {userName , email , password} = req.body ;
        if(!userName || !email){
            throw new ApiError(400 , "userName and email is required")
        }

        const user = await userModel.findOne({
            $or: [{userName} ,  {email}]
        })
        if (!user) {
            throw new ApiError(404 , "user does not exist")
        }
        const isPasswordValid = await user.isPasswordCorrect(password)
        if (!isPasswordValid) {
            throw new ApiError(401 , "Passwerd dose not meatch")
        }
        const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)

        const loggedInUser = await userModel.findById(user._id).select(
            "-password -refreshToken"
        )
            const option = {
                httpOnly:true,
                secure: true,
            }
            return res.status(200).cookie(
                "accessToken",accessToken,option
            ).cookie(
                "refreshToken",refreshToken,option
            ).json(
                new ApiResponse(200 , {user:loggedInUser,accessToken,refreshToken}, "user loggedIn Successfullu     ")
            )
})

// logout user
const logoutUser = asyncHendlar(async(req,res)=>{
        // cookies cleare karo
        await userModel.findByIdAndUpdate(
            req.user._id ,
            {
                $set: {
                    refreshToken:undefined
                }
            },{
                new:true
            }
        )
        const option = {
            httpOnly:true,
            secure: true,
        }
        res.status(200)
        .clearCookie("accessToken",option)
        .clearCookie("refreshToken",option)
        .json(new ApiResponse(200,{},"user logout successful"))
    })

module.exports = logoutUser ;

module.exports = loginUser ;
// _________________________________________________________________

module.exports = registerUser ;