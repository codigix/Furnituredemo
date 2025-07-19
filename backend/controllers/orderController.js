import supabase from "../db/supabaseClient.js";

// ✅ Create Order
export const createOrder = async (req, res) => {
  try {
    const { user_id, items, total_price, shipping_address } = req.body;

    const { data, error } = await supabase
      .from("orders")
      .insert([
        {
          user_id,
          items,
          total_price,
          shipping_address,
          status: "Pending",
        },
      ])
      .select("*")
      .single();

    if (error) throw error;

    res.status(201).json({ success: true, order: data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get My Orders
export const getMyOrders = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", req.user.id);

    if (error) throw error;

    res.json({ success: true, orders: data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get Order By ID
export const getOrderById = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", req.params.id)
      .single();

    if (error) throw error;

    res.json({ success: true, order: data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Update Order to Paid
export const updateOrderToPaid = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("orders")
      .update({ status: "Paid", paid_at: new Date() })
      .eq("id", req.params.id)
      .select("*")
      .single();

    if (error) throw error;

    res.json({ success: true, order: data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Admin: Get All Orders
export const getOrders = async (req, res) => {
  try {
    const { data, error } = await supabase.from("orders").select("*");

    if (error) throw error;

    res.json({ success: true, orders: data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
