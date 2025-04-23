import { useNavigate } from "react-router-dom";
import "../styles/Interview.css";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import { fetchAllTeachers, sendTeacherEvaluation } from "../services/pms";
import { useAuth } from "../context/AuthContext";
import newLogo2 from "../assets/newLogo2.jpg";
import LoadingScreen from "../components/LoadingScreen";
import DenyAccessPage from "../components/DenyAccessPage";

const interviewResults = [
  "عنوان 6",
  "عنوان 5",
  "عنوان 4",
  "عنوان 3",
  "عنوان 2",
  "عنوان 1",
];

function TomsInterview() {
  const [teachers, serTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [interviewResultData, setInterviewResultData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userInfo } = useAuth();
  const navigate = useNavigate(); //for navigate to another page (component)

  const returnPms = () => {
    navigate("/watoms/pms");
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
    console.log(updatedInterviewData);
  };

  useEffect(() => {
    const loadTeachers = async () => {
      try {
        const response = await fetchAllTeachers();
        const RelatedUsers = response.filter(user => user.employee.organization_id === userInfo.organization_id);
        serTeachers(RelatedUsers);
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
  }, [userInfo]);

  if (loading) return <LoadingScreen />;
  if (error) return <p>Error: {error}</p>;
  if (userInfo.user_role !== "Manager" && userInfo.user_role !== "Operations Excellence Lead") return <DenyAccessPage homePage='/watoms/pms' />;

  return (
    <div className="bg-formColor flex justify-center flex-wrap min-h-screen">
      <Toaster />
      <div className="flex justify-end w-full p-[5px] h-[6vh]">
        <button className="bg-wisdomOrange hover:bg-wisdomDarkOrange text-white p-2 rounded flex justify-center items-center" onClick={returnPms}>رجوع &gt;</button>
      </div>
      <div className="w-full flex justify-center">
      <img
        className="w-[60%] h-[30vh]"
        src={newLogo2}
        alt="company logo"
      ></img>
      </div>
      <div className="w-full">
        <h1 className="text-2xl font-bold text-center">مقابلات شخصية</h1>
      </div>
      <div className="flex flex-col justify-center items-center w-[100%]">
        <div className="flex flex-col">
          <label className="text-center font-bold">:المدرب</label>
          <select id="user" name="user" onChange={selectUserHandler}>
            <option value="" disabled selected>
              الرجاء اختيار مدرب
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
                  className="interviewResultInput border-black border-2"
                  value={interviewResultData[index] || ""}
                  key={index + 1}
                  onChange={(e) => changeInputResult(index, e.target.value)}
                />
              </div>
            </div>
          ))}
          <button className="bg-wisdomOrange hover:bg-wisdomDarkOrange text-white p-2 rounded h-[5vh] flex justify-center items-center my-auto">ارسال</button>
        </form>
      ) : (
        <div className="noTeacher">لا يوجد بيانات حاليا</div>
      )}
    </div>
  );
}

export default TomsInterview;
