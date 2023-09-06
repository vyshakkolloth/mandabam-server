const mongoose = require('mongoose')
const User = new mongoose.Schema({
    name:{
        type:String,
        
        
    },
     email:{
        type:String,
        
        
    },
    phone:{
        type:String,
        
        
    },

    password:{
        type:String,
    },

    image:{
        type:String,
        default:''
        
    },
    blocked:{
        type:Boolean,
        default:false,
    }
    ,loggedType:{
        type:String,
        enum: ["google","otp","email"],
    }

    
})
const model = mongoose.model('userdata',User)
module.exports = model