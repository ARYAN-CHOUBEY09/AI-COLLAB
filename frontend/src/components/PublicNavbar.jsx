
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const PublicNavbar = () => {

  const location = useLocation();

  const isLoginPage = location.pathname === "/login";
  const isRegisterPage = location.pathname === "/register";

  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-xl bg-[#14161e99] border-b border-white/10">
     <div className={`max-w-6xl mx-auto px-6 flex items-center py-4 
  ${isRegisterPage ? "justify-center" : "justify-between"}`}>


        {/* LOGO */}
        <Link
  to="/"
  className={`text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-blue-300 bg-clip-text text-transparent 
  ${isRegisterPage ? "mx-auto text-5xl ,font-extrabold ": ""}`}
>
  AI COLLAB
</Link>


        {/* DESKTOP BUTTONS */}
        {!isRegisterPage && (
          <div className="hidden md:flex gap-4 items-center">

            {/* Login button hide on Login page */}
            {!isLoginPage && (
              <Link
                to="/login"
                className="px-5 py-2 text-[15px] border border-blue-400 text-blue-300 rounded-md font-semibold bg-white/5 hover:bg-blue-500/10 transition-all"
              >
                Login
              </Link>
            )}

            {/* Signup button hide ONLY on Register page */}
            {!isRegisterPage && (
              <Link
                to="/register"
                className="px-5 py-2 text-[15px] bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-full font-semibold shadow-md hover:shadow-blue-500/40 transition-all"
              >
                Sign Up
              </Link>
            )}

          </div>
        )}

        {/* MOBILE MENU ICON */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-white text-3xl"
        >
          ☰
        </button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden flex flex-col items-center bg-[#1b1e27] py-4 border-b border-white/10 animate-fadeIn">

          {/* Login button hide on Login page */}
          {!isLoginPage && (
            <Link
              to="/login"
              className="py-2 text-blue-200 font-medium"
              onClick={() => setOpen(false)}
            >
              Login
            </Link>
          )}

          {/* Hide signup on register page */}
          {!isRegisterPage && (
            <Link
              to="/register"
              className="mt-2 px-6 py-2 bg-blue-600 text-white rounded-full font-semibold"
              onClick={() => setOpen(false)}
            >
              Sign Up
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default PublicNavbar;

