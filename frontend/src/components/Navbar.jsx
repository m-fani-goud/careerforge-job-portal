import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

import {
  Briefcase,
  LogOut,
  UserCircle,
  Shield,
  LayoutDashboard,
  FileText,
  Bell,
  Sparkles,
  Menu,
  X,
} from "lucide-react";

export default function Navbar() {
  const location = useLocation();

  const [open, setOpen] = useState(false);

  const token = localStorage.getItem("token");

  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  })();

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const navItem = (path) =>
    `flex items-center gap-1 px-4 py-2 rounded-xl transition-all duration-300 font-medium ${
      location.pathname === path
        ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-black shadow-lg"
        : "hover:bg-white/10 text-white/90 hover:text-white"
    }`;

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-gradient-to-r from-indigo-900/90 via-blue-900/90 to-purple-900/90 border-b border-white/10 shadow-2xl">

      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-4 md:px-6">

        {/* ================= LOGO ================= */}
        <Link to="/" className="flex items-center gap-2 group">

          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-2 rounded-xl shadow-lg group-hover:scale-110 transition">
            <Briefcase size={18} className="text-black" />
          </div>

          <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-yellow-300 via-white to-yellow-300 bg-[length:200%_auto] bg-clip-text text-transparent animate-[shine_4s_linear_infinite]">
            CareerForge
          </span>

        </Link>


        {/* ================= DESKTOP MENU ================= */}
        <div className="hidden md:flex items-center gap-3">

          {!token && (
            <>
              <Link to="/jobs" className={navItem("/jobs")}>Jobs</Link>
              <Link to="/login" className={navItem("/login")}>Login</Link>

              <Link
                to="/admin-login"
                className="flex items-center gap-1 bg-red-500 px-4 py-2 rounded-xl hover:bg-red-600 transition shadow"
              >
                <Shield size={16} />
                Admin
              </Link>

              <Link
                to="/register"
                className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-5 py-2 rounded-xl font-semibold hover:scale-105 transition shadow-lg"
              >
                Register
              </Link>
            </>
          )}

          {token && user?.role === "user" && (
            <>
              <Link to="/dashboard" className={navItem("/dashboard")}>
                <LayoutDashboard size={16} /> Dashboard
              </Link>

              <Link to="/jobs" className={navItem("/jobs")}>
                <Briefcase size={16} /> Jobs
              </Link>

              <Link to="/applications" className={navItem("/applications")}>
                <FileText size={16} /> Applications
              </Link>

              <Link to="/profile" className={navItem("/profile")}>
                <UserCircle size={16} /> Profile
              </Link>
            </>
          )}

          {token && user?.role === "recruiter" && (
            <>
              <Link to="/recruiter-dashboard" className={navItem("/recruiter-dashboard")}>
                Dashboard
              </Link>

              <Link to="/post-job" className={navItem("/post-job")}>
                Post Job
              </Link>

              <Link to="/posted-jobs" className={navItem("/posted-jobs")}>
                My Jobs
              </Link>
            </>
          )}

          {token && user?.role === "admin" && (
            <Link
              to="/admin-dashboard"
              className="flex items-center gap-1 bg-red-500 px-4 py-2 rounded-xl shadow hover:bg-red-600"
            >
              <Shield size={16} />
              Admin Panel
            </Link>
          )}
        </div>


        {/* ================= RIGHT SIDE ================= */}
        <div className="flex items-center gap-2 md:gap-3">

          {/* AI BUTTON */}
          <button
            onClick={() => alert("AI Assistant Coming Soon 🤖")}
            className="relative group p-2 rounded-xl bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 shadow-lg hover:scale-110 transition"
          >
            <Sparkles size={18} className="text-white" />
            <div className="absolute inset-0 rounded-xl bg-purple-500 blur-lg opacity-40 group-hover:opacity-70 transition"></div>
          </button>


          {token && (
            <>
              {/* Notifications */}
              <div className="relative p-2 rounded-lg hover:bg-white/10 cursor-pointer">
                <Bell size={18} />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </div>

              {/* Avatar */}
              <div className="hidden md:flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full border border-white/10">
                {user?.avatar ? (
                  <img
                    src={`http://localhost:5000/${user.avatar}`}
                    alt="avatar"
                    className="w-7 h-7 rounded-full object-cover"
                  />
                ) : (
                  <UserCircle size={18} />
                )}
                <span className="text-sm font-medium">
                  {user?.name}
                </span>
              </div>

              {/* Logout */}
              <button
                onClick={logout}
                className="hidden md:flex items-center gap-1 bg-red-500 px-4 py-2 rounded-xl hover:bg-red-600 transition shadow"
              >
                <LogOut size={16} />
                Logout
              </button>
            </>
          )}

          {/* MOBILE MENU BUTTON */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-white/10"
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>

        </div>

      </div>


      {/* ================= MOBILE DRAWER ================= */}

      {open && (
        <div className="md:hidden bg-indigo-900/95 backdrop-blur-xl border-t border-white/10 p-4 space-y-3">

          {!token && (
            <>
              <Link to="/jobs" className="block py-2">Jobs</Link>
              <Link to="/login" className="block py-2">Login</Link>
              <Link to="/register" className="block py-2">Register</Link>
            </>
          )}

          {token && user?.role === "user" && (
            <>
              <Link to="/dashboard" className="block py-2">Dashboard</Link>
              <Link to="/jobs" className="block py-2">Jobs</Link>
              <Link to="/applications" className="block py-2">Applications</Link>
              <Link to="/profile" className="block py-2">Profile</Link>
            </>
          )}

          {token && user?.role === "recruiter" && (
            <>
              <Link to="/recruiter-dashboard" className="block py-2">Dashboard</Link>
              <Link to="/post-job" className="block py-2">Post Job</Link>
              <Link to="/posted-jobs" className="block py-2">My Jobs</Link>
            </>
          )}

          {token && (
            <button
              onClick={logout}
              className="w-full bg-red-500 py-2 rounded-lg mt-2"
            >
              Logout
            </button>
          )}

        </div>
      )}


      {/* LOGO ANIMATION */}
      <style>
        {`
          @keyframes shine {
            0% { background-position: 0% }
            100% { background-position: 200% }
          }
        `}
      </style>

    </nav>
  );
}