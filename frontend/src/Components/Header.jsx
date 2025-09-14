import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import LogInBtn from "./LogInBtn";
import SignUpBtn from "./SignUpBtn";
import LoginModal from "../Login/LoginModal";
import SignupModal from "../Signup/SignupModal";
import MainLogo from "../assets/MainLogo.png";
import Logo from "../assets/Logo.png";
import Logo1 from "../assets/Logo1.png"

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    if (isLoginOpen || isSignupOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [isLoginOpen, isSignupOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = ["Home", "About", "ContactUs"];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 bg-gradient-to-r from-green-100  to-orange-100  ${
        isScrolled
          ? "shadow-lg bg-white/95 backdrop-blur-sm"
          : "border-b bg-white"
      }`}
    >
      <nav className="flex justify-between items-center max-w-7xl mx-auto px-6 py-3">
        {/* Logo */}
        <Link to="/" className="flex items-center group">
          <img
            src={Logo1}
            className="h-16 w-auto transition-transform duration-300 group-hover:scale-105"
            alt="Logo"
          />
          <span className="ml-3 text-xl font-bold bg-gradient-to-r from-green-600 to-orange-500 bg-clip-text text-transparent rounded-lg">
            Share Bite
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-2 ">
          <ul className="flex gap-1">
            {menuItems.map((item) => (
              <li key={item}>
                <NavLink
                  to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-lg text-[15px] font-medium transition-all duration-300 ${
                      isActive
                        ? "bg-green-200 text-green-700 shadow-inner"
                        : "text-gray-700 hover:bg-green-100 hover:text-green-800"
                    }`
                  }
                >
                  {item}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="ml-6 flex">
            <LogInBtn
              onClick={() => setIsLoginOpen(true)}
              className="border border-green-600 text-green-600 hover:bg-green-50 hover:text-green-700 transition"
            />
            <SignUpBtn
              onClick={() => setIsSignupOpen(true)}
              className="ml-2 bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 text-white shadow-md transition"
            />
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-green-50 focus:outline-none transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle Menu"
        >
          {isMenuOpen ? (
            <X size={28} className="text-green-600" />
          ) : (
            <Menu size={28} className="text-green-600" />
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden fixed inset-0 bg-white z-20 transition-all duration-300 ease-in-out ${
          isMenuOpen
            ? "opacity-100 translate-x-0"
            : "opacity-0 -translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-5 border-b">
          <Link
            to="/"
            onClick={() => setIsMenuOpen(false)}
            className="flex items-center"
          >
            <img src={Logo} className="h-14 w-auto" alt="Logo" />
            <span className="ml-3 text-lg font-bold text-green-600">
              Share Bite
            </span>
          </Link>
          <button
            onClick={() => setIsMenuOpen(false)}
            className="p-2 rounded-full text-gray-700 hover:bg-green-50 focus:outline-none"
            aria-label="Close Menu"
          >
            <X size={28} className="text-green-600" />
          </button>
        </div>

        <div className="p-6">
          <ul className="flex flex-col gap-1">
            {menuItems.map((item) => (
              <li key={item}>
                <NavLink
                  to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                  className={({ isActive }) =>
                    `block px-4 py-3 rounded-lg text-[16px] font-medium transition-colors ${
                      isActive
                        ? "bg-green-100 text-green-700 font-semibold"
                        : "text-gray-700 hover:bg-green-50 hover:text-green-600"
                    }`
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="flex flex-row mt-4">
            <LogInBtn
              fullWidth
              onClick={() => {
                setIsLoginOpen(true);
                setIsMenuOpen(false);
              }}
              className="border border-green-600 text-green-600 hover:bg-green-50 hover:text-green-700 transition"
            />
            <SignUpBtn
              fullWidth
              onClick={() => {
                setIsSignupOpen(true);
                setIsMenuOpen(false);
              }}
              className="ml-2 bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 text-white shadow-md"
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      {isLoginOpen && <LoginModal onClose={() => setIsLoginOpen(false)} />}
      {isSignupOpen && <SignupModal onClose={() => setIsSignupOpen(false)} />}
    </header>
  );
};

export default Header;
