import express from "express";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import { singleUpload } from "../middleware/multer.js";
import {
  createBlog,
  deleteBlog,
  dislikeBlog,
  getAllBlogs,
  getMyTotalBlogLikes,
  getOwnBlogs,
  getPublishedBlog,
  likeBlog,
  togglePublishBlog,
  updateBlog,
} from "../controllers/blog.controller.js";

const router = express.Router();

// Create blog
router.route("/").post(isAuthenticated, createBlog);

// Update blog (with file upload)
router.route("/:blogId").put(isAuthenticated, singleUpload, updateBlog);

// Toggle publish/unpublish
router.route("/:blogId").patch(isAuthenticated, togglePublishBlog);

// Get all blogs
router.route("/get-all-blogs").get(getAllBlogs);

// Get published blogs
router.route("/get-published-blogs").get(getPublishedBlog);

// Get user's own blogs
router.route("/get-own-blogs").get(isAuthenticated, getOwnBlogs);

// Delete blog
router.route("/delete/:id").delete(isAuthenticated, deleteBlog);

// Like/dislike blog
router.get("/:id/like", isAuthenticated, likeBlog);
router.get("/:id/dislike", isAuthenticated, dislikeBlog);

// Get my total likes
router.get("/my-blogs/likes", isAuthenticated, getMyTotalBlogLikes);

export default router;
