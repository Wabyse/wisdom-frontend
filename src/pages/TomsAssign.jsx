import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import "../styles/Assign.css";
import { useNavigate, Navigate, useLocation } from "react-router-dom";
import { assignTask, fetchTaskCategories } from "../services/tms";
import { fetchUsers } from "../services/data";
import toast, { Toaster } from "react-hot-toast";
import LoadingScreen from "../components/LoadingScreen";
import DenyAccessPage from "../components/DenyAccessPage";
import { IMPORTANCE_LEVELS } from "../constants/constants";
import { createTaskFormData } from "../utils/createTaskFormData";

const TomsAssign = () => {
  const location = useLocation();
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

    try {
      const formData = createTaskFormData(e.target, file, userInfo);
      await assignTask(formData);
      navigate(`/watoms/tms`);
    } catch (err) {
      console.error("Error submitting data:", err);
    }
  };

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await fetchUsers(userInfo);
        setFilteredUsers(response);
      } catch (err) {
        console.error("Users API Error:", err);
        setError(err);
      }
    };

    const loadCategories = async () => {
      try {
        const response = await fetchTaskCategories(userInfo);
        setCategories(response);
      } catch (err) {
        console.error("Categories API Error:", err);
        setError(err);
      }
    };

    loadUsers();
    loadCategories();
    setLoading(false);
  }, [userInfo]);

  if (loading) return <LoadingScreen />
  if (error?.status === 403) return <Navigate to="/login" state={{ from: location }} replace />;
  if (error) return <p>Error: {error.message}</p>;
  if (userInfo.user_role === "Student" || userInfo.user_role === "Trainee") return <DenyAccessPage homePage='/watoms/pms' />;

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
                <option key={user.employee.employee_id} value={user.employee.employee_id}>
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
              {IMPORTANCE_LEVELS.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>
        </div>

        <label className="w-full text-white">:المهمة</label>
        <input className="w-full p-2.5 my-[6px] mb-3 border border-gray-300 rounded-[6px] text-sm box-border transition-colors duration-300 ease-in-out text-end" type="text" name="task" />

        <label className="w-full text-white">:الوصف</label>
        <input className="w-full p-2.5 my-[6px] mb-3 border border-gray-300 rounded-[6px] text-sm box-border transition-colors duration-300 ease-in-out text-end" type="text" name="description" />

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