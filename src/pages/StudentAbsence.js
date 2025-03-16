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

function StudentAbsence() {
  const [language, setLanguage] = useState(true);
  const [students, setStudnets] = useState([]);
  const [classes, setClasses] = useState([]);
  const [stages, setStages] = useState([]);
  const [schools, setSchools] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSchool, setSelectedSchool] = useState("");
  const [selectedStage, setSelectedStage] = useState("");
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); //for navigate to another page (component)

  const returnPms = () => {
    navigate("/pms");
  };

  const changeLanguage = () => {
    setLanguage(!language);
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

  // const handleStage = (e) => {
  //   setSelectedStage(e.target.value);
  // };

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
        console.log(response);
        setStudnets(response);
      } catch (err) {
        console.error("API Error:", err);
        setError(
          err.message || "An error occurred while fetching students data."
        );
      } finally {
        setLoading(false);
      }
    };
    loadStudents();
  }, []);

  useEffect(() => {
    const loadClasses = async () => {
      try {
        const response = await fetchClasses();
        setClasses(response);
      } catch (err) {
        console.error("API Error:", err);
        setError(
          err.message || "An error occurred while fetching students data."
        );
      } finally {
        setLoading(false);
      }
    };
    loadClasses();
  }, []);

  useEffect(() => {
    const loadClasses = async () => {
      try {
        const response = await fetchStages();
        setStages(response);
      } catch (err) {
        console.error("API Error:", err);
        setError(
          err.message || "An error occurred while fetching students data."
        );
      } finally {
        setLoading(false);
      }
    };
    loadClasses();
  }, []);

  useEffect(() => {
    const loadClasses = async () => {
      try {
        const response = await fetchShools();
        setSchools(response);
      } catch (err) {
        console.error("API Error:", err);
        setError(
          err.message || "An error occurred while fetching students data."
        );
      } finally {
        setLoading(false);
      }
    };
    loadClasses();
  }, []);

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
      // let stageFilter = selectStage ? selectStage : null;
      let classFilter = selectClass ? selectClass : null;
      let studentFilter = selectedId ? selectedId : null;

      const hasFilter =
        (selectSchool !== "All" && selectSchool !== "") ||
        (selectStage !== "All" && selectStage !== "") ||
        (selectClass !== "All" && selectClass !== "") ||
        (selectedId !== "All" && selectedId !== "");

      if (hasFilter) {
        filteredStudents.forEach((filter) => {
          const isSchoolMatch =
            selectSchool === "All"
              ? true
              : !schoolFilter || Number(schoolFilter) === filter.school_id;
          // const isStageClassMatch = classes.filter(
          //   (classFilter) => classFilter.stage_id === Number(stageFilter)
          // );
          // const isStageMatch = isStageClassMatch.filter(
          //   (classFilter) => classFilter.id === filter.class_id
          // );
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="teacherLatnessForm">
      <Toaster />
      <div className={language ? "returnDiv" : "returnDiv-Ar"}>
        <button onClick={returnPms}>{language ? "< Return" : "رجوع >"}</button>
      </div>
      <div className="Div100">
        <img
          width="20%"
          src="http://pms.wabyse.com/wp-content/uploads/2024/10/cropped-cropped-WABYS-NEW-LOGO1.png"
          alt="company logo"
        ></img>
      </div>
      <div className="Div100">
        <button onClick={changeLanguage}>{language ? "AR" : "EN"}</button>
      </div>
      <div className="select Div100">
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
        {/* <label>{language ? "Grade:" : ":مرحلة"}</label>
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
        </select> */}
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
          <button className="TLBtn">{language ? "Submit" : "ارسال"}</button>
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
