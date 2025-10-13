import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import "../styles/Tms.css";
import { useAuth } from "../context/AuthContext";
import LoadingScreen from "../components/LoadingScreen";
import DenyAccessPage from "../components/DenyAccessPage";
import TmsNavbar from "../components/TmsNavbar";
import { fetchAuthorities, fetchUsers } from "../services/data";
import { fetchingOrgs } from "../services/dms";
import { fetchTaskCategories } from "../services/tms";
import toast, { Toaster } from "react-hot-toast";

const WatomsTmsAddTask = () => {
    const location = useLocation();
    const { userInfo } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [auths, setAuths] = useState([]);
    const [selectedAuth, setSelectedAuth] = useState(null);
    const [orgs, setOrgs] = useState([]);
    const [filteredOrgs, setFilteredOrgs] = useState([]);
    const [selectedOrg, setSelectedOrg] = useState(null);
    const [users, setUsers] = useState([]);
    const [filteredAssignee, setFilteredAssignee] = useState([]);
    const [selectedAssignee, setSelectedAssignee] = useState(null);
    const [selectedImportance, setSelectedImportance] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [subCategories, setSubCategories] = useState([]);
    const [selectedSubCategory, setSelectedSubCategory] = useState(null);
    const [taskDescription, setTaskDescription] = useState("");

    const checkCategory = () => {
        if (selectedCategory === null || selectedCategory === "") {
            toast.error("الرجاء اختيار التصنيف");
        }
    }

    useEffect(() => {
        const loadAllData = async () => {
            setLoading(true);
            try {
                const [authResponse, orgResponse, usersResponse, categoryResponse] = await Promise.all([
                    fetchAuthorities(),
                    fetchingOrgs(userInfo),
                    fetchUsers(userInfo),
                    fetchTaskCategories(userInfo),
                ]);

                // Filter authorities
                const watomsAuth = authResponse.filter(a => a.id !== 3);
                setAuths(watomsAuth);

                // Filter orgs
                const watomsOrgs = orgResponse.filter(o => o.authority_id !== 3);
                setOrgs(watomsOrgs);
                setFilteredOrgs(watomsOrgs);

                // Handle users
                setUsers(usersResponse);
                setFilteredAssignee(usersResponse);

                // Handle Categories and sub categories
                setCategories(categoryResponse)
            } catch (error) {
                console.error("Error loading data:", error);
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        loadAllData();
    }, [userInfo]);

    // filter orgs based on authority
    useEffect(() => {
        const filterOrgs = () => {
            if (selectedAuth !== null) {
                const filtered = orgs.filter(org => org.authority_id === Number(selectedAuth));
                setFilteredOrgs(filtered);
            }
        }

        filterOrgs();
    }, [selectedAuth]);

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

    // filter sub category based on category
    useEffect(() => {
        const filterSubCategories = () => {
            if (selectedCategory !== null) {
                const filtered = categories.filter(category => category.id === Number(selectedCategory));
                setSubCategories(filtered[0].subCategory);
            }
        }

        filterSubCategories();
    }, [selectedCategory]);

    if (loading) return <LoadingScreen />;
    if (error?.status === 403) return <Navigate to="/login" state={{ from: location }} replace />;
    if (error) return <p>Error: {error.message}</p>;
    if (userInfo.user_role === "Student" || userInfo.user_role === "Trainee") return <DenyAccessPage homePage='/watoms/pms' />;
    if (userInfo?.code === 1452) return <DenyAccessPage homePage='/watoms/dashboard' />;
    if (userInfo?.code === 1475) return <DenyAccessPage homePage='/watoms/news' />;
    if (userInfo?.code === 1310) return <DenyAccessPage homePage='/wisdom/dashboard' />;

    return (
        <div className="flex flex-col items-center w-full">
            <Toaster />
            <TmsNavbar
                shareStatus={false}
            />
            <div className="border-black border-2 rounded-xl flex flex-col w-[95%] mt-2 pt-2">

                {/* main content (your three columns) */}
                <div className="px-3 pb-3 flex justify-between">
                    <div className="w-[25%] border-black border-2 p-2 rounded-xl">
                        <div className="bg-gradient-to-b from-blue-900 to-blue-950 text-white rounded p-2 text-center">
                            التقييمات
                        </div>
                        <div className="flex gap-2 mt-2">
                            <div className="w-[50%]">
                                <div className={`text-white text-center text-sm rounded p-2 bg-gradient-to-b from-wisdomLighterOrange to-wisdomLightOrange`}>
                                    تقييم المدير
                                </div>
                                <input type="text" className={`border-black p-2 border-2 rounded text-center font-bold mt-2 min-h-20 flex justify-center items-center w-full`} />
                            </div>
                            <div className="w-[50%]">
                                <div className={`text-white text-center text-sm rounded p-2 bg-gradient-to-b from-wisdomLighterOrange to-wisdomLightOrange`}>
                                    تقييم الموقف التنفيذي
                                </div>
                                <input type="text" className={`border-black p-2 border-2 rounded text-center font-bold mt-2 min-h-20 flex justify-center items-center w-full`} />
                            </div>
                        </div>
                        <div className="flex gap-2 mt-2">
                            <div className="w-[50%]">
                                <div className={`text-white text-center text-sm rounded p-2 bg-gradient-to-b from-wisdomLighterOrange to-wisdomLightOrange`}>
                                    اجمالي التقييم
                                </div>
                                <input type="text" className={`border-black p-2 border-2 rounded text-center font-bold mt-2 min-h-20 flex justify-center items-center w-full`} />
                            </div>
                            <div className="w-[50%]">
                                <div className={`text-white text-center text-sm rounded p-2 bg-gradient-to-b from-wisdomLighterOrange to-wisdomLightOrange`}>
                                    تقييم المسؤل
                                </div>
                                <input type="text" className={`border-black p-2 border-2 rounded text-center font-bold mt-2 min-h-20 flex justify-center items-center w-full`} />
                            </div>
                        </div>
                        <div className="flex gap-2 mt-2">
                            <div className="w-full">
                                <div className={`text-white text-center text-sm rounded p-2 bg-gradient-to-b from-wisdomLighterOrange to-wisdomLightOrange`}>
                                    المحادثة
                                </div>
                                <button className={`border-black p-2 border-2 rounded text-center font-bold mt-2 w-full hover:bg-wisdomDarkOrange hover:border-wisdomDarkOrange hover:text-white`}>Click to Open Chat</button>
                            </div>
                        </div>
                    </div>

                    <div className="w-[13%] border-black border-2 p-2 rounded-xl">
                        <div className="bg-gradient-to-b from-blue-900 to-blue-950 text-white rounded p-2 text-center">
                            الموقف التنفيذي
                        </div>
                        <div className="flex gap-2 mt-2">
                            <div className="w-full">
                                <div className={`text-white text-center rounded p-2 bg-gradient-to-b from-wisdomLighterOrange to-wisdomLightOrange`}>
                                    نسبة اكتمال المهمة
                                </div>
                                <input type="text" className={`border-black p-2 border-2 rounded text-center font-bold mt-2 w-full`} />
                            </div>
                        </div>
                        <div className="flex gap-2 mt-2">
                            <div className="w-full">
                                <div className={`text-white text-center rounded p-2 bg-gradient-to-b from-wisdomLighterOrange to-wisdomLightOrange`}>
                                    موقف التسليم
                                </div>
                                <input type="text" className={`border-black p-2 border-2 rounded text-center font-bold mt-2 h-56 flex items-center justify-center w-full`} />
                            </div>
                        </div>
                    </div>

                    <div className="w-[13%] border-black border-2 p-2 rounded-xl">
                        <div className="bg-gradient-to-b from-blue-900 to-blue-950 text-white rounded p-2 text-center">
                            التواريخ و التوقيت
                        </div>
                        <div className="flex gap-2 mt-2">
                            <div className="w-full">
                                <div className={`text-white text-center rounded p-2 bg-gradient-to-b from-wisdomLighterOrange to-wisdomLightOrange`}>
                                    تاريخ و توقيت البدء
                                </div>
                                <input type="date" className={`border-black p-2 border-2 rounded text-center font-bold mt-2 text-[15px] min-h-[10vh] flex justify-center items-center w-full`} />
                            </div>
                        </div>
                        <div className="flex gap-2 mt-2">
                            <div className="w-full">
                                <div className={`text-white text-center rounded p-2 bg-gradient-to-b from-wisdomLighterOrange to-wisdomLightOrange`}>
                                    تاريخ و توقيت الانتهاء
                                </div>
                                <input type="date" className={`border-black p-2 border-2 rounded text-center font-bold mt-2 text-[15px] min-h-[10vh] flex justify-center items-center w-full`} />
                            </div>
                        </div>
                        <div className="flex gap-2 mt-2">
                            <div className="w-full">
                                <div className={`text-white text-center rounded p-2 bg-gradient-to-b from-wisdomLighterOrange to-wisdomLightOrange`}>
                                    تاريخ و توقيت التسليم
                                </div>
                                <input type="date" className={`border-black p-2 border-2 rounded text-center font-bold mt-2 text-[15px] min-h-[10vh] flex justify-center items w-full`} />
                            </div>
                        </div>
                    </div>

                    <div className="w-[45%] border-black border-2 p-2 rounded-xl">
                        <div className="bg-gradient-to-b from-blue-900 to-blue-950 text-white rounded p-2 text-center">
                            البيانات الاساسية للمهمة
                        </div>
                        <div className="flex gap-2 mt-2">
                            {/* assignee selector */}
                            <div className="w-[75%] overflow-y-auto">
                                <div className={`text-white text-center rounded p-2 bg-gradient-to-b from-wisdomLighterOrange to-wisdomLightOrange`}>
                                    اسم المنفذ
                                </div>
                                <select
                                    className="border-black p-2 border-2 rounded text-center text-sm font-bold mt-2 w-full bg-white text-black cursor-pointer"
                                    defaultValue=""
                                    onChange={(e) => setSelectedAssignee(e.target.value)}
                                >
                                    <option value="" disabled>
                                        اختر المنفذ
                                    </option>
                                    {filteredAssignee.map(emp => (
                                        <option value={emp.employee.employee_first_name}>{emp.employee.employee_first_name} {emp.employee.employee_middle_name} {emp.employee.employee_last_name}</option>
                                    ))}
                                </select>
                            </div>
                            {/* org selector */}
                            <div className="w-[25%] overflow-y-auto">
                                <div className={`text-white text-center rounded p-2 bg-gradient-to-b from-wisdomLighterOrange to-wisdomLightOrange`}>
                                    المشروع
                                </div>
                                <select
                                    className="border-black p-2 border-2 rounded text-center text-sm font-bold mt-2 w-full bg-white text-black cursor-pointer"
                                    defaultValue=""
                                    onChange={(e) => setSelectedOrg(e.target.value)}
                                >
                                    <option value="" disabled>
                                        اختر المشروع
                                    </option>
                                    {filteredOrgs.map(org => (
                                        <option value={org.id}>{org.name}</option>
                                    ))}
                                </select>
                            </div>
                            {/* auth selector */}
                            <div className="w-[25%] overflow-y-auto">
                                <div className={`text-white text-center rounded p-2 bg-gradient-to-b from-wisdomLighterOrange to-wisdomLightOrange`}>
                                    الجهة
                                </div>
                                <select
                                    className="border-black p-2 border-2 rounded text-center text-sm font-bold mt-2 w-full bg-white text-black cursor-pointer"
                                    defaultValue=""
                                    onChange={(e) => setSelectedAuth(e.target.value)}
                                >
                                    <option value="" disabled>
                                        اختر الجهة
                                    </option>
                                    {auths.map(auth => (
                                        <option value={auth.id}>{auth.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-2 mt-2 w-full">
                            {/* sub category selector */}
                            <div className="w-[25%]">
                                <div className={`text-white text-center text-xs rounded p-2 bg-gradient-to-b from-wisdomLighterOrange to-wisdomLightOrange`}>
                                    التصنيف الفرعي للمهمة
                                </div>
                                <select
                                    className="border-black p-2 border-2 rounded text-center text-sm font-bold mt-2 w-full bg-white text-black cursor-pointer"
                                    defaultValue=""
                                    onChange={(e) => setSelectedSubCategory(e.target.value)}
                                    onClick={checkCategory}
                                >
                                    <option value="" disabled>
                                        اختر التصنيف
                                    </option>
                                    {subCategories.map(sub => (
                                        <option value={sub.id}>{sub.name}</option>
                                    ))}
                                </select>
                            </div>
                            {/* category selector */}
                            <div className="w-[25%]" >
                                <div className={`text-white text-center text-xs rounded p-2 bg-gradient-to-b from-wisdomLighterOrange to-wisdomLightOrange`}>
                                    التصنيف
                                </div>
                                <select
                                    className="border-black p-2 border-2 rounded text-center text-sm font-bold mt-2 w-full bg-white text-black cursor-pointer"
                                    defaultValue=""
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                >
                                    <option value="" disabled>
                                        اختر التصنيف
                                    </option>
                                    {categories.map(category => (
                                        <option value={category.id}>{category.name}</option>
                                    ))}
                                </select>
                            </div>
                            {/* size selector */}
                            <div className="w-[25%]">
                                <div className={`text-white text-center text-xs rounded p-2 bg-gradient-to-b from-wisdomLighterOrange to-wisdomLightOrange`}>
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
                            <div className="w-[25%]">
                                <div className="text-white text-center text-xs rounded p-2 bg-gradient-to-b from-wisdomLighterOrange to-wisdomLightOrange">
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
                        <div className="flex gap-2 mt-2">
                            <div className="min-w-[20%] w-[50%] max-w-[50%] overflow-y-auto">
                                <div className={`text-white text-center rounded p-2 bg-gradient-to-b from-wisdomLighterOrange to-wisdomLightOrange`}>
                                    المرفقات
                                </div>
                                <input type="text" className={`border-black p-2 border-2 rounded text-center font-bold mt-2 h-32 flex items-center justify-center w-full`} />
                            </div>
                            {/* task description input */}
                            <div className="min-w-[50%] w-[50%] max-w-[80%] overflow-y-auto">
                                <div className="text-white text-center rounded p-2 bg-gradient-to-b from-wisdomLighterOrange to-wisdomLightOrange">
                                    وصف المهمة
                                </div>

                                <textarea
                                    className="border-black p-2 border-2 rounded text-center font-bold mt-2 h-32 w-full resize-none overflow-y-auto"
                                    placeholder="أدخل وصف المهمة هنا..."
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default WatomsTmsAddTask;