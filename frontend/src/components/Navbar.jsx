import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  Briefcase,
  Bell,
  Sparkles,
  UserCircle,
  LogOut,
  Menu,
  X,
} from "lucide-react";

export default function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const token = localStorage.getItem("token");

  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  })();

  // ✅ backend URL
  const BASE_URL = "https://careerforge-job-portal.onrender.com";

  const avatarUrl = user?.avatar
    ? `${BASE_URL}/${user.avatar}`
    : null;

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  /* ================= ACTIVE STYLE ================= */

  const navItem = (path) =>
    `px-5 py-2 rounded-xl font-medium transition-all duration-300 ${
      location.pathname === path
        ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-black shadow-lg"
        : "text-white/80 hover:text-white hover:bg-white/10"
    }`;

  /* ================= ROLE LINKS ================= */

  const renderLinks = () => {
    if (!token)
      return (
        <>
          <Link to="/jobs" className={navItem("/jobs")}>
            Jobs
          </Link>
          <Link to="/login" className={navItem("/login")}>
            Login
          </Link>
          <Link to="/register" className={navItem("/register")}>
            Register
          </Link>
        </>
      );

    if (user?.role === "user")
      return (
        <>
          <Link to="/dashboard" className={navItem("/dashboard")}>
            Dashboard
          </Link>
          <Link to="/jobs" className={navItem("/jobs")}>
            Jobs
          </Link>
          <Link to="/applications" className={navItem("/applications")}>
            Applications
          </Link>
          <Link to="/profile" className={navItem("/profile")}>
            Profile
          </Link>
        </>
      );

    if (user?.role === "recruiter")
      return (
        <>
          <Link
            to="/recruiter-dashboard"
            className={navItem("/recruiter-dashboard")}
          >
            Dashboard
          </Link>
          <Link
            to="/posted-jobs"
            className={navItem("/posted-jobs")}
          >
            My Jobs
          </Link>
          <Link
            to="/post-job"
            className={navItem("/post-job")}
          >
            Post Job
          </Link>
        </>
      );

    if (user?.role === "admin")
      return (
        <Link
          to="/admin-dashboard"
          className={navItem("/admin-dashboard")}
        >
          Admin Panel
        </Link>
      );
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-gradient-to-r from-indigo-900 via-purple-900 to-blue-900 border-b border-white/10 backdrop-blur-xl shadow-2xl">

        <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-6">

          {/* ================= LOGO ================= */}

          <Link
            to="/"
            className="flex items-center gap-2 text-white font-bold text-xl"
          >
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-2 rounded-xl">
              <Briefcase size={18} className="text-black" />
            </div>
            CareerForge
          </Link>

          {/* ================= LINKS ================= */}

          <div className="hidden md:flex items-center gap-3 bg-white/5 p-1 rounded-2xl border border-white/10">
            {renderLinks()}
          </div>

          {/* ================= RIGHT SIDE ================= */}

          <div className="flex items-center gap-3">

            {/* AI BUTTON */}
            <button className="p-2 rounded-xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 shadow-lg hover:scale-110 transition">
              <Sparkles size={18} className="text-white" />
            </button>

            {token && (
              <>
                {/* NOTIFICATION */}
                <div className="relative p-2 rounded-lg hover:bg-white/10 cursor-pointer">
                  <Bell size={18} className="text-white" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </div>

                {/* AVATAR ONLY FOR USER */}
                {user?.role === "user" && (
                  <div className="hidden md:flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full border border-white/10">

                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt="avatar"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <UserCircle size={20} className="text-white" />
                    )}

                    <span className="text-white text-sm">
                      {user?.name}
                    </span>

                  </div>
                )}

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

            {/* MOBILE BUTTON */}
            <button
              className="md:hidden text-white"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X /> : <Menu />}
            </button>

          </div>

        </div>

        {/* ================= MOBILE MENU ================= */}

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
    </>
  );
}