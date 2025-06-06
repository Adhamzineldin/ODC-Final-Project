const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);


function toTitleCase(str) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}


const cartItemSchema = new mongoose.Schema({
  product: {type: Number, ref: 'Product', required: true}, // Reference to Product model
  quantity: {type: Number, required: true, default: 1}, // Quantity of the product
});

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: Number,
    unique: true
  },
  products: {
    type: [cartItemSchema],
    default: []
  }, // Array of products in the order
  total: {
    type: Number
  },
  status: {
    type: String,
    enum: ['pending', 'shipped', 'delivered', 'canceled'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,

  },
  updatedAt: {
    type: Date
  }
});

// Middleware to update the `updatedAt` field before saving
orderSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});


// Define the schema
const userSchema = new mongoose.Schema({
  userId: {type: Number, unique: true},
  username: {type: String, required: true, lowercase: true, unique: true},
  email: {type: String, required: true, unique: true, lowercase: true},
  password: {type: String},
  firstName: {type: String},
  lastName: {type: String},
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date},
  isActive: {type: Boolean, default: true},
  isVerified: {type: Boolean, default: false},
  roles: {type: [String], default: ['user']},
  cart: {type: [cartItemSchema], default: []},
  orders: {type: [orderSchema], default: ''},
});

userSchema.pre('save', function (next) {
  if (this.isModified('firstName')) {
    this.firstName = toTitleCase(this.firstName); // Convert firstName to title case
  }
  if (this.isModified('lastName')) {
    this.lastName = toTitleCase(this.lastName); // Convert lastName to title case
  }
  if (this.isModified('username')) {
    this.username = toTitleCase(this.username); // Convert username to title case
  }
  next();
});


userSchema.plugin(AutoIncrement, {inc_field: 'userId'}); // Apply auto-increment on 'id'
orderSchema.plugin(AutoIncrement, {inc_field: 'orderNumber'});


// Create the model
const User = mongoose.model('User', userSchema);

module.exports = User;
