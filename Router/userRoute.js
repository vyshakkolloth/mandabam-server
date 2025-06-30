const express = require('express')
const userRoutes = require('../controller/userController')
const chatController= require("../controller/chatController")
const bookingController=require("../controller/bookingController")
const reviewController=require("../controller/ReviewController")
const ReportController=require("../controller/ReportController")
const{userProtect}=require("../Middleware/auth")
const  upload  = require('../utils/multer')


// const multer = require('multer');
// const path = require('path');

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//           cb(null, path.join(__dirname, '../public/images')) //cb(null, "uploads");
//     },
//     filename: function (req, file, cb) {
//         cb(null, Date.now() + '-' + file.originalname)
//     }
// })
// const upload = multer({
//     storage: storage,
// })


const router = express.Router()


router.get("/",(req,res)=>{res.send("hello iam awailable")})
router.post("/login",userRoutes.login)
router.post("/signup",userRoutes.signup)
router.get("/authUser",userProtect,userRoutes.authUser)
router.get("/venueDetail/:id",userRoutes.venueDetail)
router.post("/booking",userProtect,bookingController.booking)
router.get("/bookedVenue",userProtect,bookingController.bookedVenue)
router.get("/profile",userProtect,userRoutes.profile)
router.get("/enquire",userProtect,userRoutes.enquire)
router.get("/venueList",userRoutes.venues)
router.get("/search/:id",userRoutes.search)
router.post("/password",userProtect,userRoutes.password)
router.post("/changeDp",userProtect,upload.single('image') ,userRoutes.changeDp)
router.post("/forgotPassword",userRoutes.forgotPassword)
router.post("/changePassword",userRoutes.changePassword)
router.post("/sentMessage",userProtect,userRoutes.sentMessage)
router.get("/userList",userProtect,userRoutes.userList)
router.post("/getMessage",userProtect,chatController.getMessage)
router.post("/postuserMessage",userProtect,chatController.PostuserMessage)
router.post("/paymentCreate",userProtect,bookingController.paymentCreate)
router.post("/paymentVerify",userProtect,bookingController.paymentVerify)
router.post("/datePicker",userProtect,userRoutes.datePicker)
router.post("/postReview",userProtect,reviewController.postReview)
router.get("/getReview/:id",reviewController.getReview)
router.post("/ReportVenue",userProtect,ReportController.postReport)
// router.post("/linked",userRoutes.linkedList)

module.exports = router