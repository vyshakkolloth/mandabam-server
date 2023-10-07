const mongoose = require('mongoose')
const Report = new mongoose.Schema({
  
    venueId:{
        type: mongoose.Schema.Types.ObjectId,
            ref: 'Venuedata',
            require: true
        
        
    },Report:[{ 
        userid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"userdata",
        required:true
    },
        text:{
            type:String,
            required:true
        },
        
        timestamp: {
            type: Date,
            default: Date.now()
        }}
    ],
  

    
 
    
})
const model = mongoose.model('Report',Report)
module.exports = model