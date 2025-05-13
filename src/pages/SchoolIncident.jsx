import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate, Navigate, useLocation } from "react-router-dom";
import { fetchIncidentCategories, fetchShools } from "../services/data";
import { submitIncident } from "../services/pms";
import { useAuth } from "../context/AuthContext";
import LoadingScreen from "../components/LoadingScreen";
import DenyAccessPage from "../components/DenyAccessPage";
import { useLanguage } from "../context/LanguageContext";
import Popup from "../components/Popup";

const SchoolIncident = () => {
  const urlLocation = useLocation();
  const [submitted, setSubmitted] = useState(false);
  const [schools, setSchools] = useState([]);
  const [comment, setComment] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [file, setFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [schoolId, setSchoolId] = useState("");
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
    setSelectedCategories(categories[e.target.value].incidentSubCategories);
  };

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleLocationChange = (event) => {
    setLocation(event.target.value);
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleDateChange = (event) => {
    setDate(event.target.value);
  };

  const upload = async (e) => {
    e.preventDefault();
    if (!subCategory || (userInfo.user_role !== "Operations Excellence Lead" ? false : !schoolId)) {
      return toast.error("Please fill all fields and select a file");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("sub_category", subCategory);
    formData.append("school_id", userInfo.user_role !== "Operations Excellence Lead" ? userInfo.organization_id : schoolId);
    formData.append("comment", comment);
    formData.append("location", location);
    formData.append("incident_date", date);

    try {
      await submitIncident(formData);
      setFile(null);
      setSubCategory("");
      setSchoolId("");
      toast.success(language ? "Incident has been submitted" : "تم تسجيل الحادثة");
      setSubmitted(true);
    } catch (error) {
      console.error("Upload error", error);
      alert("File upload failed");
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

    const loadCategories = async () => {
      try {
        const response = await fetchIncidentCategories();
        setCategories(response);
      } catch (err) {
        console.error("API Error:", err);
        setError(err);
      }
    };

    loadingOrg();
    loadCategories();
    setLoading(false);
  }, []);

  const closePopup = () => {
    setSubmitted(false)
    navigate('/pms');
  };

  if (loading) return <LoadingScreen />;
  if (error?.status === 403) return <Navigate to="/login" state={{ from: urlLocation }} replace />;
  if (error) return <p>Error: {error.message}</p>;
  if (userInfo.user_role !== "Operations Excellence Lead" && userInfo.user_role !== "Supervisor") return <DenyAccessPage homePage='/pms' />;

  return (
    <div className="bg-gray-500 h-[115vh]">
      <Toaster />
      <Navbar upload={true} length="w-[440px]"></Navbar>
      <form onSubmit={upload} className="assignForm form2 bg-slate-600">
        <h1 className="text-2xl font-bold text-white">{language ? "School Incident" : "حوادث المدرسة"}</h1>
        {userInfo.user_role === "Operations Excellence Lead" ?
          <div className={language ? "text-start" : "text-end"}>
            <label className="text-white">{language ? "School:" : ":المدرسة"}</label>
            <select onChange={(e) => setSchoolId(e.target.value)} className={!language && "text-end"}>
              <option value="" disabled selected>
                {language ? "Please Select a school" : "الرجاء اختيار مدرسة"}
              </option>
              {schools.map((school) => (
                <option key={school.id} value={school.id}>
                  {school.name}
                </option>
              ))}
            </select>
          </div>
          : null}
        <label htmlFor="comment" className={`w-full text-white ${!language && "text-end"}`}>{language ? "Comment:" : ":تعليق"}</label>
        <input type="text" name="comment" id="comment" className={!language && "text-end"} onChange={handleCommentChange} />
        <label htmlFor="location" className={`w-full text-white ${!language && "text-end"}`}>{language ? "Location:" : ":موقع الحادث"}</label>
        <input type="text" name="location" id="location" className={!language && "text-end"} onChange={handleLocationChange} />
        <label className={`w-full text-white ${!language && "text-end"}`}>{language ? "Attach File:" : ":رفع ملف"}</label>
        <input type="file" name="file" className="bg-white" onChange={handleFileChange} />
        <div className="select-group">
          <div className={`select ${!language && "text-end"}`}>
            <label className="text-white w-full">{language ? "Category:" : ":التصنيف"}</label>
            <select onChange={handleCategoryChange} className={!language && "text-end"}>
              <option value="" disabled selected>
                {language ? "Please Select a Category" : "الرجاء اختيار تصنيف"}
              </option>
              {categories.map((category, index) => (
                <option key={index} value={index}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className={`select ${!language && "text-end"}`}>
            <label className="text-white w-full">{language ? "Sub-Category:" : ":التصنيف الفرعي"}</label>
            <select
              onClick={handleSubCategoryClick}
              onChange={(e) => setSubCategory(e.target.value)}
              className={!language && "text-end"}
            >
              <option value="" disabled selected>
                {language ? "Please Select a Sub-Category" : "الرجاء اختيار تصنيف فرعي"}
              </option>
              {selectedCategories.map((subCategory) => (
                <option key={subCategory.id} value={subCategory.id}>
                  {subCategory.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className={`select ${!language && "text-end"}`}>
          <label className="text-white w-full">{language ? "Date:" : ":تاريخ"}</label>
          <input type="date" onChange={handleDateChange} />
        </div>
        <button className="bg-wisdomOrange hover:bg-wisdomDarkOrange text-white p-2 rounded">{language ? "Submit" : "ارسال"}</button>
      </form>
      <Popup
        isOpen={submitted}
        onClose={closePopup}
        message={language ? "Incident has been submitted successfully" : "تم تسجيل الحادثة بنجاح"}
      />
    </div>
  );
};

export default SchoolIncident;
