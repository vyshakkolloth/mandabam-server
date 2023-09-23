const jwt = require("jsonwebtoken");
const userModel=require("../Model/userModel")
const VenueModel =require("../Model/venueModel")



const adminModel = require("../Model/adminModel");

const login = async (req, res) => {
  try {
    const { email, passsword } = req.body;
   
    const admindetails = {
      email:"vyshakkolloth@gmail.com",
    };
    console.log(req.body);
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
    const result = await VenueModel.find()
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





module.exports = { login ,userData,venueDatas,blockUser,blockVendor,adminAuth,adminVenueVerification};
