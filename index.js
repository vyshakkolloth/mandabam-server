const express = require('express')
const cors = require('cors')
const path = require('path');
const dotenv = require("dotenv");
const http = require('http');
dotenv.config({path:"./config.env"})

const socketService= require("./service/socketIO")
const connectDB = require('./config/db');
const app=express()

const server=http.createServer(app)




app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')));

// socket connection===== 

socketService(server)


const venueRoutes = require('./Router/venueRoutes');
const userRoute = require('./Router/userRoute');
const adminRoute = require('./Router/adminRoute');






// Route============
app.use("/",userRoute)
app.use("/admin",adminRoute)
app.use("/venue",venueRoutes)

// Data base ========================
connectDB()

// port===============================
  server.listen(process.env.PORT, () => {
    console.log(`Example app listening on port ${process.env.PORT}`)
  })