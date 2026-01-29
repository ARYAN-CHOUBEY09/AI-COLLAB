
import React, { useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/user.context";

const Landing = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/projects");
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-[#0f1117] text-white pt-28">

      {/* 🌟 HERO SECTION */}
      <section className="flex flex-col items-center text-center px-6 mt-10 relative overflow-hidden">

        {/* Background Glow */}
        <div className="absolute top-10 right-10 w-[400px] h-[400px] bg-blue-500/20 blur-[120px] rounded-full opacity-40 animate-pulse"></div>

        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight bg-gradient-to-r from-blue-400 to-blue-200 bg-clip-text text-transparent">
          Build Smarter. <br /> Collaborate Faster.
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-gray-300 leading-relaxed">
          AI-powered tools to create projects, manage teams, and innovate together —
          all in a seamless modern workspace.
        </p>

        {/* Buttons */}
        <div className="flex gap-4 mt-10">
          <Link
            to="/login"
            className="px-6 py-3 rounded-full text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-400 text-white shadow-md hover:shadow-blue-500/40 transition-all"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="px-6 py-3 rounded-full text-lg font-semibold border border-blue-400 text-blue-300 bg-white/5 hover:bg-blue-500/10 transition-all"
          >
            Sign Up
          </Link>
        </div>
      </section>

      {/* 🚀 FEATURES SECTION */}
      <section className="max-w-6xl mx-auto mt-32 px-6 grid md:grid-cols-3 gap-10">

        <div className="p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl hover:-translate-y-2 transition-all shadow-md cursor-pointer">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-400 rounded-xl flex items-center justify-center text-2xl mb-4">
            🚀
          </div>
          <h3 className="text-xl font-semibold mb-2">Fast Project Setup</h3>
          <p className="text-gray-300 text-sm">
            Create and start managing your projects instantly with ease.
          </p>
        </div>

        <div className="p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl hover:-translate-y-2 transition-all shadow-md cursor-pointer">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-400 rounded-xl flex items-center justify-center text-2xl mb-4">
            🤝
          </div>
          <h3 className="text-xl font-semibold mb-2">Team Collaboration</h3>
          <p className="text-gray-300 text-sm">
            Work together with your teammates in real-time effortlessly.
          </p>
        </div>

        <div className="p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl hover:-translate-y-2 transition-all shadow-md cursor-pointer">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-400 rounded-xl flex items-center justify-center text-2xl mb-4">
            🤖
          </div>
          <h3 className="text-xl font-semibold mb-2">AI Assistance</h3>
          <p className="text-gray-300 text-sm">
            Boost productivity using intelligent AI suggestions and tools.
          </p>
        </div>
      </section>

      {/* TEAM FOOTER */}
      <footer className="mt-16 text-center py-6 text-gray-400">

        <div className="flex justify-center gap-6 text-lg font-semibold mb-2">
          <span className="hover:text-blue-300 transition">| ARYAN |</span>
          <span className="hover:text-blue-300 transition">| ATUL |</span>
          <span className="hover:text-blue-300 transition">| HARSHIT |</span>
          <span className="hover:text-blue-300 transition">| ISHIKA |</span>
          <span className="hover:text-blue-300 transition">| SHRISHTI |</span>
        </div>

        <p className="text-sm">Made with ❤️ by Our Team</p>
      </footer>
    </div>
  );
};

export default Landing;

