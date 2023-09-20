const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cloudinary= require("../config/config")
const uploader = require('cloudinary').v2
const fs = require("fs");

const venueModel = require("../Model/venueModel");
const BookingModel= require("../Model/bookingModel")
const ChatModel=require("../Model/chatSchema")

const signUp = async (req, res) => {
  try {
    const { Vname, state, email, phone, password } = req.body.data;
    const {latitude,longitude,name}=state

    // console.log(req.body.data)
    console.log(Vname)
    const nameregex = /\s/g;
    const emailregex = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
    // const mobileregex = /^[0-9]*$/;
    const passwordregex = /^[0-9]*$/;

    if (Vname.length <= 4) {
      res.json({ status: 400, message: "data name dont match requirment" });
    } else if (nameregex.test(Vname)) {
      res.json({ status: 400, message: "data dont name match requirment" });
    } else if (!emailregex.test(email)) {
      res.json({ status: 400, message: "data dont email match requirment" });
    } else if (phone.length <= 9) {
      res.json({ status: 400, message: "data dont mobile match requirment" });
    } else if (!passwordregex.test(password)) {
      res.json({ status: 400, message: "data dont pas match requirment" });
    } else if (password.length < 3) {
      res.json({ status: 400, message: "data dont pas 2match requirment" });
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password.trim(), salt);
      await venueModel.create({
        name:Vname,
        location: name,
        latitude,
        longitude,
        email,
        password: hashPassword,
        mobile: phone,
      });
      res.json({ status: 200 });
    }
  } catch (error) {
    res.status(500).json({status:401,message:error})
    console.log(error);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // console.log(email,password)

    const user = await venueModel.findOne({ email: email });
    if (user) {
      const match = await bcrypt.compare(password, user.password);
      console.log(match, " result");
      if (match) {
        if (!user.isBanned) {
          const UserId = user._id;
          const token = jwt.sign({ UserId }, process.env.JWT_SECRET_KEY, {
            expiresIn: 30000,
          });
          res.json({ status: 200, auth: true, token: token, result: user });
        } else {
          res.json({ status: 401, auth: false, message: "user is banned" });
        }
      } else {
        res.json({
          status: 401,
          auth: false,
          message: "user details does not match",
        });
      }
    } else {
      res.json({ status: 401, auth: false, message: "user does not exist" });
    }
  } catch (error) {
    res.status(500).json({ status: 500, message: "server error" ,error});
  }
};


const home = async (req, res) => {
  try {
    const data = req.body;
    res.json({ status: 200 });
  } catch (error) {
    console.log(error)
    res.status(500).json({ status: 500, message: "server error" ,error});
  }
};

const information = async (req, res) => {
  try {
    const id = req.Venue_id;
  const data = await venueModel.findById({ _id: id });
  // console.log(data);
  res.json({ message: "fine", status: 200, data: data });
  } catch (error) {
    res.status(500).json({  message: "server error" ,error});
  }
};

const postInformation = async (req, res) => {
try {
  const id = req.Venue_id;
  console.log(id);
  const {
    email,
    Brand,
    city,
    Contact,
    number,
    information,
    gathering,
    parking,
    type,
    year,
    application,
    veg,
    nonVeg,
    typeFilter,
    catering,
    decor,
    alcohol,
    dj,
  } = req.body.data;

  const update = await venueModel.findByIdAndUpdate(
    { _id: id },
    {
      $set: {
        contactPerson: Contact,
        information: information,
        gathering: gathering,
        parking: parking,
        type,
        year,
        application,
        veg,
        nonVeg,
        typeFilter,
        catering,
        decor,
        alcohol,
        dj,
      },
    }
  );
  // const userdata = await User.findByIdAndUpdate({ _id: id }, { $set: { name: req.body.name, email: req.body.email, mobilr: req.body.phone } })
  console.log(update);
  if (update) {
    res.json({ status: 200 });
  } else {
    res.json({ status: 401, message: "somthing with update" });
  }
} catch (error) {
  console.log(error)
  res.status(500).json({  message: "server error" ,error});
}
};


const VenueGallery=async(req,res)=>{
  try {
    const uploadedFiles = req.files;
    const id = req.Venue_id;
    let uploadedImages = [];
    // console.log(req.files)
    if (uploadedFiles) {
      for (const file of uploadedFiles) {
        const upload = await cloudinary.uploader.upload(file.path);
        uploadedImages.push(upload.secure_url);

        // Delete
        fs.unlinkSync(file.path);
      }
    }
// console.log(uploadedImages)
   const update= await venueModel.findByIdAndUpdate(id,{$push:{image:{$each:uploadedImages}}})
    // console.log(update)
    if(update){
      res.status(200).json({message:"all good"})
    }else{
      res.status(202).json({message:"not updated"})
    }
    
    
  } catch (error) {
    console.log(error)
    res.status(500).json({  message: "server error" ,error});
  }
}

