const express = require('express')
const userRoutes = require('../controller/userController')
const{userProtect}=require("../Middleware/auth")


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


const router = express.Router()



router.post("/login",userRoutes.login)
router.post("/signup",userRoutes.signup)
router.get("/authUser",userProtect,userRoutes.authUser)
router.get("/venueDetail/:id",userRoutes.venueDetail)
router.post("/booking",userProtect,userRoutes.booking)
router.get("/profile",userProtect,userRoutes.profile)
router.get("/enquire",userProtect,userRoutes.enquire)
router.get("/search/:id",userRoutes.search)
router.post("/password",userProtect,userRoutes.password)
router.post("/changeDp",userProtect,upload.single('image') ,userRoutes.changeDp)
router.post("/forgotPassword",userRoutes.forgotPassword)
router.post("/changePassword",userRoutes.changePassword)
module.exports = router