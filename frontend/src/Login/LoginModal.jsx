import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import image from "../assets/signupform.jpg";
import api from "../../api/api";
import { useAuth } from "../Context/authContext";
import { toast } from "react-toastify";

const LoginModal = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    let newErrors = {};
    if (!loginData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (loginData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);

    try {
      const { email, password } = loginData;
      const { data } = await api.post("/auth/login", {
        email,
        password,
      });
      console.log(data);
      toast.success("Login Successful");
      if (data.success) {
        login(data.token, data.user.userType);
        // Clear any previous navigation state
        window.history.replaceState(null, "", "/");
        // Redirect based on userType
        switch (data.user.userType) {
          case "ngo":
            setTimeout(() => {
              navigate("/ngo");
            }, 1000);
            break;
          case "restaurant":
            setTimeout(() => {
              navigate("/restaurant");
            }, 1000);
            break;
          case "admin":
            setTimeout(() => {
              navigate("/admin");
            }, 1000);
            break;
          default:
            setTimeout(() => {
              navigate("/");
            }, 1000);
        }
      } else {
        toast.error("Login failed. Please check your credentials.");
      }
    } catch (error) {
      const message =
        error?.response?.data?.message || error.message || "Unexpected error";
      toast.error("Login failed: " + message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Background Image + Overlay */}
      <div className="absolute inset-0 z-0">
        <div
          className="w-full h-full bg-center blur-[2px] brightness-75"
          style={{
            backgroundImage: `url(${image})`,
            backgroundSize: "cover",
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-black/60"></div>
      </div>

      {/* Glassmorphic Login Card */}
      <div className="relative z-10 w-96 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md shadow-2xl p-8 text-white">
        {/* Cross Icon */}
        <button
          className="absolute top-3 right-3 text-white hover:text-gray-300 transition"
          onClick={() => navigate("/")}
        >
          <FaTimes className="w-6 h-6" />
        </button>

        <h2 className="text-3xl font-semibold mb-6 text-center">Login</h2>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full p-3 rounded-lg bg-white/10 placeholder-white/70 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-pink-400"
              value={loginData.email}
              onChange={handleChange}
            />
            {errors.email && (
              <p className="text-red-400 text-sm font-medium">{errors.email}</p>
            )}

            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full p-3 rounded-lg bg-white/10 placeholder-white/70 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-pink-400"
              value={loginData.password}
              onChange={handleChange}
            />
            {errors.password && (
              <p className="text-red-400 text-sm font-medium">
                {errors.password}
              </p>
            )}
          </div>
          <div
            className="p-2 text-sm text-[oklch(0.89_0.08_124.91)] hover:text-[oklch(0.85_0.08_124.91)] cursor-pointer transition-colors duration-200 ease-in-out font-medium"
            onClick={() => navigate("/forgot-password")}
          >
            Forgot Password?
          </div>

          <button
            type="submit"
            className="mt-2 w-full py-3 rounded-lg bg-green-500 hover:bg-green-600 transition-colors font-semibold cursor-pointer"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>

          <button
            className="mt-3 w-full py-3 rounded-lg bg-white/20 hover:bg-white/30 transition-colors text-white cursor-pointer"
            onClick={() => navigate("/signup")}
          >
            Don't have an Account? Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
