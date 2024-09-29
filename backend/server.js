const express = require('express');
const app = express();
const port = 1338;
const mongoose = require('mongoose');
const scoresRoutes = require('./routes/scoresRoutes');
const cors = require('cors');


app.listen(port, "0.0.0.0", () => {
  console.log(`Server is running on http://localhost:${port}`);
});

mongoose.connect('mongodb://localhost:27017/FinalProject').then(() => {
  console.log('Connected to Database');
})

app.use(express.json());
app.use(cors());


app.use('/', (req, res, next) => {
  res.send('Server is running');
});





