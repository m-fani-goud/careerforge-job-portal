import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";

import {
  LayoutDashboard,
  Briefcase,
  PlusCircle,
  LogOut,
  Menu,
  X,
  Crown,
} from "lucide-react";

export default function RecruiterSidebar() {

  const location = useLocation();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const [jobsCount, setJobsCount] = useState(0);

  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  })();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const res = await API.get("/jobs/my");
      setJobsCount(res.data?.length || 0);
    } catch (err) {
      console.log(err);
    }
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  // ================= RECRUITER SCORE =================

  const recruiterScore = Math.min(100, jobsCount * 15);

  const getLevel = () => {
    if (recruiterScore >= 80) return "Elite";
    if (recruiterScore >= 60) return "Pro";
    if (recruiterScore >= 40) return "Gold";
    return "Bronze";
  };

  const navItem = (path) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
      location.pathname === path
        ? "bg-white text-indigo-700 shadow-lg"
        : "text-white/80 hover:bg-white/10 hover:text-white"
    }`;

  return (
    <>
      {/* MOBILE TOP BAR */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-indigo-900 text-white">
        <button onClick={() => setMobileOpen(true)}>
          <Menu />
        </button>
        <span className="font-bold">Recruiter Panel</span>
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
        bg-gradient-to-b from-indigo-900 via-purple-900 to-indigo-800
        text-white backdrop-blur-xl shadow-2xl
        border-r border-white/10
        flex flex-col justify-between
        transition-all duration-300
        
        ${collapsed ? "w-20 p-3" : "w-72 p-4"}
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0
        `}
      >

        {/* ================= HEADER ================= */}
        <div>

          {/* TOGGLE */}
          <div className="flex justify-between items-center mb-6">

            {!collapsed && (
              <div className="flex items-center gap-2">

                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-2 rounded-xl shadow-lg">
                  <Crown size={18} />
                </div>

                <div>
                  <h2 className="text-xl font-bold">
                    CareerForge
                  </h2>
                  <p className="text-xs text-white/60">
                    Recruiter
                  </p>
                </div>

              </div>
            )}

            <button
              onClick={() => setCollapsed(!collapsed)}
              className="bg-white/10 p-2 rounded-lg hover:bg-white/20"
            >
              {collapsed ? <Menu size={18} /> : <X size={18} />}
            </button>

          </div>


          {/* ================= PROFILE CARD ================= */}
          {!collapsed && (
            <div className="mb-8">

              <div className="bg-white/10 backdrop-blur-lg p-4 rounded-2xl border border-white/20">

                <div className="flex items-center gap-3">

                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-indigo-500 flex items-center justify-center font-bold">
                    {user?.name?.charAt(0)}
                  </div>

                  <div>
                    <p className="font-semibold text-sm">
                      {user?.name}
                    </p>
                    <p className="text-xs text-white/60">
                      Recruiter
                    </p>

                    {/* LEVEL */}
                    <div className="mt-1 text-xs bg-yellow-400 text-black px-2 py-0.5 rounded-full w-fit">
                      {getLevel()} Level
                    </div>

                  </div>

                </div>

                {/* SCORE BAR */}
                <div className="mt-4 text-xs">

                  <div className="flex justify-between mb-1">
                    <span>AI Recruiter Score</span>
                    <span>{recruiterScore}%</span>
                  </div>

                  <div className="w-full bg-white/20 h-2 rounded-full">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500"
                      style={{ width: `${recruiterScore}%` }}
                    />
                  </div>

                </div>

              </div>

            </div>
          )}


          {/* ================= NAV ================= */}
          <nav className="space-y-2">

            <Link
              to="/recruiter-dashboard"
              className={navItem("/recruiter-dashboard")}
            >
              <LayoutDashboard size={20} />
              {!collapsed && "Dashboard"}
            </Link>

            <Link
              to="/post-job"
              className={navItem("/post-job")}
            >
              <PlusCircle size={20} />
              {!collapsed && "Post Job"}
            </Link>

            <Link
              to="/posted-jobs"
              className={navItem("/posted-jobs")}
            >
              <div className="relative flex items-center gap-3">

                <Briefcase size={20} />

                {!collapsed && "My Jobs"}

                {!collapsed && jobsCount > 0 && (
                  <span className="ml-auto bg-pink-500 text-xs px-2 py-0.5 rounded-full">
                    {jobsCount}
                  </span>
                )}

              </div>
            </Link>

          </nav>

        </div>


        {/* ================= FOOTER ================= */}
        <div className="mt-6">

          <button
            onClick={logout}
            className="flex items-center gap-3 bg-red-500 hover:bg-red-600 w-full px-4 py-3 rounded-xl transition"
          >
            <LogOut size={20} />
            {!collapsed && "Logout"}
          </button>

        </div>

      </div>
    </>
  );
}