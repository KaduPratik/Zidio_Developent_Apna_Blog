import { Blog } from "../models/blog.model.js";
import Comment from "../models/comment.model.js";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/dataUri.js";

// Create a new blog post
export const createBlog = async (req, res) => {
  try {
    const { title, category } = req.body;
    if (!title || !category) {
      return res.status(400).json({
        success: false,
        message: "Blog title and category are required.",
      });
    }

    const blog = await Blog.create({
      title,
      category,
      author: req.id,
    });

    return res.status(201).json({
      success: true,
      blog,
      message: "Blog created successfully.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to create blog",
      error: error.message,
    });
  }
};

// Update a blog post
export const updateBlog = async (req, res) => {
  try {
    const blogId = req.params.blogId;
    const { title, subtitle, description, category } = req.body;
    const file = req.file;

    let blog = await Blog.findById(blogId);
    if (!blog)
      return res
        .status(404)
        .json({ success: false, message: "Blog not found!" });

    let thumbnail;
    if (file) {
      const fileUri = getDataUri(file).content; // <- fixed here
      const uploadResult = await cloudinary.uploader.upload(fileUri, {
        folder: "blog_thumbnails",
      });
      thumbnail = uploadResult.secure_url;
    }

    const updateData = {
      title,
      subtitle,
      description,
      category,
      author: req.id,
    };
    if (thumbnail) updateData.thumbnail = thumbnail;

    blog = await Blog.findByIdAndUpdate(blogId, updateData, { new: true });

    return res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      blog,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error updating blog",
      error: error.message,
    });
  }
};

// Get all blogs
export const getAllBlogs = async (_, res) => {
  try {
    const blogs = await Blog.find()
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "firstName lastName photoUrl" })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: { path: "userId", select: "firstName lastName photoUrl" },
      });

    res.status(200).json({ success: true, blogs });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error fetching blogs",
      error: error.message,
    });
  }
};

// Get published blogs
export const getPublishedBlog = async (_, res) => {
  try {
    const blogs = await Blog.find({ isPublished: true })
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "firstName lastName photoUrl" })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: { path: "userId", select: "firstName lastName photoUrl" },
      });

    if (!blogs.length)
      return res.status(404).json({
        success: false,
        message: "No published blogs found",
      });

    return res.status(200).json({ success: true, blogs });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to get published blogs",
      error: error.message,
    });
  }
};

// Toggle publish/unpublish blog
export const togglePublishBlog = async (req, res) => {
  try {
    const { blogId } = req.params;
    const { publish } = req.query; // "true" or "false"

    const blog = await Blog.findById(blogId);
    if (!blog)
      return res
        .status(404)
        .json({ success: false, message: "Blog not found!" });

    if (publish === "true") blog.isPublished = true;
    else if (publish === "false") blog.isPublished = false;
    else blog.isPublished = !blog.isPublished;

    await blog.save();

    return res.status(200).json({
      success: true,
      message: `Blog is ${blog.isPublished ? "Published" : "Unpublished"}`,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to update status",
      error: error.message,
    });
  }
};

// Get blogs authored by the logged-in user
export const getOwnBlogs = async (req, res) => {
  try {
    const userId = req.id;
    if (!userId)
      return res
        .status(400)
        .json({ success: false, message: "User ID is required." });

    const blogs = await Blog.find({ author: userId })
      .populate({ path: "author", select: "firstName lastName photoUrl" })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: { path: "userId", select: "firstName lastName photoUrl" },
      });

    if (!blogs.length)
      return res
        .status(404)
        .json({ success: false, message: "No blogs found.", blogs: [] });

    return res.status(200).json({ success: true, blogs });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error fetching blogs",
      error: error.message,
    });
  }
};

// Delete a blog
export const deleteBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const authorId = req.id;

    const blog = await Blog.findById(blogId);
    if (!blog)
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });
    if (blog.author.toString() !== authorId)
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized to delete this blog" });

    await Blog.findByIdAndDelete(blogId);
    await Comment.deleteMany({ postId: blogId });

    return res
      .status(200)
      .json({ success: true, message: "Blog deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error deleting blog",
      error: error.message,
    });
  }
};

// Like a blog
export const likeBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const userId = req.id;

    const blog = await Blog.findById(blogId);
    if (!blog)
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });

    await blog.updateOne({ $addToSet: { likes: userId } });

    return res.status(200).json({ success: true, message: "Blog liked" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error liking blog",
      error: error.message,
    });
  }
};

// Dislike a blog
export const dislikeBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const userId = req.id;

    const blog = await Blog.findById(blogId);
    if (!blog)
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });

    await blog.updateOne({ $pull: { likes: userId } });

    return res.status(200).json({ success: true, message: "Blog disliked" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error disliking blog",
      error: error.message,
    });
  }
};

// Get total likes on all blogs of the logged-in user
export const getMyTotalBlogLikes = async (req, res) => {
  try {
    const userId = req.id;
    const myBlogs = await Blog.find({ author: userId }).select("likes");

    const totalLikes = myBlogs.reduce(
      (acc, blog) => acc + (blog.likes?.length || 0),
      0
    );

    return res.status(200).json({
      success: true,
      totalBlogs: myBlogs.length,
      totalLikes,
    });
  } catch (error) {
    console.error("Error getting total blog likes:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch total blog likes",
      error: error.message,
    });
  }
};
