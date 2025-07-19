import supabase from "../db/supabaseClient.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data: admin, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .eq("is_admin", true)
      .single();

    if (error || !admin) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    res.json({
      success: true,
      token: generateToken(admin.id),
      admin,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
