import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate, Navigate, useLocation } from "react-router-dom";
import { fetchingOrgs, uploadDmsDocument } from "../services/dms";
import { fetchDmsCategories, fetchVtcEmployees } from "../services/data";
import LoadingScreen from "../components/LoadingScreen";
import DenyAccessPage from "../components/DenyAccessPage";
import Uploading from "./Uploading";
import { useLanguage } from "../context/LanguageContext";

const TomsUploadDocument = () => {
  const location = useLocation();
  const { userInfo } = useAuth();
  const { language } = useLanguage();
  const [schools, setSchools] = useState([]);
  const [file, setFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [organizationId, setOrganizationId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [employees, setEmployees] = useState([]);

  const navigate = useNavigate();

  const handleSubCategoryClick = () => {
    if (!selectedCategory) {
      alert("Please select a category first!");
    }
  };

  useEffect(() => {
    const filterSubCategories = () => {
      // no category chosen yet → show empty list
      if (!selectedCategory) {
        setSelectedCategories([]);
        return;
      }

      const testing = (Array.isArray(employees) ? employees : []).map(e => ({
        id: e?.employee?.id,
        name: `${e?.employee?.first_name ?? ""} ${e?.employee?.middle_name ?? ""} ${e?.employee?.last_name ?? ""}`
          .trim()
          .replace(/\s+/g, " "),
        organization_id: e?.employee?.organization_id
      }));

      if (categories[selectedCategory]?.name === "شئون عاملين") {
        if (userInfo?.organization_id === 3) {
          if (organizationId === "") {
            setSelectedCategories(testing);
          } else {
            const testing2 = testing.filter(emp =>
              Number(emp?.organization_id) === Number(organizationId)
            );
            setSelectedCategories(testing2);
          }
        } else {
          const testing2 = testing.filter(emp =>
            Number(emp?.organization_id) === Number(userInfo?.organization_id)
          );
          setSelectedCategories(testing2);
        }
      } else {
        const subs = categories[selectedCategory]?.subCategory;
        setSelectedCategories(Array.isArray(subs) ? subs : []);
      }
    };

    filterSubCategories();
  }, [selectedCategory, organizationId, employees, categories, userInfo]);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const upload = async (e) => {
    e.preventDefault();

    const needsDeptOrg = ["Operations Excellence Lead", "Academic Principle", "Executive Manager"].includes(userInfo.user_role);
    if (
      !file ||
      !subCategory ||
      (needsDeptOrg && !organizationId)
    ) {
      return toast.error(language ? "Please fill all fields and select a file" : "الرجاء ملئ كامل البيانات المطلوبة");
    }

    // Sanity checks (optional but helpful when debugging)
    console.log("file.name", file?.name, "file.size", file?.size);

    const formData = new FormData();
    // Include the filename explicitly
    formData.append("file", file, file.name);
    formData.append("sub_category", subCategory);
    formData.append("organization_id", needsDeptOrg ? organizationId : userInfo.organization_id);
    formData.append("user_id", userInfo.id);

    try {
      setUploading(true);
      await uploadDmsDocument(formData);
      setFile(null);
      setSubCategory("");
      setOrganizationId("");
      setUploading(false);
      toast.success("File uploaded successfully!"); // <-- this was saying "Login successful!"
      navigate(`/watoms/dms`);
    } catch (error) {
      setUploading(false);
      console.error("Upload error", error?.response?.data || error.message);
      toast.error(language ? "File upload failed" : "هناك خطا الرجاء المحاولة مرة اخري");
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

    const loadCategories = async () => {
      try {
        const response = await fetchDmsCategories(userInfo);
        setCategories(response);
      } catch (err) {
        console.error("API Error:", err);
        setError(err);
      }
    };

    const loadEmployees = async () => {
      try {
        const response = await fetchVtcEmployees(userInfo);
        setEmployees(response);
      } catch (error) {
        console.error("no files", error);
      }
    };

    loadingOrg();
    loadCategories();
    loadEmployees();
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
        </div>
        <label className="w-full text-white">:رفع الملف</label>
        <input type="file" name="file" className="bg-white" onChange={handleFileChange} />
        <div className="select-group">
          <div className="select">
            <label className="w-full text-white">:التصنيف</label>
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
              <option className="text-end" value="" disabled>
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
              value={subCategory}
              onClick={handleSubCategoryClick}
              onChange={(e) => setSubCategory(e.target.value)}
            >
              <option className="text-end" value="" disabled>
                برجاء اختيار تصنيف فرعي
              </option>
              {(selectedCategories || []).map((sub) => (
                <option key={sub.id} value={sub.id} className="text-end">
                  {sub.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button className="bg-wisdomOrange hover:bg-wisdomDarkOrange text-white p-2 rounded">
          ارسال
        </button>
      </form>
      {uploading && <Uploading />}
    </div>
  );
};

export default TomsUploadDocument;