import { useEffect, useState } from "react";
import API from "../services/api";
import Confetti from "react-confetti";

import {
  User,
  Mail,
  Phone,
  MapPin,
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

  // ================= SCORE =================

  const calculateScore = () => {
    let score = 0;

    if (user?.name) score += 10;
    if (user?.phone) score += 10;
    if (user?.summary) score += 20;
    if (user?.skills?.length) score += 15;
    if (user?.education?.length) score += 15;
    if (user?.experience?.length) score += 15;
    if (user?.resume) score += 15;

    return score;
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

      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 flex flex-col md:flex-row items-center gap-6 shadow-2xl hover:scale-[1.01] transition">

        {/* Avatar with Ring */}
        <div className="relative">

          <div className="absolute inset-0 rounded-full bg-indigo-500 blur-xl opacity-40 animate-pulse"></div>

          <svg className="w-28 h-28 rotate-[-90deg]">
            <circle
              cx="56"
              cy="56"
              r="48"
              stroke="white"
              strokeOpacity="0.2"
              strokeWidth="6"
              fill="none"
            />
            <circle
              cx="56"
              cy="56"
              r="48"
              stroke="url(#grad)"
              strokeWidth="6"
              fill="none"
              strokeDasharray={300}
              strokeDashoffset={300 - (300 * score) / 100}
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="grad">
                <stop offset="0%" stopColor="#facc15" />
                <stop offset="100%" stopColor="#f97316" />
              </linearGradient>
            </defs>
          </svg>

          <div className="absolute inset-0 flex items-center justify-center">
            {user.avatar ? (
              <img
                src={`${import.meta.env.VITE_API_URL}/${user.avatar}`}
                className="w-20 h-20 rounded-full object-cover border-2 border-indigo-400"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-indigo-600 flex items-center justify-center text-2xl font-bold">
                {user.name?.charAt(0)}
              </div>
            )}
          </div>

          <label className="absolute bottom-0 right-0 bg-white text-black p-2 rounded-full cursor-pointer">
            <input
              type="file"
              hidden
              onChange={(e) => uploadAvatar(e.target.files[0])}
            />
            <Camera size={16} />
          </label>

        </div>

        {/* Info */}
        <div className="flex-1">

          <h1 className="text-2xl font-bold">{user.name}</h1>

          <p className="flex items-center gap-2 text-gray-300">
            <Mail size={14} /> {user.email}
          </p>

          <p className="flex items-center gap-2 text-gray-300">
            <Phone size={14} /> {user.phone || "Add phone"}
          </p>

          <p className="flex items-center gap-2 text-gray-300">
            <MapPin size={14} /> {user.location || "Add location"}
          </p>

          {/* Badge */}
          <div className="mt-3 inline-block bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-semibold">
            Profile {score}% Complete
          </div>

        </div>

      </div>

      {/* ================= SUMMARY ================= */}

      <GlassCard title="Professional Summary">
        <textarea
          className={input}
          value={user.profileSummary || ""}
          onChange={(e) =>
            setUser({ ...user, summary: e.target.value })
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

      {/* ================= EDUCATION ================= */}

      <DynamicSection
        title="Education"
        field="education"
        user={user}
        setUser={setUser}
        input={input}
        addItem={addItem}
        removeItem={removeItem}
        template={{ degree: "", college: "", year: "" }}
      />

      {/* ================= EXPERIENCE ================= */}

      <DynamicSection
        title="Experience"
        field="experience"
        user={user}
        setUser={setUser}
        input={input}
        addItem={addItem}
        removeItem={removeItem}
        template={{
          title: "",
          company: "",
          duration: "",
          description: "",
        }}
      />

      {/* ================= CERTIFICATIONS ================= */}

      <DynamicSection
        title="Certifications"
        field="certifications"
        user={user}
        setUser={setUser}
        input={input}
        addItem={addItem}
        removeItem={removeItem}
        template={{ name: "", issuer: "" }}
      />

      {/* ================= INTERNSHIPS ================= */}

      <DynamicSection
        title="Internships"
        field="internships"
        user={user}
        setUser={setUser}
        input={input}
        addItem={addItem}
        removeItem={removeItem}
        template={{ role: "", company: "" }}
      />

      {/* ================= ACHIEVEMENTS ================= */}

      <DynamicSection
        title="Achievements"
        field="achievements"
        user={user}
        setUser={setUser}
        input={input}
        addItem={addItem}
        removeItem={removeItem}
        template={{ title: "" }}
      />

      {/* ================= RESUME ================= */}

      <GlassCard title="Resume Upload">

        <input
          type="file"
          onChange={(e) => setResumeFile(e.target.files[0])}
        />

        <button
          onClick={uploadResume}
          className="bg-indigo-600 px-4 py-2 rounded mt-2"
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

function GlassCard({ title, children }) {
  return (
    <div className="mt-6 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 space-y-3 hover:scale-[1.01] transition">
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