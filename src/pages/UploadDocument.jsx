import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate, Navigate, useLocation } from "react-router-dom";
import { fetchingOrgs, uploadDmsDocument } from "../services/dms";
import { fetchDepartments, fetchDmsCategories } from "../services/data";
import { useLanguage } from "../context/LanguageContext";
import LoadingScreen from "../components/LoadingScreen";
import DenyAccessPage from "../components/DenyAccessPage";

const UploadDocument = () => {
  const location = useLocation();
  const [schools, setSchools] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [file, setFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [organizationId, setOrganizationId] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userInfo } = useAuth();
  const { language } = useLanguage();

  const navigate = useNavigate();

  const handleSubCategoryClick = () => {
    if (!selectedCategory) {
      alert("Please select a category first!");
    }
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setSelectedCategories(categories[e.target.value].subCategory);
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const upload = async (e) => {
    e.preventDefault();
    if (!file || !subCategory || (userInfo.user_role === "Operations Excellence Lead" || userInfo.user_role === "Academic Principle" || userInfo.user_role === "Executive Manager" ? (!departmentId || !organizationId) : false)) {
      return toast.error("Please fill all fields and select a file");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("department_id", userInfo.user_role === "Operations Excellence Lead" || userInfo.user_role === "Academic Principle" || userInfo.user_role === "Executive Manager" ? departmentId : userInfo.department_id);
    formData.append("sub_category", subCategory);
    formData.append("organization_id", userInfo.user_role === "Operations Excellence Lead" || userInfo.user_role === "Academic Principle" || userInfo.user_role === "Executive Manager" ? organizationId : userInfo.organization_id);
    formData.append("user_id", userInfo.id);

    try {
      await uploadDmsDocument(formData);
      setFile(null);
      setDepartmentId("");
      setSubCategory("");
      setOrganizationId("");
      toast.success("Login successful!");
      navigate(`/dms`);
    } catch (error) {
      console.error("Upload error", error);
      alert("File upload failed");
    }
  };

  useEffect(() => {
    const loadingOrg = async () => {
      try {
        const response = await fetchingOrgs(userInfo);
        setSchools(response);
      } catch (error) {
        console.error("no files", error);
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

    const loadCategories = async () => {
      try {
        const response = await fetchDmsCategories(userInfo);
        setCategories(response);
      } catch (err) {
        console.error("API Error:", err);
        setError(err);
      }
    };

    loadingOrg();
    loadDepartments();
    loadCategories();
    setLoading(false);
  }, [userInfo]);

  if (loading) return <LoadingScreen />;
  if (error?.status === 403) return <Navigate to="/login" state={{ from: location }} replace />;
  if (error) return <p>Error: {error.message}</p>;
  if (userInfo.user_role === "Student" || userInfo.user_role === "Trainee") return <DenyAccessPage homePage='/pms' />;
  if (userInfo?.code === 1452) return <DenyAccessPage homePage='/watoms/dashboard' />;
  if (userInfo?.code === 1475) return <DenyAccessPage homePage='/watoms/news' />;
  if (userInfo?.code === 1310) return <DenyAccessPage homePage='/wisdom/dashboard' />;

  return (
    <div className="bg-gray-500 h-[100vh]">
      <Toaster />
      <Navbar upload={true}></Navbar>
      <form onSubmit={upload} className="assignForm form2 bg-slate-600">
        <h1 className="text-2xl font-bold text-white">{language ? "Upload Document" : "رفع الملف"}</h1>
        <div className="select-group">
          {userInfo.user_role === "Operations Excellence Lead" ?
            <div className={`flex flex-col justify-center ${language ? "items-start" : "items-end"}`}>
              <label className=" text-white">{language ? "Organization:" : ":الجهة"}</label>
              <select onChange={(e) => setOrganizationId(e.target.value)}>
                <option value="" disabled selected className={language ? "text-start" : "text-end"}>
                  {language ? "Please Select an organization" : "الرجاء اختيار جهة"}
                </option>
                {schools.map((school) => (
                  <option key={school.id} value={school.id}>
                    {school.name}
                  </option>
                ))}
              </select>
            </div> : null}
          {userInfo.user_role === "Operations Excellence Lead" || userInfo.user_role === "Academic Principle" || userInfo.user_role === "Executive Manager" ?
            <div className={`flex flex-col justify-center ${language ? "items-start" : "items-end"}`}>
              <label className=" text-white">{language ? "Department:" : ":القسم"}</label>
              <select onChange={(e) => setDepartmentId(e.target.value)}>
                <option value="" disabled selected className={language ? "text-start" : "text-end"}>
                  {language ? "Please Select a Department" : "الرجاء اختيار القسم"}
                </option>
                {departments.map((department) => (
                  <option key={department.id} value={department.id}>
                    {department.Name}
                  </option>
                ))}
              </select>
            </div> : null}
        </div>
        <label className={`w-full flex flex-col  text-white justify-center ${language ? "items-start" : "items-end"}`}>{language ? "Attach File:" : ":رفع ملف"}</label>
        <input type="file" name="file" className="bg-white" onChange={handleFileChange} />
        <div className="select-group">
          <div className={`flex flex-col justify-center ${language ? "items-start" : "items-end"}`}>
            <label className=" text-white">{language ? "Category:" : ":التصنيف"}</label>
            <select onChange={handleCategoryChange}>
              <option value="" disabled selected className={language ? "text-start" : "text-end"}>
                {language ? "Please Select a Category" : "الرجاء اختيار تصنيف"}
              </option>
              {categories.map((category, index) => (
                <option key={index} value={index}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className={`flex flex-col justify-center ${language ? "items-start" : "items-end"}`}>
            <label className=" text-white">{language ? "Sub-Category:" : ":التصنيف الفرعي"}</label>
            <select
              onClick={handleSubCategoryClick}
              onChange={(e) => setSubCategory(e.target.value)}
            >
              <option value="" disabled selected className={language ? "text-start" : "text-end"}>
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
        <button className="bg-wisdomOrange hover:bg-wisdomDarkOrange text-white rounded p-2">
          {language ? "Submit" : "ارسال"}
        </button>
      </form>
    </div>
  );
};

export default UploadDocument;
