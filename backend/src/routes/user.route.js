import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { loginUser, logoutUser, getCurrent, registerUser, getUserProfile, updateUserProfile } from "../controllers/user.controller.js";
import { verifiJWT } from "../middlewares/auth.middleware.js";
const router = Router();

router.route("/register").post(upload.single("avatar"), registerUser);
router.route("/login").post(loginUser)
router.route("/logout").post(verifiJWT, logoutUser)
router.route("/me").get(verifiJWT, getCurrent)
router.route("/profile/:userId").get(getUserProfile)
router.route("/profile").put(upload.single("avatar"), verifiJWT, updateUserProfile)

export default router;