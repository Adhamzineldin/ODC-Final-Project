
const express = require('express');
const router = express.Router();
const { getAllProducts, getProductById, addProduct, addReview, deleteProduct} = require('../controllers/productController');
const {getProductsByCategory, getAllCategories} = require("../controllers/categoryController");
const upload = require('../middleware/multer');


router.get('/categories', getAllCategories);
router.get('/categories/:category', getProductsByCategory);

router.get('/product/:id', getProductById);
router.get('/', getAllProducts);
router.post('/:id/reviews', addReview);
router.post('/', upload.array('images', 10), addProduct);
router.delete('/product/:id', deleteProduct);


module.exports = router;
