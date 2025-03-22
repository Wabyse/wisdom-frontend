import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
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
  fetchCurriculums,
  fetchDepartments,
  fetchUsers,
} from "../services/data";

function TomsForm() {
  const { id } = useParams();
  const location = useLocation();
  const formArName = location.state?.formArName || "استمارة";
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
    } else if (formType === "ClassRoom Observation") {
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
      navigate(`/watoms/pms`);
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
      navigate(`/watoms/pms`);
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
      navigate(`/watoms/pms`);
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!loading && (!form || form.length === 0)) return <p>No forms found.</p>;

  return (
    <div className="formPage">
      <Toaster />
      <img
        className="newLogo"
        width="20%"
        src={newLogo2}
        alt="company logo"
      ></img>
      <div className="form">
        <h1 className="header">{formArName}</h1>
        <form className="form2" onSubmit={handleSubmit}>
          {formType[0] === "ClassRoom Observation" ? (
            <div className="selects">
              <div className="select">
                <label htmlFor="department">:المهنة</label>
                <select
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
              <div className="select">
                <label>:المدرب</label>
                <select id="user" name="user">
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
          ) : formType[0] === "curriculum" ? (
            <div className="select">
              <label>:المنهج</label>
              <select id="curriculum" name="curriculum">
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
              <div key={fieldName} className="field-group">
                {questions.map((question, index) => (
                  <div key={question.question_id} className="questions">
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

          <button type="submit" className="submitButton">
            أرسال
          </button>
        </form>
      </div>
    </div>
  );
}

export default TomsForm;
