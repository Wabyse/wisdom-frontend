import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { createTaskFormData } from "../utils/createTaskFormData";
import { useAuth } from "../context/AuthContext";
import { assignTask, fetchTaskCategories } from "../services/tms";
import { IMPORTANCE_LEVELS } from "../constants/constants";
import { fetchSchools, fetchUsers } from "../services/data";

const AddTaskForm = ({ data, onClose, language }) => {
    const { userInfo } = useAuth();
    const [file, setFile] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState("");
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [hasSelectedCategory, setHasSelectedCategory] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [vtcs, setVtcs] = useState([]);
    const [selectedVtc, setSelectedVtc] = useState("");
    const [selectedTask, setSelectedTask] = useState("");
    const [selectedDescription, setSelectedDescription] = useState("");
    const [selectedStartDate, setSelectedStartDate] = useState("");
    const [selectedStartTime, setSelectedStartTime] = useState("");
    const [selectedEndDate, setSelectedEndDate] = useState("");
    const [selectedEndTime, setSelectedEndTime] = useState("");
    const [selectedImportance, setSelectedImportance] = useState("");
    const [selectedSubCategory, setSelectedSubCategory] = useState("");

    const submitTask = async (e) => {
        e.preventDefault();

        if (!selectedUser || !selectedTask || !selectedDescription || !selectedStartDate || !selectedEndDate || !selectedImportance || !selectedSubCategory) {
            toast.error("Please fill all required fields.");
            return;
        }

        try {
            const taskData = {
                "importance": selectedImportance,
                "task": selectedTask,
                "description": selectedDescription,
                "start_date": new Date(`${selectedStartDate}T${selectedStartTime || "00:00"}`).toISOString(),
                "end_date": new Date(`${selectedEndDate}T${selectedEndTime || "00:00"}`).toISOString(),
                "file": file,
                "sub_category": Number(selectedSubCategory),
                "assignedBy_id": userInfo?.employee_id,
                "assignee_id": Number(selectedUser)
            }
            await assignTask(taskData);
            toast.success(language ? "Task has been assigned" : "تم تكليف المهمة");
            setSubmitted(true);
            onClose();
        } catch (err) {
            console.error("Error submitting data:", err);
        }
    };

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleCategoryChange = (e) => {
        setHasSelectedCategory(true);
        setSelectedCategories(categories[e.target.value].subCategory);
    };

    const handleSubCategoryClick = () => {
        if (!hasSelectedCategory) {
            toast.error("Please select a category first!");
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [employees, categories, schools] = await Promise.all([
                    fetchUsers(userInfo),
                    fetchTaskCategories(userInfo),
                    fetchSchools(),
                ]);
                const filteredVtcs = schools.filter(vtc => vtc.id !== 1 && vtc.id != 2 && vtc.id != 12);
                setVtcs(filteredVtcs);
                let users;
                if (selectedVtc !== "") {
                    users = employees.filter(employee => employee?.employee.organization_id === Number(selectedVtc));
                } else {
                    users = employees;
                }
                setUsers(users);
                setCategories(categories);
            } catch (err) {
                console.error("API Error:", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userInfo, selectedVtc]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <Toaster />
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-3xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden animate-modal-in">
                <div className="bg-gradient-to-r from-watomsBlue to-wisdomOrange p-6 text-white">
                    <div className="flex items-center justify-between">
                        {language && <h2 className="text-3xl font-extrabold">Add Task</h2>}
                        <button onClick={onClose} className="text-white hover:text-gray-200 text-2xl">
                            ×
                        </button>
                        {!language && <h2 className="text-3xl font-extrabold">اضافة مهمة</h2>}
                    </div>
                </div>
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                    <form onSubmit={submitTask}>
                        {/* Organization Filter */}
                        <div className="select-group">
                            <div className="select">
                                <label key="user" className={`${!language && "w-full text-end"}`}>{language ? "Vtc:" : ":المركز"}</label>
                                <select id="user" name="user" className={!language && `text-end`} onChange={(e) => setSelectedVtc(e.target.value)}>
                                    <option value="" disabled selected>
                                        {language ? "Please Select a vtc" : "الرجاء اختيار مركز"}
                                    </option>
                                    {vtcs.map((vtc) => (
                                        <option key={vtc.id} value={vtc.id}>
                                            {vtc.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="select-group">
                            <div className="select">
                                <label key="user" className={`${!language && "w-full text-end"}`}>{language ? "Employee:" : ":الموظف"}</label>
                                <select id="user" name="user" className={!language && `text-end`} onChange={(e) => setSelectedUser(e.target.value)}>
                                    <option value="" disabled selected>
                                        {language ? "Please Select an Employee" : "الرجاء اختيار موظف"}
                                    </option>
                                    {users.map((user) => (
                                        <option key={user.employee.employee_id} value={user.employee.employee_id}>
                                            {`${user.employee?.employee_first_name} ${user.employee?.employee_middle_name} ${user.employee?.employee_last_name}`}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="select">
                                <label key="importance" className={`${!language && "w-full text-end"}`}>{language ? "Importance:" : ":الاهمية"}</label>
                                <select id="importance" name="importance" className={!language && `text-end`} onChange={(e) => setSelectedImportance(e.target.value)}>
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
                        <label className={`w-full font-bold ${!language && "text-end flex justify-end"}`}>{language ? "Task:" : ":المهمة"}</label>
                        <input className={`w-full p-2.5 my-[6px] mb-3 border border-gray-300 rounded-[6px] text-sm box-border transition-colors duration-300 ease-in-out ${!language && "text-end"}`} type="text" name="task"  onChange={(e) => setSelectedTask(e.target.value)} />

                        <label className={`w-full font-bold ${!language && "text-end flex justify-end "}`}>{language ? "Description:" : ":الوصف"}</label>
                        <input className={`w-full p-2.5 my-[6px] mb-3 border border-gray-300 rounded-[6px] text-sm box-border transition-colors duration-300 ease-in-out ${!language && "text-end"}`} type="text" name="description" onChange={(e) => setSelectedDescription(e.target.value)} />

                        <div className="date-time-group">
                            <div>
                                <label className={`font-bold ${!language && "w-full text-end"}`}>{language ? "Start Date:" : ":تاريخ بدء المهمة"}</label>
                                <input type="date" name="startDate" className={!language && "text-end"} onChange={(e) => setSelectedStartDate(e.target.value)} />
                            </div>
                            <div>
                                <label className={`font-bold ${!language && "w-full text-end"}`}>{language ? "Start Time: (optional)" : "موعد بدء المهمة: (اختياري)"}</label>
                                <input type="time" name="startTime" className={!language && "text-end"} onChange={(e) => setSelectedStartTime(e.target.value)} />
                            </div>
                        </div>

                        <div className="date-time-group">
                            <div>
                                <label className={`font-bold ${!language && "w-full text-end"}`}>{language ? "End Date:" : ":تاريخ انتهاء المهمة"}</label>
                                <input type="date" name="endDate" className={!language && "text-end"} onChange={(e) => setSelectedEndDate(e.target.value)} />
                            </div>
                            <div>
                                <label className={`font-bold ${!language && "w-full text-end"}`}>{language ? "End Time: (optional)" : "موعد انتهاء المهمة: (اختياري)"}</label>
                                <input type="time" name="endTime" className={!language && "text-end"} onChange={(e) => setSelectedEndTime(e.target.value)} />
                            </div>
                        </div>

                        <label className={`block font-bold ${!language && "w-full text-end"}`}>{language ? "Attach File:" : ":رفع ملف"}</label>
                        <input className="border-[#ccc] border-2 p-2 rounded w-full" type="file" name="file" onChange={handleFileChange} />

                        <div className="select-group">
                            <div className="select">
                                <label key="category" className={` ${!language && "w-full text-end"}`}>{language ? "Category:" : ":التصنيف"}</label>
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
                                <label className={`font-bold ${!language && "w-full text-end"}`}>{language ? "Sub-Category:" : ":التصنيف الفرعي"}</label>
                                <select
                                    id="subCategory"
                                    name="subCategory"
                                    onClick={handleSubCategoryClick}
                                    onChange={(e) => setSelectedSubCategory(e.target.value)}
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
                        <div className="w-full flex justify-center mt-2">
                            <button className="bg-wisdomOrange hover:bg-wisdomDarkOrange text-white rounded py-2 px-4">{language ? "Submit" : "ارسال"}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
};

export default AddTaskForm;