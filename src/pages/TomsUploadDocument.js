import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import "../styles/UploadDocument.css";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { fetchingOrgs, uploadDmsDocument } from "../services/dms";
import { fetchDepartments, fetchDmsCategories } from "../services/data";
import wabys from "../assets/wabys.png";

const TomsUploadDocument = () => {
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
      navigate(`/watoms/dms`);
    } catch (error) {
      console.error("Upload error", error);
      alert("File upload failed");
    }
  };

  useEffect(() => {
    const loadingOrg = async () => {
      try {
        const response = await fetchingOrgs();
        setSchools(response);
      } catch (error) {
        console.error("no files", error);
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

    const loadCategories = async () => {
      try {
        const response = await fetchDmsCategories();
        setCategories(response);
      } catch (err) {
        console.error("API Error:", err);
        setError(err.message || "An error occurred while fetching users data.");
      }
    };

    loadingOrg();
    loadDepartments();
    loadCategories();
    setLoading(false);
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (userInfo.user_role === "Student") {
    return (
      <>
        <div className="bg-formColor w-full h-screen flex flex-col justify-center items-center">
          <img
            className="w-[25%]"
            src={wabys}
            alt=""
          />
          <h1 className="text-6xl font-bold">401</h1>
          <h1 className="text-4xl text-center text-watomsBlue">You are not authorized to view this page.</h1>
          <h1 className="text-4xl text-center text-watomsBlue">Please contact your administrator if you believe this is an error.</h1>
          <button className="bg-wisdomOrange hover:bg-wisdomDarkOrange text-white rounded p-2 m-4" onClick={() => navigate('/pms')}>Go Back</button>
        </div>
      </>
    )
  }

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
                <option key={school.id} value={school.id}>
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
                <option key={department.id} value={department.id}>
                  {department.Name}
                </option>
              ))}
            </select>
          </div> : null}
        </div>
        <label className="w-full text-white">:رفع الملف</label>
        <input type="file" name="file" onChange={handleFileChange} />
        <div className="select-group">
          <div className="select">
            <label className="w-full text-white">:التصنيف</label>
            <select onChange={handleCategoryChange}>
              <option className="text-end" value="" disabled selected>
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
            <label className="w-full text-white">:تصنيف فرعي</label>
            <select
              onClick={handleSubCategoryClick}
              onChange={(e) => setSubCategory(e.target.value)}
            >
              <option className="text-end" value="" disabled selected>
                برجاء اختيار تصنيف فرعي
              </option>
              {selectedCategories.map((subCategory) => (
                <option key={subCategory.id} value={subCategory.id}>
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
