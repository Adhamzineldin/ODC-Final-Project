const express = require('express');
const {addUser, updatePassword, verifyUser, sendCodeToEmail} = require("../controllers/userController");
const router = express.Router();


// Add a new user (Registration)
router.post('/register', addUser);

// Update user password
router.put('/update-password', updatePassword);

router.post('/verify-email', verifyUser);

router.post('/send-verification-code', sendCodeToEmail);


module.exports = router;


module.exports = router;
