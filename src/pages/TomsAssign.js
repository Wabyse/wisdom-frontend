import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import "../styles/Assign.css";
import { useNavigate } from "react-router-dom";
import { assignTask, fetchTaskCategories } from "../services/tms";
import { fetchUsers } from "../services/data";
import toast, { Toaster } from "react-hot-toast";
import wabys from "../assets/wabys.png";

const importance = ["normal", "important", "urgent"];

const TomsAssign = () => {
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
      navigate(`/watoms/tms`);
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  console.log(userInfo.user_role)
  if (userInfo.user_role === "Student" || userInfo.user_role === "Trainee") {
    return (
      <>
        <div className="bg-formColor w-full h-screen flex flex-col justify-center items-center">
          <img
            className="w-[25%]"
            src={wabys}
            alt=""
          />
          <h1 className="text-8xl font-bold">401</h1>
          <h1 className="text-5xl text-center text-watomsBlue">You are not authorized to view this page.</h1>
          <h1 className="text-5xl text-center text-watomsBlue">Please contact your administrator if you believe this is an error.</h1>
          <button className="bg-wisdomOrange hover:bg-wisdomDarkOrange text-white rounded p-2 m-4" onClick={() => navigate('/pms')}>Go Back</button>
        </div>
      </>
    )
  }

  return (
    <div className="bg-gray-500 h-[125vh] text-end">
      <Toaster />
      <Navbar showNavigate={false} upload={true}></Navbar>
      <form onSubmit={submitTask} className="assignForm form2 bg-slate-600">
        <h1 className="text-2xl font-bold text-white">تعيين مهمة</h1>
        <div className="select-group">
        <div className="select">
          <label className="w-full text-white" key="user">:الموظف</label>
          <select id="user" name="user">
            <option className="text-end" value="" disabled selected>
              الرجاء اختيار موظف
            </option>
            {filteredUsers.map((user) => (
              <option key={user.id} value={user.id}>
                {`${user.employee?.employee_first_name} ${user.employee?.employee_middle_name} ${user.employee?.employee_last_name}`}
              </option>
            ))}
          </select>
        </div>
        <div className="select">
          <label className="w-full text-white" key="importance">:الاهمية</label>
          <select id="importance" name="importance">
            <option className="text-end" value="" disabled selected>
              الرجاء اختيار الاهمية
            </option>
            {importance.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>
        </div>

        <label className="w-full text-white">:المهمة</label>
        <input className="AssignText" type="text" name="task" />

        <label className="w-full text-white">:الوصف</label>
        <input className="AssignText" type="text" name="description" />

        <div className="date-time-group">
          <div>
            <label className=" text-white">:تاريخ البدء</label>
            <input type="date" name="startDate" />
          </div>
          <div>
            <label className=" text-white">:موعد البدء (اختياري)</label>
            <input type="time" name="startTime" />
          </div>
        </div>

        <div className="date-time-group">
          <div>
            <label className=" text-white">:تاريخ الانتهاء</label>
            <input type="date" name="endDate" />
          </div>
          <div>
            <label className=" text-white">:موعد الانتهاء (اختياري)</label>
            <input type="time" name="endTime" />
          </div>
        </div>

        <label className="w-full text-white">:رفع ملف (اختياري)</label>
        <input type="file" name="file" className="bg-white" onChange={handleFileChange} />

        <div className="select-group">
          <div className="select">
            <label className="w-full text-white" key="category">:تصنيف</label>
            <select
              id="category"
              name="category"
              onChange={handleCategoryChange}
            >
              <option className="text-end" value="" disabled selected>
                الرجاء اختيار تصنيف
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
              id="subCategory"
              name="subCategory"
              onClick={handleSubCategoryClick}
              // disabled={!selectedCategory}
            >
              <option className="text-end" value="" disabled selected>
                الرجاء اختيار تصنيف فرعي
              </option>
              {selectedCategories.map((subCategory) => (
                <option value={subCategory.id}>{subCategory.name}</option>
              ))}
            </select>
          </div>
        </div>

        <button className="bg-wisdomOrange hover:bg-wisdomDarkOrange text-white p-2 rounded">ارسال</button>
      </form>
    </div>
  );
};

export default TomsAssign;