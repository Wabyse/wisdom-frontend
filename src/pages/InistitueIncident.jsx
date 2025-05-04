import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
// import SchoolIncidentCSS from "../styles/SchoolIncident.module.css";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate, Navigate, useLocation } from "react-router-dom";
import { fetchIncidentCategories, fetchShools } from "../services/data";
import { submitIncident } from "../services/pms";
import { useAuth } from "../context/AuthContext";
import LoadingScreen from "../components/LoadingScreen";
import DenyAccessPage from "../components/DenyAccessPage";

const InistituteIncident = () => {
  const urlLocation = useLocation();
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
      toast.success("submitted");
      navigate(`/watoms/pms`);
    } catch (error) {
      console.error("Upload error", error);
      toast.error("File upload failed");
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
        setError(err.message || "An error occurred while fetching users data.");
      }
    };

    loadingOrg();
    loadCategories();
    setLoading(false);
  }, []);

  if (loading) return <LoadingScreen />;
  if (error?.status === 403) return <Navigate to="/login" state={{ from: urlLocation }} replace />;
  if (error) return <p>Error: {error.message}</p>;
  if (userInfo.user_role !== "Operations Excellence Lead" && userInfo.user_role !== "Supervisor") return <DenyAccessPage homePage='/watoms/pms' />;

  return (
    <div className="bg-gray-500 h-[115vh]">
      <Toaster />
      <Navbar showNavigate={false} upload={true}></Navbar>
      <form onSubmit={upload} className="assignForm form2 bg-slate-600">
        <h1 className="text-2xl font-bold text-white">وقائع المركز</h1>
        {userInfo.user_role === "Operations Excellence Lead" ? <div className="flex flex-col justify-center items-center">
          <label className="text-center w-full text-white">المركز:</label>
          <select onChange={(e) => setSchoolId(e.target.value)}>
            <option value="" disabled selected>
              برجاء اختيار مركز
            </option>
            {schools.map((school) => (
              <option key={school.id} value={school.id}>
                {school.name}
              </option>
            ))}
          </select>
        </div> : null}
        <label htmlFor="comment" className="text-white">:تعليق</label>
        <input type="text" name="comment" id="comment" className="text-end" onChange={handleCommentChange} />
        <label htmlFor="location" className="text-white">:المكان</label>
        <input type="text" name="location" id="location" className="text-end" onChange={handleLocationChange} />
        <label className="text-white">:رفع الملف</label>
        <input type="file" name="file" className="bg-white" onChange={handleFileChange} />
        <div className="select-group">
          <div className="select">
            <label className="text-end w-full text-white">:التصنيف</label>
            <select onChange={handleCategoryChange} className="text-right">
              <option value="" disabled selected>
                برجاء اختيار تصنيف
              </option>
              {categories.map((category, index) => (
                <option key={index} value={index}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="select">
            <label className="text-end w-full text-white">:تصنيف فرعي</label>
            <select
              onClick={handleSubCategoryClick}
              onChange={(e) => setSubCategory(e.target.value)}
              className="text-right"
            >
              <option value="" disabled selected>
                برجاء اختيار تصنيف
              </option>
              {selectedCategories.map((subCategory) => (
                <option key={subCategory.id} value={subCategory.id}>
                  {subCategory.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="select">
          <label className="w-full text-center text-white">:التاريخ</label>
          <input type="date" onChange={handleDateChange} />
        </div>
        <button className="bg-wisdomOrange hover:bg-wisdomDarkOrange text-white rounded p-2">ارسال</button>
      </form>
    </div>
  );
};

export default InistituteIncident;