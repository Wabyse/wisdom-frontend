import { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import "../styles/Tms.css";
import { useAuth } from "../context/AuthContext";
import LoadingScreen from "../components/LoadingScreen";
import DenyAccessPage from "../components/DenyAccessPage";
import TmsSingleTaskDetails from "../components/TmsSingleTaskDetails";
import TmsNavbar from "../components/TmsNavbar";
import TmsSingleDataTemplate from "../components/TmsSingleDataTemplate";
import TmsChatAccess from "../components/TmsChatAccess";
import TmsDoubleDataTemplate from "../components/TmsDoubleDataTemplate";

const WatomsTmsAddTask = () => {
    const location = useLocation();
    const { userInfo } = useAuth();
    const [loading,] = useState(false);
    const [error,] = useState(null);

    if (loading) return <LoadingScreen />;
    if (error?.status === 403) return <Navigate to="/login" state={{ from: location }} replace />;
    if (error) return <p>Error: {error.message}</p>;
    if (userInfo.user_role === "Student" || userInfo.user_role === "Trainee") return <DenyAccessPage homePage='/watoms/pms' />;
    if (userInfo?.code === 1452) return <DenyAccessPage homePage='/watoms/dashboard' />;
    if (userInfo?.code === 1475) return <DenyAccessPage homePage='/watoms/news' />;
    if (userInfo?.code === 1310) return <DenyAccessPage homePage='/wisdom/dashboard' />;

    return (
        <div className="flex flex-col items-center w-full">
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
                            <div className="w-[75%] overflow-y-auto">
                                <div className={`text-white text-center rounded p-2 bg-gradient-to-b from-wisdomLighterOrange to-wisdomLightOrange`}>
                                    اسم المنفذ
                                </div>
                                <input type="text" className={`border-black p-2 border-2 rounded text-center font-bold mt-2 flex items-center justify-center w-full`} />
                            </div>
                            <div className="w-[25%] overflow-y-auto">
                                <div className={`text-white text-center rounded p-2 bg-gradient-to-b from-wisdomLighterOrange to-wisdomLightOrange`}>
                                    الجهة
                                </div>
                                <input type="text" className={`border-black p-2 border-2 rounded text-center font-bold mt-2 flex items-center justify-center w-full`} />
                            </div>
                        </div>
                        <div className="flex gap-2 mt-2 w-full">
                            <div className="w-[25%]">
                                <div className={`text-white text-center text-xs rounded p-2 bg-gradient-to-b from-wisdomLighterOrange to-wisdomLightOrange`}>
                                    التصنيف الفرعي للمهمة
                                </div>
                                <input className={`border-black p-2 border-2 rounded text-center font-bold mt-2 w-full`} />
                            </div>
                            <div className="w-[25%]" >
                                <div className={`text-white text-center text-xs rounded p-2 bg-gradient-to-b from-wisdomLighterOrange to-wisdomLightOrange`}>
                                    التصنيف
                                </div>
                                <input type="text" className={`border-black p-2 border-2 rounded text-center font-bold mt-2 w-full`} />
                            </div>
                            <div className="w-[25%]">
                                <div className={`text-white text-center text-xs rounded p-2 bg-gradient-to-b from-wisdomLighterOrange to-wisdomLightOrange`}>
                                    حجم المهمة
                                </div>
                                <select
                                    className="border-black p-2 border-2 rounded text-center text-sm font-bold mt-2 w-full bg-white text-black cursor-pointer"
                                    defaultValue=""
                                >
                                    <option value="" disabled>
                                        اختر حجم المهمة
                                    </option>
                                    <option value="large">كبيرة</option>
                                    <option value="medium">وسط</option>
                                    <option value="small">صغيرة</option>
                                </select>
                            </div>
                            <div className="w-[25%]">
                                <div className="text-white text-center text-xs rounded p-2 bg-gradient-to-b from-wisdomLighterOrange to-wisdomLightOrange">
                                    الاولوية
                                </div>

                                <select
                                    className="border-black p-2 border-2 rounded text-center text-sm font-bold mt-2 w-full bg-white text-black cursor-pointer"
                                    defaultValue=""
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
                            <div className="min-w-[50%] w-[50%] max-w-[80%] overflow-y-auto">
                                <div className={`text-white text-center rounded p-2 bg-gradient-to-b from-wisdomLighterOrange to-wisdomLightOrange`}>
                                    وصف المهمة
                                </div>
                                <input type="text" className={`border-black p-2 border-2 rounded text-center font-bold mt-2 h-32 flex items-center justify-center w-full`} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default WatomsTmsAddTask;