const mongoose = require('mongoose')
const User = new mongoose.Schema({
    firstname:{
        type:String,
        required:true
    },
    secondname:{
        type:String,
        required:true
    },

    email:{
        type:String,
        required:true,
        unique:true
    },

    password:{
        type:String,
    },

    image:{
        type:String,
        default:''
        
    },
    isadmin:{
        type:String,
        default:'false'
    }

    
})
const model = mongoose.model('adminData',User)
module.exports = model