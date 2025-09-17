import { useNavigate, Navigate, useLocation } from "react-router-dom";
import "../styles/TeacherSubstitutions.css";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  fetchAllTeachers,
  fetchTeacherInfo,
  sendSubstitutions,
} from "../services/pms";
import ChangeLanguage from "../components/ChangeLanguage";
import { useLanguage } from "../context/LanguageContext";
import newLogo from "../assets/newLogo.jpg";
import LoadingScreen from "../components/LoadingScreen";
import DenyAccessPage from "../components/DenyAccessPage";

function TeacherSubstitutions() {
  const location = useLocation();
  const { language } = useLanguage();
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [substitute, setsubstitute] = useState({});
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

  const addSubstitute = (index) => {
    setsubstitute((prev) => ({ ...prev, [index]: !substitute[index] }));
  };

  useEffect(() => {
    const loadUTeachers = async () => {
      try {
        const response = await fetchAllTeachers();
        const filteredTeachers = response.filter(
          (teacher) => teacher.id !== userInfo.id
        );
        let RelatedUsers;
        if (userInfo.user_role !== "Operations Excellence Lead") {
          RelatedUsers = filteredTeachers.filter(user => user.employee.organization_id === userInfo.organization_id);
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

  const submitSubstitutions = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const entries = Array.from(formData.entries());

    const substitutions = [];

    for (let [name, value] of entries) {
      if (name.includes(" ")) {
        const [classId] = name.split(" ");
        substitutions.push({
          substitute_id: Number(selectedUser),
          session_id: parseInt(classId),
          replacement_id: Number(value),
        });
      }
    }
    try {
      await sendSubstitutions(substitutions);
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
  if (userInfo?.code === 1452) return <DenyAccessPage homePage='/watoms/dashboard' />;

  return (
    <div className="bg-formColor flex justify-center flex-wrap min-h-screen">
      <Toaster />
      <div className={`flex w-full p-[5px] h-[6vh] ${language ? "justify-start" : "justify-end"}`}>
        <button className="bg-wisdomOrange hover:bg-wisdomDarkOrange text-white rounded p-2 flex justify-center items-center" onClick={returnPms}>{language ? "< Return" : "رجوع >"}</button>
      </div>
      <div className="w-full flex justify-center">
        <img
          className="w-[60%] h-[30vh]"
          src={newLogo}
          alt="company logo"
        ></img>
      </div>
      <div className="w-full">
        <h1 className="text-2xl font-bold text-center">{language ? "Teacher Substitution" : "الاحتياطي"}</h1>
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
              value={teacher.employee?.id}
            >{`${teacher.employee?.first_name} ${teacher.employee?.middle_name} ${teacher.employee?.last_name}`}</option>
          ))}
        </select>
      </div>
      {selectedUser !== null ? (
        <form onSubmit={submitSubstitutions} className="teacherSessions">
          <div className="TSTitle">
            <div className="TSTitleContent">Class</div>
            <div className="TSTitleContent">Session 1</div>
            <div className="TSTitleContent">Session 2</div>
            <div className="TSTitleContent">Session 3</div>
            <div className="TSTitleContent">Session 4</div>
            <div className="TSTitleContent">Session 5</div>
            <div className="TSTitleContent">Session 6</div>
            <div className="TSTitleContent">Session 7</div>
            <div className="TSTitleContent">Session 8</div>
            <div className="TSTitleContent">Session 9</div>
            <div className="TSTitleContent">Session 10</div>
          </div>
          {teacher?.employee?.teacher?.sessions?.map((classes, index) => (
            <div className="TSTitle">
              <div className="TSContent">{classes.class.name}</div>
              <div className="TSContent">
                <input
                  type="checkbox"
                  id={`${classes.id} 1`}
                  value=""
                  onChange={() => addSubstitute(`${classes.id} 1`)}
                ></input>
                {substitute[`${classes.id} 1`] ? (
                  <select
                    className="TSSelect"
                    id="teacher"
                    name={`${classes.id} 1`}
                  >
                    <option value="" disabled selected>
                      {language
                        ? "Please Select a Teacher"
                        : "الرجاء اختيار المعلم"}
                    </option>
                    {teachers.map((teacher) => (
                      <option
                        key={teacher.employee?.id}
                        value={teacher.employee?.id}
                      >{`${teacher.employee?.first_name} ${teacher.employee?.middle_name} ${teacher.employee?.last_name}`}</option>
                    ))}
                  </select>
                ) : (
                  <></>
                )}
              </div>
              <div className="TSContent">
                <input
                  type="checkbox"
                  id={`${classes.id} 2`}
                  value=""
                  onChange={() => addSubstitute(`${classes.id} 2`)}
                ></input>
                {substitute[`${classes.id} 2`] ? (
                  <select
                    className="TSSelect"
                    id="teacher"
                    name={`${classes.id} 2`}
                  >
                    <option value="" disabled selected>
                      {language
                        ? "Please Select a Teacher"
                        : "الرجاء اختيار المعلم"}
                    </option>
                    {teachers.map((teacher) => (
                      <option
                        key={teacher.employee?.id}
                        value={teacher.employee?.id}
                      >{`${teacher.employee?.first_name} ${teacher.employee?.middle_name} ${teacher.employee?.last_name}`}</option>
                    ))}
                  </select>
                ) : (
                  <></>
                )}
              </div>
              <div className="TSContent">
                <input
                  type="checkbox"
                  id={`${classes.id} 3`}
                  value=""
                  onChange={() => addSubstitute(`${classes.id} 3`)}
                ></input>
                {substitute[`${classes.id} 3`] ? (
                  <select
                    className="TSSelect"
                    id="teacher"
                    name={`${classes.id} 3`}
                  >
                    <option value="" disabled selected>
                      {language
                        ? "Please Select a Teacher"
                        : "الرجاء اختيار المعلم"}
                    </option>
                    {teachers.map((teacher) => (
                      <option
                        key={teacher.employee?.id}
                        value={teacher.employee?.id}
                      >{`${teacher.employee?.first_name} ${teacher.employee?.middle_name} ${teacher.employee?.last_name}`}</option>
                    ))}
                  </select>
                ) : (
                  <></>
                )}
              </div>
              <div className="TSContent">
                <input
                  type="checkbox"
                  id={`${classes.id} 4`}
                  value=""
                  onChange={() => addSubstitute(`${classes.id} 4`)}
                ></input>
                {substitute[`${classes.id} 4`] ? (
                  <select
                    className="TSSelect"
                    id="teacher"
                    name={`${classes.id} 4`}
                  >
                    <option value="" disabled selected>
                      {language
                        ? "Please Select a Teacher"
                        : "الرجاء اختيار المعلم"}
                    </option>
                    {teachers.map((teacher) => (
                      <option
                        key={teacher.employee?.id}
                        value={teacher.employee?.id}
                      >{`${teacher.employee?.first_name} ${teacher.employee?.middle_name} ${teacher.employee?.last_name}`}</option>
                    ))}
                  </select>
                ) : (
                  <></>
                )}
              </div>
              <div className="TSContent">
                <input
                  type="checkbox"
                  id={`${classes.id} 5`}
                  value=""
                  onChange={() => addSubstitute(`${classes.id} 5`)}
                ></input>
                {substitute[`${classes.id} 5`] ? (
                  <select
                    className="TSSelect"
                    id="teacher"
                    name={`${classes.id} 5`}
                  >
                    <option value="" disabled selected>
                      {language
                        ? "Please Select a Teacher"
                        : "الرجاء اختيار المعلم"}
                    </option>
                    {teachers.map((teacher) => (
                      <option
                        key={teacher.employee?.id}
                        value={teacher.employee?.id}
                      >{`${teacher.employee?.first_name} ${teacher.employee?.middle_name} ${teacher.employee?.last_name}`}</option>
                    ))}
                  </select>
                ) : (
                  <></>
                )}
              </div>
              <div className="TSContent">
                <input
                  type="checkbox"
                  id={`${classes.id} 6`}
                  value=""
                  onChange={() => addSubstitute(`${classes.id} 6`)}
                ></input>
                {substitute[`${classes.id} 6`] ? (
                  <select
                    className="TSSelect"
                    id="teacher"
                    name={`${classes.id} 6`}
                  >
                    <option value="" disabled selected>
                      {language
                        ? "Please Select a Teacher"
                        : "الرجاء اختيار المعلم"}
                    </option>
                    {teachers.map((teacher) => (
                      <option
                        key={teacher.employee?.id}
                        value={teacher.employee?.id}
                      >{`${teacher.employee?.first_name} ${teacher.employee?.middle_name} ${teacher.employee?.last_name}`}</option>
                    ))}
                  </select>
                ) : (
                  <></>
                )}
              </div>
              <div className="TSContent">
                <input
                  type="checkbox"
                  id={`${classes.id} 7`}
                  value=""
                  onChange={() => addSubstitute(`${classes.id} 7`)}
                ></input>
                {substitute[`${classes.id} 7`] ? (
                  <select
                    className="TSSelect"
                    id="teacher"
                    name={`${classes.id} 7`}
                  >
                    <option value="" disabled selected>
                      {language
                        ? "Please Select a Teacher"
                        : "الرجاء اختيار المعلم"}
                    </option>
                    {teachers.map((teacher) => (
                      <option
                        key={teacher.employee?.id}
                        value={teacher.employee?.id}
                      >{`${teacher.employee?.first_name} ${teacher.employee?.middle_name} ${teacher.employee?.last_name}`}</option>
                    ))}
                  </select>
                ) : (
                  <></>
                )}
              </div>
              <div className="TSContent">
                <input
                  type="checkbox"
                  id={`${classes.id} 8`}
                  value=""
                  onChange={() => addSubstitute(`${classes.id} 8`)}
                ></input>
                {substitute[`${classes.id} 8`] ? (
                  <select
                    className="TSSelect"
                    id="teacher"
                    name={`${classes.id} 8`}
                  >
                    <option value="" disabled selected>
                      {language
                        ? "Please Select a Teacher"
                        : "الرجاء اختيار المعلم"}
                    </option>
                    {teachers.map((teacher) => (
                      <option
                        key={teacher.employee?.id}
                        value={teacher.employee?.id}
                      >{`${teacher.employee?.first_name} ${teacher.employee?.middle_name} ${teacher.employee?.last_name}`}</option>
                    ))}
                  </select>
                ) : (
                  <></>
                )}
              </div>
              <div className="TSContent">
                <input
                  type="checkbox"
                  id={`${classes.id} 9`}
                  value=""
                  onChange={() => addSubstitute(`${classes.id} 9`)}
                ></input>
                {substitute[`${classes.id} 9`] ? (
                  <select
                    className="TSSelect"
                    id="teacher"
                    name={`${classes.id} 9`}
                  >
                    <option value="" disabled selected>
                      {language
                        ? "Please Select a Teacher"
                        : "الرجاء اختيار المعلم"}
                    </option>
                    {teachers.map((teacher) => (
                      <option
                        key={teacher.employee?.id}
                        value={teacher.employee?.id}
                      >{`${teacher.employee?.first_name} ${teacher.employee?.middle_name} ${teacher.employee?.last_name}`}</option>
                    ))}
                  </select>
                ) : (
                  <></>
                )}
              </div>
              <div className="TSContent">
                <input
                  type="checkbox"
                  id={`${classes.id} 10`}
                  value=""
                  onChange={() => addSubstitute(`${classes.id} 10`)}
                ></input>
                {substitute[`${classes.id} 10`] ? (
                  <select
                    className="TSSelect"
                    id="teacher"
                    name={`${classes.id} 10`}
                  >
                    <option value="" disabled selected>
                      {language
                        ? "Please Select a Teacher"
                        : "الرجاء اختيار المعلم"}
                    </option>
                    {teachers.map((teacher) => (
                      <option
                        key={teacher.employee?.id}
                        value={teacher.employee?.id}
                      >{`${teacher.employee?.first_name} ${teacher.employee?.middle_name} ${teacher.employee?.last_name}`}</option>
                    ))}
                  </select>
                ) : (
                  <></>
                )}
              </div>
            </div>
          ))}
          <div className="flex justify-center items-center w-full">
            <button className="bg-wisdomOrange hover:bg-wisdomDarkOrange text-white rounded p-2 flex self-center items-center">{language ? "Submit" : "ارسال"}</button>
          </div>
        </form>
      ) : (
        <div className="noTeacher">Please Select a Teacher</div>
      )}
    </div>
  );
}

export default TeacherSubstitutions;
