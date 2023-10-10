const express = require('express')
const cors = require('cors')
const path = require('path');
const { Server } = require('socket.io');
const dotenv = require("dotenv");
const http = require('http');
dotenv.config({path:"./config.env"})
const chatController=require("./controller/chatController")
const app=express()

const server=http.createServer(app)



app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')));

const io=new Server(server,{
  cors: {
    origin:"http://localhost:5173",
    methods:["GET","POST"]
  }
})
const onlineUsers = new Map();

io.on("connection",(socket)=>{
  // console.log(socket.id)
 
  // socket.on("add-user", (userId) => {
  //   onlineUsers.set(userId, socket.id);
  //   console.log(onlineUsers)
  // });
  socket.on("add-user", (chatId) => {
    // onlineUsers.set(userId, socket.id);
    // console.log(chatId)
    socket.join(chatId);

  });


  socket.on("send-message", (data) => {
    // console.log(data.to,"tpptptpttpt")
    // const id=data.to
    // const from=data.from
    // if(from){
      // console.log(from,"from")
      // console.log("result",onlineUsers.get(from),"4")
      // const reveseusersocket = onlineUsers.get(from);
      // if(reveseusersocket){
      //   console.log( reveseusersocket,"from")
      //   const f=socket.to(reveseusersocket).emit("msg-reverse", data);
      //   console.log(f)
      // }
    // }
    // console.log(data)
    io.emit("msg-recieve",data)
    chatController.addMessage(data)


  //  if(id){
  //   const sendUserSocket = onlineUsers.get(id);
  //   // console.log("result",onlineUsers.get(id))
  //   if (sendUserSocket) {
  //     console.log(sendUserSocket,"to")
  //     socket.to(sendUserSocket).emit("msg-recieve", data); 
  //   }
  //   }
    
  })


})

const venueRoutes = require('./Router/venueRoutes');
const userRoute = require('./Router/userRoute');
const adminRoute = require('./Router/adminRoute')



// Route============
app.use("/",userRoute)
app.use("/admin",adminRoute)
app.use("/venue",venueRoutes)

// database===================
const mongoose = require('mongoose');
const { emit } = require('process');

mongoose.set('strictQuery',true)
mongoose.connect(process.env.mongo).then(()=>console.log("mongoose connected"))
// mongoose.set('strictQuery',true)
// mongoose.connect(process.env.mongo).then(console.log("connected"))//mongodb://127.0.0.1:27017/example



// port===============================
  server.listen(process.env.PORT, () => {
    console.log(`Example app listening on port ${process.env.PORT}`)
  })