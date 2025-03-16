import { useNavigate } from "react-router-dom";
import "../styles/Interview.css";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import { fetchAllTeachers, sendTeacherEvaluation } from "../services/pms";
import { useAuth } from "../context/AuthContext";

const interviewResults = [
  "Title 1",
  "Title 2",
  "Title 3",
  "Title 4",
  "Title 5",
  "Title 6",
];

function Interview() {
  const [language, setLanguage] = useState(true);
  const [teachers, serTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [interviewResultData, setInterviewResultData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userInfo } = useAuth();
  const navigate = useNavigate(); //for navigate to another page (component)

  const returnPms = () => {
    navigate("/pms");
  };

  const changeLanguage = () => {
    setLanguage(!language);
  };

  const selectUserHandler = (e) => {
    setSelectedTeacher(e.target.value);
  };

  const changeInputResult = (index, value) => {
    const newData = [...interviewResultData];
    newData[index] = value;
    setInterviewResultData(newData);
  };

  const interviewResultHandler = async(e) => {
    e.preventDefault();
    if (!selectedTeacher || interviewResultData.length < 6) {
      return toast.error('please fill all required data');
    }
    const updatedInterviewData = {
      type: "interview",
      teacher_id: Number(selectedTeacher),
      employee_id: userInfo.id,
      first_result: Number(interviewResultData[0]),
      second_result: Number(interviewResultData[1]),
      third_result: Number(interviewResultData[2]),
      fourth_result: Number(interviewResultData[3]),
      fifth_result: Number(interviewResultData[4]),
      sixth_result: Number(interviewResultData[5]),
    };
    try {
      await sendTeacherEvaluation(updatedInterviewData)
      toast.success("data added");
    } catch (err) {
      toast.error("Please fill the data");
    }
    console.log(updatedInterviewData);
  };

  useEffect(() => {
    const loadTeachers = async () => {
      try {
        const response = await fetchAllTeachers();
        serTeachers(response);
      } catch (err) {
        console.error("API Error:", err);
        setError(
          err.message || "An error occurred while fetching teachers data."
        );
      } finally {
        setLoading(false);
      }
    };

    loadTeachers();
  }, []);

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
        <div className="select">
          <label>{language ? "Teacher:" : ":معلم"}</label>
          <select id="user" name="user" onChange={selectUserHandler}>
            <option value="" disabled selected>
              {language ? "Please Select a Teacher" : "الرجاء اختيار معلم"}
            </option>
            {teachers.map((teacher) => (
              <option
                key={teacher.id}
                value={teacher.id}
              >{`${teacher.employee?.first_name} ${teacher.employee?.middle_name} ${teacher.employee?.last_name}`}</option>
            ))}
          </select>
        </div>
      </div>
      {selectedTeacher ? (
        <form
          className="teacherSessions EmpScore"
          onSubmit={interviewResultHandler}
        >
          {interviewResults.map((interviewResult, index) => (
            <div className="employeeSection">
              <div className="interviewResultTitle">{interviewResult}</div>
              <div id={index + 1} className="interviewResult">
                <input
                  type="number"
                  max="100"
                  min="0"
                  className="interviewResultInput"
                  value={interviewResultData[index] || ""}
                  key={index + 1}
                  onChange={(e) => changeInputResult(index, e.target.value)}
                />
              </div>
            </div>
          ))}
          <button className="InBtn">{language ? "Submit" : "ارسال"}</button>
        </form>
      ) : (
        <div className="noTeacher">
          {language ? "No Data Available" : "لا يوجد بيانات حاليا"}
        </div>
      )}
    </div>
  );
}

export default Interview;
