import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import UserLayout from "../components/UserLayout";

import {
  UploadCloud,
  FileText,
  CheckCircle,
  Loader2,
} from "lucide-react";

export default function UploadResume() {

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  /* ================= SUBMIT ================= */

  const submit = async (e) => {

    e.preventDefault();

    if (!file) {
      alert("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    try {

      setLoading(true);

      const res = await API.post(
        "/users/upload-resume",
        formData
      );

      alert("Resume uploaded successfully ✅");

      const oldUser =
        JSON.parse(localStorage.getItem("user")) || {};

      const updatedUser = {
        ...oldUser,
        resume: res.data.resume,
      };

      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

      navigate("/dashboard");

    } catch (error) {

      alert(
        error.response?.data?.message ||
          "Upload failed"
      );

    } finally {

      setLoading(false);

    }
  };


  /* ================= FILE SELECT ================= */

  const handleFile = (selected) => {

    if (!selected) return;

    if (selected.type !== "application/pdf") {
      alert("Only PDF allowed");
      return;
    }

    setFile(selected);
  };


  return (
    <UserLayout>

      <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#020617] text-white p-6">

        {/* HEADER */}

        <div className="backdrop-blur-xl bg-white/10 border border-white/20 p-6 rounded-2xl shadow mb-6">

          <h1 className="text-3xl font-bold">
            Upload Resume 📄
          </h1>

          <p className="text-gray-300 mt-1">
            Keep your profile updated to apply faster
          </p>

        </div>


        {/* UPLOAD CARD */}

        <div className="backdrop-blur-xl bg-white/10 border border-white/20 p-8 rounded-2xl shadow max-w-xl mx-auto">

          <form
            onSubmit={submit}
            className="space-y-6"
          >

            {/* Upload Area */}

            <label
              className="
              border-2 border-dashed border-white/30 
              rounded-xl p-10 flex flex-col items-center 
              justify-center cursor-pointer 
              hover:border-indigo-400 transition
              bg-white/5
              "
            >

              <UploadCloud
                size={42}
                className="text-indigo-400 mb-3"
              />

              <p className="text-gray-300 text-center">
                Click or drag & drop your resume
              </p>

              <p className="text-gray-500 text-sm mt-1">
                PDF only (Max 5MB)
              </p>

              <input
                type="file"
                hidden
                accept=".pdf"
                onChange={(e) =>
                  handleFile(e.target.files[0])
                }
              />

            </label>


            {/* FILE PREVIEW */}

            {file && (

              <div className="flex items-center gap-3 bg-white/10 p-4 rounded-xl border border-white/20">

                <FileText
                  className="text-indigo-400"
                  size={20}
                />

                <div className="flex-1">

                  <p className="text-sm">
                    {file.name}
                  </p>

                  <p className="text-xs text-gray-400">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>

                </div>

                <CheckCircle
                  className="text-green-400"
                  size={20}
                />

              </div>

            )}


            {/* SUBMIT BUTTON */}

            <button
              disabled={loading}
              className="
              w-full flex items-center justify-center gap-2
              bg-gradient-to-r from-indigo-600 to-purple-600 
              hover:from-indigo-700 hover:to-purple-700
              px-5 py-3 rounded-xl font-medium
              transition
              disabled:opacity-50
              "
            >

              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Uploading...
                </>
              ) : (
                <>
                  Upload Resume
                </>
              )}

            </button>

          </form>

        </div>


        {/* TIPS SECTION */}

        <div className="max-w-xl mx-auto mt-6 backdrop-blur-xl bg-white/10 border border-white/20 p-6 rounded-2xl">

          <h3 className="font-semibold mb-2">
            💡 Resume Tips
          </h3>

          <ul className="text-sm text-gray-300 space-y-1">

            <li>• Keep your resume under 2 pages</li>
            <li>• Highlight skills & achievements</li>
            <li>• Use action verbs</li>
            <li>• Add measurable results</li>

          </ul>

        </div>

      </div>

    </UserLayout>
  );
}