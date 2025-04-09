import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import "../styles/UploadDocument.css";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { fetchingOrgs, uploadDmsDocument } from "../services/dms";
import { fetchDepartments, fetchDmsCategories } from "../services/data";

const UploadDocument = () => {
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
    if (!file || !departmentId || !subCategory || !organizationId) {
      return alert("Please fill all fields and select a file");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("department_id", departmentId);
    formData.append("sub_category", subCategory);
    formData.append("organization_id", organizationId);
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

  return (
    <div className="bg-gray-500 h-[100vh]">
      <Toaster />
      <Navbar upload={true} length="2-[400px]"></Navbar>
      <form onSubmit={upload} className="assignForm form2">
        <h1 className="text-2xl font-bold">Upload Document</h1>
        <div className="select-group">
          <div className="select">
            <label>Organization:</label>
            <select onChange={(e) => setOrganizationId(e.target.value)}>
              <option value="" disabled selected>
                Please Select an organization
              </option>
              {schools.map((school) => (
                <option key={school.id} value={school.id}>
                  {school.name}
                </option>
              ))}
            </select>
          </div>
          <div className="select">
            <label>Department:</label>
            <select onChange={(e) => setDepartmentId(e.target.value)}>
              <option value="" disabled selected>
                Please Select a Department
              </option>
              {departments.map((department) => (
                <option key={department.id} value={department.id}>
                  {department.Name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <label className="w-full">Attach File:</label>
        <input type="file" name="file" onChange={handleFileChange} />
        <div className="select-group">
          <div className="select">
            <label>Category:</label>
            <select onChange={handleCategoryChange}>
              <option value="" disabled selected>
                Please Select a Category
              </option>
              {categories.map((category, index) => (
                <option key={index} value={index}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="select">
            <label>Sub-Category:</label>
            <select
              onClick={handleSubCategoryClick}
              onChange={(e) => setSubCategory(e.target.value)}
            >
              <option value="" disabled selected>
                Please Select a Sub-Category
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
          Submit
        </button>
      </form>
    </div>
  );
};

export default UploadDocument;
