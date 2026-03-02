import { useEffect, useState } from "react";
import API from "../services/api";
import Confetti from "react-confetti";
import {
  Mail,
  Phone,
  MapPin,
  Plus,
  Save,
  Trash2,
  Camera,
  Upload,
} from "lucide-react";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [resumeFile, setResumeFile] = useState(null);
  const [skillInput, setSkillInput] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const res = await API.get("/users/profile");
    setUser(res.data);
    setLoading(false);
  };

  // ================= SCORE =================

  const calculateScore = () => {
    let score = 0;
    if (user?.phone) score += 10;
    if (user?.location) score += 10;
    if (user?.linkedin) score += 10;
    if (user?.profileSummary) score += 15;
    if (user?.skills?.length) score += 15;
    if (user?.education?.length) score += 15;
    if (user?.experience?.length) score += 15;
    if (user?.resume) score += 10;
    return Math.min(score, 100);
  };

  const score = calculateScore();

  // ================= HELPERS =================

  const addItem = (field, obj) => {
    setUser({
      ...user,
      [field]: [...(user[field] || []), obj],
    });
  };

  const removeItem = (field, index) => {
    const arr = [...(user[field] || [])];
    arr.splice(index, 1);
    setUser({ ...user, [field]: arr });
  };

  // ================= AVATAR =================

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

  // ================= RESUME =================

  const uploadResume = async () => {
    const formData = new FormData();
    formData.append("resume", resumeFile);
    const res = await API.post("/users/upload-resume", formData);
    setUser({ ...user, resume: res.data.resume });
  };

  // ================= SAVE =================

  const updateProfile = async () => {
    await API.put("/users/profile", user);
    alert("Profile Updated ✅");
  };

  // ================= SKILLS =================

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

  if (loading || !user) return <div className="p-10">Loading...</div>;

  const input =
    "bg-white/10 border border-white/20 p-3 w-full rounded-xl text-white";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-black text-white p-4 md:p-6">

      {score === 100 && <Confetti recycle={false} />}

      {/* ================= HEADER ================= */}

      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 flex flex-col md:flex-row items-center gap-6 shadow-2xl">

        <div className="relative">

          {/* Animated Ring */}
          <svg className="w-32 h-32 rotate-[-90deg]">
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="white"
              strokeOpacity="0.2"
              strokeWidth="6"
              fill="none"
            />
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="url(#grad)"
              strokeWidth="6"
              fill="none"
              strokeDasharray={350}
              strokeDashoffset={350 - (350 * score) / 100}
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="grad">
                <stop offset="0%" stopColor="#facc15" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
            </defs>
          </svg>

          <div className="absolute inset-0 flex items-center justify-center">

            {user.avatar ? (
              <img
                src={`${BASE_URL}/${user.avatar}`}
                className="w-24 h-24 rounded-full object-cover border-2 border-indigo-400"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-indigo-600 flex items-center justify-center text-3xl font-bold">
                {user.name?.charAt(0)}
              </div>
            )}

          </div>

          {/* Upload */}
          <label className="absolute bottom-0 right-0 bg-white text-black p-2 rounded-full cursor-pointer">
            <input
              type="file"
              hidden
              onChange={(e) => uploadAvatar(e.target.files[0])}
            />
            <Camera size={16} />
          </label>

          {/* Remove */}
          {user.avatar && (
            <button
              onClick={removeAvatar}
              className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs bg-red-500 px-3 py-1 rounded-full"
            >
              Remove
            </button>
          )}
        </div>

        <div className="flex-1">

          <h1 className="text-2xl font-bold">{user.name}</h1>

          <p className="flex items-center gap-2 text-gray-300">
            <Mail size={14} /> {user.email}
          </p>

          <div className="mt-3 bg-yellow-400 text-black px-3 py-1 rounded-full inline-block text-xs">
            Profile {score}% Complete
          </div>

        </div>

      </div>

      {/* ================= BASIC INFO ================= */}

      <GlassCard title="Basic Information">

        <input
          className={input}
          placeholder="Phone"
          value={user.phone || ""}
          onChange={(e) => setUser({ ...user, phone: e.target.value })}
        />

        <input
          className={input}
          placeholder="Location"
          value={user.location || ""}
          onChange={(e) => setUser({ ...user, location: e.target.value })}
        />

        <input
          className={input}
          placeholder="LinkedIn"
          value={user.linkedin || ""}
          onChange={(e) => setUser({ ...user, linkedin: e.target.value })}
        />

        <input
          className={input}
          placeholder="Portfolio"
          value={user.portfolio || ""}
          onChange={(e) => setUser({ ...user, portfolio: e.target.value })}
        />

      </GlassCard>

      {/* ================= SUMMARY ================= */}

      <GlassCard title="Professional Summary">

        <textarea
          className={input}
          value={user.profileSummary || ""}
          onChange={(e) =>
            setUser({ ...user, profileSummary: e.target.value })
          }
        />

      </GlassCard>

      {/* ================= SKILLS ================= */}

      <GlassCard title="Skills">

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

      {/* ================= DYNAMIC SECTIONS ================= */}

      <DynamicSection
        title="Education"
        field="education"
        template={{ degree: "", college: "", year: "" }}
        {...{ user, setUser, input, addItem, removeItem }}
      />

      <DynamicSection
        title="Experience"
        field="experience"
        template={{
          title: "",
          company: "",
          duration: "",
          description: "",
        }}
        {...{ user, setUser, input, addItem, removeItem }}
      />

      <DynamicSection
        title="Internships"
        field="internships"
        template={{
          role: "",
          company: "",
          duration: "",
          description: "",
        }}
        {...{ user, setUser, input, addItem, removeItem }}
      />

      <DynamicSection
        title="Certifications"
        field="certifications"
        template={{
          name: "",
          organization: "",
          year: "",
        }}
        {...{ user, setUser, input, addItem, removeItem }}
      />

      <DynamicSection
        title="Achievements"
        field="achievements"
        template={{
          title: "",
          description: "",
          year: "",
        }}
        {...{ user, setUser, input, addItem, removeItem }}
      />

      {/* ================= RESUME ================= */}

      <GlassCard title="Resume Upload">

        <input
          type="file"
          onChange={(e) => setResumeFile(e.target.files[0])}
        />

        <button
          onClick={uploadResume}
          className="bg-indigo-600 px-4 py-2 rounded mt-2 flex items-center gap-2"
        >
          <Upload size={16} />
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

function GlassCard({ title, children }) {
  return (
    <div className="mt-6 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 space-y-3">
      <h2 className="font-semibold text-lg">{title}</h2>
      {children}
    </div>
  );
}

/* ================= DYNAMIC SECTION ================= */

function DynamicSection({
  title,
  field,
  user,
  setUser,
  input,
  addItem,
  removeItem,
  template,
}) {
  return (
    <GlassCard title={title}>

      {(user[field] || []).map((item, i) => (
        <div
          key={i}
          className="border border-white/10 p-3 rounded-xl relative space-y-2"
        >

          <button
            onClick={() => removeItem(field, i)}
            className="absolute top-2 right-2 bg-red-500 p-1 rounded"
          >
            <Trash2 size={14} />
          </button>

          {Object.keys(template).map((key) => (
            <input
              key={key}
              className={input}
              placeholder={key}
              value={item[key]}
              onChange={(e) => {
                const arr = [...user[field]];
                arr[i][key] = e.target.value;
                setUser({ ...user, [field]: arr });
              }}
            />
          ))}

        </div>
      ))}

      <button
        onClick={() => addItem(field, template)}
        className="text-indigo-400"
      >
        + Add {title}
      </button>

    </GlassCard>
  );
}