const cloudinary = require("cloudinary").v2;

cloudinary.config({ 
  cloud_name: 'djrtauheh', 
  api_key: '494332962916583', 
  api_secret: 'tNbkVyhnA8NMiIZBDsZ6GiTinDI' 
});
module.exports=(cloudinary)