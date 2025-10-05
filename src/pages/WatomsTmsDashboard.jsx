import { useEffect, useState } from "react";
import DenyAccessPage from "../components/DenyAccessPage";
import DonutChart from "../components/DonutChart";
import NewNavbar from "../components/NewNavbar";
import { useAuth } from "../context/AuthContext";
import { NUMBER_TO_ARABIC_MONTHS, WATOMS_MODERN_COLORS } from "../constants/constants";
import {
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line
} from 'recharts';
import TmsDashboardTables from "../components/TmsDashboardTables";
import { fetchMyTasks } from "../services/tms";

const staticMonthlyData = [
    { month: "يناير", performance: 45 },
    { month: "فبراير", performance: 60 },
    { month: "مارس", performance: 72 },
    { month: "أبريل", performance: 55 },
    { month: "مايو", performance: 80 },
    { month: "يونيو", performance: 65 },
    { month: "يوليو", performance: 70 },
    { month: "أغسطس", performance: 85 },
    { month: "سبتمبر", performance: 78 },
    { month: "أكتوبر", performance: 90 },
    { month: "نوفمبر", performance: 82 },
    { month: "ديسمبر", performance: 88 },
];

const WatomsTmsDashboard = () => {
    const { userInfo } = useAuth();
    const [selectedMonthIdx, setSelectedMonthIdx] = useState(9);
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [showTablePopup, setShowTablePopup] = useState(false);

    useEffect(() => {
        const loadMyTasks = async () => {
            const response = await fetchMyTasks(userInfo?.employee_id);
            console.log(response)
            setSelectedMonth(NUMBER_TO_ARABIC_MONTHS[10])
        }

        loadMyTasks();
    }, [])

    const toggleMonth = (status) => {
        if (status) {
            if (selectedMonthIdx !== NUMBER_TO_ARABIC_MONTHS.length - 1) {
                setSelectedMonth(NUMBER_TO_ARABIC_MONTHS[selectedMonthIdx + 1]);
                setSelectedMonthIdx(prev => prev + 1);
            }
        } else {
            if (selectedMonthIdx !== 0) {
                setSelectedMonth(NUMBER_TO_ARABIC_MONTHS[selectedMonthIdx - 1]);
                setSelectedMonthIdx(prev => prev - 1);
            }
        }
    }

    if (userInfo?.code === 1452) return <DenyAccessPage homePage='/watoms/dashboard' />;
    if (userInfo?.code === 1475) return <DenyAccessPage homePage='/watoms/news' />;
    if (userInfo?.code === 1310) return <DenyAccessPage homePage='/wisdom/dashboard' />;
    return (
        <>
            <NewNavbar
                shareStatus={false}
                printStatus={true}
                plusStatus={true}
            />
            <div className="bg-[#0a183d] h-[88vh] pt-4">
                <div className="text-white mb-2" style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 18,
                }}>
                    {false ? <button
                        style={{
                            background: '#181f2e',
                            color: '#0af',
                            border: 'none',
                            borderRadius: '50%',
                            width: 30,
                            height: 30,
                            fontSize: 18,
                            fontWeight: 900,
                            cursor: 'pointer',
                            boxShadow: '0 2px 8px #0006',
                            transition: 'background 0.2s',
                        }}
                        title="الشهر السابق"
                    >
                        &#8592;
                    </button> : <div
                        style={{
                            border: 'none',
                            borderRadius: '50%',
                            width: 30,
                            height: 30,
                            fontSize: 18,
                            fontWeight: 900,
                            display: "hidden",
                        }}></div>}
                    <span style={{ fontWeight: 700, fontSize: 15, minWidth: 80, textAlign: 'center', letterSpacing: 1 }}>
                        2025
                    </span>
                    {true ? <button
                        style={{
                            background: '#181f2e',
                            color: '#0af',
                            border: 'none',
                            borderRadius: '50%',
                            width: 30,
                            height: 30,
                            fontSize: 18,
                            fontWeight: 900,
                            cursor: 'pointer',
                            boxShadow: '0 2px 8px #0006',
                            transition: 'background 0.2s',
                        }}
                        title="الشهر التالي"
                    >
                        &#8594;
                    </button> : <div
                        style={{
                            border: 'none',
                            borderRadius: '50%',
                            width: 30,
                            height: 30,
                            fontSize: 18,
                            fontWeight: 900,
                            display: "hidden",
                        }}></div>}
                </div>
                <div className="text-white mb-2" style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 18,
                }}>
                    {selectedMonthIdx !== 0 ? <button
                        onClick={() => toggleMonth(false)}
                        style={{
                            background: '#181f2e',
                            color: '#0af',
                            border: 'none',
                            borderRadius: '50%',
                            width: 30,
                            height: 30,
                            fontSize: 18,
                            fontWeight: 900,
                            cursor: 'pointer',
                            boxShadow: '0 2px 8px #0006',
                            transition: 'background 0.2s',
                        }}
                        title="الشهر السابق"
                    >
                        &#8592;
                    </button> : <div
                        style={{
                            border: 'none',
                            borderRadius: '50%',
                            width: 30,
                            height: 30,
                            fontSize: 18,
                            fontWeight: 900,
                            display: "hidden",
                        }}></div>}
                    <span style={{ fontWeight: 700, fontSize: 15, minWidth: 80, textAlign: 'center', letterSpacing: 1 }}>
                        {selectedMonth}
                    </span>
                    {selectedMonthIdx !== (NUMBER_TO_ARABIC_MONTHS.length - 1) ? <button
                        onClick={() => toggleMonth(true)}
                        style={{
                            background: '#181f2e',
                            color: '#0af',
                            border: 'none',
                            borderRadius: '50%',
                            width: 30,
                            height: 30,
                            fontSize: 18,
                            fontWeight: 900,
                            cursor: 'pointer',
                            boxShadow: '0 2px 8px #0006',
                            transition: 'background 0.2s',
                        }}
                        title="الشهر التالي"
                    >
                        &#8594;
                    </button> : <div
                        style={{
                            border: 'none',
                            borderRadius: '50%',
                            width: 30,
                            height: 30,
                            fontSize: 18,
                            fontWeight: 900,
                            display: "hidden",
                        }}></div>}
                </div>
                <div className="flex justify-evenly gap-4">
                    <div className="flex flex-col gap-4 w-[45%]">
                        <div className="rounded-2xl shadow-md shadow-black p-4 h-[35vh] flex flex-col items-center gap-4 bg-[#2d3347] text-white">
                            <h1 className="text-center font-bold underline">تقييم معايير معدل تنفيذ المهام</h1>
                            <div className="flex items-center gap-2 w-full">
                                <div
                                    className="w-[75%]"
                                    style={{
                                        minHeight: 60,
                                        maxHeight: 300,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'flex-start',   // ✅ start at top
                                        zIndex: 1,
                                        marginTop: 9,
                                        overflowY: 'auto',
                                        overflowX: 'hidden',            // ✅ prevent x scroll
                                    }}
                                >
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            marginBottom: 0,
                                            cursor: 'pointer',
                                            transition: 'transform 0.2s ease, opacity 0.2s ease',
                                            borderRadius: 8,
                                            minWidth: 0,
                                            transformOrigin: 'center',
                                        }}
                                        className="justify-between hover:bg-gray-600 hover:bg-opacity-20 py-[4px] px-6"
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'scale(1.02)';
                                            e.currentTarget.style.opacity = '0.9';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'scale(1)';
                                            e.currentTarget.style.opacity = '1';
                                        }}
                                    >
                                        {/* Center name (on the left) */}
                                        <div className="text-start min-w-fit" style={{
                                            maxWidth: 120,
                                            fontWeight: 900,
                                            fontSize: 15,
                                            color: '#fff',
                                            marginRight: 8,
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                            transition: 'color 0.2s ease'
                                        }}>
                                            سرعة التنفيذ المهام
                                        </div>
                                        {/* Bar background with fixed width */}
                                        <div style={{
                                            flex: 1,                   // ✅ take remaining space
                                            minWidth: 0,
                                            maxWidth: 170,              // ✅ allow shrink
                                            height: 20,
                                            background: '#444652',
                                            borderRadius: 18,
                                            boxShadow: '0 2px 8px #0002',
                                            position: 'relative',
                                            overflow: 'hidden',
                                            marginLeft: 8,
                                            marginRight: 8,
                                            transition: 'box-shadow 0.2s ease',
                                        }}
                                        >
                                            {/* Bar fill */}
                                            <div
                                                style={{
                                                    height: '100%',
                                                    width: `60%`,
                                                    background: "red",
                                                    borderRadius: 18,
                                                    transition: 'width 0.7s cubic-bezier(.4,2,.6,1)',
                                                }}
                                            />
                                        </div>
                                        {/* Percentage (on the right) */}
                                        <div className="text-white text-end" style={{
                                            minWidth: 38,
                                            fontWeight: 900,
                                            fontSize: 17,
                                            textAlign: 'right',
                                            marginLeft: 0,
                                            marginRight: 0,
                                            transition: 'color 0.2s ease'
                                        }}>
                                            60%
                                        </div>
                                    </div>
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            marginBottom: 0,
                                            cursor: 'pointer',
                                            transition: 'transform 0.2s ease, opacity 0.2s ease',
                                            borderRadius: 8,
                                            minWidth: 0,
                                            transformOrigin: 'center',
                                        }}
                                        className="justify-between hover:bg-gray-600 hover:bg-opacity-20 py-[4px] px-6"
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'scale(1.02)';
                                            e.currentTarget.style.opacity = '0.9';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'scale(1)';
                                            e.currentTarget.style.opacity = '1';
                                        }}
                                    >
                                        {/* Center name (on the left) */}
                                        <div className="text-start min-w-fit" style={{
                                            maxWidth: 120,
                                            fontWeight: 900,
                                            fontSize: 15,
                                            color: '#fff',
                                            marginRight: 8,
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                            transition: 'color 0.2s ease'
                                        }}>
                                            دقة التنفيذ المهام
                                        </div>
                                        {/* Bar background with fixed width */}
                                        <div style={{
                                            flex: 1,                   // ✅ take remaining space
                                            minWidth: 0,
                                            maxWidth: 170,              // ✅ allow shrink
                                            height: 20,
                                            background: '#444652',
                                            borderRadius: 18,
                                            boxShadow: '0 2px 8px #0002',
                                            position: 'relative',
                                            overflow: 'hidden',
                                            marginLeft: 8,
                                            marginRight: 8,
                                            transition: 'box-shadow 0.2s ease',
                                        }}
                                        >
                                            {/* Bar fill */}
                                            <div
                                                style={{
                                                    height: '100%',
                                                    width: `95%`,
                                                    background: "blue",
                                                    borderRadius: 18,
                                                    transition: 'width 0.7s cubic-bezier(.4,2,.6,1)',
                                                }}
                                            />
                                        </div>
                                        {/* Percentage (on the right) */}
                                        <div className="text-white text-end" style={{
                                            minWidth: 38,
                                            fontWeight: 900,
                                            fontSize: 17,
                                            textAlign: 'right',
                                            marginLeft: 0,
                                            marginRight: 0,
                                            transition: 'color 0.2s ease'
                                        }}>
                                            95%
                                        </div>
                                    </div>
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            marginBottom: 0,
                                            cursor: 'pointer',
                                            transition: 'transform 0.2s ease, opacity 0.2s ease',
                                            borderRadius: 8,
                                            minWidth: 0,
                                            transformOrigin: 'center',
                                        }}
                                        className="justify-between hover:bg-gray-600 hover:bg-opacity-20 py-[4px] px-6"
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'scale(1.02)';
                                            e.currentTarget.style.opacity = '0.9';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'scale(1)';
                                            e.currentTarget.style.opacity = '1';
                                        }}
                                    >
                                        {/* Center name (on the left) */}
                                        <div className="text-start min-w-fit" style={{
                                            maxWidth: 120,
                                            fontWeight: 900,
                                            fontSize: 15,
                                            color: '#fff',
                                            marginRight: 8,
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                            transition: 'color 0.2s ease'
                                        }}>
                                            نسبة اكتمال المهام
                                        </div>
                                        {/* Bar background with fixed width */}
                                        <div style={{
                                            flex: 1,                   // ✅ take remaining space
                                            minWidth: 0,
                                            maxWidth: 170,              // ✅ allow shrink
                                            height: 20,
                                            background: '#444652',
                                            borderRadius: 18,
                                            boxShadow: '0 2px 8px #0002',
                                            position: 'relative',
                                            overflow: 'hidden',
                                            marginLeft: 8,
                                            marginRight: 8,
                                            transition: 'box-shadow 0.2s ease',
                                        }}
                                        >
                                            {/* Bar fill */}
                                            <div
                                                style={{
                                                    height: '100%',
                                                    width: `45%`,
                                                    background: "green",
                                                    borderRadius: 18,
                                                    transition: 'width 0.7s cubic-bezier(.4,2,.6,1)',
                                                }}
                                            />
                                        </div>
                                        {/* Percentage (on the right) */}
                                        <div className="text-white text-end" style={{
                                            minWidth: 38,
                                            fontWeight: 900,
                                            fontSize: 17,
                                            textAlign: 'right',
                                            marginLeft: 0,
                                            marginRight: 0,
                                            transition: 'color 0.2s ease'
                                        }}>
                                            45%
                                        </div>
                                    </div>
                                </div>
                                <div className='border-l-2 border-white p-1 h-12 w-0' />
                                <div className="flex flex-col gap-2 items-center">
                                    <DonutChart value={60} size={90} color='url(#circularBlueGradient)' bg='#23263a' textColor='#fff' />
                                    <div className="flex p-2 rounded-2xl shadow gap-2">
                                        <h1>مهمة</h1>
                                        <h1>2350</h1>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="rounded-2xl shadow-md shadow-black p-2 h-[35vh] bg-[#2d3347] text-white">
                            <h1 className="text-center font-bold">تحليل معدل تغيير الاداء</h1>
                            <ResponsiveContainer width="100%" height={200}>
                                <LineChart
                                    data={staticMonthlyData}
                                    margin={{ top: 6, right: 30, left: -25, bottom: -10 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" /> {/* optional grey grid */}
                                    <XAxis
                                        dataKey="month"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 12, fill: "#ffffff" }} // ← white x-axis text
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 12, fill: "#ffffff" }} // ← white y-axis text
                                        domain={[0, 100]}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "#1a202c",
                                            border: "1px solid #4a5568",
                                            borderRadius: "6px",
                                            color: "#ffffff", // ← white tooltip text
                                        }}
                                        labelStyle={{ color: "#ffffff" }} // ← white label
                                        itemStyle={{ color: "#ffffff" }} // ← white items
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="performance"
                                        stroke="#fbbf24"
                                        strokeWidth={2}
                                        dot={{ r: 5, fill: "#fbbf24" }}
                                        activeDot={{ r: 7, stroke: "#fff", strokeWidth: 2 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <div className="flex flex-col gap-4 w-[45%]">
                        <div className="rounded-2xl shadow-md shadow-black flex gap-10 items-center p-4 h-[35vh] bg-[#2d3347] text-white">
                            <div className="flex flex-col gap-8 w-[45%]">
                                <div className="flex flex-col">
                                    <div className={`text-white text-center rounded p-2 bg-[#2f417a]`}>اجمالي عدد المهام المنجزة</div>
                                    <div className={`border-white p-2 border-2 rounded text-center font-bold mt-2 text-white`}>1050</div>
                                </div>
                                <div className="flex flex-col">
                                    <div className={`text-white text-center rounded p-2 bg-[#2f417a]`}>اجمالي عدد المهام الغير منجزة</div>
                                    <div className={`border-white p-2 border-2 rounded text-center font-bold mt-2 text-white`}>77</div>
                                </div>
                            </div>
                            <div className="w-0 h-32 border-white border-l-2" />
                            <div className="flex flex-col gap-3 w-[45%]">
                                <div className={`text-white text-center rounded p-2 bg-[#2f417a]`}>مهام اقل من (%50)</div>
                                <div className="flex gap-2">
                                    <div className={`flex-1 border-white p-2 border-2 rounded text-center font-bold text-white`}>3</div>
                                    <div className={`flex-1 text-center rounded p-2 bg-[#5268b1] text-white`}>اولوية قصوي</div>
                                </div>
                                <div className="flex gap-2">
                                    <div className={`flex-1 border-white p-2 border-2 rounded text-center font-bold text-white`}>70</div>
                                    <div className={`flex-1 text-center rounded p-2 bg-[#5268b1] text-white`}>اولوية متوسطة</div>
                                </div>
                                <div className="flex gap-2">
                                    <div className={`flex-1 border-white p-2 border-2 rounded text-center font-bold text-white`}>150</div>
                                    <div className={`flex-1 text-center rounded p-2 bg-[#5268b1] text-white`}>اولوية عادية</div>
                                </div>
                            </div>
                        </div>
                        <div className="rounded-2xl shadow-md shadow-black p-2 h-[35vh] flex items-center bg-[#2d3347]">
                            <div className="w-full overflow-hidden rounded-xl border border-slate-200/70 bg-[#5268b1] shadow-sm">
                                <table className="w-full table-fixed border-collapse text-xs text-white" dir="rtl" onClick={() => setShowTablePopup(true)}>
                                    <thead>
                                        <tr className="bg-[#5268b1] border border-white/30">
                                            <th className="py-2 text-center font-semibold border-l border-white/40">البند</th>
                                            <th className="py-2 text-center font-semibold border-l border-white/40">أولوية قصوى</th>
                                            <th className="py-2 text-center font-semibold border-l border-white/40">أولوية متوسطة</th>
                                            <th className="py-2 text-center font-semibold border-l border-white/40">أولوية عادية</th>
                                            <th className="py-2 text-center font-semibold">الإجمالي</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {[
                                            "إجمالي العدد",
                                            "إجمالي نسبة الاستكمال",
                                            "إجمالي مستوى الدقة",
                                            "إجمالي معدل السرعة",
                                            "إجمالي التقييم",
                                        ].map((label, index) => (
                                            <tr
                                                key={index}
                                                className="bg-[#2f417a] border-t border-white/30 hover:bg-[#3b4e93] transition"
                                            >
                                                <td className="py-2 text-center border-l border-white/30">
                                                    <span className="inline-flex items-center justify-center min-w-[3rem] px-2 h-6 rounded-full text-xs text-white">
                                                        {label}
                                                    </span>
                                                </td>

                                                {[0, 0, 0, 0].map((value, i) => (
                                                    <td key={i} className="py-2 text-center border-l border-white/30">
                                                        <span className="inline-flex items-center justify-center min-w-[2.25rem] px-2 h-6 rounded-full text-white">
                                                            {value}
                                                        </span>
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {showTablePopup && (
                <TmsDashboardTables
                onClose={() => setShowTablePopup(false)}
                />
            )}
        </>
    )
}

export default WatomsTmsDashboard;