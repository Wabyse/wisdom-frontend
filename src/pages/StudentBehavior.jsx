import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate, Navigate, useLocation } from "react-router-dom";
import {
  fetchBehaviorCategories,
  fetchClasses,
  fetchShools,
  fetchStages,
  fetchStudents,
} from "../services/data";
import { submitBehavior } from "../services/pms";
import { useAuth } from "../context/AuthContext";
import LoadingScreen from "../components/LoadingScreen";
import DenyAccessPage from "../components/DenyAccessPage";
import { useLanguage } from "../context/LanguageContext";
import Popup from "../components/Popup";
import Selector2 from "../components/Selector2";

const StudentBehavior = () => {
  const location = useLocation();
  const [submitted, setSubmitted] = useState(false);
  const [schools, setSchools] = useState([]);
  const [schoolId, setSchoolId] = useState("");
  const [stages, setStages] = useState([]);
  const [selectedStages, setSelectedStages] = useState("");
  const [classes, setClasses] = useState([]);
  const [selectedClasses, setSelectedClasses] = useState("");
  const [unfilteredClasses, setUnfilteredClasses] = useState([]);
  const [students, setStudnets] = useState([]);
  const [selectedStudents, setSelectedStudnets] = useState("");
  const [unfilteredstudents, setUnfilteredStudnets] = useState([]);
  const [comment, setComment] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [date, setDate] = useState("");
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [subCategory, setSubCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userInfo } = useAuth();
  const { language } = useLanguage();

  const navigate = useNavigate();

  const handleSubCategoryClick = () => {
    if (!selectedCategory) {
      toast.error("Please select a category first!");
    }
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setSelectedTypes(categories[e.target.value].behaviorType);
  };

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleDateChange = (event) => {
    setDate(event.target.value);
  };

  useEffect(() => {
    let filtered = unfilteredstudents;
    let filteredClass = unfilteredClasses;

    if (schoolId !== "" && schoolId !== "All") {
      filtered = filtered.filter(
        (student) => student.school_id === Number(schoolId)
      );
    }

    if (selectedClasses !== "" && selectedClasses !== "All") {
      filtered = filtered.filter(
        (student) => student.class_id === Number(selectedClasses)
      );
    }

    if (selectedStages !== "" && selectedStages !== "All") {
      filteredClass = filteredClass.filter(
        (filterclass) => filterclass.stage_id === Number(selectedStages)
      );

      const filterStageStudent = filteredClass.map((tested) => tested.id);

      filtered = filtered.filter((student) =>
        filterStageStudent.includes(student.class_id)
      );
    }

    setClasses(filteredClass);
    setStudnets(filtered);
  }, [
    schoolId,
    selectedClasses,
    unfilteredstudents,
    selectedStages,
    unfilteredClasses,
  ]);

  const upload = async (e) => {
    e.preventDefault();

    if (!subCategory || !schoolId || !selectedStudents) {
      return toast.error("Please fill all fields");
    }

    const payload = {
      comment,
      offender_id: Number(selectedStudents),
      social_worker_id: userInfo.id,
      type: Number(subCategory),
      behavior_date: new Date(date).toISOString(), // ensure ISO format
    };

    try {
      await submitBehavior(payload);
      toast.success(language ? "Case has been submitted successfully" : "تم تسجيل البيانات بنجاح");
      setSubmitted(true);
    } catch (error) {
      console.error("Upload error", error);
      toast.error("Submission failed. Please try again.");
    }
  };


  useEffect(() => {
    const loadingOrg = async () => {
      try {
        const response = await fetchShools();
        setSchools(response);
      } catch (error) {
        console.error("no files", error);
      }
    };

    const loadStudents = async () => {
      try {
        const response = await fetchStudents();
        setStudnets(response);
        setUnfilteredStudnets(response);
      } catch (err) {
        console.error("API Error:", err);
        setError(err);
      }
    };

    const loadClasses = async () => {
      try {
        const response = await fetchClasses();
        setClasses(response);
        setUnfilteredClasses(response);
      } catch (err) {
        console.error("API Error:", err);
        setError(err);
      }
    };

    const loadStages = async () => {
      try {
        const response = await fetchStages();
        setStages(response);
      } catch (err) {
        console.error("API Error:", err);
        setError(err);
      }
    };

    const loadCategories = async () => {
      try {
        const response = await fetchBehaviorCategories();
        setCategories(response);
      } catch (err) {
        console.error("API Error:", err);
        setError(err);
      }
    };

    loadStudents();
    loadClasses();
    loadStages();
    loadingOrg();
    loadCategories();
    setLoading(false);
  }, []);

  const closePopup = () => {
    setSubmitted(false)
    navigate('/pms');
  };


  if (loading) return <LoadingScreen />;
  if (error?.status === 403) return <Navigate to="/login" state={{ from: location }} replace />;
  if (error) return <p>Error: {error.message}</p>;
  if (userInfo.user_role !== "Operations Excellence Lead" && userInfo.user_role !== "Supervisor") return <DenyAccessPage homePage='/pms' />;

  return (
    <div className="bg-gray-500 h-[100vh]">
      <Toaster />
      <Navbar upload={true} />
      <form onSubmit={upload} className="assignForm form2 bg-slate-600">
        <h1 className="text-2xl font-bold text-white">{language ? "Student Behavior" : "سلوك الطالب"}</h1>
        <div className="select-group">
          {userInfo.user_role === "Operations Excellence Lead" && <Selector2
            label="school"
            title={language ? "School:" : ":مدرسة"}
            description={language ? "Please Select a school" : "الرجاء اختيار المدرسة"}
            data={schools}
            value={schoolId}
            onChange={(e) => setSchoolId(e.target.value)}
            name="name"
            labelCSS={`text-white w-full ${language ? "text-start" : "text-end"}`}
            selectCSS={`${language ? "text-start" : "text-end"}`}
          />}
          <Selector2
            label="stage"
            title={language ? "Stage:" : ":المرحلة"}
            description={language ? "Please Select a stage" : "الرجاء اختيار مرحلة"}
            data={stages}
            value={selectedStages}
            onChange={(e) => setSelectedStages(e.target.value)}
            name="name"
            labelCSS={`text-white w-full ${language ? "text-start" : "text-end"}`}
            selectCSS={`${language ? "text-start" : "text-end"}`}
          />
        </div>
        <div className="select-group">
          <Selector2
            label="class"
            title={language ? "Class:" : ":الفصل"}
            description={language ? "Please Select a Class" : "الرجاء اختيار فصل"}
            data={classes}
            value={selectedClasses}
            onChange={(e) => setSelectedClasses(e.target.value)}
            name="name"
            labelCSS={`text-white w-full ${language ? "text-start" : "text-end"}`}
            selectCSS={`${language ? "text-start" : "text-end"}`}
          />
          <Selector2
            label="student"
            title={language ? "Student:" : ":الطالب"}
            description={language ? "Please Select a student" : "الرجاء اختيار طالب"}
            data={students}
            value={selectedStudents}
            onChange={(e) => setSelectedStudnets(e.target.value)}
            name="userStd"
            labelCSS={`text-white w-full ${language ? "text-start" : "text-end"}`}
            selectCSS={`${language ? "text-start" : "text-end"}`}
          />
        </div>
        <label htmlFor="comment" className={`text-white w-full ${language ? "text-start" : "text-end"}`}>{language ? "Comment:" : ":تعليق"}</label>
        <input
          type="text"
          name="comment"
          id="comment"
          onChange={handleCommentChange}
          className={!language && "text-end"}
        />
        <div className="select-group">
          <Selector2
            label="category"
            title={language ? "Category:" : ":التصنيف"}
            description={language ? "Please Select a Category" : "الرجاء اختيار تصنيف"}
            data={categories}
            value={selectedCategory}
            onChange={handleCategoryChange}
            name="name"
            labelCSS={`text-white w-full ${language ? "text-start" : "text-end"}`}
            selectCSS={`${language ? "text-start" : "text-end"}`}
            keyType={true}
          />
          <Selector2
            label="type"
            title={language ? "Type:" : ":النوع"}
            description={language ? "Please Select a Type" : "الرجاء اختيار نوع"}
            data={selectedTypes}
            value={subCategory}
            onClick={handleSubCategoryClick}
            onChange={(e) => setSubCategory(e.target.value)}
            name="name"
            labelCSS={`text-white w-full ${language ? "text-start" : "text-end"}`}
            selectCSS={`${language ? "text-start" : "text-end"}`}
            keyType={true}
          />
        </div>
        <div className="select">
          <label className={`text-white ${!language && "w-full text-end"}`}>{language ? "Date:" : ":تاريخ"}</label>
          <input type="date" onChange={handleDateChange} />
        </div>
        <button className="bg-wisdomOrange hover:bg-wisdomDarkOrange text-white rounded p-2">{language ? "Submit" : "ارسال"}</button>
      </form>
      <Popup
        isOpen={submitted}
        onClose={closePopup}
        message={language ? "Case has been submitted successfully" : "تم تسجيل البيانات بنجاح"}
      />
    </div>
  );
};

export default StudentBehavior;
