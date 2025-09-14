import React from "react";
import { useNavigate } from "react-router-dom";

const LogInBtn = () => {
  const navigate = useNavigate();

  return (
    <div
      className="w-24 m-3 p-3 text-center rounded-2xl text-white cursor-pointer bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-md hover:shadow-lg border-2 border-transparent"
      onClick={() => navigate("/login")}
    >
      <button className="font-medium text-[17px] cursor-pointer">Login</button>
    </div>
  );
};

export default LogInBtn;