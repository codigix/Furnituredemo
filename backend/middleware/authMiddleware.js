import jwt from "jsonwebtoken";
import supabase from "../db/supabaseClient.js";


// ✅ Protect Middleware
export const protect = async (req, res, next) => {
  try {
    let token;

    // Get token from header (Bearer <token>)
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

    // ✅ Decode JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Fetch user from Supabase
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

    // ✅ Attach user to request
    req.user = {
      id: user.id,
      isAdmin: user.is_admin === true, // Ensure boolean
    };

    next();
  } catch (err) {
    console.error("Protect middleware error:", err.message);
    return res.status(401).json({
      success: false,
      message: "Not authorized to access this route",
    });
  }
};

// ✅ Admin Middleware
export const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin === true) {
    next();
  } else {
    res.status(401).json({
      success: false,
      message: "Not authorized as admin",
    });
  }
};
