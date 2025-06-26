import { use } from "react";
import { Navigate } from "react-router";
import { AuthContext } from "./contexts-providers/auth-context";
import Splash from "./components/common/Splash";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = use(AuthContext) as any;
  if (loading) return <Splash/>
 
  return user ? children : <Navigate state={{ from: location.pathname }} to="/auth/login" />;
};

export default ProtectedRoute;