import { Route } from "react-router-dom";
import NeqatyLogin from "../pages/NeqatyLogin";
import ProtectedAdminRoute from "../components/ProtectedAdminRoute";
import Neqaty from "../pages/Neqaty";
import NeqatySchool from "../pages/NeqatySchool";
import NeqatyVtc from "../pages/NeqatyVtc";
import NeqatySchoolPermissions from "../pages/NeqatySchoolPermission";
import NeqatyVtcPermissions from "../pages/NeqatyVtcPermissions";

export const NeqatyRoutes = () => [
    <Route path="/neqaty/login" element={<NeqatyLogin />} />,
    <Route path="/neqaty" element={
        <ProtectedAdminRoute>
            <Neqaty />
        </ProtectedAdminRoute>
    } />,
    <Route path="/neqaty/schools" element={
        <ProtectedAdminRoute>
            <NeqatySchool />
        </ProtectedAdminRoute>
    } />,
    <Route path="/neqaty/vtcs" element={
        <ProtectedAdminRoute>
            <NeqatyVtc />
        </ProtectedAdminRoute>
    } />,
    <Route path="/neqaty/school-permissions" element={
        <ProtectedAdminRoute>
            <NeqatySchoolPermissions />
        </ProtectedAdminRoute>
    } />,
    <Route path="/neqaty/vtc-permissions" element={
        <ProtectedAdminRoute>
            <NeqatyVtcPermissions />
        </ProtectedAdminRoute>
    } />,
];