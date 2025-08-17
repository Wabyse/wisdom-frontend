import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { createTaskFormData } from "../utils/createTaskFormData";
import { useAuth } from "../context/AuthContext";
import { assignTask, fetchTaskCategories } from "../services/tms";
import { IMPORTANCE_LEVELS, TASK_SIZES } from "../constants/constants";
import { fetchAuthorities, fetchProjects, fetchSchools, fetchUsers } from "../services/data";
import { useLanguage } from "../context/LanguageContext";

const AddTaskForm = ({ taskId, onClose, mainTask = true }) => {
    const { language } = useLanguage();
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
    const [selectedTask, setSelectedTask] = useState("");
    const [selectedDescription, setSelectedDescription] = useState("");
    const [selectedStartDate, setSelectedStartDate] = useState("");
    const [selectedStartTime, setSelectedStartTime] = useState("");
    const [selectedEndDate, setSelectedEndDate] = useState("");
    const [selectedEndTime, setSelectedEndTime] = useState("");
    const [selectedImportance, setSelectedImportance] = useState("");
    const [selectedSubCategory, setSelectedSubCategory] = useState("");

    const [auth, setAuth] = useState([]);
    const [selectedAuth, setSelectedAuth] = useState("");
    const [selectedProgram, setSelectedProgram] = useState("");
    const [selectedSize, setSelectedSize] = useState("");
    const [projects, setProjects] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState("");

    const submitTask = async (e) => {
        e.preventDefault();

        if (!selectedSize || !selectedUser || !selectedTask || !selectedDescription || !selectedStartDate || !selectedEndDate || !selectedImportance || !selectedSubCategory) {
            toast.error("Please fill all required fields.");
            return;
        }

        if (userInfo?.organization_id === 3 && !selectedProject) {
            toast.error("Please fill all required fields.");
            return;
        }

        try {
            const taskData = new FormData();
            taskData.append("task", selectedTask);
            taskData.append("description", selectedDescription);
            taskData.append("start_date", new Date(`${selectedStartDate}T${selectedStartTime || "00:00"}`).toISOString());
            taskData.append("end_date", new Date(`${selectedEndDate}T${selectedEndTime || "00:00"}`).toISOString());
            taskData.append("importance", selectedImportance);
            taskData.append("task_size", selectedSize);
            taskData.append("sub_category", Number(selectedSubCategory));
            taskData.append("assignedBy_id", userInfo?.employee_id);
            taskData.append("assignee_id", Number(selectedUser));
            taskData.append("sub_task_id", mainTask ? null : Number(taskId));
            taskData.append("organization_id", userInfo?.organization_id === 3 ? Number(selectedProject) : userInfo?.organization_id);

            if (file) {
                taskData.append("file", file); // 👈 Important!
            }
            await assignTask(taskData);
            toast.success(language ? "Task has been assigned" : "تم تكليف المهمة");
            setSubmitted(true);
        } catch (err) {
            console.error("Error submitting data:", err);
        }
    };

    useEffect(() => {
        const closeSubTask = async () => {
            if (submitted) {
                await onClose();
                setSubmitted(false);
            };
        }

        closeSubTask();
    }, [submitted])

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
        const filterProjects = () => {
            let filteredProjects;
            if (selectedAuth === "") {
                console.log(projects)
                filteredProjects = projects;
            } else {
                filteredProjects = projects.filter(project => project.authority_id === Number(selectedAuth));
            }
            setFilteredProjects(filteredProjects);
        }

        filterProjects();
    }, [selectedAuth, projects])

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [employees, categories, schools] = await Promise.all([
                    fetchUsers(userInfo),
                    fetchTaskCategories(userInfo),
                    fetchSchools(),
                ]);
                const filteredVtcs = schools.filter(vtc => vtc.id !== 1 && vtc.id !== 2 && vtc.id !== 12);
                setVtcs(filteredVtcs);
                let users;
                if (selectedProject !== "") {
                    users = employees.filter(employee => employee?.employee.organization_id === Number(selectedProject));
                } else if (userInfo?.organization_id !== 3) {
                    users = employees.filter(employee => employee?.employee.organization_id === Number(userInfo?.organization_id))
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

        const loadAuthority = async () => {
            const response = await fetchAuthorities();
            const watomsAuth = response.filter(authority => authority.id !== 3)
            console.log(response)
            setAuth(watomsAuth);
        }

        const loadProjects = async () => {
            const response = await fetchProjects();
            const watomsProjects = response.filter(project => project.authority_id === 1 || project.authority_id === 2);
            setProjects(watomsProjects);
        }

        fetchData();
        loadAuthority();
        loadProjects();
    }, [userInfo, selectedProject]);

    return (
        <div className="px-3 rounded pb-2 w-full">
            <Toaster />
            <div className="bg-white w-full">
                <div className="bg-gradient-to-b from-blue-900 to-blue-950 p-6 text-white rounded-t">
                    <div className="flex items-center justify-between">
                        {language && <h2 className="text-3xl font-extrabold">Add Sub Task</h2>}
                        <button className="text-white hover:text-gray-200 text-2xl" onClick={onClose}>
                            ×
                        </button>
                        {!language && <h2 className="text-3xl font-extrabold">{mainTask ? "اضافة مهمة" : "اضافة مهمة فرعية"}</h2>}
                    </div>
                </div>
                <div className="p-6">
                    <form onSubmit={submitTask}>
                        {/* Authority and Project Filter */}
                        <div className="select-group">
                            <div className="select">
                                <label key="project" className={`${!language && "w-full text-end"}`}>{language ? "Project:" : ":المشروع"}</label>
                                <select id="project" name="project" className={!language && `text-end`} onChange={(e) => setSelectedProject(e.target.value)}>
                                    <option value="" disabled selected>
                                        {language ? "Please Select a project" : "الرجاء اختيار مشروع"}
                                    </option>
                                    {filteredProjects.map((project) => (
                                        <option key={project.id} value={project.id}>
                                            {project.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="select">
                                <label key="authority" className={`${!language && "w-full text-end"}`}>{language ? "the authority:" : ":الجهة"}</label>
                                <select id="authority" name="authority" className={!language && `text-end`} onChange={(e) => setSelectedAuth(e.target.value)}>
                                    <option value="" disabled selected>
                                        {language ? "Please Select an authority" : "الرجاء اختيار جهة"}
                                    </option>
                                    {auth.map((authority) => (
                                        <option key={authority.id} value={authority.id}>
                                            {authority.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        {/* Program and Employee Filter */}
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
                                <label key="program" className={`${!language && "w-full text-end"}`}>{language ? "The Program:" : ":البرنامج"}</label>
                                <select id="program" name="program" className={!language && `text-end`} onChange={(e) => setSelectedProgram(e.target.value)}>
                                    <option value="" disabled selected>
                                        {language ? "Please Select a program" : "الرجاء اختيار برنامج"}
                                    </option>
                                    {vtcs.map((program) => (
                                        <option key={program.id} value={program.id}>
                                            {program.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        {/* Category and Sub Category Filter */}
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
                        {/* Size and Importance Filter */}
                        <div className="select-group">
                            <div className="select">
                                <label key="size" className={`${!language && "w-full text-end"}`}>{language ? "Task Size:" : ":حجم المهمة"}</label>
                                <select id="size" name="size" className={!language && `text-end`} onChange={(e) => setSelectedSize(e.target.value)}>
                                    <option value="" disabled selected>
                                        {language ? "Please Select an size" : "الرجاء اختيار حجم المهمة"}
                                    </option>
                                    {TASK_SIZES.map((size) => (
                                        <option key={size} value={size}>
                                            {size}
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
                        <input className={`w-full p-2.5 my-[6px] mb-3 border border-gray-300 rounded-[6px] text-sm box-border transition-colors duration-300 ease-in-out ${!language && "text-end"}`} type="text" name="task" onChange={(e) => setSelectedTask(e.target.value)} />

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

                        <label className={`block font-bold ${!language && "w-full text-end"}`}>{language ? "Attach File (optional):" : ":رفع ملف (اختياري)"}</label>
                        <input className="border-[#ccc] border-2 p-2 rounded w-full" type="file" name="file" onChange={handleFileChange} />
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