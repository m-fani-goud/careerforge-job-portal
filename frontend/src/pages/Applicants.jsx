import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import RecruiterLayout from "../components/RecruiterLayout";

import {
  User,
  Mail,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";

export default function Applicants() {
  const { jobId } = useParams();

  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApplicants = async () => {
    try {
      setLoading(true);

      const res = await API.get(`/applications/job/${jobId}`);
      setApps(res.data);

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, [jobId]);


  const updateStatus = async (id, status) => {
    try {
      await API.put(`/applications/${id}`, { status });
      fetchApplicants();
    } catch (err) {
      console.log(err);
    }
  };


  const getStatusBadge = (status) => {
    if (status === "shortlisted")
      return "bg-green-100 text-green-700";

    if (status === "rejected")
      return "bg-red-100 text-red-700";

    return "bg-yellow-100 text-yellow-700";
  };


  return (
    <RecruiterLayout>

      {/* HEADER */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-xl shadow mb-6">

        <h1 className="text-3xl font-bold">
          Job Applicants
        </h1>

        <p className="opacity-90">
          Manage candidates who applied for this position
        </p>

      </div>


      {/* LOADING */}
      {loading && (
        <div className="text-center py-10 text-gray-500">
          Loading applicants...
        </div>
      )}


      {/* EMPTY */}
      {!loading && apps.length === 0 && (
        <div className="text-center py-10 text-gray-400">
          No applicants yet
        </div>
      )}


      {/* APPLICANTS LIST */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

        {apps.map((app) => (

          <div
            key={app._id}
            className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition border"
          >

            {/* USER INFO */}
            <div className="flex items-center gap-4 mb-4">

              {app.applicant?.avatar ? (
                <img
                  src={`http://localhost:5000/${app.applicant.avatar}`}
                  alt="avatar"
                  className="w-14 h-14 rounded-full object-cover border"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                  {app.applicant?.name?.charAt(0)}
                </div>
              )}

              <div>
                <h2 className="font-semibold text-lg">
                  {app.applicant?.name}
                </h2>

                <p className="text-gray-500 text-sm flex items-center gap-1">
                  <Mail size={14} />
                  {app.applicant?.email}
                </p>
              </div>

            </div>


            {/* STATUS */}
            <div className="mb-4">

              <span
                className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 w-fit ${getStatusBadge(app.status)}`}
              >
                {app.status === "shortlisted" && (
                  <CheckCircle size={14} />
                )}

                {app.status === "rejected" && (
                  <XCircle size={14} />
                )}

                {app.status === "applied" && (
                  <Clock size={14} />
                )}

                {app.status}
              </span>

            </div>


            {/* RESUME */}
            {app.applicant?.resume && (
              <a
                href={`http://localhost:5000/${app.applicant.resume}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-indigo-600 font-medium mb-4 hover:underline"
              >
                <FileText size={16} />
                View Resume
              </a>
            )}


            {/* ACTION BUTTONS */}
            <div className="flex gap-3">

              <button
                onClick={() =>
                  updateStatus(app._id, "shortlisted")
                }
                className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
              >
                Shortlist
              </button>

              <button
                onClick={() =>
                  updateStatus(app._id, "rejected")
                }
                className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
              >
                Reject
              </button>

            </div>

          </div>

        ))}

      </div>

    </RecruiterLayout>
  );
}