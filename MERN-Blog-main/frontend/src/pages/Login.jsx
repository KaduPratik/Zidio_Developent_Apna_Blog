import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/authSlice";
import auth from "../assets/auth.jpg";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [input, setInput] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Step 1: Validate before sending
    if (!input.email.trim() || !input.password.trim()) {
      toast.error("Email and password are required");
      return;
    }

    try {
      setLoading(true);

      // Step 2: Send proper payload
      const response = await axios.post(
        "http://localhost:3000/api/v1/user/login",
        {
          email: input.email.trim(),
          password: input.password.trim(),
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true, // only needed if backend sets cookies
        }
      );

      // Step 3: Handle success
      if (response.data.success) {
        dispatch(setUser(response.data.user));
        toast.success(response.data.message || "Login successful!");
        navigate("/");
      } else {
        toast.error(response.data.message || "Login failed");
      }
    } catch (error) {
      // Step 4: Detailed error handling
      if (error.response) {
        console.error("Login error:", error.response.data);
        toast.error(error.response.data.message || "Invalid credentials");
      } else {
        console.error("Network error:", error.message);
        toast.error("Network error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center h-screen md:pt-14 md:h-[760px]">
      {/* Left Image */}
      <div className="hidden md:block">
        <img src={auth} alt="Auth" className="h-[700px]" />
      </div>

      {/* Login Card */}
      <div className="flex justify-center items-center flex-1 px-4 md:px-0">
        <Card className="w-full max-w-md p-6 shadow-lg rounded-2xl dark:bg-gray-800 dark:border-gray-600">
          <CardHeader>
            <CardTitle className="text-center text-xl font-semibold">
              Login into your account
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm font-serif text-center">
              Enter your details below to login your account
            </p>
          </CardHeader>

          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Email */}
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  placeholder="Email Address"
                  name="email"
                  value={input.email}
                  onChange={handleChange}
                  className="dark:border-gray-600 dark:bg-gray-900"
                />
              </div>

              {/* Password */}
              <div className="relative">
                <Label>Password</Label>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter Your Password"
                  name="password"
                  value={input.password}
                  onChange={handleChange}
                  className="dark:border-gray-600 dark:bg-gray-900"
                />
                <button
                  type="button"
                  className="absolute right-3 top-9 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* Submit */}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </Button>

              {/* Signup link */}
              <p className="text-center text-gray-600 dark:text-gray-300">
                Don't have an account?{" "}
                <Link to={"/signup"}>
                  <span className="underline cursor-pointer hover:text-gray-800">
                    Sign up
                  </span>
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
