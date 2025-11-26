import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { loginUser, logoutUser,getCurrent, registerUser } from "../controllers/user.controller.js";
import { verifiJWT } from "../middlewares/auth.middleware.js";
const router = Router();

router.route("/register").post(upload.single("avatar"), registerUser);
router.route("/login").post(loginUser)
router.route("/logout").post(verifiJWT,logoutUser)
router.route("/me").get(verifiJWT,getCurrent)

export default router;