import React, { useEffect, useState } from "react";
import ebdaeduLogo from "../assets/ebad-edu.png";
import wabysLogo from "../assets/wabys.png";
import golLogo from "../assets/Gov.png";
import img from "../assets/ismailiaManager.jpg";
import { ORG_MANAGER_IMG } from "../constants/constants";
import DonutChart from "./DonutChart";
import CustomLineChart from "./CustomLineChart";

const data = [
    {
        month: "يناير",
        annual: "65%",
        negativeCount: 100,
        negativeGrade: 250,
        positiveCount: 300,
        positiveGrade: 750,
        net: "80%",
        penalties: 3,
        accuracy: "70%",
    },
    {
        month: "فبراير",
        annual: "75%",
        negativeCount: 50,
        negativeGrade: 250,
        positiveCount: 300,
        positiveGrade: 750,
        net: "60%",
        penalties: 35,
        accuracy: "75%",
    },
    {
        month: "مارس",
        annual: "80%",
        negativeCount: 200,
        negativeGrade: 250,
        positiveCount: 300,
        positiveGrade: 750,
        net: "70%",
        penalties: 40,
        accuracy: "65%",
    },
    {
        month: "ابريل",
        annual: "75%",
        negativeCount: 150,
        negativeGrade: 250,
        positiveCount: 300,
        positiveGrade: 750,
        net: "77%",
        penalties: 50,
        accuracy: "77%",
    },
    {
        month: "مايو",
        annual: "90%",
        negativeCount: 200,
        negativeGrade: 250,
        positiveCount: 300,
        positiveGrade: 750,
        net: "88%",
        penalties: 60,
        accuracy: "80%",
    },
    {
        month: "يونيو",
        annual: "85%",
        negativeCount: 175,
        negativeGrade: 250,
        positiveCount: 300,
        positiveGrade: 750,
        net: "90%",
        penalties: 70,
        accuracy: "85%",
    },
];

const chartData = [
    { month: "ابريل", performance: 72, color: "#f87171" },
    { month: "مايو", performance: 45, color: "#f87171" },
    { month: "يونيو", performance: 88, color: "#f87171" },
    { month: "يوليو", performance: 66, color: "#f87171" },
    { month: "اغسطس", performance: 53, color: "#f87171" },
    { month: "سبتمبر", performance: 91, color: "#f87171" },
];

const chartData2 = [
    { month: "ابريل", performance: 72, color: "#f87171" },
    { month: "مايو", performance: 45, color: "#f87171" },
    { month: "يونيو", performance: 88, color: "#f87171" },
    { month: "يوليو", performance: 66, color: "#f87171" },
    { month: "اغسطس", performance: 53, color: "#f87171" },
    { month: "سبتمبر", performance: 91, color: "#f87171" },
];


const evaluationData = [
    {
        category: "السمات العامة للشخصية",
        items: [
            { name: "تحمل المسؤولية", score: 7 },
            { name: "الانضباط", score: 7 },
            { name: "الإلتزام بالمواعيد", score: 8 },
            { name: "الأمانة وحسن الخلق", score: 7 },
            { name: "تغليب المصلحة العامة على الشخصية", score: 5 },
            { name: "الثقة في النفس", score: 7 },
            { name: "المظهر العام والنظافة الشخصية", score: 7 },
            { name: "مستوى الكفاءة في المجال التخصصي", score: 6 },
        ],
    },
    {
        category: "التقييم الوظيفي",
        items: [
            { name: "القدرة على تفعيل مبادئ الحوكمة", score: 7 },
            { name: "التعاون مع الزملاء", score: 7 },
            { name: "⁠القدرة على إنفاذ الخطط الاستراتيجية والتشغيلية على الأرض", score: 7 },
            { name: "القدرة على تفعيل المنظومة الإلكترونية", score: 6 },
            { name: "القدرة على العمل تحت ضغط", score: 6 },
        ],
    },
    {
        category: "المهارات الشخصية",
        items: [
            { name: "المهارات القيادية", score: 7 },
            { name: "سرعة البديهة وحسن التصرف", score: 7 },
            { name: "اللباقة أثناء الحديث", score: 7 },
            { name: "مهارات التواصل والإقناع", score: 6 },
            { name: "الإبتكار والإبداع", score: 7 },
        ],
    },
];

