const express = require('express')
const router = express.Router()
const adminControll= require("../controller/adminController")
const{adminProtect} =require("../Middleware/auth")

// middleware that is specific to this router
router.post('/login',adminControll.login)
router.get("/userData",adminProtect,adminControll.userData) //
router.get("/venueData",adminProtect,adminControll.venueDatas)//
router.get('/blockUser/:id',adminProtect,adminControll.blockUser)
router.get('/blockVendor/:id',adminProtect,adminControll.blockVendor)
router.get("/adminAuth",adminProtect,adminControll.adminAuth)


module.exports = router