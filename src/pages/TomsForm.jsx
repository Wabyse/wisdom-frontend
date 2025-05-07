import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate, Navigate } from "react-router-dom";
import "../styles/Form.css";
import CollapsibleSection from "../components/CollapsibleSection";
import toast, { Toaster } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import newLogo2 from "../assets/newLogo2.jpg";
import {
  IndividualForm,
  CurriculumForm,
  fetchForm,
  EnvironmentForm,
} from "../services/pms";
import {
  fetchClasses,
  fetchCurriculums,
  fetchDepartments,
  fetchStudents,
  fetchUsers,
} from "../services/data";
import LoadingScreen from "../components/LoadingScreen";
import Popup from "../components/Popup";

function TomsForm() {
  const { id } = useParams();
  const location = useLocation();
  const formArName = location.state?.formArName || "استمارة";
  const code = location.state?.code;
  const reviewee = location.state?.reviewee;
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState([]);
  const [curriculums, setCurriculums] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [students, setStudnets] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [classes, setClasses] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const { userInfo } = useAuth();
  const [quesLength, setQuesLength] = useState();

  const navigate = useNavigate(); //for navigate to another page (component)

  const handleSubmit = (e) => {
    e.preventDefault();
    const handler = submitFormHandler(formType[0]);
    if (handler) handler(e); // pass the event
  };

  const submitFormHandler = (formType) => {
    if (formType === "curriculum") {
      return submitCurriculumForm;
    } else if (formType === "ClassRoom Observation") {
      return submitIndividualForm;
    } else if (formType === "normal2") {
      return submitenvironmentForm;
    }
  };

  const submitIndividualForm = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const allAnswers = [];

    formData.forEach((value, key) => {
      const parsedValue = {
        question_id: key,
        result: value,
      };
      allAnswers.push(parsedValue);
    });

    const userEntry = allAnswers.find((entry) => entry.question_id === "user");
    let userIdValue;
    if (!userEntry || !userEntry.result) {
      return toast.error("Please fill the required data");
    } else {
      userIdValue = userEntry ? userEntry.result : null;
    }

    const questionAnswers = allAnswers
      .filter((entry) => entry.question_id.startsWith("question:"))
      .map((entry) => {
        const parsed = JSON.parse(entry.result);
        return {
          question_id: parsed.questionId,
          result: parsed.score,
        };
      });
    if (questionAnswers.length < quesLength) {
      return toast.error("Please answer all questions");
    }

    try {
      const submittedData = {
        assessor: userInfo.id,
        assessee: code === "Self" ? userInfo.id : userIdValue,
        questionsResult: questionAnswers,
      };
      await IndividualForm(submittedData);
      toast.success("تم ارسال التقييم");
      setSubmitted(true);
    } catch (err) {
      console.error("Error submitting data:", err);
    }
  };

  const submitCurriculumForm = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const allAnswers = [];

    formData.forEach((value, key) => {
      const parsedValue = {
        question_id: key,
        result: value,
      };
      allAnswers.push(parsedValue);
    });

    const curriculumEntry = allAnswers.find(
      (entry) => entry.question_id === "curriculum"
    );
    const curriculum = curriculumEntry ? curriculumEntry.result : null;

    const questionAnswers = allAnswers
      .filter((entry) => entry.question_id.startsWith("question:"))
      .map((entry) => {
        const parsed = JSON.parse(entry.result);
        return {
          question_id: parsed.questionId,
          result: parsed.score,
        };
      });
    if (questionAnswers.length < quesLength) {
      return toast.error("Please answer all questions");
    }

    try {
      const submittedData = {
        userId: userInfo.id,
        curriculumId: curriculum,
        questionsResult: questionAnswers,
      };
      await CurriculumForm(submittedData);
      toast.success("تم ارسال التقييم");
      setSubmitted(true);
    } catch (err) {
      console.error("Error submitting data:", err);
    }
  };

  const submitenvironmentForm = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const allAnswers = [];

    formData.forEach((value, key) => {
      const parsedValue = {
        question_id: key,
        result: value,
      };
      allAnswers.push(parsedValue);
    });

    // Filter and parse question answers
    const questionAnswers = allAnswers
      .filter((entry) => entry.question_id.startsWith("question:"))
      .map((entry) => {
        const parsed = JSON.parse(entry.result);
        return {
          question_id: parsed.questionId,
          result: parsed.score,
        };
      });

    if (questionAnswers.length < quesLength) {
      return toast.error("Please answer all questions");
    }

    try {
      const submittedData = {
        userId: userInfo.id,
        questionsResult: questionAnswers,
      };
      await EnvironmentForm(submittedData);
      toast.success("تم ارسال التقييم");
      setSubmitted(true);
    } catch (err) {
      console.error("Error submitting data:", err);
      toast.error("Submission failed.");
    }
  };

  const handleDepartmentChange = (e) => {
    setSelectedDepartment(e.target.value);
  };

  const handleClassChange = (e) => {
    if (e.target.value !== "" && e.target.value !== "All") {
      const filtering = students.filter(student => student.class_id === Number(e.target.value));
      setFilteredStudents(filtering)
    }
    if (e.target.value !== "") {
      setSelectedClass(e.target.value);
    }
  };

  useEffect(() => {
    const selectDepartment = async (users, selectedDepartment) => {
      const departmentId = Number(selectedDepartment);
      const questionAnswers = users.filter(
        (entry) => entry.employee?.teacher?.department_id === departmentId
      );
      setFilteredUsers(questionAnswers);
    };

    if (selectedDepartment && users.length > 0) {
      selectDepartment(users, selectedDepartment);
    }
  }, [selectedDepartment, users]);

  useEffect(() => {
    const loadForm = async () => {
      try {
        const formId = { formId: id };
        const response = await fetchForm(formId);

        setForm(response || []);
        setQuesLength(response.length || 0);
      } catch (err) {
        console.error("API Error:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadForm();
  }, [id]);

  useEffect(() => {
    const loadCurriculums = async () => {
      try {
        const response = await fetchCurriculums();

        setCurriculums(response);
      } catch (err) {
        console.error("API Error:", err);
        setError(err);
      }
    };

    const loadDepartments = async () => {
      try {
        const response = await fetchDepartments(userInfo);
        setDepartments(response);
      } catch (err) {
        console.error("API Error:", err);
        setError(err);
      }
    };

    const loadUsers = async () => {
      try {
        const response = await fetchUsers(userInfo);
        let RelatedUsers;
        if (userInfo.user_role !== "Operations Excellence Lead") {
          RelatedUsers = response.filter(user => user.employee.organization_id === userInfo.organization_id);
        } else {
          RelatedUsers = response;
        }
        setUsers(RelatedUsers);
        setFilteredUsers(RelatedUsers);
      } catch (err) {
        console.error("API Error:", err);
        setError(err);
      }
    };

    const loadStudents = async () => {
      try {
        const response = await fetchStudents();
        const filterOrg = userInfo.user_role === "Operations Excellence Lead" ? response : response.filter(org => org.school_id === userInfo.organization_id);
        setStudnets(filterOrg);
        setFilteredStudents(filterOrg);
      } catch (err) {
        console.error("API Error:", err);
        setError(err);
      }
    };

    const loadClasses = async () => {
      try {
        const response = await fetchClasses();
        const response2 = await fetchStudents();
        let response3;
        if (userInfo.user_role !== "Operations Excellence Lead") {
          response3 = [...new Set(response2
            .filter(test => test.school_id === userInfo.organization_id)
            .map(test => test.class_id)
          )];
        } else {
          response3 = response2.map(test => test.class_id);
        }
        const response4 = response.filter(item => response3.includes(item.id));
        setClasses(response4);
      } catch (err) {
        console.error("API Error:", err);
        setError(err);
      }
    };

    loadCurriculums();
    loadDepartments();
    loadUsers();
    loadStudents();
    loadClasses();
    setLoading(false);
  }, [userInfo]);

  const filteredForm2 = form.reduce(
    (acc, question) => {
      const fieldArName = question.sub_field.field?.field_ar_name || "No Field";

      // Ensure English field exists
      if (!acc[0][fieldArName]) {
        acc[0][fieldArName] = [];
      }
      acc[0][fieldArName].push({
        title: question.question_ar_name,
        max_score: question.question_max_score,
        question_id: question.question_id,
      });

      return acc;
    },
    [{}, {}]
  );

  const formType = [
    ...new Set(
      form.map(
        (question) =>
          question.sub_field?.field?.form?.form_type || "No Form Type"
      )
    ),
  ];

  const closePopup = () => {
    setSubmitted(false)
    navigate('/watoms/pms');
  };

  if (loading) return <LoadingScreen />;
  if (error?.status === 403) return <Navigate to="/login" state={{ from: location }} replace />;
  if (error) return <p>Error: {error.message}</p>;
  if (!loading && (!form || form.length === 0)) return <p>No forms found.</p>;

  return (
    <div className="flex flex-col items-center bg-formColor min-h-[100vh] w-full">
      <Toaster />
      <img
        className="md:w-[60%] w-full md:h-[30vh]"
        src={newLogo2}
        alt="company logo"
      ></img>
      <div className="flex flex-col items-center justify-center mt-0 text-center md:w-[75%] w-full bg-formColor min-h-[80vh] mb-[5%] rounded-[15px]">
        <h1 className="text-center my-[20px] text-2xl">{formArName}</h1>
        <form
          className="flex flex-col items-center justify-center w-full"
          onSubmit={handleSubmit}
        >
          {formType[0] === "ClassRoom Observation" ? code !== "Self" ? reviewee !== "Student" ? (
            <div className="w-full flex md:justify-evenly flex-col md:flex-row">
              <div className="flex flex-col items-center justify-center">
                <label htmlFor="department">:المهنة</label>
                <select
                  className="p-[10px] text-[16px] text-center w-[250px] rounded-[5px]"
                  id="department"
                  name="department"
                  onChange={handleDepartmentChange}
                  value={selectedDepartment}
                >
                  <option value="" disabled selected>
                    الرجاء اختيار المهنة
                  </option>
                  {departments.map((department) => (
                    <option key={department.id} value={department.id}>
                      {department.Name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col items-center justify-center">
                <label>:المدرب</label>
                <select
                  className="p-[10px] text-[16px] text-center w-[250px] rounded-[5px]"
                  id="user"
                  name="user"
                >
                  <option value="" disabled selected>
                    الرجاء اختيار المدرب
                  </option>
                  {filteredUsers.map((user) => (
                    <option
                      value={user.id}
                      key={user.id}
                    >{`${user.employee?.employee_first_name} ${user.employee?.employee_middle_name} ${user.employee?.employee_last_name}`}</option>
                  ))}
                </select>
              </div>
            </div>
          ) : (
            <div className="w-full flex md:justify-evenly flex-col md:flex-row">
              <div className="flex flex-col items-center justify-center">
                <label htmlFor="class">:الدورة</label>
                <select
                  className="p-[10px] text-[16px] text-center w-[250px] rounded-[5px]"
                  id="class"
                  name="class"
                  onChange={handleClassChange}
                  value={selectedClass}
                >
                  <option value="" disabled selected>
                    الرجاء اختيار المهنة
                  </option>
                  {classes.map((eachClass) => (
                    <option key={eachClass.id} value={eachClass.id}>
                      {eachClass.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col items-center justify-center">
                <label>:المتدرب</label>
                <select
                  className="p-[10px] text-[16px] text-center w-[250px] rounded-[5px]"
                  id="user"
                  name="user"
                >
                  <option value="" disabled selected>
                    الرجاء اختيار المتدرب
                  </option>
                  {filteredStudents.map((student) => (
                    <option
                      value={student.id}
                      key={student.id}
                    >{`${student.first_name} ${student.middle_name} ${student.last_name}`}</option>
                  ))}
                </select>
              </div>
            </div>
          ) : null : formType[0] === "curriculum" ? (
            <div className="flex flex-col items-center justify-center">
              <label>:المنهج</label>
              <select
                className="p-[10px] text-[16px] text-center w-[250px] rounded-[5px]"
                id="curriculum"
                name="curriculum"
              >
                <option value="" disabled selected>
                  الرجاء اختيار المنهج
                </option>
                {curriculums.map((curriculum) => (
                  <option key={curriculum.id} value={curriculum.id}>
                    {curriculum.code}
                  </option>
                ))}
              </select>
            </div>
          ) : null}
          {Object.entries(filteredForm2[0]).map(([fieldName, questions]) => (
            <CollapsibleSection key={fieldName} title={fieldName}>
              <div key={fieldName} className="w-full text-center mb-[20px]">
                {questions.map((question, index) => (
                  <div key={question.question_id} className="w-full mb-[15px] flex items-end text-right flex-col">
                    <h3 className="text-[18px] text-bold mb-[10px] w-full">
                      {/* {`(${index})`} */}
                      {question.title}
                    </h3>

                    <div className="text-[18px] text-bold mb-[10px] w-full flex justify-evenly">
                      {Array.from({ length: question.max_score }, (_, i) => (
                        <label
                          key={i}
                          className="mr-[10px] inline-block"
                        >
                          <input
                            type="radio"
                            className="accent-wisdomOrange"
                            name={`question:${question.question_id}`}
                            value={JSON.stringify({
                              score: question.max_score - i,
                              questionId: question.question_id,
                            })}
                          />
                          {question.max_score - i}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CollapsibleSection>
          ))}

          <button type="submit" className="bg-wisdomOrange px-4 py-2 rounded-2xl text-white hover:bg-wisdomDarkOrange cursor-pointer">
            أرسال
          </button>
        </form>
      </div>
      <Popup
        isOpen={submitted}
        onClose={closePopup}
        message="تم تسجيل رايك بنجاح"
      />
    </div>
  );
}

export default TomsForm;
