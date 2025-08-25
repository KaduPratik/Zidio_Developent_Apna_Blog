import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// ensure env variables are loaded
dotenv.config();

export const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: "User not authenticated",
        success: false,
      });
    }

    // ✅ use the correct variable from .env
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({
        message: "Invalid token",
        success: false,
      });
    }

    // attach user id to request for later use
    req.id = decoded.userId;
    next();
  } catch (error) {
    console.error("JWT verify error:", error.message);
    return res.status(401).json({
      message: "Authentication failed",
      success: false,
    });
  }
};