const WatomsSecretReport = ({ id, onClose, org }) => {
    const [selectedMonthIdx, setSelectedMonthIdx] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(null);

    useEffect(() => {
        setSelectedMonthIdx(org.months.length - 1)
        setSelectedMonth(org.months[org.months.length - 1])
        console.log(org.months[org.months.length - 1])
    }, [])

    const toggleMonth = (status) => {
        if (status) {
            if (selectedMonthIdx !== org.months.length - 1) {
                setSelectedMonth(org.months[selectedMonthIdx + 1]);
                setSelectedMonthIdx(prev => prev + 1);
            }
        } else {
            if (selectedMonthIdx !== 0) {
                setSelectedMonth(org.months[selectedMonthIdx - 1]);
                setSelectedMonthIdx(prev => prev - 1);
            }
        }
    }
    return (
        <div className="fixed inset-0 bg-black/60 flex flex-col overflow-y-auto justify-start gap-6 items-center z-50">
            <div className="relative bg-white w-[40%] max-w-5xl h-[97vh] p-4 flex flex-col">
                <div className="rounded-2xl border-black border-2 h-full flex flex-col items-center gap-2 py-2">
                    <div className="flex justify-between w-full p-2">
                        <div className="flex flex-col">
                            <img src={wabysLogo} className="w-14" alt="wabys logo" />
                            <img src={ebdaeduLogo} className="ml-3 w-10" alt="ebda edu logo" />
                        </div>
                        <div className="flex flex-col items-center gap-2 text-xs font-bold">
                            <h1 className="text-red-600 border-b-2 border-red-600">سري و شخصي</h1>
                            <h1 className="border-b-2 border-black">تقرير التقييم العام لمديري مراكز التدريب المهني</h1>
                            <h1 className="border-b-2 border-black">عن شهر {selectedMonth?.month} 2025</h1>
                        </div>
                        <img src={golLogo} className="w-10 h-10 mr-3 mt-1" alt="gol logo" />
                    </div>
                    <div style={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: 10,
                    }}>
                        {selectedMonthIdx !== 0 ? <button
                            onClick={() => toggleMonth(false)}
                            className="flex justify-center items-center"
                            style={{
                                color: '#0af',
                                border: 'none',
                                borderRadius: '50%',
                                fontSize: 20,
                                fontWeight: 900,
                                cursor: 'pointer',
                                transition: 'background 0.2s',
                            }}
                            title="الشهر السابق"
                        >
                            &#8592;
                        </button> : <div
                            style={{
                                border: 'none',
                                borderRadius: '50%',
                                fontSize: 20,
                                fontWeight: 900,
                                display: "hidden",
                            }}></div>}
                        <span style={{ fontWeight: 700, fontSize: 15, minWidth: 80, textAlign: 'center', letterSpacing: 1 }}>
                            {selectedMonth?.month}
                        </span>
                        {selectedMonthIdx !== (org?.months.length - 1) ? <button
                            onClick={() => toggleMonth(true)}
                            className="flex justify-center items-center"
                            style={{
                                color: '#0af',
                                border: 'none',
                                borderRadius: '50%',
                                fontSize: 20,
                                fontWeight: 900,
                                cursor: 'pointer',
                                transition: 'background 0.2s',
                            }}
                            title="الشهر التالي"
                        >
                            &#8594;
                        </button> : <div
                            style={{
                                border: 'none',
                                borderRadius: '50%',
                                fontSize: 22,
                                fontWeight: 900,
                                display: "hidden",
                            }}></div>}
                    </div>
                    <div className="w-[95%] border-black border-2 flex p-1 gap-1 min-h-20">
                        <div className="flex flex-col items-center text-center gap-1 w-[15%] font-bold">
                            <div className="text-[10px] border-black border-2 w-full bg-gray-300 h-1/2 flex justify-center items-center">التقييم العام</div>
                            <div className="text-sm border-black border-2 w-full h-1/2 flex justify-center items-center">67%</div>
                        </div>
                        <div className="flex flex-col gap-1 w-2/3 text-[10px] font-bold justify-center items-center">
                            <div className="border-black border-2 h-fit w-full text-center px-2 py-1 flex justify-center items-center">{org?.managerFirstName} {org.managerMiddleName} {org.managerLastName}</div>
                            <div className="border-black border-2 h-fit w-full text-center px-2 py-1 flex justify-center items-center">{org?.name}</div>
                        </div>
                        <div className="flex flex-col gap-1 min-w-fit max-w-1/3 text-[10px] font-bold justify-center items-center">
                            <div className="border-black border-2 h-fit w-full text-center px-2 py-1 flex justify-center items-center bg-gray-300">الاسم</div>
                            <div className="border-black border-2 h-fit w-full text-center px-2 py-1 flex justify-center items-center bg-gray-300">القسم</div>
                        </div>
                        <div className="border-black border-2 p-1">
                            <img className="w-16" src={ORG_MANAGER_IMG.find(org => org.id === id)?.img} alt="" />
                        </div>
                        <div className="flex justify-center items-center">
                            <div className="px-2 bg-gray-300 border-black border-2 text-xs">1</div>
                        </div>
                    </div>
                    <div className="w-[95%] flex flex-col gap-1">
                        <h1 className="text-end font-bold text-[11px]">:اولا: تقييم مدير المركز</h1>
                        <div className="border-black border-2 rounded-2xl flex items-center p-2 gap-2">
                            <div className="w-[65%] h-40 flex flex-col justify-center items-center border-black border-2 rounded-2xl p-2">
                                <h1 className="text-center text-[10px]">معدل تغير اداء المدير الشهري</h1>
                                <CustomLineChart data={chartData} />
                            </div>
                            <div className="w-0 h-16 border-l-2 border-black" />
                            <div className="w-[30%] flex flex-col justify-center items-center border-black border-2 rounded-2xl p-2 gap-4">
                                <h1 className="text-center text-[10px]">التقييم العام الحالي</h1>
                                <DonutChart value={56} />
                            </div>
                        </div>
                    </div>
                    <div className="w-[95%] flex flex-col gap-1">
                        <h1 className="text-end font-bold text-[11px]">:ثانيا: تقييم المركز</h1>
                        <div className="border-black border-2 rounded-2xl flex items-center p-2 gap-2">
                            <div className="w-[65%] h-40 flex flex-col justify-center items-center border-black border-2 rounded-2xl p-2">
                                <h1 className="text-center text-[10px]">تحليل معدل تغيير اداء المركز</h1>
                                <CustomLineChart data={chartData2} />
                            </div>
                            <div className="w-0 h-16 border-l-2 border-black" />
                            <div className="w-[30%] flex flex-col justify-center items-center border-black border-2 rounded-2xl p-2 gap-4">
                                <h1 className="text-center text-[10px]">تقييم اداء المركز</h1>
                                <DonutChart value={56} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="relative bg-white w-[40%] max-w-5xl h-[97vh] p-4 flex flex-col">
                <div className="rounded-2xl border-black border-2 h-full flex flex-col items-center gap-2 py-2">
                    <div className="w-[95%] border-black rounded-2xl p-2 border-2">
                        <h1 className="text-end font-bold text-[11px]">:ثالثا: جدول الاجماليات العامة للتقييم</h1>
                        <table className="w-full border-collapse border border-gray-300 text-center text-[10px]">
                            <thead>
                                <tr className="bg-slate-700 text-white">
                                    <th rowSpan={2} className="border border-gray-300 px-2 py-2">اجمالي التقييم</th>
                                    <th rowSpan={2} className="border border-gray-300 px-2 py-2">معدل إنجاز المهام</th>
                                    <th colSpan={5} className="border border-gray-300 px-2 py-2">إجمالي الملاحظات</th>
                                    <th rowSpan={2} className="border border-gray-300 px-2 py-2">تقييم المركز</th>
                                    <th rowSpan={2} className="border border-gray-300 px-2 py-2">تقييم مدير المركز</th>
                                    <th rowSpan={2} className="border border-gray-300 px-2 py-2">الشهر</th>
                                </tr>
                                <tr className="bg-slate-600 text-white">
                                    <th className="border border-gray-300 px-2 py-2">صافي التقييم</th>
                                    <th colSpan={2} className="border border-gray-300 px-2 py-2">سلبية</th>
                                    <th colSpan={2} className="border border-gray-300 px-2 py-2">إيجابية</th>
                                </tr>
                            </thead>

                            <tbody>
                                {data.map((row, idx) => (
                                    <tr
                                        key={idx}
                                        className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}
                                    >
                                        <td className="border border-gray-300 px-3 py-2">{row.penalties}</td>
                                        <td className="border border-gray-300 px-3 py-2">{row.accuracy}</td>

                                        <td className="border border-gray-300 px-3 py-2 font-bold">{row.net}</td>
                                        <td className="border border-gray-300 px-3 py-2">{row.negativeCount}</td>
                                        <td className="border border-gray-300 px-3 py-2">{row.negativeGrade}</td>

                                        <td className="border border-gray-300 px-3 py-2">{row.positiveCount}</td>
                                        <td className="border border-gray-300 px-3 py-2">{row.positiveGrade}</td>

                                        <td className="border border-gray-300 px-3 py-2">{row.annual}</td>
                                        <td className="border border-gray-300 px-3 py-2">{row.annual}</td>
                                        <td className="border border-gray-300 px-3 py-2">{row.month}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="w-[95%] font-bold">
                        <h1 className="text-end text-[11px]">:رابعا: الملاحظات</h1>
                        <div className="border-black border-2 w-full text-red-600 text-end text-[10px] min-h-20">
                            يحتاج للتحفيز المستمر
                        </div>
                    </div>
                </div>
            </div>
            <div className="relative bg-white w-[40%] max-w-5xl h-[97vh] min-h-fit p-3 flex flex-col">
                <div className="rounded-2xl border-black border-2 h-full flex flex-col items-center gap-1 py-2">
                    <div className="flex justify-between w-full p-2">
                        <div className="flex flex-col">
                            <img src={wabysLogo} className="w-14" alt="wabys logo" />
                            <img src={ebdaeduLogo} className="ml-3 w-10" alt="ebda edu logo" />
                        </div>
                        <div className="flex flex-col items-center gap-2 text-xs font-bold">
                            <h1 className="text-red-600 border-b-2 border-red-600">سري و شخصي</h1>
                            <h1 className="border-b-2 border-black">تقرير التقييم الشهري لمديري مراكز التدريب المهني</h1>
                            <h1 className="border-b-2 border-black">عن شهر {selectedMonth?.month} 2025</h1>
                        </div>
                        <img src={golLogo} className="w-10 h-10 mr-3 mt-1" alt="gol logo" />
                    </div>
                    <div style={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: 10,
                    }}>
                        {selectedMonthIdx !== 0 ? <button
                            onClick={() => toggleMonth(false)}
                            className="flex justify-center items-center"
                            style={{
                                color: '#0af',
                                border: 'none',
                                borderRadius: '50%',
                                fontSize: 20,
                                fontWeight: 900,
                                cursor: 'pointer',
                                transition: 'background 0.2s',
                            }}
                            title="الشهر السابق"
                        >
                            &#8592;
                        </button> : <div
                            style={{
                                border: 'none',
                                borderRadius: '50%',
                                fontSize: 20,
                                fontWeight: 900,
                                display: "hidden",
                            }}></div>}
                        <span style={{ fontWeight: 700, fontSize: 15, minWidth: 80, textAlign: 'center', letterSpacing: 1 }}>
                            {selectedMonth?.month}
                        </span>
                        {selectedMonthIdx !== (org?.months.length - 1) ? <button
                            onClick={() => toggleMonth(true)}
                            className="flex justify-center items-center"
                            style={{
                                color: '#0af',
                                border: 'none',
                                borderRadius: '50%',
                                fontSize: 20,
                                fontWeight: 900,
                                cursor: 'pointer',
                                transition: 'background 0.2s',
                            }}
                            title="الشهر التالي"
                        >
                            &#8594;
                        </button> : <div
                            style={{
                                border: 'none',
                                borderRadius: '50%',
                                fontSize: 22,
                                fontWeight: 900,
                                display: "hidden",
                            }}></div>}
                    </div>
                    <div className="w-[95%] border-black border-2 flex p-1 gap-1 min-h-20">
                        <div className="flex flex-col items-center text-center gap-1 w-[15%] font-bold">
                            <div className="text-[10px] border-black border-2 w-full bg-gray-300 h-1/2 flex justify-center items-center">التقييم العام</div>
                            <div className="text-sm border-black border-2 w-full h-1/2 flex justify-center items-center">67%</div>
                        </div>
                        <div className="flex flex-col gap-1 w-2/3 text-[10px] font-bold justify-center items-center">
                            <div className="border-black border-2 h-fit w-full text-center px-2 py-1 flex justify-center items-center">{org?.managerFirstName} {org.managerMiddleName} {org.managerLastName}</div>
                            <div className="border-black border-2 h-fit w-full text-center px-2 py-1 flex justify-center items-center">{org?.name}</div>
                        </div>
                        <div className="flex flex-col gap-1 min-w-fit max-w-1/3 text-[10px] font-bold justify-center items-center">
                            <div className="border-black border-2 h-fit w-full text-center px-2 py-1 flex justify-center items-center bg-gray-300">الاسم</div>
                            <div className="border-black border-2 h-fit w-full text-center px-2 py-1 flex justify-center items-center bg-gray-300">القسم</div>
                        </div>
                        <div className="border-black border-2 p-1">
                            <img className="w-16" src={ORG_MANAGER_IMG.find(org => org.id === id)?.img} alt="" />
                        </div>
                        <div className="flex justify-center items-center">
                            <div className="px-2 bg-gray-300 border-black border-2 text-xs">1</div>
                        </div>
                    </div>
                    <div className="w-[95%] border-black border-2">
                        <table className="table-auto border-collapse border border-gray-400 w-full text-center text-[9px]">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="border border-gray-400 px-4 py-1 w-1/4">الدرجة من (10)</th>
                                    <th className="border border-gray-400 px-4 py-1 w-2/4">بند التقييم الفرعي</th>
                                    <th className="border border-gray-400 px-4 py-1 w-1/4">بند التقييم الرئيسي</th>
                                </tr>
                            </thead>
                            <tbody>
                                {evaluationData.map((section, sectionIdx) => (
                                    <React.Fragment key={sectionIdx}>
                                        {section.items.map((item, i) => (
                                            <tr key={i}>
                                                <td className={`border border-gray-400 px-4 py-1 ${section.items.length - 1 === i && "border-b-black border-b-2"}`}>{item.score}</td>
                                                <td className={`border border-gray-400 px-4 py-1 ${section.items.length - 1 === i && "border-b-black border-b-2"}`}>{item.name}</td>
                                                {i === 0 && (
                                                    <td
                                                        className="border border-gray-400 border-b-black border-b-2 px-4 py-1 font-bold"
                                                        rowSpan={section.items.length}
                                                    >
                                                        {section.category}
                                                    </td>
                                                )}
                                            </tr>
                                        ))}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <h1 className="text-sm text-start w-full pl-4">.مع خالص الشكر و التقدير</h1>
                </div>
            </div>
        </div>
    );
};

export default WatomsSecretReport;