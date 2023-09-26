const jwt = require("jsonwebtoken");
const fs = require("fs");

const VenueModel=require("../Model/venueModel")
const BookingModel=require("../Model/bookingModel")
const cloudinary= require("../config/config")
const UserModel = require("../Model/userModel");
const bcrypt = require("bcrypt");
const ChatModel= require("../Model/chatSchema")

//--------------------------
const login = async (req, res) => {
  try {
    // console.log(req.body);
    const user= await UserModel.findOne({email:req.body.data.email})
    if(user){
      if(!user.blocked){
        const secretKey = process.env.JWT_SECRET_KEY;
        const token = jwt.sign({ User: user._id }, secretKey, {
        expiresIn: "5d",
        });
      if(req.body.type==="google"&&req.body.data.azp===process.env.GOOGLE_AUTH) {
        res.json({status:200,message:"loged in using google auth",token:token,result:user})
        console.log("google login")
      }else if(req.body.type==="email"){
        
        const match = await bcrypt.compare(req.body.data.password,user.password)
        if(match){
          res.json({status:200,message:"password_match",token:token,result:user})
        }else{
          res.json({status:401,message:"email or password dont match"})
        }

      }

      }else{
        res.json({status:401,message:"user is banned"})
      }

    }else{
      res.json({status:401,message:"user not found"})
    }

    

  

    
          
  } catch (err) {
    console.log(err.messsage);
    res.json({status:401,message:err})
  }
};

