import { useNavigate, Navigate, useLocation } from "react-router-dom";
import "../styles/StudentAbsence.css";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import {
  fetchClasses,
  fetchSchools,
  fetchStages,
  fetchStudents,
} from "../services/data";
import { sendStudentAttendance } from "../services/pms";
import ChangeLanguage from "../components/ChangeLanguage";
import { useLanguage } from "../context/LanguageContext";
import newLogo from "../assets/newLogo.jpg";
import { useAuth } from "../context/AuthContext";
import LoadingScreen from "../components/LoadingScreen";
import DenyAccessPage from "../components/DenyAccessPage";
import Popup from "../components/Popup";
import Selector2 from "../components/Selector2";

function StudentAbsence() {
  const location = useLocation();
  const { language } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [students, setStudnets] = useState([]);
  const [classes, setClasses] = useState([]);
  const [unfilteredClasses, setUnfilteredClasses] = useState([]);
  const [stages, setStages] = useState([]);
  const [schools, setSchools] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSchool, setSelectedSchool] = useState("");
  const [selectedStage, setSelectedStage] = useState("");
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userInfo } = useAuth();
  const navigate = useNavigate(); //for navigate to another page (component)

  const returnPms = () => {
    navigate("/pms");
  };

  const handleStudent = (e) => {
    if (e.target.value !== "") {
      setSelectedStudent(e.target.value);
    }
  };

  const handleClass = (e) => {
    if (e.target.value !== "") {
      setSelectedClass(e.target.value);
    }
  };

  const handleSchool = (e) => {
    setSelectedSchool(e.target.value);
  };

  const handleStage = (e) => {
    setSelectedStage(e.target.value);
  };

  const submitStudentAttendance = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const attendanceData = [];

    selectedStudents.forEach((student) => {
      const status = formData.get(`absenceStatus-${student.id}`);
      const reason = formData.get(`reason-${student.id}`);
      attendanceData.push({
        student_id: student.id,
        status,
        reason,
      });
    });

    try {
      await sendStudentAttendance(attendanceData);
      toast.success(language ? "Attendance has been submitted" : "تم تسجيل الحضور");
      setSubmitted(true);
    } catch (err) {
      toast.error("please fill all data required");
    }
  };

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const response = await fetchStudents();
        setStudnets(response);
      } catch (err) {
        console.error("API Error:", err);
        setError(err);
      }
    };

    const loadClasses = async () => {
      try {
        const response = await fetchClasses();
        setClasses(response);
        setUnfilteredClasses(response);
      } catch (err) {
        console.error("API Error:", err);
        setError(err);
      }
    };

    const loadStages = async () => {
      try {
        const response = await fetchStages();
        setStages(response);
      } catch (err) {
        console.error("API Error:", err);
        setError(err);
      }
    };

    const loadSchools = async () => {
      try {
        const response = await fetchSchools();
        setSchools(response);
      } catch (err) {
        console.error("API Error:", err);
        setError(err);
      }
    };

    loadStudents();
    loadClasses();
    loadStages();
    loadSchools();
    setLoading(false);
  }, []);

  useEffect(() => {
    const filteringClasses = () => {
      try {
        if (selectedStage !== "All" && selectedStage !== "") {
          const filter = unfilteredClasses.filter(
            (filterClass) => filterClass.stage_id === Number(selectedStage)
          );
          setClasses(filter);
        } else {
          setClasses(unfilteredClasses);
        }
      } catch (err) {
        console.error("API Error:", err);
        setError(err);
      }
    };

    filteringClasses();
  }, [selectedStage, unfilteredClasses]);

  useEffect(() => {
    const filterStudents = (
      selectedId,
      selectClass,
      selectStage,
      selectSchool
    ) => {
      let filtered = [];
      let filteredStudents = students;

      let schoolFilter = selectSchool ? selectSchool : null;
      let stageFilter = selectStage ? selectStage : null;
      let classFilter = selectClass ? selectClass : null;
      let studentFilter = selectedId ? selectedId : null;

      const hasFilter =
        (selectSchool !== "0" && selectSchool !== "") ||
        (selectStage !== "All" && selectStage !== "") ||
        (selectClass !== "All" && selectClass !== "") ||
        (selectedId !== "All" && selectedId !== "");

      const isStageClassMatch = classes.filter(
        (classFilter) => classFilter.stage_id === Number(stageFilter)
      );

      if (hasFilter) {
        filteredStudents.forEach((filter) => {
          const isSchoolMatch =
            (selectSchool === "0" || selectSchool === "")
              ? true
              : !schoolFilter || Number(schoolFilter) === filter.school_id;

          const isStageMatch =
            selectStage === "All" || selectStage === ""
              ? true
              : isStageClassMatch.filter(
                (classFilter) => classFilter.id === filter.class_id
              ).length > 0
                ? true
                : false;
          const isClassMatch =
            selectClass === "All" || selectClass === ""
              ? true
              : !classFilter || Number(classFilter) === filter.class_id;
          const isStudentMatch =
            selectedId === "All" || selectedId === ""
              ? true
              : !studentFilter || Number(studentFilter) === filter.id;
          if (isSchoolMatch && isClassMatch && isStudentMatch && isStageMatch) {
            filtered.push(filter);
          }
        });
      } else if (
        selectSchool === "" &&
        selectClass === "" &&
        selectedId === ""
      ) {
        console.log("done");
      } else {
        filtered = filteredStudents;
      }
      setSelectedStudents(filtered);
    };
    filterStudents(
      selectedStudent,
      selectedClass,
      selectedStage,
      selectedSchool
    );
  }, [
    selectedStudent,
    students,
    selectedClass,
    selectedStage,
    selectedSchool,
    classes,
  ]);

  const closePopup = () => {
    setSubmitted(false)
    navigate('/pms');
  };


  if (loading) return <LoadingScreen />;
  if (error?.status === 403) return <Navigate to="/login" state={{ from: location }} replace />;
  if (error) return <p>Error: {error.message}</p>;
  if (userInfo.user_role !== "Operations Excellence Lead" && userInfo.user_role !== "Supervisor") return <DenyAccessPage homePage='/pms' />;
  if (userInfo?.code === 1452) return <DenyAccessPage homePage='/watoms/dashboard' />;

  return (
    <div className="bg-formColor flex justify-center flex-wrap min-h-screen">
      <Toaster />
      <div
        className={`flex w-full p-[5px] h-[6vh] ${language ? "justify-start" : "justify-end"
          }`}
      >
        <button
          className="bg-wisdomOrange hover:bg-wisdomDarkOrange text-white rounded p-2 flex justify-center items-center"
          onClick={returnPms}
        >
          {language ? "< Return" : "رجوع >"}
        </button>
      </div>
      <div className="w-full flex justify-center">
        <img
          className="w-[60%] h-[30vh]"
          src={newLogo}
          alt="company logo"
        ></img>
      </div>
      <div className="w-full">
        <h1 className="text-2xl font-bold text-center">
          {language ? "Student Absence" : "غياب الطالب"}
        </h1>
      </div>
      <ChangeLanguage />
      {userInfo.user_role === "Operations Excellence Lead" ? <Selector2
        label="school"
        title={language ? "School:" : ":مدرسة"}
        description={language ? "Please Select a school" : "الرجاء اختيار مدرسة"}
        data={schools}
        value={selectedSchool}
        onChange={handleSchool}
        name="name"
        extraCSS="w-[99%]"
        All={true}
      /> : null}
      <Selector2
        label="grade"
        title={language ? "Grade:" : ":مرحلة"}
        description={language ? "Please Select a grade" : "الرجاء اختيار مرحلة"}
        data={stages}
        value={selectedStage}
        onChange={handleStage}
        name="name"
        extraCSS="w-[99%]"
        All={true}
      />
      <Selector2
        label="class"
        title={language ? "Class:" : ":فصل"}
        description={language ? "Please Select a class" : "الرجاء اختيار فصل"}
        data={classes}
        value={selectedClass || ""}
        onChange={handleClass}
        name="name"
        extraCSS="w-[99%]"
        All={true}
      />
      <Selector2
        label="student"
        title={language ? "Student:" : ":طالب"}
        description={language ? "Please Select a student" : "الرجاء اختيار طالب"}
        data={students}
        value={selectedStudent || ""}
        onChange={handleStudent}
        name="userStd"
        extraCSS="w-[99%]"
        All={true}
      />
      {selectedStudents.length > 0 ? (
        <form className="teacherSessions" onSubmit={submitStudentAttendance}>
          <div className="students">
            <div className="studentTitle">{language ? "Name:" : ":الاسم"}</div>
            <div className="studentTitle">
              {language ? "Status:" : ":الحالة"}
            </div>
            <div className="studentTitle">
              {language ? "Reason (optional):" : "السبب (اختياري)"}
            </div>
          </div>
          {selectedStudents.map((student) => (
            <div className="students" key={student.id}>
              <div className="studentName reason">
                <div className="">
                  {student.first_name} {student.middle_name} {student.last_name}
                </div>
              </div>
              <div className="reason">
                <select
                  id={`absenceStatus-${student.id}`}
                  name={`absenceStatus-${student.id}`}
                >
                  <option value="attend">
                    {language ? "Attended" : "حاضر"}
                  </option>
                  <option value="absent">{language ? "Absent" : "غائب"}</option>
                  <option value="late">{language ? "Late" : "متاخر"}</option>
                  <option value="left with parent">
                    {language ? "Left with parent" : "رحل مع عائلته"}
                  </option>
                </select>
              </div>
              <div className="reason">
                <input
                  id={`reasonInput ${student.id}`}
                  name={`reason-${student.id}`}
                  type="text"
                  className="studentReasonInput"
                />
              </div>
            </div>
          ))}
          <div className="flex justify-center items-center w-full">
            <button className="bg-wisdomOrange hover:bg-wisdomDarkOrange text-white rounded p-2 flex self-center items-center">
              {language ? "Submit" : "ارسال"}
            </button>
          </div>
        </form>
      ) : (
        <div className="noTeacher">
          {language ? "No Data Available" : "لا يوجد بيانات حاليا"}
        </div>
      )}
      <Popup
        isOpen={submitted}
        onClose={closePopup}
        message={language ? "Attendance has been submitted successfully" : "تم تسجيل الحضور بنجاح"}
      />
    </div>
  );
}

export default StudentAbsence;
