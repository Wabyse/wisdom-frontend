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
import { createTaskFormData } from "../utils/createTaskFormData";
import { IMPORTANCE_LEVELS } from "../constants/constants";
import { useLanguage } from "../context/LanguageContext";
import Popup from "../components/Popup";

const Assign = () => {
  const location = useLocation();
  const [submitted, setSubmitted] = useState(false);
  const [file, setFile] = useState(null);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [hasSelectedCategory, setHasSelectedCategory] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userInfo } = useAuth();
  const { language } = useLanguage();

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

    if (!e.target.user.value || !e.target.task.value || !e.target.description.value || !e.target.startDate.value || !e.target.endDate.value || !e.target.importance.value || !e.target.subCategory.value) {
      toast.error("Please fill all required fields.");
      return;
    }


    try {
      const formData = createTaskFormData(e.target, file, userInfo);
      await assignTask(formData);
      toast.success(language ? "Task has been assigned" : "تم تكليف المهمة");
      setSubmitted(true);
    } catch (err) {
      console.error("Error submitting data:", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [users, categories] = await Promise.all([
          fetchUsers(userInfo),
          fetchTaskCategories(userInfo),
        ]);
        setFilteredUsers(users);
        setCategories(categories);
      } catch (err) {
        console.error("API Error:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userInfo]);

  const closePopup = () => {
    setSubmitted(false)
    navigate('/tms');
  };

  if (loading) return <LoadingScreen />;
  if (error?.status === 403) return <Navigate to="/login" state={{ from: location }} replace />;
  if (error) return <p>Error: {error.message}</p>;
  if (userInfo.user_role === "Student" || userInfo.user_role === "Trainee") return <DenyAccessPage homePage='/pms' />;
  if (userInfo?.code === 1452) return <DenyAccessPage homePage='/watoms/dashboard' />;
  if (userInfo?.code === 1475) return <DenyAccessPage homePage='/watoms/news' />;

  return (
    <div className="bg-gray-500 m-0 min-h-[130vh] overflow-auto">
      <Toaster />
      <Navbar upload={true}></Navbar>
      <form onSubmit={submitTask} className="assignForm form2 bg-slate-600">
        <h1 className="text-2xl font-bold text-white">{language ? "Assign Task" : "تعيين مهمة"}</h1>
        <div className="select-group">
          <div className="select">
            <label key="user" className={`text-white ${!language && "w-full text-end"}`}>{language ? "Employee:" : ":الموظف"}</label>
            <select id="user" name="user" className={!language && `text-end`}>
              <option value="" disabled selected>
                {language ? "Please Select a Teacher" : "الرجاء اختيار معلم"}
              </option>
              {filteredUsers.map((user) => (
                <option key={user.employee.employee_id} value={user.employee.employee_id}>
                  {`${user.employee?.employee_first_name} ${user.employee?.employee_middle_name} ${user.employee?.employee_last_name}`}
                </option>
              ))}
            </select>
          </div>
          <div className="select">
            <label key="importance" className={`text-white ${!language && "w-full text-end"}`}>{language ? "Importance:" : ":الاهمية"}</label>
            <select id="importance" name="importance" className={!language && `text-end`}>
              <option value="" disabled selected>
                {language ? "Please Select an importance" : "الرجاء اختيار الاهمية"}
              </option>
              {IMPORTANCE_LEVELS.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>
        </div>
        <label className={`w-full text-white ${!language && "text-end"}`}>{language ? "Task:" : ":المهمة"}</label>
        <input className={`w-full p-2.5 my-[6px] mb-3 border border-gray-300 rounded-[6px] text-sm box-border transition-colors duration-300 ease-in-out ${!language && "text-end"}`} type="text" name="task" />

        <label className={`w-full text-white ${!language && "text-end"}`}>{language ? "Description:" : ":الوصف"}</label>
        <input className={`w-full p-2.5 my-[6px] mb-3 border border-gray-300 rounded-[6px] text-sm box-border transition-colors duration-300 ease-in-out ${!language && "text-end"}`} type="text" name="description" />

        <div className="date-time-group">
          <div>
            <label className={`text-white ${!language && "w-full text-end"}`}>{language ? "Start Date:" : ":تاريخ بدء المهمة"}</label>
            <input type="date" name="startDate" className={!language && "text-end"} />
          </div>
          <div>
            <label className={`text-white ${!language && "w-full text-end"}`}>{language ? "Start Time: (optional)" : "موعد بدء المهمة: (اختياري)"}</label>
            <input type="time" name="startTime" className={!language && "text-end"} />
          </div>
        </div>

        <div className="date-time-group">
          <div>
            <label className={`text-white ${!language && "w-full text-end"}`}>{language ? "End Date:" : ":تاريخ انتهاء المهمة"}</label>
            <input type="date" name="endDate" className={!language && "text-end"} />
          </div>
          <div>
            <label className={`text-white ${!language && "w-full text-end"}`}>{language ? "End Time: (optional)" : "موعد انتهاء المهمة: (اختياري)"}</label>
            <input type="time" name="endTime" className={!language && "text-end"} />
          </div>
        </div>

        <label className={`text-white ${!language && "w-full text-end"}`}>{language ? "Attach File:" : ":رفع ملف"}</label>
        <input className="bg-white" type="file" name="file" onChange={handleFileChange} />

        <div className="select-group">
          <div className="select">
            <label key="category" className={`text-white ${!language && "w-full text-end"}`}>{language ? "Category:" : ":التصنيف"}</label>
            <select
              id="category"
              name="category"
              onChange={handleCategoryChange}
              className={!language && "text-end"}
            >
              <option value="" disabled selected>
                {language ? " Please Select a Category" : "الرجاء اختيار تصنيف"}
              </option>
              {categories.map((category, index) => (
                <option key={index} value={index}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="select">
            <label className={`text-white ${!language && "w-full text-end"}`}>{language ? "Sub-Category:" : ":التصنيف الفرعي"}</label>
            <select
              id="subCategory"
              name="subCategory"
              onClick={handleSubCategoryClick}
              className={!language && "text-end"}
            // disabled={!hasSelectedCategory}
            >
              <option value="" disabled selected>
                {language ? "Please Select a Sub-Category" : "برجاء اختيار تصنيف فرعي"}
              </option>
              {selectedCategories.map((subCategory) => (
                <option key={subCategory.id} value={subCategory.id}>{subCategory.name}</option>
              ))}
            </select>
          </div>
        </div>

        <button className="bg-wisdomOrange hover:bg-wisdomDarkOrange text-white rounded p-2">{language ? "Submit" : "ارسال"}</button>
      </form>
      <Popup
        isOpen={submitted}
        onClose={closePopup}
        message={language ? "Task has been assigned successfully" : "تم تكليف المهمة بنجاح"}
      />
    </div>
  );
};

export default Assign;
