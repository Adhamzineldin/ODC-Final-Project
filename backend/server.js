const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const imageRoutes = require('./routes/imageRoutes');
const os = require('os');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());


connectDB().then(r => console.log('Connected to MongoDB'));

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
// Use image routes for handling uploads
app.use('/api/images', imageRoutes);
app.use('/api/images', express.static(path.join(__dirname, 'public/uploads')));



function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (let interface in interfaces) {
    for (let addr of interfaces[interface]) {
      if (addr.family === 'IPv4' && !addr.internal) {
        return addr.address;
      }
    }
  }
  return 'localhost';
}

const hostIP = getLocalIP();
const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://${hostIP}:${PORT}`);
});
