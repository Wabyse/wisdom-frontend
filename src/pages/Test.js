import { useNavigate } from "react-router-dom";
import "../styles/Test.css";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import { fetchAllTeachers, sendTeacherEvaluation } from "../services/pms";
import { useAuth } from "../context/AuthContext";
import ChangeLanguage from "../components/ChangeLanguage";
import { useLanguage } from "../context/LanguageContext";
import newLogo from "../assets/newLogo.jpg";

const testResults = [
  "Title 1",
  "Title 2",
  "Title 3",
  "Title 4",
  "Title 5",
  "Title 6",
];

function Test() {
  const { language } = useLanguage();
  const [teachers, serTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [testResultData, setTestResultData] = useState([]);
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
    const newData = [...testResultData];
    newData[index] = value;
    setTestResultData(newData);
  };

  const testResultHandler = async (e) => {
    e.preventDefault();
    if (!selectedTeacher || testResultData.length < 6) {
      return toast.error("please fill all required data");
    }
    const updatedTestData = {
      type: "test",
      teacher_id: Number(selectedTeacher),
      employee_id: userInfo.id,
      first_result: Number(testResultData[0]),
      second_result: Number(testResultData[1]),
      third_result: Number(testResultData[2]),
      fourth_result: Number(testResultData[3]),
      fifth_result: Number(testResultData[4]),
      sixth_result: Number(testResultData[5]),
    };
    try {
      await sendTeacherEvaluation(updatedTestData);
      toast.success("data added");
    } catch (err) {
      toast.error("Please fill the data");
    }
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
    <div className="bg-formColor flex justify-center flex-wrap min-h-screen">
      <Toaster />
      <div
        className={`flex w-full p-[5px] h-[6vh] ${
          language ? "justify-start" : "justify-end"
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
        <h1 className="text-2xl font-bold text-center">{language ? "Test" : "إختبار تربوي"}</h1>
      </div>
      <ChangeLanguage />
      <div className="select Div100">
        <div  className="flex flex-col justify-center items-center w-[99%]">
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
        <form className="teacherSessions EmpScore" onSubmit={testResultHandler}>
          {testResults.map((interviewResult, index) => (
            <div className="employeeSection">
              <div className="interviewResultTitle">{interviewResult}</div>
              <div id={index + 1} className="interviewResult">
                <input
                  type="number"
                  max="100"
                  min="0"
                  className="interviewResultInput border-black border-2"
                  value={testResultData[index] || ""}
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

export default Test;
