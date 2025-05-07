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

const StudentBehavior = () => {
  const location = useLocation();
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
      toast.success("Submitted");
      navigate(`/pms`);
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

  if (loading) return <LoadingScreen />;
  if (error?.status === 403) return <Navigate to="/login" state={{ from: location }} replace />;
  if (error) return <p>Error: {error.message}</p>;
  if (userInfo.user_role !== "Operations Excellence Lead" && userInfo.user_role !== "Supervisor") return <DenyAccessPage homePage='/pms' />;

  return (
    <div className="bg-gray-500 h-[100vh]">
      <Toaster />
      <Navbar upload={true} length="400px"></Navbar>
      <form onSubmit={upload} className="assignForm form2 bg-slate-600">
        <h1 className="text-2xl font-bold text-white">{language ? "Student Behavior" : "سلوك الطالب"}</h1>
        <div className="select-group">
          <div className="select">
            <label className={`text-white ${!language && "w-full text-end"}`}>{language ? "School:" : ":مدرسة"}</label>
            <select onChange={(e) => setSchoolId(e.target.value)} className={!language && "w-full text-end"}>
              <option value="" disabled selected>
                {language ? "Please Select a school" : "الرجاء اختيار المدرسة"}
              </option>
              <option value="All">{language ? "All" : "الكل"}</option>
              {schools.map((school) => (
                <option key={school.id} value={school.id}>
                  {school.name}
                </option>
              ))}
            </select>
          </div>
          <div className="select">
            <label className={`text-white ${!language && "w-full text-end"}`}>{language ? "Stage:" : ":المرحلة"}</label>
            <select onChange={(e) => setSelectedStages(e.target.value)} className={!language && "w-full text-end"}>
              <option value="" disabled selected>
                {language ? "Please Select a stage" : "الرجاء اختيار مرحلة"}
              </option>
              <option value="All">{language ? "All" : "الكل"}</option>
              {stages.map((school) => (
                <option key={school.id} value={school.id}>
                  {school.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="select-group">
          <div className="select">
            <label className={`text-white ${!language && "w-full text-end"}`}>{language ? "Class:" : ":الفصل"}</label>
            <select onChange={(e) => setSelectedClasses(e.target.value)} className={!language && "w-full text-end"}>
              <option value="" disabled selected>
                {language ? "Please Select a Class" : "الرجاء اختيار فصل"}
              </option>
              <option value="All">{language ? "All" : "الكل"}</option>
              {classes.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="select">
            <label className={`text-white ${!language && "w-full text-end"}`}>{language ? "Student:" : ":الطالب"}</label>
            <select onChange={(e) => setSelectedStudnets(e.target.value)} className={!language && "w-full text-end"}>
              <option value="" disabled selected>
                {language ? "Please Select a student" : "الرجاء اختيار طالب"}
              </option>
              <option value="All">{language ? "All" : "الكل"}</option>
              {students.map((school) => (
                <option key={school.id} value={school.id}>
                  {`${school.first_name} ${school.middle_name} ${school.last_name}`}
                </option>
              ))}
            </select>
          </div>
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
          <div className="select">
            <label className={`text-white ${!language && "w-full text-end"}`}>{language ? "Catgeory:" : ":التصنيف"}</label>
            <select onChange={handleCategoryChange} className={!language && "w-full text-end"}>
              <option value="" disabled selected>
                {language ? "Please Select a Catgeory" : "الرجاء اختيار تصنيف"}
              </option>
              {categories.map((category, index) => (
                <option key={index} value={index}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="select">
            <label className={`text-white ${!language && "w-full text-end"}`}>{language ? "Type:" : ":النوع"}</label>
            <select
              onClick={handleSubCategoryClick}
              onChange={(e) => setSubCategory(e.target.value)}
              className={!language && "w-full text-end"}
            >
              <option value="" disabled selected>
                {language ? "Please Select a Type" : "الرجاء اختيار نوع"}
              </option>
              {selectedTypes.map((subCategory) => (
                <option key={subCategory.id} value={subCategory.id}>
                  {subCategory.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="select">
          <label className={`text-white ${!language && "w-full text-end"}`}>{language ? "Date:" : ":تاريخ"}</label>
          <input type="date" onChange={handleDateChange} />
        </div>
        <button className="bg-wisdomOrange hover:bg-wisdomDarkOrange text-white rounded p-2">{language ? "Submit" : "ارسال"}</button>
      </form>
    </div>
  );
};

export default StudentBehavior;
