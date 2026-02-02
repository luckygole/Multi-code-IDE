import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import {
  SignedIn,
  SignedOut,
  UserButton,
  SignInButton,
  SignUpButton,
} from "@clerk/clerk-react";
import logo from "../images/logos/logo.png";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="bg-[#0f0e0e] text-white shadow-md shadow-black/40 relative z-50">
      <div className="flex items-center justify-between px-6 md:px-16 h-[80px]">
        {/* 🔷 Left Side - Logo */}
        <div
          className=" cursor-pointer flex items-center gap-2 hover:scale-105 transition-transform duration-300"
          onClick={() => navigate("/")}
        >
          {/* <span className="text-blue-500">Kode</span>
          <span className="text-gray-300">Base</span> */}
          <img
            src={logo}
            alt="KodeBase Logo"
            className="h-30 w-30 md:h-30 md:w-30 lg:h-35 lg:w-35 object-contain"
          />
        </div>

        {/* 🔷 Hamburger Menu (Mobile) */}
        <button
          className="md:hidden block text-white hover:text-blue-400 transition-all"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* 🔷 Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6 text-[17px]">
          <Link
            to="/"
            className="hover:text-blue-400 transition-all duration-300 hover:scale-105"
          >
            Home
          </Link>
          <Link
            to="/features"
            className="hover:text-blue-400 transition-all duration-300 hover:scale-105"
          >
            Features
          </Link>
          <Link
            to="/about"
            className="hover:text-blue-400 transition-all duration-300 hover:scale-105"
          >
            About
          </Link>

          {/* 🔷 Signed In User */}
          <SignedIn>
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox:
                    "w-10 h-10 rounded-full border border-gray-600 hover:border-blue-500 transition-all duration-300",
                },
              }}
            />
          </SignedIn>

          {/* 🔷 Signed Out User */}
          <SignedOut>
            <div className="flex gap-3">
              <SignInButton mode="modal">
                <button className="bg-blue-500 hover:bg-blue-600 px-4 py-1.5 rounded-md transition-all duration-300 hover:scale-105">
                  Login
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="bg-green-500 hover:bg-green-600 px-4 py-1.5 rounded-md transition-all duration-300 hover:scale-105">
                  Signup
                </button>
              </SignUpButton>
            </div>
          </SignedOut>
        </div>
      </div>

      {/* 🔷 Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#111] flex flex-col items-center gap-4 py-5 text-[17px] border-t border-gray-800 animate-slideDown">
          <Link
            to="/"
            className="hover:text-blue-400 transition-all"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/features"
            className="hover:text-blue-400 transition-all"
            onClick={() => setMenuOpen(false)}
          >
            Features
          </Link>
          <Link
            to="/about"
            className="hover:text-blue-400 transition-all"
            onClick={() => setMenuOpen(false)}
          >
            About
          </Link>
          <Link
            to="/profile"
            className="hover:text-blue-400 transition-all"
            onClick={() => setMenuOpen(false)}
          >
            Profile
          </Link>

          <SignedIn>
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox:
                    "w-12 h-12 rounded-full border border-gray-600 hover:border-blue-500 transition-all duration-300",
                },
              }}
            />
          </SignedIn>

          <SignedOut>
            <div className="flex flex-col gap-2 w-full items-center">
              <SignInButton mode="modal">
                <button className="bg-blue-500 hover:bg-blue-600 w-[120px] py-2 rounded-md transition-all duration-300 hover:scale-105">
                  Login
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="bg-green-500 hover:bg-green-600 w-[120px] py-2 rounded-md transition-all duration-300 hover:scale-105">
                  Signup
                </button>
              </SignUpButton>
            </div>
          </SignedOut>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
