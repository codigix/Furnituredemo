// const Product = require('../models/productModel');
const supabase = require("../db/supabaseClient");

// @desc    Get all products
// @route   GET /api/products
// @access  Public
// exports.getProducts = async (req, res) => {
//   try {
//     const products = await Product.find();

//     res.status(200).json({
//       success: true,
//       count: products.length,
//       products
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

exports.getProducts = async (req, res) => {
  try {
    const { data: products, error } = await supabase
      .from("products")
      .select("*");

    if (error) throw error;

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
// exports.getProductById = async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id);

//     if (product) {
//       res.status(200).json({
//         success: true,
//         product
//       });
//     } else {
//       res.status(404).json({
//         success: false,
//         message: 'Product not found'
//       });
//     }

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };
exports.getProductById = async (req, res) => {
  try {
    const { data: product, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", req.params.id)
      .single();

    if (error || !product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
// exports.createProduct = async (req, res) => {
//   try {
//     const { name, description, price, image, category, stock } = req.body;

//     const product = await Product.create({
//       name,
//       description,
//       price,
//       image,
//       category,
//       stock,
//     });

//     res.status(201).json({
//       success: true,
//       product,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, image, category, stock } = req.body;

    const { data: product, error } = await supabase
      .from("products")
      .insert([
        {
          name,
          description,
          price,
          image,
          category,
          stock,
          user_id: req.user.id,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
// exports.updateProduct = async (req, res) => {
//   try {
//     const { name, description, price, image, category, stock } = req.body;

//     const product = await Product.findById(req.params.id);

//     if (product) {
//       product.name = name || product.name;
//       product.description = description || product.description;
//       product.price = price || product.price;
//       product.image = image || product.image;
//       product.category = category || product.category;
//       product.stock = stock || product.stock;

//       const updatedProduct = await product.save();

//       res.status(200).json({
//         success: true,
//         product: updatedProduct,
//       });
//     } else {
//       res.status(404).json({
//         success: false,
//         message: "Product not found",
//       });
//     }
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };
exports.updateProduct = async (req, res) => {
  try {
    const { name, description, price, image, category, stock } = req.body;

    const { data: updatedProduct, error } = await supabase
      .from("products")
      .update({
        ...(name && { name }),
        ...(description && { description }),
        ...(price && { price }),
        ...(image && { image }),
        ...(category && { category }),
        ...(stock && { stock }),
      })
      .eq("id", req.params.id)
      .select()
      .single();

      // .eq("user_id", req.user.id) // Optional: only allow owner to update


    if (error || !updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found or update failed",
      });
    }

    res.status(200).json({ success: true, product: updatedProduct });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
// exports.deleteProduct = async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id);

//     if (product) {
//       await product.deleteOne();

//       res.status(200).json({
//         success: true,
//         message: "Product removed",
//       });
//     } else {
//       res.status(404).json({
//         success: false,
//         message: "Product not found",
//       });
//     }
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };
exports.deleteProduct = async (req, res) => {
  try {
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", req.params.id)
      // .eq("user_id", req.user.id); // Optional: only allow owner to delete

    if (error) throw error;

    res.status(200).json({ success: true, message: "Product removed" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
