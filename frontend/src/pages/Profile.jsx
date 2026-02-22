import { useEffect, useState } from "react";
import API from "../services/api";
import Confetti from "react-confetti";

import {
  User,
  Mail,
  Phone,
  MapPin,
  Link as LinkIcon,
  Plus,
  Save,
  Briefcase,
  GraduationCap,
  Award,
  Trash2,
  Upload,
  Camera,
  Sparkles,
} from "lucide-react";

export default function Profile() {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [skillInput, setSkillInput] = useState("");
  const [resumeFile, setResumeFile] = useState(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const res = await API.get("/users/profile");
    setUser(res.data);
    setLoading(false);
  };

  /* ================= AI SCORE ================= */

  const calculateScore = () => {

    let score = 0;
    const tips = [];

    if (user?.name) score += 10;
    else tips.push("Add name");

    if (user?.phone) score += 10;
    else tips.push("Add phone");

    if (user?.summary) score += 20;
    else tips.push("Add summary");

    if (user?.skills?.length) score += 20;
    else tips.push("Add skills");

    if (user?.education?.length) score += 15;
    else tips.push("Add education");

    if (user?.experience?.length) score += 15;
    else tips.push("Add experience");

    if (user?.resume) score += 10;
    else tips.push("Upload resume");

    return { score, tips };
  };

  const { score, tips } = calculateScore();

  const strength =
    score >= 85 ? "Excellent"
      : score >= 70 ? "Strong"
        : score >= 50 ? "Average"
          : "Weak";

  /* ================= AVATAR ================= */

  const uploadAvatar = async (file) => {
    const formData = new FormData();
    formData.append("avatar", file);

    const res = await API.post("/users/upload-avatar", formData);

    setUser({ ...user, avatar: res.data.avatar });
  };

  const removeAvatar = async () => {
    await API.delete("/users/remove-avatar");
    setUser({ ...user, avatar: "" });
  };

  /* ================= RESUME ================= */

  const uploadResume = async () => {

    const formData = new FormData();
    formData.append("resume", resumeFile);

    const res = await API.post("/users/upload-resume", formData);

    setUser({ ...user, resume: res.data.resume });
  };

  /* ================= UPDATE ================= */

  const updateProfile = async () => {
    await API.put("/users/profile", user);
    alert("Profile Updated ✅");
  };

  /* ================= SKILLS ================= */

  const addSkill = () => {
    if (!skillInput) return;

    setUser({
      ...user,
      skills: [...(user.skills || []), skillInput],
    });

    setSkillInput("");
  };

  const removeSkill = (i) => {
    const arr = [...user.skills];
    arr.splice(i, 1);
    setUser({ ...user, skills: arr });
  };

  /* ================= EDUCATION ================= */

  const addEducation = () => {
    setUser({
      ...user,
      education: [
        ...(user.education || []),
        { degree: "", college: "", year: "" },
      ],
    });
  };

  const removeEducation = (i) => {
    const arr = [...user.education];
    arr.splice(i, 1);
    setUser({ ...user, education: arr });
  };

  /* ================= EXPERIENCE ================= */

  const addExperience = () => {
    setUser({
      ...user,
      experience: [
        ...(user.experience || []),
        {
          title: "",
          company: "",
          duration: "",
          description: "",
        },
      ],
    });
  };

  const removeExperience = (i) => {
    const arr = [...user.experience];
    arr.splice(i, 1);
    setUser({ ...user, experience: arr });
  };

  if (loading || !user) return <div className="p-10">Loading...</div>;

  const input =
    "bg-white/10 border border-white/20 p-3 w-full rounded-xl text-white";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-black text-white p-6">

      {score === 100 && <Confetti recycle={false} />}

      {/* ================= HEADER ================= */}

      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 flex items-center gap-6 shadow-2xl">

        <div className="flex flex-col items-center">

          <div className="relative">

            {user.avatar ? (
              <img
                src={`http://localhost:5000/${user.avatar}`}
                className="w-28 h-28 rounded-full object-cover border-4 border-indigo-400"
              />
            ) : (
              <div className="w-28 h-28 rounded-full bg-indigo-600 flex items-center justify-center text-4xl font-bold">
                {user.name?.charAt(0)}
              </div>
            )}

            <label className="absolute bottom-0 right-0 bg-white text-black p-2 rounded-full cursor-pointer">
              <input
                type="file"
                hidden
                onChange={(e) => uploadAvatar(e.target.files[0])}
              />
              <Camera size={16} />
            </label>

          </div>

          {user.avatar && (
            <button
              onClick={removeAvatar}
              className="mt-2 text-xs bg-red-500 px-3 py-1 rounded-full"
            >
              Remove
            </button>
          )}

        </div>

        <div>

          <h1 className="text-3xl font-bold">{user.name}</h1>

          <p className="text-gray-300 flex gap-2 items-center">
            <Mail size={16} />
            {user.email}
          </p>

          <p className="text-gray-300 flex gap-2 items-center">
            <Phone size={16} />
            {user.phone || "Add phone"}
          </p>

          <p className="text-gray-300 flex gap-2 items-center">
            <MapPin size={16} />
            {user.location || "Add location"}
          </p>

          {/* AI Score */}
          <div className="mt-4">

            <div className="flex items-center gap-2">
              <Sparkles className="text-yellow-400" />
              <span>AI Strength: {strength}</span>
            </div>

            <div className="w-64 bg-white/20 rounded-full h-3 mt-2">
              <div
                className="bg-gradient-to-r from-pink-500 to-indigo-400 h-3 rounded-full"
                style={{ width: `${score}%` }}
              />
            </div>

            <p className="text-sm">{score}/100</p>

          </div>

        </div>

      </div>

      {/* ================= TIPS ================= */}

      {tips.length > 0 && (
        <div className="mt-6 bg-yellow-500/10 border border-yellow-400/20 rounded-2xl p-5">

          <h3 className="font-semibold mb-2">
            Improve your profile 🚀
          </h3>

          <ul className="text-sm space-y-1">
            {tips.map((tip, i) => (
              <li key={i}>• {tip}</li>
            ))}
          </ul>

        </div>
      )}

      {/* ================= BASIC INFO ================= */}

      <GlassCard title="Basic Information" icon={<User />}>

        <input
          className={input}
          placeholder="Phone"
          value={user.phone || ""}
          onChange={(e) =>
            setUser({ ...user, phone: e.target.value })
          }
        />

        <input
          className={input}
          placeholder="Location"
          value={user.location || ""}
          onChange={(e) =>
            setUser({ ...user, location: e.target.value })
          }
        />

        <input
          className={input}
          placeholder="LinkedIn"
          value={user.linkedin || ""}
          onChange={(e) =>
            setUser({ ...user, linkedin: e.target.value })
          }
        />

        <input
          className={input}
          placeholder="Portfolio"
          value={user.portfolio || ""}
          onChange={(e) =>
            setUser({ ...user, portfolio: e.target.value })
          }
        />

      </GlassCard>

      {/* ================= SUMMARY ================= */}

      <GlassCard title="Professional Summary" icon={<User />}>

        <textarea
          className={input}
          value={user.summary || ""}
          onChange={(e) =>
            setUser({ ...user, summary: e.target.value })
          }
        />

      </GlassCard>

      {/* ================= SKILLS ================= */}

      <GlassCard title="Skills" icon={<Award />}>

        <div className="flex flex-wrap gap-2 mb-3">
          {(user.skills || []).map((s, i) => (
            <span
              key={i}
              onClick={() => removeSkill(i)}
              className="bg-indigo-600 px-3 py-1 rounded-full cursor-pointer"
            >
              {s} ✕
            </span>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            className={input}
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
          />

          <button
            onClick={addSkill}
            className="bg-indigo-600 px-4 rounded-xl"
          >
            <Plus size={18} />
          </button>
        </div>

      </GlassCard>

      {/* ================= EDUCATION ================= */}

      <GlassCard title="Education" icon={<GraduationCap />}>

        {(user.education || []).map((edu, i) => (
          <div key={i} className="grid md:grid-cols-3 gap-3">

            <input
              className={input}
              placeholder="Degree"
              value={edu.degree}
              onChange={(e) => {
                const arr = [...user.education];
                arr[i].degree = e.target.value;
                setUser({ ...user, education: arr });
              }}
            />

            <input
              className={input}
              placeholder="College"
              value={edu.college}
              onChange={(e) => {
                const arr = [...user.education];
                arr[i].college = e.target.value;
                setUser({ ...user, education: arr });
              }}
            />

            <div className="flex gap-2">

              <input
                className={input}
                placeholder="Year"
                value={edu.year}
                onChange={(e) => {
                  const arr = [...user.education];
                  arr[i].year = e.target.value;
                  setUser({ ...user, education: arr });
                }}
              />

              <button
                onClick={() => removeEducation(i)}
                className="bg-red-500 px-3 rounded"
              >
                <Trash2 size={16} />
              </button>

            </div>

          </div>
        ))}

        <button onClick={addEducation} className="text-indigo-400">
          + Add Education
        </button>

      </GlassCard>

      {/* ================= EXPERIENCE ================= */}

      <GlassCard title="Experience" icon={<Briefcase />}>

        {(user.experience || []).map((exp, i) => (
          <div key={i} className="space-y-2">

            <input
              className={input}
              placeholder="Title"
              value={exp.title}
              onChange={(e) => {
                const arr = [...user.experience];
                arr[i].title = e.target.value;
                setUser({ ...user, experience: arr });
              }}
            />

            <input
              className={input}
              placeholder="Company"
              value={exp.company}
              onChange={(e) => {
                const arr = [...user.experience];
                arr[i].company = e.target.value;
                setUser({ ...user, experience: arr });
              }}
            />

            <input
              className={input}
              placeholder="Duration"
              value={exp.duration}
              onChange={(e) => {
                const arr = [...user.experience];
                arr[i].duration = e.target.value;
                setUser({ ...user, experience: arr });
              }}
            />

            <textarea
              className={input}
              placeholder="Description"
              value={exp.description}
              onChange={(e) => {
                const arr = [...user.experience];
                arr[i].description = e.target.value;
                setUser({ ...user, experience: arr });
              }}
            />

            <button
              onClick={() => removeExperience(i)}
              className="bg-red-500 px-3 py-1 rounded"
            >
              Delete
            </button>

          </div>
        ))}

        <button onClick={addExperience} className="text-indigo-400">
          + Add Experience
        </button>

      </GlassCard>

      {/* ================= RESUME ================= */}

      <GlassCard title="Resume" icon={<Upload />}>

        <input
          type="file"
          onChange={(e) => setResumeFile(e.target.files[0])}
        />

        <button
          onClick={uploadResume}
          className="bg-indigo-600 px-4 py-2 rounded"
        >
          Upload Resume
        </button>

      </GlassCard>

      {/* SAVE */}

      <div className="flex justify-end mt-6">

        <button
          onClick={updateProfile}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-3 rounded-xl flex items-center gap-2"
        >
          <Save size={18} />
          Save Profile
        </button>

      </div>

    </div>
  );
}

/* ================= GLASS CARD ================= */

function GlassCard({ title, icon, children }) {
  return (
    <div className="mt-6 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 space-y-3">
      <h2 className="flex items-center gap-2 font-semibold text-lg">
        {icon}
        {title}
      </h2>
      {children}
    </div>
  );
}