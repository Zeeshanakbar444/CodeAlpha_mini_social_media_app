import { PostUser } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

export const verifiJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({
        message: "unauthorized access",
        success: false,
      });
    }

    const decodeToken = jwt.verify(token, process.env.JWT_SECRET);
    const user = await PostUser.findById(decodeToken._id).select("-password");
    req.user = user;
    next();
  } catch (error) {
    return res.status(599).json({
      message: "Invalid User",
      success: false,
    });
  }
});
