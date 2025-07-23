const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const supabase = require("./db/supabaseClient");

// Load environment variables
dotenv.config();

// Import routes
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const orderRoutes = require("./routes/orderRoutes");
const adminRoutes = require("./routes/adminRoutes");
const cartRoutes = require("./routes/cartRoutes");

// Create Express app
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:8081",
      "http://localhost:8080",
      //  "https://furnituredemo.codigix.co"
    ], // Allow React development servers
    credentials: true,
  })
);
app.use(morgan("dev"));

// Routes
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin",adminRoutes)
app.use("/api/cart",cartRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.get("/api/check", (req,res) => {
  res.send("API is running...");
});
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: err.message,
  });
});

// // Connect to MongoDB
// mongoose
//   .connect(
//     "mongodb+srv://priyanka2307:priyanka2307@furniture.otunszi.mongodb.net/?retryWrites=true&w=majority&appName=furniture"
//   )
//   .then(() => {
//     console.log("Connected to MongoDB");
//     // Start server
//     const PORT = process.env.PORT || 5000;
//     app.listen(PORT, () => {
//       console.log(`Server running on port ${PORT}`);
//     });
//   })
//   .catch((err) => {
//     console.error("MongoDB connection error:", err.message);
//   });

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
