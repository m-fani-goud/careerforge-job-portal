import { useState, useRef, useEffect } from "react";
import API from "../services/api";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  CheckCircle,
  Building,
  Briefcase,
} from "lucide-react";

export default function Register() {
  const [form, setForm] = useState({
    role: "user",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    companyName: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputs = useRef([]);

  const [timer, setTimer] = useState(60);
  const [success, setSuccess] = useState(false);

  /* ================= TIMER ================= */
  useEffect(() => {
    if (!showOTP) return;

    const interval = setInterval(() => {
      setTimer((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [showOTP]);

  /* ================= VALIDATION ================= */
  const validate = () => {
    if (!form.name || !form.email || !form.password) {
      return "All fields are required";
    }

    if (form.role === "recruiter" && !form.companyName) {
      return "Company name is required";
    }

    if (form.password.length < 6) {
      return "Password must be at least 6 characters";
    }

    if (form.password !== form.confirmPassword) {
      return "Passwords do not match";
    }

    return "";
  };

  /* ================= REGISTER ================= */
  const submit = async (e) => {
    e.preventDefault();

    const validationError = validate();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError("");

      await API.post("/auth/register", form);

      setShowOTP(true);
      setTimer(60);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= OTP INPUT ================= */
  const handleOTPChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputs.current[index + 1].focus();
    }
  };

  /* ================= VERIFY OTP ================= */
  const verifyOTP = async () => {
    const otpValue = otp.join("");

    if (otpValue.length !== 6) {
      setError("Enter valid OTP");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post("/auth/verify-email", {
        email: form.email,
        otp: otpValue,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      setSuccess(true);

      setTimeout(() => {
        if (res.data.user.role === "recruiter") {
          window.location.href = "/recruiter-dashboard";
        } else {
          window.location.href = "/dashboard";
        }
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  /* ================= RESEND OTP ================= */
  const resendOTP = async () => {
    try {
      await API.post("/auth/resend-otp", {
        email: form.email,
      });

      setTimer(60);
    } catch (err) {
      setError("Failed to resend OTP");
    }
  };

  /* ================= SUCCESS ================= */
  if (success) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-r from-green-600 to-emerald-700 text-white">
        <div className="text-center animate-pulse">
          <CheckCircle size={80} className="mx-auto mb-4" />
          <h2 className="text-2xl font-bold">
            Account Verified 🎉
          </h2>
          <p>Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #0f172a, #1e293b, #312e81)",
      }}
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d')",
          backgroundSize: "cover",
        }}
      />

      {/* Glow */}
      <div className="absolute w-[500px] h-[500px] bg-blue-600 blur-[150px] opacity-30 rounded-full top-[-100px] left-[-100px]" />
      <div className="absolute w-[400px] h-[400px] bg-purple-600 blur-[150px] opacity-30 rounded-full bottom-[-100px] right-[-100px]" />

      <div className="relative z-10 backdrop-blur-xl bg-white/10 border border-white/20 p-10 rounded-2xl shadow-2xl w-[420px] text-white">

        {/* HEADER */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <div className="bg-indigo-500 p-3 rounded-full shadow-lg">
              <Briefcase size={26} />
            </div>
          </div>

          <h2 className="text-2xl font-bold">Create Account</h2>
          <p className="text-gray-300 text-sm">
            Join our job platform
          </p>
        </div>

        {error && (
          <div className="bg-red-500/20 text-red-200 p-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        {/* ================= REGISTER ================= */}
        {!showOTP && (
          <form onSubmit={submit}>

            {/* ROLE */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div
                onClick={() => setForm({ ...form, role: "user" })}
                className={`p-3 border rounded text-center cursor-pointer ${
                  form.role === "user"
                    ? "border-blue-400 bg-blue-500/20"
                    : "border-white/20"
                }`}
              >
                👤 Job Seeker
              </div>

              <div
                onClick={() =>
                  setForm({ ...form, role: "recruiter" })
                }
                className={`p-3 border rounded text-center cursor-pointer ${
                  form.role === "recruiter"
                    ? "border-blue-400 bg-blue-500/20"
                    : "border-white/20"
                }`}
              >
                💼 Recruiter
              </div>
            </div>

            {/* NAME */}
            <Input
              icon={<User />}
              placeholder="Full Name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            {/* EMAIL */}
            <Input
              icon={<Mail />}
              placeholder="Email"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />

            {/* COMPANY */}
            {form.role === "recruiter" && (
              <Input
                icon={<Building />}
                placeholder="Company Name"
                value={form.companyName}
                onChange={(e) =>
                  setForm({
                    ...form,
                    companyName: e.target.value,
                  })
                }
              />
            )}

            {/* PASSWORD */}
            <div className="relative mb-4">
              <Lock className="absolute left-3 top-3 text-gray-300" size={18} />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full pl-10 pr-10 p-3 rounded-lg bg-white/20 border border-white/30"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
              />

              <button
                type="button"
                className="absolute right-3 top-3"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>

            {/* CONFIRM */}
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full p-3 mb-5 rounded-lg bg-white/20 border border-white/30"
              value={form.confirmPassword}
              onChange={(e) =>
                setForm({
                  ...form,
                  confirmPassword: e.target.value,
                })
              }
            />

            <button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 p-3 rounded-lg font-semibold hover:scale-105 transition">
              {loading ? "Creating..." : "Register"}
            </button>
          </form>
        )}

        {/* ================= OTP ================= */}
        {showOTP && (
          <div className="text-center">

            <h3 className="font-semibold mb-2">
              Enter Verification Code
            </h3>

            <p className="text-sm text-gray-300 mb-4">
              OTP sent to {form.email}
            </p>

            <div className="flex justify-center gap-2 mb-4">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputs.current[index] = el)}
                  maxLength={1}
                  value={digit}
                  onChange={(e) =>
                    handleOTPChange(
                      e.target.value,
                      index
                    )
                  }
                  className="w-12 h-12 rounded text-center text-lg bg-white/20 border border-white/30"
                />
              ))}
            </div>

            <button
              onClick={verifyOTP}
              className="bg-green-600 p-3 w-full rounded mb-3"
            >
              Verify & Continue
            </button>

            {timer > 0 ? (
              <p className="text-sm text-gray-300">
                Resend OTP in {timer}s
              </p>
            ) : (
              <button
                onClick={resendOTP}
                className="text-blue-300 text-sm"
              >
                Resend OTP
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ================= INPUT COMPONENT ================= */

function Input({ icon, ...props }) {
  return (
    <div className="relative mb-4">
      <div className="absolute left-3 top-3 text-gray-300">
        {icon}
      </div>

      <input
        {...props}
        className="w-full pl-10 p-3 rounded-lg bg-white/20 border border-white/30"
      />
    </div>
  );
}