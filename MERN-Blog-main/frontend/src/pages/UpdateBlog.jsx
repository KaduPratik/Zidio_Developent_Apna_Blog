import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useRef, useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import JoditEditor from "jodit-react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { setBlog } from "@/redux/blogSlice";

const UpdateBlog = () => {
  const editor = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { blog } = useSelector((store) => store.blog);
  const { blogId } = useParams();

  // Find selected blog from redux store
  const selectBlog = blog.find((b) => b._id === blogId);

  // Show loading until blog data is ready
  if (!selectBlog) {
    return <div className="p-10 text-center text-xl">Loading blog data...</div>;
  }

  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState(selectBlog.description || "");
  const [publish, setPublish] = useState(selectBlog.isPublished || false);
  const [blogData, setBlogData] = useState({
    title: selectBlog.title || "",
    subtitle: selectBlog.subtitle || "",
    category: selectBlog.category || "",
    thumbnail: null,
  });
  const [previewThumbnail, setPreviewThumbnail] = useState(
    selectBlog.thumbnail || ""
  );

  // Sync state if redux blog changes
  useEffect(() => {
    setBlogData({
      title: selectBlog.title || "",
      subtitle: selectBlog.subtitle || "",
      category: selectBlog.category || "",
      thumbnail: null,
    });
    setContent(selectBlog.description || "");
    setPublish(selectBlog.isPublished || false);
    setPreviewThumbnail(selectBlog.thumbnail || "");
  }, [selectBlog]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBlogData((prev) => ({ ...prev, [name]: value }));
  };

  const selectCategory = (value) => {
    setBlogData((prev) => ({ ...prev, category: value }));
  };

  const selectThumbnail = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setBlogData((prev) => ({ ...prev, thumbnail: file }));
      const reader = new FileReader();
      reader.onloadend = () => setPreviewThumbnail(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const updateBlogHandler = async () => {
    if (!blogData.title || !blogData.category) {
      return toast.error("Title and category are required!");
    }

    const formData = new FormData();
    formData.append("title", blogData.title);
    formData.append("subtitle", blogData.subtitle);
    formData.append("description", content);
    formData.append("category", blogData.category);
    if (blogData.thumbnail instanceof File) {
      formData.append("file", blogData.thumbnail);
    }

    try {
      setLoading(true);
      const res = await axios.put(
        `https://apna-blog-4k8w.onrender.com/api/v1/blog/${blogId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        const updatedBlogData = blog.map((b) =>
          b._id === blogId ? res.data.blog : b
        );
        dispatch(setBlog(updatedBlogData));
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update blog");
    } finally {
      setLoading(false);
    }
  };

  const togglePublishUnpublish = async () => {
    try {
      const res = await axios.patch(
        `https://apna-blog-4k8w.onrender.com/api/v1/blog/${blogId}`, // ✅ fixed (removed /toggle/)
        { publish: !publish },
        { withCredentials: true }
      );

      if (res.data.success) {
        setPublish(!publish);
        toast.success(res.data.message);

        // Update Redux state too
        const updatedBlogData = blog.map((b) =>
          b._id === blogId ? { ...b, isPublished: !publish } : b
        );
        dispatch(setBlog(updatedBlogData));
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update publish status");
    }
  };

  const deleteBlog = async () => {
    try {
      const res = await axios.delete(
        `https://apna-blog-4k8w.onrender.com/api/v1/blog/delete/${blogId}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        const updatedBlogData = blog.filter((b) => b._id !== blogId);
        dispatch(setBlog(updatedBlogData));
        toast.success(res.data.message);
        navigate("/dashboard/your-blog");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while deleting");
    }
  };

  return (
    <div className="pb-10 px-3 pt-20 md:ml-[320px]">
      <div className="max-w-6xl mx-auto mt-8">
        <Card className="w-full bg-white dark:bg-gray-800 p-5 space-y-4">
          <h1 className="text-4xl font-bold">Update Blog</h1>
          <p>Make changes to your blog here. Click publish when you're done.</p>

          <div className="space-x-2 my-3">
            <Button onClick={togglePublishUnpublish}>
              {publish ? "Unpublish" : "Publish"}
            </Button>
            <Button variant="destructive" onClick={deleteBlog}>
              Remove Blog
            </Button>
          </div>

          <div>
            <Label>Title</Label>
            <Input
              type="text"
              name="title"
              value={blogData.title}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label>Subtitle</Label>
            <Input
              type="text"
              name="subtitle"
              value={blogData.subtitle}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label>Description</Label>
            <JoditEditor ref={editor} value={content} onChange={setContent} />
          </div>

          <div>
            <Label>Category</Label>
            <Select onValueChange={selectCategory} value={blogData.category}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Category</SelectLabel>
                  <SelectItem value="Web Development">
                    Web Development
                  </SelectItem>
                  <SelectItem value="Digital Marketing">
                    Digital Marketing
                  </SelectItem>
                  <SelectItem value="Blogging">Blogging</SelectItem>
                  <SelectItem value="Photography">Photography</SelectItem>
                  <SelectItem value="Cooking">Cooking</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Thumbnail</Label>
            <Input type="file" accept="image/*" onChange={selectThumbnail} />
            {previewThumbnail && (
              <img
                src={previewThumbnail}
                alt="Thumbnail"
                className="w-64 my-2"
              />
            )}
          </div>

          <div className="flex gap-3 mt-3">
            <Button variant="outline" onClick={() => navigate(-1)}>
              Back
            </Button>
            <Button onClick={updateBlogHandler} disabled={loading}>
              {loading ? "Please wait..." : "Save"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default UpdateBlog;
