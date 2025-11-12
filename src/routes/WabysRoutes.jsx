import { Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import Login from "../pages/Login";
import Wabys from "../pages/Wabys";
import ViewTraineesRegistrations from "../pages/ViewTraineesRegistrations";
import ViewCheckInOut from "../pages/ViewCheckInOut";
import WaitingList from "../pages/WaitingList";
import DemoDashboard from "../pages/DemoDashboard";

export const WabysRoutes = () => [
    <Route path="/login" element={<Login />} />,
    <Route path="/wabys" element={
        <ProtectedRoute>
            <Wabys />
        </ProtectedRoute>
    } />,
    // it should be transfered to ebda edu system
    <Route path="/view-trainees-registrations" element={
        <ProtectedRoute>
            <ViewTraineesRegistrations />
        </ProtectedRoute>
    } />,
    <Route path="/checkIns" element={
        <ProtectedRoute>
            <ViewCheckInOut />
        </ProtectedRoute>
    } />,
    <Route path="/QRCode/waitingList" element={
        <WaitingList />
    } />,
    <Route path="/demo/dashboard" element={<DemoDashboard />} />,
];