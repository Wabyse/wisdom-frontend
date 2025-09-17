import { useNavigate, Navigate, useLocation } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import { fetchAllTeachers, sendTeacherEvaluation } from "../services/pms";
import { useAuth } from "../context/AuthContext";
import ChangeLanguage from "../components/ChangeLanguage";
import { useLanguage } from "../context/LanguageContext";
import newLogo from "../assets/newLogo.jpg";
import LoadingScreen from "../components/LoadingScreen";
import DenyAccessPage from "../components/DenyAccessPage";
import { WISDOM_TEST_AR_TITLES, WISDOM_TEST_EN_TITLES } from "../constants/constants";
import { fetchSchools } from "../services/data";
import Selector2 from "../components/Selector2";

function Test() {
  const location = useLocation();
  const { language } = useLanguage();
  const [teachers, serTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [schools, setSchools] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState("");
  const [testResultData, setTestResultData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userInfo } = useAuth();
  const navigate = useNavigate(); //for navigate to another page (component)

  const testTitles = language ? WISDOM_TEST_EN_TITLES : WISDOM_TEST_AR_TITLES

  const returnPms = () => {
    navigate("/pms");
  };

  const selectUserHandler = (e) => {
    setSelectedTeacher(e.target.value);
  };

  const selectSchoolHandler = (e) => {
    const FilteringTeachers = teachers.filter(teacher => Number(e.target.value) === teacher.employee.organization_id)
    setFilteredTeachers(FilteringTeachers)
    setSelectedSchool(e.target.value);
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
      navigate('/pms');
    } catch (err) {
      toast.error("Please fill the data");
    }
  };

  useEffect(() => {
    const loadSchools = async () => {
      try {
        let response;
        if (userInfo.user_role === "Operations Excellence Lead") response = await fetchSchools();
        setSchools(response);
      } catch (err) {
        console.error("API Error:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    loadSchools();

    const loadTeachers = async () => {
      try {
        const response = await fetchAllTeachers();
        let RelatedUsers;
        if (userInfo.user_role !== "Operations Excellence Lead") {
          RelatedUsers = response.filter(user => user.employee.organization_id === userInfo.organization_id);
        } else {
          RelatedUsers = response;
        }
        serTeachers(RelatedUsers);
        setFilteredTeachers(RelatedUsers);
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
  if (userInfo.user_role !== "Operations Excellence Lead" && userInfo.user_role !== "Teacher") return <DenyAccessPage homePage='/pms' />;
  if (userInfo?.code === 1452) return <DenyAccessPage homePage='/watoms/dashboard' />;

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
          className="md:w-[60%] w-full md:h-[30vh] h-[20vh]"
          src={newLogo}
          alt="company logo"
        ></img>
      </div>
      <div className="w-full">
        <h1 className="text-2xl font-bold text-center">{language ? "Test" : "اختبار تربوي"}</h1>
      </div>
      <ChangeLanguage className="h-[5vh]" />
      <div className="w-full text-center">
        {userInfo.user_role === "Operations Excellence Lead" && <Selector2
          label="school"
          title={language ? "School:" : ":مدرسة"}
          description={language ? "Please Select a School" : "الرجاء اختيار مدرسة"}
          data={schools}
          value={selectedSchool}
          onChange={selectSchoolHandler}
          name="name"
          extraCSS="w-full"
        />}
        <Selector2
          label="user"
          title={language ? "Teacher:" : ":معلم"}
          description={language ? "Please Select a Teacher" : "الرجاء اختيار معلم"}
          data={filteredTeachers}
          value={selectedTeacher}
          onChange={selectUserHandler}
          name="user"
          extraCSS="w-full"
          optionValue="user"
        />
      </div>
      {selectedTeacher ? (
        <form
          className="md:bg-white w-[80%] md:p-[10px] md:rounded-[5px] md:shadow-[0_4px_10px_rgba(0,0,0,0.1)] md:self-start self-center h-auto flex flex-col mt-2"
          onSubmit={testResultHandler}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
            {testTitles.map((testResult, index) => (
              <div
                key={index}
                className="flex flex-col justify-between items-center h-28 w-full"
              >
                <div className="text-center font-bold mb-[5px] text-xl">{testResult}</div>
                <div
                  id={index + 1}
                  className="w-full bg-white md:bg-transparent md:shadow-none shadow-[0_4px_10px_rgba(0,0,0,0.1)] rounded-[5px] p-2 flex items-end justify-center"
                >
                  <input
                    type="number"
                    max="100"
                    min="0"
                    className="px-[5%] py-[1%] rounded-[5px] w-50% text-center text-lg font-bold border-black border-2"
                    value={testResultData[index] || ""}
                    onChange={(e) => changeInputResult(index, e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
          <button className="bg-wisdomOrange hover:bg-wisdomDarkOrange text-white p-2 rounded h-[5vh] flex justify-center items-center mx-auto mt-4">{language ? "Submit" : "ارسال"}</button>
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
