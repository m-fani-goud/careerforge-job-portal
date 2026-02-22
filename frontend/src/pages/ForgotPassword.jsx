import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import { Mail, Loader2, ArrowLeft } from "lucide-react";

export default function ForgotPassword() {

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);

  const navigate = useNavigate();


  /* ================= TIMER ================= */

  useEffect(() => {

    let interval;

    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }

    return () => clearInterval(interval);

  }, [timer]);


  /* ================= SEND OTP ================= */

  const sendOTP = async () => {

    if (!email) {
      alert("Enter email");
      return;
    }

    try {

      setLoading(true);

      await API.post("/auth/forgot-password", { email });

      setTimer(60);

      navigate("/reset-password", {
        state: { email },
      });

    } catch (error) {

      alert(error.response?.data?.message || "Error");

    } finally {

      setLoading(false);

    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center px-4 
    bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#020617]">

      {/* Glow Background */}
      <div className="absolute w-[400px] h-[400px] bg-indigo-600/20 blur-3xl rounded-full top-20 left-10"></div>
      <div className="absolute w-[400px] h-[400px] bg-purple-600/20 blur-3xl rounded-full bottom-20 right-10"></div>


      {/* Card */}
      <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 
      p-8 rounded-2xl shadow-2xl w-full max-w-md text-white">

        {/* Logo */}
        <h2 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r 
        from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          CareerForge
        </h2>

        <h3 className="text-xl font-semibold text-center mb-4">
          Forgot Password 🔐
        </h3>

        <p className="text-gray-300 text-sm mb-6 text-center">
          Enter your email to receive a verification OTP
        </p>


        {/* Email */}
        <div className="relative mb-6">

          <Mail className="absolute left-3 top-3 text-gray-400" size={18} />

          <input
            type="email"
            placeholder="Enter your email"
            className="
            bg-white/10 border border-white/20 
            pl-10 p-3 w-full rounded-lg 
            outline-none focus:ring-2 focus:ring-indigo-500
            placeholder-gray-400
            "
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

        </div>


        {/* Send Button */}
        <button
          onClick={sendOTP}
          disabled={loading}
          className="
          w-full flex items-center justify-center gap-2
          bg-gradient-to-r from-indigo-600 to-purple-600 
          hover:from-indigo-700 hover:to-purple-700
          px-5 py-3 rounded-lg font-medium
          transition
          disabled:opacity-50
          "
        >

          {loading ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              Sending OTP...
            </>
          ) : (
            "Send OTP"
          )}

        </button>


        {/* Timer */}
        {timer > 0 && (
          <p className="text-center text-sm text-gray-400 mt-4">
            Resend OTP in {timer}s
          </p>
        )}

        {timer === 0 && (
          <button
            onClick={sendOTP}
            className="text-indigo-400 text-sm mt-4 block mx-auto hover:underline"
          >
            Resend OTP
          </button>
        )}


        {/* Back */}
        <Link
          to="/login"
          className="flex items-center justify-center gap-1 text-sm 
          text-gray-300 mt-6 hover:text-white transition"
        >
          <ArrowLeft size={16} />
          Back to Login
        </Link>

      </div>

    </div>
  );
}