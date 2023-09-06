const express = require('express')
const router = express.Router()
const{venueProtect}=require("../Middleware/auth")
const venuController = require('../controller/venueController')

// middleware that is specific to this rout
router.post("/signup",venuController.signUp)
router.post("/login",venuController.login)
router.post("/home",venuController.home)
router.get("/getInformation",venueProtect,venuController.information)
router.post("/information",venueProtect,venuController.postInformation)
router.post("/project",venueProtect,venuController.project)  //getImages
router.get("/getImages",venueProtect,venuController.getImages)
router.get("/booking",venueProtect,venuController.booking)
router.get("/changeBooking/:id",venueProtect,venuController.changeBooking)
router.get("/authVenue",venueProtect,venuController.authVenue)



module.exports = router