const signup = async (req, res) => {
  try {
    const nameregex = /\s/g;
    const emailregex = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
   
    const passwordregex = /^[0-9]*$/;
    // console.log(req.body.data.phone);

    const { email, phone, name, password } = req.body.data;

    const repeat = await UserModel.findOne({ email: email });

    if (repeat) {
      return res.json({ status: 400, message: "user already exist" });
    }

    if (name.length <= 4) {
      return res.json({ status: 400, message: "name is not valied" });
    }

    if (nameregex.test(name)) {
      return res.json({ status: 400, message: " Name must be letters" });
    }

    if (!emailregex.test(email)) {
      return res.json({ status: 400, message: "  valied email is required" });
    }

    if (phone.length <= 9) {
      return res.json({ status: 400, message: " Mobile no. must be vallied" });
    }

    if (!phone) {
      return res.json({ status: 400, message: "Phone number is required" });
    }

    if (!passwordregex.test(password)) {
      return res.json({ status: 400, message: "  enter valied details" });
    }

    if (password.length < 3) {
      return res.json({ status: 400, message: "  password is to short" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password.trim(), salt);
    await UserModel.create({
      name,
      email,
      password: hashPassword,
      phone,
    });

    return res.json({ status: 200, message: "all good" });
  } catch (err) {
    console.log(err + "555");
    return res.json({ status: 401, message: "Server error" });
  }
};




const venueDetail= async(req,res)=>{
  try {
   
    const id = req.params.id;
    //  console.log(id ,"id")
    const data = await VenueModel.findById({_id:id})
    if(data){
      res.json({status:200,message:"all good",data:data})
    }else{
      res.json({status:401,message:"venue Not fount"})
    }
    
  } catch (error) {
    console.log(error,"+++err message")

    res.status(200).json({status:401,error:error})
    
  }
}
  
const booking=async(req,res)=>{
  try {
   
   const id=  req?.userId
    const {venueId,userId,data}=req.body
    const{name,email,guest,type,Phone,date,rooms,time}=data
   
    await BookingModel.create({
      venueId,userId:id,name,email,guest,type,Phone,room:rooms,time,date
    })





    res.json({status:200,message:"all good",auth:true})
  } catch (error) {
    console.log(error)
    res.status("401").json({message:error})
  }
}
const profile= async (req,res)=>{

  try {
    const id=  req?.userId
    const data= await UserModel.findById(id)
    if(data){
      res.status(200).json({message:"user data",data})
    }else{
      res.status(401).json({message:"no such user"})
    }

  } catch (error) {
    console.log(error)
    res.status("401").json({message:error})
  }
}
const enquire=async(req,res)=>{
  try {
    const id=  req?.userId
    const data=await  BookingModel.find({userId:id,payment: false })
    // console.log(data)
    if(!data.length==0){
      console.log("approve")
      return res.status(200).json({data}) 
    }else{
      
     return res.status(201).json({message:" no data at the moment"})
    }
  //  res.status(404).json({message:" no request at the moment"})
    


  } catch (error) {
    console.log(error)
    res.status(500).json({message:error})
  }
}
const search=async(req,res)=>{
  try {
    const name = req.params.id;
    
    const data= await VenueModel.find({location:name})
    // console.log(name,data.length)
    if(!data.length == 0){
      // console.log(data,"888")
      res.status(200).json({data:data,message:"data is avalialbe"})
    }else{
      // console.log("false")
      res.status(404).json({data:null,message:"data noe found"})
    }
    
   
  } catch (error) {
    console.log(error,"++search result")
    res.status("401").json({message:error})
  }
}

const password= async(req,res)=>{
  try {
    const {password} = req.body.data
    // console.log(password)
    const id=  req?.userId
    const user=await UserModel.findById(id)
    if(user){
      const match = await bcrypt.compare(req.body.data.password,user.password)
      if(match){
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password.trim(), salt);
       const result= await UserModel.findByIdAndUpdate(id,{password:hashPassword})
      //  console.log(result)
        res.status(200).json({auth:true,message:"password changed"})
      }else{
        res.status(401).json({auth:false,message:"password does not match"})
      }
    }else{
      res.status(401).json({auth:false,message:"user not found"})
    }
    // res.status(200).json({auth:false,message:"working on it"})
    
  } catch (error) {
    console.log(error)
    res.status("401").json({message:error}) 
  }
}


const authUser=async(req,res)=>{
  try {
    // console.log("first")
    const id=  req?.userId
    const result= await UserModel.findById(id)
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
    res.status(500).json({message:error,result:"server ERror"})
  }
}
const uploader = require('cloudinary').v2
const changeDp= async(req,res)=>{
  try {
    console.log("g")
    const id=  req?.userId
  if(!req.file){
  return res.status(404).json({message:"no file"})
  }
    
    const pathfi=req.file.path
  //  console.log(cloudinary.uploader.upload(pathfi,function(error, result) {console.log(result.url); }))
  const uploadResult = await new Promise((resolve, reject) => {
    cloudinary.uploader.upload(pathfi, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });

  // console.log(uploadResult.url);
  const user = await UserModel.findByIdAndUpdate(
    id,
    { image: uploadResult.url },
    { new: true }
  );
// console.log(user)
 return res.status(200).json({status:200,message:"all good"})

  
  
  } catch (error) {
    console.log(error)
    res.status(500).json({message:error,result:"server ERror"})
  }
}

const forgotPassword=async(req,res)=>{
  try {
    // console.log(req.body)
    const data=req.body.data
    const result =await UserModel.findOne({phone:data})
    if(result){
       res.status(200).json({message:"all good",user:result._id})
  }else{
    res.status(404).json({message:"user not found"})
  }

// console.log(result,"4545");

    
  } catch (error) {
    console.log(error);
    res.status(500).json({message:error})
  }
}


const changePassword=async(req,res)=>{
  try {
    const id=req.body.data.user
    const password=req.body.data.values.newPassword
    // console.log(id,"id","pass",password)
    // console.log(req.body.data);



 const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password.trim(), salt);
 await UserModel.findByIdAndUpdate(id,{password:hashPassword})


    res.status(200).json({message:"all good"})

  } catch (error) {
    console.log(error);
    res.status(500).json({message:error})
  }
}
// ======add chat
const sentMessage=async(req,res)=>{
  try {
    const id=  req?.userId
    const vid=req.body?.data
    const result=await ChatModel.findOne({user:id,venue:vid})
    if(!result){

    await ChatModel.create({user:id,venue:vid})
    res.status(200).json({message:"full"})
    }else{
      res.status(204).json({message:"already exist"})
      // console.log("false");
    }
    // console.log(result,"result")
   
    
    

    
  } catch (error) {
    res.status(500).json({message:"sentMessage error", error:error})
  }
}

const userList=async(req,res)=>{
  try {
    // console.log("yew");
    const id=  req?.userId
    const data=await ChatModel.find({user:id}).populate({
      path: "venue",
      select: "name image"// Replace fieldName1 and fieldName2 with the actual fields you want to retrieve
    })
    .exec();
    // console.log(data);
    if(data){
      res.status(200).json({message:"userList",data:data})
    }else{
      res.status(202).json({message:"no data"})
    }
   
  } catch (error) {
    console.log(error);
    res.status(500).json({message:"userList error", error:error})
  }
}
const datePicker=async(req,res)=>{
  try{

    // console.log(req.body.data)
    let venueId=req.body.data
    const date = await BookingModel.find({
      venueId: venueId,
      payment: true,
    }).distinct('date');
    res.status(200).json({message:"hello",date})

  }catch(error){
    console.log(error);
    res.status(500).json({message:"userList error", error:error})
  }
}
module.exports = { login, signup,venueDetail,booking ,userList,profile,
  enquire,search,password,datePicker,
  authUser,changeDp,forgotPassword,changePassword,sentMessage};


  