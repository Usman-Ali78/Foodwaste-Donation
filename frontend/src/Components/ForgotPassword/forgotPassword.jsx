import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../../api/api";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setloading] = useState(false);

  const handleChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  const validate = () => {
    const newErrors = {};
    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setloading(true);
    const userType = "ngo"
    const payLoad = userType === "ngo" ? {ngo_phone: phoneNumber} : {restaurant_phone: phoneNumber};

    try {
      const { data } = await api.post("/auth/forgot-password",
        payLoad);
      console.log(data);
      localStorage.setItem("userId", data.userId);
      toast.success("Phone Submitted");
      if (data.userId) {
        navigate("/reset-password");
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setloading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300 p-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
          Forgot Your Password?
        </h2>
        <p className="text-gray-600 text-center mb-6">
          Enter your phone number to verify
        </p>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="tel"
            value={phoneNumber}
            onChange={handleChange}
            placeholder="Enter your phone number"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.phoneNumber && (
            <p className="text-red-500 text-sm">{errors.phoneNumber}</p>
          )}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition duration-300 cursor-pointer"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
        <div className="mt-6 text-center">
          <a href="/login" className="text-blue-500 hover:underline text-sm">
            Back to Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
