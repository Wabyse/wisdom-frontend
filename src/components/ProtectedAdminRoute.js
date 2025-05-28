import { Navigate, useLocation } from "react-router-dom";

const ProtectedAdminRoute = ({ children }) => {
    const location = useLocation();
    const token = localStorage.getItem("adminAuthData");

    return token ? children : <Navigate to="/neqaty/login" state={{ from: location }} replace />;
};

export default ProtectedAdminRoute;