import { v2 as cloudinary } from "cloudinary";

const connectCloudinary = async () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,  // ✅ fix
    api_key: process.env.CLOUDINARY_API_KEY,         // ✅ already sahi
    api_secret: process.env.CLOUDINARY_API_SECRET,   // ✅ fix
  });

  console.log("Cloudinary Connected");
};

export default connectCloudinary;