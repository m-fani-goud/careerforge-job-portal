import { useEffect, useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";
import RecruiterLayout from "../components/RecruiterLayout";

import {
  Briefcase,
  MapPin,
  Users,
  CalendarDays,
  PlusCircle,
} from "lucide-react";

export default function PostedJobs() {

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const res = await API.get("/jobs/my");
      setJobs(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };


  return (
    <RecruiterLayout>

      <div className="min-h-screen text-white">

        {/* ================= HEADER ================= */}

        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 
        p-8 rounded-2xl shadow-xl mb-8">

          <div className="flex justify-between items-center flex-wrap gap-4">

            <div>
              <h1 className="text-3xl font-bold">
                My Job Posts 💼
              </h1>

              <p className="opacity-90 mt-1">
                Manage your job openings and applicants
              </p>
            </div>

            <Link
              to="/post-job"
              className="flex items-center gap-2 bg-white text-indigo-600 
              px-5 py-2 rounded-lg font-medium hover:bg-gray-100 transition"
            >
              <PlusCircle size={18} />
              Post Job
            </Link>

          </div>

        </div>


        {/* ================= LOADING ================= */}

        {loading && (
          <div className="text-center py-10 text-gray-400">
            Loading jobs...
          </div>
        )}


        {/* ================= EMPTY ================= */}

        {!loading && jobs.length === 0 && (
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 
          p-10 rounded-2xl shadow text-center">

            <Briefcase size={40} className="mx-auto text-gray-400 mb-3" />

            <p className="text-gray-300 text-lg">
              No jobs posted yet
            </p>

            <Link
              to="/post-job"
              className="inline-block mt-4 bg-gradient-to-r from-indigo-600 to-purple-600 
              text-white px-6 py-2 rounded-lg"
            >
              Post Your First Job
            </Link>

          </div>
        )}


        {/* ================= JOB GRID ================= */}

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

          {jobs.map((job) => (

            <div
              key={job._id}
              className="
              backdrop-blur-xl bg-white/10 border border-white/20 
              p-6 rounded-2xl shadow-lg
              hover:shadow-2xl hover:scale-[1.02]
              transition duration-300
              "
            >

              {/* TITLE */}
              <div className="flex items-center gap-3 mb-2">

                <div className="p-2 bg-indigo-500/20 rounded-lg">
                  <Briefcase className="text-indigo-400" size={20} />
                </div>

                <h2 className="text-lg font-semibold">
                  {job.title}
                </h2>

              </div>


              {/* COMPANY */}
              <p className="text-gray-300 mb-1">
                {job.company}
              </p>


              {/* LOCATION */}
              {job.location && (
                <div className="flex items-center text-gray-400 text-sm mb-2">
                  <MapPin size={15} className="mr-1" />
                  {job.location}
                </div>
              )}


              {/* DATE */}
              <div className="flex items-center text-gray-400 text-sm mb-4">
                <CalendarDays size={15} className="mr-1" />
                Posted on{" "}
                {new Date(job.createdAt).toLocaleDateString()}
              </div>


              {/* FOOTER */}
              <div className="flex justify-between items-center">

                <Link
                  to={`/applicants/${job._id}`}
                  className="
                  flex items-center gap-2
                  bg-gradient-to-r from-indigo-600 to-purple-600
                  px-4 py-2 rounded-lg text-white
                  hover:opacity-90 transition
                  "
                >
                  <Users size={18} />
                  Applicants
                </Link>

                {/* Job ID */}
                <span className="text-xs text-gray-500">
                  ID: {job._id.slice(-6)}
                </span>

              </div>

            </div>

          ))}

        </div>

      </div>

    </RecruiterLayout>
  );
}