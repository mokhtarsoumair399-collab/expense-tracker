import { Navigate, Outlet } from "react-router-dom";
import { Loader } from "../components/Loader";
import { useAuth } from "../context/AuthContext";

export const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) return <Loader />;
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};
