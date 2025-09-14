// components/LogoutButton.jsx
import React from "react";
import { useAuth } from "../Context/authContext";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";

const LogoutButton = () => {
  const { logout } = useAuth();
  const navigate = useNavigate()

  const handleLogout = () =>{
    logout()
    navigate("/login", { replace: true });
  }

  return (
    <button
      onClick={handleLogout}
      className="mt-4 p-3 px-4 w-[200px] rounded flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 transition-all duration-200"
    >
      <FaSignOutAlt /> Logout
    </button>
  );
};

export default LogoutButton;
