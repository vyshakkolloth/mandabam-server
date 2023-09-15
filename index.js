const express = require('express')
const cors = require('cors')
const path = require('path');
const { Server } = require('socket.io');
const dotenv = require("dotenv");
const http = require('http');
dotenv.config({path:"./config.env"})


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
io.on("connection",(socket)=>{
  // console.log(socket);
  console.log(socket.id)
  socket.on("join_room",(data)=>{
    socket.join(data)
    console.log("id",socket.id,"data",data);
  })

  socket.on("disconnect",()=>{
    console.log("user disconnected",socket.id);
  })
  socket.on("sent_Message",(data)=>{
    console.log(data);
    socket.to(data.room).emit("recieve",data.message)
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



// port===============================
  server.listen(process.env.PORT, () => {
    console.log(`Example app listening on port ${process.env.PORT}`)
  })