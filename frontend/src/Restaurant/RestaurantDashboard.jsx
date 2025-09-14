import React, { useState } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import {
  FaUtensils,
  FaMapMarkerAlt,
  FaChartBar,
  FaCog,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import LogoutButton from "../Components/Logout"; // 👈 import LogoutButton

const RestaurantDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  // Function to check if link is active
  const isActive = (path) => location.pathname.includes(path);

  const navBtnClasses =
    "flex items-center space-x-2 p-2 rounded transition-colors";

  return (
    <div className="flex h-screen bg-gray-100 flex-col md:flex-row">
      {/* Sidebar Toggle Button for Mobile */}
      <button
        className="md:hidden z-50 p-4 text-gray-900"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? (
          <FaTimes size={24} className="text-white" />
        ) : (
          <FaBars size={24} />
        )}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-gray-900 text-white p-5 flex flex-col transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:relative transition-transform duration-300 ease-in-out`}
      >
        <h2 className="text-2xl font-bold text-center md:text-left">
          Restaurant Dashboard
        </h2>

        {/* Nav Links */}
        <nav className="flex flex-col space-y-4 mt-6 flex-grow">
          <Link
            to="dashboard"
            className={`${navBtnClasses} ${
              isActive("dashboard")
                ? "bg-gray-700 text-yellow-400"
                : "hover:bg-gray-700"
            }`}
            onClick={() => setIsSidebarOpen(false)}
          >
            <FaChartBar /> <span>Dashboard</span>
          </Link>

          <Link
            to="foodDonation"
            className={`${navBtnClasses} ${
              isActive("foodDonation")
                ? "bg-gray-700 text-yellow-400"
                : "hover:bg-gray-700"
            }`}
            onClick={() => setIsSidebarOpen(false)}
          >
            <FaUtensils /> <span>Food Donations</span>
          </Link>

          <Link
            to="ngosNearby"
            className={`${navBtnClasses} ${
              isActive("ngosNearby")
                ? "bg-gray-700 text-yellow-400"
                : "hover:bg-gray-700"
            }`}
            onClick={() => setIsSidebarOpen(false)}
          >
            <FaMapMarkerAlt /> <span>NGOs Nearby</span>
          </Link>

          <Link
            to="settings"
            className={`${navBtnClasses} ${
              isActive("settings")
                ? "bg-gray-700 text-yellow-400"
                : "hover:bg-gray-700"
            }`}
            onClick={() => setIsSidebarOpen(false)}
          >
            <FaCog /> <span>Settings</span>
          </Link>
        </nav>

        {/* Logout Button at bottom */}
        <div className="mt-auto">
          <LogoutButton />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet /> {/* 👈 child route renders here */}
      </main>
    </div>
  );
};

export default RestaurantDashboard;
