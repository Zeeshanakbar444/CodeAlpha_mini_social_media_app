import express from "express"
import { createPost, deletePost, getPost, getSinglePost, likeOrUnlike, updatePost, getUserPosts } from "../controllers/post.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifiJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.route("/get").get(getPost);
router.route("/create-post").post(upload.single("image"), verifiJWT, createPost);
router.route("/delete-post/:id").delete(verifiJWT, deletePost);
router.route("/single-post/:id").get(verifiJWT, getSinglePost);
router.route("/update-post/:id").post(upload.single('image'), verifiJWT, updatePost);
router.route("/like/:id").post(verifiJWT, likeOrUnlike);
router.route("/user/:userId").get(getUserPosts);
export default router;