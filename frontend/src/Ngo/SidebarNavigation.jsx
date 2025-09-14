import React, { useState } from "react";
import {
  FaSearch,
  FaHandHoldingHeart,
  FaClipboardCheck,
  FaMapMarkerAlt,
  FaTimesCircle,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { FiSettings } from "react-icons/fi";
import LogoutButton from "../Components/Logout";

const SidebarNavigation = ({ activeSection, setActiveSection }) => {
  const [open, setOpen] = useState(false);

  const navTabs = [
    { key: "available", label: "Available Donations", icon: <FaSearch /> },
    { key: "my-claims", label: "My Claims", icon: <FaHandHoldingHeart /> },
    {
      key: "completed",
      label: "Completed Donations",
      icon: <FaClipboardCheck />,
    },
    { key: "map", label: "Donation Map", icon: <FaMapMarkerAlt /> },
    { key: "rejected", label: "Rejected Donations", icon: <FaTimesCircle /> },
    { key: "settings", label: "Settings", icon: <FiSettings /> },
  ];

  return (
    <>
      {/* Mobile hamburger */}
      {!open && (
        <button
          className="md:hidden fixed top-4 left-4 z-50 p-2 rounded bg-green-700 text-white"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
        >
          <FaBars />
        </button>
      )}

      {/* Backdrop on mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 bg-green-700 text-white flex flex-col shadow-lg
  transform transition-transform duration-300
  ${open ? "translate-x-0" : "-translate-x-full"}
  md:relative md:w-64 md:translate-x-0`}
      >
        {/* Header */}
        <div className="p-6 flex items-center justify-between flex-shrink-0">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <FaBars className="hidden md:block" /> NGO Dashboard
          </h2>
          <button
            className="md:hidden p-1"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            <FaTimes />
          </button>
        </div>

        {/* Scrollable nav list */}
        <ul className="flex-1 min-h-0 overflow-y-auto px-6 pb-4 space-y-2">
          {navTabs.map((tab) => (
            <li
              key={tab.key}
              className={`p-3 rounded cursor-pointer transition-all duration-200 flex items-center gap-2 ${
                activeSection === tab.key
                  ? "bg-green-500 text-white"
                  : "hover:bg-green-600"
              }`}
              onClick={() => {
                setActiveSection(tab.key);
                setOpen(false);
              }}
            >
              {tab.icon} {tab.label}
            </li>
          ))}
        </ul>

        {/* Logout pinned bottom */}
        <div className="p-6 flex-shrink-0 border-t border-white/10">
          <LogoutButton />
        </div>
      </aside>
    </>
  );
};

export default SidebarNavigation;
