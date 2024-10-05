const express = require('express');
const {
  addUser, updatePassword, verifyUser, sendCodeToEmail, loginUser, addToCart, getCarts, updateCart, updateOrder,
  getOrders, getOrder, sendOrderDetailsEmail, forgotPassword
} = require("../controllers/userController");
const router = express.Router();


// Add a new user (Registration)
router.post('/register', addUser);

// Update user password
router.put('/update-password', updatePassword);
router.post('/forgot-password', forgotPassword);

router.post('/verify-email', verifyUser);

router.post('/send-verification-code', sendCodeToEmail);
router.post('/sendEmail', sendOrderDetailsEmail);

router.post('/login', loginUser);

router.post('/add-to-cart', addToCart);

router.get('/cart/:userId', getCarts);

router.put('/cart/:userId', updateCart);

router.put('/orders/:userId', updateOrder);

router.get('/orders/:userId', getOrders);

router.get('/orders/order/:userId', getOrder);


module.exports = router;


module.exports = router;
