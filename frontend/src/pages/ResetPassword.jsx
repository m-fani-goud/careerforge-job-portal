import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import API from "../services/api";
import { Mail, Lock } from "lucide-react";

export default function ResetPassword() {

  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState(
    location.state?.email || ""
  );

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const inputsRef = useRef([]);

  const [loading, setLoading] = useState(false);

  const [timer, setTimer] = useState(60);


  // ================= TIMER =================
  useEffect(() => {

    let interval;

    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }

    return () => clearInterval(interval);

  }, [timer]);


  // ================= OTP INPUT =================
  const handleChange = (value, index) => {

    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;

    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };


  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };


  // ================= RESEND OTP =================
  const resendOTP = async () => {

    if (!email) {
      alert("Enter email");
      return;
    }

    try {

      await API.post("/auth/forgot-password", { email });

      alert("OTP resent ✅");

      setTimer(60);

    } catch (error) {
      alert(error.response?.data?.message || "Error");
    }
  };


  // ================= SUBMIT =================
  const submit = async (e) => {
    e.preventDefault();

    const otpValue = otp.join("");

    if (otpValue.length !== 6) {
      alert("Enter valid OTP");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {

      setLoading(true);

      await API.post("/auth/reset-password", {
        email,
        otp: otpValue,
        password,
      });

      alert("Password reset successful ✅");

      navigate("/login");

    } catch (error) {
      alert(error.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-600 to-indigo-600 px-4">

      <form
        onSubmit={submit}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md"
      >

        <h2 className="text-2xl font-bold mb-6 text-center">
          Verify OTP 🔑
        </h2>

        <p className="text-gray-500 text-sm mb-4 text-center">
          Enter the 6-digit code sent to your email
        </p>


        {/* Email */}
        <div className="relative mb-4">
          <Mail className="absolute left-3 top-3 text-gray-400" size={18} />

          <input
            type="email"
            className="border pl-10 p-2 w-full rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>


        {/* OTP BOXES */}
        <div className="flex justify-between mb-2">

          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputsRef.current[index] = el)}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) =>
                handleChange(e.target.value, index)
              }
              onKeyDown={(e) =>
                handleKeyDown(e, index)
              }
              className="w-12 h-12 text-center border rounded text-lg font-bold"
            />
          ))}

        </div>


        {/* TIMER */}
        <div className="text-center text-sm text-gray-500 mb-4">

          {timer > 0 ? (
            <span>Resend OTP in {timer}s</span>
          ) : (
            <button
              type="button"
              onClick={resendOTP}
              className="text-blue-600 font-medium"
            >
              Resend OTP
            </button>
          )}

        </div>


        {/* Password */}
        <div className="relative mb-4">
          <Lock className="absolute left-3 top-3 text-gray-400" size={18} />

          <input
            type="password"
            placeholder="New Password"
            className="border pl-10 p-2 w-full rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>


        {/* Confirm */}
        <div className="relative mb-6">
          <Lock className="absolute left-3 top-3 text-gray-400" size={18} />

          <input
            type="password"
            placeholder="Confirm Password"
            className="border pl-10 p-2 w-full rounded"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(e.target.value)
            }
          />
        </div>


        {/* Button */}
        <button
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 text-white p-2 w-full rounded transition"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>


        {/* Back */}
        <p className="text-center text-sm mt-4">
          Back to{" "}
          <Link to="/login" className="text-blue-600 font-medium">
            Login
          </Link>
        </p>

      </form>

    </div>
  );
}