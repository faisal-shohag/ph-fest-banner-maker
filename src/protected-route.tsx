import { use } from "react";
import { Navigate } from "react-router";
import { AuthContext } from "./contexts-providers/auth-context";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = use(AuthContext) as any;
  if (loading) return <div>Loading...</div>;
 
  return user ? children : <Navigate state={{ from: location.pathname }} to="/auth/login" />;
};

export default ProtectedRoute;