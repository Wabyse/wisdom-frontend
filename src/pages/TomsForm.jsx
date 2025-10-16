import React, { useEffect, useState, useRef } from "react";
import { useParams, useLocation, useNavigate, Navigate } from "react-router-dom";
import "../styles/Form.css";
import CollapsibleSection from "../components/CollapsibleSection";
import toast, { Toaster } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import newLogo from "../assets/newLogo2.jpg";
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
import ChangeLanguage from "../components/ChangeLanguage";
import { useLanguage } from "../context/LanguageContext";
import LoadingScreen from "../components/LoadingScreen";
import DenyAccessPage from "../components/DenyAccessPage";
import Popup from "../components/Popup";
import Selector2 from "../components/Selector2";
import WatomsVtcFilter from "../components/WatomsInstitutionFilters";
import { INSTITUTION_CURRICULUM_RELATION } from "../constants/constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faListAlt, faUser, faInfoCircle, faCheckCircle, faArrowLeft } from "@fortawesome/free-solid-svg-icons";

function TomsForm() {
  const { id } = useParams();
  const location = useLocation();
  const formEnName = location.state?.formArName || "Form";
  const formArName = location.state?.formArName || "استمارة";
  const reviewee = location.state?.code === "Self" ? location.state?.code : location.state?.reviewee;
  const code = location.state?.code;
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
  const [students, setStudnets] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [classes, setClasses] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedCurriculum, setSelectedCurriculum] = useState("");
  const { userInfo } = useAuth();
  const [quesLength, setQuesLength] = useState();
  const [selectedVtc, setSelectedVtc] = useState("");
  const [formCode, setFormCode] = useState("");
  const [answeredCount, setAnsweredCount] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [showReview, setShowReview] = useState(false);
  const navigate = useNavigate(); //for navigate to another page (component)
  const sectionRefs = useRef({});
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'auto');
  const [draftSaved, setDraftSaved] = useState(false);
  const [draftTimeout, setDraftTimeout] = useState(null);
  const [answers, setAnswers] = useState({});
  const [openReviewSection, setOpenReviewSection] = useState(0);

  const handleVtcChange = (value) => {
    setSelectedVtc(value);
  };
  const handleCurriculumChange = (e) => setSelectedCurriculum(e.target.value);

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

    // Build answers from state
    const questionAnswers = Object.entries(answers).map(([key, score]) => ({
      question_id: key.replace("question:", ""),
      result: score,
    }));

    // Validate all required questions are answered
    if (questionAnswers.length < quesLength) {
      return toast.error("Please answer all questions");
    }

    // Get assessee
    let userIdValue;
    console.log(selectedUser)
    if (code === "Self") {
      userIdValue = userInfo.id;
    } else if (selectedUser) {
      userIdValue = selectedUser;
    } else {
      return toast.error("Please select a user");
    }

    try {
      const submittedData = {
        assessor: userInfo.id,
        assessee: userIdValue,
        questionsResult: questionAnswers,
      };

      await IndividualForm(submittedData);
      localStorage.removeItem(`form-draft-${id}`)
      toast.success(language ? "Form has been submitted" : "تم ارسال التقييم");
      setSubmitted(true);
    } catch (err) {
      console.error("Error submitting data:", err);
      toast.error("Submission failed.");
    }
  };

  const submitCurriculumForm = async (e) => {
    e.preventDefault();

    // 1. Validate curriculum selection
    if (!selectedCurriculum) {
      return toast.error(language ? "Please select a curriculum" : "الرجاء اختيار المنهج");
    }

    // 2. Build answers from `answers` state
    const questionAnswers = Object.entries(answers).map(([key, score]) => ({
      question_id: key.replace("question:", ""),
      result: score,
    }));

    // 3. Validate all questions answered
    if (questionAnswers.length < quesLength) {
      return toast.error(language ? "Please answer all questions" : "الرجاء الإجابة على جميع الأسئلة");
    }

    // 4. Prepare payload
    const submittedData = {
      userId: userInfo.id,
      organization_id:
        userInfo.user_role === "Operations Excellence Lead"
          ? Number(selectedVtc)
          : userInfo.organization_id,
      curriculumId: Number(selectedCurriculum),
      questionsResult: questionAnswers,
    };

    try {
      await CurriculumForm(submittedData);
      localStorage.removeItem(`form-draft-${id}`)
      toast.success(language ? "Form has been submitted" : "تم ارسال التقييم");
      setSubmitted(true);
    } catch (err) {
      console.error("Error submitting curriculum form:", err);
      toast.error(language ? "Submission failed" : "فشل الإرسال");
    }
  };

  const submitenvironmentForm = async (e) => {
    e.preventDefault();

    const questionAnswers = Object.entries(answers).map(([key, score]) => ({
      question_id: key.replace("question:", ""),
      result: score,
    }));

    if (questionAnswers.length < quesLength) {
      return toast.error("Please answer all questions");
    }

    try {
      const submittedData = {
        userId: userInfo.id,
        organization_id: userInfo.user_role === "Operations Excellence Lead" ? Number(selectedVtc) : userInfo.organization_id,
        questionsResult: questionAnswers,
      };
      await EnvironmentForm(submittedData);
      localStorage.removeItem(`form-draft-${id}`)
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

        setFormCode(response[0].sub_field.field.form.form_code.split(" | ")[1])
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
        const unWantedCurriculum = [1, 3, 13, 14, 15, 16, 17, 18, 48, 49]
        const filteredCurriculums = response.filter(curriculum => !unWantedCurriculum.includes(curriculum.id))
        const curriculumIds = userInfo.user_role === "Operations Excellence Lead" ? new Set(INSTITUTION_CURRICULUM_RELATION[Number(selectedVtc)] || []) : new Set(INSTITUTION_CURRICULUM_RELATION[userInfo.organization_id] || []);
        const selectedOrganization = (selectedVtc !== "" || userInfo.user_role !== "Operations Excellence Lead")
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

    const loadStudents = async () => {
      try {
        const response = await fetchStudents();
        const filterOrg = userInfo.user_role === "Operations Excellence Lead" ? response : response.filter(org => org.school_id === userInfo.organization_id);
        let filteredStudenets;
        if (selectedVtc !== "") {
          filteredStudenets = filterOrg.filter(org => org.school_id === Number(selectedVtc))
        } else {
          filteredStudenets = filterOrg;
        }
        setStudnets(filteredStudenets);
        setFilteredStudents(filteredStudenets);
      } catch (err) {
        console.error("API Error:", err);
        setError(err);
      }
    };

    const loadClasses = async () => {
      try {
        const response = await fetchClasses();
        const unWantedClasses = [1, 2, 3, 4, 5, 6, 7, 17, 18];
        const filteredClasses = response.filter(vtcClass => !unWantedClasses.includes(vtcClass.id));
        const response2 = await fetchStudents();
        let response3;
        if (userInfo.user_role !== "Operations Excellence Lead") {
          response3 = [...new Set(response2
            .filter(test => test.school_id === userInfo.organization_id)
            .map(test => test.class_id)
          )];
        } else {
          if (selectedVtc === "") {
            response3 = response2.map(test => test.class_id);
          } else {
            response3 = [...new Set(response2
              .filter(test => test.school_id === Number(selectedVtc))
              .map(test => test.class_id)
            )];
          }
        }
        const response4 = filteredClasses.filter(item => response3.includes(item.id));
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
  }, [userInfo, selectedVtc]);

  const filteredForm2 = form.reduce(
    (acc, question) => {
      const fieldEnName = question.sub_field.field?.field_en_name || "No Field";
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

  // Section/step logic
  const sectionEntries = Object.entries(filteredForm2[0]);
  const sectionNames = sectionEntries.map(([name]) => name);
  const totalQuestions = sectionEntries.reduce((acc, [, arr]) => acc + arr.length, 0);
  const progress = totalQuestions ? Math.round((answeredCount / totalQuestions) * 100) : 0;

  // On mount, restore answers from localStorage
  useEffect(() => {
    const draft = localStorage.getItem(`form-draft-${id}`);
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        setAnswers(parsed);
        setAnsweredCount(Object.keys(parsed).length);
      } catch { }
    }
  }, [id]);

  const handleRadioChange = (e) => {
    const { name, value } = e.target;
    const score = Number(value);
    const newAnswers = { ...answers, [name]: score };
    setAnswers(newAnswers);
    setAnsweredCount(Object.keys(newAnswers).length);
    localStorage.setItem(`form-draft-${id}`, JSON.stringify(newAnswers));
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' && activeStep < sectionEntries.length - 1 && !showReview) {
        setActiveStep((s) => s + 1);
      } else if (e.key === 'ArrowLeft' && activeStep > 0 && !showReview) {
        setActiveStep((s) => s - 1);
      } else if (e.key === 'Enter' && showReview) {
        document.getElementById('final-submit-btn')?.click();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeStep, showReview, sectionEntries.length]);

  // Animated transitions (simple fade)
  const fadeClass = "transition-opacity duration-500 ease-in-out";

  // Review step: collect all answers
  const handleReview = (e) => {
    e.preventDefault();
    setShowReview(true);
  };

  // Theme switcher logic
  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    if (theme === 'auto') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.add(isDark ? 'dark' : 'light');
    } else {
      document.documentElement.classList.add(theme);
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Stepper icons (cycle through for demo)
  const stepIcons = [faListAlt, faUser, faInfoCircle];

  if (loading) return <LoadingScreen />;
  if (error?.status === 403) return <Navigate to="/login" state={{ from: location }} replace />;
  if (error) return <p>Error: {error.message}</p>;
  if (!loading && (!form || form.length === 0)) return <LoadingScreen />;
  if (userInfo?.code === 1452 || userInfo?.code === 1476) return <DenyAccessPage homePage='/watoms/dashboard' />;
  if (userInfo?.code === 1475) return <DenyAccessPage homePage='/watoms/news' />;
  if (userInfo?.code === 1310) return <DenyAccessPage homePage='/wisdom/dashboard' />;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#f7f8fa] to-[#e9eaf3] flex flex-col items-center justify-start">
      <Toaster />
      {/* Sticky Header with Progress Bar and Stepper */}
      <div className="w-full sticky top-0 z-30 bg-white/90 shadow-md flex flex-col items-center px-8 py-3 border-b border-gray-200" style={{ backdropFilter: 'blur(8px)' }}>
        <div className="md:flex block items-center gap-4 w-full justify-between">
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <img src={newLogo} alt="company logo" className="h-12 w-auto rounded-lg shadow" />
            <h1 className="text-2xl md:text-3xl font-extrabold" style={{
              background: 'linear-gradient(135deg, #181E41 0%, #F05A1A 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              color: 'transparent',
              fontFamily: 'Inter,sans-serif',
            }}>{language ? formEnName : formArName}</h1>
          </div>
          <div className="flex items-center gap-4 justify-evenly">
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-br from-[#181E41] to-[#F05A1A] text-white font-bold shadow hover:scale-105 transition-all"
              onClick={() => navigate(-1)}
            >
              <FontAwesomeIcon icon={faArrowLeft} className="text-lg" />
              {language ? 'Home' : 'الصفحة الرئيسية'}
            </button>
            <ChangeLanguage />
          </div>
        </div>
        {/* Progress Bar */}
        <div className="w-full h-3 bg-gray-200 rounded-full mt-4 relative overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-br from-[#181E41] to-[#F05A1A] transition-all duration-300" style={{ width: `${progress}%` }} />
          <span className="absolute right-3 top-0 text-xs font-bold text-gray-700">{progress}%</span>
        </div>
        {/* Animated Stepper */}
        <div className="w-full mt-4">
          <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap px-2 sm:overflow-visible sm:whitespace-normal sm:justify-center">
            {sectionNames.map((name, idx) => (
              <button
                key={name}
                onClick={() => { setActiveStep(idx); setShowReview(false); }}
                className={`relative px-4 py-2 rounded-full font-bold text-base transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-200 ${activeStep === idx && !showReview ? 'bg-gradient-to-br from-[#181E41] to-[#F05A1A] text-white shadow-lg scale-105' : 'bg-white text-gray-800 hover:bg-orange-50'}`}
                style={{ fontFamily: 'Inter,sans-serif' }}
                aria-current={activeStep === idx && !showReview ? 'step' : undefined}
              >
                <span className="flex items-center gap-2">
                  <FontAwesomeIcon icon={stepIcons[idx % stepIcons.length]} className={`text-lg transition-all duration-300 ${activeStep === idx ? 'animate-bounce' : ''}`} />
                  {name}
                </span>
              </button>
            ))}
            <button
              onClick={() => setShowReview(true)}
              className={`px-4 py-2 rounded-full font-bold text-base transition-all duration-200 ml-4 ${showReview ? 'bg-gradient-to-br from-[#181E41] to-[#F05A1A] text-white shadow-lg scale-105' : 'bg-white text-gray-800 hover:bg-orange-50'}`}
              style={{ fontFamily: 'Inter,sans-serif' }}
              aria-current={showReview ? 'step' : undefined}
            >
              <span className="flex items-center gap-2">
                <FontAwesomeIcon icon={faCheckCircle} className="text-lg" />
                {language ? 'Review & Submit' : 'مراجعة وإرسال'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Form Card */}
      <div className="w-full flex justify-center mt-8 mb-8">
        <form className="bg-white rounded-2xl shadow-xl border border-gray-200 px-10 py-8 max-w-screen-lg w-full flex flex-col gap-8 animate-fadeIn relative" onSubmit={showReview ? handleSubmit : handleReview}>
          {/* Top Selectors Row (only on first step) */}
          {activeStep === 0 && !showReview && (
            <div className="w-full flex flex-col md:flex-row gap-6 items-center justify-center">
              {formType[0] === "ClassRoom Observation" ? code !== "Self" ? reviewee !== "Student" ? (
                <>
                  <div className="flex flex-col items-center bg-white rounded-full shadow-lg p-4 md:min-w-[320px] min-w-full">
                    <label className="font-extrabold text-lg mb-2 text-[#F05A1A] tracking-wide" htmlFor="department">{language ? "Department:" : ":القسم"}</label>
                    <Selector2
                      label="department"
                      title=""
                      description={language ? "Please Select a Department" : "الرجاء اختيار القسم"}
                      data={departments}
                      value={selectedDepartment}
                      onChange={handleDepartmentChange}
                      name="Name"
                      selectCSS="rounded-full shadow-md focus:ring-2 focus:ring-[#F05A1A] border-2 border-gray-200 focus:border-[#F05A1A] px-6 py-2 text-lg"
                    />
                  </div>
                  <div className="flex flex-col items-center bg-white rounded-full shadow-lg p-4 md:min-w-[320px] min-w-full">
                    <label className="font-extrabold text-lg mb-2 text-[#F05A1A] tracking-wide" htmlFor="user">{language ? "Trainer:" : ":المدرب"}</label>
                    <Selector2
                      label="user"
                      title=""
                      description={language ? "Please Select a Teacher" : "الرجاء اختيار المعلم"}
                      data={filteredUsers}
                      value={selectedUser}
                      onChange={handleUserChange}
                      name="userEmp"
                      selectCSS="rounded-full shadow-md focus:ring-2 focus:ring-[#F05A1A] border-2 border-gray-200 focus:border-[#F05A1A] px-6 py-2 text-lg"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="flex flex-col items-center bg-white rounded-full shadow-lg p-4 md:min-w-[320px] min-w-full">
                    <label className="font-extrabold text-lg mb-2 text-[#F05A1A] tracking-wide" htmlFor="department">{language ? "Course:" : ":الدورة"}</label>
                    <Selector2
                      label="class"
                      title=""
                      description={language ? "please select a class" : "الرجاء اختيار المهنة"}
                      data={classes}
                      value={selectedClass}
                      onChange={handleClassChange}
                      name="name"
                      selectCSS="rounded-full shadow-md focus:ring-2 focus:ring-[#F05A1A] border-2 border-gray-200 focus:border-[#F05A1A] px-6 py-2 text-lg"
                    />
                  </div>
                  <div className="flex flex-col items-center bg-white rounded-full shadow-lg p-4 md:min-w-[320px] min-w-full">
                    <label className="font-extrabold text-lg mb-2 text-[#F05A1A] tracking-wide" htmlFor="user">{language ? "Trainee:" : ":المتدرب"}</label>
                    <select
                      className="rounded-full shadow-md focus:ring-2 focus:ring-[#F05A1A] border-2 border-gray-200 focus:border-[#F05A1A] px-6 py-2 text-lg"
                      id="user"
                      name="user"
                      onChange={(e) => handleUserChange(e)}
                    >
                      <option value="" disabled selected>
                        {language ? "please select a trainee" : "الرجاء اختيار المتدرب"}
                      </option>
                      {filteredStudents.map((student) => (
                        <option
                          value={student.user_id}
                          key={student.user_id}
                        >{`${student.first_name} ${student.middle_name} ${student.last_name}`}</option>
                      ))}
                    </select>
                  </div>
                </>
              ) : null : null}
              {formType[0] === "curriculum" && (
                <div className="flex flex-col items-center bg-white rounded-full shadow-lg p-4 md:min-w-[320px] min-w-full">
                  <label className="font-extrabold text-lg mb-2 text-[#F05A1A] tracking-wide" htmlFor="curriculum">{language ? "Curriculum:" : ":المنهج"}</label>
                  <Selector2
                    label="curriculum"
                    title=""
                    description={language ? "Please select a Curriculum" : "الرجاء اختيار المنهج"}
                    data={curriculums}
                    value={selectedCurriculum}
                    onChange={handleCurriculumChange}
                    name="code"
                    selectCSS="rounded-full shadow-md focus:ring-2 focus:ring-[#F05A1A] border-2 border-gray-200 focus:border-[#F05A1A] px-6 py-2 text-lg"
                  />
                </div>
              )}
              {userInfo.user_role === "Operations Excellence Lead" && (
                <WatomsVtcFilter onVtcChange={handleVtcChange} />
              )}
            </div>
          )}

          {/* Section Content or Review Step */}
          {!showReview ? (
            <div className={`w-full ${fadeClass}`} key={activeStep}>
              <div className="mb-2">
                <div className="text-lg font-bold mb-2 px-2 py-1 rounded bg-gradient-to-br from-[#181E41] to-[#F05A1A] text-white shadow flex items-center gap-2" style={{ fontFamily: 'Inter,sans-serif' }}>
                  <span>{sectionEntries[activeStep][0]}</span>
                  <span className="ml-2 text-xs font-normal text-orange-100">{sectionEntries[activeStep][1].length} سؤال</span>
                  <span className="ml-2 text-xs text-white/80 cursor-pointer" title={language ? 'Section info' : 'معلومات القسم'}>ℹ️</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sectionEntries[activeStep][1].map((question, index) => (
                    <div
                      key={question.question_id}
                      className="bg-gradient-to-br from-[#f7f8fa] to-[#e9eaf3] rounded-xl shadow border border-gray-100 p-5 flex flex-col items-center min-h-[120px] transition-all duration-200 hover:shadow-xl hover:scale-[1.025] focus-within:ring-2 focus-within:ring-orange-300"
                      tabIndex={0}
                    >
                      <h3 className="text-base font-bold mb-4 w-full text-gray-800 text-center" style={{ fontFamily: 'Inter,sans-serif' }}>
                        {question.title}
                      </h3>
                      <div className="flex flex-row justify-center gap-4 w-full">
                        {Array.from({ length: question.max_score }, (_, i) => (
                          <label
                            key={i}
                            className="flex flex-col items-center cursor-pointer group"
                          >
                            <input
                              type="radio"
                              name={`question:${question.question_id}`}
                              value={language ? i + 1 : question.max_score - i}
                              className="accent-wisdomOrange w-6 h-6 mb-1 group-hover:scale-110 transition-transform focus:ring-2 focus:ring-orange-400"
                              onChange={handleRadioChange}
                              checked={answers[`question:${question.question_id}`] === (language ? i + 1 : question.max_score - i)}
                            />
                            <span className="text-base font-semibold text-gray-700">
                              {language ? i + 1 : question.max_score - i}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            // Review Step
            <div className="w-full animate-fadeIn">
              <div className="text-lg font-bold mb-4 px-2 py-1 rounded bg-gradient-to-br from-[#181E41] to-[#F05A1A] text-white shadow flex items-center gap-2" style={{ fontFamily: 'Inter,sans-serif' }}>
                {language ? 'Review your answers before submitting:' : 'راجع إجاباتك قبل الإرسال:'}
              </div>
              <div className="flex flex-col gap-4">
                {sectionEntries.map(([section, questions], idx) => (
                  <div key={section} className="border rounded-xl shadow bg-white">
                    <button
                      type="button"
                      className={`w-full flex justify-between items-center px-6 py-4 text-lg font-bold rounded-t-xl focus:outline-none transition-colors ${openReviewSection === idx ? 'bg-gradient-to-br from-[#181E41] to-[#F05A1A] text-white' : 'bg-gray-100 text-gray-800 hover:bg-orange-50'}`}
                      onClick={() => setOpenReviewSection(openReviewSection === idx ? -1 : idx)}
                      style={{ fontFamily: 'Inter,sans-serif' }}
                    >
                      <span>{section}</span>
                      <span className="text-sm font-normal">
                        {questions.filter(q => answers[`question:${q.question_id}`] !== undefined && answers[`question:${q.question_id}`] !== null).length}
                        {" / "}
                        {questions.length} {language ? 'answered' : 'سؤال'}
                      </span>
                    </button>
                    {openReviewSection === idx && (
                      <div className="px-6 py-4 flex flex-col gap-2">
                        {questions.map((question) => {
                          const score = answers[`question:${question.question_id}`];
                          return (
                            <div key={question.question_id} className="flex justify-between items-center border-b py-2 last:border-b-0">
                              <span className="text-gray-800 font-semibold">{question.title}</span>
                              <span className="text-gray-700 font-bold">
                                {score !== null && score !== undefined
                                  ? score
                                  : <span className="text-red-500">{language ? 'Not answered' : 'لم يتم الإجابة'}</span>}
                              </span>
                            </div>
                          );
                        })}
                        <div className="flex justify-end mt-2">
                          <button
                            type="button"
                            className="px-4 py-2 rounded-full bg-gradient-to-br from-[#181E41] to-[#F05A1A] text-white font-bold shadow hover:scale-105 transition-all"
                            onClick={() => { setActiveStep(idx); setShowReview(false); }}
                          >
                            {language ? 'Edit Section' : 'تعديل القسم'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sticky Action Bar for Navigation/Submit */}
          <div className="fixed bottom-8 left-0 w-full flex justify-center z-50 pointer-events-none">
            <div className="flex gap-4 pointer-events-auto">
              {!showReview && (
                <>
                  <button
                    type="button"
                    className="px-8 py-3 rounded-2xl text-white font-bold text-lg shadow-lg bg-gradient-to-br from-[#181E41] to-[#F05A1A] hover:from-[#181E41] hover:to-orange-600 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-orange-200"
                    onClick={() => setActiveStep((s) => Math.max(0, s - 1))}
                    disabled={activeStep === 0}
                  >
                    {language ? 'Back' : 'السابق'}
                  </button>
                  {activeStep < sectionEntries.length - 1 && (
                    <button
                      type="button"
                      className="px-8 py-3 rounded-2xl text-white font-bold text-lg shadow-lg bg-gradient-to-br from-[#181E41] to-[#F05A1A] hover:from-[#181E41] hover:to-orange-600 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-orange-200"
                      onClick={() => setActiveStep((s) => Math.min(sectionEntries.length - 1, s + 1))}
                    >
                      {language ? 'Next' : 'التالي'}
                    </button>
                  )}
                  {activeStep === sectionEntries.length - 1 && (
                    <button
                      type="button"
                      className="px-8 py-3 rounded-2xl text-white font-bold text-lg shadow-lg bg-gradient-to-br from-[#181E41] to-[#F05A1A] hover:from-[#181E41] hover:to-orange-600 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-orange-200"
                      onClick={handleReview}
                    >
                      {language ? 'Review & Submit' : 'مراجعة وإرسال'}
                    </button>
                  )}
                </>
              )}
              {showReview && (
                <button
                  id="final-submit-btn"
                  type="submit"
                  className="px-10 py-4 rounded-2xl text-white font-bold text-xl shadow-2xl bg-gradient-to-br from-[#181E41] to-[#F05A1A] hover:from-[#181E41] hover:to-orange-600 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-orange-200 animate-fadeIn"
                >
                  {language ? "Submit" : "أرسال"}
                </button>
              )}
            </div>
          </div>
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

export default TomsForm;