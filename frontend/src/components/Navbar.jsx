import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import API from "../services/api";

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
  const [profile, setProfile] = useState(null);

  const token = localStorage.getItem("token");

  // ⭐ backend URL
  const BASE_URL = "https://careerforge-job-portal.onrender.com";

  useEffect(() => {
    if (token) loadProfile();
  }, [token]);

  const loadProfile = async () => {
    try {
      const res = await API.get("/users/profile");
      setProfile(res.data);
    } catch (err) {
      console.log(err);
    }
  };

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

        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-2 rounded-xl shadow-lg">
            <Briefcase size={18} className="text-black" />
          </div>
          <span className="text-xl md:text-2xl font-bold text-white">
            CareerForge
          </span>
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-3">

          {!token && (
            <>
              <Link to="/jobs" className={navItem("/jobs")}>Jobs</Link>
              <Link to="/login" className={navItem("/login")}>Login</Link>
              <Link
                to="/register"
                className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-5 py-2 rounded-xl font-semibold"
              >
                Register
              </Link>
            </>
          )}

          {token && (
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
                Profile
              </Link>
            </>
          )}

        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-2 md:gap-3">

          {/* AI BUTTON */}
          <button
            onClick={() => alert("AI Assistant Coming Soon 🤖")}
            className="p-2 rounded-xl bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500"
          >
            <Sparkles size={18} className="text-white" />
          </button>

          {token && (
            <>
              {/* Notifications */}
              <div className="relative p-2 rounded-lg hover:bg-white/10 cursor-pointer">
                <Bell size={18} />
              </div>

              {/* Avatar */}
              <div className="hidden md:flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full border border-white/10">

                {profile?.avatar ? (
                  <img
                    src={`${BASE_URL}/${profile.avatar}`}
                    alt="avatar"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <UserCircle size={18} />
                )}

                <span className="text-sm font-medium text-white">
                  {profile?.name || "User"}
                </span>

              </div>

              {/* Logout */}
              <button
                onClick={logout}
                className="hidden md:flex items-center gap-1 bg-red-500 px-4 py-2 rounded-xl hover:bg-red-600"
              >
                <LogOut size={16} />
                Logout
              </button>
            </>
          )}

          {/* MOBILE BUTTON */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-white/10"
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>

        </div>

      </div>

      {/* MOBILE DRAWER */}
      {open && (
        <div className="md:hidden bg-indigo-900/95 p-4 space-y-3">

          {token && (
            <>
              <Link to="/dashboard" className="block py-2">Dashboard</Link>
              <Link to="/jobs" className="block py-2">Jobs</Link>
              <Link to="/applications" className="block py-2">Applications</Link>
              <Link to="/profile" className="block py-2">Profile</Link>

              <button
                onClick={logout}
                className="w-full bg-red-500 py-2 rounded-lg mt-2"
              >
                Logout
              </button>
            </>
          )}

        </div>
      )}

    </nav>
  );
}