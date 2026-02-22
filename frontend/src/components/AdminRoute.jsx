import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {

  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch (err) {
    user = null;
  }

  const token = localStorage.getItem("token");

  // Not logged in
  if (!token || !user) {
    return <Navigate to="/admin-login" replace />;
  }

  // Not admin
  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}