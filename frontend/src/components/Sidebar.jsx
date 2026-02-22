import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-64 bg-blue-700 text-white min-h-screen p-5">
      <h2 className="text-2xl font-bold mb-6">JobPortal</h2>

      <nav className="space-y-3">

        <Link
          to="/dashboard"
          className="block hover:bg-blue-600 p-2 rounded"
        >
          Dashboard
        </Link>

        <Link
          to="/applications"
          className="block hover:bg-blue-600 p-2 rounded"
        >
          My Applications
        </Link>

        <Link
          to="/posted-jobs"
          className="block hover:bg-blue-600 p-2 rounded"
        >
          Posted Jobs
        </Link>

        <Link
          to="/post-job"
          className="block hover:bg-blue-600 p-2 rounded"
        >
          Post Job
        </Link>

        <Link
          to="/profile"
          className="block hover:bg-blue-600 p-2 rounded"
        >
          Profile
        </Link>

        <button
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}
          className="w-full text-left hover:bg-red-600 p-2 rounded"
        >
          Logout
        </button>

      </nav>
    </div>
  );
}