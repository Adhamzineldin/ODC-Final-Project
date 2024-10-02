const Category = require('../models/categoryModel');
const Product = require('../models/productModel');


exports.getAllCategories = async (req, res) =>
{
  try {
    console.log('Fetching distinct categories from the database...');
    const categories = await Product.distinct('category');
    console.log('Fetched categories:', categories);

    res.status(200).json({
      success: true,
      categories: categories,
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};

// Get products by category
exports.getProductsByCategory = async (req, res) => {
  const categoryName = req.params.category;

  try {
    const products = await Product.find({ category: categoryName });
    if (products.length > 0) {
      res.status(200).json(products);
    } else {
      res.status(404).json({ message: 'No products found for this category' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
