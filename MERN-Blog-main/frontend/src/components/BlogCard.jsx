import React from "react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

const BlogCard = ({ blog }) => {
  const navigate = useNavigate();

  // Handle missing createdAt safely
  const date = blog?.createdAt ? new Date(blog.createdAt) : null;
  const formattedDate = date ? date.toLocaleDateString("en-GB") : "N/A";

  return (
    <div className="bg-white dark:bg-gray-800 dark:border-gray-600 p-5 rounded-2xl shadow-lg border hover:scale-105 transition-all">
      {/* Thumbnail */}
      {blog?.thumbnail ? (
        <img
          src={blog.thumbnail}
          alt={blog.title || "Blog thumbnail"}
          className="rounded-lg w-full h-48 object-cover"
        />
      ) : (
        <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-500">
          No Image
        </div>
      )}

      {/* Meta Info */}
      <p className="text-sm mt-2 text-gray-600 dark:text-gray-300">
        By {blog?.author?.firstName || "Unknown"} |{" "}
        {blog?.category || "General"} | {formattedDate}
      </p>

      {/* Title */}
      <h2 className="text-xl font-semibold mt-1 line-clamp-2">{blog?.title}</h2>

      {/* Subtitle */}
      {blog?.subtitle && (
        <h3 className="text-gray-500 mt-1 line-clamp-2">{blog.subtitle}</h3>
      )}

      {/* Tags (optional) */}
      {blog?.tags?.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {blog.tags.map((tag, index) => (
            <span
              key={index}
              className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Read More Button */}
      <Button
        onClick={() => navigate(`/blogs/${blog._id}`)}
        className="mt-4 px-4 py-2 rounded-lg text-sm"
      >
        Read More
      </Button>
    </div>
  );
};

export default BlogCard;
