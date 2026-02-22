import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import API from "../services/api";

import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Upload,
  LogOut,
  User,
  Bell,
  Menu,
  ChevronLeft,
  Sparkles,
} from "lucide-react";

export default function UserSidebar() {

  const location = useLocation();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const [profile, setProfile] = useState(null);
  const [applications, setApplications] = useState([]);

  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  })();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [appRes, userRes] = await Promise.all([
        API.get("/applications/me"),
        API.get("/users/profile"),
      ]);

      setApplications(appRes.data || []);
      setProfile(userRes.data || null);

    } catch (err) {
      console.log(err);
    }
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  // ================= PROFILE COMPLETION =================

  const sections = [
    profile?.name,
    profile?.summary,
    profile?.skills?.length,
    profile?.education?.length,
    profile?.experience?.length,
    profile?.resume,
  ];

  const completion = profile
    ? Math.round((sections.filter(Boolean).length / sections.length) * 100)
    : 0;

  // ================= AI SCORE =================

  const aiScore = Math.min(100, completion + (applications.length * 5));

  const getLevel = () => {
    if (aiScore >= 80) return "Elite";
    if (aiScore >= 60) return "Pro";
    if (aiScore >= 40) return "Gold";
    return "Starter";
  };

  // ================= NAV STYLE =================

  const navItem = (path) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
      location.pathname === path
        ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-black shadow-lg"
        : "text-white/80 hover:bg-white/10 hover:text-white"
    }`;

  return (
    <>
      {/* MOBILE TOP BAR */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-indigo-900 text-white">
        <button onClick={() => setMobileOpen(true)}>
          <Menu />
        </button>
        <span className="font-bold">CareerForge</span>
        <div />
      </div>

      {/* OVERLAY */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <div
        className={`
        fixed lg:static z-50 top-0 left-0 h-full
        bg-gradient-to-b from-indigo-900 via-purple-900 to-blue-900
        text-white flex flex-col justify-between shadow-2xl
        border-r border-white/10 backdrop-blur-xl
        transition-all duration-300
        
        ${collapsed ? "w-20 p-3" : "w-72 p-4"}
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0
        `}
      >

        {/* ================= TOP ================= */}
        <div>

          {/* LOGO + TOGGLE */}
          <div className="flex justify-between items-center mb-8">

            {!collapsed && (
              <div className="flex items-center gap-2">

                <div className="bg-gradient-to-r from-pink-500 to-yellow-500 p-2 rounded-xl shadow-lg">
                  <Sparkles size={18} />
                </div>

                <h2 className="text-2xl font-bold">
                  CareerForge
                </h2>

              </div>
            )}

            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-2 hover:bg-white/10 rounded-lg"
            >
              {collapsed ? <Menu /> : <ChevronLeft />}
            </button>

          </div>


          {/* ================= PROFILE ================= */}
          {!collapsed && (
            <div className="bg-white/10 rounded-2xl p-4 mb-8 border border-white/20">

              <div className="flex items-center gap-4">

                {/* Avatar Ring */}
                <div className="relative w-16 h-16">

                  <svg className="w-16 h-16 rotate-[-90deg]">
                    <circle
                      cx="32"
                      cy="32"
                      r="26"
                      stroke="white"
                      strokeOpacity="0.2"
                      strokeWidth="5"
                      fill="none"
                    />
                    <circle
                      cx="32"
                      cy="32"
                      r="26"
                      stroke="gold"
                      strokeWidth="5"
                      fill="none"
                      strokeDasharray={170}
                      strokeDashoffset={170 - (170 * completion) / 100}
                      strokeLinecap="round"
                    />
                  </svg>

                  <div className="absolute inset-0 flex items-center justify-center">

                    {profile?.avatar ? (
                      <img
                        src={`http://localhost:5000/${profile.avatar}`}
                        alt="avatar"
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-indigo-500 flex items-center justify-center font-bold">
                        {user?.name?.charAt(0)}
                      </div>
                    )}

                  </div>

                </div>

                <div>
                  <p className="font-semibold">
                    {user?.name || "User"}
                  </p>

                  <p className="text-xs opacity-70">
                    Job Seeker
                  </p>

                  <div className="mt-1 text-xs bg-yellow-400 text-black px-2 py-0.5 rounded-full w-fit">
                    {getLevel()} Level
                  </div>
                </div>

              </div>

              {/* AI SCORE */}
              <div className="mt-4 text-xs">

                <div className="flex justify-between mb-1">
                  <span>AI Profile Score</span>
                  <span>{aiScore}%</span>
                </div>

                <div className="w-full bg-white/20 h-2 rounded-full">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500"
                    style={{ width: `${aiScore}%` }}
                  />
                </div>

              </div>

            </div>
          )}


          {/* ================= NAV ================= */}
          <nav className="space-y-2">

            <Link to="/dashboard" className={navItem("/dashboard")}>
              <LayoutDashboard size={18} />
              {!collapsed && "Dashboard"}
            </Link>

            <Link to="/jobs" className={navItem("/jobs")}>
              <Briefcase size={18} />
              {!collapsed && "Browse Jobs"}
            </Link>

            <Link to="/applications" className={navItem("/applications")}>

              <div className="relative flex items-center gap-3">

                <FileText size={18} />

                {!collapsed && "My Applications"}

                {applications.length > 0 && (
                  <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs px-2 rounded-full">
                    {applications.length}
                  </span>
                )}

              </div>

            </Link>

            <Link to="/profile" className={navItem("/profile")}>
              <User size={18} />
              {!collapsed && "Profile"}
            </Link>

            <Link to="/upload-resume" className={navItem("/upload-resume")}>
              <Upload size={18} />
              {!collapsed && "Resume"}
            </Link>

          </nav>

        </div>


        {/* ================= BOTTOM ================= */}
        <div className="space-y-3">

          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/10">
            <Bell size={18} />
            {!collapsed && <span className="text-sm">Notifications</span>}
          </div>

          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500 hover:bg-red-600 transition"
          >
            <LogOut size={18} />
            {!collapsed && "Logout"}
          </button>

        </div>

      </div>
    </>
  );
}