import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";
import RecruiterLayout from "../components/RecruiterLayout";

import CountUp from "react-countup";
import { motion } from "framer-motion";

import {
  Briefcase,
  Users,
  CheckCircle,
  TrendingUp,
  Crown,
  Bell,
  PlusCircle,
} from "lucide-react";

import {
  LineChart,
  Line,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";

export default function RecruiterDashboard() {

  const user = JSON.parse(localStorage.getItem("user"));

  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const jobRes = await API.get("/jobs/my");
      const appRes = await API.get("/applications/me");
      const profileRes = await API.get("/users/profile");

      setJobs(jobRes.data);
      setApplications(appRes.data);
      setProfile(profileRes.data);
    } catch (err) {
      console.log(err);
    }
  };

  // ================= STATS =================

  const totalJobs = jobs.length;
  const totalApplicants = applications.length;
  const shortlisted = applications.filter(a => a.status === "shortlisted").length;
  const rejected = applications.filter(a => a.status === "rejected").length;

  const successRate =
    totalApplicants === 0 ? 0 : Math.round((shortlisted / totalApplicants) * 100);

  // ================= AI SCORE =================

  const aiScore = Math.min(
    100,
    Math.round(
      totalJobs * 12 +
      shortlisted * 6 +
      (successRate * 0.5)
    )
  );

  // ================= LEVEL =================

  const getLevel = () => {
    if (aiScore >= 95) return { name: "Elite", color: "text-pink-400", icon: "👑" };
    if (aiScore >= 80) return { name: "Pro", color: "text-yellow-400", icon: "🏆" };
    if (aiScore >= 60) return { name: "Gold", color: "text-yellow-300", icon: "🥇" };
    if (aiScore >= 40) return { name: "Silver", color: "text-gray-300", icon: "🥈" };
    return { name: "Bronze", color: "text-orange-400", icon: "🥉" };
  };

  const level = getLevel();

  // ================= PROFILE COMPLETION =================

  const sections = [
    profile?.name,
    profile?.email,
    profile?.companyName,
    totalJobs > 0,
    totalApplicants > 0,
  ];

  const completion =
    Math.round((sections.filter(Boolean).length / sections.length) * 100);

  // ================= CHART DATA =================

  const lineData = [
    { name: "Week 1", value: 4 },
    { name: "Week 2", value: 7 },
    { name: "Week 3", value: 5 },
    { name: "Week 4", value: totalApplicants || 2 },
  ];

  const pieData = [
    { name: "Shortlisted", value: shortlisted },
    { name: "Rejected", value: rejected },
  ];

  const COLORS = ["#4ade80", "#f87171"];

  // ================= AI INSIGHTS =================

  const aiInsights = [
    "Post more jobs to increase visibility",
    "Respond faster to applicants",
    "High success rate detected — keep it up",
  ];

  return (
    <RecruiterLayout>

      <div className="min-h-screen p-6 text-white bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#312e81]">

        {/* ================= HEADER ================= */}

        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-2xl mb-6 flex justify-between items-center"
        >

          <div className="flex items-center gap-6">

            {/* Avatar Ring */}

            <div className="relative w-24 h-24">

              <svg className="absolute w-24 h-24">
                <circle
                  cx="48"
                  cy="48"
                  r="42"
                  stroke="white"
                  strokeOpacity="0.2"
                  strokeWidth="6"
                  fill="none"
                />

                <circle
                  cx="48"
                  cy="48"
                  r="42"
                  stroke="url(#grad)"
                  strokeWidth="6"
                  fill="none"
                  strokeDasharray={264}
                  strokeDashoffset={264 - (264 * completion) / 100}
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="grad">
                    <stop offset="0%" stopColor="#facc15" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
              </svg>

              <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center text-3xl font-bold">
                {user?.name?.charAt(0)}
              </div>

            </div>

            <div>
              <h1 className="text-3xl font-bold">
                {user?.name}
              </h1>

              <p className="opacity-80">
                Completion: {completion}%
              </p>

              <p className={`${level.color} font-semibold`}>
                {level.icon} {level.name} Recruiter
              </p>
            </div>

          </div>

          <div className="flex items-center gap-4">

            {/* Notification */}
            <div className="relative">
              <Bell />
              {applications.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-xs px-2 rounded-full">
                  {applications.length}
                </span>
              )}
            </div>

            <Link
              to="/post-job"
              className="bg-gradient-to-r from-yellow-400 to-pink-500 text-black px-5 py-2 rounded-lg font-semibold"
            >
              Post Job
            </Link>

          </div>

        </motion.div>


        {/* ================= AI SCORE ================= */}

        <div className="grid md:grid-cols-4 gap-6 mb-6">

          <Stat title="Jobs Posted" value={totalJobs} icon={<Briefcase />} />
          <Stat title="Applicants" value={totalApplicants} icon={<Users />} />
          <Stat title="Shortlisted" value={shortlisted} icon={<CheckCircle />} />
          <Stat title="Success Rate" value={successRate} suffix="%" icon={<TrendingUp />} />

        </div>


        {/* ================= AI PANEL ================= */}

        <div className="bg-white/10 backdrop-blur-xl p-6 rounded-xl mb-6">

          <div className="flex justify-between items-center">

            <div>
              <h2 className="text-xl font-semibold flex gap-2 items-center">
                <Crown className="text-yellow-400" />
                AI Recruiter Score
              </h2>
              <p className="opacity-70">
                Performance based on hiring efficiency
              </p>
            </div>

            <div className="text-4xl font-bold text-yellow-300">
              <CountUp end={aiScore} duration={2} />
            </div>

          </div>

          {/* Insights */}

          <div className="mt-4 space-y-2">

            {aiInsights.map((tip, i) => (
              <p key={i} className="text-sm opacity-80">
                ✅ {tip}
              </p>
            ))}

          </div>

        </div>


        {/* ================= CHARTS ================= */}

        <div className="grid md:grid-cols-2 gap-6 mb-6">

          <div className="bg-white/10 p-6 rounded-xl">

            <h3 className="mb-3">Applications Trend</h3>

            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={lineData}>
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#facc15"
                  strokeWidth={3}
                />
                <Tooltip />
              </LineChart>
            </ResponsiveContainer>

          </div>

          <div className="bg-white/10 p-6 rounded-xl">

            <h3 className="mb-3">Hiring Funnel</h3>

            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  outerRadius={80}
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

          </div>

        </div>


        {/* ================= ACTIONS ================= */}

        <div className="grid md:grid-cols-2 gap-6">

          <ActionCard
            to="/post-job"
            title="Create Job"
            icon={<PlusCircle />}
          />

          <ActionCard
            to="/posted-jobs"
            title="Manage Jobs"
            icon={<Briefcase />}
          />

        </div>

      </div>

    </RecruiterLayout>
  );
}


/* ================= COMPONENTS ================= */

function Stat({ title, value, icon, suffix = "" }) {
  return (
    <div className="bg-white/10 backdrop-blur-xl p-5 rounded-xl flex items-center gap-4">

      <div className="p-3 bg-gradient-to-r from-yellow-400 to-pink-500 rounded-lg text-black">
        {icon}
      </div>

      <div>
        <p className="text-sm opacity-70">{title}</p>
        <p className="text-xl font-bold">
          <CountUp end={value} duration={2} />
          {suffix}
        </p>
      </div>

    </div>
  );
}

function ActionCard({ to, title, icon }) {
  return (
    <Link
      to={to}
      className="bg-white/10 backdrop-blur-xl p-6 rounded-xl hover:scale-105 transition"
    >
      <div className="text-yellow-300 mb-2">{icon}</div>
      <h2 className="text-lg font-semibold">{title}</h2>
    </Link>
  );
}