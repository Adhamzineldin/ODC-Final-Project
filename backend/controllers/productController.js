// controllers/productController.js
const Product = require('../models/productModel');
const {join} = require("node:path");

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({ productId: req.params.id });
    if (product) {
      res.status(200).json( product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

exports.addProduct = async (req, res) => {
  try {
    // Check if req.body is an array, otherwise wrap it in an array
    const products = Array.isArray(req.body) ? req.body : [req.body];

    console.log(req.body);


    const savedProducts = [];

    for (let product of products) {
      const {
        title,
        price,
        description,
        category,
        brand,
        stock,
        rating ,
        ratingCount,
        tags,
        dimensions,
        sku,
        weight,
        warrantyInformation,
        shippingInformation,
        availabilityStatus,
        returnPolicy,
        minimumOrderQuantity,
        meta,
        thumbnail,
        reviews = []
      } = product;

      // Check required fields
      if (!title || !price) {
        return res.status(400).json({ message: 'Title and price are required' });
      }

      // Collect uploaded image filenames (check if req.files is defined)
      const imageFilenames = req.files ? req.files.map(file => `/${file.filename}`) : [];

      // Check if images are provided in the request body
      const imageLinks = product.images ? product.images.filter(image => typeof image === 'string' && image.startsWith('http')) : [];

      // Combine uploaded image filenames and HTTP image links
      const allImages = [...imageFilenames, ...imageLinks];

      // Create new Product
      const newProduct = new Product({
        title,
        price,
        description,
        category,
        brand,
        stock,
        rating,
        ratingCount,
        tags,
        dimensions,
        sku,
        weight,
        warrantyInformation,
        shippingInformation,
        availabilityStatus,
        returnPolicy,
        minimumOrderQuantity,
        meta,
        images: allImages, // Store both uploaded and HTTP image links
        thumbnail,
        reviews
      });
      console.log('newproduct', newProduct);

      const savedProduct = await newProduct.save();
      savedProducts.push(savedProduct);
    }

    // Respond with the list of saved products
    res.status(201).json({ message: 'Products added successfully', products: savedProducts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};


exports.addReview = async (req, res) => {
    const productId = req.params.id;
    const { comment, rating, reviewerName, reviewerEmail } = req.body; // Destructure the required fields

    // Validate input
    if (!comment || !rating || rating < 1 || rating > 5 || !reviewerName || !reviewerEmail) {
        return res.status(400).json({ message: 'Invalid review data' });
    }

    try {
        // Find the product and add the review
        const product = await Product.findOne({ productId: productId });

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Create a review object
        const review = {
            comment,
            rating,
            date: new Date(),
            reviewerName, // Add the reviewer name
            reviewerEmail, // Add the reviewer email
        };

        // Push the review to the reviews array
        product.reviews.unshift(review);

        // Optionally, update review count and average rating here if needed
        product.ratingCount = product.ratingCount  + 1;
        product.rating = parseFloat(((product.rating * (product.ratingCount - 1) + rating) / product.ratingCount).toFixed(2));


        // Save the updated product
        await product.save();

        // Return the updated product with the new review
        res.status(201).json(product);
    } catch (error) {
        console.error('Error adding review:', error);
        res.status(500).json({ message: error });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id; // Get the product ID from the request parameters

        // Check if product ID is provided
        if (!productId) {
            return res.status(400).json({ message: 'Product ID is required' });
        }

        // Find the product by ID and delete it
        const deletedProduct = await Product.findOneAndDelete({ productId: productId });

        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Return a success response
        res.status(200).json({ message: 'Product deleted successfully', product: deletedProduct });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
};
