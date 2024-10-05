const bcrypt = require('bcryptjs');
const User = require('../models/userModel'); // Assuming you have the User model defined as shown earlier
const Product = require('../models/productModel');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const {getProductById} = require("./productController");


// Add a new user (Register)
exports.addUser = async (req, res) => {
  try {
    const {username, email, password, firstName, lastName} = req.body; // Destructure orders from req.body
    console.log(req.body);

    // Check if the email is already registered
    const existingMail = await User.findOne({email});
    const existingUsername = await User.findOne({username});

    if (existingMail) {
      return res.status(400).json({message: 'User with this email already exists'});
    }

    if (existingUsername) {
      return res.status(400).json({message: 'User with this username already exists'});
    }

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      firstName,
      lastName,
      createdAt: new Date(),
      isActive: true,
      roles: ['user']
    });

    console.log(newUser);


    // Save the user in the database
    await newUser.save();

    res.status(201).json({message: 'User created successfully'});
  } catch (error) {
    console.error(error);
    res.status(500).json({message: 'Server error'});
  }
};

// Update user password
exports.updatePassword = async (req, res) => {
  try {
    console.log(req.body);
    const {email, oldPassword, newPassword} = req.body;

    // Find the user by email
    const user = await User.findOne({email});
    if (!user) {
      return res.status(200).json({message: 'User not found'});
    }

    // Check if the old password is correct
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(200).json({message: 'Incorrect old password'});
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    // Update the user's password
    user.password = hashedNewPassword;
    user.updatedAt = new Date();
    await user.save();

    res.status(200).json({message: 'Password updated successfully'});
  } catch (error) {
    console.log(error);
    res.status(500).json({message: error});
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    console.log(req.body);
    const {email, newPassword} = req.body;
    console.log(email, newPassword);


    // Find the user by email
    const user = await User.findOne({email});
    if (!user) {
      return res.status(200).json({message: 'User not found'});
    }


    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    // Update the user's password
    user.password = hashedNewPassword;
    user.updatedAt = new Date();
    await user.save();

    res.status(200).json({message: 'Password updated successfully'});
  } catch (error) {
    console.log(error);
    res.status(500).json({message: error});
  }
};


exports.verifyUser = async (req, res) => {
  try {
    const {email} = req.body;
    const user = await User.findOne({email});
    if (!user) {
      return res.status(404).json({message: 'User not found'});
    }
    user.isVerified = true;
    await user.save();
    res.status(200).json({message: 'success'});
  } catch (error) {
    console.error(error);
    res.status(500).json({message: 'Server error'});
  }
}

exports.sendCodeToEmail = async (req, res) => {
  const {email, code} = req.body; // Extract email and code from the request body
  console.log(req.body);
  // Create transporter
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL, // Your email from AppComponent
      pass: process.env.EMAIL_PASSWORD, // Your password from AppComponent
    },
  });

  // Path to the HTML template
  const htmlTemplatePath = path.join(__dirname, '../templates/verificationEmail.html'); // Adjust this path

  // Read the HTML template
  fs.readFile(htmlTemplatePath, 'utf8', async (err, html) => {
    if (err) {
      console.error('Error reading HTML file:', err);
      return res.status(500).json({error: 'Error reading email template'});
    }

    // Replace {{code}} with the actual verification code
    let htmlWithCode = html.replace('{{code}}', code);
    htmlWithCode = htmlWithCode.replace('{{email}}', email);
    // Create mail options
    const mailOptions = {
      from: process.env.EMAIL, // Sender's email address
      to: email, // Recipient's email
      subject: 'Verification Code',
      html: htmlWithCode,
      headers: {
        'Content-Type': 'text/html; charset=utf-8'
      }
    };

    try {
      // Send the email
      await transporter.sendMail(mailOptions);
      res.status(200).json({message: 'Email sent successfully'});
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({error: error});
    }
  });
};

