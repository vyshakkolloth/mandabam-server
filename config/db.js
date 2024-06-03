// database===================
const mongoose = require('mongoose');


const connectDB= async()=>{

mongoose.set('strictQuery',true)
mongoose.connect(process.env.mongo).then(()=>console.log("mongoose connected")).catch((err)=>{
    console.log("DB error",err)
})

}
module.exports = connectDB