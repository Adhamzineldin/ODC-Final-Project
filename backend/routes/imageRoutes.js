// imageRoutes.js
const express = require('express');
const {join} = require("node:path");
const router = express.Router();

router.get('/:filename', (req, res) => {
  const filePath = join(__dirname, '../public/uploads', req.params.filename);
  res.sendFile(filePath, (err) => {
    if (err) {
      res.status(404).json({ message: 'Image not found' });
    }
  });
});

module.exports = router;
