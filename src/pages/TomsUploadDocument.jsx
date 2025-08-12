import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate, Navigate, useLocation } from "react-router-dom";
import { fetchingOrgs, uploadDmsDocument } from "../services/dms";
import { fetchDepartments, fetchDmsCategories } from "../services/data";
import LoadingScreen from "../components/LoadingScreen";
import DenyAccessPage from "../components/DenyAccessPage";

const TomsUploadDocument = () => {
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

    const needsDeptOrg = ["Operations Excellence Lead", "Academic Principle", "Executive Manager"].includes(userInfo.user_role);
    if (
      !file ||
      !subCategory ||
      (needsDeptOrg && (!departmentId || !organizationId))
    ) {
      return toast.error("Please fill all fields and select a file");
    }

    // Sanity checks (optional but helpful when debugging)
    console.log("file.name", file?.name, "file.size", file?.size);

    const formData = new FormData();
    // Include the filename explicitly
    formData.append("file", file, file.name);
    formData.append("department_id", needsDeptOrg ? departmentId : userInfo.department_id);
    formData.append("sub_category", subCategory);
    formData.append("organization_id", needsDeptOrg ? organizationId : userInfo.organization_id);
    formData.append("user_id", userInfo.id);

    try {
      await uploadDmsDocument(formData);
      setFile(null);
      setDepartmentId("");
      setSubCategory("");
      setOrganizationId("");
      toast.success("File uploaded successfully!"); // <-- this was saying "Login successful!"
      navigate(`/watoms/dms`);
    } catch (error) {
      console.error("Upload error", error?.response?.data || error.message);
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
  if (userInfo.user_role === "Student" || userInfo.user_role === "Trainee") return <DenyAccessPage homePage='/watoms/pms' />;

  return (
    <div className="bg-gray-500 h-[100vh] text-end">
      <Toaster />
      <Navbar showNavigate={false} upload={true}></Navbar>
      <form onSubmit={upload} className="assignForm form2 bg-slate-600">
        <h1 className="text-2xl font-bold text-white">رفع ملف</h1>
        <div className="select-group">
          {userInfo.user_role === "Operations Excellence Lead" ? <div className="select">
            <label className="w-full text-white">:المركز</label>
            <select onChange={(e) => setOrganizationId(e.target.value)}>
              <option className="text-end" value="" disabled selected>
                برجاء اختيار مركز
              </option>
              {schools.map((school) => (
                <option key={school.id} value={school.id} className="text-end">
                  {school.name}
                </option>
              ))}
            </select>
          </div> : null}
          {userInfo.user_role === "Operations Excellence Lead" ? <div className="select">
            <label className="w-full text-white">:المهنة</label>
            <select onChange={(e) => setDepartmentId(e.target.value)}>
              <option className="text-end" value="" disabled selected>
                برجاء اختيار مهنة
              </option>
              {departments.map((department) => (
                <option key={department.id} value={department.id} className="text-end">
                  {department.Name}
                </option>
              ))}
            </select>
          </div> : null}
        </div>
        <label className="w-full text-white">:رفع الملف</label>
        <input type="file" name="file" className="bg-white" onChange={handleFileChange} />
        <div className="select-group">
          <div className="select">
            <label className="w-full text-white">:التصنيف</label>
            <select onChange={handleCategoryChange}>
              <option className="text-end" value="" disabled selected>
                برجاء اختيار تصنيف
              </option>
              {categories.map((category, index) => (
                <option key={index} value={index} className="text-end">
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="select">
            <label className="w-full text-white">:تصنيف فرعي</label>
            <select
              onClick={handleSubCategoryClick}
              onChange={(e) => setSubCategory(e.target.value)}
            >
              <option className="text-end" value="" disabled selected>
                برجاء اختيار تصنيف فرعي
              </option>
              {selectedCategories.map((subCategory) => (
                <option key={subCategory.id} value={subCategory.id} className="text-end">
                  {subCategory.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button className="bg-wisdomOrange hover:bg-wisdomDarkOrange text-white p-2 rounded">
          ارسال
        </button>
      </form>
    </div>
  );
};

export default TomsUploadDocument;