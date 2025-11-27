import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

const configureCloudinary = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
};

const uploadOnCloudinary = async (localFilePath) => {
  try {
    // Configure Cloudinary on first use (lazy initialization)
    configureCloudinary();

    if (!localFilePath) {
      console.log(" No file path provided");
      return null;
    }

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    console.log(" File uploaded successfully to Cloudinary:", response.url);

    // Remove local file after successful upload
    fs.unlinkSync(localFilePath);
    return response;
  }
  catch (error) {
    console.error("Cloudinary upload failed:", error);
    // Remove local file even if upload fails
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    return null;
  }
};

export { uploadOnCloudinary };