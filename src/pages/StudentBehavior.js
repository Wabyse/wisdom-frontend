import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
// import StudentBehaviorCSS from "../styles/StudentBehavior.module.css";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  fetchBehaviorCategories,
  fetchClasses,
  fetchShools,
  fetchStages,
  fetchStudents,
} from "../services/data";
import { submitBehavior } from "../services/pms";
import { useAuth } from "../context/AuthContext";
import LoadingScreen from "../components/LoadingScreen";
import DenyAccessPage from "../components/DenyAccessPage";

const StudentBehavior = () => {
  const [schools, setSchools] = useState([]);
  const [schoolId, setSchoolId] = useState("");
  const [stages, setStages] = useState([]);
  const [selectedStages, setSelectedStages] = useState("");
  const [classes, setClasses] = useState([]);
  const [selectedClasses, setSelectedClasses] = useState("");
  const [unfilteredClasses, setUnfilteredClasses] = useState([]);
  const [students, setStudnets] = useState([]);
  const [selectedStudents, setSelectedStudnets] = useState("");
  const [unfilteredstudents, setUnfilteredStudnets] = useState([]);
  const [comment, setComment] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [date, setDate] = useState("");
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [subCategory, setSubCategory] = useState("");
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
    setSelectedTypes(categories[e.target.value].behaviorType);
  };

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleDateChange = (event) => {
    setDate(event.target.value);
  };

  useEffect(() => {
    let filtered = unfilteredstudents;
    let filteredClass = unfilteredClasses;

    if (schoolId !== "" && schoolId !== "All") {
      filtered = filtered.filter(
        (student) => student.school_id === Number(schoolId)
      );
    }

    if (selectedClasses !== "" && selectedClasses !== "All") {
      filtered = filtered.filter(
        (student) => student.class_id === Number(selectedClasses)
      );
    }

    if (selectedStages !== "" && selectedStages !== "All") {
      filteredClass = filteredClass.filter(
        (filterclass) => filterclass.stage_id === Number(selectedStages)
      );

      const filterStageStudent = filteredClass.map((tested) => tested.id);

      filtered = filtered.filter((student) =>
        filterStageStudent.includes(student.class_id)
      );
    }

    setClasses(filteredClass);
    setStudnets(filtered);
  }, [
    schoolId,
    selectedClasses,
    unfilteredstudents,
    selectedStages,
    unfilteredClasses,
  ]);

  const upload = async (e) => {
    e.preventDefault();
  
    if (!subCategory || !schoolId || !selectedStudents) {
      return toast.error("Please fill all fields");
    }
  
    const payload = {
      comment,
      offender_id: Number(selectedStudents),
      social_worker_id: userInfo.id,
      type: Number(subCategory),
      behavior_date: new Date(date).toISOString(), // ensure ISO format
    };
  
    console.log("Submitting payload:", payload);
  
    try {
      await submitBehavior(payload);
      toast.success("Submitted");
      navigate(`/pms`);
    } catch (error) {
      console.error("Upload error", error);
      toast.error("Submission failed. Please try again.");
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

    const loadStudents = async () => {
      try {
        const response = await fetchStudents();
        setStudnets(response);
        setUnfilteredStudnets(response);
      } catch (err) {
        console.error("API Error:", err);
        setError(
          err.message || "An error occurred while fetching students data."
        );
      }
    };

    const loadClasses = async () => {
      try {
        const response = await fetchClasses();
        setClasses(response);
        setUnfilteredClasses(response);
      } catch (err) {
        console.error("API Error:", err);
        setError(
          err.message || "An error occurred while fetching students data."
        );
      }
    };

    const loadStages = async () => {
      try {
        const response = await fetchStages();
        setStages(response);
      } catch (err) {
        console.error("API Error:", err);
        setError(
          err.message || "An error occurred while fetching students data."
        );
      }
    };

    const loadCategories = async () => {
      try {
        const response = await fetchBehaviorCategories();
        setCategories(response);
      } catch (err) {
        console.error("API Error:", err);
        setError(err.message || "An error occurred while fetching users data.");
      }
    };

    loadStudents();
    loadClasses();
    loadStages();
    loadingOrg();
    loadCategories();
    setLoading(false);
  }, []);

  if (loading) return <LoadingScreen />;
  if (error) return <p>Error: {error}</p>;
  if (userInfo.user_role !== "ADMIN" || userInfo.user_role !== "Supervisor") return <DenyAccessPage homePage='/pms' />;

  return (
    <div className="bg-gray-500 h-[100vh]">
      <Toaster />
      <Navbar upload={true}></Navbar>
      <form onSubmit={upload} className="assignForm form2">
        <h1 className="text-2xl font-bold">Student Behavior</h1>
        <div className="select-group">
          <div className="select">
            <label>School:</label>
            <select onChange={(e) => setSchoolId(e.target.value)}>
              <option value="" disabled selected>
                Please Select a school
              </option>
              <option value="All">All</option>
              {schools.map((school) => (
                <option key={school.id} value={school.id}>
                  {school.name}
                </option>
              ))}
            </select>
          </div>
          <div className="select">
            <label>Stage:</label>
            <select onChange={(e) => setSelectedStages(e.target.value)}>
              <option value="" disabled selected>
                Please Select a stage
              </option>
              <option value="All">All</option>
              {stages.map((school) => (
                <option key={school.id} value={school.id}>
                  {school.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="select-group">
          <div className="select">
            <label>Class:</label>
            <select onChange={(e) => setSelectedClasses(e.target.value)}>
              <option value="" disabled selected>
                Please Select a Class
              </option>
              <option value="All">All</option>
              {classes.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="select">
            <label>Student:</label>
            <select onChange={(e) => setSelectedStudnets(e.target.value)}>
              <option value="" disabled selected>
                Please Select a student
              </option>
              <option value="All">All</option>
              {students.map((school) => (
                <option key={school.id} value={school.id}>
                  {`${school.first_name} ${school.middle_name} ${school.last_name}`}
                </option>
              ))}
            </select>
          </div>
        </div>
        <label htmlFor="comment">Comment:</label>
        <input
          type="text"
          name="comment"
          id="comment"
          onChange={handleCommentChange}
        />
        <div className="select-group">
          <div className="select">
            <label>Catgeory:</label>
            <select onChange={handleCategoryChange}>
              <option value="" disabled selected>
                Please Select a Catgeory
              </option>
              {categories.map((category, index) => (
                <option key={index} value={index}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="select">
            <label>Type:</label>
            <select
              onClick={handleSubCategoryClick}
              onChange={(e) => setSubCategory(e.target.value)}
            >
              <option value="" disabled selected>
                Please Select a Type
              </option>
              {selectedTypes.map((subCategory) => (
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
        <button className="bg-wisdomOrange hover:bg-wisdomDarkOrange text-white rounded p-2">Submit</button>
      </form>
    </div>
  );
};

export default StudentBehavior;
