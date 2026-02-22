import { useState } from "react";
import API from "../services/api";
import { Crown } from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", {
        email,
        password,
      });

      if (res.data.user.role !== "admin") {
        return alert("Not admin account");
      }

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      window.location.href = "/admin-dashboard";
    } catch (error) {
      alert("Invalid credentials");
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
      {/* Optional Background Image Overlay */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1604079628040-94301bb21b91')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Glow Effect */}
      <div className="absolute w-[500px] h-[500px] bg-purple-600 blur-[150px] opacity-30 rounded-full top-[-100px] left-[-100px]" />
      <div className="absolute w-[400px] h-[400px] bg-blue-600 blur-[150px] opacity-30 rounded-full bottom-[-100px] right-[-100px]" />

      {/* Login Card */}
      <form
        onSubmit={login}
        className="relative z-10 backdrop-blur-xl bg-white/10 border border-white/20 p-10 rounded-2xl shadow-2xl w-[380px] text-white"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <div className="bg-yellow-500 p-3 rounded-full shadow-lg">
              <Crown size={28} />
            </div>
          </div>

          <h2 className="text-2xl font-bold tracking-wide">
            Admin Control Panel
          </h2>

          <p className="text-gray-300 text-sm mt-1">
            Royal access only
          </p>
        </div>

        {/* Email */}
        <input
          type="email"
          placeholder="Admin Email"
          required
          className="w-full p-3 mb-4 rounded-lg bg-white/20 border border-white/30 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          required
          className="w-full p-3 mb-6 rounded-lg bg-white/20 border border-white/30 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Button */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold p-3 rounded-lg hover:scale-105 transition transform shadow-lg"
        >
          Enter Dashboard 👑
        </button>

        {/* Footer */}
        <p className="text-center text-xs text-gray-300 mt-4">
          Authorized Personnel Only
        </p>
      </form>
    </div>
  );
}