const { log } = require("console");
const supabase = require("../db/supabaseClient");
// const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
// exports.registerUser = async (req, res) => {

//   try {
//     const { name, email, password } = req.body;
//     console.log("--",name)

//     // Check if user already exists
//     const userExists = await User.findOne({ email });

//     if (userExists) {
//       return res.status(400).json({
//         success: false,
//         message: 'User already exists'
//       });
//     }

//     // Create new user
//     const user = await User.create({
//       name,
//       email,
//       password
//     });

//     if (user) {
//       res.status(201).json({
//         success: true,
//         message: 'User registered successfully'
//       });
//     } else {
//       res.status(400).json({
//         success: false,
//         message: 'Invalid user data'
//       });
//     }

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log(req.body);
    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    //check for existing user
    const { data: existingUser } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Insert user
    const { data: newUser, error } = await supabase
      .from("users")
      .insert([{ name, email, password: hashedPassword }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Login user & get token
// @route   POST /api/users/login
// @access  Public
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

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
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Google Auth user & get token
// @route   POST /api/users/google-auth
// @access  Public
exports.googleAuthUser = async (req, res) => {
  try {
    const { tokenId } = req.body;

    const email = `google_user_${Date.now()}@example.com`;
    const name = "Google User";

    let { data: user } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (!user) {
      const password =
        Math.random().toString(36).slice(-8) + Date.now().toString();

      const hashedPassword = await bcrypt.hash(password, 12);

      const result = await supabase
        .from("users")
        .insert([{ name, email, password: hashedPassword }])
        .select()
        .single();

      if (result.error) throw result.error;
      user = result.data;
    }

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
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
exports.getUserProfile = async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", req.user.id)
      .single();

    if (error || !user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.is_admin,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private

// exports.updateUserProfile = async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id);

//     if (user) {
//       user.name = req.body.name || user.name;
//       user.email = req.body.email || user.email;

//       if (req.body.password) {
//         user.password = req.body.password;
//       }

//       const updatedUser = await user.save();

//       res.status(200).json({
//         success: true,
//         user: {
//           id: updatedUser._id,
//           name: updatedUser.name,
//           email: updatedUser.email,
//           isAdmin: updatedUser.isAdmin,
//         },
//       });
//     } else {
//       res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// exports.updateUserProfile = async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     const updates = {
//       ...(name && { name }),
//       ...(email && { email }),
//     };

//     if (password) {
//       updates.password = await bcrypt.hash(password, 12);
//     }

//     const { data: updatedUser, error } = await supabase
//       .from("users")
//       .update(updates)
//       .eq("id", req.user.id)
//       .select()
//       .single();

//     if (error || !updatedUser) {
//       return res
//         .status(404)
//         .json({ success: false, message: "User not found or update failed" });
//     }

//     res.status(200).json({
//       success: true,
//       user: {
//         id: updatedUser.id,
//         name: updatedUser.name,
//         email: updatedUser.email,
//         isAdmin: updatedUser.is_admin,
//       },
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// exports.updateUserProfile = async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     // Log the incoming data
//     console.log("Incoming update data:", req.body);
//     console.log("Authenticated user ID:", req.user.id);

//     // Build update object safely
//     const updates = {};
//     if (name !== undefined) updates.name = name;
//     if (email !== undefined) updates.email = email;
//     if (password) {
//       if (password.length < 6) {
//         return res.status(400).json({
//           success: false,
//           message: "Password must be at least 6 characters long",
//         });
//       }
//       updates.password = await bcrypt.hash(password, 12);
//     }

//     if (Object.keys(updates).length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "No valid fields provided for update",
//       });
//     }

//     // Perform update
//     const { data: updatedUser, error } = await supabase
//       .from("users")
//       .update(updates)
//       .eq("id", req.user.id)
//       .select()
//       .single();

//     console.log("Supabase response:", updatedUser, error);

//     if (error || !updatedUser) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found or update failed",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       user: {
//         id: updatedUser.id,
//         name: updatedUser.name,
//         email: updatedUser.email,
//         isAdmin: updatedUser.is_admin,
//       },
//     });
//   } catch (error) {
//     console.error("Update Error:", error.message);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

exports.updateUserProfile = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    console.log("Incoming data:", req.body);
    console.log("Current User ID:", req.user.id);

    const updates = {};
    if (name) updates.name = name;
    if (email) updates.email = email;
    if (password) {
      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: "Password must be at least 6 characters long",
        });
      }
      updates.password = await bcrypt.hash(password, 12);
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No update data provided",
      });
    }

    const { data, error } = await supabase
      .from("users")
      .update(updates)
      .eq("id", req.user.id)
      .select()
      .maybeSingle();
    // .single();

    if (error) {
      console.error("Supabase error:", error);
      return res.status(400).json({
        success: false,
        message: "Update failed",
      });
    }
    if (!data) {
      return res.status(200).json({
        success: true,
        message: "No changes made",
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        isAdmin: data.is_admin,
      },
    });
  } catch (err) {
    console.error("Server error:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
exports.getUsers = async (req, res) => {
  try {
    const { data: users, error } = await supabase.from("users").select("*");

    if (error) throw error;

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
