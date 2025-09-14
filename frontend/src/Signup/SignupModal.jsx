import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import image from "../assets/register.jpg";
import api from "../../api/api";
import { toast } from "react-toastify";
import MapPicker from "../Components/MapPicker"; // 🔹 map picker

const SignupModal = () => {
  const navigate = useNavigate();
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "",
    ngo_name: "",
    registration_number: "",
    ngo_phone: "",
    ngo_location: null,
    restaurant_name: "",
    license_number: "",
    restaurant_phone: "",
    restaurant_location: null,
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // 🔹 controls modal map
  const [showMap, setShowMap] = useState(false);
  const [currentLocationField, setCurrentLocationField] = useState(null);

  const validate = () => {
    let newErrors = {};

    if (!signupData.name.trim()) newErrors.name = "Name is required";
    if (!signupData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signupData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!signupData.userType) newErrors.userType = "User type is required";
    if (signupData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    if (signupData.confirmPassword !== signupData.password)
      newErrors.confirmPassword = "Passwords do not match";

    if (signupData.userType === "ngo") {
      if (!signupData.ngo_name.trim())
        newErrors.ngo_name = "NGO name is required";
      if (!signupData.registration_number.trim())
        newErrors.registration_number = "Registration number is required";
      if (!signupData.ngo_phone.trim()) {
        newErrors.ngo_phone = "Phone number is required";
      } else if (!/^[0-9]{10,15}$/.test(signupData.ngo_phone)) {
        newErrors.ngo_phone = "Invalid phone number format";
      }
      if (!signupData.ngo_location)
        newErrors.ngo_location = "Please choose location";
    }

    if (signupData.userType === "restaurant") {
      if (!signupData.restaurant_name.trim())
        newErrors.restaurant_name = "Restaurant name is required";
      if (!signupData.license_number.trim())
        newErrors.license_number = "License number is required";
      if (!signupData.restaurant_phone.trim()) {
        newErrors.restaurant_phone = "Phone number is required";
      } else if (!/^[0-9]{10,15}$/.test(signupData.restaurant_phone)) {
        newErrors.restaurant_phone = "Invalid phone number format";
      }
      if (!signupData.restaurant_location)
        newErrors.restaurant_location = "Please choose location";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSignupData({
      ...signupData,
      [name]: type === "checkbox" ? checked : value,
    });
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validate()) {
    toast.error("Please fix form errors before submitting");
    return;
  }
  setIsLoading(true);

  try {
    const { confirmPassword, ...payload } = signupData;

    // 🔹 Remove location field not needed
    if (payload.userType === "ngo") {
      delete payload.restaurant_location;
    } else if (payload.userType === "restaurant") {
      delete payload.ngo_location;
    }

    await api.post("/auth/signup", { ...payload, confirmPassword });
    toast.success("Signup successful! Redirecting...");
    setTimeout(() => navigate("/login"), 2000);
  } catch (err) {
    toast.error(err.response?.data?.message || "Signup failed.");
  } finally {
    setIsLoading(false);
  }
};


  // 🔹 Called when user picks a location on full map
  const handleLocationSelect = (loc) => {
    if (currentLocationField) {
      setSignupData((prev) => ({
        ...prev,
        [currentLocationField]: {
          type: "Point",
          coordinates: [loc.lng, loc.lat], // GeoJSON requires [lng, lat]
        },
      }));
    }
    setShowMap(false);
    setCurrentLocationField(null);
  };

  // 🔹 Helper to display coords nicely
  const renderCoords = (location) => {
    if (location?.coordinates) {
      const [lng, lat] = location.coordinates;
      return `Location: ${lat.toFixed(3)}, ${lng.toFixed(3)}`;
    }
    return null;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div
          className="w-full h-full bg-cover bg-center blur-[2px] brightness-75"
          style={{ backgroundImage: `url(${image})` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-black/60"></div>
      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-[350px] max-h-[90vh] rounded-2xl border backdrop-blur-md shadow-2xl p-6 text-white overflow-y-auto">
        <button
          className="absolute top-3 right-3 text-white hover:text-gray-300"
          onClick={() => navigate("/")}
        >
          <FaTimes className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-semibold mb-4 text-center">Sign Up</h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Common fields */}
          <input
            type="text"
            name="name"
            placeholder="User Name"
            className="w-full p-2 rounded-lg bg-white/10 placeholder-white/70 text-white"
            value={signupData.name}
            onChange={handleChange}
          />
          {errors.name && <p className="text-red-400">{errors.name}</p>}

          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full p-2 rounded-lg bg-white/10 placeholder-white/70 text-white"
            value={signupData.email}
            onChange={handleChange}
          />
          {errors.email && <p className="text-red-400">{errors.email}</p>}

          <select
            name="userType"
            className="w-full p-2 rounded-lg bg-white/10 text-white"
            value={signupData.userType}
            onChange={handleChange}
          >
            <option className="bg-gray-900" value="">
              Select User Type
            </option>
            <option className="bg-gray-900" value="restaurant">
              Donor
            </option>
            <option className="bg-gray-900" value="ngo">
              NGO
            </option>
          </select>
          {errors.userType && <p className="text-red-400">{errors.userType}</p>}

          {/* NGO */}
          {signupData.userType === "ngo" && (
            <div className="space-y-3">
              <input
                type="text"
                name="ngo_name"
                placeholder="NGO Name"
                className="w-full p-2 rounded-lg bg-white/10 text-white"
                value={signupData.ngo_name}
                onChange={handleChange}
              />
              {errors.ngo_name && (
                <p className="text-red-400">{errors.ngo_name}</p>
              )}

              <input
                type="text"
                name="registration_number"
                placeholder="Registration Number"
                className="w-full p-2 rounded-lg bg-white/10 text-white"
                value={signupData.registration_number}
                onChange={handleChange}
              />
              {errors.registration_number && (
                <p className="text-red-400">{errors.registration_number}</p>
              )}

              <input
                type="text"
                name="ngo_phone"
                placeholder="Phone Number"
                className="w-full p-2 rounded-lg bg-white/10 text-white"
                value={signupData.ngo_phone}
                onChange={handleChange}
              />
              {errors.ngo_phone && (
                <p className="text-red-400">{errors.ngo_phone}</p>
              )}

              <button
                type="button"
                className="w-full py-2 rounded-lg bg-amber-500 hover:bg-amber-600"
                onClick={() => {
                  setCurrentLocationField("ngo_location");
                  setShowMap(true);
                }}
              >
                {renderCoords(signupData.ngo_location) ||
                  "Choose NGO Location on Map"}
              </button>

              {errors.ngo_location && (
                <p className="text-red-400">{errors.ngo_location}</p>
              )}
            </div>
          )}

          {/* Restaurant */}
          {signupData.userType === "restaurant" && (
            <div className="space-y-3">
              <input
                type="text"
                name="restaurant_name"
                placeholder="Restaurant Name"
                className="w-full p-2 rounded-lg bg-white/10 text-white"
                value={signupData.restaurant_name}
                onChange={handleChange}
              />
              {errors.restaurant_name && (
                <p className="text-red-400">{errors.restaurant_name}</p>
              )}

              <input
                type="text"
                name="license_number"
                placeholder="License Number"
                className="w-full p-2 rounded-lg bg-white/10 text-white"
                value={signupData.license_number}
                onChange={handleChange}
              />
              {errors.license_number && (
                <p className="text-red-400">{errors.license_number}</p>
              )}

              <input
                type="text"
                name="restaurant_phone"
                placeholder="Phone Number"
                className="w-full p-2 rounded-lg bg-white/10 text-white"
                value={signupData.restaurant_phone}
                onChange={handleChange}
              />
              {errors.restaurant_phone && (
                <p className="text-red-400">{errors.restaurant_phone}</p>
              )}

              <button
                type="button"
                className="w-full py-2 rounded-lg bg-amber-500 hover:bg-amber-600"
                onClick={() => {
                  setCurrentLocationField("restaurant_location");
                  setShowMap(true);
                }}
              >
                {renderCoords(signupData.restaurant_location) ||
                  "Choose Restaurant Location on Map"}
              </button>

              {errors.restaurant_location && (
                <p className="text-red-400">{errors.restaurant_location}</p>
              )}
            </div>
          )}

          {/* Passwords */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full p-2 rounded-lg bg-white/10 text-white"
            value={signupData.password}
            onChange={handleChange}
          />
          {errors.password && <p className="text-red-400">{errors.password}</p>}

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            className="w-full p-2 rounded-lg bg-white/10 text-white"
            value={signupData.confirmPassword}
            onChange={handleChange}
          />
          {errors.confirmPassword && (
            <p className="text-red-400">{errors.confirmPassword}</p>
          )}

          <button
            type="submit"
            className="mt-4 w-full py-2 rounded-lg bg-amber-500 hover:bg-amber-600 font-semibold"
            disabled={isLoading}
          >
            {isLoading ? "Registering..." : "Register"}
          </button>
          <button
            type="button"
            className="w-full py-2 rounded-lg bg-white/20 hover:bg-white/30"
            onClick={() => navigate("/login")}
          >
            Already Have an Account? Log In
          </button>
        </form>
      </div>

      {/* 🔹 Full Map modal */}
      {showMap && (
        <MapPicker
          onClose={() => setShowMap(false)}
          onLocationSelect={handleLocationSelect}
        />
      )}
    </div>
  );
};

export default SignupModal;
