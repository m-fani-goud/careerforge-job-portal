import { useEffect, useState } from "react";
import { getNotifications, markAsRead } from "../services/notificationService";
import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function NotificationDropdown() {

  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const res = await getNotifications();
      setNotifications(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const handleClick = async (n) => {
    try {
      await markAsRead(n._id);

      if (n.link) {
        navigate(n.link);
      }

      loadNotifications();
      setOpen(false);

    } catch (err) {
      console.log(err);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative">

      {/* BELL */}
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-lg hover:bg-white/10 transition"
      >
        <Bell size={20} />

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-xs px-2 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>


      {/* DROPDOWN */}
      {open && (
        <div className="absolute right-0 mt-3 w-80 bg-[#0f172a] border border-white/10 rounded-xl shadow-xl z-50">

          <div className="p-3 border-b border-white/10 font-semibold">
            Notifications
          </div>

          <div className="max-h-80 overflow-y-auto">

            {notifications.length === 0 && (
              <div className="p-4 text-sm opacity-70">
                No notifications
              </div>
            )}

            {notifications.map((n) => (
              <div
                key={n._id}
                onClick={() => handleClick(n)}
                className={`p-3 cursor-pointer border-b border-white/5 hover:bg-white/5 ${
                  !n.read ? "bg-white/10" : ""
                }`}
              >
                <p className="text-sm font-medium">
                  {n.title}
                </p>

                <p className="text-xs opacity-70">
                  {n.message}
                </p>

                <p className="text-xs opacity-50 mt-1">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </div>
            ))}

          </div>

        </div>
      )}

    </div>
  );
}