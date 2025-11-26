import express from "express"
import { verifiJWT } from "../middlewares/auth.middleware.js";
import { followUser } from "../controllers/follow.controller.js";
const router = express.Router();



router.route("/follow/:userId").post(verifiJWT,followUser)


export default router;