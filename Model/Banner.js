const mongoose = require("mongoose");

const banner= new mongoose.Schema({
    Title:{
        type:String,
        require:true
    },
    Image:{
        type:String,
        required:true
    },
    Text:{
        type:String,
        require:true
    }
})
const model= mongoose.model("Banner",banner)
module.exports=model