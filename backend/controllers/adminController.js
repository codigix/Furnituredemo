const supabase = require("../db/supabaseClient");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// @desc    Login Admin & get token
// @route   POST /api/admin/login
// @access  Public
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Fetch user by email
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .eq("is_admin", true)  // ensure only admin can login here
      .single();

    if (error || !user) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin credentials",
      });
    }

    // 2. Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin credentials",
      });
    }

    // 3. Generate token
    const token = generateToken(user.id);

    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.is_admin,
      },
      token,
    });
  } catch (error) {
    console.error("Admin Login Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Admin login failed",
      error: error.message,
    });
  }
};
