import React from "react";
import { useNavigate } from "react-router-dom";
import { ShieldAlert } from "lucide-react"; // nice warning icon
import { motion } from "framer-motion";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 text-center px-6">
      {/* Animated Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 120 }}
        className="bg-red-100 p-6 rounded-full mb-6"
      >
        <ShieldAlert className="w-16 h-16 text-red-600" />
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-4xl font-extrabold text-gray-800 mb-3"
      >
        Unauthorized Access
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-gray-600 mb-8 max-w-md"
      >
        You don’t have the required permissions to view this page.  
        Please contact the administrator if you believe this is an error.
      </motion.p>

      {/* Buttons */}
      <div className="flex gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(-1)}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
        >
          Go Back
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/")}
          className="bg-gray-200 text-gray-800 px-5 py-2 rounded-lg shadow-md hover:bg-gray-300 transition"
        >
          Home
        </motion.button>
      </div>
    </div>
  );
};

export default Unauthorized;
