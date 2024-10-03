const express = require('express');
const {addUser, updatePassword, verifyUser, sendCodeToEmail, loginUser, addToCart, getCarts} = require("../controllers/userController");
const router = express.Router();


// Add a new user (Registration)
router.post('/register', addUser);

// Update user password
router.put('/update-password', updatePassword);

router.post('/verify-email', verifyUser);

router.post('/send-verification-code', sendCodeToEmail);

router.post('/login', loginUser);

router.post('/add-to-cart', addToCart);

router.get('/cart/:userId', getCarts);
module.exports = router;


module.exports = router;
