import { useNavigate } from "react-router-dom";
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

const latenessOptions = ["5", "10", "15", "20", "25", "30"];

function TeacherLatness() {
  const { language } = useLanguage();
  const [selectedUser, setSelectedUser] = useState(null);
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
        setTeachers(filteredTeachers);
      } catch (err) {
        console.error("API Error:", err);
        setError(err.message || "An error occurred while fetching users data.");
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
          id: selectedUser,
        };
        const response = await fetchTeacherInfo(teacherData);
        setTeacher(response);
      } catch (err) {
        console.error("API Error:", err);
        setError(err.message || "An error occurred while fetching users data.");
      } finally {
        setLoading(false);
      }
    };

    loadTeacher();
  }, [selectedUser]);

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
          className="newLogo"
          width="20%"
          src={newLogo}
          alt="company logo"
        ></img>
      </div>
      <div className="Div100">
        <h1>{language ? "Teacher Latness" : "تاخير المعلم"}</h1>
      </div>
      <ChangeLanguage />
      <div className="select Div100">
        <label>{language ? "Teacher:" : ":المعلم"}</label>
        <select id="teacher" name="teacher" onClick={handleTeacher}>
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
            <div className="TLTitleContent">Class</div>
            <div className="TLTitleContent">Session 1</div>
            <div className="TLTitleContent">Session 2</div>
            <div className="TLTitleContent">Session 3</div>
            <div className="TLTitleContent">Session 4</div>
            <div className="TLTitleContent">Session 5</div>
            <div className="TLTitleContent">Session 6</div>
            <div className="TLTitleContent">Session 7</div>
            <div className="TLTitleContent">Session 8</div>
            <div className="TLTitleContent">Session 9</div>
            <div className="TLTitleContent">Session 10</div>
          </div>
          {teacher?.employee?.teacher?.sessions?.map((classes, index) => (
            <div className="TLTitle" key={`${classes.class.id}-${index}`}>
              <div className="TLContent">{classes.class.name}</div>
              <div className="TLContent">
                <select
                  className="TLSelect"
                  id="teacher"
                  name={`${classes.class.id} 1`}
                >
                  <option
                    className="defaultOptionTL"
                    key="default"
                    value=""
                    disabled
                    selected
                  >
                    {language ? "On Time" : "في الموعد"}
                  </option>
                  {latenessOptions.map((min) => (
                    <option key={min} value={min}>
                      {min} min.
                    </option>
                  ))}
                </select>
              </div>
              <div className="TLContent">
                <select
                  className="TLSelect"
                  id="teacher"
                  name={`${classes.class.id} 2`}
                >
                  <option
                    className="defaultOptionTL"
                    key="default"
                    value=""
                    disabled
                    selected
                  >
                    {language ? "On Time" : "في الموعد"}
                  </option>
                  {latenessOptions.map((min) => (
                    <option key={min} value={min}>
                      {min} min.
                    </option>
                  ))}
                </select>
              </div>
              <div className="TLContent">
                <select
                  className="TLSelect"
                  id="teacher"
                  name={`${classes.class.id} 3`}
                >
                  <option
                    className="defaultOptionTL"
                    key="default"
                    value=""
                    disabled
                    selected
                  >
                    {language ? "On Time" : "في الموعد"}
                  </option>
                  {latenessOptions.map((min) => (
                    <option key={min} value={min}>
                      {min} min.
                    </option>
                  ))}
                </select>
              </div>
              <div className="TLContent">
                <select
                  className="TLSelect"
                  id="teacher"
                  name={`${classes.class.id} 4`}
                >
                  <option
                    className="defaultOptionTL"
                    key="default"
                    value=""
                    disabled
                    selected
                  >
                    {language ? "On Time" : "في الموعد"}
                  </option>
                  {latenessOptions.map((min) => (
                    <option key={min} value={min}>
                      {min} min.
                    </option>
                  ))}
                </select>
              </div>
              <div className="TLContent">
                <select
                  className="TLSelect"
                  id="teacher"
                  name={`${classes.class.id} 5`}
                >
                  <option
                    className="defaultOptionTL"
                    key="default"
                    value=""
                    disabled
                    selected
                  >
                    {language ? "On Time" : "في الموعد"}
                  </option>
                  {latenessOptions.map((min) => (
                    <option key={min} value={min}>
                      {min} min.
                    </option>
                  ))}
                </select>
              </div>
              <div className="TLContent">
                <select
                  className="TLSelect"
                  id="teacher"
                  name={`${classes.class.id} 6`}
                >
                  <option
                    className="defaultOptionTL"
                    key="default"
                    value=""
                    disabled
                    selected
                  >
                    {language ? "On Time" : "في الموعد"}
                  </option>
                  {latenessOptions.map((min) => (
                    <option key={min} value={min}>
                      {min} min.
                    </option>
                  ))}
                </select>
              </div>
              <div className="TLContent">
                <select
                  className="TLSelect"
                  id="teacher"
                  name={`${classes.class.id} 7`}
                >
                  <option
                    className="defaultOptionTL"
                    key="default"
                    value=""
                    disabled
                    selected
                  >
                    {language ? "On Time" : "في الموعد"}
                  </option>
                  {latenessOptions.map((min) => (
                    <option key={min} value={min}>
                      {min} min.
                    </option>
                  ))}
                </select>
              </div>
              <div className="TLContent">
                <select
                  className="TLSelect"
                  id="teacher"
                  name={`${classes.class.id} 8`}
                >
                  <option
                    className="defaultOptionTL"
                    key="default"
                    value=""
                    disabled
                    selected
                  >
                    {language ? "On Time" : "في الموعد"}
                  </option>
                  {latenessOptions.map((min) => (
                    <option key={min} value={min}>
                      {min} min.
                    </option>
                  ))}
                </select>
              </div>
              <div className="TLContent">
                <select
                  className="TLSelect"
                  id="teacher"
                  name={`${classes.class.id} 9`}
                >
                  <option
                    className="defaultOptionTL"
                    key="default"
                    value=""
                    disabled
                    selected
                  >
                    {language ? "On Time" : "في الموعد"}
                  </option>
                  {latenessOptions.map((min) => (
                    <option key={min} value={min}>
                      {min} min.
                    </option>
                  ))}
                </select>
              </div>
              <div className="TLContent">
                <select
                  className="TLSelect"
                  id="teacher"
                  name={`${classes.class.id} 10`}
                >
                  <option
                    className="defaultOptionTL"
                    key="default"
                    value=""
                    disabled
                    selected
                  >
                    {language ? "On Time" : "في الموعد"}
                  </option>
                  {latenessOptions.map((min) => (
                    <option key={min} value={min}>
                      {min} min.
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
          <button className="TLBtn">{language ? "Submit" : "ارسال"}</button>
        </form>
      ) : (
        <div className="noTeacher">Please Select a Teacher</div>
      )}
    </div>
  );
}

export default TeacherLatness;
