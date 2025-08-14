import TmsChatAccess from "./TmsChatAccess";
import TmsDoubleDataTemplate from "./TmsDoubleDataTemplate";
import TmsSingleDataTemplate from "./TmsSingleDataTemplate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useLanguage } from "../context/LanguageContext";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import { assignTask, fetchTaskCategories } from "../services/tms";
import { fetchAuthorities, fetchProjects, fetchSchools, fetchUsers } from "../services/data";
import { IMPORTANCE_LEVELS, TASK_SIZES } from "../constants/constants";
import TmsSubTaskDetails from "./TmsSubTaskDetails";
import { cairoDate } from "../utils/cairoDate";
import { tmsDevliverSituation } from "../utils/tmsDeliverSituation";

const statusPercentage = {
  "0": "0",
  "25": "25",
  "50": "50",
  "75": "75",
  "finished": "100",
  "on hold": "0",
  "in progress": "0",
  "past the due date": "0",
  "submitted": "100",
  "under review": "100",
  "not started yet": "0"
}

const TmsSingleTaskDetails = ({
    taskId,
    onCloseClick,
    onAddClick,
    subTasks,
    isOpen = false,
    value1 = "------", value2 = "------", value3 = "------", value4 = "------",
    value5 = "------", value6 = "------", value7 = "------", value8 = "------",
    value9 = "------", value10 = "------", value11 = "------", value12 = "------",
    value13 = "------", value14 = "------", value15 = "------", value16 = "------",
    value17 = "------", value18 = "------",
}) => {
    const allEmpty = [
        value1, value2, value3, value4, value5, value6, value7, value8,
        value9, value10, value11, value12, value13, value14, value15, value16,
        value17, value18
    ].every(v => v === "------");
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
    const [filteredvtcs, setFilteredVtcs] = useState([]);
    const [selectedAuth, setSelectedAuth] = useState("");
    const [selectedProject, setSelectedProject] = useState("");
    const [selectedProgram, setSelectedProgram] = useState("");
    const [selectedSize, setSelectedSize] = useState("");


    const submitTask = async (e) => {
        e.preventDefault();

        if (!selectedProject || !selectedSize || !selectedUser || !selectedTask || !selectedDescription || !selectedStartDate || !selectedEndDate || !selectedImportance || !selectedSubCategory) {
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
            taskData.append("sub_task_id", Number(taskId));
            taskData.append("organization_id", Number(selectedProject));

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
                await onCloseClick();
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
                filteredProjects = vtcs;
            } else {
                filteredProjects = vtcs.filter(vtc => vtc.authority_id === Number(selectedAuth));
            }
            setFilteredVtcs(filteredProjects);
        }

        filterProjects();
    }, [selectedAuth])

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [employees, categories, schools, authorities] = await Promise.all([
                    fetchUsers(userInfo),
                    fetchTaskCategories(userInfo),
                    fetchProjects(),
                    fetchAuthorities()

                ]);
                const onlyVtcs = schools.filter(vtc => vtc.id !== 1 && vtc.id != 2 && vtc.id != 12);
                const onlyWatoms = authorities.filter(auth => auth.id !== 3);
                setAuth(onlyWatoms);
                setVtcs(onlyVtcs);
                setFilteredVtcs(onlyVtcs);
                let users;
                if (selectedProject !== "") {
                    users = employees.filter(employee => employee?.employee.organization_id === Number(selectedProject));
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
    }, [userInfo, selectedProject]);

    return (
        // make the card a column so we can add an expandable area below
        <div className="border-black border-2 rounded-xl flex flex-col w-[95%] mt-2 pt-2">
            {/* header row: just the + button on the left/right */}
            {!allEmpty && !isOpen && (
                <div className="p-3 flex justify-end">
                    <button
                        className="bg-slate-500 p-2 rounded flex items-center hover:text-white hover:bg-slate-700"
                        onClick={onAddClick}
                    >
                        <FontAwesomeIcon icon={faPlus} />
                    </button>
                </div>
            )}

            {/* main content (your three columns) */}
            <div className="px-3 pb-3 flex justify-between">
                <div className="w-[25%] border-black border-2 p-2 rounded-xl">
                    <div className="bg-gradient-to-b from-blue-900 to-blue-950 text-white rounded p-2 text-center">
                        التقييمات
                    </div>
                    <div className="flex gap-2 mt-2">
                        <TmsSingleDataTemplate title="تقييم المدير" value={value1} cardAdditionalCSS="w-[50%] min-w-fit" valueAdditionalCSS="min-h-20 flex justify-center items-center" />
                        <TmsSingleDataTemplate title="تقييم الموقف التنفيذي" value={value2} cardAdditionalCSS="w-[50%] min-w-fit" valueAdditionalCSS="min-h-20 flex justify-center items-center" />
                    </div>
                    <div className="flex gap-2 mt-2">
                        <TmsSingleDataTemplate title="اجمالي التقييم" value={value3} cardAdditionalCSS="w-[50%] min-w-fit" valueAdditionalCSS="min-h-20 flex justify-center items-center" />
                        <TmsSingleDataTemplate title="تقييم المسؤل" value={value4} cardAdditionalCSS="w-[50%] min-w-fit" valueAdditionalCSS="min-h-20 flex justify-center items-center" />
                    </div>
                    <div className="flex gap-2 mt-2">
                        <TmsChatAccess title="المحادثة" value={value5} cardAdditionalCSS="w-full" />
                    </div>
                </div>

                <div className="w-[13%] border-black border-2 p-2 rounded-xl">
                    <div className="bg-gradient-to-b from-blue-900 to-blue-950 text-white rounded p-2 text-center">
                        الموقف التنفيذي
                    </div>
                    <div className="flex gap-2 mt-2">
                        <TmsSingleDataTemplate title="نسبة اكتمال المهمة" value={value6} cardAdditionalCSS="w-full" />
                    </div>
                    <div className="flex gap-2 mt-2">
                        <TmsSingleDataTemplate title="موقف التسليم" value={value7} cardAdditionalCSS="w-full" valueAdditionalCSS=" h-56 flex items-center justify-center" />
                    </div>
                </div>

                <div className="w-[13%] border-black border-2 p-2 rounded-xl">
                    <div className="bg-gradient-to-b from-blue-900 to-blue-950 text-white rounded p-2 text-center">
                        التواريخ و التوقيت
                    </div>
                    <div className="flex gap-2 mt-2">
                        <TmsSingleDataTemplate title="تاريخ و توقيت البدء" value={value8} cardAdditionalCSS="w-full" valueAdditionalCSS="text-[15px] min-h-[10vh] flex justify-center items-center" />
                    </div>
                    <div className="flex gap-2 mt-2">
                        <TmsSingleDataTemplate title="تاريخ و توقيت الانتهاء" value={value9} cardAdditionalCSS="w-full" valueAdditionalCSS="text-[15px] min-h-[10vh] flex justify-center items-center" />
                    </div>
                    <div className="flex gap-2 mt-2">
                        <TmsSingleDataTemplate title="تاريخ و توقيت التسليم" value={value10} cardAdditionalCSS="w-full" valueAdditionalCSS="text-[15px] min-h-[10vh] flex justify-center items-center" />
                    </div>
                </div>

                <div className="w-[45%] border-black border-2 p-2 rounded-xl">
                    <div className="bg-gradient-to-b from-blue-900 to-blue-950 text-white rounded p-2 text-center">
                        البيانات الاساسية للمهمة
                    </div>
                    <div className="flex gap-2 mt-2">
                        <TmsSingleDataTemplate title="اسم المنفذ" value={value17} cardAdditionalCSS="w-[75%] overflow-y-auto" valueAdditionalCSS="flex items-center justify-center" />
                        <TmsSingleDataTemplate title="الجهة" value={value18} cardAdditionalCSS="w-[25%] overflow-y-auto" valueAdditionalCSS="flex items-center justify-center" />
                    </div>
                    <div className="flex gap-2 mt-2">
                        <TmsSingleDataTemplate title="التصنيف الفرعي للمهمة" value={value11} cardAdditionalCSS="min-w-fit w-[25%]" />
                        <TmsSingleDataTemplate title="التصنيف" value={value12} cardAdditionalCSS="min-w-fit w-[25%]" />
                        <TmsSingleDataTemplate title="حجم المهمة" value={value13} cardAdditionalCSS="min-w-fit w-[25%]" />
                        <TmsSingleDataTemplate title="الاولوية" value={value14} cardAdditionalCSS="min-w-fit w-[25%]" />
                    </div>
                    <div className="flex gap-2 mt-2">
                        <TmsDoubleDataTemplate title="المرفقات" value={value15} cardAdditionalCSS="min-w-[20%] w-[50%] max-w-[50%] overflow-y-auto" valueAdditionalCSS="h-32 flex items-center justify-center" />
                        <TmsSingleDataTemplate title="وصف المهمة" value={value16} cardAdditionalCSS="min-w-[50%] w-[50%] max-w-[80%] overflow-y-auto" valueAdditionalCSS="h-32 flex items-center justify-center" />
                    </div>
                </div>
            </div>

            {/* expandable area under the content */}
            {isOpen && (
                <div className="px-3 rounded pb-2">
                    <Toaster />
                    <div className="bg-white w-full">
                        <div className="bg-gradient-to-b from-blue-900 to-blue-950 p-6 text-white rounded-t">
                            <div className="flex items-center justify-between">
                                {language && <h2 className="text-3xl font-extrabold">Add Sub Task</h2>}
                                <button className="text-white hover:text-gray-200 text-2xl" onClick={onCloseClick}>
                                    ×
                                </button>
                                {!language && <h2 className="text-3xl font-extrabold">اضافة مهمة فرعية</h2>}
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
                                            {filteredvtcs.map((project) => (
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
            )}

            {subTasks?.length !== 0 &&
                subTasks?.map(task => (
                    <TmsSubTaskDetails
                        key={task.id}
                        value1={`${task.manager_evaluation !== null ? task.manager_evaluation : 0}%`}
                        value2={`${statusPercentage[task.status]}%`}
                        value3={`${(task.manager_evaluation !== null ? Number(task.manager_evaluation) * 0.3 : 0 * 0.3) + (task.assigned_by_evaluation !== null ? Number(task.assigned_by_evaluation) * 0.5 : 0 * 0.5) + (Number(statusPercentage[task.status]) * 0.2)}%`}
                        value4={`${task.assigned_by_evaluation !== null ? task.assigned_by_evaluation : 0}%`}
                        value6={task.status}
                        value7={tmsDevliverSituation(task.start_date, task.end_date, task.status, task.updatedAt)}
                        value8={cairoDate(task.start_date)}
                        value9={cairoDate(task.end_date)}
                        value10={cairoDate(task.updatedAt)}
                        value11={task.taskSubCategory.name}
                        value12={task.taskSubCategory.taskCategory.name}
                        value13={task.task_size}
                        value14={task.importance}
                        value15={task.file_path || task.submit_file_path ? { sender: task.file_path, reciever: task.submit_file_path } : "------"}
                        value16={task.description}
                        value17={`${task.assignee.first_name} ${task.assignee.middle_name} ${task.assignee.last_name}`}
                        subTasks={task.subTasks}
                    />
                ))}
        </div>
    );
};

export default TmsSingleTaskDetails;