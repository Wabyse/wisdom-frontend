import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  // const token = localStorage.getItem("token");
  const token = localStorage.getItem("authData");

  return token ? children : <Navigate to="/login" state={{ from: location }} replace />;
};

export default ProtectedRoute;