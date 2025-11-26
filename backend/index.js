import dotenv from "dotenv";
// Load environment variables FIRST, before any other imports
dotenv.config();

import app from "./src/app.js"
import connectDB from "./src/db/connectDB.js";

const PORT = process.env.PORT || 5000;

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(` Server is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.log(" Database connection failed:", error);
    });