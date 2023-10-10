const mongoose = require('mongoose')
const Booking = new mongoose.Schema({
    venueId:{
        type: mongoose.Schema.Types.ObjectId,
            ref: 'Venuedata',
            require: true
        
        
    },booking:[{
     userId:{
        type: mongoose.Schema.Types.ObjectId,
            ref: 'userdata',
            require: true   
        
    },
    name:{
        type:String,
        
        
    },

    email:{
        type:String,
    },

    guest:{
        type:String,
        default:''
        
    },
    type:{
        type:String,
        default:"",
        require:true
    }
    ,Phone:{
        type:String,
        require:true
        
    },room:{
        type:Number,
        require:true
    },
    time:{
        type:String,
         require:true
    },date:{
        type:Date
    },status:{
        type:Boolean,
        default:false
    },proceed:{
        type:Boolean,
        default:false
    },
    amount:{
        type:Number

    },payment:{
        type:Boolean,
        default:false

    },paymentId:{
        type:String
    },timestamp: {
        type: Date,
        default: Date.now
    }

},]

    
})
const model = mongoose.model('booking',Booking)
module.exports = model