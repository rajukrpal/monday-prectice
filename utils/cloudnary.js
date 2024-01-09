// import {v2 as cloudinary} from 'cloudinary';
const cloudinary = require('cloudinary').v2
const fs = require("fs");
          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCloudinary = async(localFilePath)=>{
  try {
    if (!localFilePath) {
      return null
    }
    // upload the file cloudnary..
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type:"auto"
    })
    // file has been uploaded successfully
    console.log("file is uploaded successfully",response.url)
    return response ;

  } catch (err) {
    fs.unlinkSync(localFilePath) // remove the locally saved femporary file as the upload opretion got failed
    return null
  }
}



exports = uploadOnCloudinary ;

// cloudinary.uploader.upload("https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg",
//   { public_id: "olympic_flag" }, 
//   function(error, result) {console.log(result); });