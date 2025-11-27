import { response } from "express";
import { PostUser } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

/// this is for token generated .
const tokenGenerated = async (id) => {
  const serUser = await PostUser.findById(id);
  const token = await serUser.generateToken();
  return token;
};

export const registerUser = asyncHandler(async (req, res, next) => {
  console.log("Register request body:", req.body);
  const { username, email, password, bio } = req.body;
  const avatar = req.file?.path;
  console.log("Avatar path:", avatar);

  // Only username, email, and password are required
  if (!username || !password || !email) {
    console.log("Validation failed: Missing required fields");
    return res.status(400).json({
      message: "Username, email, and password are required",
      success: false,
    });
  }

  const existingUser = await PostUser.findOne({ email });
  if (existingUser) {
    console.log("Validation failed: Email already exists:", email);
    return res.status(400).json({
      message: "User with this email already exists",
      success: false,
    });
  }

  const existingUsername = await PostUser.findOne({ username });
  if (existingUsername) {
    console.log("Validation failed: Username already exists:", username);
    return res.status(400).json({
      message: "User with this username already exists",
      success: false,
    });
  }

  // Upload avatar only if provided
  let avatarUrl = "";
  if (avatar) {
    console.log("Uploading avatar to Cloudinary...");
    const response = await uploadOnCloudinary(avatar);
    if (response) {
      avatarUrl = response.url;
      console.log("Avatar uploaded:", avatarUrl);
    } else {
      console.log("Avatar upload failed or returned null");
    }
  }

  console.log("Creating user in database...");
  const user = await PostUser.create({
    username,
    password,
    bio: bio || "",
    email,
    avatar: avatarUrl,
  });
  console.log("User created:", user._id);

  // Generate token and set cookie
  const token = await tokenGenerated(user._id);
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  };

  const userWithoutPassword = await PostUser.findById(user._id).select("-password");

  return res.status(201).cookie("token", token, options).json({
    message: "User successfully created",
    success: true,
    data: {
      user: userWithoutPassword,
    },
  });
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Fixed validation logic
  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required",
      success: false,
    });
  }

  const user = await PostUser.findOne({ email });
  if (!user) {
    return res.status(401).json({
      message: "Invalid email or password",
      success: false,
    });
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    return res.status(401).json({
      message: "Invalid email or password",
      success: false,
    });
  }

  const token = await tokenGenerated(user._id);
  const userWithoutPassword = await PostUser.findById(user._id).select("-password");

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  };

  return res.status(200).cookie("token", token, options).json({
    message: "Login successful",
    success: true,
    data: {
      user: userWithoutPassword,
    },
  });
});

export const logoutUser = asyncHandler((req, res) => {
  let options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  };
  res.status(200).clearCookie("token", options).json({
    message: "User logged out successfully",
    success: true,
  });
});

export const getCurrent = asyncHandler((req, res) => {
  res.status(200).json({
    message: "Current user profile",
    success: true,
    data: req.user,
  });
});

// Get user profile by ID
export const getUserProfile = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await PostUser.findById(userId).select("-password");
  if (!user) {
    return res.status(404).json({
      message: "User not found",
      success: false,
    });
  }

  return res.status(200).json({
    message: "User profile fetched successfully",
    success: true,
    data: user,
  });
});

// Update user profile
export const updateUserProfile = asyncHandler(async (req, res) => {
  const { username, bio } = req.body;
  const avatar = req.file?.path;

  const updateData = {};

  if (username) updateData.username = username;
  if (bio !== undefined) updateData.bio = bio;

  // Upload new avatar if provided
  if (avatar) {
    const response = await uploadOnCloudinary(avatar);
    if (response) {
      updateData.avatar = response.url;
    }
  }

  const updatedUser = await PostUser.findByIdAndUpdate(
    req.user._id,
    updateData,
    { new: true }
  ).select("-password");

  return res.status(200).json({
    message: "Profile updated successfully",
    success: true,
    data: updatedUser,
  });
});