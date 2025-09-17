import { useNavigate, Navigate, useLocation } from "react-router-dom";
import "../styles/StudentAbsence.css";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import {
  fetchClasses,
  fetchSchools,
  fetchStudents,
} from "../services/data";
import { sendStudentAttendance } from "../services/pms";
import newLogo2 from "../assets/newLogo2.jpg";
import { useAuth } from "../context/AuthContext";
import LoadingScreen from "../components/LoadingScreen";
import DenyAccessPage from "../components/DenyAccessPage";

function TraineeAbsence() {
  const location = useLocation();
  const [students, setStudnets] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [schools, setSchools] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSchool, setSelectedSchool] = useState("");
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userInfo } = useAuth();
  const navigate = useNavigate(); //for navigate to another page (component)

  const returnPms = () => {
    navigate("/watoms/pms");
  };

  const handleStudent = (e) => {
    if (e.target.value !== "") {
      setSelectedStudent(e.target.value);
    }
  };

  const handleClass = (e) => {
    if (e.target.value !== "" && e.target.value !== "All") {
      const filtering = students.filter(student => student.class_id === Number(e.target.value));
      setFilteredStudents(filtering)
    }
    if (e.target.value !== "") {
      setSelectedClass(e.target.value);
    }
  };

  const handleSchool = (e) => {
    setSelectedSchool(e.target.value);
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
      toast.success("submitted");
    } catch (err) {
      toast.error("please fill all data required");
    }
  };

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const response = await fetchStudents();
        const filterOrg = userInfo.user_role === "Operations Excellence Lead" || userInfo.user_role === "ADMIN" ? response : response.filter(org => org.school_id === userInfo.organization_id);
        setStudnets(filterOrg);
        setFilteredStudents(filterOrg);
      } catch (err) {
        console.error("API Error:", err);
        setError(err);
      }
    };

    const loadClasses = async () => {
      try {
        const response = await fetchClasses();
        const response2 = await fetchStudents();
        let response3;
        if (userInfo.user_role !== "Operations Excellence Lead") {
          response3 = [...new Set(response2
            .filter(test => test.school_id === userInfo.organization_id)
            .map(test => test.class_id)
          )];
        } else {
          response3 = response2.map(test => test.class_id);
        }
        const response4 = response.filter(item => response3.includes(item.id));
        setClasses(response4);
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
    loadSchools();
    setLoading(false);
  }, [userInfo]);

  useEffect(() => {
    const filterStudents = (
      selectedId,
      selectClass,
      // selectStage,
      selectSchool
    ) => {
      let filtered = [];
      let filteredStudents = students;

      let schoolFilter = selectSchool ? selectSchool : null;
      // let stageFilter = selectStage ? selectStage : null;
      let classFilter = selectClass ? selectClass : null;
      let studentFilter = selectedId ? selectedId : null;

      const hasFilter =
        ((userInfo.user_role === "Operations Excellence Lead" || userInfo.user_role === "ADMIN") && selectSchool !== "All" && selectSchool !== "") ||
        // (selectStage !== "All" && selectStage !== "") ||
        (selectClass !== "All" && selectClass !== "") ||
        (selectedId !== "All" && selectedId !== "");

      // const isStageClassMatch = classes.filter(
      //   (classFilter) => classFilter.stage_id === Number(stageFilter)
      // );

      if (hasFilter) {
        filteredStudents.forEach((filter) => {
          const isSchoolMatch =
            selectSchool === "All"
              ? true
              : !schoolFilter || Number(schoolFilter) === filter.school_id;

          // const isStageMatch =
          //   selectStage === "All"
          //     ? true
          //     : isStageClassMatch.filter(
          //       (classFilter) => classFilter.id === filter.class_id
          //     ).length > 0
          //       ? true
          //       : false;
          const isClassMatch =
            selectClass === "All"
              ? true
              : !classFilter || Number(classFilter) === filter.class_id;
          const isStudentMatch =
            selectedId === "All"
              ? true
              : !studentFilter || Number(studentFilter) === filter.id;
          if (isSchoolMatch && isClassMatch && isStudentMatch) {
            filtered.push(filter);
          }
        });
      } else if (
        (userInfo.user_role === "Operations Excellence Lead" || userInfo.user_role === "ADMIN" ? selectSchool === "" : true) &&
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
      selectedSchool
    );
  }, [
    selectedStudent,
    students,
    selectedClass,
    selectedSchool,
    classes,
    userInfo
  ]);

  if (loading) return <LoadingScreen />;
  if (error?.status === 403) return <Navigate to="/login" state={{ from: location }} replace />;
  if (error) return <p>Error: {error.message}</p>;
  if (userInfo.user_role !== "Operations Excellence Lead" && userInfo.user_role !== "Teacher" && userInfo.user_role !== "Trainer" && userInfo.user_role !== "ADMIN") return <DenyAccessPage homePage='/watoms/pms' />;
  if (userInfo?.code === 1452) return <DenyAccessPage homePage='/watoms/dashboard' />;

  return (
    <div className="bg-formColor flex justify-center flex-wrap min-h-screen">
      <Toaster />
      <div className="flex justify-end w-full p-[5px] h-[6vh]">
        <button className="bg-wisdomOrange hover:bg-wisdomDarkOrange text-white text-center p-4 flex justify-center items-center rounded" onClick={returnPms}>رجوع &gt;</button>
      </div>
      <div className="w-full flex justify-center">
        <img
          className="md:w-[60%] w-full md:h-[30vh] h-fit"
          src={newLogo2}
          alt="company logo"
        ></img>
      </div>
      <div className="w-full text-center flex justify-center items-center">
        <h1 className="text-2xl font-bold">غياب المتدرب</h1>
      </div>
      <div className="flex flex-col justify-center items-center w-full mb-2">
        {userInfo.user_role === "" ?
          <>
            <label>:المركز</label>
            <select
              id="school"
              name="school"
              onChange={handleSchool}
              value={selectedSchool}
            >
              <option value="" disabled selected>
                الرجاء اختيار المركز
              </option>
              <option value="All">الكل</option>
              {schools.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </>
          : null}
        <label>:المجموعة</label>
        <select
          id="class"
          name="class"
          onChange={handleClass}
          value={selectedClass || ""}
        >
          <option value="" disabled selected>
            الرجاء اختيار المجموعة
          </option>
          <option value="All">الكل</option>
          {classes.map((singleClass) => (
            <option key={singleClass.id} value={singleClass.id}>
              {singleClass.name}
            </option>
          ))}
        </select>
        <label>:متدرب</label>
        <select
          id="student"
          name="student"
          onChange={handleStudent}
          value={selectedStudent || ""}
        >
          <option value="" disabled>
            الرجاء اختيار متدرب
          </option>
          <option value="All">الكل</option>
          {filteredStudents.map((student) => (
            <option key={student.id} value={student.id}>
              {`${student.first_name} ${student.middle_name} ${student.last_name}`}
            </option>
          ))}
        </select>
      </div>
      {selectedStudents.length > 0 ? (
        <form className="teacherSessions" onSubmit={submitStudentAttendance}>
          <div className="students">
            <div className="studentTitle">:الاسم</div>
            <div className="studentTitle">:الحالة</div>
            <div className="studentTitle">السبب (اختياري)</div>
          </div>
          {selectedStudents.map((student) => (
            <div className="students" key={student.id}>
              <div className="md:min-w-[200px] text-center flex justify-center items-center flex-col w-[30%]">
                <div className="">
                  {student.first_name} {student.middle_name} {student.last_name}
                </div>
              </div>
              <div className="flex justify-center items-center flex-col w-[30%]">
                <select
                  id={`absenceStatus-${student.id}`}
                  name={`absenceStatus-${student.id}`}
                  className="w-full"
                >
                  <option value="attend">حاضر</option>
                  <option value="absent">غائب</option>
                  <option value="late">متاخر</option>
                  <option value="left with parent">رحل</option>
                </select>
              </div>
              <div className="flex justify-center items-center flex-col w-[30%]">
                <input
                  id={`reasonInput ${student.id}`}
                  name={`reason-${student.id}`}
                  type="text"
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none transition-colors duration-200 w-full"
                />
              </div>
            </div>
          ))}
          <button className="TLBtn">ارسال</button>
        </form>
      ) : (
        <div className="noTeacher">لا يوجد بيانات حاليا</div>
      )}
    </div>
  );
}

export default TraineeAbsence;
