const jwt = require("jsonwebtoken");
const supabase = require("../db/supabaseClient");

// Protect Middleware
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Get token from header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to access this route",
      });
    }

    // Decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Fetch user from Supabase using decoded ID
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", decoded.id)
      .single();

    if (error || !user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Attach user to request
    // req.user = user;
    req.user = {
      id: user.id,
      isAdmin: user.is_admin,
    };
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Not authorized to access this route",
    });
  }
};

// 🛡️ Admin Middleware
// exports.admin = (req, res, next) => {
//   if (req.user && req.user.is_admin === true) {
//     next();
//   } else {
//     res.status(401).json({
//       success: false,
//       message: "Not authorized as admin",
//     });
//   }
// };

// 🛡️ Admin Middleware
exports.admin = (req, res, next) => {
  if (req.user && req.user.isAdmin === true) {
    next();
  } else {
    res.status(401).json({
      success: false,
      message: "Not authorized as admin",
    });
  }
};