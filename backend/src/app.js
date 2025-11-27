import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./routes/user.route.js";
import followRouter from "./routes/follow.route.js"
import postRouter from "./routes/post.router.js"
import commentRouter from "./routes/comment.route.js"
dotenv.config();

const app = express();

//middlewares
// Enhanced CORS configuration
app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:5174', 'http://127.0.0.1:5174'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    exposedHeaders: ['Set-Cookie'],
    preflightContinue: false,
    optionsSuccessStatus: 204
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        message: err.message || 'Internal server error',
        success: false,
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

// routing congigutration
app.use("/api/v1/user", userRouter);
app.use("/api/v1", followRouter);
app.use("/api/v1/post", postRouter);
app.use("/api/v1/comment", commentRouter);

export default app;
