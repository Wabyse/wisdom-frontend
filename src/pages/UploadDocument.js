import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import "../styles/UploadDocument.css";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL;

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
      await axios.post(`${BASE_URL}/api/v1/files/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
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
    const fetchingOrg = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/v1/forms/AllOrgs`,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        setSchools(response.data.data);
      } catch (error) {
        console.error("no files", error);
      }
    };
    fetchingOrg();
  }, []);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/v1/forms/AllDepartments`,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        setDepartments(response.data?.data || []);
      } catch (err) {
        console.error("API Error:", err);
        setError(
          err.message || "An error occurred while fetching curriculums data."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/v1/files/categories`,
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        setCategories(response.data?.categories || []);
      } catch (err) {
        console.error("API Error:", err);
        setError(err.message || "An error occurred while fetching users data.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <Toaster />
      <Navbar></Navbar>
      <form onSubmit={upload} className="assignForm form2">
        <h1>Upload Document</h1>
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
        <label>Attach File:</label>
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
        <button>Submit</button>
      </form>
    </>
  );
};

export default UploadDocument;
