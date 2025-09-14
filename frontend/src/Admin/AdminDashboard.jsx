import React, { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import {
  FiUsers,
  FiBox,
  FiMap,
  FiBarChart2,
  FiPieChart,
  FiMenu,
} from "react-icons/fi";
import LogoutButton from "../Components/Logout";

const navBtnClasses =
  "flex items-center gap-2 p-2 rounded-md transition-colors duration-200";


const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen">
      {/* Sidebar Toggle Button (Mobile) */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 right-4 p-2 bg-gray-800 text-white rounded md:hidden z-30"
      >
        <FiMenu className="w-6 h-6" />
      </button>

      {/* Sidebar */}
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminDashboard;


const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  return (
    <aside
      className={`fixed md:relative w-64 bg-gray-800 text-white flex flex-col h-screen flex-shrink-0 transform transition-transform duration-200 ease-in-out ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0 z-20`}
    >
      <h2 className="text-2xl font-bold p-6">Admin Dashboard</h2>

      {/* Navigation */}
      <ul className="space-y-2 p-4 flex-grow">
        <li>
          <NavLink
            to="dashboard"
            className={({ isActive }) =>
              `${navBtnClasses} ${
                isActive ? "bg-gray-700 text-yellow-400" : "hover:bg-gray-700"
              }`
            }
            onClick={toggleSidebar}
          >
            <FiBarChart2 className="mr-2" /> Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink
            to="users"
            className={({ isActive }) =>
              `${navBtnClasses} ${
                isActive ? "bg-gray-700 text-yellow-400" : "hover:bg-gray-700"
              }`
            }
            onClick={toggleSidebar}
          >
            <FiUsers className="mr-2" /> Manage Users
          </NavLink>
        </li>
        <li>
          <NavLink
            to="donations"
            className={({ isActive }) =>
              `${navBtnClasses} ${
                isActive ? "bg-gray-700 text-yellow-400" : "hover:bg-gray-700"
              }`
            }
            onClick={toggleSidebar}
          >
            <FiBox className="mr-2" /> Manage Donations
          </NavLink>
        </li>
        <li>
          <NavLink
            to="reports"
            className={({ isActive }) =>
              `${navBtnClasses} ${
                isActive ? "bg-gray-700 text-yellow-400" : "hover:bg-gray-700"
              }`
            }
            onClick={toggleSidebar}
          >
            <FiPieChart className="mr-2" /> Reports
          </NavLink>
        </li>
        <li>
          <NavLink
            to="map"
            className={({ isActive }) =>
              `${navBtnClasses} ${
                isActive ? "bg-gray-700 text-yellow-400" : "hover:bg-gray-700"
              }`
            }
            onClick={toggleSidebar}
          >
            <FiMap className="mr-2" /> Map View
          </NavLink>
        </li>
      </ul>

      {/* Logout at bottom */}
      <div className="p-4 mt-auto">
        <LogoutButton />
      </div>
    </aside>
  );
};
