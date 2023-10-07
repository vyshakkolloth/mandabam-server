const jwt = require("jsonwebtoken");
const userModel=require("../Model/userModel")
const VenueModel =require("../Model/venueModel")
const bookingModal=require("../Model/bookingModel")
const bannerModel=require("../Model/Banner")

const cloudinary= require("../config/config")

const adminModel = require("../Model/adminModel");

const login = async (req, res) => {
  try {
    const { email, passsword } = req.body;
   
    const admindetails = {
      email:"vyshakkolloth@gmail.com",
    };
    // console.log(req.body);
    if (
      email == process.env.ADMIN_EMAIL &&
      passsword == process.env.ADMIN_PAS
    ) {
      const secretKey = process.env.JWT_SECRET_KEY;
      const token = jwt.sign({ adminID:"123456" }, secretKey, {
        expiresIn: "5d",
      });
      res.json({ status:200, token: token, message: "yea working",result:admindetails});

    }else{
      res.json({status:401,message:"authorisation Incorrect"})
    }

    
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: "error", message: error.message });
  }
};

const userData = async(req,res)=>{
  try {
    // console.log(req)
    const data=await userModel.find({})
    res.json({status:200,data:data,})
    
  } catch (error) {
    console.log(error)
    res.status(400).json({ status: "error", message: error.message });
  }
}
const venueDatas=async(req,res)=>{
  try {
    const data=await VenueModel.find({})
    res.json({status:200,data:data})
  
  } catch (error) {
    console.log(error)
    res.status(400).json({ status: "error", message: error.message });
    
  }
}
const blockUser=async(req,res)=>{
  try {
    // console.log(req.adminId)
    const _id = req.params.id;
   const user=await userModel.findById({_id})
  //  console.log(user.blocked,"123456")
   if(!user.blocked){
    // console.log("true");
const value=await userModel.updateOne({_id},{$set:{blocked:true}})
   }else{
    // console.log("false");
    await userModel.updateOne({_id},{$set:{blocked:false}})
   }

    res.json({status:200})
  } catch (error) {
    console.log(error)
    res.status(400).json({ status: "error", message: error.message });
  }
}

const blockVendor=async(req,res)=>{
  try {
    console.log(req.headers)
    const _id = req.params.id;
   const user=await VenueModel.findById({_id})
  //  console.log(user.isBanned,"123456")
   if(!user.isBanned){
    // console.log("true");
const value=await VenueModel.updateOne({_id},{$set:{isBanned:true}})
   }else{
    // console.log("false");
    await VenueModel.updateOne({_id},{$set:{isBanned:false}})
   }

    res.json({status:200})
  } catch (error) {
    console.log(error)
    res.status(400).json({ status: "error", message: error.message });
  }
}
const adminAuth = async(req,res)=>{
  try {
    console.log("iam admiauth")
    const admindetails = {
      email:"vyshakkolloth@gmail.com",
    };
console.log(req.adminId)
   
    res.json({
      auth: true,
      result: admindetails,
      status: "success",
      message: "signin success",
    });
  } catch (error) {
    res.status(400).json({ auth: false, message: error.message });
  }
}
 

const adminVenueVerification = async (req,res)=>{
  try { 
    console.log("admin working")
    const result = await VenueModel.find({adminAproved:false,show:true})
    if(result){
      res.status(200).json({result})
    }else{
      res.status(402).json({message:"error result not find"})
    }
   
    
  } catch (error) {
    console.log(error)
    res.status(500).json({message:"serrver error",error})
  }
}

const aproveVender=async(req,res)=>{
  try {
console.log(req.body?.id)
const id =req.body?.id
if(id){
 const result= await VenueModel.findByIdAndUpdate( { _id: id },
    { adminAproved: true },
    { new: true } // To return the updated document
  );
  if(result){
    res.status(200).json({message:"all good"})
  }else{
    res.status(200).json({message:"result fail"})
  }
}




  } catch (error) {
    console.log(error)
    res.status(500).json({message:"serrver error",error})
  }

}

