const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'dhebvkqgc', 
  api_key: '113691921262788', 
  api_secret: 'oVzSklU-BIMm5URajtWMToA9MB4',
  secure: true
});

module.exports = cloudinary;
