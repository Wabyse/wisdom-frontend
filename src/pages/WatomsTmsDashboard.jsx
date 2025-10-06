import { useEffect, useState } from "react";
import DenyAccessPage from "../components/DenyAccessPage";
import DonutChart from "../components/DonutChart";
import NewNavbar from "../components/NewNavbar";
import { useAuth } from "../context/AuthContext";
import { NUMBER_TO_ARABIC_MONTHS } from "../constants/constants";
import {
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line
} from 'recharts';
import TmsDashboardTables from "../components/TmsDashboardTables";
import { fetchMyTasks } from "../services/tms";
import { roundNumber } from "../utils/roundNumber";

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
    const [allTasks, setAllTasks] = useState([]);
    const [selectedMonthTasks, setSelectedMonthTasks] = useState({});
    const [selectedMonthDetails, setSelectedMonthDetails] = useState({ finishedPercentage: 0, totalFinished: 0, totalUnFinished: 0, totalImportant: 0, totalNormal: 0, totalEasy: 0, total50Important: 0, total50Normal: 0, total50Easy: 0, importantPercentage: 0, normalPercentage: 0, easyPercentage: 0 })

    const currentMonth = new Date().getMonth() + 1;

    useEffect(() => {
        const loadMyTasks = async () => {
            const response = await fetchMyTasks(userInfo?.employee_id);
            const currentMonthsTasks = response.find(task => task.monthNumber === currentMonth);
            setAllTasks(response)
            setSelectedMonth(currentMonthsTasks ? currentMonthsTasks?.month : NUMBER_TO_ARABIC_MONTHS[currentMonth])
            setSelectedMonthIdx(currentMonth - 1)
            setSelectedMonthTasks(currentMonthsTasks ? currentMonthsTasks : { monthNumber: currentMonth, tasks: [] })
            const finishedTasksPercentage = currentMonthsTasks ? currentMonthsTasks?.tasks.filter(task => task.status === "finished" || task.status === "submitted").length : 0;
            const importantTasksCount = currentMonthsTasks ? currentMonthsTasks?.tasks.filter(task => task.importance === "urgent").length : 0;
            const normalTasksCount = currentMonthsTasks ? currentMonthsTasks?.tasks.filter(task => task.importance === "important").length : 0;
            const easyTasksCount = currentMonthsTasks ? currentMonthsTasks?.tasks.filter(task => task.importance === "normal").length : 0;
            const importantTasks50Count = currentMonthsTasks ? currentMonthsTasks?.tasks.filter(task => task.importance === "urgent" && (task.status === "not started yet" || task.status === "in progress" || task.status === "0" || task.status === "25")).length : 0;
            const normalTasks50Count = currentMonthsTasks ? currentMonthsTasks?.tasks.filter(task => task.importance === "important" && (task.status === "not started yet" || task.status === "in progress" || task.status === "0" || task.status === "25")).length : 0;
            const easyTasks50Count = currentMonthsTasks ? currentMonthsTasks?.tasks.filter(task => task.importance === "normal" && (task.status === "not started yet" || task.status === "in progress" || task.status === "0" || task.status === "25")).length : 0;
            const importantTasks100Count = currentMonthsTasks ? currentMonthsTasks?.tasks.filter(task => task.importance === "urgent" && (task.status === "finished" || task.status === "submitted")).length : 0;
            const normalTasks100Count = currentMonthsTasks ? currentMonthsTasks?.tasks.filter(task => task.importance === "important" && (task.status === "finished" || task.status === "submitted")).length : 0;
            const easyTasks100Count = currentMonthsTasks ? currentMonthsTasks?.tasks.filter(task => task.importance === "normal" && (task.status === "finished" || task.status === "submitted")).length : 0;
            const totalTasks = currentMonthsTasks ? currentMonthsTasks?.tasks.length : 0;
            setSelectedMonthDetails(prev => ({
                ...prev,
                finishedPercentage: finishedTasksPercentage ? roundNumber((Number(finishedTasksPercentage) / Number(totalTasks)) * 100) : 0,
                totalFinished: finishedTasksPercentage ? Number(finishedTasksPercentage) : 0,
                totalUnFinished: selectedMonthTasks ? Number(totalTasks) - Number(finishedTasksPercentage) : 0,
                totalImportant: Number(importantTasksCount),
                totalNormal: Number(normalTasksCount),
                totalEasy: Number(easyTasksCount),
                total50Important: Number(importantTasks50Count),
                total50Normal: Number(normalTasks50Count),
                total50Easy: Number(easyTasks50Count),
                importantPercentage: importantTasks100Count ? roundNumber((Number(importantTasks100Count) / Number(importantTasksCount)) * 100) : 0,
                normalPercentage: normalTasks100Count ? roundNumber((Number(normalTasks100Count) / Number(normalTasksCount)) * 100) : 0,
                easyPercentage: easyTasks100Count ? roundNumber((Number(easyTasks100Count) / Number(easyTasksCount)) * 100) : 0,
            }));
        }

        loadMyTasks();
    }, [])

    const toggleMonth = (status) => {
        if (status) {
            if (selectedMonthIdx + 1 !== currentMonth) {
                const selectedMonthTasks = allTasks.find(task => task.monthNumber === selectedMonthIdx + 2);
                setSelectedMonth(NUMBER_TO_ARABIC_MONTHS[selectedMonthIdx + 2]);
                setSelectedMonthIdx(prev => prev + 1);
                setSelectedMonthTasks(selectedMonthTasks ? selectedMonthTasks : { monthNumber: currentMonth, tasks: [] })
                const finishedTasksPercentage = selectedMonthTasks ? selectedMonthTasks?.tasks.filter(task => task.status === "finished" || task.status === "submitted").length : 0;
                const importantTasksCount = selectedMonthTasks ? selectedMonthTasks?.tasks.filter(task => task.importance === "urgent").length : 0;
                const normalTasksCount = selectedMonthTasks ? selectedMonthTasks?.tasks.filter(task => task.importance === "important").length : 0;
                const easyTasksCount = selectedMonthTasks ? selectedMonthTasks?.tasks.filter(task => task.importance === "normal").length : 0;
                const totalTasks = selectedMonthTasks ? selectedMonthTasks?.tasks.length : 0;
                const importantTasks50Count = selectedMonthTasks ? selectedMonthTasks?.tasks.filter(task => task.importance === "urgent" && (task.status === "not started yet" || task.status === "in progress" || task.status === "0" || task.status === "25")).length : 0;
                const normalTasks50Count = selectedMonthTasks ? selectedMonthTasks?.tasks.filter(task => task.importance === "important" && (task.status === "not started yet" || task.status === "in progress" || task.status === "0" || task.status === "25")).length : 0;
                const easyTasks50Count = selectedMonthTasks ? selectedMonthTasks?.tasks.filter(task => task.importance === "normal" && (task.status === "not started yet" || task.status === "in progress" || task.status === "0" || task.status === "25")).length : 0;
                const importantTasks100Count = selectedMonthTasks ? selectedMonthTasks?.tasks.filter(task => task.importance === "urgent" && (task.status === "finished" || task.status === "submitted")).length : 0;
                const normalTasks100Count = selectedMonthTasks ? selectedMonthTasks?.tasks.filter(task => task.importance === "important" && (task.status === "finished" || task.status === "submitted")).length : 0;
                const easyTasks100Count = selectedMonthTasks ? selectedMonthTasks?.tasks.filter(task => task.importance === "normal" && (task.status === "finished" || task.status === "submitted")).length : 0;
                setSelectedMonthDetails(prev => ({
                    ...prev,
                    finishedPercentage: finishedTasksPercentage ? roundNumber((Number(finishedTasksPercentage) / Number(totalTasks)) * 100) : 0,
                    totalFinished: finishedTasksPercentage ? Number(finishedTasksPercentage) : 0,
                    totalUnFinished: selectedMonthTasks ? Number(totalTasks) - Number(finishedTasksPercentage) : 0,
                    totalImportant: Number(importantTasksCount),
                    totalNormal: Number(normalTasksCount),
                    totalEasy: Number(easyTasksCount),
                    total50Important: Number(importantTasks50Count),
                    total50Normal: Number(normalTasks50Count),
                    total50Easy: Number(easyTasks50Count),
                    importantPercentage: importantTasks100Count ? roundNumber((Number(importantTasks100Count) / Number(importantTasksCount)) * 100) : 0,
                    normalPercentage: normalTasks100Count ? roundNumber((Number(normalTasks100Count) / Number(normalTasksCount)) * 100) : 0,
                    easyPercentage: easyTasks100Count ? roundNumber((Number(easyTasks100Count) / Number(easyTasksCount)) * 100) : 0,
                }));
            }
        } else {
            if (selectedMonthIdx !== 0) {
                const selectedMonthTasks = allTasks.find(task => task.monthNumber === selectedMonthIdx);
                setSelectedMonth(NUMBER_TO_ARABIC_MONTHS[selectedMonthIdx]);
                setSelectedMonthIdx(prev => prev - 1);
                setSelectedMonthTasks(selectedMonthTasks ? selectedMonthTasks : { monthNumber: currentMonth, tasks: [] })
                const finishedTasksPercentage = selectedMonthTasks ? selectedMonthTasks?.tasks.filter(task => task.status === "finished" || task.status === "submitted").length : 0;
                const importantTasksCount = selectedMonthTasks ? selectedMonthTasks?.tasks.filter(task => task.importance === "urgent").length : 0;
                const normalTasksCount = selectedMonthTasks ? selectedMonthTasks?.tasks.filter(task => task.importance === "important").length : 0;
                const easyTasksCount = selectedMonthTasks ? selectedMonthTasks?.tasks.filter(task => task.importance === "normal").length : 0;
                const totalTasks = selectedMonthTasks ? selectedMonthTasks?.tasks.length : 0;
                const importantTasks50Count = selectedMonthTasks ? selectedMonthTasks?.tasks.filter(task => task.importance === "urgent" && (task.status === "not started yet" || task.status === "in progress" || task.status === "0" || task.status === "25")).length : 0;
                const normalTasks50Count = selectedMonthTasks ? selectedMonthTasks?.tasks.filter(task => task.importance === "important" && (task.status === "not started yet" || task.status === "in progress" || task.status === "0" || task.status === "25")).length : 0;
                const easyTasks50Count = selectedMonthTasks ? selectedMonthTasks?.tasks.filter(task => task.importance === "normal" && (task.status === "not started yet" || task.status === "in progress" || task.status === "0" || task.status === "25")).length : 0;
                const importantTasks100Count = selectedMonthTasks ? selectedMonthTasks?.tasks.filter(task => task.importance === "urgent" && (task.status === "finished" || task.status === "submitted")).length : 0;
                const normalTasks100Count = selectedMonthTasks ? selectedMonthTasks?.tasks.filter(task => task.importance === "important" && (task.status === "finished" || task.status === "submitted")).length : 0;
                const easyTasks100Count = selectedMonthTasks ? selectedMonthTasks?.tasks.filter(task => task.importance === "normal" && (task.status === "finished" || task.status === "submitted")).length : 0;
                setSelectedMonthDetails(prev => ({
                    ...prev,
                    finishedPercentage: finishedTasksPercentage ? roundNumber((Number(finishedTasksPercentage) / Number(totalTasks)) * 100) : 0,
                    totalFinished: finishedTasksPercentage ? Number(finishedTasksPercentage) : 0,
                    totalUnFinished: selectedMonthTasks ? Number(totalTasks) - Number(finishedTasksPercentage) : 0,
                    totalImportant: Number(importantTasksCount),
                    totalNormal: Number(normalTasksCount),
                    totalEasy: Number(easyTasksCount),
                    total50Important: Number(importantTasks50Count),
                    total50Normal: Number(normalTasks50Count),
                    total50Easy: Number(easyTasks50Count),
                    importantPercentage: importantTasks100Count ? roundNumber((Number(importantTasks100Count) / Number(importantTasksCount)) * 100) : 0,
                    normalPercentage: normalTasks100Count ? roundNumber((Number(normalTasks100Count) / Number(normalTasksCount)) * 100) : 0,
                    easyPercentage: easyTasks100Count ? roundNumber((Number(easyTasks100Count) / Number(easyTasksCount)) * 100) : 0,
                }));
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
                                                    width: `${selectedMonthDetails.finishedPercentage}%`,
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
                                            {selectedMonthDetails.finishedPercentage}%
                                        </div>
                                    </div>
                                </div>
                                <div className='border-l-2 border-white p-1 h-12 w-0' />
                                <div className="flex flex-col gap-2 items-center">
                                    <DonutChart value={60} size={90} color='url(#circularBlueGradient)' bg='#23263a' textColor='#fff' />
                                    <div className="flex p-2 rounded-2xl shadow gap-2">
                                        <h1>مهمة</h1>
                                        <h1>{selectedMonthTasks?.tasks?.length}</h1>
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
                                    <div className={`border-white p-2 border-2 rounded text-center font-bold mt-2 text-white`}>{selectedMonthDetails.totalFinished}</div>
                                </div>
                                <div className="flex flex-col">
                                    <div className={`text-white text-center rounded p-2 bg-[#2f417a]`}>اجمالي عدد المهام الغير منجزة</div>
                                    <div className={`border-white p-2 border-2 rounded text-center font-bold mt-2 text-white`}>{selectedMonthDetails.totalUnFinished}</div>
                                </div>
                            </div>
                            <div className="w-0 h-32 border-white border-l-2" />
                            <div className="flex flex-col gap-3 w-[45%]">
                                <div className={`text-white text-center rounded p-2 bg-[#2f417a]`}>مهام اقل من (%50)</div>
                                <div className="flex gap-2">
                                    <div className={`flex-1 border-white p-2 border-2 rounded text-center font-bold text-white`}>{selectedMonthDetails.total50Important}</div>
                                    <div className={`flex-1 text-center rounded p-2 bg-[#5268b1] text-white`}>اولوية قصوي</div>
                                </div>
                                <div className="flex gap-2">
                                    <div className={`flex-1 border-white p-2 border-2 rounded text-center font-bold text-white`}>{selectedMonthDetails.total50Normal}</div>
                                    <div className={`flex-1 text-center rounded p-2 bg-[#5268b1] text-white`}>اولوية متوسطة</div>
                                </div>
                                <div className="flex gap-2">
                                    <div className={`flex-1 border-white p-2 border-2 rounded text-center font-bold text-white`}>{selectedMonthDetails.total50Easy}</div>
                                    <div className={`flex-1 text-center rounded p-2 bg-[#5268b1] text-white`}>اولوية عادية</div>
                                </div>
                            </div>
                        </div>
                        <div className="h-[35vh] flex items-center">
                            <div className="w-full flex flex-row-reverse gap-3 text-white text-xs">
                                {/* === Priority columns === */}
                                <div className="flex-1 flex flex-col gap-3">
                                    {/* === Top section: إجمالي العدد === */}
                                    <div className="overflow-hidden rounded-xl border border-white/30 bg-[#5268b1] shadow-sm">
                                        <table className="w-full table-fixed border-collapse" dir="rtl">
                                            <thead>
                                                <tr className="bg-[#5268b1] border-b border-white/30">
                                                    <th className="py-2 text-center font-semibold border-l border-white/30">البند</th>
                                                    <th className="py-2 text-center font-semibold border-l border-white/30">أولوية قصوى</th>
                                                    <th className="py-2 text-center font-semibold border-l border-white/30">أولوية متوسطة</th>
                                                    <th className="py-2 text-center font-semibold">أولوية عادية</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr className="bg-[#2f417a] hover:bg-[#3b4e93] transition">
                                                    <td className="py-2 text-center border-l border-white/30">إجمالي العدد</td>
                                                    {[selectedMonthDetails.totalImportant, selectedMonthDetails.totalNormal, selectedMonthDetails.totalEasy].map(
                                                        (value, i) => (
                                                            <td key={i} className="py-2 text-center border-l border-white/30">
                                                                <span className="inline-flex items-center justify-center min-w-[2.25rem] px-2 h-6 rounded-full bg-white/20">
                                                                    {value}
                                                                </span>
                                                            </td>
                                                        )
                                                    )}
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* === Bottom section: other rows === */}
                                    <div className="overflow-hidden rounded-xl border border-white/30 bg-[#5268b1] shadow-sm">
                                        <table className="w-full table-fixed border-collapse" dir="rtl">
                                            <tbody>
                                                {[
                                                    {
                                                        label: "إجمالي نسبة الاستكمال",
                                                        values: [
                                                            `${selectedMonthDetails.importantPercentage}%`,
                                                            `${selectedMonthDetails.normalPercentage}%`,
                                                            `${selectedMonthDetails.easyPercentage}%`,
                                                        ],
                                                    },
                                                    { label: "إجمالي مستوى الدقة", values: [92, 88, 95] },
                                                    { label: "إجمالي معدل السرعة", values: [85, 80, 91] },
                                                    { label: "إجمالي التقييم", values: [4.5, 4.8, 4.2] },
                                                ].map((row, index) => (
                                                    <tr
                                                        key={index}
                                                        className="bg-[#2f417a] border-t border-white/20 hover:bg-[#3b4e93] transition"
                                                    >
                                                        <td className="py-2 text-center border-l border-white/30">{row.label}</td>
                                                        {row.values.map((value, i) => (
                                                            <td key={i} className="py-2 text-center border-l border-white/30">
                                                                <span className="inline-flex items-center justify-center min-w-[2.25rem] px-2 h-6 rounded-full bg-white/20">
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

                                {/* === Total column (الإجمالي) === */}
                                <div className="flex-1 max-w-[6rem] flex flex-col gap-3">
                                    {/* === Top section (إجمالي العدد) === */}
                                    <div className="overflow-hidden rounded-xl border border-white/30 bg-[#4459a8] shadow-sm">
                                        <table className="w-full border-collapse" dir="rtl">
                                            <thead>
                                                <tr className="bg-[#4459a8] border-b border-white/30">
                                                    <th className="py-2 text-center font-semibold">الإجمالي</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr className="bg-[#2f417a] hover:bg-[#3b4e93] transition">
                                                    <td className="py-2 text-center">
                                                        <span className="inline-flex items-center justify-center min-w-[2.25rem] px-2 h-6 rounded-full bg-white/20">
                                                            {selectedMonthTasks?.tasks?.length}
                                                        </span>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* === Bottom section (other rows) === */}
                                    <div className="overflow-hidden rounded-xl border border-white/30 bg-[#4459a8] shadow-sm">
                                        <table className="w-full border-collapse" dir="rtl">
                                            <tbody>
                                                {[
                                                    { label: "إجمالي نسبة الاستكمال", value: `${selectedMonthDetails.finishedPercentage}%` },
                                                    { label: "إجمالي مستوى الدقة", value: 89 },
                                                    { label: "إجمالي معدل السرعة", value: 87 },
                                                    { label: "إجمالي التقييم", value: 4.7 },
                                                ].map((row, index) => (
                                                    <tr
                                                        key={index}
                                                        className="bg-[#2f417a] border-t border-white/20 hover:bg-[#3b4e93] transition"
                                                    >
                                                        <td className="py-2 text-center">
                                                            <span className="inline-flex items-center justify-center min-w-[2.25rem] px-2 h-6 rounded-full bg-white/20">
                                                                {row.value}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
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