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
  const { username, email, password, bio } = req.body;
  const avatar = req.file?.path;

  if (!username || !password || !email || !bio) {
    return res.status(400).json({
      message: "all fields are required",
      success: false,
    });
  }

  const existingUser = await PostUser.findOne({ email });
  if (existingUser) {
    return res.status(400).json({
      message: "User with this email already exist",
      success: false,
    });
  }
  if (!avatar) {
    return res.status(400).json({
      message: "avatar file is required",
      success: false,
    });
  }

  const response = await uploadOnCloudinary(avatar);
  if (!response) {
    return res.status(400).json({
      message: "file is not uploaded successfully",
      success: false,
    });
  }

  const user = await PostUser.create({
    username,
    password,
    bio,
    email,
    avatar: response?.url,
  });

  return res.status(200).json({
    message: "User Successfullly created",
    success: true,
    user: {
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    },
  });
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if ((!email, !password)) {
    return res.status(400).json({
      message: "both field are required",
      success: false,
    });
  }
  const user = await PostUser.findOne({ email });
  if (!user) {
    return res.status(400).json({
      message: "user Not Found",
      success: false,
    });
  }
  let passCom = await user.comparePassword(password, user.password);
  if (!passCom) {
    return res.status(400).json({
      message: "password not matched",
      success: false,
    });
  }

  let token = await tokenGenerated(user._id);
  let getUser = await PostUser.findById(user._id).select("-password");
  let options = {
    httpOnly: true,
    secure: true,
  };
  return res.status(200).cookie("token", token, options).json({
    message: "user Login Successfully",
    success: true,
  });
});

export const logoutUser = asyncHandler((req, res) => {
  let options = {
    httpOnly: true,
    secure: true,
  };
  res.status(200).clearCookie("token", options).json({
    message: "user logout successfully",
    success: true,
    user: req.user,
  });
});

export const getCurrent  = asyncHandler((req,res)=>{
    res.status(200).json({
        message:"current user profile",
        success:true,
        user:req.user
    })
})