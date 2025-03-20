import "./styles/App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Pms from "./pages/Pms";
import Form from "./pages/Form";
import Dms from "./pages/Dms";
import Tms from "./pages/Tms";
import Assign from "./pages/Assign";
import MyTasks from "./pages/MyTasks";
import UploadDocument from "./pages/UploadDocument";
import ViewDocument from "./pages/ViewDocument";
import ViewTask from "./pages/ViewTask";
import TeacherSubstitutions from "./pages/TeacherSubstitutions";
import TeacherLatness from "./pages/TeacherLatness";
import StudentAbsence from "./pages/StudentAbsence";
import Interview from "./pages/Interview";
import Test from "./pages/Test";
import SchoolIncident from "./pages/SchoolIncident";
import StudentBehavior from "./pages/StudentBehavior";

function App() {
  return (
    <Router>
      <Routes>
        {/* <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        /> */}
        <Route path="/login" element={<Login />} />
        {/* <Route path="/signup" element={<SignUp />} /> */}
        <Route
          path="/pms"
          element={
            <ProtectedRoute>
              <Pms />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pms/form/:id"
          element={
            <ProtectedRoute>
              <Form />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pms/teacher-substitutions"
          element={
            <ProtectedRoute>
              <TeacherSubstitutions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pms/teacher-latness"
          element={
            <ProtectedRoute>
              <TeacherLatness />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pms/student-absence"
          element={
            <ProtectedRoute>
              <StudentAbsence />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pms/student-behavior"
          element={
            <ProtectedRoute>
              <StudentBehavior />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pms/school-incident"
          element={
            <ProtectedRoute>
              <SchoolIncident />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pms/interview"
          element={
            <ProtectedRoute>
              <Interview />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pms/test"
          element={
            <ProtectedRoute>
              <Test />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dms"
          element={
            <ProtectedRoute>
              <Dms />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tms"
          element={
            <ProtectedRoute>
              <Tms />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dms/upload"
          element={
            <ProtectedRoute>
              <UploadDocument />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dms/view/:id"
          element={
            <ProtectedRoute>
              <ViewDocument />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tms/assign"
          element={
            <ProtectedRoute>
              <Assign />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tms/my-tasks"
          element={
            <ProtectedRoute>
              <MyTasks />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tms/view/:id"
          element={
            <ProtectedRoute>
              <ViewTask />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
