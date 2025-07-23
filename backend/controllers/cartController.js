const supabase = require("../db/supabaseClient");

// @desc Add item to cart
// @route POST /api/cart
// @access Private
exports.addToCart = async (req, res) => {
  const { product_id, quantity } = req.body;

  if (!product_id || !quantity) {
    return res.status(400).json({ success: false, message: "Missing fields" });
  }

  try {
    // Check if product already exists in cart
    const { data: existingCart, error: fetchError } = await supabase
      .from("carts")
      .select("*")
      .eq("user_id", req.user.id)
      .eq("product_id", product_id)
      .maybeSingle();

    if (fetchError) throw fetchError;

    if (existingCart) {
      // Update quantity if exists
      const { error: updateError } = await supabase
        .from("carts")
        .update({ quantity: existingCart.quantity + quantity })
        .eq("id", existingCart.id);

      if (updateError) throw updateError;
    } else {
      // Insert new cart item
      const { error: insertError } = await supabase.from("carts").insert([
        {
          user_id: req.user.id,
          product_id,
          quantity,
        },
      ]);

      if (insertError) throw insertError;
    }

    res.status(200).json({ success: true, message: "Item added to cart" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get cart items
// @route GET /api/cart
// @access Private
exports.getCart = async (req, res) => {
  try {
    const { data: cartItems, error } = await supabase
      .from("carts")
      .select(
        `
        *,
        products (
          id,
          name,
          price,
          image,
          stock
        )
      `
      )
      .eq("user_id", req.user.id);

    if (error) throw error;

    res.status(200).json({ success: true, cart: cartItems });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Update cart item quantity
// @route PUT /api/cart/:id
// @access Private

exports.updateCartItem = async (req, res) => {
  const {quantity} = req.body;
  const cartItemId = req.params.id;

  if (!quantity || quantity <= 0) {
    return res
      .status(400)
      .json({ success: false, message: "invalid quantity" });
  }

  try {
    const { error } = await supabase
      .from("carts")
      .update({ quantity })
      .eq("id", cartItemId)
      .eq("user_id", req.user.id);

    if (error) throw error;

    res.status(200).json({ success: true, message: "cart Updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Delete cart item
// @route DELETE /api/cart/:id
// @access Private
exports.removeCartItem = async (req, res) => {
  const cartItemId = req.params.id;
  try {
    const { error } = await supabase
      .from("carts")
      .delete()
      .eq("id", cartItemId)
      .eq("user_id", req.user.id);

    if (error) throw error;

    res.status(200).json({ success: true, message: "Item Removed from cart" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// (Optional)
// @desc Clear all cart items
// @route DELETE /api/cart
// @access Private
exports.clearCart = async (req, res) => {
  try {
    const { error } = await supabase
      .from("carts")
      .delete()
      .eq("user_id", req.user.id);

    if (error) throw error;

    res.status(200).json({ success: true, message: "Cart cleared" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
