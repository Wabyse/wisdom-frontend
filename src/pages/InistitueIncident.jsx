import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
// import SchoolIncidentCSS from "../styles/SchoolIncident.module.css";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate, Navigate, useLocation } from "react-router-dom";
import { fetchIncidentCategories, fetchSchools } from "../services/data";
import { submitIncident } from "../services/pms";
import { useAuth } from "../context/AuthContext";
import LoadingScreen from "../components/LoadingScreen";
import DenyAccessPage from "../components/DenyAccessPage";
import Popup from "../components/Popup";
import Selector2 from "../components/Selector2";

const InistituteIncident = () => {
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
      toast.success("تم تسجيل الواقعة");
      setSubmitted(true);
    } catch (error) {
      console.error("Upload error", error);
      toast.error("File upload failed");
    }
  };

  useEffect(() => {
    const loadingOrg = async () => {
      try {
        const response = await fetchSchools();
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
        setError(err.message || "An error occurred while fetching users data.");
      }
    };

    loadingOrg();
    loadCategories();
    setLoading(false);
  }, []);

  const closePopup = () => {
    setSubmitted(false)
    navigate('/watoms/pms');
  };

  if (loading) return <LoadingScreen />;
  if (error?.status === 403) return <Navigate to="/login" state={{ from: urlLocation }} replace />;
  if (error) return <p>Error: {error.message}</p>;
  if (userInfo.user_role !== "Operations Excellence Lead" && userInfo.user_role !== "Supervisor") return <DenyAccessPage homePage='/watoms/pms' />;
  if (userInfo?.code === 1452) return <DenyAccessPage homePage='/watoms/dashboard' />;
  if (userInfo?.code === 1475) return <DenyAccessPage homePage='/watoms/news' />;
  if (userInfo?.code === 1310) return <DenyAccessPage homePage='/wisdom/dashboard' />;

  return (
    <div className="bg-gray-500 h-[115vh]">
      <Toaster />
      <Navbar showNavigate={false} upload={true} />
      <form onSubmit={upload} className="assignForm form2 bg-slate-600">
        <h1 className="text-2xl font-bold text-white">وقائع المركز</h1>
        {userInfo.user_role === "Operations Excellence Lead" && <Selector2
          label="institution"
          title=":المركز"
          description="برجاء اختيار مركز"
          data={schools}
          value={schoolId}
          onChange={(e) => setSchoolId(e.target.value)}
          name="name"
          extraCSS="md:w-[25%] w-full"
          labelCSS="text-white"
          selectCSS="text-end"
        />}
        <label htmlFor="comment" className="text-white">:تعليق</label>
        <input type="text" name="comment" id="comment" className="text-end" onChange={handleCommentChange} />
        <label htmlFor="location" className="text-white">:المكان</label>
        <input type="text" name="location" id="location" className="text-end" onChange={handleLocationChange} />
        <label className="text-white">:رفع الملف</label>
        <input type="file" name="file" className="bg-white" onChange={handleFileChange} />
        <div className="select-group">
          <Selector2
            label="subCategory"
            title=":تصنيف فرعي"
            description="برجاء اختيار تصنيف"
            data={selectedCategories}
            value={subCategory}
            onChange={(e) => setSubCategory(e.target.value)}
            onClick={handleSubCategoryClick}
            name="name"
            labelCSS="text-white text-end w-full"
            selectCSS="text-end"
          />
          <Selector2
            label="category"
            title=":التصنيف"
            description="برجاء اختيار تصنيف"
            data={categories}
            value={selectedCategory}
            onChange={handleCategoryChange}
            name="name"
            labelCSS="text-white text-end w-full"
            selectCSS="text-end"
            keyType={true}
          />
        </div>
        <div className="select">
          <label className="w-full text-center text-white">:التاريخ</label>
          <input type="date" onChange={handleDateChange} />
        </div>
        <button className="bg-wisdomOrange hover:bg-wisdomDarkOrange text-white rounded p-2">ارسال</button>
      </form>
      <Popup
        isOpen={submitted}
        onClose={closePopup}
        message="تم تسجيل الواقعة بنجاح"
      />
    </div>
  );
};

export default InistituteIncident;