exports.loginUser = async (req, res) => {
  try {
    const {email, password} = req.body;

    // Find the user by email
    const user = await User.findOne({username: email});
    if (!user) {
      return res.status(404).json({message: 'User not found'});
    }

    // Check if the password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({message: 'Invalid password'});
    }

    // Optionally, generate a token for session management
    // const token = generateToken(user); // Implement token generation if needed

    res.status(200).json({
      message: 'Login successful',
      user: {
        userId: user.userId,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        roles: user.roles,
        isVerified: user.isVerified,
        // Add any other fields you want to include
      }
      // token // Include token if you implemented JWT authentication
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({message: 'Server error'});
  }
};

exports.addToCart = async (req, res) => {
  console.log("add to cart");
  try {
    const {userId, productId} = req.body;

    // Find the user by ID
    const user = await User.findOne({userId});
    if (!user) {
      return res.status(404).json({message: 'User not found'});
    }

    // Find the product by ID
    const product = await Product.findOne({productId});
    if (!product) {
      return res.status(404).json({message: 'Product not found'});
    }

    // Check if the product is already in the user's cart
    const isProductInCart = user.cart.some(item => item.product === productId);

    if (isProductInCart) {
      // If product is already in the cart, increase the quantity
      user.cart = user.cart.map(item => {
        if (item.product === productId) {
          item.quantity += 1; // Increment the quantity
        }
        return item;
      });
    } else {
      // If product is not in the cart, add it with quantity 1
      user.cart.push({product: productId, quantity: 1});
    }

    // Save the updated user document
    await user.save();

    res.status(200).json({
      message: 'Product added to cart successfully',
      cart: user.cart
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({message: error});
  }
};

exports.getCarts = async (req, res) => {
  try {
    const {userId} = req.params;

    // Find the user by ID and populate the cart with product details
    const user = await User.findOne({userId})

    if (!user) {
      return res.status(404).json({message: 'User not found'});
    }

    // Return the cart items
    res.status(200).json({
      message: 'Cart retrieved successfully',
      cart: user.cart
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({message: error});
  }
};

exports.updateCart = async (req, res) => {
  try {
    const {userId} = req.params; // Extract userId from the URL parameters
    const {updatedCart} = req.body; // The updated cart data is sent in the request body

    // Validate that each item in the cart has a valid product and quantity
    if (!Array.isArray(updatedCart) || updatedCart.some(item => !item.productId || !item.quantity)) {
      return res.status(400).json({message: 'Invalid cart data. Each item must have a productId and quantity.'});
    }

    // Find the user by ID
    const user = await User.findOne({userId});

    if (!user) {
      return res.status(404).json({message: 'User not found'});
    }

    // Map the updated cart data to match the user's cart structure
    user.cart = updatedCart.map(item => ({
      product: item.productId,  // Ensure product is set properly
      quantity: item.quantity
    }));

    // Save the updated user data to the database
    await user.save();

    // Respond with the updated cart and a success message
    res.status(200).json({
      message: 'Cart updated successfully',
      cart: user.cart
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({message: 'Failed to update cart', error});
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const {userId} = req.params; // Extract userId from the URL parameters
    const {updatedOrder} = req.body; // The updated order data is sent in the request body

    // Find the user by ID
    const user = await User.findOne({userId});

    if (!user) {
      return res.status(404).json({message: 'User not found'});
    }

    // Loop through the products in the updated order
    for (const product of updatedOrder.products) {
      // Find the product by ID
      const foundProduct = await Product.findOne({productId: product.product}); // Assuming productId is available

      if (!foundProduct) {
        console.log(product);
        return res.status(404).json({message: `Product with ID ${product.productId} not found`});
      }

      // Check if enough stock is available
      if (foundProduct.stock < product.quantity) {
        return res.status(400).json({message: `Insufficient stock for product: ${foundProduct.name}`});
      }

      // Deduct the ordered quantity from the product stock
      foundProduct.stock -= product.quantity;

      // Update the stock status
      if (foundProduct.stock <= 0) {
        foundProduct.availabilityStatus = 'Out Of Stock'; // Update to Out Of Stock if stock is 0
      } else if (foundProduct.stock < 20) {
        foundProduct.availabilityStatus = 'Low Stock'; // Update to Low Stock if stock is less than 20
      } else {
        foundProduct.availabilityStatus = 'In Stock'; // Update to In Stock if sufficient stock remains
      }

      // Save the updated product information
      await foundProduct.save();
    }

    // Create a new order based on the updatedOrder received
    const newOrder = {
      products: updatedOrder.products, // Directly take the products array
      total: updatedOrder.total,       // Take the total from updatedOrder
      status: updatedOrder.status || 'pending', // Default to 'pending' if no status is provided
    };

    // Push the new order to the user's orders array
    user.orders.push(newOrder);

    // Save the updated user data to the database
    await user.save();

    // Respond with the updated orders and a success message
    res.status(200).json({
      message: 'Order updated successfully',
      orders: user.orders // Return the updated orders array
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({message: 'Failed to update order', error});
  }
};

exports.getOrders = async (req, res) => {
  try {
    const {userId} = req.params;

    // Find the user by ID and populate the orders with product details
    const user = await User.findOne({userId});

    if (!user) {
      return res.status(404).json({message: 'User not found'});
    }

    // Get orders excluding the first one
    const orders = user.orders.slice(1); // This will return all orders except the first one

    res.status(200).json({
      message: 'Orders retrieved successfully',
      orders
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({message: error.message});
  }
}

exports.getOrder = async (req, res) => {
  try {
    const {userId} = req.params;
    const orderNumber = req.query.orderNumber;
    console.log(orderNumber);
    // Find the user by ID and populate the orders with product details
    const user = await User.findOne({userId})
    const orders = user.orders;
    const order = orders.filter(order => Number(order.orderNumber) === Number(orderNumber))[0];
    res.status(200).json({
      message: 'Orders retrieved successfully',
      order
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({message: error});
  }
}


exports.sendOrderDetailsEmail = async (req, res) => {
  const {email, htmlContent} = req.body; // Extract email and htmlContent from the request body
  console.log("sending order", email);
  // Create transporter
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL, // Your email from AppComponent
      pass: process.env.EMAIL_PASSWORD, // Your password from AppComponent
    },
  });

  // Create mail options
  const mailOptions = {
    from: process.env.EMAIL, // Sender's email address
    to: email, // Recipient's email
    subject: 'Order Details And Confirmation',
    html: htmlContent, // Use the HTML content passed from the car component
    headers: {
      'Content-Type': 'text/html; charset=utf-8'
    }
  };

  try {
    // Send the email
    await transporter.sendMail(mailOptions);
    res.status(200).json({message: 'Email sent successfully'});
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({error: error});
  }
};
