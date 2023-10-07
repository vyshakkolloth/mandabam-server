const mongoose = require("mongoose");
const Venue = new mongoose.Schema({
  show:{
    type:Boolean,
    default:false
  },adminAproved:{
type:Boolean
,default:false
  },
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    // unique:true
  },
  mobile: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },
  latitude: Number,
  longitude: Number,

  image: {
    type: Array,
    
  },contactPerson:{type:String},
  isBanned: { type: Boolean, default: false },
  information:{type:String},
  gathering:{type:String},
  parking:{type:String},
  type:{type:String},
  year:{type:String},
  application:{type:String},
  veg:{type:Number},
  nonVeg:{type:Number},
  typeFilter:{type:Array},
  catering:{type:String},
  decor:{type:String},
  alcohol:{type:String},
  dj:{type:String},
  timestamp: {
    type: Date,
    default: Date.now
}

});
const model = mongoose.model("Venuedata", Venue);
module.exports = model;
