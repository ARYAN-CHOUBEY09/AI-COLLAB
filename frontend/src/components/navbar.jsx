import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/user.context";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    if (setUser) setUser(null);
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 
                    bg-[#0c0f15]/70 backdrop-blur-2xl 
                    border-b border-white/5 shadow-lg shadow-black/50">

      <div className="w-full px-6 h-16 flex items-center justify-between">


        {/* LOGO */}
        <Link to="/projects" className="flex items-center gap-2">
  <img
    src="\logo.png"
    alt="Logo"
    className="h-12 w-12 object-contain"
  />
</Link>


        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center   gap-6">

          <Link
            to="/projects"
            className="text-sm font-medium text-gray-300 
                      hover:text-blue-400 hover:scale-[1.05] 
                      transition-all"
          >
            All Projects
          </Link>

          {user && (
            <span className="text-sm text-blue-200 font-medium 
                            px-4 py-1 rounded-full 
                            bg-[#10141c] border border-white/10 
                            shadow-inner shadow-blue-900/30">
              {user.email}
            </span>
          )}

          <button
            onClick={handleLogout}
            className="px-5 py-1.5 text-sm font-semibold rounded-full
                      bg-gradient-to-r from-red-600 to-red-500
                      text-white shadow-lg shadow-red-900/40
                      hover:brightness-110 hover:scale-[1.05]
                      transition-all"
          >
            Logout
          </button>

        </div>

        {/* MOBILE MENU TOGGLE */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-white text-3xl"
        >
          ☰
        </button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden bg-[#10141c] border-t border-white/10 
                        py-6 flex flex-col items-center gap-5 animate-fadeIn">

          <Link
            to="/projects"
            onClick={() => setOpen(false)}
            className="text-blue-300 text-lg font-medium hover:text-blue-400"
          >
            All Projects
          </Link>

          {user && (
            <span className="text-blue-200 bg-white/5 px-4 py-1 
                            rounded-full border border-white/10 
                            shadow-inner shadow-blue-800/20">
              {user.email}
            </span>
          )}

          <button
            onClick={() => {
              setOpen(false);
              handleLogout();
            }}
            className="px-10 py-2 rounded-full bg-red-600 text-white 
                      font-semibold hover:bg-red-700 shadow-md"
          >
            Logout
          </button>

        </div>
      )}
    </nav>
  );
};

export default Navbar;

