import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import supabase from "../db/supabaseClient.js";

// ✅ Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// ✅ Register User
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const { data, error } = await supabase
      .from("users")
      .insert([{ name, email, password: hashedPassword }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      token: generateToken(data.id),
      user: data,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ✅ Login User
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    res.json({
      success: true,
      token: generateToken(user.id),
      user,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Get User Profile (Protected)
export const getUserProfile = async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from("users")
      .select("id, name, email, is_admin")
      .eq("id", req.user.id)
      .single();

    if (error || !user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Update User Profile (Protected)
export const updateUserProfile = async (req, res) => {
  try {
    const { name, password } = req.body;
    let updates = {};

    if (name) updates.name = name;
    if (password) updates.password = await bcrypt.hash(password, 10);

    const { data, error } = await supabase
      .from("users")
      .update(updates)
      .eq("id", req.user.id)
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, user: data });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ✅ Admin – Get All Users
export const getUsers = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("id, name, email, is_admin");

    if (error) throw error;

    res.json({ success: true, users: data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Google Auth Placeholder (Optional)
export const googleAuthUser = async (req, res) => {
  res.json({ success: true, message: "Google Auth not yet implemented" });
};
