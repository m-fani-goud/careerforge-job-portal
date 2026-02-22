import { useState, useContext } from "react";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { Mail, Lock, Eye, EyeOff, Briefcase } from "lucide-react";
import { Link } from "react-router-dom";

export default function Login() {
  const { login } = useContext(AuthContext);

  const [form, setForm] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await API.post("/auth/login", form);

      login(res.data);

      localStorage.setItem("user", JSON.stringify(res.data.user));

      if (res.data.user.role === "recruiter") {
        window.location.href = "/recruiter-dashboard";
      } else {
        window.location.href = "/dashboard";
      }
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #0f172a, #1e293b, #312e81)",
      }}
    >
      {/* Background Image Overlay */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Glow Effects */}
      <div className="absolute w-[500px] h-[500px] bg-blue-600 blur-[150px] opacity-30 rounded-full top-[-100px] left-[-100px]" />
      <div className="absolute w-[400px] h-[400px] bg-purple-600 blur-[150px] opacity-30 rounded-full bottom-[-100px] right-[-100px]" />

      {/* Login Card */}
      <form
        onSubmit={submit}
        className="relative z-10 backdrop-blur-xl bg-white/10 border border-white/20 p-10 rounded-2xl shadow-2xl w-[380px] text-white"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <div className="bg-blue-500 p-3 rounded-full shadow-lg">
              <Briefcase size={26} />
            </div>
          </div>

          <h2 className="text-2xl font-bold tracking-wide">
            Welcome Back
          </h2>

          <p className="text-gray-300 text-sm mt-1">
            Login to your account
          </p>
        </div>

        {/* Email */}
        <div className="relative mb-4">
          <Mail
            className="absolute left-3 top-3 text-gray-300"
            size={18}
          />

          <input
            type="email"
            required
            placeholder="Email"
            className="w-full pl-10 p-3 rounded-lg bg-white/20 border border-white/30 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />
        </div>

        {/* Password */}
        <div className="relative mb-4">
          <Lock
            className="absolute left-3 top-3 text-gray-300"
            size={18}
          />

          <input
            type={showPassword ? "text" : "password"}
            required
            placeholder="Password"
            className="w-full pl-10 pr-10 p-3 rounded-lg bg-white/20 border border-white/30 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />

          <button
            type="button"
            className="absolute right-3 top-3 text-gray-300"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Forgot Password */}
        <div className="text-right mb-4">
          <Link
            to="/forgot-password"
            className="text-blue-300 text-sm hover:underline"
          >
            Forgot Password?
          </Link>
        </div>

        {/* Button */}
        <button
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 p-3 rounded-lg font-semibold hover:scale-105 transition transform shadow-lg"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Register */}
        <p className="text-center text-sm mt-5 text-gray-300">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-blue-300 font-medium hover:underline"
          >
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}