import { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import "../styles/Tms.css";
import { useAuth } from "../context/AuthContext";
import LoadingScreen from "../components/LoadingScreen";
import DenyAccessPage from "../components/DenyAccessPage";
import TmsNavbar from "../components/TmsNavbar";
import { fetchAuthorities, fetchOrganizations, fetchPrograms, fetchProjects, fetchUsers } from "../services/data";
import { assignTask } from "../services/tms";
import toast, { Toaster } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const WatomsTmsAddTask = () => {
    const location = useLocation();
    const { userInfo } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [auths, setAuths] = useState([]);
    const [selectedAuth, setSelectedAuth] = useState(null);
    const [projects, setProjects] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [programs, setPrograms] = useState([]);
    const [filteredPrograms, setFilteredPrograms] = useState([]);
    const [selectedProgram, setSelectedProgram] = useState(null);
    const [orgs, setOrgs] = useState([]);
    const [filteredOrgs, setFilteredOrgs] = useState([]);
    const [selectedOrg, setSelectedOrg] = useState(null);
    const [users, setUsers] = useState([]);
    const [filteredAssignee, setFilteredAssignee] = useState([]);
    const [selectedAssignee, setSelectedAssignee] = useState(null);
    const [selectedImportance, setSelectedImportance] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [taskDescription, setTaskDescription] = useState("");
    const [taskNotes, setTaskNotes] = useState("");
    const [taskTitle, setTaskTitle] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [dateFrom, setDateFrom] = useState();
    const [dateTo, setDateTo] = useState();
    const [timeFrom, setTimeFrom] = useState();
    const [timeTo, setTimeTo] = useState();
    const [selectedManager, setSelectedManager] = useState(null);
    const [selectedReviewer, setSelectedReviewer] = useState(null);
    const [taskCount, setTaskCount] = useState(1);
    const [submitTask, setSubmitTask] = useState(false);
    const [tasks, setTasks] = useState([]);

    const handleChange = (index, field, value) => {
        setTasks(prev => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };
            return updated;
        });
    };


    useEffect(() => {
        const loadAllData = async () => {
            setLoading(true);
            try {
                const [authResponse, orgResponse, usersResponse, projectResponse, programResponse] = await Promise.all([
                    fetchAuthorities(),
                    fetchOrganizations(),
                    fetchUsers(userInfo),
                    fetchProjects(),
                    fetchPrograms(),
                ]);

                // Filter authorities
                const watomsAuth = authResponse.filter(a => a.id !== 3);
                setAuths(watomsAuth);

                // Filter Projects
                const watomsProjects = projectResponse.filter(a => a.authority_id !== 3);
                setProjects(watomsProjects);
                setFilteredProjects(watomsProjects);

                // Filter Programs
                const watomsPrograms = programResponse.filter(a =>
                    projectResponse.some(p => p.id === a.project_id)
                );
                setPrograms(watomsPrograms);
                setFilteredPrograms(watomsPrograms);

                // Filter orgs
                const watomsOrgs = orgResponse.filter(o => o.authority_id !== 3);
                setOrgs(watomsOrgs);
                setFilteredOrgs(watomsOrgs);

                // Handle users
                setUsers(usersResponse);
                setFilteredAssignee(usersResponse);
            } catch (error) {
                console.error("Error loading data:", error);
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        loadAllData();
    }, [userInfo]);

    // filter projects based on authority
    useEffect(() => {
        const filterProjects = () => {
            if (selectedAuth !== null) {
                const filtered = projects.filter(project => project.authority_id === Number(selectedAuth));
                setFilteredProjects(filtered);
            }
        }

        filterProjects();
    }, [selectedAuth]);

    // filter programs based on project
    useEffect(() => {
        const filterProgram = () => {
            if (selectedProject !== null) {
                const filtered = programs.filter(program => program.project_id === Number(selectedProject));
                setFilteredPrograms(filtered);
            }
        }

        filterProgram();
    }, [selectedProject]);

    // filter orgs based on program
    useEffect(() => {
        const filterOrg = () => {
            if (selectedProgram !== null) {
                const filtered = orgs.filter(org =>
                    Array.isArray(org.programs) &&
                    org.programs.some(program => program.id === Number(selectedProgram))
                );
                setFilteredOrgs(filtered);
            }
        }

        filterOrg();
    }, [selectedProgram]);

    // filter assignee based on org
    useEffect(() => {
        const filterAssignee = () => {
            if (selectedOrg !== null) {
                const filtered = users.filter(user => user.employee.organization_id === Number(selectedOrg));
                setFilteredAssignee(filtered);
            }
        }

        filterAssignee();
    }, [selectedOrg]);

    useEffect(() => {
        const submitingTask = async () => {
            if (!selectedAuth || !selectedProject || !selectedProgram || !selectedOrg || !selectedImportance || !selectedSize || !dateFrom || !dateTo || !selectedAssignee || !selectedManager || !selectedReviewer || !taskTitle || !taskDescription) {
                toast.error('الرجاء مليء كل المطلوب')
            }
            console.log(tasks, selectedAuth, selectedProject, selectedProgram, selectedOrg, selectedImportance, selectedSize, dateFrom, dateTo, selectedAssignee, selectedManager, selectedReviewer, taskTitle, taskDescription)
            try {
                const taskData = new FormData();
                taskData.append("task_details", JSON.stringify(tasks));
                taskData.append("start_date", new Date(`${dateFrom}T${timeFrom || "00:00"}`).toISOString());
                taskData.append("end_date", new Date(`${dateTo}T${timeTo || "00:00"}`).toISOString());
                taskData.append("importance", selectedImportance);
                taskData.append("size", selectedSize);
                taskData.append("assigner_id", userInfo?.id);
                taskData.append("assignee_id", Number(selectedAssignee));
                taskData.append("reviewer_id", Number(selectedReviewer));
                taskData.append("manager_id", Number(selectedManager));
                taskData.append("organization_id", Number(selectedOrg));
                taskData.append("program_id", Number(selectedProgram));
                taskData.append("project_id", Number(selectedProject));
                taskData.append("authority_id", Number(selectedAuth));
                taskData.append("system", "ebdaedu");

                if (selectedFile) {
                    taskData.append("file", selectedFile); // 👈 Important!
                }

                await assignTask(taskData);
                toast.success("تم تكليف المهمة");
                setSubmitTask(false);
                navigate("/watoms/tms/my-tasks")
            } catch (err) {
                console.error("Error submitting data:", err);
            }
        }

        if (submitTask === true) submitingTask();
    }, [submitTask])

    if (loading) return <LoadingScreen />;
    if (error?.status === 403) return <Navigate to="/login" state={{ from: location }} replace />;
    if (error) return <p>Error: {error.message}</p>;
    if (userInfo.user_role === "Student" || userInfo.user_role === "Trainee") return <DenyAccessPage homePage='/watoms/pms' />;
    if (userInfo?.code === 1452 || userInfo?.code === 1476) return <DenyAccessPage homePage='/watoms/dashboard' />;
    if (userInfo?.code === 1475) return <DenyAccessPage homePage='/watoms/news' />;
    if (userInfo?.code === 1310) return <DenyAccessPage homePage='/wisdom/dashboard' />;

    return (
        <div className="flex flex-col items-center w-full">
            <Toaster />
            <TmsNavbar
                shareStatus={false}
                submitedTask={true}
                setSubmitTask={setSubmitTask}
                searchStatus={false}
            />
            <div className="border-black border-2 rounded-xl flex flex-col w-[95%] mt-2 pt-2">

                {/* main content (your three columns) */}
                <div className="px-3 pb-3 flex justify-between">
                    <div className="w-[25%] border-black border-2 p-2 rounded-xl">
                        <div className="bg-gradient-to-b from-blue-900 to-blue-950 text-white rounded p-2 text-center">
                            عناصر التنفيذ والتقييم
                        </div>
                        {/* assignee selector */}
                        <div className="w-full overflow-y-auto mt-2 flex gap-2 h-[60px]">
                            <select
                                className="border-black p-2 border-2 rounded text-center text-sm font-bold w-[70%] bg-white text-black cursor-pointer"
                                defaultValue=""
                                onChange={(e) => setSelectedAssignee(e.target.value)}
                            >
                                <option value="" disabled>
                                    اختر المنفذ
                                </option>
                                {filteredAssignee.map(emp => (
                                    <option key={emp.id} value={emp.id}>{emp.employee.employee_first_name} {emp.employee.employee_middle_name} {emp.employee.employee_last_name}</option>
                                ))}
                            </select>
                            <div className={`w-[30%] text-white text-center text-sm flex justify-center items-center rounded p-2 bg-gradient-to-b from-wisdomLighterOrange to-wisdomLightOrange`}>
                                اسم المنفذ
                            </div>
                        </div>

                        {/* Reviewer selector */}
                        <div className="w-full overflow-y-auto mt-2 flex gap-2 h-[60px]">
                            <select
                                className="border-black p-2 border-2 rounded text-center text-sm font-bold w-[70%] bg-white text-black cursor-pointer"
                                defaultValue=""
                                onChange={(e) => setSelectedReviewer(e.target.value)}
                            >
                                <option value="" disabled>
                                    اختر المراجع
                                </option>
                                {filteredAssignee.map(emp => (
                                    <option key={emp.id} value={emp.id}>{emp.employee.employee_first_name} {emp.employee.employee_middle_name} {emp.employee.employee_last_name}</option>
                                ))}
                            </select>
                            <div className={`w-[30%] text-white text-center flex justify-center items-center rounded p-2 bg-gradient-to-b from-wisdomLighterOrange to-wisdomLightOrange`}>
                                اسم المراجع
                            </div>
                        </div>

                        {/* Manager selector */}
                        <div className="w-full overflow-y-auto mt-2 flex gap-2 h-[60px]">
                            <select
                                className="border-black p-2 border-2 rounded text-center text-sm font-bold w-[70%] bg-white text-black cursor-pointer"
                                defaultValue=""
                                onChange={(e) => setSelectedManager(e.target.value)}
                            >
                                <option value="" disabled>
                                    اختر المدير
                                </option>
                                {filteredAssignee.map(emp => (
                                    <option key={emp.id} value={emp.id}>{emp.employee.employee_first_name} {emp.employee.employee_middle_name} {emp.employee.employee_last_name}</option>
                                ))}
                            </select>
                            <div className={`w-[30%] text-white text-center flex justify-center items-center rounded p-2 bg-gradient-to-b from-wisdomLighterOrange to-wisdomLightOrange`}>
                                اسم المدير
                            </div>
                        </div>
                    </div>

                    <div className="w-[22%] border-black border-2 p-2 rounded-xl">
                        <div className="bg-gradient-to-b from-blue-900 to-blue-950 text-white rounded p-2 text-center">
                            التواريخ و التوقيت
                        </div>
                        {/* Date From input */}
                        <div className="flex gap-2 mt-2">
                            <div className="w-full">
                                <div className={`text-white text-center rounded p-2 bg-gradient-to-b from-wisdomLighterOrange to-wisdomLightOrange`}>
                                    تاريخ و التوقيتات البدء
                                </div>
                                <div className="flex gap-2">
                                    <input type="date" onChange={(e) => setDateFrom(e.target.value)} className={` h-[47px] border-black p-2 border-2 rounded text-center font-bold mt-2 text-[15px] min-h-[5vh] flex justify-center items-center w-full`} />
                                    <input type="time" onChange={(e) => setTimeFrom(e.target.value)} className={` h-[47px] border-black p-2 border-2 rounded text-center font-bold mt-2 text-[15px] min-h-[5vh] flex justify-center items-center w-full`} />
                                </div>
                            </div>
                        </div>
                        {/* Date To input */}
                        <div className="flex gap-2 mt-2">
                            <div className="w-full">
                                <div className={`text-white text-center rounded p-2 bg-gradient-to-b from-wisdomLighterOrange to-wisdomLightOrange`}>
                                    تاريخ و التوقيتات الانتهاء
                                </div>
                                <div className="flex gap-2">
                                    <input type="date" onChange={(e) => setDateTo(e.target.value)} className={`border-black h-[47px] p-2 border-2 rounded text-center font-bold mt-2 text-[15px] min-h-[5vh] flex justify-center items-center w-full`} />
                                    <input type="time" onChange={(e) => setTimeTo(e.target.value)} className={`border-black h-[47px] p-2 border-2 rounded text-center font-bold mt-2 text-[15px] min-h-[5vh] flex justify-center items-center w-full`} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-[50%] border-black border-2 p-2 rounded-xl">
                        <div className="bg-gradient-to-b from-blue-900 to-blue-950 text-white rounded p-2 text-center">
                            البيانات الاساسية للمهمة
                        </div>
                        <div className="flex gap-2 mt-2">
                            {/* org selector */}
                            <div className="w-[25%] overflow-y-auto">
                                <div className={`text-white text-center rounded p-2 bg-gradient-to-b from-wisdomLighterOrange to-wisdomLightOrange`}>
                                    التصنيف الفرعي
                                </div>
                                <select
                                    className="border-black p-2 border-2 rounded text-center text-sm font-bold mt-2 w-full bg-white text-black cursor-pointer"
                                    defaultValue=""
                                    onChange={(e) => setSelectedOrg(e.target.value)}
                                >
                                    <option value="" disabled>
                                        اختر التصنيف الفرعي
                                    </option>
                                    {filteredOrgs.map(org => (
                                        <option key={org.id} value={org.id}>{org.name}</option>
                                    ))}
                                </select>
                            </div>
                            {/* program selector */}
                            <div className="w-[25%] overflow-y-auto">
                                <div className={`text-white text-center rounded p-2 bg-gradient-to-b from-wisdomLighterOrange to-wisdomLightOrange`}>
                                    التصنيف الرئيسي
                                </div>
                                <select
                                    className="border-black p-2 border-2 rounded text-center text-sm font-bold mt-2 w-full bg-white text-black cursor-pointer"
                                    defaultValue=""
                                    onChange={(e) => setSelectedProgram(e.target.value)}
                                >
                                    <option value="" disabled>
                                        اختر التصنيف الرئيسي
                                    </option>
                                    {filteredPrograms.map(program => (
                                        <option key={program.id} value={program.id}>{program.name}</option>
                                    ))}
                                </select>
                            </div>
                            {/* project selector */}
                            <div className="w-[25%] overflow-y-auto">
                                <div className={`text-white text-center rounded p-2 bg-gradient-to-b from-wisdomLighterOrange to-wisdomLightOrange`}>
                                    الجهة الفرعية
                                </div>
                                <select
                                    className="border-black p-2 border-2 rounded text-center text-sm font-bold mt-2 w-full bg-white text-black cursor-pointer"
                                    defaultValue=""
                                    onChange={(e) => setSelectedProject(e.target.value)}
                                >
                                    <option value="" disabled>
                                        اختر الجهة الفرعية
                                    </option>
                                    {filteredProjects.map(project => (
                                        <option key={project.id} value={project.id}>{project.name}</option>
                                    ))}
                                </select>
                            </div>
                            {/* auth selector */}
                            <div className="w-[25%] overflow-y-auto">
                                <div className={`text-white text-center rounded p-2 bg-gradient-to-b from-wisdomLighterOrange to-wisdomLightOrange`}>
                                    الجهة الرئيسية
                                </div>
                                <select
                                    className="border-black p-2 border-2 rounded text-center text-sm font-bold mt-2 w-full bg-white text-black cursor-pointer"
                                    defaultValue=""
                                    onChange={(e) => setSelectedAuth(e.target.value)}
                                >
                                    <option value="" disabled>
                                        اختر الجهة الرئيسية
                                    </option>
                                    {auths.map(auth => (
                                        <option key={auth.id} value={auth.id}>{auth.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-2 mt-2 w-full">
                            {/* Task File */}
                            <div className="w-[33%] overflow-y-auto">
                                <div className={`text-white text-center rounded p-2 bg-gradient-to-b from-wisdomLighterOrange to-wisdomLightOrange`}>
                                    المرفقات
                                </div>
                                <input
                                    type="file"
                                    dir="rtl"
                                    className="border-black p-2 border-2 rounded text-center font-bold mt-2 h-12 flex items-center justify-center w-full"
                                    onChange={(e) => setSelectedFile(e.target.files[0])}
                                />
                            </div>
                            {/* size selector */}
                            <div className="w-[33%]">
                                <div className={`text-white text-center rounded p-2 bg-gradient-to-b from-wisdomLighterOrange to-wisdomLightOrange`}>
                                    حجم المهمة
                                </div>
                                <select
                                    className="border-black p-2 border-2 rounded text-center text-sm font-bold mt-2 w-full bg-white text-black cursor-pointer"
                                    defaultValue=""
                                    onChange={(e) => setSelectedSize(e.target.value)}
                                >
                                    <option value="" disabled>
                                        اختر حجم المهمة
                                    </option>
                                    <option value="large">كبيرة</option>
                                    <option value="medium">وسط</option>
                                    <option value="small">صغيرة</option>
                                </select>
                            </div>
                            {/* importance selector */}
                            <div className="w-[33%]">
                                <div className="text-white text-center rounded p-2 bg-gradient-to-b from-wisdomLighterOrange to-wisdomLightOrange">
                                    الاولوية
                                </div>
                                <select
                                    className="border-black p-2 border-2 rounded text-center text-sm font-bold mt-2 w-full bg-white text-black cursor-pointer"
                                    defaultValue=""
                                    onChange={(e) => setSelectedImportance(e.target.value)}
                                >
                                    <option value="" disabled>
                                        اختر الأولوية
                                    </option>
                                    <option value="urgent">قصوى</option>
                                    <option value="important">مهمة</option>
                                    <option value="normal">عادية</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mx-3 mb-3 flex flex-col justify-between border-black border-2 p-2 rounded-xl">
                    <div className="relative mb-3 flex justify-between" >
                        <div onClick={() => setTaskCount(prev => prev + 1)} className="absolute -top-5 -right-5 text-xl rounded-full w-7 h-7 flex justify-center items-center bg-gray-300 hover:bg-gray-400 cursor-pointer">
                            <FontAwesomeIcon icon={faPlus} />
                        </div>
                        <div className="flex gap-2 w-full">
                            {/* Task notes input */}
                            <div className="min-w-[33%] w-[33%] max-w-[33%] overflow-y-auto">
                                <div className="text-white text-center rounded p-2 bg-gradient-to-b from-wisdomLighterOrange to-wisdomLightOrange">
                                    ملاحظات
                                </div>
                            </div>

                            {/* Task description input */}
                            <div className="min-w-[45%] w-[45%] max-w-[45%] overflow-y-auto">
                                <div className="text-white text-center rounded p-2 bg-gradient-to-b from-wisdomLighterOrange to-wisdomLightOrange">
                                    وصف المهمة
                                </div>
                            </div>

                            {/* Task title input */}
                            <div className="min-w-[15%] w-[15%]">
                                <div className="text-white text-center rounded p-2 bg-gradient-to-b from-wisdomLighterOrange to-wisdomLightOrange">
                                    عنوان المهمة
                                </div>
                            </div>

                            {/* Task ID display */}
                            <div className="min-w-[5%] w-[5%]">
                                <div className="text-white text-center rounded p-2 bg-gradient-to-b from-wisdomLighterOrange to-wisdomLightOrange">
                                    مسلسل
                                </div>
                            </div>
                        </div>
                    </div>
                    {Array.from({ length: taskCount }, (_, i) => (
                        <div key={i} className="mb-3 flex justify-between">
                            <div className="flex gap-2 w-full">

                                {/* Notes */}
                                <div className="min-w-[33%] w-[33%] max-w-[33%]">
                                    <textarea
                                        className="border-black p-2 border-2 rounded text-center font-bold w-full h-12 resize-none overflow-y-auto"
                                        placeholder="أدخل ملاحظات المهمة هنا..."
                                        value={tasks[i]?.note || ""}
                                        onChange={(e) => handleChange(i, "note", e.target.value)}
                                    />
                                </div>

                                {/* Description */}
                                <div className="min-w-[45%] w-[45%] max-w-[45%]">
                                    <textarea
                                        className="border-black p-2 border-2 rounded text-center font-bold w-full h-12 resize-none overflow-y-auto"
                                        placeholder="أدخل وصف المهمة هنا..."
                                        value={tasks[i]?.description || ""}
                                        onChange={(e) => handleChange(i, "description", e.target.value)}
                                    />
                                </div>

                                {/* Title */}
                                <div className="min-w-[15%] w-[15%]">
                                    <textarea
                                        className="border-black p-2 border-2 rounded text-center font-bold h-12 w-full resize-none overflow-y-auto"
                                        placeholder="أدخل عنوان المهمة هنا..."
                                        value={tasks[i]?.title || ""}
                                        onChange={(e) => handleChange(i, "title", e.target.value)}
                                    />
                                </div>

                                {/* ID */}
                                <div className="min-w-[5%] w-[5%]">
                                    <div className="border-black p-2 border-2 rounded text-center font-bold h-12 w-full">
                                        {i + 1}
                                    </div>
                                </div>

                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div >
    );
};

export default WatomsTmsAddTask;