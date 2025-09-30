import React, { useEffect, useState } from "react";
import ebdaeduLogo from "../assets/ebad-edu.png";
import wabysLogo from "../assets/wabys.png";
import golLogo from "../assets/Gov.png";
import img from "../assets/ismailiaManager.jpg";
import { NUMBER_TO_ARABIC_MONTHS, ORG_MANAGER_IMG } from "../constants/constants";
import DonutChart from "./DonutChart";
import CustomLineChart from "./CustomLineChart";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { roundNumber } from "../utils/roundNumber";
import { fetchManagerComments, fetchOrgAvgTasks } from "../services/specificData";

const baseTemplates = [
    { title: "تحمل المسؤولية", max: 10 },
    { title: "الانضباط", max: 10 },
    { title: "الإلتزام بالمواعيد", max: 10 },
    { title: "الأمانة وحسن الخلق", max: 10 },
    { title: "تغليب المصلحة العامة على الشخصية", max: 10 },
    { title: "الثقة في النفس", max: 10 },
    { title: "المظهر العام والنظافة الشخصية", max: 10 },
    { title: "مستوى الكفاءة في المجال التخصصي", max: 10 },

    { title: "القدرة على تفعيل مبادئ الحوكمة", max: 10 },
    { title: "التعاون مع الزملاء", max: 10 },
    { title: "⁠القدرة على إنفاذ الخطط الاستراتيجية والتشغيلية على الأرض", max: 10 },
    { title: "القدرة على تفعيل المنظومة الإلكترونية", max: 10 },
    { title: "القدرة على العمل تحت ضغط", max: 10 },

    { title: "المهارات القيادية", max: 10 },
    { title: "سرعة البديهة وحسن التصرف", max: 10 },
    { title: "اللباقة أثناء الحديث", max: 10 },
    { title: "مهارات التواصل والإقناع", max: 10 },
    { title: "الإبتكار والإبداع", max: 10 },
];

const categoryMap = {
    "تحمل المسؤولية": "السمات العامة للشخصية",
    "الانضباط": "السمات العامة للشخصية",
    "الإلتزام بالمواعيد": "السمات العامة للشخصية",
    "الأمانة وحسن الخلق": "السمات العامة للشخصية",
    "تغليب المصلحة العامة على الشخصية": "السمات العامة للشخصية",
    "الثقة في النفس": "السمات العامة للشخصية",
    "المظهر العام والنظافة الشخصية": "السمات العامة للشخصية",
    "مستوى الكفاءة في المجال التخصصي": "السمات العامة للشخصية",

    "القدرة على تفعيل مبادئ الحوكمة": "التقييم الوظيفي",
    "التعاون مع الزملاء": "التقييم الوظيفي",
    "⁠القدرة على إنفاذ الخطط الاستراتيجية والتشغيلية على الأرض": "التقييم الوظيفي",
    "القدرة على تفعيل المنظومة الإلكترونية": "التقييم الوظيفي",
    "القدرة على العمل تحت ضغط": "التقييم الوظيفي",

    "المهارات القيادية": "المهارات الشخصية",
    "سرعة البديهة وحسن التصرف": "المهارات الشخصية",
    "اللباقة أثناء الحديث": "المهارات الشخصية",
    "مهارات التواصل والإقناع": "المهارات الشخصية",
    "الإبتكار والإبداع": "المهارات الشخصية",
};

