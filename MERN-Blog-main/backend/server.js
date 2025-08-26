import express from "express";
import dotenv from "dotenv";
import connectDB from "./database/db.js";
import userRoute from "./routes/user.route.js";
import blogRoute from "./routes/blog.route.js";
import commentRoute from "./routes/comment.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

dotenv.config();
console.log("JWT_SECRET:", process.env.JWT_SECRET);

const app = express();

const PORT = process.env.PORT || 3000;

// default middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// CORS middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173", // local dev
      "https://apnaablog.netlify.app", // Netlify frontend
      "https://apna-blog-4k8w.onrender.com", // Render frontend
    ],
    credentials: true,
  })
);

// ✅ Handle preflight OPTIONS requests
app.options(
  "*",
  cors({
    origin: [
      "http://localhost:5173",
      "https://apnaablog.netlify.app",
      "https://apna-blog-4k8w.onrender.com",
    ],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

const _dirname = path.resolve();

// apis
app.use("/api/v1/user", userRoute);
app.use("/api/v1/blog", blogRoute);
app.use("/api/v1/comment", commentRoute);

app.use(express.static(path.join(_dirname, "/frontend/dist")));
app.get("*", (_, res) => {
  res.sendFile(path.resolve(_dirname, "frontend", "dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server listen at port ${PORT}`);
  connectDB();
});
