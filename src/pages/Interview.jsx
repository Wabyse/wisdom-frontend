import { useNavigate, Navigate, useLocation } from "react-router-dom";
import "../styles/Interview.css";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import { fetchAllTeachers, sendTeacherEvaluation } from "../services/pms";
import { useAuth } from "../context/AuthContext";
import ChangeLanguage from "../components/ChangeLanguage";
import { useLanguage } from "../context/LanguageContext";
import newLogo from "../assets/newLogo.jpg";
import LoadingScreen from "../components/LoadingScreen";
import DenyAccessPage from "../components/DenyAccessPage";
import { WISDOM_INTERVIEW_TITLES } from "../constants/constants";

function Interview() {
  const location = useLocation();
  const { language } = useLanguage();
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [interviewResultData, setInterviewResultData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userInfo } = useAuth();
  const navigate = useNavigate(); //for navigate to another page (component)

  const returnPms = () => {
    navigate("/pms");
  };

  const selectUserHandler = (e) => {
    setSelectedTeacher(e.target.value);
  };

  const changeInputResult = (index, value) => {
    const newData = [...interviewResultData];
    newData[index] = value;
    setInterviewResultData(newData);
  };

  const interviewResultHandler = async (e) => {
    e.preventDefault();
    if (!selectedTeacher || interviewResultData.length < 6) {
      return toast.error("please fill all required data");
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
      await sendTeacherEvaluation(updatedInterviewData);
      toast.success("data added");
    } catch (err) {
      toast.error("Please fill the data");
    }
  };

  useEffect(() => {
    const loadTeachers = async () => {
      try {
        const response = await fetchAllTeachers();
        let RelatedUsers;
        if (userInfo.user_role !== "Operations Excellence Lead") {
          RelatedUsers = response.filter(user => user.employee.organization_id === userInfo.organization_id);
        } else {
          RelatedUsers = response;
        }
        setTeachers(RelatedUsers);
      } catch (err) {
        console.error("API Error:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadTeachers();
  }, [userInfo]);

  if (loading) return <LoadingScreen />;
  if (error?.status === 403) return <Navigate to="/login" state={{ from: location }} replace />;
  if (error) return <p>Error: {error.message}</p>;
  if (userInfo.user_role !== "Academic Principle" && userInfo.user_role !== "Operations Excellence Lead") return <DenyAccessPage homePage='/pms' />;

  return (
    <div className="bg-formColor flex justify-center flex-wrap min-h-screen">
      <Toaster />
      <div
        className={`flex w-full p-[5px] h-[6vh] ${language ? "justify-start" : "justify-end"
          }`}
      >
        <button className="bg-wisdomOrange hover:bg-wisdomDarkOrange text-white p-2 rounded flex justify-center items-center" onClick={returnPms}>{language ? "< Return" : "رجوع >"}</button>
      </div>
      <div className="w-full flex justify-center">
        <img
          className="w-[60%] h-[30vh]"
          src={newLogo}
          alt="company logo"
        ></img>
      </div>
      <div className="w-full">
        <h1 className="text-2xl font-bold text-center">{language ? "Interview" : "مقابلات شخصية"}</h1>
      </div>
      {/* <div className="w-full text-center">
        <button>{language ? "AR" : "EN"}</button>
      </div> */}
      <ChangeLanguage className="LangBtn" />
      <div className="select w-full text-center">
        <div className="flex flex-col justify-center items-center w-[99%]">
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
          {WISDOM_INTERVIEW_TITLES.map((interviewResult, index) => (
            <div className="employeeSection">
              <div className="interviewResultTitle">{interviewResult}</div>
              <div id={index + 1} className="interviewResult">
                <input
                  type="number"
                  max="100"
                  min="0"
                  className="interviewResultInput border-black border-2"
                  value={interviewResultData[index] || ""}
                  key={index + 1}
                  onChange={(e) => changeInputResult(index, e.target.value)}
                />
              </div>
            </div>
          ))}
          <button className="bg-wisdomOrange hover:bg-wisdomDarkOrange text-white p-2 rounded h-[5vh] flex justify-center items-center my-auto">{language ? "Submit" : "ارسال"}</button>
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
