import { useState } from "react";
import RecruiterSidebar from "./RecruiterSidebar";
import { Menu } from "lucide-react";

export default function RecruiterLayout({ children }) {

  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* ================= DESKTOP SIDEBAR ================= */}
      <div className="hidden md:block">
        <RecruiterSidebar />
      </div>


      {/* ================= MOBILE SIDEBAR ================= */}
      {open && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setOpen(false)}
          />

          {/* Drawer */}
          <div className="fixed left-0 top-0 z-50 md:hidden">
            <RecruiterSidebar />
          </div>
        </>
      )}


      {/* ================= CONTENT ================= */}
      <div className="flex-1 flex flex-col w-full">

        {/* MOBILE TOP BAR */}
        <div className="md:hidden flex items-center justify-between p-4 bg-gradient-to-r from-indigo-900 via-purple-900 to-blue-900 text-white shadow">

          <button
            onClick={() => setOpen(true)}
            className="p-2 rounded-lg hover:bg-white/10"
          >
            <Menu />
          </button>

          <h1 className="font-bold text-lg">
            Recruiter Panel
          </h1>

          <div />
        </div>


        {/* PAGE CONTENT */}
        <div className="flex-1 p-4 md:p-6">
          {children}
        </div>

      </div>

    </div>
  );
}