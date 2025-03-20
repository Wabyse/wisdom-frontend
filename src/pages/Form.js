import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import "../styles/Form.css";
import CollapsibleSection from "../components/CollapsibleSection";
import toast, { Toaster } from "react-hot-toast";
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

function Form() {
  const { id } = useParams();
  const location = useLocation();
  const formEnName = location.state?.formEnName || "Form"; //check this
  const formArName = location.state?.formArName || "استمارة";
  const { language } = useLanguage();
  const [form, setForm] = useState([]);
  const [curriculums, setCurriculums] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const { userInfo } = useAuth();
  const [quesLength, setQuesLength] = useState();

  const navigate = useNavigate(); //for navigate to another page (component)

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
        assessee: userIdValue,
        questionsResult: questionAnswers,
      };
      await IndividualForm(submittedData);
      navigate(`/pms`);
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
      navigate(`/pms`);
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
      navigate(`/pms`);
    } catch (err) {
      console.error("Error submitting data:", err);
      toast.error("Submission failed.");
    }
  };

  const handleDepartmentChange = (e) => {
    setSelectedDepartment(e.target.value);
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
        setError(err.message || "An error occurred while fetching data.");
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
        setError(
          err.message || "An error occurred while fetching curriculums data."
        );
      }
    };

    const loadDepartments = async () => {
      try {
        const response = await fetchDepartments();
        setDepartments(response);
      } catch (err) {
        console.error("API Error:", err);
        setError(
          err.message || "An error occurred while fetching curriculums data."
        );
      }
    };

    const loadUsers = async () => {
      try {
        const response = await fetchUsers();
        setUsers(response);
        setFilteredUsers(response);
      } catch (err) {
        console.error("API Error:", err);
        setError(err.message || "An error occurred while fetching users data.");
      }
    };

    loadCurriculums();
    loadDepartments();
    loadUsers();
    setLoading(false);
  }, []);

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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!loading && (!form || form.length === 0)) return <p>No forms found.</p>;

  return (
    <div className="formPage">
      <Toaster />
      <div className="form">
        <img
          width="20%"
          src="http://pms.wabyse.com/wp-content/uploads/2024/10/cropped-cropped-WABYS-NEW-LOGO1.png"
          alt="company logo"
        ></img>
        <h1 className="header">{language ? formEnName : formArName}</h1>
        <form className="form2" onSubmit={handleSubmit}>
          {formType[0] === "360 Individual Assessment" ? (
            <div className="selects">
              <div className="select">
                <label htmlFor="department">
                  {language ? "Department:" : ":القسم"}
                </label>
                <select
                  id="department"
                  name="department"
                  onChange={handleDepartmentChange}
                  value={selectedDepartment}
                >
                  <option value="" disabled selected>
                    {language
                      ? "Please Select a Department"
                      : "الرجاء اختيار القسم"}
                  </option>
                  {departments.map((department) => (
                    <option key={department.id} value={department.id}>
                      {department.Name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="select">
                <label>{language ? "Teacher:" : ":المعلم"}</label>
                <select id="user" name="user">
                  <option value="" disabled selected>
                    {language
                      ? "Please Select a Teacher"
                      : "الرجاء اختيار المعلم"}
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
          ) : formType[0] === "360 Curriculum Assessment" ? (
            <div className="select">
              <label>{language ? "Curriculum:" : ":المنهج"}</label>
              <select id="curriculum" name="curriculum">
                <option value="" disabled selected>
                  {language
                    ? "Please select a Curriculum"
                    : "الرجاء اختيار المنهج"}
                </option>
                {curriculums.map((curriculum) => (
                  <option key={curriculum.id} value={curriculum.id}>
                    {curriculum.code}
                  </option>
                ))}
              </select>
            </div>
          ) : null}
          <ChangeLanguage />
          {Object.entries(language ? filteredForm2[0] : filteredForm2[1]).map(
            ([fieldName, questions]) => (
              <CollapsibleSection
                key={fieldName}
                title={fieldName}
                language={language}
              >
                <div key={fieldName} className="field-group">
                  {questions.map((question, index) => (
                    <div
                      key={question.question_id}
                      className={language ? "questions-en" : "questions"}
                    >
                      <h3 className="question">
                        {/* {`(${index})`} */}
                        {question.title}
                      </h3>

                      <div className="question">
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

          <button type="submit" className="submitButton">
            {language ? "Submit" : "أرسال"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Form;
