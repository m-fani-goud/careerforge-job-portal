import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import API from "../services/api";

import {
  Briefcase,
  LayoutDashboard,
  FileText,
  UserCircle,
  Shield,
  LogOut,
  Bell,
  Menu,
  X,
  ChevronDown,
  Sparkles,
} from "lucide-react";

export default function Navbar() {

  const location = useLocation();

  const [open, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const [profile, setProfile] = useState(null);
  const [notifications, setNotifications] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  const token = localStorage.getItem("token");

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {}

  const role = user?.role || "guest";

  const BASE_URL = "https://careerforge-job-portal.onrender.com";

  // ================= LOAD DATA =================

  useEffect(() => {
    if (token) {
      loadProfile();
      loadNotifications();
    }
  }, [token]);

  const loadProfile = async () => {
    try {
      const res = await API.get("/users/profile");
      setProfile(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const loadNotifications = async () => {
    try {
      const res = await API.get("/applications/me");
      setNotifications(res.data.length || 0);
    } catch (err) {
      console.log(err);
    }
  };

  // ================= SCROLL EFFECT =================

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  // ================= NAV STYLE =================

  const navItem = (path) =>
    `relative px-4 py-2 font-medium transition ${
      location.pathname === path
        ? "text-yellow-300"
        : "text-white/80 hover:text-white"
    }`;

  const underline = (path) =>
    location.pathname === path
      ? "scale-x-100"
      : "scale-x-0 group-hover:scale-x-100";

  // ================= ROLE BADGE =================

  const roleColor =
    role === "admin"
      ? "bg-red-500"
      : role === "recruiter"
      ? "bg-purple-500"
      : "bg-green-500";

  // ================= ROLE MENU =================

  const renderMenu = () => {

    if (!token) {
      return (
        <>
          <NavLink to="/jobs" label="Jobs" />
          <NavLink to="/login" label="Login" />

          <Link
            to="/admin-login"
            className="bg-red-500 px-4 py-2 rounded-xl"
          >
            Admin
          </Link>

          <Link
            to="/register"
            className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-5 py-2 rounded-xl font-semibold"
          >
            Register
          </Link>
        </>
      );
    }

    if (role === "user") {
      return (
        <>
          <NavLink to="/dashboard" label="Dashboard" />
          <NavLink to="/jobs" label="Jobs" />
          <NavLink to="/applications" label="Applications" />
          <NavLink to="/profile" label="Profile" />
        </>
      );
    }

    if (role === "recruiter") {
      return (
        <>
          <NavLink to="/recruiter-dashboard" label="Dashboard" />
          <NavLink to="/posted-jobs" label="My Jobs" />
          <NavLink to="/post-job" label="Post Job" />
        </>
      );
    }

    if (role === "admin") {
      return (
        <>
          <NavLink to="/admin-dashboard" label="Admin Panel" />
        </>
      );
    }
  };

  return (
    <nav
      className={`sticky top-0 z-50 transition ${
        scrolled
          ? "bg-indigo-900/95 shadow-2xl"
          : "bg-indigo-900/70"
      } backdrop-blur-xl border-b border-white/10`}
    >

      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-4 md:px-6">

        {/* ================= LOGO ================= */}
        <Link to="/" className="flex items-center gap-2">

          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-2 rounded-xl shadow">
            <Briefcase size={18} className="text-black" />
          </div>

          <span className="text-xl font-bold text-white">
            CareerForge
          </span>

        </Link>

        {/* ================= CENTER MENU ================= */}
        <div className="hidden md:flex items-center gap-6 flex-1 justify-center">

          {renderMenu()}

        </div>

        {/* ================= RIGHT SIDE ================= */}
        <div className="flex items-center gap-3">

          {/* AI BUTTON */}
          <button
            onClick={() => alert("AI Assistant Coming Soon 🤖")}
            className="relative group p-2 rounded-xl bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 shadow-lg hover:scale-110 transition"
          >
            <Sparkles size={18} className="text-white" />
            <div className="absolute inset-0 rounded-xl bg-purple-500 blur-lg opacity-40 group-hover:opacity-70"></div>
          </button>

          {token && (
            <>
              {/* Notifications */}
              <div className="relative p-2 rounded-lg hover:bg-white/10 cursor-pointer">
                <Bell size={18} />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-xs px-1.5 rounded-full">
                    {notifications}
                  </span>
                )}
              </div>

              {/* Avatar */}
              <div className="relative">

                <button
                  onClick={() => setDropdown(!dropdown)}
                  className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full border border-white/10 hover:bg-white/20 transition"
                >
                  {profile?.avatar ? (
                    <img
                      src={`${BASE_URL}/${profile.avatar}`}
                      alt="avatar"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <UserCircle size={20} />
                  )}

                  {/* Role Badge */}
                  <span
                    className={`text-xs text-white px-2 py-0.5 rounded-full ${roleColor}`}
                  >
                    {role}
                  </span>

                  <ChevronDown size={14} />
                </button>

                {/* Dropdown */}
                {dropdown && (
                  <div className="absolute right-0 mt-3 w-44 backdrop-blur-xl bg-white/90 text-black rounded-xl shadow-lg overflow-hidden border animate-fadeIn">

                    {role === "user" && (
                      <Link
                        to="/profile"
                        className="block px-4 py-2 hover:bg-gray-100"
                      >
                        Profile
                      </Link>
                    )}

                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>

                  </div>
                )}

              </div>
            </>
          )}

          {/* MOBILE */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-white/10"
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>

        </div>

      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden bg-indigo-900/95 p-4 space-y-3">

          {renderMenu()}

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

    </nav>
  );
}


/* ================= NAV LINK WITH ANIMATION ================= */

function NavLink({ to, label }) {

  const location = useLocation();
  const active = location.pathname === to;

  return (
    <Link
      to={to}
      className="group relative px-4 py-2 text-white/80 hover:text-white"
    >
      {label}

      {/* Animated underline */}
      <span
        className={`absolute left-0 -bottom-1 h-0.5 w-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-transform duration-300 origin-left ${
          active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
        }`}
      />
    </Link>
  );
}