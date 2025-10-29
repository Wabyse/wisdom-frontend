// Components
import NewNavbar from "../../../components/NewNavbar";
import CustomHorizontalBarChart from "../../../components/customCharts/customHorizontalBarChart";
import CustomCircularProgressBar from "../../../components/customCharts/customCircularProgressBar";
import World from "../../../components/maps/World";
import AnnualPerformanceChart from "../../../components/AnnualPerformanceChart";
// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faFile, faFolderPlus, faPen, faQrcode, faXmark } from "@fortawesome/free-solid-svg-icons";
// tools
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    LabelList,
    ResponsiveContainer
} from 'recharts';
// custom tools
import { roundNumber } from "../../../utils/roundNumber";
import { WATOMS_MODERN_COLORS_TW } from "../../../constants/constants";
// images
import wabysLogo from '../../../assets/wabys.png';
import ebdaeduLogo from '../../../assets/ebad-edu.png';
import molLogo from '../../../assets/Gov.png';
import person from '../../../assets/person.jpg';
import passport from '../../../assets/passport.jpg';
import application from '../../../assets/ksaApplication.jpg';

const WatomsPEDashboard = () => {
    const navigate = useNavigate();
    const [individualsReportsStatus, setIndividualsReportsStatus] = useState(false)
    const data = [
        { year: 2024, performance: 900 },
        { year: 2025, performance: 7507 },
        { year: 2026, performance: 0 },
        { year: 2027, performance: 0 },
    ];

    const data2 = [
        { id: 1, name: "تجارة", performance: 4000 },
        { id: 3, name: "سباكة", performance: 3000 },
        { id: 6, name: "اجهزة منزلية", performance: 3000 },
        { id: 2, name: "طاقة شمسية", performance: 1200 },
        { id: 5, name: "كهرباء و دش", performance: 1200 },
        { id: 4, name: "خراطة", performance: 500 },
    ];

    const data3 = [
        { id: 1, name: "السعودية", performance: 4000 },
        { id: 2, name: "الامارات", performance: 3000 },
        { id: 3, name: "العراق", performance: 1200 },
    ];

    const data4 = [
        { month: "يناير", performance: 800 },
        { month: "فبراير", performance: 907 },
        { month: "مارس", performance: 1300 },
        { month: "ابريل", performance: 500 },
        { month: "مايو", performance: 500 },
        { month: "يونيو", performance: 1000 },
        { month: "يوليو", performance: 700 },
        { month: "اغسطس", performance: 300 },
        { month: "سبتمبر", performance: 0 },
        { month: "اكتوبر", performance: 1500 },
        { month: "نوفمبر", performance: 0 },
        { month: "ديسمبر", performance: 0 },
    ];

    const data5 = [
        { id: 5, name: "القدرات المعرفية الاساسية", performance: 100 },
        { id: 3, name: "المهارات الفنية المتخصصة", performance: 75 },
        { id: 1, name: "السمات الشخصية و السلوكية", performance: 60 },
        { id: 2, name: "المعارف الفنية المتخصص", performance: 50 },
        { id: 4, name: "المهارات الوظيفية الناعمة", performance: 20 },
        { id: 6, name: "ملفات تاكيد الهوية", performance: 20 },
    ];

    const IndividualsReportSheet = () => {
        return (
            <div className="fixed inset-0 bg-black/60 flex flex-col overflow-y-auto justify-start gap-6 items-center z-50">
                <button
                    onClick={() => setIndividualsReportsStatus(false)}
                    className="absolute top-4 right-4 text-white bg-gray-700 hover:bg-gray-800 w-12 h-12 flex justify-center items-center text-2xl font-bold cursor-pointer z-50"
                >
                    <FontAwesomeIcon icon={faXmark} />
                </button>
                {/* Page 1 */}
                <div className="relative max-w-5xl w-[40%] h-fit flex text-black bg-white p-3 mt-4">
                    <div className="w-full flex flex-col border-black border-2 rounded-xl p-2">
                        {/* Header */}
                        <div className="flex justify-between items-center w-full">
                            {/* logo */}
                            <div className="flex flex-col items-center w-14">
                                <img src={wabysLogo} className="w-14" alt="ebda edu logo" />
                                <img src={ebdaeduLogo} className="w-10" alt="ebda edu logo" />
                            </div>
                            {/* title */}
                            <div className="flex flex-col items-center gap-2 text-xs font-bold">
                                <h1 className="border-b-2 border-black text-black">تقرير نتائج إجراءات حوكمة اختبارات المتقدمين</h1>
                                <h1 className="border-b-2 border-black text-black">للفحص المهني</h1>
                            </div>
                            {/* logo */}
                            <div className="flex flex-col">
                                <img src={molLogo} className="w-14" alt="ebda edu logo" />
                            </div>
                        </div>
                        <div className="rounded-xl shadow-black shadow-md p-2 flex flex-col mt-2 w-full gap-2">
                            <h1 className="text-xs text-end font-bold">:اولاً: البيانات الأساسية</h1>
                            {/* user's data */}
                            <div className="w-full border-black border-2 flex justify-end items-center p-1 gap-1 min-h-20">
                                <div className="h-full flex flex-col items-center text-center gap-1 w-[15%] font-bold">
                                    <div className="text-[10px] border-black border-2 w-full bg-gray-300 h-1/2 flex justify-center items-center">اجمالي التقييم</div>
                                    <div className="text-sm border-black border-2 w-full h-1/2 flex justify-center items-center">70%</div>
                                </div>
                                <div className="flex flex-col gap-1 w-[20%] text-[8px] font-bold justify-center items-center">
                                    <div className="border-black border-2 h-fit w-full text-center px-2 py-1 flex justify-center items-center">مركز الشرابية</div>
                                    <div className="border-black border-2 h-fit w-full text-center px-2 py-1 flex justify-center items-center">تجارة (1)</div>
                                    <div className="border-black border-2 h-fit w-full text-center px-2 py-1 flex justify-center items-center">74211</div>
                                    <div className="border-black border-2 h-fit w-full text-center px-2 py-1 flex justify-center items-center">0110659889</div>
                                </div>
                                <div className="flex flex-col gap-1 min-w-fit w-[10%] text-[8px] font-bold justify-center items-center">
                                    <div className="border-black border-2 h-fit w-full text-center px-2 py-1 flex justify-center items-center bg-gray-300">مركز الاختبار</div>
                                    <div className="border-black border-2 h-fit w-full text-center px-2 py-1 flex justify-center items-center bg-gray-300">الفئة</div>
                                    <div className="border-black border-2 h-fit w-full text-center px-2 py-1 flex justify-center items-center bg-gray-300">رقم الممتحن</div>
                                    <div className="border-black border-2 h-fit w-full text-center px-2 py-1 flex justify-center items-center bg-gray-300">رقم الموبيل</div>
                                </div>
                                <div className="flex flex-col gap-1 w-[20%] text-[8px] font-bold justify-center items-center">
                                    <div className="border-black border-2 h-fit w-full text-center px-2 py-1 flex justify-center items-center">محمد احمد سيد محمد</div>
                                    <div className="border-black border-2 h-fit w-full text-center px-2 py-1 flex justify-center items-center">35286468437246</div>
                                    <div className="border-black border-2 h-fit w-full text-center px-2 py-1 flex justify-center items-center">284-871971871</div>
                                    <div className="border-black border-2 h-fit w-full text-center px-2 py-1 flex justify-center items-center">test@test.com</div>
                                </div>
                                <div className="flex flex-col gap-1 min-w-fit w-[10%] text-[8px] font-bold justify-center items-center">
                                    <div className="border-black border-2 h-fit w-full text-center px-2 py-1 flex justify-center items-center bg-gray-300">الاسم</div>
                                    <div className="border-black border-2 h-fit w-full text-center px-2 py-1 flex justify-center items-center bg-gray-300">الرقم القومي</div>
                                    <div className="border-black border-2 h-fit w-full text-center px-2 py-1 flex justify-center items-center bg-gray-300">رقم جواز السفر</div>
                                    <div className="border-black border-2 h-fit w-full text-center px-2 py-1 flex justify-center items-center bg-gray-300">البريد الالكتروني</div>
                                </div>
                                {/* user's img */}
                                <div className="flex flex-col gap-1">
                                    <img className="w-20 min-w-20 border-black border-2 p-1 " src={person} alt="" />
                                    <div className="text-[12px] border-black border-2 h-fit w-full text-center px-2 flex justify-center items-center">السعودية</div>
                                </div>
                            </div>
                            <h1 className="text-xs text-end font-bold">:ثانيا: مستندات تاكيد الهوية</h1>
                            <h1 className="text-xs pr-5" dir="rtl">1 - جواز السفر</h1>
                            {/* passport data */}
                            <img src={passport} alt="" />
                        </div>
                    </div>
                </div>
                {/* page 2 */}
                <div className="relative max-w-5xl w-[40%] h-fit flex text-black bg-white p-3 mt-4">
                    <div className="w-full flex flex-col items-center border-black border-2 rounded-xl p-2 gap-2">
                        <h1 className="w-full text-xs pr-5" dir="rtl">2 - تذكرة الترشح للمتقدم</h1>
                        <img className="border-black border-2 rounded-xl w-[98%]" src={application} alt="" />
                    </div>
                </div>
                {/* Page3 */}
                <div className="relative bg-white w-[40%] max-w-5xl h-fit p-4 flex flex-col gap-2 mt-4 text-black">
                    <div className="flex flex-col gap-2 border-2 border-black m-2 p-2 rounded-md overflow-x-auto">
                        <h1 className="text-xs text-end font-bold">: ثالثا : نتائج الاختبارات</h1>
                        <div className="flex gap-2">
                            <table className="w-full table-fixed border-separate border-spacing-0 rounded-xl overflow-hidden" dir="rtl">
                                <thead className="h-16">
                                    <tr className="text-xs text-white bg-[#5268b1] border-b border-blue-200/60 rounded-xl">
                                        <th colSpan={3} className="w-6/12 py-2 text-center font-semibold border-b border-l border-black">الاختبار</th>
                                        <th className="w-1/12 py-2 text-center font-semibold border-b border-l border-black">التقييم</th>
                                        <th colSpan={3} className="w-4/12 py-2 text-center font-semibold border-b border-l border-black">
                                            صورة الاثبات
                                        </th>
                                        <th rowSpan={1} className="w-1/12 py-2 text-[9px] text-center font-semibold border-b border-black">
                                            الملاحظات
                                        </th>
                                    </tr>
                                    {/* Sub-header row */}
                                    <tr className="bg-[#6b7dcf] text-white text-xs">
                                        <th className="py-2 text-center font-semibold w-1/6 border-l border-black">
                                            الاسم
                                        </th>
                                        <th colSpan={2} className="py-2 text-center font-semibold w-1/6 border-b border-l border-black">
                                            التوقيت
                                        </th>
                                        <th className="py-2 text-center font-semibold w-1/6 border-l border-black">

                                        </th>
                                        <th className="py-2 text-center font-semibold w-1/6 border-l border-black">
                                            جانبية
                                        </th>
                                        <th className="py-2 text-center font-semibold w-1/6 border-black">
                                            أمامية
                                        </th>
                                        <th className="py-2 text-center font-semibold w-1/6">

                                        </th>
                                        <th className="py-2 text-center font-semibold w-1/6 border-r border-black">

                                        </th>
                                    </tr>

                                    {/* Sub-header row */}
                                    <tr className="bg-[#6b7dcf] text-white text-xs">
                                        <th className="py-2 text-center font-semibold w-1/6 border-b border-l border-black">

                                        </th>
                                        <th className="py-2 text-center font-semibold w-1/6 border-b border-l border-black">
                                            من
                                        </th>
                                        <th className="py-2 text-center font-semibold w-1/6 border-b border-l border-black">
                                            الي
                                        </th>
                                        <th className="py-2 text-center font-semibold w-1/6 border-l border-black">

                                        </th>
                                        <th className="py-2 text-center font-semibold w-1/6 border-b border-l border-black">

                                        </th>
                                        <th className="py-2 text-center font-semibold w-1/6">

                                        </th>
                                        <th className="py-2 text-center font-semibold w-1/6 border-b border-black">

                                        </th>
                                        <th className="py-2 text-center font-semibold w-1/6 border-b border-r border-black">

                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    <tr className="bg-white transition-colors">

                                        <td className=" h-20 max-h-20 py-2 text-center border-r border-b border-black">
                                            <span className={`text-xs inline-flex items-center justify-center min-w-[2.25rem] px-2 h-6 min-h-fit rounded-full text-black`}>
                                                السمات الشخصية و السلوكية (OCEAN)
                                            </span>
                                        </td>

                                        <td className=" h-20 max-h-20 py-2 text-center border-r border-b border-black">
                                            <span className={`text-xs inline-flex items-center justify-center min-w-[2.25rem] px-2 h-6 min-h-fit rounded-full text-black`}>
                                                14:16
                                            </span>
                                        </td>

                                        <td className=" h-20 max-h-20 py-2 text-center border-r border-b border-black">
                                            <span className={`text-xs inline-flex items-center justify-center min-w-[2.25rem] px-2 h-6 min-h-fit rounded-full text-black`}>
                                                15:16
                                            </span>
                                        </td>

                                        {/* النسبة (الشريط) */}
                                        <td className=" h-20 max-h-20 py-2 w-[25%] border-r border-b border-black">
                                            <div className="w-[95%] h-5 min-h-fit flex justify-center items-center gap-2 rounded-full">
                                                <span className={`inline-flex items-center justify-center min-w-[20%] px-2 h-6 text-black`}>
                                                    50%
                                                </span>
                                            </div>

                                        </td>


                                        <td className=" h-20 max-h-20 p-2 text-center border-x border-b border-black">
                                            <div className="flex justify-center items-center gap-2 w-full h-14">
                                                <div className="flex-1 h-full bg-gray-400" />
                                            </div>
                                        </td>

                                        <td className=" h-20 max-h-20 p-2 text-center border-l border-b border-black">
                                            <div className="flex justify-center items-center gap-2 w-full h-14">
                                                <div className="flex-1 h-full bg-gray-400" />
                                            </div>
                                        </td>

                                        <td className=" h-20 max-h-20 py-2 text-center border-l border-b border-black">
                                            <span className={`inline-flex items-center justify-center min-w-[2.25rem] px-2 h-6 rounded-full text-black`}>
                                                70%
                                            </span>
                                        </td>

                                        <td className=" h-20 max-h-20 py-2 text-center border-l border-b border-black">
                                            <span className={`inline-flex items-center justify-center min-w-[2.25rem] px-2 h-6 rounded-full text-black`}>
                                                لا يوجد
                                            </span>
                                        </td>
                                    </tr>
                                    <tr className="bg-white transition-colors">

                                        <td className=" h-20 max-h-20 py-2 text-center border-r border-b border-black">
                                            <span className={`text-xs inline-flex items-center justify-center min-w-[2.25rem] px-2 h-6 min-h-fit rounded-full text-black`}>
                                                المعارف الفنية المتخصص (JCT)
                                            </span>
                                        </td>

                                        <td className=" h-20 max-h-20 py-2 text-center border-r border-b border-black">
                                            <span className={`text-xs inline-flex items-center justify-center min-w-[2.25rem] px-2 h-6 min-h-fit rounded-full text-black`}>
                                                14:16
                                            </span>
                                        </td>

                                        <td className=" h-20 max-h-20 py-2 text-center border-r border-b border-black">
                                            <span className={`text-xs inline-flex items-center justify-center min-w-[2.25rem] px-2 h-6 min-h-fit rounded-full text-black`}>
                                                15:16
                                            </span>
                                        </td>

                                        {/* النسبة (الشريط) */}
                                        <td className=" h-20 max-h-20 py-2 w-[25%] border-r border-b border-black">
                                            <div className="w-[95%] h-5 min-h-fit flex justify-center items-center gap-2 rounded-full">
                                                <span className={`inline-flex items-center justify-center min-w-[20%] px-2 h-6 text-black`}>
                                                    50%
                                                </span>
                                            </div>
                                        </td>
                                        <td className=" h-20 max-h-20 p-2 text-center border-x border-b border-black">
                                            <div className="flex justify-center items-center gap-2 w-full h-14">
                                                <div className="flex-1 h-full bg-gray-400" />
                                            </div>
                                        </td>

                                        <td className=" h-20 max-h-20 p-2 text-center border-l border-b border-black">
                                            <div className="flex justify-center items-center gap-2 w-full h-14">
                                                <div className="flex-1 h-full bg-gray-400" />
                                            </div>
                                        </td>

                                        <td className=" h-20 max-h-20 py-2 text-center border-l border-b border-black">
                                            <span className={`inline-flex items-center justify-center min-w-[2.25rem] px-2 h-6 rounded-full text-black`}>
                                                70%
                                            </span>
                                        </td>

                                        <td className=" h-20 max-h-20 py-2 text-center border-l border-b border-black">
                                            <span className={`inline-flex items-center justify-center min-w-[2.25rem] px-2 h-6 rounded-full text-black`}>
                                                لا يوجد
                                            </span>
                                        </td>
                                    </tr>
                                    <tr className="bg-white transition-colors">

                                        <td className=" h-20 max-h-20 py-2 text-center border-r border-b border-black">
                                            <span className={`text-xs inline-flex items-center justify-center min-w-[2.25rem] px-2 h-6 min-h-fit rounded-full text-black`}>
                                                المهارات الفنية المتخصصة (PST)
                                            </span>
                                        </td>

                                        <td className=" h-20 max-h-20 py-2 text-center border-r border-b border-black">
                                            <span className={`text-xs inline-flex items-center justify-center min-w-[2.25rem] px-2 h-6 min-h-fit rounded-full text-black`}>
                                                14:16
                                            </span>
                                        </td>

                                        <td className=" h-20 max-h-20 py-2 text-center border-r border-b border-black">
                                            <span className={`text-xs inline-flex items-center justify-center min-w-[2.25rem] px-2 h-6 min-h-fit rounded-full text-black`}>
                                                15:16
                                            </span>
                                        </td>

                                        {/* النسبة (الشريط) */}
                                        <td className=" h-20 max-h-20 py-2 w-[25%] border-r border-b border-black">
                                            <div className="w-[95%] h-5 min-h-fit flex justify-center items-center gap-2 rounded-full">
                                                <span className={`inline-flex items-center justify-center min-w-[20%] px-2 h-6 text-black`}>
                                                    50%
                                                </span>
                                            </div>
                                        </td>

                                        <td className=" h-20 max-h-20 p-2 text-center border-x border-b border-black">
                                            <div className="flex justify-center items-center gap-2 w-full h-14">
                                                <div className="flex-1 h-full bg-gray-400" />
                                            </div>
                                        </td>

                                        <td className=" h-20 max-h-20 p-2 text-center border-l border-b border-black">
                                            <div className="flex justify-center items-center gap-2 w-full h-14">
                                                <div className="flex-1 h-full bg-gray-400" />
                                            </div>
                                        </td>

                                        <td className=" h-20 max-h-20 py-2 text-center border-l border-b border-black">
                                            <span className={`inline-flex items-center justify-center min-w-[2.25rem] px-2 h-6 rounded-full text-black`}>
                                                70%
                                            </span>
                                        </td>

                                        <td className=" h-20 max-h-20 py-2 text-center border-l border-b border-black">
                                            <span className={`inline-flex items-center justify-center min-w-[2.25rem] px-2 h-6 rounded-full text-black`}>
                                                لا يوجد
                                            </span>
                                        </td>

                                    </tr>
                                    <tr className="bg-white transition-colors">

                                        <td className=" h-20 max-h-20 py-2 text-center border-r border-b border-black">
                                            <span className={`text-xs inline-flex items-center justify-center min-w-[2.25rem] px-2 h-6 min-h-fit rounded-full text-black`}>
                                                المهارات الوظيفية الناعمة (SJT)
                                            </span>
                                        </td>

                                        <td className=" h-20 max-h-20 py-2 text-center border-r border-b border-black">
                                            <span className={`text-xs inline-flex items-center justify-center min-w-[2.25rem] px-2 h-6 min-h-fit rounded-full text-black`}>
                                                14:16
                                            </span>
                                        </td>

                                        <td className=" h-20 max-h-20 py-2 text-center border-r border-b border-black">
                                            <span className={`text-xs inline-flex items-center justify-center min-w-[2.25rem] px-2 h-6 min-h-fit rounded-full text-black`}>
                                                15:16
                                            </span>
                                        </td>

                                        {/* النسبة (الشريط) */}
                                        <td className=" h-20 max-h-20 py-2 w-[25%] border-r border-b border-black">
                                            <div className="w-[95%] h-5 min-h-fit flex justify-center items-center gap-2 rounded-full">
                                                <span className={`inline-flex items-center justify-center min-w-[20%] px-2 h-6 text-black`}>
                                                    50%
                                                </span>
                                            </div>
                                        </td>

                                        <td className=" h-20 max-h-20 p-2 text-center border-x border-b border-black">
                                            <div className="flex justify-center items-center gap-2 w-full h-14">
                                                <div className="flex-1 h-full bg-gray-400" />
                                            </div>
                                        </td>

                                        <td className=" h-20 max-h-20 p-2 text-center border-l border-b border-black">
                                            <div className="flex justify-center items-center gap-2 w-full h-14">
                                                <div className="flex-1 h-full bg-gray-400" />
                                            </div>
                                        </td>

                                        <td className=" h-20 max-h-20 py-2 text-center border-l border-b border-black">
                                            <span className={`inline-flex items-center justify-center min-w-[2.25rem] px-2 h-6 rounded-full text-black`}>
                                                70%
                                            </span>
                                        </td>

                                        <td className=" h-20 max-h-20 py-2 text-center border-l border-b border-black">
                                            <span className={`inline-flex items-center justify-center min-w-[2.25rem] px-2 h-6 rounded-full text-black`}>
                                                لا يوجد
                                            </span>
                                        </td>

                                    </tr>
                                    <tr className="bg-white transition-colors">

                                        <td className=" h-20 max-h-20 py-2 text-center border-r border-b border-black">
                                            <span className={`text-xs inline-flex items-center justify-center min-w-[2.25rem] px-2 h-6 min-h-fit rounded-full text-black`}>
                                                القدرات المعرفية الاساسية (CAT)
                                            </span>
                                        </td>

                                        <td className=" h-20 max-h-20 py-2 text-center border-r border-b border-black">
                                            <span className={`text-xs inline-flex items-center justify-center min-w-[2.25rem] px-2 h-6 min-h-fit rounded-full text-black`}>
                                                14:16
                                            </span>
                                        </td>

                                        <td className=" h-20 max-h-20 py-2 text-center border-r border-b border-black">
                                            <span className={`text-xs inline-flex items-center justify-center min-w-[2.25rem] px-2 h-6 min-h-fit rounded-full text-black`}>
                                                15:16
                                            </span>
                                        </td>

                                        {/* النسبة (الشريط) */}
                                        <td className=" h-20 max-h-20 py-2 w-[25%] border-r border-b border-black">
                                            <div className="w-[95%] h-5 min-h-fit flex justify-center items-center gap-2 rounded-full">
                                                <span className={`inline-flex items-center justify-center min-w-[20%] px-2 h-6 text-black`}>
                                                    50%
                                                </span>
                                            </div>
                                        </td>

                                        <td className=" h-20 max-h-20 p-2 text-center border-x border-b border-black">
                                            <div className="flex justify-center items-center gap-2 w-full h-14">
                                                <div className="flex-1 h-full bg-gray-400" />
                                            </div>
                                        </td>

                                        <td className=" h-20 max-h-20 p-2 text-center border-l border-b border-black">
                                            <div className="flex justify-center items-center gap-2 w-full h-14">
                                                <div className="flex-1 h-full bg-gray-400" />
                                            </div>
                                        </td>

                                        <td className=" h-20 max-h-20 py-2 text-center border-l border-b border-black">
                                            <span className={`inline-flex items-center justify-center min-w-[2.25rem] px-2 h-6 rounded-full text-black`}>
                                                70%
                                            </span>
                                        </td>

                                        <td className=" h-20 max-h-20 py-2 text-center border-l border-b border-black">
                                            <span className={`inline-flex items-center justify-center min-w-[2.25rem] px-2 h-6 rounded-full text-black`}>
                                                لا يوجد
                                            </span>
                                        </td>

                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-gray-800 text-white p-2 rounded text-sm">
                    <p>{`Year: ${label}`}</p>
                    <p>{`Performance: ${payload[0].value}`}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <>
            <NewNavbar
                shareStatus={false}
            >
                <div className="flex gap-3">
                    <button
                        className="rounded-full w-10 h-10 flex justify-center items-center bg-white/80 hover:bg-gray-200 shadow transition-all"
                        title="QRCode Scan"
                        onClick={() => setIndividualsReportsStatus(true)}
                    >
                        <FontAwesomeIcon
                            icon={faFile}
                            className="text-xl text-watomsBlue"
                        />
                    </button>
                    <button
                        className="rounded-full w-10 h-10 flex justify-center items-center bg-white/80 hover:bg-gray-200 shadow transition-all"
                        title="QRCode Scan"
                    >
                        <FontAwesomeIcon
                            icon={faQrcode}
                            className="text-xl text-watomsBlue"
                        />
                    </button>
                    <button
                        className="rounded-full w-10 h-10 flex justify-center items-center bg-white/80 hover:bg-gray-200 shadow transition-all"
                        title="QRCode Scan"
                    >
                        <FontAwesomeIcon
                            icon={faPen}
                            className="text-xl text-watomsBlue"
                        />
                    </button>
                    <button
                        className="rounded-full w-10 h-10 flex justify-center items-center bg-white/80 hover:bg-gray-200 shadow transition-all"
                        title="QRCode Scan"
                    >
                        <FontAwesomeIcon
                            icon={faFolderPlus}
                            className="text-xl text-watomsBlue"
                        />
                    </button>
                </div>
            </NewNavbar>
            <div className="w-full h-[88vh] flex bg-[#0a183d]">
                {/* left side bar navigator */}
                <div className="w-[10%] bg-white/55 flex flex-col justify-evenly items-center">
                    <div>اجراءات الحوكمة</div>
                    <button onClick={() => navigate('/watoms/pe')} className="w-[90%] h-[12%] flex justify-center items-center text-yellow-400 text-sm text-center bg-[#0a183d] hover:bg-gray-500 px-2 rounded-xl border-blue-600 border-2">ملفات تاكيد الهوية</button>
                    <button onClick={() => navigate('/watoms/pe/personal-test')} className="w-[90%] h-[12%] flex flex-col justify-center items-center text-yellow-400  text-sm text-center bg-[#0a183d] hover:bg-gray-500 px-2 rounded-xl border-blue-600 border-2">اختبار السمات الشخصية و السلوكية<p>OCEAN</p></button>
                    <button onClick={() => navigate('/watoms/pe/theoretical-test')} className="w-[90%] h-[12%] flex flex-col justify-center items-center text-yellow-400  text-sm text-center bg-[#0a183d] hover:bg-gray-500 px-2 rounded-xl border-blue-600 border-2">اختبار المعارف الفنية المتخصص <p>JCT</p></button>
                    <button onClick={() => navigate('/watoms/pe/practical-test')} className="w-[90%] h-[12%] flex flex-col justify-center items-center text-yellow-400  text-sm text-center bg-[#0a183d] hover:bg-gray-500 px-2 rounded-xl border-blue-600 border-2">اختبار المهارات الفنية المتخصصة<p>PST</p></button>
                    <button onClick={() => navigate('/watoms/pe/soft-test')} className="w-[90%] h-[12%] flex flex-col justify-center items-center text-yellow-400  text-sm text-center bg-[#0a183d] hover:bg-gray-500 px-2 rounded-xl border-blue-600 border-2">اختبار المهارات الوظيفية الناعمة<p>SJT</p></button>
                    <button onClick={() => navigate('/watoms/pe/cognitive-test')} className="w-[90%] h-[12%] flex flex-col justify-center items-center text-yellow-400  text-sm text-center bg-[#0a183d] hover:bg-gray-500 px-2 rounded-xl border-blue-600 border-2">اختبار القدرات المعرفية الاساسية<p>CAT</p></button>
                </div>
                {/* user's personal test score */}
                <div className="w-[90%] flex justify-center items-center">
                    <div className="w-[95%] h-[95%] flex justify-between border-white border-2 rounded-xl p-4 gap-4">
                        {/* left column */}
                        <div className="flex flex-col w-1/3 gap-2">
                            <div className="w-full min-h-28 flex flex-col gap-2 bg-[#2d3347] rounded-[16px] shadow-[0_2px_8px_#0002] px-[24px] py-[10px]" >
                                <h1 className="text-yellow-400 text-center font-bold">عدد المراكز المعتمدة للفحص المهني</h1>
                                <div className="flex justify-center items-center gap-3">
                                    <div className="flex flex-col items-center gap-2" style={{ width: '100%', textAlign: 'center', fontWeight: 700, fontSize: 15, color: '#fff', alignItems: 'center', padding: '0 8px' }}>
                                        <span>{'المفعل'}</span>
                                        <span className="rounded-full w-14 h-14 flex justify-center items-center text-xl" style={{ fontWeight: 900, color: "black", backgroundColor: '#22c55e' }}>{String(5).padStart(2, '0')}</span>
                                    </div>
                                    <div className="flex flex-col gap-2" style={{ width: '100%', textAlign: 'center', fontWeight: 700, fontSize: 15, color: '#fff', alignItems: 'center', padding: '0 8px' }}>
                                        <span>{'الغير مفعّل'}</span>
                                        <span className="rounded-full w-14 h-14 flex justify-center items-center text-xl" style={{ fontWeight: 900, color: "black", backgroundColor: '#ef4444' }}>{String(33).padStart(2, '0')}</span>
                                    </div>
                                    <div className="flex flex-col gap-2" style={{ width: '100%', textAlign: 'center', fontWeight: 700, fontSize: 15, color: '#fff', alignItems: 'center', padding: '0 8px' }}>
                                        <span>{'إجمالي'}</span>
                                        <span className="rounded-full w-14 h-14 flex justify-center items-center text-xl" style={{ fontWeight: 900, color: "black", backgroundColor: '#3fd8ff' }}>{String(38).padStart(2, '0')}</span>
                                    </div>
                                </div>
                            </div>
                            {/* Monthly Line Chart */}
                            <AnnualPerformanceChart
                                data={data4}
                                title={`تحليل معدل تغيير الاداء الشهري`}
                                YAxisDuration={[0, 2000]}
                                YAxisTicks={[0, 500, 1000, 1500, 2000]}
                            />
                            <CustomHorizontalBarChart data={data3} title={"التعداد الدولي للعمالة  المصدرة"} />
                        </div>
                        {/* middel column */}
                        <div className="w-1/3 flex flex-col justify-center gap-4">
                            <h1 className="text-lg text-yellow-400 text-center font-bold underline">مؤشرات اداء الفحص المهني الدولي</h1>
                            <World ids={[1, 2, 3]} />
                            <div className="flex flex-col gap-4 bg-[#2d3347] rounded-[16px] py-2 px-3">
                                {/* Title */}
                                <h3 className="text-yellow-400 text-md font-bold mb-2 text-center">
                                    مؤشرات حوكمة اختبارات التقديم
                                </h3>
                                <div className="flex justify-between items-center gap-2">
                                    {/* Overall Score Circle */}
                                    <div className="flex flex-col items-center justify-center cursor-pointer">
                                        <CustomCircularProgressBar value={roundNumber(70)} size={100} color='url(#circularBlueGradient)' bg='#23263a' textColor='#fff' />
                                        <span className='text-white mt-2'>الاجمالي</span>
                                    </div>
                                    {/* Performance Bars */}
                                    <div className="flex-1 flex flex-col gap-1">
                                        {data5.map((s, idx) => (
                                            <div className='flex justify-between items-center mb-1'>
                                                <span className="text-sm font-bold text-white w-fit px-1">{s.performance}%</span>
                                                <div className="relative min-w-2/5 max-w-2/5 w-2/5 h-[22px] bg-[#444652] rounded-[18px] shadow-[0_2px_8px_#0002] overflow-hidden cursor-pointer transition-shadow duration-200 ease-in-out" >
                                                    {/* Bar fill */}
                                                    <div
                                                        className={`w-[${s.performance}%] h-full ${WATOMS_MODERN_COLORS_TW[idx]} rounded-full transition-[width] duration-[700ms] ease-[cubic-bezier(.4,2,.6,1)]`} />
                                                </div>
                                                <span className="min-w-2/5 max-w-2/5 w-2/5 text-[10px] font-medium text-white text-center">{s.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* right column */}
                        <div className="w-1/3 flex flex-col gap-2">
                            {/* total scores */}
                            <div className="w-full min-h-[60px] h-[60px] flex justify-evenly items-center gap-4 text-white bg-[#2d3347] rounded-[16px] shadow-[0_2px_8px_#0002] p-2">
                                <div className="flex justify-center items-center">
                                    <div className="text-3xl w-fit">7</div>
                                    <div className="text-xs text-end w-fit">اجمالي عدد الراسبين</div>
                                </div>
                                <div className='border-l-2 border-white h-3/4' />
                                <div className="flex justify-center items-center gap-1">
                                    <div className="text-3xl w-fit">7500</div>
                                    <div className="text-xs text-end w-1/2">اجمالي عدد الناجحين</div>
                                </div>
                                <div className='border-l-2 border-white h-3/4' />
                                <div className="flex justify-center items-center">
                                    <div className="text-3xl w-fit">7507</div>
                                    <div className="text-xs text-end w-fit">اجمالي عدد المتقدمين للاختبارات</div>
                                </div>
                            </div>
                            {/* Course Bar Chart */}
                            <CustomHorizontalBarChart data={data2} title={"الترتيب العام  لتعداد  التخصصات"} />
                            {/* Yearly Line Chart */}
                            <div className="w-full flex flex-col gap-2 bg-[#2d3347] rounded-[16px] p-2">
                                <h1 className="text-yellow-400 text-center font-bold">تحليل معدل تغيير الاداء السنوي</h1>
                                <ResponsiveContainer width="90%" height={200}>
                                    <LineChart data={data}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#444" opacity={0.3} />
                                        <XAxis
                                            dataKey="year"
                                            stroke="#888"
                                            fontSize={10}
                                            tick={{ fill: '#fff' }}
                                        />
                                        <YAxis
                                            stroke="#888"
                                            fontSize={10}
                                            tick={{ fill: '#fff' }}
                                            domain={[0, 10000]}
                                            ticks={[2500, 5000, 7500, 10000]}
                                        />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Line
                                            type="monotone"
                                            dataKey="performance"
                                            stroke="#facc15"
                                            strokeWidth={3}
                                            dot={(props) => (
                                                <circle
                                                    cx={props.cx}
                                                    cy={props.cy}
                                                    r={6}
                                                    fill="#facc15"
                                                    stroke="#fff"
                                                    strokeWidth={2}
                                                    style={{ transition: 'all 0.3s ease' }}
                                                />
                                            )}
                                            activeDot={{
                                                r: 8,
                                                fill: '#facc15',
                                                stroke: '#fff',
                                                strokeWidth: 2,
                                                style: { transition: 'all 0.3s ease' }
                                            }}
                                        >
                                            <LabelList
                                                dataKey="performance"
                                                position="top"
                                                offset={10}
                                                fill="#facc15"
                                                fontSize={11}
                                                fontWeight="bold"
                                                formatter={(value) => `${value}`}
                                            />
                                        </Line>
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>
                {individualsReportsStatus && <IndividualsReportSheet />}
            </div>
        </>
    )
}

export default WatomsPEDashboard;