const project = async (req, res) => {
  try {
    console.log(req.body.data);
    const id = req.Venue_id;
    const requestData = req.body.data;
    // console.log(requestData);

    const update = await venueModel.findByIdAndUpdate(
      { _id: id },
      {
        $push: { image: { $each: requestData } }// $set: { image: requestData },
      }
    );

    if (update) {
      res.json({ status: 200, message: "Data stored successfully" });
    } else {
      res.json({ status: 405, message: "Data stored failed" });
    }
  } catch (error) {
    console.log(error);
    res.json({ status: 405, message: error });
  }
};

const getImages = async (req, res) => {
  try {
    const id = req.Venue_id;
    const venuesWithImages = await venueModel.findById(id, 'image'); // Retrieve only the 'image' field
    // console.log(venuesWithImages,"+++++")
    res.json({ status: 200, images: venuesWithImages });
  } catch (error) {
    console.log(error);
    res.json({ status: 405, message: error });
  }
};


const booking = async(req,res)=>{
  try {
    const id = req.Venue_id;
    const currentDate = new Date();
    const data=await  BookingModel.find({venueId:id,date: { $gte: currentDate },payment:false})
    // console.log(data)
    if(data){
      res.status(200).json({data})
    }else{
      res.status(402).json({message:"not found"})
    }
   

    
  } catch (error) {
    console.log(error)
    res.status(402).json({message:" error in booking"})
  }
}
const changeBooking=async(req,res)=>{
  try {
    
    const id = req.params.id;
    const result = await BookingModel.findById(id)
    if (result) {
      // Check if a result was found
      const newStatus = !result.status; // Toggle the status

      await BookingModel.findByIdAndUpdate(id, { $set: { "status": false ,amount:""} });
      res.json({ status: 200, message: "Booking status changed" });
    } else {
      res.status(404).json({ message: "Booking not found" });
    }
  } catch (error) {
    console.log(error)
    res.status(402).json({message:" error in booking", error})
  }
}


const authVenue=async (req,res)=>{
  try {
    const id = req.Venue_id;
    // console.log("first")
    const result= await venueModel.findById(id)

    if(result){
      // console.log(result,+"464654")
      if(result.blocked){
        res.json({ auth: false, status: "error", message:"user is banned" });
      }else{
        res.json({
          auth: true,data:result
        })
      }

    }


  } catch (error) {
    console.log(error)
    res.status(500).json({message:" error in booking", error})
  }
}

const userList= async(req,res)=>{
  try {
    const id = req.Venue_id;
    const result= await ChatModel.find({venue:id}).populate({
      path: "user",
      select: "name" 
    })
    // console.log(result,"res");
    res.status(200).json({message:"je",data:result})
    // console.log("object");

    
  } catch (error) {
     console.log(error)
    res.status(500).json({message:" error in booking", error})
    
  }
}

const PreviousEnquire= async(req,res)=>{
  try{
    // console.log("ddhjf")
    const id = req.Venue_id;
    const currentDate = new Date();
    const data=await  BookingModel.find({venueId:id,date: { $lte: currentDate },payment:false})
    // console.log(data)
    if(data){
      res.status(200).json({data})
    }else{
      res.status(402).json({message:"not found"})
    }
   

  }catch (error) {
     console.log(error)
    res.status(500).json({message:" error in PreviousBooking", error})
    
  }
}
const ConfirmEnquire= async(req,res)=>{
  try{
    // console.log("ddhjf")
    const id = req.Venue_id;
    const currentDate = new Date();
    const data=await  BookingModel.find({venueId:id,payment:true})
    // console.log(data)
    if(data){
      res.status(200).json({data})
    }else{
      res.status(402).json({message:"not found"})
    }
   

  }catch (error) {
     console.log(error)
    res.status(500).json({message:" error in PreviousBooking", error})
    
  }
}
const VenueImageDelete=async(req,res)=>{
  try {
    const id = req.Venue_id;
    // console.log(req.body?.data)
    let toDelete=req.body?.data
    const venue= await venueModel.findById(id)
    if(venue){
      venue.image=venue.image.filter(image=>image!== toDelete)
      await venue.save()
    }

    res.status(200).json({message:"454"})
    
  } catch (error) {
    console.log(error)
    res.status(500).json({message:" error in VenueImageDelete ", error})
  }
}



module.exports = { signUp, login, home, information,PreviousEnquire,VenueGallery,
   postInformation, project ,getImages,userList,ConfirmEnquire,VenueImageDelete,
   authVenue,booking,changeBooking};
