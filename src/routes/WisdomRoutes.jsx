import { Form, Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import Wisdom from "../pages/Wisdom";
import WisdomUserProfile from "../pages/WisdomUserProfile";
import WisdomDashboard from "../pages/WisdomDashboard";
import WisdomSystemInfo from "../pages/WisdomSystemInfo";
import Pms from "../pages/Pms";
import TeacherSubstitutions from "../pages/TeacherSubstitutions";
import TeacherLatness from "../pages/TeacherLatness";
import StudentAbsence from "../pages/StudentAbsence";
import StudentBehavior from "../pages/StudentBehavior";
import SchoolIncident from "../pages/SchoolIncident";
import Interview from "../pages/Interview";
import Test from "../pages/Test";
import Dms from "../pages/Dms";
import Tms from "../pages/Tms";
import UploadDocument from "../pages/UploadDocument";
import ViewDocument from "../pages/ViewDocument";
import Assign from "../pages/Assign";
import MyTasks from "../pages/MyTasks";
import ViewTask from "../pages/ViewTask";

export const WisdomRoutes = () => [
    <Route path="/wisdom" element={
        <ProtectedRoute>
            <Wisdom />
        </ProtectedRoute>
    } />,
    <Route path="/wisdom/user-profile" element={
        <ProtectedRoute>
            <WisdomUserProfile />
        </ProtectedRoute>
    } />,
    <Route path="/wisdom/dashboard" element={<WisdomDashboard />} />,
    <Route path="/wisdom/system-info" element={
        <ProtectedRoute>
            <WisdomSystemInfo />
        </ProtectedRoute>
    } />,
    <Route path="/pms" element={
        <ProtectedRoute>
            <Pms />
        </ProtectedRoute>
    } />,
    <Route path="/pms/form/:id" element={
        <ProtectedRoute>
            <Form />
        </ProtectedRoute>
    } />,
    <Route path="/pms/teacher-substitutions" element={
        <ProtectedRoute>
            <TeacherSubstitutions />
        </ProtectedRoute>
    } />,
    <Route path="/pms/teacher-latness" element={
        <ProtectedRoute>
            <TeacherLatness />
        </ProtectedRoute>
    } />,
    <Route path="/pms/student-absence" element={
        <ProtectedRoute>
            <StudentAbsence />
        </ProtectedRoute>
    } />,
    <Route path="/pms/student-behavior" element={
        <ProtectedRoute>
            <StudentBehavior />
        </ProtectedRoute>
    } />,
    <Route path="/pms/school-incident" element={
        <ProtectedRoute>
            <SchoolIncident />
        </ProtectedRoute>
    } />,
    <Route path="/pms/interview" element={
        <ProtectedRoute>
            <Interview />
        </ProtectedRoute>
    } />,
    <Route path="/pms/test" element={
        <ProtectedRoute>
            <Test />
        </ProtectedRoute>
    } />,
    <Route path="/dms" element={
        <ProtectedRoute>
            <Dms />
        </ProtectedRoute>
    } />,
    <Route path="/tms" element={
        <ProtectedRoute>
            <Tms />
        </ProtectedRoute>
    } />,
    <Route path="/dms/upload" element={
        <ProtectedRoute>
            <UploadDocument />
        </ProtectedRoute>
    } />,
    <Route path="/dms/view/:id" element={
        <ProtectedRoute>
            <ViewDocument />
        </ProtectedRoute>
    } />,
    <Route path="/tms/assign" element={
        <ProtectedRoute>
            <Assign />
        </ProtectedRoute>
    } />,
    <Route path="/tms/my-tasks" element={
        <ProtectedRoute>
            <MyTasks />
        </ProtectedRoute>
    } />,
    <Route path="/tms/view/:id" element={
        <ProtectedRoute>
            <ViewTask />
        </ProtectedRoute>
    } />,
];