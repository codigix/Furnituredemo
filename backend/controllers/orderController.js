// const Order = require('../models/orderModel');
// const Product = require('../models/productModel');
const supabase = require("../db/supabaseClient");

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
// exports.createOrder = async (req, res) => {
//   try {
//     const { items, shippingAddress, total } = req.body;

//     if (items && items.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: 'No order items'
//       });
//     }

//     const order = await Order.create({
//       user: req.user._id,
//       items,
//       shippingAddress,
//       total
//     });

//     res.status(201).json({
//       success: true,
//       order
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

exports.createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, total } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No order items",
      });
    }

    // Step 1: Insert into orders table
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert([
        {
          user_id: req.user.id,
          shipping_name: shippingAddress.name,
          shipping_address: shippingAddress.address,
          shipping_city: shippingAddress.city,
          shipping_postal_code: shippingAddress.postalCode,
          shipping_country: shippingAddress.country,
          total,
          status: "pending",
        },
      ])
      .select()
      .single();

    if (orderError) throw orderError;

    // Step 2: Insert all items into order_items table
    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: item.product,
      name: item.name,
      quantity: item.quantity,
      image: item.image,
      price: item.price,
    }));

    const { error: itemError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemError) throw itemError;

    // Success response
    res.status(201).json({
      success: true,
      message: "Order created successfully",
      orderId: order.id,
    });
  } catch (error) {
    console.error("Order creation failed:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: error.message,
    });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
// exports.getOrderById = async (req, res) => {
//   try {
//     const order = await Order.findById(req.params.id).populate(
//       "user",
//       "name email"
//     );

//     if (order) {
//       // Only allow admin or the user who placed the order to view it
//       if (
//         req.user.isAdmin ||
//         order.user._id.toString() === req.user._id.toString()
//       ) {
//         res.status(200).json({
//           success: true,
//           order,
//         });
//       } else {
//         res.status(401).json({
//           success: false,
//           message: "Not authorized to view this order",
//         });
//       }
//     } else {
//       res.status(404).json({
//         success: false,
//         message: "Order not found",
//       });
//     }
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };
exports.getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;

    // Step 1: Get order details with user info
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select(
        `
        *,
        users(id, name, email)
        `
      )
      .eq("id", orderId)
      .single();

    if (orderError || !order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Step 2: Check if the user is owner or admin
    if (!req.user.isAdmin && order.user_id !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to view this order",
      });
    }

    // Step 3: Get order items
    const { data: items, error: itemsError } = await supabase
      .from("order_items")
      .select("*")
      .eq("order_id", orderId);

    if (itemsError) throw itemsError;

    // Final response
    res.status(200).json({
      success: true,
      order: {
        ...order,
        items,
      },
    });
  } catch (error) {
    console.error("Get Order Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch order",
      error: error.message,
    });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
// exports.getUserOrders = async (req, res) => {
//   try {
//     const orders = await Order.find({ user: req.user._id });

//     res.status(200).json({
//       success: true,
//       count: orders.length,
//       orders,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

exports.getUserOrders = async (req, res) => {
  try {
    // Step 1: Fetch all orders by current user
    const { data: orders, error: ordersError } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", req.user.id)
      .order("created_at", { ascending: false });

    if (ordersError) {
      throw ordersError;
    }

    // Step 2: For each order, fetch its items
    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const { data: items, error: itemsError } = await supabase
          .from("order_items")
          .select("*")
          .eq("order_id", order.id);

        if (itemsError) throw itemsError;

        return {
          ...order,
          items,
        };
      })
    );

    // Step 3: Return all user's orders
    res.status(200).json({
      success: true,
      count: ordersWithItems.length,
      orders: ordersWithItems,
    });
  } catch (error) {
    console.error("Get User Orders Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user orders",
      error: error.message,
    });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
// exports.getOrders = async (req, res) => {
//   try {
//     const orders = await Order.find({}).populate("user", "id name");

//     res.status(200).json({
//       success: true,
//       count: orders.length,
//       orders,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };
exports.getOrders = async (req, res) => {
  try {
    // Step 1: Fetch all orders, joined with user info
    const { data: orders, error: ordersError } = await supabase
      .from("orders")
      .select(
        `
        *,
        users (
          id,
          name,
          email
        )
      `
      )
      .order("created_at", { ascending: false });

    if (ordersError) throw ordersError;

    // Step 2: Fetch items for each order
    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const { data: items, error: itemsError } = await supabase
          .from("order_items")
          .select("*")
          .eq("order_id", order.id);

        if (itemsError) throw itemsError;

        return {
          ...order,
          items,
        };
      })
    );

    // Step 3: Return all orders with items and user info
    res.status(200).json({
      success: true,
      count: ordersWithItems.length,
      orders: ordersWithItems,
    });
  } catch (error) {
    console.error("Get All Orders Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
// exports.updateOrderStatus = async (req, res) => {
//   try {
//     const { status } = req.body;

//     const order = await Order.findById(req.params.id);

//     if (order) {
//       order.status = status;

//       const updatedOrder = await order.save();

//       res.status(200).json({
//         success: true,
//         order: updatedOrder,
//       });
//     } else {
//       res.status(404).json({
//         success: false,
//         message: "Order not found",
//       });
//     }
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };
exports.updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  const orderId = req.params.id;

  try {
    // Validate status value
    const allowedStatuses = ["pending", "shipped", "delivered"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    // Update order status
    const { data: updatedOrder, error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", orderId)
      .select()
      .maybeSingle();

    if (error) throw error;

    res.status(200).json({
      success: true,
      order: updatedOrder,
      message: `Order status updated to '${status}'`,
    });
  } catch (error) {
    console.error("Update Order Status Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to update order status",
      error: error.message,
    });
  }
};
