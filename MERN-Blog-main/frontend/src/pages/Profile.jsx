import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import userLogo from "../assets/user.jpg";
import { FaFacebook, FaLinkedin, FaGithub, FaInstagram } from "react-icons/fa";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { setUser } from "@/redux/authSlice";
import TotalProperty from "@/components/TotalProperty";

const Profile = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((store) => store.auth);

  const [input, setInput] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    occupation: user?.occupation || "",
    bio: user?.bio || "",
    facebook: user?.facebook || "",
    linkedin: user?.linkedin || "",
    github: user?.github || "",
    instagram: user?.instagram || "",
    file: null,
  });

  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const changeFileHandler = (e) => {
    if (e.target.files?.[0]) {
      setInput((prev) => ({ ...prev, file: e.target.files[0] }));
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("firstName", input.firstName);
    formData.append("lastName", input.lastName);
    formData.append("bio", input.bio);
    formData.append("occupation", input.occupation);
    formData.append("facebook", input.facebook);
    formData.append("linkedin", input.linkedin);
    formData.append("instagram", input.instagram);
    formData.append("github", input.github);
    if (input.file) {
      formData.append("file", input.file);
    }

    try {
      setLoading(true);
      const res = await axios.put(
        `http://localhost:3000/api/v1/user/profile/update`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        setOpen(false);
        toast.success(res.data.message);
        dispatch(setUser(res.data.user));
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-20 md:ml-[320px] md:h-screen">
      <div className="max-w-6xl mx-auto mt-8">
        <Card className="flex md:flex-row flex-col gap-10 p-6 md:p-10 dark:bg-gray-800 mx-4 md:mx-0">
          {/* Profile image */}
          <div className="flex flex-col items-center justify-center md:w-[400px]">
            <Avatar className="w-40 h-40 border-2">
              <AvatarImage src={user?.photoUrl || userLogo} />
            </Avatar>
            <h1 className="text-center font-semibold text-xl text-gray-700 dark:text-gray-300 my-3">
              {user?.occupation || "Mern Stack Developer"}
            </h1>
            <div className="flex gap-4 items-center">
              {user?.facebook && (
                <Link to={user.facebook} target="_blank">
                  <FaFacebook className="w-6 h-6 text-gray-800 dark:text-gray-300" />
                </Link>
              )}
              {user?.linkedin && (
                <Link to={user.linkedin} target="_blank">
                  <FaLinkedin className="w-6 h-6 text-gray-800 dark:text-gray-300" />
                </Link>
              )}
              {user?.github && (
                <Link to={user.github} target="_blank">
                  <FaGithub className="w-6 h-6 text-gray-800 dark:text-gray-300" />
                </Link>
              )}
              {user?.instagram && (
                <Link to={user.instagram} target="_blank">
                  <FaInstagram className="w-6 h-6 text-gray-800 dark:text-gray-300" />
                </Link>
              )}
            </div>
          </div>

          {/* Profile info */}
          <div>
            <h1 className="font-bold text-center md:text-start text-4xl mb-7">
              Welcome {user?.firstName || "User"}!
            </h1>
            <p>
              <span className="font-semibold">Email : </span>
              {user?.email}
            </p>

            <div className="flex flex-col gap-2 items-start justify-start my-5">
              <Label htmlFor="bio">About Me</Label>
              <p className="border dark:border-gray-600 p-6 rounded-lg">
                {user?.bio ||
                  "I'm a passionate web developer and content creator focused on frontend technologies."}
              </p>
            </div>

            {/* Edit Profile Dialog */}
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button>Edit Profile</Button>
              </DialogTrigger>
              <DialogContent className="md:w-[425px]">
                <DialogHeader>
                  <DialogTitle className="text-center">
                    Edit Profile
                  </DialogTitle>
                  <DialogDescription className="text-center">
                    Make changes to your profile here.
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={submitHandler} className="grid gap-4 py-4">
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={input.firstName}
                        onChange={changeEventHandler}
                        placeholder="First Name"
                        type="text"
                        className="text-gray-500"
                      />
                    </div>
                    <div className="flex-1">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={input.lastName}
                        onChange={changeEventHandler}
                        placeholder="Last Name"
                        type="text"
                        className="text-gray-500"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Label htmlFor="facebook">Facebook</Label>
                      <Input
                        id="facebook"
                        name="facebook"
                        value={input.facebook}
                        onChange={changeEventHandler}
                        placeholder="Enter a URL"
                        className="text-gray-500"
                      />
                    </div>
                    <div className="flex-1">
                      <Label htmlFor="instagram">Instagram</Label>
                      <Input
                        id="instagram"
                        name="instagram"
                        value={input.instagram}
                        onChange={changeEventHandler}
                        placeholder="Enter a URL"
                        className="text-gray-500"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Label htmlFor="linkedin">LinkedIn</Label>
                      <Input
                        id="linkedin"
                        name="linkedin"
                        value={input.linkedin}
                        onChange={changeEventHandler}
                        placeholder="Enter a URL"
                        className="text-gray-500"
                      />
                    </div>
                    <div className="flex-1">
                      <Label htmlFor="github">Github</Label>
                      <Input
                        id="github"
                        name="github"
                        value={input.github}
                        onChange={changeEventHandler}
                        placeholder="Enter a URL"
                        className="text-gray-500"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="bio">Description</Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      value={input.bio}
                      onChange={changeEventHandler}
                      placeholder="Enter a description"
                      className="text-gray-500"
                    />
                  </div>

                  <div>
                    <Label htmlFor="file">Picture</Label>
                    <Input
                      id="file"
                      type="file"
                      accept="image/*"
                      onChange={changeFileHandler}
                      className="w-full"
                    />
                  </div>

                  <DialogFooter>
                    {loading ? (
                      <Button disabled>
                        <Loader2 className="mr-2 w-4 h-4 animate-spin" /> Please
                        wait
                      </Button>
                    ) : (
                      <Button type="submit">Save Changes</Button>
                    )}
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </Card>
      </div>
      <TotalProperty />
    </div>
  );
};

export default Profile;
