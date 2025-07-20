
const express = require('express');
const router = express.Router();
const { 
  getProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct 
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getProducts);
router.get('/:id', getProductById);

// Admin routes
router.post('/', protect, admin, createProduct);
// router.post('/', protect,  createProduct);

router.put('/:id', protect, admin, updateProduct);
// router.put('/:id', protect, updateProduct);

router.delete('/:id', protect, admin, deleteProduct);
// router.delete('/:id',protect,deleteProduct);

module.exports = router;
