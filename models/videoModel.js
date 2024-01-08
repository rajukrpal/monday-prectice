const mongoose = require("mongoose");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate-v2")

const videoSchema = new mongoose.Schema({
    videoFile:{
        type:String, //cloudinary url
        required:true,
    },
    thumbnail:{
        type:String, //cloudinary url
        required:true,
    },
    title:{
        type:String, 
        required:true,
    },
    discription:{
        type:String, 
        required:true,
    },
    duration:{
        type:String, 
        required:true,
    },
    views:{
       type:Number,
       default:0,
    },
    isPublished:{
        type:Boolean,
        default:true,
    },
    ownar:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user   "
    }

},{timestamps:true})

videoSchema.plugin(mongooseAggregatePaginate)


const videoModel = mongoose.model("video",videoSchema);

module.exports = videoModel ;