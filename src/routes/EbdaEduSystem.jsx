import { Route } from "react-router-dom";
import CheckInOut from "../pages/CheckInOut";
import QRList from "../pages/QRList";
import ProtectedEbdaEduRoute from "../components/ProtectedEbdaEduRoute";
import EbdaEduLogin from "../pages/EbdaEduLogin";
import EbdaEdu from "../pages/EbdaEdu";
import EbdaEduTms from "../pages/EbdaEduTms";
import EbdaEduTmsMyTasks from "../pages/EbdaEduTmsMyTasks";
import EbdaEduTmsAddTask from "../pages/EbdaEduTmsAddTask";
import EbdaEduTmsEditTask from "../pages/EbdaEduTmsEditTask";
import BulkData from "../pages/BulkData";

export const EbdaEduSystemRoutes = () => [
    <Route path="/checkin" element={<CheckInOut />} />,
    <Route path="/IEES/login" element={<EbdaEduLogin />} />,
    <Route path="/IEES" element={
        <ProtectedEbdaEduRoute>
            <EbdaEdu />
        </ProtectedEbdaEduRoute>
    } />,
    <Route path="/IEES/qrcodes" element={
        <ProtectedEbdaEduRoute>
            <QRList />
        </ProtectedEbdaEduRoute>
    } />,
    <Route path="/bulk-data" element={
        <ProtectedEbdaEduRoute>
            <BulkData />
        </ProtectedEbdaEduRoute>
    } />,
    <Route path="/IEES/tms" element={
        <ProtectedEbdaEduRoute>
            <EbdaEduTms />
        </ProtectedEbdaEduRoute>
    } />,
    <Route path="/IEES/tms/my-tasks" element={
        <ProtectedEbdaEduRoute>
            <EbdaEduTmsMyTasks />
        </ProtectedEbdaEduRoute>
    } />,
    <Route path="/IEES/tms/add-task" element={
        <ProtectedEbdaEduRoute>
            <EbdaEduTmsAddTask />
        </ProtectedEbdaEduRoute>
    } />,
    <Route path="/IEES/tms/edit/:id" element={
        <ProtectedEbdaEduRoute>
            <EbdaEduTmsEditTask />
        </ProtectedEbdaEduRoute>
    } />,
];