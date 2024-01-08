// require('dotenv').config();
// const mongodb_url = require("/.env");
// const mongoose = require("mongoose")
// const dbConnect = async ()=>{
//     try {
//         await mongoose.connect(process.env.MONGODB_URL + "/showDBname")
//         console.log("db connected !!")
//     } catch (err) {
//         console.log("ERROR ",err)
//     }
// }
// module.exports = dbConnect ;

require('dotenv').config();
const mongoose = require("mongoose");

const dbConnect = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL + "/showDBname");
        console.log("db connected !!");
    } catch (err) {
        console.log("ERROR ", err);
    }
};

module.exports = dbConnect;


