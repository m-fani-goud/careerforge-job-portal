import { Link } from "react-router-dom";
import {
  Briefcase,
  Search,
  Users,
  CheckCircle,
  Crown,
  Sparkles,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 text-gray-800">

      {/* ================= HERO ================= */}
      <section className="py-24 px-6 text-center">

        <div className="max-w-4xl mx-auto">

          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-2xl shadow-lg">
              <Crown size={40} />
            </div>
          </div>

          <h1 className="text-5xl font-bold mb-6 text-gray-900 leading-tight">
            Find Your Dream Job with
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {" "}Royal Experience 👑
            </span>
          </h1>

          <p className="text-lg mb-8 max-w-2xl mx-auto text-gray-600">
            Discover thousands of opportunities from top companies.
            Apply easily and track your career growth in one place.
          </p>

          <div className="flex justify-center gap-4">

            <Link
              to="/jobs"
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:scale-105 transition"
            >
              Browse Jobs
            </Link>

            <Link
              to="/register"
              className="bg-white border border-indigo-600 text-indigo-600 px-8 py-3 rounded-xl font-semibold hover:bg-indigo-50 transition shadow"
            >
              Get Started
            </Link>

          </div>

        </div>

      </section>


      {/* ================= SEARCH ================= */}
      <section className="py-12 px-6">

        <div className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow-xl flex gap-4">

          <input
            placeholder="Job title or keyword"
            className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-indigo-400 outline-none"
          />

          <input
            placeholder="Location"
            className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-indigo-400 outline-none"
          />

          <Link
            to="/jobs"
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-indigo-700"
          >
            <Search size={18} />
            Search
          </Link>

        </div>

      </section>


      {/* ================= FEATURES ================= */}
      <section className="py-20 px-10 grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">

        <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-2xl transition text-center">

          <Search className="mx-auto text-indigo-600 mb-4" size={40} />

          <h2 className="text-xl font-bold mb-2">
            Search Jobs
          </h2>

          <p className="text-gray-600">
            Explore thousands of job opportunities from top companies.
          </p>

        </div>


        <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-2xl transition text-center">

          <CheckCircle className="mx-auto text-green-600 mb-4" size={40} />

          <h2 className="text-xl font-bold mb-2">
            Apply Easily
          </h2>

          <p className="text-gray-600">
            Apply with one click and track application status anytime.
          </p>

        </div>


        <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-2xl transition text-center">

          <Users className="mx-auto text-purple-600 mb-4" size={40} />

          <h2 className="text-xl font-bold mb-2">
            Hire Talent
          </h2>

          <p className="text-gray-600">
            Recruiters can post jobs and connect with the best candidates.
          </p>

        </div>

      </section>


      {/* ================= STATS ================= */}
      <section className="py-16 text-center">

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">

          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h2 className="text-3xl font-bold text-indigo-600">10K+</h2>
            <p className="text-gray-600">Active Jobs</p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h2 className="text-3xl font-bold text-purple-600">5K+</h2>
            <p className="text-gray-600">Companies</p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h2 className="text-3xl font-bold text-pink-600">20K+</h2>
            <p className="text-gray-600">Candidates</p>
          </div>

        </div>

      </section>


      {/* ================= HOW IT WORKS ================= */}
      <section className="py-20 px-10 text-center">

        <h2 className="text-3xl font-bold mb-12 text-gray-900">
          How It Works
        </h2>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">

          <div className="bg-white p-6 rounded-xl shadow">
            <Briefcase className="mx-auto text-indigo-600 mb-3" size={36} />
            <h3 className="font-semibold mb-2">Create Account</h3>
            <p className="text-gray-600">
              Sign up as job seeker or recruiter.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <Search className="mx-auto text-indigo-600 mb-3" size={36} />
            <h3 className="font-semibold mb-2">Search Jobs</h3>
            <p className="text-gray-600">
              Explore jobs that match your skills.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <Sparkles className="mx-auto text-indigo-600 mb-3" size={36} />
            <h3 className="font-semibold mb-2">Get Hired</h3>
            <p className="text-gray-600">
              Apply and connect with recruiters.
            </p>
          </div>

        </div>

      </section>


      {/* ================= CTA ================= */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20 text-center">

        <h2 className="text-3xl font-bold mb-4">
          Ready to Start Your Career?
        </h2>

        <p className="mb-6">
          Join thousands of professionals today.
        </p>

        <Link
          to="/register"
          className="bg-white text-indigo-600 px-8 py-3 rounded-xl font-semibold shadow-lg hover:scale-105 transition"
        >
          Create Account
        </Link>

      </section>


      {/* ================= FOOTER ================= */}
      <footer className="bg-gray-900 text-white py-6 text-center">

        <p>
          © {new Date().getFullYear()} JobPortal. All rights reserved.
        </p>

      </footer>

    </div>
  );
}