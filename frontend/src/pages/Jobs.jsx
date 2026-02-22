import { useEffect, useState } from "react";
import API from "../services/api";

import {
  Briefcase,
  MapPin,
  Building2,
  DollarSign,
  Heart,
  CheckCircle,
  X,
} from "lucide-react";

export default function Jobs() {

  const user = JSON.parse(localStorage.getItem("user")) || {};

  const [jobs, setJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState(
    JSON.parse(localStorage.getItem("savedJobs")) || []
  );

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");

  const [selectedJob, setSelectedJob] = useState(null);

  const [page, setPage] = useState(1);
  const perPage = 6;


  useEffect(() => {

    API.get("/jobs").then((res) => {
      setJobs(res.data);
    });

    if (user?.role === "user") {
      API.get("/applications/me").then((res) => {
        const ids = res.data.map((app) => app.job._id);
        setAppliedJobs(ids);
      });
    }

  }, []);


  // ================= APPLY =================
  const apply = async (id) => {

    if (!user?.resume) {
      alert("Please upload resume first");
      window.location.href = "/upload-resume";
      return;
    }

    try {
      await API.post("/applications", { jobId: id });

      setAppliedJobs([...appliedJobs, id]);

      alert("Applied Successfully ✅");

    } catch (err) {
      alert("Error applying");
    }
  };


  // ================= SAVE =================
  const toggleSave = (id) => {

    let updated;

    if (savedJobs.includes(id)) {
      updated = savedJobs.filter((j) => j !== id);
    } else {
      updated = [...savedJobs, id];
    }

    setSavedJobs(updated);
    localStorage.setItem("savedJobs", JSON.stringify(updated));
  };


  // ================= FILTER =================
  const filtered = jobs.filter((job) =>
    job.title.toLowerCase().includes(search.toLowerCase()) &&
    job.location?.toLowerCase().includes(location.toLowerCase())
  );


  // ================= PAGINATION =================
  const start = (page - 1) * perPage;
  const paginated = filtered.slice(start, start + perPage);

  const totalPages = Math.ceil(filtered.length / perPage);


  return (
    <div className="p-10">

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-xl shadow mb-6">
        <h1 className="text-3xl font-bold">
          Explore Jobs 💼
        </h1>
        <p className="opacity-90">
          Find your next opportunity
        </p>
      </div>


    {/* Search */}
<div className="bg-white p-4 rounded-xl shadow mb-6 flex gap-4 items-center">

  <input
    placeholder="Search jobs..."
    className="border p-2 rounded w-full"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />

  <input
    placeholder="Location..."
    className="border p-2 rounded w-full"
    value={location}
    onChange={(e) => setLocation(e.target.value)}
  />

  {/* Search Button */}
  <button
    onClick={() => setPage(1)}
    className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition"
  >
    Search
  </button>

  {/* Clear Button */}
  <button
    onClick={() => {
      setSearch("");
      setLocation("");
      setPage(1);
    }}
    className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
  >
    Clear
  </button>

</div>


      {/* Jobs */}
      <div className="grid md:grid-cols-3 gap-6">

        {paginated.map((job) => {

          const isApplied = appliedJobs.includes(job._id);
          const isSaved = savedJobs.includes(job._id);

          return (
            <div
              key={job._id}
              className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
            >

              {/* Title */}
              <div className="flex justify-between">

                <div
                  className="cursor-pointer"
                  onClick={() => setSelectedJob(job)}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Briefcase className="text-blue-600" size={18} />
                    <h2 className="font-semibold">
                      {job.title}
                    </h2>
                  </div>

                  <div className="flex items-center text-gray-500 text-sm">
                    <Building2 size={14} className="mr-1" />
                    {job.company}
                  </div>

                  <div className="flex items-center text-gray-500 text-sm">
                    <MapPin size={14} className="mr-1" />
                    {job.location}
                  </div>

                </div>


                {/* Save */}
                <Heart
                  onClick={() => toggleSave(job._id)}
                  className={`cursor-pointer ${
                    isSaved ? "text-red-500" : "text-gray-400"
                  }`}
                />

              </div>


              {/* Salary */}
              {job.salary && (
                <div className="flex items-center text-gray-500 text-sm mt-2">
                  <DollarSign size={14} className="mr-1" />
                  {job.salary}
                </div>
              )}


              {/* Applied */}
              {isApplied && (
                <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded text-sm w-fit mt-3">
                  <CheckCircle size={14} />
                  Applied
                </div>
              )}


              {/* Apply */}
              {user?.role === "user" && !isApplied && (
                <button
                  onClick={() => apply(job._id)}
                  className="bg-blue-600 text-white px-4 py-2 rounded w-full mt-3"
                >
                  Apply
                </button>
              )}

            </div>
          );
        })}

      </div>


      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-6">

        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 rounded ${
              page === i + 1
                ? "bg-blue-600 text-white"
                : "bg-gray-200"
            }`}
          >
            {i + 1}
          </button>
        ))}

      </div>


      {/* Modal */}
      {selectedJob && (

        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">

          <div className="bg-white p-6 rounded-xl max-w-lg w-full relative">

            <X
              className="absolute top-3 right-3 cursor-pointer"
              onClick={() => setSelectedJob(null)}
            />

            <h2 className="text-xl font-bold mb-2">
              {selectedJob.title}
            </h2>

            <p className="text-gray-600 mb-2">
              {selectedJob.company}
            </p>

            <p className="text-gray-500 mb-4">
              {selectedJob.location}
            </p>

            <p>
              {selectedJob.description}
            </p>

          </div>

        </div>

      )}

    </div>
  );
}