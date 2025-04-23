import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import "../styles/Assign.css";
import { useNavigate } from "react-router-dom";
import { assignTask, fetchTaskCategories } from "../services/tms";
import { fetchUsers } from "../services/data";
import toast, { Toaster } from "react-hot-toast";
import LoadingScreen from "../components/LoadingScreen";
import DenyAccessPage from "../components/DenyAccessPage";

const importance = ["normal", "important", "urgent"];

const Assign = () => {
  const [file, setFile] = useState(null);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [hasSelectedCategory, setHasSelectedCategory] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userInfo } = useAuth();

  const navigate = useNavigate();

  const handleSubCategoryClick = () => {
    if (!hasSelectedCategory) {
      toast.error("Please select a category first!");
    }
  };

  const handleCategoryChange = (e) => {
    setHasSelectedCategory(true);
    setSelectedCategories(categories[e.target.value].subCategory);
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const submitTask = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("importance", e.target.importance.value);
    formData.append("task", e.target.task.value);
    formData.append("description", e.target.description.value);
    formData.append(
      "start_date",
      new Date(
        `${e.target.startDate.value}T${
          e.target.startTime.value ? e.target.startTime.value : "00:00"
        }`
      ).toISOString()
    );
    formData.append(
      "end_date",
      new Date(
        `${e.target.endDate.value}T${
          e.target.endTime.value ? e.target.endTime.value : "00:00"
        }`
      ).toISOString()
    );
    formData.append("file", file); // Attach file correctly
    formData.append("sub_category", e.target.subCategory.value);
    formData.append("assignedBy_id", userInfo?.id);
    formData.append("assignee_id", e.target.user.value);
    formData.append("uploadType", "task"); // Ensure correct folder handling on backend

    try {
      await assignTask(formData);
      navigate(`/tms`);
    } catch (err) {
      console.error("Error submitting data:", err);
    }
  };

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await fetchUsers();
        setFilteredUsers(response);
      } catch (err) {
        console.error("Users API Error:", err);
        setError(err.message || "Failed to load users.");
      }
    };

    const loadCategories = async () => {
      try {
        const response = await fetchTaskCategories();
        setCategories(response);
      } catch (err) {
        console.error("Categories API Error:", err);
        setError(err.message || "Failed to load categories.");
      }
    };

    loadUsers();
    loadCategories();
    setLoading(false);
  }, []);

  if (loading) return <LoadingScreen /> ;
  if (error) return <p>Error: {error}</p>;
  if (userInfo.user_role === "Student" || userInfo.user_role === "Trainee") return <DenyAccessPage homePage='/pms'/>;

  return (
    <div className="bg-gray-500 m-0 h-[130vh]">
      <Toaster />
      <Navbar upload={true} length="w-[370px]"></Navbar>
      <form onSubmit={submitTask} className="assignForm form2 bg-slate-600">
        <h1 className="text-2xl font-bold text-white">Assign Task</h1>
        <div className="select-group">
        <div className="select">
          <label key="user" className=" text-white">Employee:</label>
          <select id="user" name="user">
            <option value="" disabled selected>
              Please Select a Teacher
            </option>
            {filteredUsers.map((user) => (
              <option key={user.id} value={user.id}>
                {`${user.employee?.employee_first_name} ${user.employee?.employee_middle_name} ${user.employee?.employee_last_name}`}
              </option>
            ))}
          </select>
        </div>
        <div className="select">
          <label key="importance" className=" text-white">Importance:</label>
          <select id="importance" name="importance">
            <option value="" disabled selected>
              Please Select an importance
            </option>
            {importance.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>
        </div>
        <label className="w-full text-white">Task:</label>
        <input className="AssignText" type="text" name="task" />

        <label className="w-full text-white">Description:</label>
        <input className="AssignText" type="text" name="description" />

        <div className="date-time-group">
          <div>
            <label className=" text-white">Start Date:</label>
            <input type="date" name="startDate" />
          </div>
          <div>
            <label className=" text-white">Start Time: (optional)</label>
            <input type="time" name="startTime" />
          </div>
        </div>

        <div className="date-time-group">
          <div>
            <label className=" text-white">End Date:</label>
            <input type="date" name="endDate" />
          </div>
          <div>
            <label className=" text-white">End Time: (optional)</label>
            <input type="time" name="endTime" />
          </div>
        </div>

        <label className=" text-white">Attach File:</label>
        <input className="bg-white" type="file" name="file" onChange={handleFileChange} />

        <div className="select-group">
          <div className="select">
            <label key="category" className=" text-white">Category:</label>
            <select
              id="category"
              name="category"
              onChange={handleCategoryChange}
            >
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
            <label className=" text-white">Sub-Category:</label>
            <select
              id="subCategory"
              name="subCategory"
              onClick={handleSubCategoryClick}
              // disabled={!selectedCategory}
            >
              <option value="" disabled selected>
                Please Select a Sub-Category
              </option>
              {selectedCategories.map((subCategory) => (
                <option value={subCategory.id}>{subCategory.name}</option>
              ))}
            </select>
          </div>
        </div>

        <button className="bg-wisdomOrange hover:bg-wisdomDarkOrange text-white rounded p-2">Submit</button>
      </form>
    </div>
  );
};

export default Assign;
