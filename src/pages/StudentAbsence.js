import { useNavigate } from "react-router-dom";
import "../styles/StudentAbsence.css";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import {
  fetchClasses,
  fetchShools,
  fetchStages,
  fetchStudents,
} from "../services/data";
import { sendStudentAttendance } from "../services/pms";
import ChangeLanguage from "../components/ChangeLanguage";
import { useLanguage } from "../context/LanguageContext";
import newLogo from "../assets/newLogo.jpg";
import wabys from "../assets/wabys.png";
import { useAuth } from "../context/AuthContext";
import style from "../styles/Loading.module.css";

function StudentAbsence() {
  const { language } = useLanguage();
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
      toast.success("submitted");
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
        setError(
          err.message || "An error occurred while fetching students data."
        );
      }
    };

    const loadClasses = async () => {
      try {
        const response = await fetchClasses();
        setClasses(response);
        setUnfilteredClasses(response);
      } catch (err) {
        console.error("API Error:", err);
        setError(
          err.message || "An error occurred while fetching students data."
        );
      }
    };

    const loadStages = async () => {
      try {
        const response = await fetchStages();
        setStages(response);
      } catch (err) {
        console.error("API Error:", err);
        setError(
          err.message || "An error occurred while fetching students data."
        );
      }
    };

    const loadSchools = async () => {
      try {
        const response = await fetchShools();
        console.log(response);
        setSchools(response);
      } catch (err) {
        console.error("API Error:", err);
        setError(
          err.message || "An error occurred while fetching students data."
        );
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
        if (selectedStage !== "All") {
          const filter = unfilteredClasses.filter(
            (filterClass) => filterClass.stage_id === Number(selectedStage)
          );
          setClasses(filter);
        } else {
          setClasses(unfilteredClasses);
        }
      } catch (err) {
        console.error("API Error:", err);
        setError(
          err.message || "An error occurred while fetching students data."
        );
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
        (selectSchool !== "All" && selectSchool !== "") ||
        (selectStage !== "All" && selectStage !== "") ||
        (selectClass !== "All" && selectClass !== "") ||
        (selectedId !== "All" && selectedId !== "");

      const isStageClassMatch = classes.filter(
        (classFilter) => classFilter.stage_id === Number(stageFilter)
      );

      if (hasFilter) {
        filteredStudents.forEach((filter) => {
          const isSchoolMatch =
            selectSchool === "All"
              ? true
              : !schoolFilter || Number(schoolFilter) === filter.school_id;

          const isStageMatch =
            selectStage === "All"
              ? true
              : isStageClassMatch.filter(
                  (classFilter) => classFilter.id === filter.class_id
                ).length > 0
              ? true
              : false;
          const isClassMatch =
            selectClass === "All"
              ? true
              : !classFilter || Number(classFilter) === filter.class_id;
          const isStudentMatch =
            selectedId === "All"
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

  if (loading)
    return (
      <div className="bg-formColor w-full h-screen flex justify-center items-center">
        <div className="relative w-[25%] aspect-[4/1]">
          {" "}
          <div
            className={`w-full h-full ${style["animated-mask"]}`}
            style={{
              WebkitMaskImage: `url(${wabys})`,
              maskImage: `url(${wabys})`,
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
              WebkitMaskSize: "contain",
              maskSize: "contain",
              WebkitMaskPosition: "center",
              maskPosition: "center",
            }}
          />
        </div>
      </div>
    );
  if (error) return <p>Error: {error}</p>;
  if (userInfo.user_role !== "Operations Excellence Lead" && userInfo.user_role !== "Supervisor") {
    return (
      <>
        <div className="bg-formColor w-full h-screen flex flex-col justify-center items-center">
          <img
            className="w-[25%]"
            src={wabys}
            alt=""
          />
          <h1 className="text-8xl font-bold">401</h1>
          <h1 className="text-5xl text-center text-watomsBlue">You are not authorized to view this page.</h1>
          <h1 className="text-5xl text-center text-watomsBlue">Please contact your administrator if you believe this is an error.</h1>
          <button className="bg-wisdomOrange hover:bg-wisdomDarkOrange text-white rounded p-2 m-4" onClick={() => navigate('/pms')}>Go Back</button>
        </div>
      </>
    )
  }

  return (
    <div className="bg-formColor flex justify-center flex-wrap min-h-screen">
      <Toaster />
      <div
        className={`flex w-full p-[5px] h-[6vh] ${
          language ? "justify-start" : "justify-end"
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
      <div className="flex flex-col justify-center items-center w-[99%] mb-2">
        <label>{language ? "School:" : ":مدرسة"}</label>
        <select
          id="school"
          name="school"
          onChange={handleSchool}
          value={selectedSchool}
        >
          <option value="" disabled selected>
            {language ? "Please Select a school" : "الرجاء اختيار مدرسة"}
          </option>
          <option value="All">{language ? "All" : "الكل"}</option>
          {schools.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
        <label>{language ? "Grade:" : ":مرحلة"}</label>
        <select
          id="grade"
          name="grade"
          onChange={handleStage}
          value={selectedStage}
        >
          <option value="" disabled selected>
            {language ? "Please Select a grade" : "الرجاء اختيار مرحلة"}
          </option>
          <option value="All">{language ? "All" : "الكل"}</option>
          {stages.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
        <label>{language ? "Class:" : ":فصل"}</label>
        <select
          id="class"
          name="class"
          onChange={handleClass}
          value={selectedClass || ""}
        >
          <option value="" disabled selected>
            {language ? "Please Select a class" : "الرجاء اختيار فصل"}
          </option>
          <option value="All">{language ? "All" : "الكل"}</option>
          {classes.map((singleClass) => (
            <option key={singleClass.id} value={singleClass.id}>
              {singleClass.name}
            </option>
          ))}
        </select>
        <label>{language ? "Student:" : ":طالب"}</label>
        <select
          id="student"
          name="student"
          onChange={handleStudent}
          value={selectedStudent || ""}
        >
          <option value="" disabled>
            {language ? "Please Select a student" : "الرجاء اختيار طالب"}
          </option>
          <option value="All">{language ? "All" : "الكل"}</option>
          {students.map((student) => (
            <option key={student.id} value={student.id}>
              {`${student.first_name} ${student.middle_name} ${student.last_name}`}
            </option>
          ))}
        </select>
      </div>
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
    </div>
  );
}

export default StudentAbsence;
