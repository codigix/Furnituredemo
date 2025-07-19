import supabase from "../db/supabaseClient.js";

// ✅ Get All Products
export const getProducts = async (req, res) => {
  try {
    const { data, error } = await supabase.from("products").select("*");
    if (error) throw error;

    res.json({ success: true, products: data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get Product By ID
export const getProductById = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", req.params.id)
      .single();

    if (error) throw error;

    res.json({ success: true, product: data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Create Product (Admin)
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, image, category } = req.body;

    const { data, error } = await supabase
      .from("products")
      .insert([{ name, description, price, image, category }])
      .select("*")
      .single();

    if (error) throw error;

    res.status(201).json({ success: true, product: data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Update Product (Admin)
export const updateProduct = async (req, res) => {
  try {
    const { name, description, price, image, category } = req.body;

    const { data, error } = await supabase
      .from("products")
      .update({ name, description, price, image, category })
      .eq("id", req.params.id)
      .select("*")
      .single();

    if (error) throw error;

    res.json({ success: true, product: data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Delete Product (Admin)
export const deleteProduct = async (req, res) => {
  try {
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", req.params.id);

    if (error) throw error;

    res.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
