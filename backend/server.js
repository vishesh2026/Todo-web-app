import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import userRouter from "./routes/userRoute.js";
import taskRouter from "./routes/taskRoute.js";
import boardRouter from "./routes/boardRoute.js";
import forgotPasswordRouter from "./routes/forgotPassword.js";

// App config
dotenv.config();
const app = express();
const port = process.env.PORT || 8000;

// Middlewares
app.use(express.json());
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://todo-web-app-git-main-vishesh2026s-projects.vercel.app",
  ],
  credentials: true,
}));

// Request logging middleware (development)
if (process.env.NODE_ENV === 'development') {
    app.use((req, res, next) => {
        console.log(`${req.method} ${req.path}`);
        next();
    });
}

// Database config
mongoose.set('strictQuery', true);

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("✅ MongoDB Connected Successfully");
    } catch (err) {
        console.error("❌ MongoDB Connection Error:", err.message);
        process.exit(1);
    }
};

connectDB();

// API endpoints
app.get("/", (req, res) => {
    res.json({ 
        message: "Todo App API is running", 
        version: "2.0.0",
        endpoints: {
            users: "/api/user",
            boards: "/api/board",
            tasks: "/api/task",
            auth: "/api/auth"
        }
    });
});

app.use("/api/user", userRouter);
app.use("/api/board", boardRouter);
app.use("/api/task", taskRouter);
app.use("/api/auth", forgotPasswordRouter);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        message: "Something went wrong!", 
        error: process.env.NODE_ENV === 'development' ? err.message : undefined 
    });
});

// Listen
app.listen(port, () => {
    console.log(`🚀 Server listening on http://localhost:${port}`);
    console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
});