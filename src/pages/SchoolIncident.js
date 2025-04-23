import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
// import SchoolIncidentCSS from "../styles/SchoolIncident.module.css";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { fetchIncidentCategories, fetchShools } from "../services/data";
import { submitIncident } from "../services/pms";
import { useAuth } from "../context/AuthContext";
import LoadingScreen from "../components/LoadingScreen";
import DenyAccessPage from "../components/DenyAccessPage";

const SchoolIncident = () => {
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
      navigate(`/pms`);
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
        setError(err.message || "An error occurred while fetching users data.");
      }
    };

    loadingOrg();
    loadCategories();
    setLoading(false);
  }, []);

  if (loading) return <LoadingScreen />;
  if (error) return <p>Error: {error}</p>;
  if (userInfo.user_role !== "Operations Excellence Lead" || userInfo.user_role !== "Supervisor") return <DenyAccessPage homePage='/pms' />;

  return (
    <div className="bg-gray-500 h-[115vh]">
      <Toaster />
      <Navbar upload={true}></Navbar>
      <form onSubmit={upload} className="assignForm form2">
        <h1 className="text-2xl font-bold">School Incident</h1>
        {userInfo.user_role === "Operations Excellence Lead" ?
          <div className="text-start">
            <label>School:</label>
            <select onChange={(e) => setSchoolId(e.target.value)}>
              <option value="" disabled selected>
                Please Select a school
              </option>
              {schools.map((school) => (
                <option key={school.id} value={school.id}>
                  {school.name}
                </option>
              ))}
            </select>
          </div>
          : null}
        <label htmlFor="comment" className="text-start w-full">Comment:</label>
        <input type="text" name="comment" id="comment" onChange={handleCommentChange} />
        <label htmlFor="location" className="text-start w-full">Location:</label>
        <input type="text" name="location" id="location" onChange={handleLocationChange} />
        <label className="text-start w-full">Attach File:</label>
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
        <div className="select">
          <label>Date:</label>
          <input type="date" onChange={handleDateChange} />
        </div>
        <button className="bg-wisdomOrange hover:bg-wisdomDarkOrange text-white p-2 rounded">Submit</button>
      </form>
    </div>
  );
};

export default SchoolIncident;
