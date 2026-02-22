import { useState } from "react";
import API from "../services/api";
import RecruiterLayout from "../components/RecruiterLayout";

import {
  Briefcase,
  Building2,
  MapPin,
  DollarSign,
  FileText,
  Clock,
  Layers,
  Sparkles,
} from "lucide-react";

export default function PostJob() {

  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    type: "",
    experience: "",
    skills: "",
    deadline: "",
    description: "",
  });

  const submit = async (e) => {
    e.preventDefault();

    try {

      await API.post("/jobs", form);

      alert("Job Created Successfully ✅");

      setForm({
        title: "",
        company: "",
        location: "",
        salary: "",
        type: "",
        experience: "",
        skills: "",
        deadline: "",
        description: "",
      });

    } catch (error) {
      alert("Error creating job");
    }
  };

  const inputClass =
    "w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 outline-none text-white placeholder-gray-300 focus:ring-2 focus:ring-indigo-500";

  return (
    <RecruiterLayout>

      <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#020617] text-white p-6">

        {/* ================= HEADER ================= */}

        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 mb-8 shadow-xl">

          <div className="flex items-center gap-4 mb-3">
            <Sparkles className="text-indigo-400" size={28} />

            <h1 className="text-3xl font-bold">
              Post New Job 🚀
            </h1>
          </div>

          <p className="text-gray-300">
            Create opportunities and attract the best talent worldwide.
          </p>

        </div>

        {/* ================= FORM ================= */}

        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">

          <form onSubmit={submit} className="grid md:grid-cols-2 gap-6">

            {/* TITLE */}
            <InputField
              icon={<Briefcase size={18} />}
              label="Job Title"
              value={form.title}
              placeholder="Frontend Developer"
              onChange={(v) => setForm({ ...form, title: v })}
              className={inputClass}
            />

            {/* COMPANY */}
            <InputField
              icon={<Building2 size={18} />}
              label="Company"
              value={form.company}
              placeholder="Google"
              onChange={(v) => setForm({ ...form, company: v })}
              className={inputClass}
            />

            {/* LOCATION */}
            <InputField
              icon={<MapPin size={18} />}
              label="Location"
              value={form.location}
              placeholder="Remote / Hyderabad"
              onChange={(v) => setForm({ ...form, location: v })}
              className={inputClass}
            />

            {/* SALARY */}
            <InputField
              icon={<DollarSign size={18} />}
              label="Salary"
              value={form.salary}
              placeholder="10 LPA"
              onChange={(v) => setForm({ ...form, salary: v })}
              className={inputClass}
            />

            {/* TYPE */}
            <InputField
              icon={<Layers size={18} />}
              label="Job Type"
              value={form.type}
              placeholder="Full Time / Internship"
              onChange={(v) => setForm({ ...form, type: v })}
              className={inputClass}
            />

            {/* EXPERIENCE */}
            <InputField
              icon={<Clock size={18} />}
              label="Experience"
              value={form.experience}
              placeholder="2+ Years"
              onChange={(v) => setForm({ ...form, experience: v })}
              className={inputClass}
            />

            {/* SKILLS */}
            <div className="md:col-span-2">
              <label className="text-sm mb-1 block text-gray-300">
                Skills Required
              </label>

              <input
                className={inputClass}
                placeholder="React, Node.js, MongoDB"
                value={form.skills}
                onChange={(e) =>
                  setForm({ ...form, skills: e.target.value })
                }
              />
            </div>

            {/* DEADLINE */}
            <div>
              <label className="text-sm mb-1 block text-gray-300">
                Application Deadline
              </label>

              <input
                type="date"
                className={inputClass}
                value={form.deadline}
                onChange={(e) =>
                  setForm({ ...form, deadline: e.target.value })
                }
              />
            </div>

            {/* DESCRIPTION */}
            <div className="md:col-span-2">
              <label className="text-sm mb-1 block text-gray-300">
                Job Description
              </label>

              <div className="flex gap-2">
                <FileText className="mt-3 text-gray-400" size={18} />

                <textarea
                  rows={5}
                  className={inputClass}
                  placeholder="Responsibilities, requirements..."
                  value={form.description}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      description: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            {/* BUTTON */}
            <div className="md:col-span-2">
              <button className="w-full bg-indigo-600 hover:bg-indigo-700 transition px-6 py-3 rounded-xl font-semibold shadow-lg">
                Post Job
              </button>
            </div>

          </form>

        </div>

      </div>

    </RecruiterLayout>
  );
}


/* ================= INPUT COMPONENT ================= */

function InputField({
  icon,
  label,
  value,
  placeholder,
  onChange,
  className,
}) {
  return (
    <div>
      <label className="text-sm mb-1 block text-gray-300">
        {label}
      </label>

      <div className="flex items-center gap-2">
        <span className="text-gray-400">
          {icon}
        </span>

        <input
          value={value}
          placeholder={placeholder}
          className={className}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
}