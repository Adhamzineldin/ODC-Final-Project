const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Define storage for uploaded images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const imagesDir = path.join(__dirname, '../../public/uploads');

    // Create directory if it doesn't exist
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true });
    }

    cb(null, imagesDir); // Set destination
  },
  filename: (req, file, cb) => {
    const dateNow = Date.now();
    const randomSixDigits = Math.floor(100000 + Math.random() * 900000);
    const uniqueFilename = `${dateNow}_${randomSixDigits}${path.extname(file.originalname)}`;

    cb(null, uniqueFilename); // Set filename
  }
});

// Initialize multer with the defined storage
const upload = multer({ storage });

module.exports = upload;
