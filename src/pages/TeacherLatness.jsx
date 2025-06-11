import { useNavigate, Navigate, useLocation } from "react-router-dom";
import "../styles/TeacherLatness.css";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import newLogo from "../assets/newLogo.jpg";
import {
  fetchAllTeachers,
  fetchTeacherInfo,
  sendTeacherLatness,
} from "../services/pms";
import ChangeLanguage from "../components/ChangeLanguage";
import { useLanguage } from "../context/LanguageContext";
import LoadingScreen from "../components/LoadingScreen";
import DenyAccessPage from "../components/DenyAccessPage";
import { TEACHER_LATENESS_ARABIC_TITLES, TEACHER_LATENESS_ENGLISH_TITLES, WISDOM_LATNESS_OPTIONS } from "../constants/constants";

function TeacherLatness() {
  const location = useLocation();
  const { language } = useLanguage();
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userInfo } = useAuth();
  const navigate = useNavigate(); //for navigate to another page (component)

  const returnPms = () => {
    navigate("/pms");
  };

  const handleTeacher = (e) => {
    if (e.target.value !== "") {
      setSelectedUser(e.target.value);
    }
  };

  useEffect(() => {
    const loadUTeachers = async () => {
      try {
        const response = await fetchAllTeachers();
        const filteredTeachers = response.filter(
          (teacher) => teacher.id !== userInfo.id
        );
        const RelatedUsers = filteredTeachers.filter(user => userInfo.user_role === "Operations Excellence Lead" ? true : user.employee.organization_id === userInfo.organization_id);
        setTeachers(RelatedUsers);
      } catch (err) {
        console.error("API Error:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadUTeachers();
  }, [userInfo]);

  useEffect(() => {
    const loadTeacher = async () => {
      try {
        const teacherData = {
          id: Number(selectedUserId?.id),
        };
        const response = await fetchTeacherInfo(teacherData);
        setTeacher(response);
      } catch (err) {
        console.error("API Error:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadTeacher();
  }, [selectedUserId]);

  const submitLatness = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const entries = Array.from(formData.entries());

    const latness = [];

    for (let [name, value] of entries) {
      if (name.includes(" ")) {
        const [classId] = name.split(" ");
        latness.push({
          teacher_id: Number(selectedUser),
          session_id: parseInt(classId),
          late: Number(value),
        });
      }
    }
    try {
      await sendTeacherLatness(latness);
      toast.success("Done");
      navigate("/pms");
    } catch (err) {
      toast.error("Please fill the data");
      // console.error("Error submitting data:", err);
    }
  };

  if (loading) return <LoadingScreen />;
  if (error?.status === 403) return <Navigate to="/login" state={{ from: location }} replace />;
  if (error) return <p>Error: {error.message}</p>;
  if (userInfo.user_role !== "Operations Excellence Lead" && userInfo.user_role !== "Supervisor") return <DenyAccessPage homePage='/pms' />;

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
          {language ? "Teacher Latness" : "تاخير المعلم"}
        </h1>
      </div>
      <ChangeLanguage />
      <div className="flex flex-col justify-center items-center w-[99%]">
        <label>{language ? "Teacher:" : ":المعلم"}</label>
        <select id="teacher" name="teacher" onChange={e => setSelectedUserId(teachers.find(t => t.employee?.id === Number(e.target.value)))} onClick={handleTeacher}>
          <option value="" disabled selected>
            {language ? "Please Select a Teacher" : "الرجاء اختيار المعلم"}
          </option>
          {teachers.map((teacher) => (
            <option
              key={teacher.employee?.id}
              value={teacher.employee?.id}
            >{`${teacher.employee?.first_name} ${teacher.employee?.middle_name} ${teacher.employee?.last_name}`}</option>
          ))}
        </select>
      </div>
      {selectedUser !== null ? (
        <form className="teacherSessions" onSubmit={submitLatness}>
          <div className="TLTitle">
            {(language ? TEACHER_LATENESS_ENGLISH_TITLES : TEACHER_LATENESS_ARABIC_TITLES).map((title, index) => (
              <div className="TLTitleContent" key={index}>
                {title}
              </div>
            ))}
          </div>
          {teacher?.employee?.teacher?.sessions?.map((classes, index) => (
            <div className="TLTitle" key={`${classes.id}-${index}`}>
              <div className="TLContent">{classes.class.name}</div>
              {[...Array(10)].map((_, sessionIndex) => (
                <div className="TLContent" key={sessionIndex}>
                  <select
                    className="TLSelect"
                    name={`${classes.id} ${sessionIndex + 1}`}
                  >
                    <option value="" disabled selected>
                      {language ? "On Time" : "في الموعد"}
                    </option>
                    {WISDOM_LATNESS_OPTIONS.map((min) => (
                      <option key={min} value={min}>
                        {min} min.
                      </option>
                    ))}
                  </select>
                </div>
              ))}

            </div>
          ))}
          <div className="flex justify-center items-center w-full">
            <button className="bg-wisdomOrange hover:bg-wisdomDarkOrange text-white rounded p-2 flex self-center items-center">
              {language ? "Submit" : "ارسال"}
            </button>
          </div>
        </form>
      ) : (
        <div className="noTeacher">Please Select a Teacher</div>
      )}
    </div>
  );
}

export default TeacherLatness;
