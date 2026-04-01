import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";

// 👇 Import routes
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js"

const app = express();
const port = process.env.PORT || 4000;

// DB & Cloudinary connect
connectDB();
connectCloudinary();

// Middlewares
app.use(express.json());
app.use(cors());

// 👇 Use Routes
app.use("/api/user", userRouter);
app.use('/api/product',productRouter)

// Test API
app.get("/", (req, res) => {
  res.send("API Working");
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});