import { useState } from "react";
import API from "../services/api";

export default function VerifyEmail() {

  const [form, setForm] = useState({
    email: "",
    otp: "",
  });

  const submit = async (e) => {
    e.preventDefault();

    try {

      await API.post("/auth/verify-email", form);

      alert("Email verified ✅");

      window.location.href = "/login";

    } catch (err) {

      alert(err.response?.data?.message || "Error");

    }
  };


  return (
    <div className="flex justify-center items-center h-screen">

      <form onSubmit={submit} className="bg-white p-6 shadow rounded w-80">

        <h2 className="text-xl mb-4 text-center">
          Verify Email
        </h2>

        <input
          placeholder="Email"
          className="border p-2 mb-2 w-full"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          placeholder="OTP"
          className="border p-2 mb-3 w-full"
          onChange={(e) => setForm({ ...form, otp: e.target.value })}
        />

        <button className="bg-blue-600 text-white p-2 w-full">
          Verify
        </button>

      </form>

    </div>
  );
}