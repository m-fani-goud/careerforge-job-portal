import { Link, useLocation } from "react-router-dom";
import NotificationDropdown from "./NotificationDropdown";
import { useState, useEffect } from "react";
import API from "../services/api";

import {
  Briefcase,
  Sparkles,
  UserCircle,
  LogOut,
  Menu,
  X,
  Crown,
  Shield,
} from "lucide-react";

export default function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const token = localStorage.getItem("token");

  const [user, setUser] = useState(null);

  const BASE_URL = "https://careerforge-job-portal.onrender.com";

  /* ================= LOAD USER ================= */

  useEffect(() => {
    if (token) loadUser();
  }, [token]);

  const loadUser = async () => {
    try {
      const res = await API.get("/users/profile");
      setUser(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const avatarUrl = user?.avatar
    ? `${BASE_URL}/${user.avatar}`
    : null;

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  /* ================= ACTIVE NAV ================= */

  const navItem = (path) =>
    `px-5 py-2 rounded-xl font-medium transition-all duration-300 ${
      location.pathname === path
        ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-black shadow-lg scale-105"
        : "text-white/80 hover:text-white hover:bg-white/10"
    }`;

  /* ================= ROLE BADGE ================= */

  const roleBadge = () => {
    if (!user) return null;

    if (user.role === "admin")
      return (
        <span className="flex items-center gap-1 bg-red-500/20 text-red-300 px-2 py-0.5 rounded-full text-xs border border-red-400/30">
          <Shield size={12} /> Admin
        </span>
      );

    if (user.role === "recruiter")
      return (
        <span className="flex items-center gap-1 bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full text-xs border border-purple-400/30">
          <Crown size={12} /> Recruiter
        </span>
      );

    return (
      <span className="flex items-center gap-1 bg-green-500/20 text-green-300 px-2 py-0.5 rounded-full text-xs border border-green-400/30">
        <Crown size={12} /> Job Seeker
      </span>
    );
  };

  /* ================= CROWN ICON ================= */

  const crownIcon = () => {
    if (!user) return null;

    if (user.role === "admin") return null;

    return (
      <div className="relative">
        <Crown size={18} className="text-yellow-400 animate-bounce" />
        <div className="absolute inset-0 rounded-full bg-yellow-400 blur-md opacity-40 animate-pulse"></div>
      </div>
    );
  };

  /* ================= LINKS ================= */

  const renderLinks = () => {
    if (!token)
      return (
        <>
          <Link to="/jobs" className={navItem("/jobs")}>Jobs</Link>
          <Link to="/login" className={navItem("/login")}>Login</Link>
          <Link to="/register" className={navItem("/register")}>Register</Link>
          <Link to="/admin-login" className={navItem("/admin-login")}>Admin</Link>
        </>
      );

    if (user?.role === "user")
      return (
        <>
          <Link to="/dashboard" className={navItem("/dashboard")}>Dashboard</Link>
          <Link to="/jobs" className={navItem("/jobs")}>Jobs</Link>
          <Link to="/applications" className={navItem("/applications")}>Applications</Link>
          <Link to="/profile" className={navItem("/profile")}>Profile</Link>
        </>
      );

    if (user?.role === "recruiter")
      return (
        <>
          <Link to="/recruiter-dashboard" className={navItem("/recruiter-dashboard")}>Dashboard</Link>
          <Link to="/posted-jobs" className={navItem("/posted-jobs")}>My Jobs</Link>
          <Link to="/post-job" className={navItem("/post-job")}>Post Job</Link>
        </>
      );

    if (user?.role === "admin")
      return (
        <>
          <Link to="/admin-dashboard" className={navItem("/admin-dashboard")}>Dashboard</Link>
          <Link to="/admin-users" className={navItem("/admin-users")}>Users</Link>
          <Link to="/admin-jobs" className={navItem("/admin-jobs")}>Jobs</Link>
        </>
      );
  };

  /* ================= AI BUTTON ================= */

  const aiClick = () => {
    alert("🤖 AI Assistant Coming Soon!");
  };

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-indigo-900 via-purple-900 to-blue-900 border-b border-white/10 backdrop-blur-xl shadow-2xl">

      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-6">

        {/* LOGO */}

        <Link to="/" className="flex items-center gap-2 text-white font-bold text-xl">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-2 rounded-xl shadow-lg">
            <Briefcase size={18} className="text-black" />
          </div>
          CareerForge
        </Link>

        {/* LINKS */}

        <div className="hidden md:flex items-center gap-3 bg-white/5 p-1 rounded-2xl border border-white/10 backdrop-blur-xl">
          {renderLinks()}
        </div>

        {/* RIGHT */}

        <div className="flex items-center gap-3">

          {/* AI */}
          <button
            onClick={aiClick}
            className="relative group p-2 rounded-xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 shadow-lg hover:scale-110 transition"
          >
            <Sparkles size={18} className="text-white" />
            <div className="absolute inset-0 rounded-xl bg-purple-500 blur-lg opacity-40 group-hover:opacity-70 transition"></div>
          </button>

          {token && user && (
            <>
              <NotificationDropdown />

              {/* USER INFO */}

              <div className="hidden md:flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full border border-white/10">

                {user.role === "user" && (
                  avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="avatar"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <UserCircle size={20} className="text-white" />
                  )
                )}

                {crownIcon()}

                <div className="flex flex-col leading-tight">
                  <span className="text-white text-sm font-medium">
                    {user.name}
                  </span>
                  {roleBadge()}
                </div>

              </div>

              {/* LOGOUT */}

              <button
                onClick={logout}
                className="hidden md:flex items-center gap-1 bg-red-500 px-4 py-2 rounded-xl hover:bg-red-600 transition text-white"
              >
                <LogOut size={16} />
                Logout
              </button>
            </>
          )}

          {/* MOBILE */}

          <button
            className="md:hidden text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X /> : <Menu />}
          </button>

        </div>

      </div>

      {/* MOBILE MENU */}

      {mobileOpen && (
        <div className="md:hidden p-4 space-y-3 bg-indigo-900/95 backdrop-blur-xl border-t border-white/10">

          {renderLinks()}

          {token && (
            <button
              onClick={logout}
              className="w-full bg-red-500 py-2 rounded-lg text-white"
            >
              Logout
            </button>
          )}

        </div>
      )}

    </nav>
  );
}