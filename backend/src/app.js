import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.route.js";
import followRouter from "./routes/follow.route.js"
import postRouter from "./routes/post.router.js"
import commentRouter from "./routes/comment.route.js"
dotenv.config();

const app = express();

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());



// routing congigutration
app.use("/api/v1/user", userRouter);
app.use("/api/v1", followRouter);
app.use("/api/v1/post", postRouter);
app.use("/api/v1/comment", commentRouter);

export default app;
