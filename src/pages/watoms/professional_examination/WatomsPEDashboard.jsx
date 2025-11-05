// Components
import NewNavbar from "../../../components/NewNavbar";
import CustomHorizontalBarChart from "../../../components/customCharts/customHorizontalBarChart";
import CustomCircularProgressBar from "../../../components/customCharts/customCircularProgressBar";
import World from "../../../components/maps/World";
import AnnualPerformanceChart from "../../../components/AnnualPerformanceChart";
// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faArrowLeft, faArrowRight, faFile, faFolderPlus, faPen, faQrcode, faXmark } from "@fortawesome/free-solid-svg-icons";
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
import { COUNTRYS, WATOMS_MODERN_COLORS_TW } from "../../../constants/constants";
// images
import wabysLogo from '../../../assets/wabys.png';
import ebdaeduLogo from '../../../assets/ebad-edu.png';
import molLogo from '../../../assets/Gov.png';
import person from '../../../assets/person.jpg';
import passport from '../../../assets/passport.jpg';
import application from '../../../assets/ksaApplication.jpg';

const WatomsPEDashboard = () => {
    const navigate = useNavigate();
    const [orgStatus, setOrgStatus] = useState("All")
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
        { id: 4, name: "المهارات الوظيفية الناعمة", performance: 80 },
        { id: 2, name: "المعارف الفنية المتخصص", performance: 70 },
        { id: 3, name: "المهارات الفنية المتخصصة", performance: 55 },
        { id: 1, name: "السمات الشخصية و السلوكية", performance: 60 },
        { id: 6, name: "ملفات تاكيد الهوية", performance: 20 },
    ];

    const handleNext = () => {
        // if currently All → go to first country
        if (orgStatus === "All") {
            setOrgStatus(COUNTRYS[0]);
        } else {
            const index = COUNTRYS.indexOf(orgStatus);
            // if not last → move to next; if last → go back to "All"
            if (index < COUNTRYS.length - 1) {
                setOrgStatus(COUNTRYS[index + 1]);
            } else {
                setOrgStatus("All");
            }
        }
    };

    const handlePrevious = () => {
        // if currently All → go to last country
        if (orgStatus === "All") {
            setOrgStatus(COUNTRYS[COUNTRYS.length - 1]);
        } else {
            const index = COUNTRYS.indexOf(orgStatus);
            // if not first → move back; if first → go to "All"
            if (index > 0) {
                setOrgStatus(COUNTRYS[index - 1]);
            } else {
                setOrgStatus("All");
            }
        }
    };

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
                                <h1 className="border-b-2 border-black text-black">التقرير النهائي للفحص المهني الشامل بتاريخ 2025-11-05</h1>
                            </div>
                            {/* logo */}
                            <div className="flex flex-col">
                                <img src={molLogo} className="w-14" alt="ebda edu logo" />
                            </div>
                        </div>
                        <div className="rounded-xl shadow-black shadow-md p-2 flex flex-col mt-2 w-full gap-2">
                            {/* user's data */}
                            <h1 className="text-xs text-end font-bold">:اولاً: البيانات الاساسية للمتقدم</h1>
                            <div className="w-full border-black border-2 flex justify-end items-center p-1 gap-1 min-h-20">
                                <div className="flex flex-col gap-1 w-[20%] text-[7px] font-bold justify-center items-center">
                                    <div className="border-black border-2 h-fit w-full text-center px-2 py-1 flex justify-center items-center">test@test.com</div>
                                    <div className="border-black border-2 h-fit w-full text-center px-2 py-1 flex justify-center items-center">0110659889</div>
                                    <div className="border-black border-2 h-fit w-full text-center px-2 py-1 flex justify-center items-center">السعودية</div>
                                </div>
                                <div className="flex flex-col gap-1 min-w-fit w-[10%] text-[7px] font-bold justify-center items-center">
                                    <div className="border-black border-2 h-fit w-full text-center px-2 py-1 flex justify-center items-center bg-gray-300">البريد الالكتروني</div>
                                    <div className="border-black border-2 h-fit w-full text-center px-2 py-1 flex justify-center items-center bg-gray-300">رقم الموبيل</div>
                                    <div className="border-black border-2 h-fit w-full text-center px-2 py-1 flex justify-center items-center bg-gray-300">الدولة</div>
                                </div>
                                <div className="flex flex-col gap-1 w-[20%] text-[7px] font-bold justify-center items-center">
                                    <div className="border-black border-2 h-fit w-full text-center px-2 py-1 flex justify-center items-center">مركز الشرابية</div>
                                    <div className="border-black border-2 h-fit w-full text-center px-2 py-1 flex justify-center items-center">تجارة (1)</div>
                                    <div className="border-black border-2 h-fit w-full text-center px-2 py-1 flex justify-center items-center">74211</div>
                                </div>
                                <div className="flex flex-col gap-1 min-w-fit w-[10%] text-[7px] font-bold justify-center items-center">
                                    <div className="border-black border-2 h-fit w-full text-center px-2 py-1 flex justify-center items-center bg-gray-300">مركز الاختبار</div>
                                    <div className="border-black border-2 h-fit w-full text-center px-2 py-1 flex justify-center items-center bg-gray-300">الفئة</div>
                                    <div className="border-black border-2 h-fit w-full text-center px-2 py-1 flex justify-center items-center bg-gray-300">رقم الممتحن</div>
                                </div>
                                <div className="flex flex-col gap-1 w-[30%] text-[7px] font-bold justify-center items-center">
                                    <div className="border-black border-2 h-fit w-full text-center px-2 py-1 flex justify-center items-center">محمد احمد سيد محمد</div>
                                    <div className="border-black border-2 h-fit w-full text-center px-2 py-1 flex justify-center items-center">35286468437246</div>
                                    <div className="border-black border-2 h-fit w-full text-center px-2 py-1 flex justify-center items-center">284-871971871</div>
                                </div>
                                <div className="flex flex-col gap-1 min-w-fit w-[10%] text-[7px] font-bold justify-center items-center">
                                    <div className="border-black border-2 h-fit w-full text-center px-2 py-1 flex justify-center items-center bg-gray-300">المرشح</div>
                                    <div className="border-black border-2 h-fit w-full text-center px-2 py-1 flex justify-center items-center bg-gray-300">الرقم القومي</div>
                                    <div className="border-black border-2 h-fit w-full text-center px-2 py-1 flex justify-center items-center bg-gray-300">رقم جواز السفر</div>
                                </div>
                                {/* user's img */}
                                <div className="flex flex-col gap-1">
                                    <img className="w-20 min-w-20 border-black border-2 p-1 rounded-2xl" src={person} alt="" />
                                </div>
                            </div>
                            <h1 className="text-xs text-end font-bold">:ثانيا: ملخص الاداء والقرار الموصي به</h1>
                            <div className="rounded-2xl overflow-hidden border border-black">
                                <table className="w-full table-fixed text-white text-center" dir="rtl">
                                    <thead>
                                        <tr className="bg-[#5268b1] text-xs">
                                            <th className="py-2 border border-black font-semibold w-1/3">اجمالي التقييم</th>
                                            <th className="py-2 border border-black font-semibold w-1/3">القرار و التوصيات</th>
                                            <th className="py-2 border border-black font-semibold w-1/3">ملاحظات</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        <tr className="bg-white text-black transition">
                                            <td className="py-3 border border-black">90%</td>
                                            <td className="py-3 border border-black">اختبار</td>
                                            <td className="py-3 border border-black">لا توجد ملاحظات</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <h1 className="text-xs text-end font-bold">:ثالثا: تحليل الاداء في المحاور الرئيسية</h1>
                            <table className="w-full table-fixed border-separate border-spacing-0 rounded-xl overflow-hidden" dir="rtl">
                                <thead className="h-16">
                                    <tr className="bg-[#6b7dcf] text-white text-xs">
                                        <th className="w-[20%] py-2 text-center font-semibold border-l border-black">الاسم الاختبار</th>
                                        <th className="w-[10%] py-2 text-center font-semibold border-b border-l border-black">من</th>
                                        <th className="w-[10%] py-2 text-center font-semibold border-b border-l border-black">الي</th>
                                        <th className="w-[10%] py-2 text-center font-semibold border-l border-black">التقييم</th>
                                        <th className="w-[12%] py-2 text-center font-semibold border-l border-black px-1">صورة جانبية</th>
                                        <th className="w-[12%] py-2 text-center font-semibold border-black">صورة أمامية</th>
                                        <th className="w-[26%] py-2 text-center font-semibold border-r border-black">وضع الاداء مقارنة بالمعايير</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-100">
                                    {[
                                        "السمات الشخصية و السلوكية (OCEAN)",
                                        "المعارف الفنية المتخصص (JCT)",
                                        "المهارات الفنية المتخصصة (PST)",
                                        "المهارات الوظيفية الناعمة (SJT)",
                                        "القدرات المعرفية الاساسية (CAT)",
                                        "ملفات تاكيد الهوية"
                                    ].map((exam, index) => (
                                        <tr key={index} className="bg-white transition-colors">
                                            <td className="h-20 max-h-20 py-2 text-center border-r border-b border-black">
                                                <span className="text-xs inline-flex items-center justify-center min-w-[2.25rem] px-2 h-6 min-h-fit rounded-full text-black">
                                                    {exam}
                                                </span>
                                            </td>

                                            <td className="h-20 py-2 text-center border-r border-b border-black whitespace-nowrap">
                                                <span className="text-xs inline-flex items-center justify-center px-2 h-6 min-h-fit rounded-full text-black">
                                                    14:16
                                                </span>
                                            </td>

                                            <td className="h-20 py-2 text-center border-r border-b border-black whitespace-nowrap">
                                                <span className="text-xs inline-flex items-center justify-center px-2 h-6 min-h-fit rounded-full text-black">
                                                    15:16
                                                </span>
                                            </td>

                                            {/* التقييم */}
                                            <td className="h-20 max-h-20 py-2 w-[25%] border-r border-b border-black">
                                                <div className="w-[95%] h-5 flex justify-center items-center gap-2 rounded-full">
                                                    <span className="inline-flex items-center justify-center px-2 h-6 text-black">50%</span>
                                                </div>
                                            </td>

                                            {/* صور */}
                                            <td className="h-20 max-h-20 p-2 text-center border-x border-b border-black">
                                                <div className="flex justify-center items-center gap-2 w-full h-14">
                                                    <div className="flex-1 h-full bg-gray-400" />
                                                </div>
                                            </td>

                                            <td className="h-20 max-h-20 p-2 text-center border-l border-b border-black">
                                                <div className="flex justify-center items-center gap-2 w-full h-14">
                                                    <div className="flex-1 h-full bg-gray-400" />
                                                </div>
                                            </td>

                                            {/* الملاحظات */}
                                            <td className="h-20 max-h-20 py-2 text-center border-l border-b border-black w-[18%] break-words">
                                                <span className="inline-flex items-center justify-center min-w-[2.25rem] px-2 h-6 rounded-full text-black">
                                                    لا يوجد
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                {/* page 2 */}
                <div className="relative max-w-5xl w-[40%] h-fit flex text-black bg-white p-3 mt-4">
                    <div className="w-full flex flex-col border-black border-2 rounded-xl p-2 gap-2">
                        <h1 className="text-xs text-end font-bold">:رابعا : نموذج التقييم العملي</h1>
                        <div className="w-full border-black border-2 flex justify-end items-center p-1 gap-1 min-h-20">
                            <div className="flex flex-col gap-1 w-[20%] text-[7px] font-bold justify-center items-center">
                                <div className="border-black border-2 h-fit w-full text-center px-2 py-1 flex justify-center items-center">test@test.com</div>
                                <div className="border-black border-2 h-fit w-full text-center px-2 py-1 flex justify-center items-center">0110659889</div>
                                <div className="border-black border-2 h-fit w-full text-center px-2 py-1 flex justify-center items-center">السعودية</div>
                            </div>
                            <div className="flex flex-col gap-1 min-w-fit w-[10%] text-[7px] font-bold justify-center items-center">
                                <div className="border-black border-2 h-fit w-full text-center px-2 py-1 flex justify-center items-center bg-gray-300">البريد الالكتروني</div>
                                <div className="border-black border-2 h-fit w-full text-center px-2 py-1 flex justify-center items-center bg-gray-300">رقم الموبيل</div>
                                <div className="border-black border-2 h-fit w-full text-center px-2 py-1 flex justify-center items-center bg-gray-300">الدولة</div>
                            </div>
                            <div className="flex flex-col gap-1 w-[20%] text-[7px] font-bold justify-center items-center">
                                <div className="border-black border-2 h-fit w-full text-center px-2 py-1 flex justify-center items-center">مركز الشرابية</div>
                                <div className="border-black border-2 h-fit w-full text-center px-2 py-1 flex justify-center items-center">تجارة (1)</div>
                                <div className="border-black border-2 h-fit w-full text-center px-2 py-1 flex justify-center items-center">74211</div>
                            </div>
                            <div className="flex flex-col gap-1 min-w-fit w-[10%] text-[7px] font-bold justify-center items-center">
                                <div className="border-black border-2 h-fit w-full text-center px-2 py-1 flex justify-center items-center bg-gray-300">مركز الاختبار</div>
                                <div className="border-black border-2 h-fit w-full text-center px-2 py-1 flex justify-center items-center bg-gray-300">الفئة</div>
                                <div className="border-black border-2 h-fit w-full text-center px-2 py-1 flex justify-center items-center bg-gray-300">رقم الممتحن</div>
                            </div>
                            <div className="flex flex-col gap-1 w-[30%] text-[7px] font-bold justify-center items-center">
                                <div className="border-black border-2 h-fit w-full text-center px-2 py-1 flex justify-center items-center">محمد احمد سيد محمد</div>
                                <div className="border-black border-2 h-fit w-full text-center px-2 py-1 flex justify-center items-center">35286468437246</div>
                                <div className="border-black border-2 h-fit w-full text-center px-2 py-1 flex justify-center items-center">284-871971871</div>
                            </div>
                            <div className="flex flex-col gap-1 min-w-fit w-[10%] text-[7px] font-bold justify-center items-center">
                                <div className="border-black border-2 h-fit w-full text-center px-2 py-1 flex justify-center items-center bg-gray-300">المرشح</div>
                                <div className="border-black border-2 h-fit w-full text-center px-2 py-1 flex justify-center items-center bg-gray-300">الرقم القومي</div>
                                <div className="border-black border-2 h-fit w-full text-center px-2 py-1 flex justify-center items-center bg-gray-300">رقم جواز السفر</div>
                            </div>
                            {/* user's img */}
                            <div className="flex flex-col gap-1">
                                <img className="w-20 min-w-20 border-black border-2 p-1 rounded-2xl" src={person} alt="" />
                            </div>
                        </div>
                        <table className="w-full border border-black text-center text-[7px]" dir="rtl">
                            <thead>
                                <tr>
                                    <th colSpan={8} className="border border-black py-1">
                                        غير مرضى = 0 &nbsp; ضعيف = 1 &nbsp; أقل من المتوسط = 2 &nbsp; مرضي = 3 &nbsp; جيد = 4 &nbsp; ممتاز = 5
                                    </th>
                                </tr>
                                <tr className="bg-[#007d88] text-white">
                                    <th className="border border-black w-[5%] py-1">#</th>
                                    <th className="border border-black w-[55%] py-1">البيان</th>
                                    <th colSpan={6} className="border border-black py-1">التقييمات</th>
                                </tr>
                                <tr className="bg-[#008b95] text-white">
                                    <th colSpan={2}></th>
                                    <th className="border border-black w-[7%] py-1">0</th>
                                    <th className="border border-black w-[7%] py-1">1</th>
                                    <th className="border border-black w-[7%] py-1">2</th>
                                    <th className="border border-black w-[7%] py-1">3</th>
                                    <th className="border border-black w-[7%] py-1">4</th>
                                    <th className="border border-black w-[7%] py-1">5</th>
                                </tr>
                            </thead>

                            <tbody>
                                {/* Section 1 */}
                                <tr className="bg-gray-100">
                                    <td colSpan={8} className="border border-black text-right font-bold px-2">
                                        فهم المشكلة وسير العملية التجريبية
                                    </td>
                                </tr>
                                {[
                                    "هل أظهر المرشح فهما لأهداف المهمة والغرض منها والعمل على تحقيقها؟",
                                    "استخدم المرشح المواد الخام بطريقة لجمع المعلومات الضرورية أو حل المسائل؟",
                                    "هل أظهر المرشح جميع التعليمات؟",
                                    "هل أظهر المرشح مهارات فعالة في إدارة الوقت و إكمال المهمة ضمن إطار زمني معقول؟",
                                    "هل أظهر المرشح القدرة على اتباع التسلسل المنطقي وترتيب المهام بالترتيب الصحيح؟",
                                ].map((text, i) => (
                                    <tr key={i}>
                                        <td className="border border-black py-2 font-bold">Q{i + 1}</td>
                                        <td className="border border-black text-right px-2">{text}</td>
                                        {[0, 1, 2, 3, 4, 5].map((n) => (
                                            <td key={n} className="border border-black"></td>
                                        ))}
                                    </tr>
                                ))}

                                {/* Section 2 */}
                                <tr className="bg-gray-100">
                                    <td colSpan={8} className="border border-black text-right font-bold px-2">
                                        الأمن والسلامة
                                    </td>
                                </tr>
                                {[
                                    "هل اختار المرشح معدات الحماية الشخصية المناسبة (PPE) وارتداها قبل تنفيذ المهمة؟",
                                    "هل اختار المرشح جميع احتياطات السلامة أثناء أداء المهمة؟",
                                    "هل تخلص المرشح من المواد أو النفايات الخطرة بطريقة صحيحة تراعي سلامة الآخرين؟",
                                ].map((text, i) => (
                                    <tr key={`safety-${i}`}>
                                        <td className="border border-black py-2 font-bold">Q{i + 1}</td>
                                        <td className="border border-black text-right px-2">{text}</td>
                                        {[0, 1, 2, 3, 4, 5].map((n) => (
                                            <td key={n} className="border border-black"></td>
                                        ))}
                                    </tr>
                                ))}

                                {/* Section 3 */}
                                <tr className="bg-gray-100">
                                    <td colSpan={8} className="border border-black text-right font-bold px-2">
                                        الأدوات والمعـدات
                                    </td>
                                </tr>
                                {[
                                    "هل أظهر المرشح الكفاءة في استخدام الأدوات والمعدات المطلوبة للمهمة؟",
                                    "هل استخدم المرشح المعدات الأساسية و الأدوات لتحديد المشكلة التجريبية؟",
                                    "هل أظهر المرشح مهارة تركيب/إصلاح/استبدال المكونات أثناء العرض؟",
                                ].map((text, i) => (
                                    <tr key={`tools-${i}`}>
                                        <td className="border border-black py-2 font-bold">Q{i + 1}</td>
                                        <td className="border border-black text-right px-2">{text}</td>
                                        {[0, 1, 2, 3, 4, 5].map((n) => (
                                            <td key={n} className="border border-black"></td>
                                        ))}
                                    </tr>
                                ))}

                                {/* Section 4 */}
                                <tr className="bg-gray-100">
                                    <td colSpan={8} className="border border-black text-right font-bold px-2">
                                        الصحة والنظافة
                                    </td>
                                </tr>
                                {[
                                    "هل حافظ المرشح على منطقة عمل نظيفة ومنظمة طوال فترة المهمة؟",
                                    "هل قام المرشح بتسليم جميع المعدات في حالة جيدة؟",
                                ].map((text, i) => (
                                    <tr key={`hygiene-${i}`}>
                                        <td className="border border-black py-2 font-bold">Q{i + 1}</td>
                                        <td className="border border-black text-right px-2">{text}</td>
                                        {[0, 1, 2, 3, 4, 5].map((n) => (
                                            <td key={n} className="border border-black"></td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Bottom summary table */}
                        <table className="w-full border border-black text-center text-[7px] mt-2" dir="rtl">
                            <thead>
                                <tr className="bg-[#008b95] text-white">
                                    <th colSpan={3} className="border border-black py-1">البيان</th>
                                    <th colSpan={11} className="border border-black py-1">الأدنى</th>
                                    <th colSpan={11} className="border border-black py-1">الأعلى</th>
                                </tr>
                                <tr className="bg-[#00a3af] text-white">
                                    <th colSpan={3}></th>
                                    {[...Array(11)].map((_, i) => (
                                        <th key={i} className="border border-black w-[3%] py-1">{i}</th>
                                    ))}
                                    {[...Array(11)].map((_, i) => (
                                        <th key={`high-${i}`} className="border border-black w-[3%] py-1">
                                            {10 - i}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    "قيم المرشح بناءً على أدائه العام في المهمة الموكلة إليه",
                                    "أتم المرشح بنجاح إنجاز النتيجة النهائية",
                                    "قيّم القدرة الكلية للمرشح على استخدام الأدوات والمعدات المخصصة",
                                ].map((text, i) => (
                                    <tr key={i}>
                                        <td className="border border-black py-2 font-bold">Q{i + 1}</td>
                                        <td className="border border-black text-right px-2" colSpan={2}>{text}</td>
                                        {[...Array(22)].map((_, j) => (
                                            <td key={j} className="border border-black"></td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="flex flex-col gap-2 text-[7px]">
                            <h1 className="text-center">الاقرار و الالتزام</h1>
                            <h1 className="text-end px-1">انا الموقع أدناه, أقر بموجب هذا بأنني أتحمل المسؤلية الكاملة عن دقة المعلومات المقدمة في نموذج التقييم العملي هذا. وأقر بأنني سأتحمل المسؤلية القانونية اذا تبين ايا من المعلومات المذكورة أعلاه غير صحيحة او مضللة</h1>
                            <h1 className="text-end px-1">:معلومات المقييم</h1>
                            <div className="w-full flex justify-between text-[7px]">
                                <div className="h-8 flex justify-center gap-1">
                                    <label className="text-[7px]">التوقيع الالكتروني</label>
                                </div>
                                <div className="h-8 flex justify-center gap-1">
                                    <label className="text-[7px]">:رقم الهوية</label>
                                </div>
                                <div className="h-8 flex justify-center gap-1">
                                    <label className="text-[7px]">:اسم المراقب</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* page 3 */}
                <div className="relative max-w-5xl w-[40%] h-fit flex text-black bg-white p-3 mt-4">
                    <div className="w-full flex flex-col items-center border-black border-2 rounded-xl p-2 gap-2">
                        <h1 className="w-full text-xs text-end font-bold">رابعا - جواز السفر</h1>
                        {/* passport data */}
                        <img src={passport} alt="" />
                        <h1 className="w-full text-xs text-end font-bold">خامسا - تذكرة امتحان المتقدم</h1>
                        <div className="border-black border-2 rounded-xl w-[98%] h-[500px] bg-gray-500" alt="" />
                        <h1 className="text-sm text-center font-bold">مع خالص الشكر و التقدير</h1>
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
                    <button onClick={() => navigate('/watoms/pe')} className="w-[90%] h-[12%] flex justify-center items-center text-yellow-400 text-sm text-center bg-[#0a183d] hover:bg-gray-500 px-2 rounded-xl border-blue-600 border-2">تقييم مسئول الجودة والحوكمة</button>
                    <button onClick={() => navigate('/watoms/pe/observer-evaluation')} className="w-[90%] h-[12%] flex justify-center items-center text-yellow-400 text-sm text-center bg-[#0a183d] hover:bg-gray-500 px-2 rounded-xl border-blue-600 border-2">تقييم مراقب الاختبار</button>
                    <button onClick={() => navigate('/watoms/pe')} className="w-[90%] h-[12%] flex justify-center items-center text-yellow-400 text-sm text-center bg-[#0a183d] hover:bg-gray-500 px-2 rounded-xl border-blue-600 border-2">اختبارات المرشحين</button>
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
                            <CustomHorizontalBarChart data={data3} title={"التعداد الدولي للعمالة  المصدرة"} />
                        </div>
                        {/* middel column */}
                        <div className="w-1/3 flex flex-col justify-center gap-4">
                            <div className="flex justify-evenly items-center">
                                <div
                                    className="flex justify-center items-center text-yellow-400 rounded-full cursor-pointer"
                                    onClick={handlePrevious}
                                >
                                    <FontAwesomeIcon icon={faArrowLeft} />
                                </div>

                                <h1 className="text-md text-yellow-400 text-center font-bold underline">
                                    مؤشرات الفحص المهني{" "}
                                    {orgStatus === "All" ? "الدولي" : orgStatus}
                                </h1>

                                <div
                                    className="flex justify-center items-center text-yellow-400 rounded-full cursor-pointer"
                                    onClick={handleNext}
                                >
                                    <FontAwesomeIcon icon={faArrowRight} />
                                </div>
                            </div>
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
                                                <div className="relative min-w-2/6 max-w-2/6 w-2/6 h-[22px] bg-[#444652] rounded-[18px] shadow-[0_2px_8px_#0002] overflow-hidden cursor-pointer transition-shadow duration-200 ease-in-out" >
                                                    {/* Bar fill */}
                                                    <div
                                                        className={`w-[${s.performance}%] h-full ${WATOMS_MODERN_COLORS_TW[idx]} rounded-full transition-[width] duration-[700ms] ease-[cubic-bezier(.4,2,.6,1)]`} />
                                                </div>
                                                <span className="min-w-3/6 max-w-3/6 w-3/6 text-[10px] font-medium text-white text-center">{s.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* right column */}
                        <div className="w-1/3 flex flex-col gap-2">
                            {/* total scores */}
                            <div className="w-full min-h-[70px] h-[70px] flex justify-evenly items-center text-white bg-[#2d3347] rounded-[16px] shadow-[0_2px_8px_#0002] p-2">
                                <div className="flex-1 flex flex-col justify-center items-center">
                                    <div className="w-full h-[35px] flex justify-center items-center text-[10px] text-center font-bold border-white border-b-2">نسبة النجاح</div>
                                    <div className="h-[35px] text-2xl w-fit">90%</div>
                                </div>
                                <div className='border-l-2 border-white h-3/5' />
                                <div className="flex-1 flex flex-col justify-center items-center">
                                    <div className="w-full h-[35px] flex justify-center items-center text-[10px] text-center font-bold border-white border-b-2">اجمالي الراسبين</div>
                                    <div className="h-[35px] text-2xl w-fit">7</div>
                                </div>
                                <div className='border-l-2 border-white h-3/5' />
                                <div className="flex-1 flex flex-col justify-center items-center">
                                    <div className="w-full h-[35px] flex justify-center items-center text-[10px] text-center font-bold border-white border-b-2">اجمالي الناجحين</div>
                                    <div className="h-[35px] text-2xl w-fit">7500</div>
                                </div>
                                <div className='border-l-2 border-white h-3/5' />
                                <div className="flex-1 flex flex-col justify-center items-center">
                                    <div className="w-full h-[35px] flex justify-center items-center text-[10px] text-center font-bold border-white border-b-2">اجمالي المتقدمين</div>
                                    <div className="h-[35px] text-2xl w-fit">7507</div>
                                </div>
                            </div>
                            {/* Course Bar Chart */}
                            <CustomHorizontalBarChart data={data2} title={"الترتيب العام  لتعداد  التخصصات"} />
                            {/* Monthly Line Chart */}
                            <AnnualPerformanceChart
                                data={data4}
                                title={`تحليل معدل تغيير الاداء الشهري`}
                                YAxisDuration={[0, 2000]}
                                YAxisTicks={[0, 500, 1000, 1500, 2000]}
                            />
                        </div>
                    </div>
                </div>
                {individualsReportsStatus && <IndividualsReportSheet />}
            </div>
        </>
    )
}

export default WatomsPEDashboard;