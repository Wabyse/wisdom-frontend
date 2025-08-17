import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Pms from "./pages/Pms";
import Form from "./pages/Form";
import Dms from "./pages/Dms";
import Home from "./pages/Home";
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
import TomsPms from "./pages/TomsPms";
import TomsForm from "./pages/TomsForm";
import TraineeAbsence from "./pages/TraineeAbsence";
import InistituteIncident from "./pages/InistitueIncident";
import TomsInterview from "./pages/TomsInterview";
import TomsTest from "./pages/TomsTest";
import TomsDms from "./pages/TomsDms";
import TomsUploadDocument from "./pages/TomsUploadDocument";
import TomsViewDocument from "./pages/TomsViewDocument";
import TomsTms from "./pages/TomsTms";
import TomsViewTask from "./pages/TomsViewTask";
import TomsAssign from "./pages/TomsAssign";
import HomeEVOTS from "./pages/HomeEVOTS";
import HomeCareers from "./pages/HomeCareers";
import HomeAboutUs from "./pages/HomeAboutUs";
import HomeContactUs from "./pages/HomeContactUs";
import HomeServicesTraining from "./pages/HomeServicesTraining";
import CheckInOut from "./pages/CheckInOut";
import QRList from "./pages/QRList";
import NeqatyLogin from "./pages/NeqatyLogin";
import Neqaty from "./pages/Neqaty";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import ViewCheckInOut from "./pages/ViewCheckInOut";
import NeqatySchool from "./pages/NeqatySchool";
import NeqatyVtc from "./pages/NeqatyVtc";
import NeqatySchoolPermissions from "./pages/NeqatySchoolPermission";
import NeqatyVtcPermissions from "./pages/NeqatyVtcPermissions";
import BulkData from "./pages/BulkData";
import WaitingList from "./pages/WaitingList";
// import Watoms from "./pages/Watoms";
import WatomsUserProfile from "./pages/WatomsUserProfile";
import WatomsSystemInfo from "./pages/WatomsSystemInfo";
import WatomsDashboard from "./pages/WatomsDashboard";
import Wisdom from "./pages/Wisdom";
import WisdomUserProfile from "./pages/WisdomUserProfile";
import WisdomSystemInfo from "./pages/WisdomSystemInfo";
import WisdomDashboard from "./pages/WisdomDashboard";
import Eivots from "./pages/Eivots";
import Wabys from "./pages/Wabys";
import WatomsTraineesRegistration from "./pages/WatomsTraineesRegistration";
import WatomsTmsMyTasks from "./pages/WatomsTmsMyTasks";

function App() {
  return (
    <div className="font-sans">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/evots" element={<HomeEVOTS />} />
          <Route path="/careers" element={<HomeCareers />} />
          <Route path="/aboutus" element={<HomeAboutUs />} />
          <Route path="/contactus" element={<HomeContactUs />} />
          <Route path="/services/training" element={<HomeServicesTraining />} />
          <Route path="/vtc-trainees-registration" element={<WatomsTraineesRegistration />} />
          <Route path="/checkin" element={<CheckInOut />} />
          <Route path="/qrcodes" element={<QRList />} />
          <Route path="/login" element={<Login />} />
          <Route path="/neqaty/login" element={<NeqatyLogin />} />
          <Route path="/neqaty" element={
            <ProtectedAdminRoute>
              <Neqaty />
            </ProtectedAdminRoute>
          } />
          <Route path="/neqaty/schools" element={
            <ProtectedAdminRoute>
              <NeqatySchool />
            </ProtectedAdminRoute>
          } />
          <Route path="/neqaty/vtcs" element={
            <ProtectedAdminRoute>
              <NeqatyVtc />
            </ProtectedAdminRoute>
          } />
          <Route path="/neqaty/school-permissions" element={
            <ProtectedAdminRoute>
              <NeqatySchoolPermissions />
            </ProtectedAdminRoute>
          } />
          <Route path="/neqaty/vtc-permissions" element={
            <ProtectedAdminRoute>
              <NeqatyVtcPermissions />
            </ProtectedAdminRoute>
          } />
          {/* <Route path="/signup" element={<SignUp />} /> */}
          <Route
            path="/bulk-data"
            element={
              <ProtectedRoute>
                <BulkData />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wabys"
            element={
              <ProtectedRoute>
                <Wabys />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wisdom"
            element={
              <ProtectedRoute>
                <Wisdom />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wisdom/user-profile"
            element={
              <ProtectedRoute>
                <WisdomUserProfile />
              </ProtectedRoute>
            }
          />
          <Route path="/wisdom/dashboard" element={<WisdomDashboard />} />
          <Route
            path="/wisdom/system-info"
            element={
              <ProtectedRoute>
                <WisdomSystemInfo />
              </ProtectedRoute>
            }
          />
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
          <Route
            path="/watoms"
            element={
              <ProtectedRoute>
                <Eivots />
              </ProtectedRoute>
            }
          />
          <Route
            path="/watoms/user-profile"
            element={
              <ProtectedRoute>
                <WatomsUserProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/watoms/system-info"
            element={
              <ProtectedRoute>
                <WatomsSystemInfo />
              </ProtectedRoute>
            }
          />
          <Route
            path="/watoms/pms"
            element={
              <ProtectedRoute>
                <TomsPms />
              </ProtectedRoute>
            }
          />
          <Route
            path="/watoms/pms/form/:id"
            element={
              <ProtectedRoute>
                <TomsForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/watoms/pms/trainee-absence"
            element={
              <ProtectedRoute>
                <TraineeAbsence />
              </ProtectedRoute>
            }
          />
          <Route
            path="/watoms/pms/inistitute-incident"
            element={
              <ProtectedRoute>
                <InistituteIncident />
              </ProtectedRoute>
            }
          />
          <Route
            path="/watoms/pms/interview"
            element={
              <ProtectedRoute>
                <TomsInterview />
              </ProtectedRoute>
            }
          />
          <Route
            path="/watoms/pms/test"
            element={
              <ProtectedRoute>
                <TomsTest />
              </ProtectedRoute>
            }
          />
          <Route
            path="/watoms/dms"
            element={
              <ProtectedRoute>
                <TomsDms />
              </ProtectedRoute>
            }
          />
          <Route
            path="/watoms/dms/upload"
            element={
              <ProtectedRoute>
                <TomsUploadDocument />
              </ProtectedRoute>
            }
          />
          <Route
            path="/watoms/dms/view/:id"
            element={
              <ProtectedRoute>
                <TomsViewDocument />
              </ProtectedRoute>
            }
          />
          <Route
            path="/watoms/tms"
            element={
              <ProtectedRoute>
                <TomsTms />
              </ProtectedRoute>
            }
          />
          <Route
            path="/watoms/tms/assign"
            element={
              <ProtectedRoute>
                <TomsAssign />
              </ProtectedRoute>
            }
          />
          <Route
            path="/watoms/tms/my-tasks"
            element={
              <ProtectedRoute>
                <WatomsTmsMyTasks />
              </ProtectedRoute>
            }
          />
          <Route
            path="/watoms/tms/view/:id"
            element={
              <ProtectedRoute>
                <TomsViewTask />
              </ProtectedRoute>
            }
          />
          <Route path="/watoms/dashboard" element={<WatomsDashboard />} />
          <Route
            path="/checkIns"
            element={
              <ProtectedRoute>
                <ViewCheckInOut />
              </ProtectedRoute>
            }
          />
          <Route
            path="/QRCode/waitingList"
            element={
              <WaitingList />
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