const WatomsSecretReport = ({ id, onClose, org, evaluation }) => {
    const [selectedMonthIdx, setSelectedMonthIdx] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [monthEvaluation, setMonthEvaluation] = useState([]);
    const [mgrScores, setMgrScores] = useState([]);
    const [tasksScores, setTasksScores] = useState([]);
    const [managerComments, setManagerComments] = useState([]);

    useEffect(() => {
        const loadOrgAvgTasks = async () => {
            const response = await fetchOrgAvgTasks(id);
            setTasksScores(response)
        }

        const loadManagerComments = async () => {
            const response = await fetchManagerComments(org.managerId);
            setManagerComments(response)
        }

        loadOrgAvgTasks();
        loadManagerComments();
    }, [])

    const groupEvaluation = (evals) => {
        return baseTemplates.reduce((acc, tpl) => {
            const category = categoryMap[tpl.title] || "أخرى";
            if (!acc[category]) acc[category] = [];

            // look for this item in evaluations
            const found = evals.find(eva => eva.template.title === tpl.title);

            acc[category].push({
                name: tpl.title,
                score: found ? found.score : 0,       // ✅ default 0 if missing
                max: found ? found.template.max_score : tpl.max,
            });

            return acc;
        }, {});
    };

    useEffect(() => {
        const lastIdx = org.months.length - 1;
        const lastMonth = org.months[lastIdx];

        setSelectedMonthIdx(lastIdx);
        setSelectedMonth(lastMonth);

        const filteredEvaluation = evaluation.filter(
            eva => eva.date === lastMonth.monthNumber
        );

        const grouped = evaluation.reduce((acc, ev) => {
            if (!acc[ev.date]) acc[ev.date] = [];
            acc[ev.date].push(ev.score);
            return acc;
        }, {});

        // 2. Compute average %
        const results = Object.entries(grouped).map(([date, scores]) => {
            const total = scores.reduce((a, b) => a + b, 0);
            const count = scores.length;
            const max = count * 10; // assuming max score per item is 10
            const avg = (total / max) * 100;

            return { monthNumber: Number(date), performance: roundNumber(avg.toFixed(2)), month: NUMBER_TO_ARABIC_MONTHS[Number(date)] };
        });

        setMgrScores(results);
        setMonthEvaluation(groupEvaluation(filteredEvaluation));
    }, [org, evaluation]);

    const toggleMonth = (status) => {
        if (status) {
            if (selectedMonthIdx !== org.months.length - 1) {
                setSelectedMonth(org.months[selectedMonthIdx + 1]);
                setSelectedMonthIdx(prev => prev + 1);
                const filteredEvaluation = evaluation.filter(eva => eva.date === org.months[selectedMonthIdx + 1].monthNumber)
                setMonthEvaluation(groupEvaluation(filteredEvaluation))
            }
        } else {
            if (selectedMonthIdx !== 0) {
                setSelectedMonth(org.months[selectedMonthIdx - 1]);
                setSelectedMonthIdx(prev => prev - 1);
                const filteredEvaluation = evaluation.filter(eva => eva.date === org.months[selectedMonthIdx - 1].monthNumber)
                setMonthEvaluation(groupEvaluation(filteredEvaluation))
            }
        }
    }
    return (
        <div className="fixed inset-0 bg-black/60 flex flex-col overflow-y-auto justify-start gap-6 items-center z-50">
            <button
                onClick={onClose} // <-- add handler if you want to close modal
                className="absolute top-4 right-4 text-white bg-gray-700 hover:bg-gray-800 w-12 h-12 flex justify-center items-center text-2xl font-bold cursor-pointer z-50"
            >
                <FontAwesomeIcon icon={faXmark} />
            </button>
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
                                <CustomLineChart data={mgrScores} />
                            </div>
                            <div className="w-0 h-16 border-l-2 border-black" />
                            <div className="w-[30%] flex flex-col justify-center items-center border-black border-2 rounded-2xl p-2 gap-4">
                                <h1 className="text-center text-[10px]">التقييم العام الحالي</h1>
                                <DonutChart value={mgrScores[mgrScores.length - 1]?.performance || 0} />
                            </div>
                        </div>
                    </div>
                    <div className="w-[95%] flex flex-col gap-1">
                        <h1 className="text-end font-bold text-[11px]">:ثانيا: تقييم المركز</h1>
                        <div className="border-black border-2 rounded-2xl flex items-center p-2 gap-2">
                            <div className="w-[65%] h-40 flex flex-col justify-center items-center border-black border-2 rounded-2xl p-2">
                                <h1 className="text-center text-[10px]">تحليل معدل تغيير اداء المركز</h1>
                                <CustomLineChart data={org.months} />
                            </div>
                            <div className="w-0 h-16 border-l-2 border-black" />
                            <div className="w-[30%] flex flex-col justify-center items-center border-black border-2 rounded-2xl p-2 gap-4">
                                <h1 className="text-center text-[10px]">تقييم اداء المركز</h1>
                                <DonutChart value={org.months[org.months.length - 1].performance} />
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
                                {org.months.map((org, idx) => (
                                    <tr
                                        key={idx}
                                        className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}
                                    >
                                        <td className="border border-gray-300 px-3 py-2">0</td>
                                        <td className="border border-gray-300 px-3 py-2">{tasksScores.find(m => m.date === org.monthNumber)?.score || 0}%</td>

                                        <td className="border border-gray-300 px-3 py-2 font-bold">0</td>
                                        <td className="border border-gray-300 px-3 py-2">0</td>
                                        <td className="border border-gray-300 px-3 py-2">0</td>

                                        <td className="border border-gray-300 px-3 py-2">0</td>
                                        <td className="border border-gray-300 px-3 py-2">0</td>

                                        <td className="border border-gray-300 px-3 py-2">{roundNumber(org.performance)}%</td>
                                        <td className="border border-gray-300 px-3 py-2">{mgrScores.find(m => m.monthNumber === org.monthNumber)?.performance || 0}%</td>
                                        <td className="border border-gray-300 px-3 py-2">{org.month}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="w-[95%] font-bold">
                        <h1 className="text-end text-[11px]">:رابعا: الملاحظات</h1>
                        <div className={`border-black border-2 w-full text-end text-[10px] min-h-20 max-h-20 ${managerComments.length > 5 && "overflow-y-scroll"}`}>
                            {managerComments.map(comment => (
                                <div className="flex w-full justify-end gap-2 px-2">
                                    <p>{comment.comment}</p>
                                    <p className={comment.type === "ايجابي" ? `text-green-600` : `text-red-600`}>({comment.type})</p>
                                    <p className="text-blue-600">{comment.date.split("T")[0]}</p>
                                </div>
                            ))}
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
                                {Object.entries(monthEvaluation).map(([category, items], sectionIdx) => (
                                    <React.Fragment key={sectionIdx}>
                                        {items.map((item, i) => (
                                            <tr key={i}>
                                                <td
                                                    className={`border border-gray-400 px-4 py-1 ${items.length - 1 === i && "border-b-black border-b-2"
                                                        }`}
                                                >
                                                    {item.score}
                                                </td>
                                                <td
                                                    className={`border border-gray-400 px-4 py-1 ${items.length - 1 === i && "border-b-black border-b-2"
                                                        }`}
                                                >
                                                    {item.name}
                                                </td>
                                                {i === 0 && (
                                                    <td
                                                        className="border border-gray-400 border-b-black border-b-2 px-4 py-1 font-bold"
                                                        rowSpan={items.length}
                                                    >
                                                        {category}
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