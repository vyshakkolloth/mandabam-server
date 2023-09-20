const express = require('express')
const router = express.Router()
const{venueProtect}=require("../Middleware/auth")
const venuController = require('../controller/venueController')
const bookinController=require("../controller/bookingController")


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






// middleware that is specific to this rout
router.post("/signup",venuController.signUp)
router.post("/login",venuController.login)
router.post("/home",venuController.home)
router.get("/getInformation",venueProtect,venuController.information)
router.post("/information",venueProtect,venuController.postInformation)
router.post("/project",venueProtect,venuController.project)  //getImages
router.get("/getImages",venueProtect,venuController.getImages)
router.post("/VenueGallery",venueProtect,upload.array('image') ,venuController.VenueGallery)
router.get("/booking",venueProtect,venuController.booking)
router.get("/changeBooking/:id",venueProtect,venuController.changeBooking)
router.get("/PreviousEnquire",venueProtect,venuController.PreviousEnquire)
router.get("/ConfirmEnquire",venueProtect,venuController.ConfirmEnquire)
router.post("/acceptEnquire",venueProtect,bookinController.acceptEnquire)
router.get("/authVenue",venueProtect,venuController.authVenue)
router.get("/userList",venueProtect,venuController.userList)
router.post("/VenueImageDelete",venueProtect,venuController.VenueImageDelete)



module.exports = router