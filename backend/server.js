import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js"
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import adminRouter from "./routes/adminRoute.js";
import aiRouter from "./routes/aiRoute.js";

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());

// ✅ Configure CORS for Production and Local Development
const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.ADMIN_URL,
  'https://voluble-kitten-499017.netlify.app',
  'http://localhost:5173',
  'http://localhost:5174',
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests (e.g. mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);

    // If wildcard or no restricted origins specified, allow all
    if (allowedOrigins.length === 0 || allowedOrigins.includes('*')) {
      return callback(null, true);
    }

    // Support comma-separated URLs in FRONTEND_URL or ADMIN_URL
    const parsedOrigins = allowedOrigins.flatMap((item) =>
      item.split(',').map((url) => url.trim().replace(/\/+$/, ''))
    );

    const normalizedOrigin = origin.replace(/\/+$/, '');

    if (parsedOrigins.includes(normalizedOrigin) || parsedOrigins.includes('*')) {
      return callback(null, true);
    }

    // Default allow to ensure manual deployments are never blocked
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'token', 'Authorization'],
  credentials: true,
}));

// Serve static product images
app.use('/images', express.static(path.join(__dirname, 'uploads', 'images')));

app.use("/api/user", userRouter);
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/order', orderRouter)
app.use('/api/admin', adminRouter)
app.use('/api/ai', aiRouter)

app.get("/", (req, res) => {
  res.send("API Working");
});

const startServer = async () => {
  try {
    await connectDB();
    await connectCloudinary();
    
    app.listen(port, '0.0.0.0', () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to connect to database. Server not started.", error);
    process.exit(1);
  }
};

startServer();