import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate, Navigate } from "react-router-dom";
import "../styles/Form.css";
import CollapsibleSection from "../components/CollapsibleSection";
import toast, { Toaster } from "react-hot-toast";
import newLogo from "../assets/newLogo.jpg";
import { useAuth } from "../context/AuthContext";
import {
  IndividualForm,
  CurriculumForm,
  fetchForm,
  EnvironmentForm,
} from "../services/pms";
import {
  fetchCurriculums,
  fetchDepartments,
  fetchUsers,
} from "../services/data";
import ChangeLanguage from "../components/ChangeLanguage";
import { useLanguage } from "../context/LanguageContext";
import LoadingScreen from "../components/LoadingScreen";
import DenyAccessPage from "../components/DenyAccessPage";
import Popup from "../components/Popup";
import Selector2 from "../components/Selector2";
import WisdomSchoolFilter from "../components/WisdomSchoolFilter";
import { SCHOOL_CURRICULUM_RELATION } from "../constants/constants";

function Form() {
  const { id } = useParams();
  const location = useLocation();
  const formEnName = location.state?.formEnName || "Form"; //check this
  const formArName = location.state?.formArName || "استمارة";
  const reviewee = location.state?.code === "Self" ? location.state?.reviewee : location.state?.code;
  const code = location.state?.code
  const [submitted, setSubmitted] = useState(false);
  const { language } = useLanguage();
  const [form, setForm] = useState([]);
  const [curriculums, setCurriculums] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedCurriculum, setSelectedCurriculum] = useState("");
  const { userInfo } = useAuth();
  const [quesLength, setQuesLength] = useState();
  const [selectedSchool, setSelectedSchool] = useState("");

  const navigate = useNavigate(); //for navigate to another page (component)

  const handleSchoolChange = (value) => {
    setSelectedSchool(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const handler = submitFormHandler(formType[0]);
    if (handler) handler(e); // pass the event
  };

  const submitFormHandler = (formType) => {
    if (formType === "360 Curriculum Assessment") {
      return submitCurriculumForm;
    } else if (formType === "360 Individual Assessment") {
      return submitIndividualForm;
    } else if (formType === "normal") {
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

    let userEntry;
    let userIdValue;
    if (code === "Self") {
      userEntry = { result: userInfo.id };
    } else {
      userEntry = allAnswers.find((entry) => entry.question_id === "user");
    }
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
      toast.success(language ? "Form has been submitted" : "تم ارسال التقييم");
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
        organization_id: userInfo.user_role === "Operations Excellence Lead" ? Number(selectedSchool) : userInfo.organization_id,
        curriculumId: Number(curriculum),
        questionsResult: questionAnswers,
      };
      console.log(submittedData)
      await CurriculumForm(submittedData);
      toast.success(language ? "Form has been submitted" : "تم ارسال التقييم");
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
        organization_id: userInfo.user_role === "Operations Excellence Lead" ? Number(selectedSchool) : userInfo.organization_id,
        questionsResult: questionAnswers,
      };
      await EnvironmentForm(submittedData);
      toast.success(language ? "Form has been submitted" : "تم ارسال التقييم");
      setSubmitted(true);
    } catch (err) {
      console.error("Error submitting data:", err);
      toast.error("Submission failed.");
    }
  };

  const handleDepartmentChange = (e) => {
    setSelectedDepartment(e.target.value);
  };

  const handleUserChange = (e) => {
    setSelectedUser(e.target.value);
  };

  const handleCurriculumChange = (e) => {
    setSelectedCurriculum(e.target.value);
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
        const wantedCurriculum = [1, 2, 3, 13, 14, 15, 16, 17, 18, 46, 47]
        const filteredCurriculums = response.filter(curriculum => wantedCurriculum.includes(curriculum.id))
        const curriculumIds = userInfo.user_role === "Operations Excellence Lead" ? new Set(SCHOOL_CURRICULUM_RELATION[Number(selectedSchool)] || []) : new Set(SCHOOL_CURRICULUM_RELATION[userInfo.organization_id] || []);
        const selectedOrganization = (selectedSchool !== "" || userInfo.user_role !== "Operations Excellence Lead")
          ? filteredCurriculums.filter(item => curriculumIds.has(item.id))
          : filteredCurriculums;
        setCurriculums(selectedOrganization);
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

    loadCurriculums();
    loadDepartments();
    loadUsers();
    setLoading(false);
  }, [userInfo, selectedSchool]);

  const filteredForm2 = form.reduce(
    (acc, question) => {
      const fieldEnName = question.sub_field.field?.field_en_name || "No Field";
      const fieldArName = question.sub_field.field?.field_ar_name || "No Field";

      // Ensure English field exists
      if (!acc[0][fieldEnName]) {
        acc[0][fieldEnName] = [];
      }
      acc[0][fieldEnName].push({
        title: question.question_en_name,
        max_score: question.question_max_score,
        question_id: question.question_id,
      });

      // Ensure Arabic field exists
      if (!acc[1][fieldArName]) {
        acc[1][fieldArName] = [];
      }
      acc[1][fieldArName].push({
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
    navigate('/pms');
  };

  if (loading) return <LoadingScreen />;
  if (error?.status === 403) return <Navigate to="/login" state={{ from: location }} replace />;
  if (error) return <p>Error: {error.message}</p>;
  if (!loading && (!form || form.length === 0)) return <p>No forms found.</p>;
  if (((reviewee && reviewee !== userInfo.user_role)
    || (userInfo.user_role === "Head of Department (HOD)" && reviewee === "Teacher"))
    && userInfo.user_role !== "Operations Excellence Lead" && (reviewee !== "Employee" && userInfo.user_role === "Student")) return <DenyAccessPage homePage='/pms' />;

  return (
    <div className="flex flex-col items-center bg-formColor min-h-[100vh] w-full">
      <Toaster />
      <img
        className="w-full md:h-[50vh]"
        src={newLogo}
        alt="company logo"
      ></img>
      <h1 className="text-center mb-[20px] mt-[10px] bg-black text-white w-full py-2 text-3xl font-bold">{language ? formEnName : formArName}</h1>
      <div className="form">
        <form className="form2" onSubmit={handleSubmit}>
          {formType[0] === "360 Individual Assessment" && code !== "Self" ? (
            <div className="flex md:flex-row flex-col md:justify-evenly w-full">
              <Selector2
                label="department"
                title={language ? "Department:" : ":القسم"}
                description={language
                  ? "Please Select a Department"
                  : "الرجاء اختيار القسم"}
                data={departments}
                value={selectedDepartment}
                onChange={handleDepartmentChange}
                name="Name"
              />
              <Selector2
                label="user"
                title={language ? "Teacher:" : ":المعلم"}
                description={language
                  ? "Please Select a Teacher"
                  : "الرجاء اختيار المعلم"}
                data={filteredUsers}
                value={selectedUser}
                onChange={handleUserChange}
                name="userEmp"
              />
            </div>
          ) : formType[0] === "360 Curriculum Assessment" ? (
            <Selector2
              label="curriculum"
              title={language ? "Curriculum:" : ":المنهج"}
              description={language
                ? "Please select a Curriculum"
                : "الرجاء اختيار المنهج"}
              data={curriculums}
              value={selectedCurriculum}
              onChange={handleCurriculumChange}
              name="code"
            />
          ) : null}
          {(formType[0] === "normal" || formType[0] === "360 Curriculum Assessment") && userInfo.user_role === "Operations Excellence Lead" && <WisdomSchoolFilter onSchoolChange={handleSchoolChange} />}
          <ChangeLanguage />
          {Object.entries(language ? filteredForm2[0] : filteredForm2[1]).map(
            ([fieldName, questions]) => (
              <CollapsibleSection
                key={fieldName}
                title={fieldName}
                language={language}
              >
                <div key={fieldName} className="w-full text-center mb-[20px]">
                  {questions.map((question, index) => (
                    <div
                      key={question.question_id}
                      className={`w-full mb-[15px] flex flex-col ${language ? "items-start text-left" : "items-end text-right"}`}
                    >
                      <h3 className="text-[18px] text-bold mb-[10px] w-full">
                        {/* {`(${index})`} */}
                        {question.title}
                      </h3>

                      <div className="text-[18px] text-bold mb-[10px] w-full flex justify-evenly">
                        {Array.from({ length: question.max_score }, (_, i) => (
                          <label
                            key={i}
                            style={{
                              display: "inline-block",
                              marginRight: "10px",
                            }}
                          >
                            <input
                              type="radio"
                              name={`question:${question.question_id}`}
                              value={JSON.stringify({
                                score: language
                                  ? i + 1
                                  : question.max_score - i,
                                questionId: question.question_id,
                              })}
                              class="accent-wisdomOrange"
                            />
                            {language ? i + 1 : question.max_score - i}
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CollapsibleSection>
            )
          )}

          <button type="submit" className="submitButton bg-wisdomOrange hover:bg-wisdomDarkOrange text-white p-2 rounded">
            {language ? "Submit" : "أرسال"}
          </button>
        </form>
      </div>
      <Popup
        isOpen={submitted}
        onClose={closePopup}
        message={language ? "Form has been submitted successfully" : "تم تسجيل تقييمك بنجاح"}
      />
    </div>
  );
}

export default Form;
