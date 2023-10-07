const express = require('express')
const router = express.Router()
const adminControll= require("../controller/adminController")
const reportControlller=require("../controller/ReportController")
const{adminProtect} =require("../Middleware/auth")

const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
          cb(null, path.join(__dirname, '../public/images')) //cb(null, "uploads");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
})
const upload = multer({
    storage: storage,
})

// middleware that is specific to this router
router.post('/login',adminControll.login)
router.get("/userData",adminProtect,adminControll.userData) //
router.get("/venueData",adminProtect,adminControll.venueDatas)//
router.get('/blockUser/:id',adminProtect,adminControll.blockUser)
router.get('/blockVendor/:id',adminProtect,adminControll.blockVendor)
router.get("/adminAuth",adminProtect,adminControll.adminAuth)
router.get("/adminVenueVerification",adminProtect,adminControll.adminVenueVerification)
router.post("/aproveVender",adminProtect,adminControll.aproveVender)
router.get("/getReports",adminProtect,reportControlller.getReports)
router.get("/adminHome",adminProtect,adminControll.adminHome)
router.get("/bookinManagment",adminProtect,adminControll.bookinManagment)
router.get("/VenueBookingDetail/:id",adminProtect,adminControll.VenueBookingDetail)
router.get("/deleteBanner/:id",adminProtect,adminControll.deleteBanner)
router.get("/getBanner",adminControll.getBanner)
router.post("/postBanner",upload.single('image') ,adminProtect,adminControll.postBanner)


module.exports = router