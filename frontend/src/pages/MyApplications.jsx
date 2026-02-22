import { useEffect, useState } from "react";
import API from "../services/api";
import UserLayout from "../components/UserLayout";

import {
  Briefcase,
  Building2,
  CheckCircle,
  Clock,
  XCircle,
  MapPin,
  CalendarDays,
  Trash2,
  RotateCcw,
} from "lucide-react";

export default function MyApplications() {

  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  const [undoData, setUndoData] = useState(null);
  const [showUndo, setShowUndo] = useState(false);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const res = await API.get("/applications/me");
      setApps(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= WITHDRAW ================= */

  const withdraw = async (app) => {

    if (!window.confirm("Withdraw this application?")) return;

    try {

      // ✅ FIXED ROUTE
      await API.delete(`/applications/${app._id}`);

      // Remove from UI instantly
      setApps((prev) => prev.filter((a) => a._id !== app._id));

      // Store undo data
      setUndoData(app);
      setShowUndo(true);

      // Auto hide after 5 sec
      setTimeout(() => {
        setShowUndo(false);
        setUndoData(null);
      }, 5000);

    } catch (err) {
      console.log(err);
      alert("Withdraw failed");
    }
  };

  /* ================= RESTORE ================= */

  const undoWithdraw = async () => {
    try {

      await API.put(`/applications/restore/${undoData._id}`);

      setApps((prev) => [undoData, ...prev]);

      setShowUndo(false);
      setUndoData(null);

    } catch (err) {
      console.log(err);
      alert("Restore failed");
    }
  };

  /* ================= STATUS BADGE ================= */

  const getStatusBadge = (status) => {

    if (status === "shortlisted")
      return (
        <span className="flex items-center gap-1 bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm">
          <CheckCircle size={16} /> Shortlisted
        </span>
      );

    if (status === "rejected")
      return (
        <span className="flex items-center gap-1 bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-sm">
          <XCircle size={16} /> Rejected
        </span>
      );

    return (
      <span className="flex items-center gap-1 bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-sm">
        <Clock size={16} /> Applied
      </span>
    );
  };

  return (
    <UserLayout>

      <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#020617] text-white p-6">

        {/* HEADER */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 p-6 rounded-2xl shadow mb-6">

          <h1 className="text-3xl font-bold mb-1">
            My Applications 📄
          </h1>

          <p className="text-gray-300">
            Track your job application progress
          </p>

        </div>

        {/* LOADING */}
        {loading && (
          <div className="text-center py-10 text-gray-400">
            Loading applications...
          </div>
        )}

        {/* EMPTY */}
        {!loading && apps.length === 0 && (

          <div className="backdrop-blur-xl bg-white/10 border border-white/20 p-10 rounded-2xl shadow text-center">

            <Briefcase
              size={40}
              className="mx-auto text-gray-400 mb-3"
            />

            <p className="text-gray-400 text-lg">
              You haven't applied to any jobs yet
            </p>

            <a
              href="/jobs"
              className="inline-block mt-4 bg-indigo-600 hover:bg-indigo-700 px-5 py-2 rounded-lg"
            >
              Browse Jobs
            </a>

          </div>

        )}

        {/* APPLICATION LIST */}
        <div className="space-y-5">

          {apps.map((app) => (

            <div
              key={app._id}
              className="backdrop-blur-xl bg-white/10 border border-white/20 p-6 rounded-2xl shadow hover:shadow-xl transition flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >

              {/* LEFT */}
              <div className="space-y-2">

                <div className="flex items-center gap-2">
                  <Briefcase className="text-indigo-400" size={20} />

                  <h2 className="font-semibold text-lg">
                    {app.job?.title}
                  </h2>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-gray-300 text-sm">

                  <span className="flex items-center gap-1">
                    <Building2 size={15} />
                    {app.job?.company}
                  </span>

                  {app.job?.location && (
                    <span className="flex items-center gap-1">
                      <MapPin size={15} />
                      {app.job?.location}
                    </span>
                  )}

                  <span className="flex items-center gap-1">
                    <CalendarDays size={15} />
                    Applied on{" "}
                    {new Date(app.createdAt).toLocaleDateString()}
                  </span>

                </div>

              </div>

              {/* RIGHT */}
              <div className="flex items-center gap-3">

                {getStatusBadge(app.status)}

                {app.status === "applied" && (
                  <button
                    onClick={() => withdraw(app)}
                    className="flex items-center gap-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 px-3 py-1 rounded-lg text-sm transition"
                  >
                    <Trash2 size={15} />
                    Withdraw
                  </button>
                )}

              </div>

            </div>

          ))}

        </div>

        {/* ================= UNDO SNACKBAR ================= */}

        {showUndo && undoData && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 backdrop-blur-xl bg-black/60 border border-white/20 px-6 py-4 rounded-xl shadow-lg flex items-center gap-4 animate-bounce">

            <span className="text-sm">
              Application withdrawn
            </span>

            <button
              onClick={undoWithdraw}
              className="flex items-center gap-1 bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm"
            >
              <RotateCcw size={14} />
              Undo
            </button>

          </div>
        )}

      </div>

    </UserLayout>
  );
}