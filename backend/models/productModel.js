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
   productId: { type: Number, unique: true },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: 'No description available',
  },
  category: {
    type: String,
    default : 'Uncategorized'
  },
  price: {
    type: Number,
    required: true,
  },
  discountPercentage: {
    type: Number,
  },
  rating: {
    type: Number,
    default: 5,
  },
  stock: {
    type: Number,
    default : 0
  },
  tags: [
    {
      type: String,
    },
  ],
  brand: {
    type: String,
    default: 'Unknown',
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
    default: 1,
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

productSchema.plugin(AutoIncrement, { inc_field: 'productId' }); // Enable auto-increment for the 'id' field

module.exports = mongoose.model('Product', productSchema);
