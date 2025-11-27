import express from "express"
import { verifiJWT } from "../middlewares/auth.middleware.js";
import { getComment, createComment, deleteComment } from "../controllers/comment.controller.js";

const router = express.Router();


router.route("/get-comment/:postId").get(verifiJWT, getComment);
router.route("/create-comment/:postId").post(verifiJWT, createComment);
router.route("/delete-comment/:id").delete(verifiJWT, deleteComment);
export default router;