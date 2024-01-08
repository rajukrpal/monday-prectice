const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt")

const userSchema = new mongoose.Schema({
    userName:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
    },
    fullName:{
        type:String,
        required:true,
        uppercase:true,
        trim:true,
        index:true,
    },
    avatar:{
        type:String, // cloudnary url
        required:true,
    },
    coverImage:{
        type:String, // cloudnary url
    },
    watchHistory:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"video"
    }],
    password:{
        type:String,
        required:[true,'Password is required !'],
    },
    refreshToken:{
        type:String,

    }
},{timestamps:true})

userSchema.pre("save",async(next)=>{
    if(!this.isModified("password")) return next();

    this.password = bcrypt.hash(this.password,5)
    next();
})

userSchema.methods.isPasswordCorrect = async(password)=>{
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = async()=>{
    return await jwt.sign({
        _id: this._id,
        email: this.email,
        userName:this.userName,
        fullName:this.fullName
    },
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn:process.env.ACCESS_TOKEN_EXPIRY}
    )
}
userSchema.methods.generateRefreshToken = async()=>{
    return await jwt.sign({
        _id: this._id,
    },
        process.env.REFERSH_TOKEN_SECRET,
        {expiresIn:process.env.REFERSH_TOKEN_EXPIRY}
    )
}


const userModel = mongoose.model("user",userSchema);

module.exports = userModel ;