const adminHome=async(req,res)=>{
  try {
    const usercount= await userModel.countDocuments();
    const venueCount=await VenueModel.countDocuments();
    const BookingTotal=await bookingModal.aggregate([
      {
        $match: { payment: true } // Filter bookings where payment is true
      },
      {
        $group: {
          _id: null, // Group by a constant value (all documents)
          total: { $sum: '$amount' } // Calculate the sum of 'amount'
        }
      }
    ]);
    const registrations = await userModel.aggregate([
      {
        $group: {
          _id: {
            month: { $month: '$timestamp' },
            year: { $year: '$timestamp' },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 },
      },
    ]);
    const venuegraph = await VenueModel.aggregate([
      {
        $group: {
          _id: {
            month: { $month: '$timestamp' },
            year: { $year: '$timestamp' },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 },
      },
    ]);




    console.log(venuegraph)
    res.status(200).json({message:"all good",usercount,venueCount,BookingTotal,registrations,venuegraph})

    
  } catch (error) {
    console.log(error)
    res.status(500).json({message:"serrver error",error})
  }
}


const bookinManagment=async(req,res)=>{
  try {
    const booking = await bookingModal.aggregate([
      {
        $match: {
            payment: true
        }
    },
      {
          $group: {
              _id: '$venueId',
              count: { $sum: 1 } // Count the number of documents in each group
          }
      },
      {
          $lookup: {
              from: 'venuedatas', // The name of the collection to perform the lookup
              localField: '_id',
              foreignField: '_id',
              as: 'venueData' // The alias for the joined data
          }
      },
      {
          $unwind: '$venueData' // Unwind the venueData array (assuming it's an array, if not, remove this stage)
      },
      {
          $project: {
              _id: 1,
              count: 1,
              'venueData.name': 1 // Include the 'name' field from the venueData
              ,"venueData.location":1,
              "venueData.email":1,
              "venueData.mobile":1,
              "venueData.type":1,
              "venueData.image":1
          }
      }
  ]);
  
  // console.log(booking);
  

      if(booking){
        res.status(200).json({message:"data here",booking})
      }else{
        res.status(202).json({message:"data no"})
      }



  } catch (error) {
    console.log(error)
    res.status(500).json({message:"serrver error",error})
  }
}
const VenueBookingDetail=async(req,res)=>{
  try {
    console.log(req.params.id,"jdjd")
    let id=req?.params?.id
    if(id!=="undefined"){
      const result=await bookingModal.find({venueId:id,payment:true})
      if(result){
        res.status(200).json({message:"all good",result})
      }else{
        res.status(200).json({message:"no result"})
      }
     
    }else{
      res.status(200).json({message:"no id"})
    }

    
    
  } catch (error) {
    console.log(error)
    res.status(500).json({message:"serrver error",error})
  }
}
const getBanner=async(req,res)=>{
  try {
     const result=await bannerModel.find() 
     if(result){
      res.status(200).json({meassag:"all good",result})
     }else{
     res.status(200).json({meassag:"all good",result})
     }
    
  } catch (error) {
    console.log(error)
    res.status(500).json({message:"serrver error",error})
  }
}
const postBanner=async(req,res)=>{
  try {
// console.log(req.file,"file")
// console.log(req.body,"body")
const{head,text}=req.body
    if(req.file){
      const pathfi=req.file.path


      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload(pathfi, (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        });
      });
      const newBanner = new bannerModel({
        Title: head,
        Image:uploadResult.url ,// Store the file path if an image was uploaded
        Text: text,
      });

      newBanner.save()
      res.status(200).json({message:"all good"})

    }else{
      res.status(200).json({message:"error"})
    }
    // res.status(200).json({message:"all ok"})
    
  } catch (error) {
    console.log(error)
    res.status(500).json({message:"serrver error",error})
  }
}

const deleteBanner = async(req,res)=>{

 try {
  let id=req?.params?.id
  if(id){
    let result = await bannerModel.findOneAndDelete(id)
    res.status(200).json({message:"deled",result})
  }else{
    res.status(200).json({message:"no id"})
  }
 

 } catch (error) {
   console.log(error)
    res.status(500).json({message:"serrver error",error})
 }
}


module.exports = { deleteBanner,postBanner,getBanner,VenueBookingDetail,login 
  ,userData,venueDatas,blockUser,blockVendor,adminHome,adminAuth,adminVenueVerification,aproveVender,bookinManagment};
