const cloudinary = require("cloudinary").v2;

cloudinary.config({ 
  cloud_name: 'djrtauheh', 
  api_key: '494332962916583', 
  api_secret: process.env.CLOUDKEY
});
module.exports=(cloudinary)