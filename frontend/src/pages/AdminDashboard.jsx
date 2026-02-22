import { useEffect, useState } from "react";
import API from "../services/api";

import {
  CheckCircle,
  XCircle,
  Building,
  User,
  Mail,
  Clock,
  ShieldCheck,
  Users,
  Search,
} from "lucide-react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function AdminDashboard() {
  const [recruiters, setRecruiters] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const perPage = 6;

  const loadData = async () => {
    const res = await API.get("/admin/recruiters");
    setRecruiters(res.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  /* ================= FILTER ================= */

  const filtered = recruiters.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  /* ================= PAGINATION ================= */

  const totalPages = Math.ceil(filtered.length / perPage);

  const paginated = filtered.slice(
    (page - 1) * perPage,
    page * perPage
  );

  /* ================= STATS ================= */

  const pending = recruiters.filter(
    (u) => u.approvalStatus === "pending"
  ).length;

  const approved = recruiters.filter(
    (u) => u.approvalStatus === "approved"
  ).length;

  /* ================= CHART DATA ================= */

  const chartData = recruiters.slice(0, 10).map((u, i) => ({
    name: `User ${i + 1}`,
    recruiters: i + 1,
  }));

  /* ================= ACTIONS ================= */

  const approve = async (id) => {
    await API.put(`/admin/approve/${id}`);
    loadData();
  };

  const reject = async (id) => {
    const reason = prompt("Enter rejection reason");
    await API.put(`/admin/reject/${id}`, { reason });
    loadData();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-900 to-purple-900 text-white p-8">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold flex items-center gap-3">
          <ShieldCheck className="text-yellow-400" />
          Admin Control Panel
        </h1>
        <p className="text-blue-200">
          Manage recruiters, analytics & activity
        </p>
      </div>


      {/* STATS */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">

        <StatCard
          title="Total Recruiters"
          value={recruiters.length}
          color="from-blue-500 to-indigo-500"
        />

        <StatCard
          title="Pending"
          value={pending}
          color="from-yellow-500 to-orange-500"
        />

        <StatCard
          title="Approved"
          value={approved}
          color="from-green-500 to-emerald-500"
        />

      </div>


      {/* CHART + ACTIVITY */}
      <div className="grid md:grid-cols-2 gap-6 mb-10">

        {/* CHART */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6">
          <h2 className="font-semibold mb-4">
            Recruiter Growth
          </h2>

          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="recruiters"
                stroke="#facc15"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>


        {/* ACTIVITY FEED */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6">
          <h2 className="font-semibold mb-4">
            Recent Activity
          </h2>

          <div className="space-y-3 max-h-64 overflow-y-auto">

            {recruiters.slice(0, 6).map((u) => (
              <div
                key={u._id}
                className="bg-white/10 p-3 rounded-lg"
              >
                <p className="font-medium">{u.name}</p>
                <p className="text-sm text-blue-200">
                  New recruiter registered
                </p>
              </div>
            ))}

          </div>
        </div>

      </div>


      {/* SEARCH */}
      <div className="flex items-center gap-3 mb-6">

        <div className="relative w-full md:w-80">

          <Search
            className="absolute left-3 top-3 text-gray-300"
            size={18}
          />

          <input
            placeholder="Search recruiters..."
            className="pl-10 pr-4 py-2 rounded-lg w-full bg-white/10 border border-white/20"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

        </div>

      </div>


      {/* CARDS */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

        {paginated.map((user) => (
          <div
            key={user._id}
            className="bg-white/10 backdrop-blur-xl rounded-2xl p-6"
          >

            <h2 className="font-semibold text-lg mb-2">
              {user.name}
            </h2>

            <p className="text-blue-200 flex items-center gap-2">
              <Mail size={14} /> {user.email}
            </p>

            <p className="text-blue-200 flex items-center gap-2">
              <Building size={14} /> {user.companyName}
            </p>

            <div className="my-3">
              {user.approvalStatus === "pending" ? (
                <span className="bg-yellow-500/20 text-yellow-300 px-3 py-1 rounded-full text-sm">
                  Pending
                </span>
              ) : (
                <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm">
                  Approved
                </span>
              )}
            </div>

            {user.approvalStatus === "pending" && (
              <div className="flex gap-2">

                <button
                  onClick={() => approve(user._id)}
                  className="flex-1 bg-green-600 px-3 py-2 rounded-lg"
                >
                  Approve
                </button>

                <button
                  onClick={() => reject(user._id)}
                  className="flex-1 bg-red-600 px-3 py-2 rounded-lg"
                >
                  Reject
                </button>

              </div>
            )}

          </div>
        ))}

      </div>


      {/* PAGINATION */}
      <div className="flex justify-center mt-8 gap-3">

        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-4 py-2 rounded ${
              page === i + 1
                ? "bg-yellow-500 text-black"
                : "bg-white/10"
            }`}
          >
            {i + 1}
          </button>
        ))}

      </div>

    </div>
  );
}


/* ================= COMPONENT ================= */

function StatCard({ title, value, color }) {
  return (
    <div
      className={`bg-gradient-to-r ${color} p-6 rounded-2xl shadow-lg`}
    >
      <p className="opacity-90">{title}</p>
      <h2 className="text-3xl font-bold">{value}</h2>
    </div>
  );
}