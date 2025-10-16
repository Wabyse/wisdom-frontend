import { Navigate, useLocation } from "react-router-dom";

const ProtectedEbdaEduRoute = ({ children }) => {
    const location = useLocation();
    const token = localStorage.getItem("ebdaEduAuthData");

    return token ? children : <Navigate to="/IEES/login" state={{ from: location }} replace />;
};

export default ProtectedEbdaEduRoute;