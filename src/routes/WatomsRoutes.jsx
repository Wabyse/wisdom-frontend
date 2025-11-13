import { Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
// import Watoms from "./pages/Watoms";
import Eivots from "../pages/Eivots";
import WatomsUserProfile from "../pages/WatomsUserProfile";
import WatomsSystemInfo from "../pages/WatomsSystemInfo";
import TomsPms from "../pages/TomsPms";
import TomsForm from "../pages/TomsForm";
import TraineeAbsence from "../pages/TraineeAbsence";
import InistituteIncident from "../pages/InistitueIncident";
import TomsInterview from "../pages/TomsInterview";
import TomsTest from "../pages/TomsTest";
import TomsDms from "../pages/TomsDms";
import TomsUploadDocument from "../pages/TomsUploadDocument";
import TomsViewDocument from "../pages/TomsViewDocument";
import WatomsTmsDashboard from "../pages/WatomsTmsDashboard";
import { AlarmProvider } from "../context/AlarmContext";
import WatomsMyTasks from "../pages/WatomsMyTasks";
import WatomsTmsMyTasks from "../pages/WatomsTmsMyTasks";
import WatomsTmsAddTask from "../pages/WatomsTmsAddTask";
import WatomsTmsEdit from "../pages/WatomsTmsEdit";
import TomsAssign from "../pages/TomsAssign";
import TomsViewTask from "../pages/TomsViewTask";
import WatomsDashboard from "../pages/watoms/WatomsDashboard";
import WatomsNews from "../pages/WatomsNews";
import WatomsPublishNews from "../pages/WatomsPublishNews";
import WatomsManagersReports from "../pages/WatomsManagersReports";
import WatomsEvaluateManagers from "../pages/WatomsEvaluateManagers";
import WatomsProfessionalExamination from "../pages/watoms/professional_examination/WatomsProfessionalExamination";
import WatomsPEObserverEvaluation from "../pages/watoms/professional_examination/WatomsPEObserverEvaluation";
import WatomsPEQGObserversEvaluation from "../pages/watoms/professional_examination/WatomsPEQGObserversEvaluation";
import WatomsPECandidatesExam from "../pages/watoms/professional_examination/WatomsPECandidatesExam";
import WatomsPEDashboard from "../pages/watoms/professional_examination/WatomsPEDashboard";

export const WatomsRoutes = () => [
    <Route path="/watoms" element={
        <ProtectedRoute>
            <Eivots />
        </ProtectedRoute>
    } />,
    <Route path="/watoms/user-profile" element={
        <ProtectedRoute>
            <WatomsUserProfile />
        </ProtectedRoute>
    } />,
    <Route path="/watoms/system-info" element={
        <ProtectedRoute>
            <WatomsSystemInfo />
        </ProtectedRoute>
    } />,
    <Route path="/watoms/pms" element={
        <ProtectedRoute>
            <TomsPms />
        </ProtectedRoute>
    } />,
    <Route path="/watoms/pms/form/:id" element={
        <ProtectedRoute>
            <TomsForm />
        </ProtectedRoute>
    } />,
    <Route path="/watoms/pms/trainee-absence" element={
        <ProtectedRoute>
            <TraineeAbsence />
        </ProtectedRoute>
    } />,
    <Route path="/watoms/pms/inistitute-incident" element={
        <ProtectedRoute>
            <InistituteIncident />
        </ProtectedRoute>
    } />,
    <Route path="/watoms/pms/interview" element={
        <ProtectedRoute>
            <TomsInterview />
        </ProtectedRoute>
    } />,
    <Route path="/watoms/pms/test" element={
        <ProtectedRoute>
            <TomsTest />
        </ProtectedRoute>
    } />,
    <Route path="/watoms/dms" element={
        <ProtectedRoute>
            <TomsDms />
        </ProtectedRoute>
    } />,
    <Route path="/watoms/dms/upload" element={
        <ProtectedRoute>
            <TomsUploadDocument />
        </ProtectedRoute>
    } />,
    <Route path="/watoms/dms/view/:id" element={
        <ProtectedRoute>
            <TomsViewDocument />
        </ProtectedRoute>
    } />,
    <Route path="/watoms/tms" element={
        <ProtectedRoute>
            <AlarmProvider>
                <WatomsTmsDashboard />
            </AlarmProvider>
        </ProtectedRoute>
    } />,
    <Route path="/watoms/tms/my-tasks" element={
        <ProtectedRoute>
            <WatomsMyTasks />
        </ProtectedRoute>
    } />,
    <Route path="/watoms/tms/tasks" element={
        <ProtectedRoute>
            <WatomsTmsMyTasks />
        </ProtectedRoute>
    } />,
    <Route path="/watoms/tms/add-task" element={
        <ProtectedRoute>
            <WatomsTmsAddTask />
        </ProtectedRoute>
    } />,
    <Route path="/watoms/tms/edit/:id" element={
        <ProtectedRoute>
            <WatomsTmsEdit />
        </ProtectedRoute>
    } />,
    <Route path="/watoms/tms/assign" element={
        <ProtectedRoute>
            <TomsAssign />
        </ProtectedRoute>
    } />,
    <Route path="/watoms/tms/view/:id" element={
        <ProtectedRoute>
            <TomsViewTask />
        </ProtectedRoute>
    } />,
    <Route path="/watoms/dashboard" element={<WatomsDashboard />} />,
    <Route path="/watoms/news" element={
        <ProtectedRoute>
            <WatomsNews />
        </ProtectedRoute>
    } />,
    <Route path="/watoms/publish-news" element={
        <ProtectedRoute>
            <WatomsPublishNews />
        </ProtectedRoute>
    } />,
    <Route path="/watoms/managers" element={
        <ProtectedRoute>
            <WatomsManagersReports />
        </ProtectedRoute>
    } />,
    <Route path="/watoms/evaluate/managers" element={
        <ProtectedRoute>
            <WatomsEvaluateManagers />
        </ProtectedRoute>
    } />,
    <Route path="/watoms/pe" element={
        <ProtectedRoute>
            <WatomsProfessionalExamination />
        </ProtectedRoute>
    } />,
    <Route path="/watoms/pe/observer-evaluation/:id" element={
        <ProtectedRoute>
            <WatomsPEObserverEvaluation />
        </ProtectedRoute>
    } />,
    <Route path="/watoms/pe/qg-observers-evaluation/:id" element={
        <ProtectedRoute>
            <WatomsPEQGObserversEvaluation />
        </ProtectedRoute>
    } />,
    <Route path="/watoms/pe/candidates-exam/:id" element={
        <ProtectedRoute>
            <WatomsPECandidatesExam />
        </ProtectedRoute>
    } />,
    <Route path="/watoms/pe/dashboard" element={
        <ProtectedRoute>
            <WatomsPEDashboard />
        </ProtectedRoute>
    } />,
];