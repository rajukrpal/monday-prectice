const userModel = require("../models/userModel");
const ApiError = require("../utils/apiError");
const asyncHendlar = require("../utils/asyncHendlar");
const jwt = require("jsonwebtoken");





module.exports = verifyJWT = asyncHendlar(async(req,res,next)=>{
        try {
            const token = req.cookie?.accessToken || req.header("Authorization")?.replace("Beare ", "")
            if (!token) {
                throw new ApiError(401,"unauthorized requirest")
            }
            const decodedToken = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
            const user = await userModel.find(decodedToken?._id).select("-password -refreshToken")
            if(!user){
                throw new ApiError(401, "invailed Access Token")
            }
            req.user = user ;
            next();
        } catch (err) {
        throw new ApiError(401 , err?.message , "invailied")
       }
})