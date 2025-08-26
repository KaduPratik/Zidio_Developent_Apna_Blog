import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { setBlog } from "@/redux/blogSlice";
import axios from "axios";
import { Loader2 } from "lucide-react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const CreateBlog = () => {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const { blog } = useSelector((store) => store.blog);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getSelectedCategory = (value) => {
    setCategory(value);
  };

  const createBlogHandler = async () => {
    if (!title || !category) {
      toast.error("Title and category are required!");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `https://apna-blog-4k8w.onrender.com/api/v1/blog/`,
        { title, category },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        // Update redux store
        dispatch(setBlog([...blog, res.data.blog]));

        toast.success(res.data.message);

        // Navigate to the edit page for the newly created blog
        navigate(`/dashboard/write-blog/${res.data.blog._id}`);
      } else {
        toast.error("Something went wrong while creating the blog");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to create blog. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:pr-20 h-screen md:ml-[320px] pt-20">
      <Card className="md:p-10 p-4 dark:bg-gray-800">
        <h1 className="text-2xl font-bold">Let's create a blog</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Fill in the details below to start your new blog. You can edit it
          later.
        </p>

        <div className="mt-10 space-y-4">
          {/* Title */}
          <div>
            <Label>Title</Label>
            <Input
              type="text"
              placeholder="Your Blog Name"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-white dark:bg-gray-700"
            />
          </div>

          {/* Category */}
          <div>
            <Label>Category</Label>
            <Select onValueChange={getSelectedCategory} value={category}>
              <SelectTrigger className="w-[200px] bg-white dark:bg-gray-700">
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

          {/* Buttons */}
          <div className="flex gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button onClick={createBlogHandler} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                "Create"
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CreateBlog;
