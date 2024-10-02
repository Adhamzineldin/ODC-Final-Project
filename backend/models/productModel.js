const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const reviewSchema = new mongoose.Schema({
  rating: {
    type: Number,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  reviewerName: {
    type: String,
    required: true,
  },
  reviewerEmail: {
    type: String,
    required: true,
  },
});

const dimensionsSchema = new mongoose.Schema({
  width: {
    type: Number,
    required: true,
  },
  height: {
    type: Number,
    required: true,
  },
  depth: {
    type: Number,
    required: true,
  },
});

const productSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  category: {
    type: String,
  },
  price: {
    type: Number,
  },
  discountPercentage: {
    type: Number,
  },
  rating: {
    type: Number,
  },
  stock: {
    type: Number,
  },
  tags: [
    {
      type: String,
    },
  ],
  brand: {
    type: String,
  },
  sku: {
    type: String,
  },
  weight: {
    type: Number,
  },
  dimensions: dimensionsSchema,
  warrantyInformation: {
    type: String,
  },
  shippingInformation: {
    type: String,
  },
  availabilityStatus: {
    type: String,
  },
  reviews: [reviewSchema],
  returnPolicy: {
    type: String,
  },
  minimumOrderQuantity: {
    type: Number,
    default: 1,
  },
  ratingCount: {
    type: Number,
    default: 0,
  },
  images: [
    {
      type: String,
    },
  ],
  thumbnail: {
    type: String,
  },
}, {
  timestamps: true, // Enable automatic `createdAt` and `updatedAt` fields
});

productSchema.plugin(AutoIncrement, { inc_field: 'id' }); // Enable auto-increment for the 'id' field

module.exports = mongoose.model('Product', productSchema);
