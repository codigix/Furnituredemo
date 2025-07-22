import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";

// ✅ Load environment variables from .env
dotenv.config();

// ✅ Import routes
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";



// ✅ Initialize express app
const app = express();

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ CORS configuration (allow frontend origins)
app.use(
  cors({
    origin: [
      "http://localhost:5000", // Possibly backend itself?
      "http://31.97.206.36",
    ],
    credentials: true, // Allow cookies, headers, etc.
  })
);
// app.use(cors({ origin: "*", credentials: true }));

// ✅ Logging
app.use(morgan("dev"));

// ✅ Route handling
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);

// ✅ Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
