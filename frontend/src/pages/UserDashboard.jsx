import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";
import UserLayout from "../components/UserLayout";

import {
  Briefcase,
  FileText,
  Upload,
  CheckCircle,
  Clock,
  XCircle,
  User,
} from "lucide-react";

export default function UserDashboard() {
  const [applications, setApplications] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const appRes = await API.get("/applications/me");
      const userRes = await API.get("/users/profile");

      setApplications(appRes.data);
      setProfile(userRes.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !profile) {
    return (
      <UserLayout>
        <div className="p-10 text-center text-white">Loading...</div>
      </UserLayout>
    );
  }

  /* ================= STATS ================= */

  const total = applications.length;
  const shortlisted = applications.filter((a) => a.status === "shortlisted").length;
  const rejected = applications.filter((a) => a.status === "rejected").length;
  const pending = applications.filter((a) => a.status === "applied").length;

  /* ================= PROFILE COMPLETION ================= */

  const sections = [
    profile?.name,
    profile?.summary,
    profile?.skills?.length,
    profile?.education?.length,
    profile?.experience?.length,
    profile?.resume,
  ];

  const completion = Math.round(
    (sections.filter(Boolean).length / sections.length) * 100
  );

  return (
    <UserLayout>

      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 p-6 rounded-2xl">

        {/* ================= HEADER ================= */}
        <div className="bg-white/10 backdrop-blur-xl text-white p-8 rounded-2xl shadow mb-6 flex items-center justify-between border border-white/20">

          <div className="flex items-center gap-5">

            {/* Avatar */}
            {profile?.avatar ? (
              <img
                src={`http://localhost:5000/${profile.avatar}`}
                alt="avatar"
                className="w-20 h-20 rounded-full object-cover border-4 border-white"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-3xl font-bold">
                {profile?.name?.charAt(0)}
              </div>
            )}

            <div>
              <h1 className="text-3xl font-bold">
                Welcome back, {profile?.name} 👋
              </h1>

              <p className="opacity-80">{profile?.email}</p>

              <p className="text-sm mt-2">
                Profile Completion: <span className="font-semibold">{completion}%</span>
              </p>
            </div>
          </div>

          <Link
            to="/profile"
            className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-5 py-2 rounded-lg font-semibold hover:scale-105 transition"
          >
            Edit Profile
          </Link>

        </div>

        {/* ================= RESUME ================= */}
        <div className="bg-white/10 backdrop-blur-xl p-6 rounded-xl shadow mb-6 flex justify-between items-center border border-white/20 text-white">

          <div className="flex items-center gap-4">
            <Upload className="text-yellow-400" size={28} />

            <div>
              <h3 className="font-semibold text-lg">Resume</h3>

              <p className="text-sm opacity-80">
                {profile?.resume
                  ? "Your resume is uploaded"
                  : "Upload resume to apply faster"}
              </p>
            </div>
          </div>

          <Link
            to="/profile"
            className={`px-4 py-2 rounded-lg font-semibold ${
              profile?.resume
                ? "bg-green-500 text-white"
                : "bg-blue-500 text-white"
            }`}
          >
            {profile?.resume ? "Update Resume" : "Upload Resume"}
          </Link>

        </div>

        {/* ================= STATS ================= */}
        <div className="grid md:grid-cols-4 gap-6 mb-6">

          <StatCard title="Total Applied" value={total} icon={<Briefcase />} />
          <StatCard title="Pending" value={pending} icon={<Clock />} />
          <StatCard title="Shortlisted" value={shortlisted} icon={<CheckCircle />} />
          <StatCard title="Rejected" value={rejected} icon={<XCircle />} />

        </div>

        {/* ================= QUICK ACTIONS ================= */}
        <div className="grid md:grid-cols-3 gap-6 mb-6">

          <ActionCard
            to="/jobs"
            icon={<Briefcase />}
            title="Browse Jobs"
            desc="Explore opportunities"
          />

          <ActionCard
            to="/applications"
            icon={<FileText />}
            title="My Applications"
            desc="Track your applications"
          />

          <ActionCard
            to="/profile"
            icon={<User />}
            title="Complete Profile"
            desc="Increase hiring chances"
          />

        </div>

        {/* ================= RECENT APPLICATIONS ================= */}
        <div className="bg-white/10 backdrop-blur-xl p-6 rounded-xl shadow text-white border border-white/20">

          <h2 className="text-xl font-semibold mb-4">
            Recent Applications
          </h2>

          {applications.slice(0, 5).map((app) => (
            <div
              key={app._id}
              className="flex justify-between items-center border-b border-white/10 py-4"
            >
              <div>
                <p className="font-semibold">{app.job?.title}</p>
                <p className="text-sm opacity-70">{app.job?.company}</p>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  app.status === "shortlisted"
                    ? "bg-green-500/20 text-green-300"
                    : app.status === "rejected"
                    ? "bg-red-500/20 text-red-300"
                    : "bg-yellow-500/20 text-yellow-300"
                }`}
              >
                {app.status}
              </span>
            </div>
          ))}

          {applications.length === 0 && (
            <p className="opacity-70">No applications yet</p>
          )}

        </div>

      </div>

    </UserLayout>
  );
}


/* ================= COMPONENTS ================= */

function StatCard({ title, value, icon }) {
  return (
    <div className="bg-white/10 backdrop-blur-xl p-5 rounded-xl shadow flex items-center gap-4 border border-white/20 text-white hover:scale-105 transition">

      <div className="p-3 rounded-lg bg-gradient-to-r from-yellow-400 to-orange-500 text-black">
        {icon}
      </div>

      <div>
        <p className="text-sm opacity-80">{title}</p>
        <p className="text-xl font-bold">{value}</p>
      </div>

    </div>
  );
}


function ActionCard({ to, icon, title, desc }) {
  return (
    <Link
      to={to}
      className="bg-white/10 backdrop-blur-xl p-6 rounded-xl shadow hover:shadow-lg transition transform hover:-translate-y-1 border border-white/20 text-white"
    >
      <div className="text-yellow-400 mb-3">{icon}</div>

      <h2 className="text-lg font-semibold mb-1">{title}</h2>

      <p className="opacity-70">{desc}</p>
    </Link>
  );
}