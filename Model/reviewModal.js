const mongoose = require('mongoose')
const Review = new mongoose.Schema({
  
    venueId:{
        type: mongoose.Schema.Types.ObjectId,
            ref: 'Venuedata',
            require: true
        
        
    },reviews:[{ userid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"userdata",
        required:true
    },rating:{
type:Number
    },
        text:{
            type:String,
            required:true
        }
        ,amount:{
            type:Number,
            required:true
        } ,
        timestamp: {
            type: Date,
            default: Date.now()
        }}
    ],
  

    
 
    
})
const model = mongoose.model('Review',Review)
module.exports = model