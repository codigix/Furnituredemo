
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter product name'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please enter product description']
  },
  price: {
    type: Number,
    required: [true, 'Please enter product price'],
    default: 0
  },
  image: {
    type: String,
    required: [true, 'Please enter product image URL']
  },
  category: {
    type: String,
    required: [true, 'Please enter product category']
  },
  stock: {
    type: Number,
    required: [true, 'Please enter product stock'],
    default: 0
  }
}, {
  timestamps: true
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
