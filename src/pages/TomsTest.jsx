import { useNavigate, Navigate, useLocation } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import { fetchAllTeachers, sendTeacherEvaluation } from "../services/pms";
import { useAuth } from "../context/AuthContext";
import newLogo2 from "../assets/newLogo2.jpg";
import LoadingScreen from "../components/LoadingScreen";
import DenyAccessPage from "../components/DenyAccessPage";
import { WATOMS_TEST_TITLES } from "../constants/constants";
import Selector2 from "../components/Selector2";
import { fetchSchools } from "../services/data";

function TomsTest() {
  const location = useLocation();
  const [trainers, serTrainers] = useState([]);
  const [filteredTrainers, setFilteredTrainers] = useState([]);
  const [selectedTrainer, setSelectedTrainer] = useState("");
  const [institutions, setInstitutions] = useState([]);
  const [selectedInstitution, setSelectedInstitution] = useState("");
  const [testResultData, setTestResultData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userInfo } = useAuth();
  const navigate = useNavigate(); //for navigate to another page (component)

  const returnPms = () => {
    navigate("/watoms/pms");
  };

  const selectUserHandler = (e) => {
    setSelectedTrainer(e.target.value);
  };

  const selectInstitutionHandler = (e) => {
    const FilteringTrainers = trainers.filter(trainer => Number(e.target.value) === trainer.employee.organization_id)
    setFilteredTrainers(FilteringTrainers)
    setSelectedInstitution(e.target.value);
  };

  const changeInputResult = (index, value) => {
    const newData = [...testResultData];
    newData[index] = value;
    setTestResultData(newData);
  };

  const testResultHandler = async (e) => {
    e.preventDefault();
    if (!selectedTrainer || testResultData.length < 6) {
      return toast.error("please fill all required data");
    }
    const updatedTestData = {
      type: "test",
      teacher_id: Number(selectedTrainer),
      employee_id: userInfo.employee_id,
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
      navigate('/watoms/pms')
    } catch (err) {
      toast.error("Please fill the data");
    }
  };

  useEffect(() => {
    const loadInstitutions = async () => {
      try {
        let response;
        if (userInfo.user_role === "Operations Excellence Lead") response = await fetchSchools();
        setInstitutions(response);
      } catch (err) {
        console.error("API Error:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    loadInstitutions();

    const loadTrainers = async () => {
      try {
        const response = await fetchAllTeachers();
        let RelatedUsers;
        if (userInfo.user_role !== "Operations Excellence Lead") {
          RelatedUsers = response.filter(user => user.employee.organization_id === userInfo.organization_id);
        } else {
          RelatedUsers = response;
        }
        serTrainers(RelatedUsers);
        setFilteredTrainers(RelatedUsers);
      } catch (err) {
        console.error("API Error:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadTrainers();
  }, [userInfo]);

  if (loading) return <LoadingScreen />;
  if (error?.status === 403) return <Navigate to="/login" state={{ from: location }} replace />;
  if (error) return <p>Error: {error.message}</p>;
  if (userInfo.user_role !== "Teacher" && userInfo.user_role !== "Operations Excellence Lead") return <DenyAccessPage homePage='/watoms/pms' />;

  return (
    <div className="bg-formColor flex justify-center flex-wrap min-h-screen">
      <Toaster />
      <div className="flex justify-end w-full p-[5px] h-[6vh]">
        <button className="bg-wisdomOrange hover:bg-wisdomDarkOrange text-white p-2 rounded flex justify-center items-center" onClick={returnPms}>رجوع &gt;</button>
      </div>
      <div className="w-full flex justify-center">
        <img
          className="md:w-[60%] w-full md:h-[30vh] h-fit"
          src={newLogo2}
          alt="company logo"
        ></img>
      </div>
      <div className="w-full">
        <h1 className="text-2xl font-bold text-center">ملاحظة جلسة تدريبية</h1>
      </div>
      <div className="flex flex-col justify-center items-center w-[100%]">
        {userInfo.user_role === "Operations Excellence Lead" && <Selector2
          label="institution"
          title=":المركز"
          description="الرجاء اختيار مركز"
          data={institutions}
          value={selectedInstitution}
          onChange={selectInstitutionHandler}
          name="name"
          extraCSS="w-full"
        />}
        <Selector2
          label="user"
          title=":المدرب"
          description="الرجاء اختيار مدرب"
          data={filteredTrainers}
          value={selectedTrainer}
          onChange={selectUserHandler}
          name="user"
          optionValue="user"
          extraCSS="w-full"
        />
        {/* <div className="flex flex-col">
          <label className="text-center font-bold">:مدرب</label>
          <select id="user" name="user" className="text-right" onChange={selectUserHandler}>
            <option value="" disabled selected>
              الرجاء اختيار مدرب
            </option>
            {teachers.map((teacher) => (
              <option
                key={teacher.employee.teacher.id}
                value={teacher.employee.teacher.id}
              >{`${teacher.employee?.first_name} ${teacher.employee?.middle_name} ${teacher.employee?.last_name}`}</option>
            ))}
          </select>
        </div> */}
      </div>
      {selectedTrainer ? (
        <form className="teacherSessions flex justify-evenly flex-row" onSubmit={testResultHandler}>
          {WATOMS_TEST_TITLES.map((interviewResult, index) => (
            <div className="employeeSection">
              <div className="interviewResultTitle">{interviewResult}</div>
              <div id={index + 1} className="w-[50%] m-auto">
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
          <button className="bg-wisdomOrange hover:bg-wisdomDarkOrange text-white p-2 rounded h-[5vh] flex justify-center items-center my-auto">ارسال</button>
        </form>
      ) : (
        <div className="noTeacher">لا يوجد بيانات حاليا</div>
      )}
    </div>
  );
}

export default TomsTest;
