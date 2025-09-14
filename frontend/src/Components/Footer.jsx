import React from "react";
import { Link, NavLink } from "react-router-dom";
import Logo1 from "../assets/Logo1.png";
import {
  FaFacebookF,
  FaDiscord,
  FaTwitter,
  FaGithub,
  FaDribbble,
} from "react-icons/fa";

const Footer = () => {
  const socialLinks = [
    { href: "https://www.facebook.com", icon: <FaFacebookF />, color: "hover:text-[#1877F2]" }, // Facebook Blue
    { href: "#", icon: <FaDiscord />, color: "hover:text-[#5865F2]" }, // Discord Purple
    { href: "#", icon: <FaTwitter />, color: "hover:text-[#1DA1F2]" }, // Twitter Blue
    { href: "#", icon: <FaGithub />, color: "hover:text-gray-800" }, // GitHub Black
    { href: "#", icon: <FaDribbble />, color: "hover:text-[#EA4C89]" }, // Dribbble Pink
  ];
  return (
    <footer className="border-y bg-gradient-to-r from-green-100  to-orange-100">
      <div className="flex flex-wrap justify-between items-center max-w-screen-xl mx-auto py-8 px-4 gap-8">
        {/* Logo */}
        <div className="w-full sm:w-auto text-center">
          <Link className="flex justify-center sm:justify-start">
            <img src={Logo1} className="h-24 w-40 object-contain" alt="Logo" />
          </Link>
        </div>

        {/* Links Sections */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full sm:w-auto text-center sm:text-left">
          {/* Resources */}
          <div>
            <h2 className="text-sm font-semibold text-gray-900 uppercase mb-4">
              Resources
            </h2>
            <ul className="font-semibold">
              <li className="mb-3">
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `hover:underline ${
                      isActive ? "text-orange-700" : "text-gray-500"
                    }`
                  }
                >
                  Home
                </NavLink>
              </li>
              <li className="mb-3">
                <NavLink
                  to="/about"
                  className={({ isActive }) =>
                    `hover:underline ${
                      isActive ? "text-orange-700" : "text-gray-500"
                    }`
                  }
                >
                  About
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/contactUs"
                  className={({ isActive }) =>
                    `hover:underline ${
                      isActive ? "text-orange-700" : "text-gray-500"
                    }`
                  }
                >
                  Contact Us
                </NavLink>
              </li>
            </ul>
          </div>

          {/* Follow Us */}
          <div>
            <h2 className="text-sm font-semibold text-gray-900 uppercase mb-4">
              Follow Us
            </h2>
            <ul className="font-semibold text-gray-500">
              <li className="mb-3">
                <a href="https://github.com" className="hover:underline">
                  GitHub
                </a>
              </li>
              <li className="mb-3">
                <a href="/" className="hover:underline">
                  Discord
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h2 className="text-sm font-semibold text-gray-900 uppercase mb-4">
              Legal
            </h2>
            <ul className="font-semibold text-gray-500">
              <li className="mb-3">
                <Link to="#" className="hover:underline">
                  Privacy Policy
                </Link>
              </li>
              <li className="mb-3">
                <Link to="#" className="hover:underline">
                  Terms &amp; Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Divider */}
      {/* <hr className="mt-4 border-gray-200 mx-auto max-w-screen-xl" /> */}

      {/* Copyright and Social Media */}
      <div className="flex justify-center space-x-5 p-4  backdrop-blur-md rounded-xl shadow-md">
      {socialLinks.map((item, index) => (
        <Link
          key={index}
          to={item.href}
          className={`text-gray-500 text-2xl transition-all duration-300 transform hover:scale-125 ${item.color}`}
        >
          {item.icon}
          <span className="sr-only">Visit {item.href}</span>
        </Link>
      ))}
    </div>
    </footer>
  );
};

export default Footer;
