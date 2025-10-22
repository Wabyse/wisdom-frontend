import React, { useEffect, useState, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import DenyAccessPage from "../components/DenyAccessPage";
import DonutChart from "../components/DonutChart";
import NewNavbar from "../components/NewNavbar";
import { useAuth } from "../context/AuthContext";
import { MONTHS_ARABIC, NUMBER_TO_ARABIC_MONTHS } from "../constants/constants";
import {
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line
} from 'recharts';
import TmsDashboardTables from "../components/TmsDashboardTables";
import { fetchMyTasks } from "../services/tms";
import { roundNumber } from "../utils/roundNumber";
// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faPrint, faXmark } from "@fortawesome/free-solid-svg-icons";
// images
import golLogo from "../assets/Gov.png";
import ebdaeduLogo from "../assets/ebad-edu.png";
import wabysLogo from "../assets/wabys.png";
import person from "../assets/person.jpg";
import AddAlarmModal from "../components/alarms/AlarmModal";
import AlarmList from "../components/alarms/AlarmList";
import AlarmModal from "../components/alarms/AlarmModal";

const currentMonth = new Date().getMonth() + 1;

const WatomsTmsDashboard = () => {
    const { userInfo } = useAuth();
    const pdfRef = useRef();
    const [pdfStatus, setPdfStatus] = useState(false);
    const [selectedMonthIdx, setSelectedMonthIdx] = useState(9);
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [showTablePopup, setShowTablePopup] = useState(false);
    const [allTasks, setAllTasks] = useState([]);
    const [selectedMonthTasks, setSelectedMonthTasks] = useState({});
    const [monthlyPerformance, setMonthlyPerformance] = useState([]);

    const [selectedMonthDetails, setSelectedMonthDetails] = useState({
        finishedPercentage: 0, totalFinished: 0, totalUnFinished: 0,
        totalImportant: 0, totalNormal: 0, totalEasy: 0,
        total50Important: 0, total50Normal: 0, total50Easy: 0,
        importantPercentage: 0, normalPercentage: 0, easyPercentage: 0,
        totalImportantLarge: 0, totalImportantMedium: 0, totalImportantSmall: 0,
        totalNormalLarge: 0, totalNormalMedium: 0, totalNormalSmall: 0,
        totalEasyLarge: 0, totalEasyMedium: 0, totalEasySmall: 0,
        importantLargePercentage: 0, importantMediumPercentage: 0, importantSmallPercentage: 0,
        normalLargePercentage: 0, normalMediumPercentage: 0, normalSmallPercentage: 0,
        easyLargePercentage: 0, easyMediumPercentage: 0, easySmallPercentage: 0,
        avgManagerSpeed: 0, avgManagerQuality: 0, avgReviewerSpeed: 0, avgReviewerQuality: 0,
        avgManagerSpeedImportant: 0, avgManagerQualityImportant: 0, avgReviewerSpeedImportant: 0, avgReviewerQualityImportant: 0,
        avgManagerSpeedNormal: 0, avgManagerQualityNormal: 0, avgReviewerSpeedNormal: 0, avgReviewerQualityNormal: 0,
        avgManagerSpeedEasy: 0, avgManagerQualityEasy: 0, avgReviewerSpeedEasy: 0, avgReviewerQualityEasy: 0,
        avgManagerQualityImportantLarge: 0, avgManagerQualityImportantMedium: 0, avgManagerQualityImportantSmall: 0,
        avgReviewerQualityImportantLarge: 0, avgReviewerQualityImportantMedium: 0, avgReviewerQualityImportantSmall: 0,
        avgManagerSpeedImportantLarge: 0, avgManagerSpeedImportantMedium: 0, avgManagerSpeedImportantSmall: 0,
        avgReviewerSpeedImportantLarge: 0, avgReviewerSpeedImportantMedium: 0, avgReviewerSpeedImportantSmall: 0,
        avgManagerQualityNormalLarge: 0, avgManagerQualityNormalMedium: 0, avgManagerQualityNormalSmall: 0,
        avgReviewerQualityNormalLarge: 0, avgReviewerQualityNormalMedium: 0, avgReviewerQualityNormalSmall: 0,
        avgManagerQualityEasyLarge: 0, avgManagerQualityEasyMedium: 0, avgManagerQualityEasySmall: 0,
        avgReviewerQualityEasyLarge: 0, avgReviewerQualityEasyMedium: 0, avgReviewerQualityEasySmall: 0,
    })

    // fetch user's tasks
    useEffect(() => {
        const loadMyTasks = async () => {
            const response = await fetchMyTasks(userInfo?.id, "ebdaedu");
            const currentMonthsTasks = response.find(task => task.monthNumber === currentMonth);
            setAllTasks(response)
            setSelectedMonth(currentMonthsTasks ? currentMonthsTasks?.month : NUMBER_TO_ARABIC_MONTHS[currentMonth])
            setSelectedMonthIdx(currentMonth - 1)
            setSelectedMonthTasks(currentMonthsTasks ? currentMonthsTasks : { monthNumber: currentMonth, tasks: [] })
            calculateTmsDetails(currentMonthsTasks);
        }

        loadMyTasks();
    }, [currentMonth, userInfo])

    // create pdf to download
    const handleDownloadPdf = async () => {
        const element = pdfRef.current;

        // Create a high-res canvas of the element
        const canvas = await html2canvas(element, {
            scale: 2, // higher scale = better quality
            useCORS: true, // allows external images like logos
        });

        const imageData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        const imgWidth = pdfWidth;
        const imgHeight = (canvas.height * pdfWidth) / canvas.width;

        let heightLeft = imgHeight;
        let position = 0;

        // Add first page
        pdf.addImage(imageData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;

        // Add extra pages if needed
        while (heightLeft > 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imageData, "PNG", 0, position, imgWidth, imgHeight);
            heightLeft -= pdfHeight;
        }

        pdf.save("report.pdf");
    };

    // create the pdf template to view
    const PdfPages = () => (
        <div className="fixed inset-0 bg-black/60 flex flex-col overflow-y-auto justify-start gap-6 items-center z-50">
            <button
                onClick={() => setPdfStatus(false)}
                className="absolute top-4 right-4 text-white bg-gray-700 hover:bg-gray-800 w-12 h-12 flex justify-center items-center text-2xl font-bold cursor-pointer z-50"
            >
                <FontAwesomeIcon icon={faXmark} />
            </button>
            <button
                onClick={handleDownloadPdf}
                className="absolute top-4 right-20 text-white bg-gray-700 hover:bg-gray-800 w-12 h-12 flex justify-center items-center text-2xl font-bold cursor-pointer z-50"
            >
                <FontAwesomeIcon icon={faPrint} />
            </button>
            <div ref={pdfRef} className="relative bg-white w-[40%] max-w-5xl h-fit p-4 flex flex-col">
                <div className="rounded-2xl border-black border-2 h-full flex flex-col items-center gap-2 p-2">
                    {/* Header */}
                    <div className="flex justify-between items-center w-full">
                        {/* logo */}
                        <div className="flex flex-col">
                            <img src={ebdaeduLogo} className="w-10" alt="ebda edu logo" />
                        </div>
                        {/* title */}
                        <div className="flex flex-col items-center gap-2 text-xs font-bold">
                            <h1 className="border-b-2 border-black">تقرير ملخص اداء المهام في الفترة من الي</h1>
                        </div>
                        <div className="w-10" />
                    </div>
                    {/* user's Summary */}
                    <div className="w-full border-black border-2 flex p-1 gap-1 min-h-20">
                        {/* total score */}
                        <div className="flex flex-col items-center text-center gap-1 w-[15%] font-bold">
                            <div className="text-[10px] border-black border-2 w-full bg-gray-300 h-1/2 flex justify-center items-center">اجمالي التقييم</div>
                            <div className="text-sm border-black border-2 w-full h-1/2 flex justify-center items-center">{`${roundNumber((((selectedMonthDetails.avgManagerSpeed + selectedMonthDetails.avgReviewerSpeed) / 2) * 0.3) + (((selectedMonthDetails.avgManagerQuality + selectedMonthDetails.avgReviewerQuality) / 2) * 0.3) + (selectedMonthDetails.finishedPercentage * 0.4))}%`}</div>
                        </div>
                        {/* no of tasks */}
                        <div className="flex flex-col items-center text-center gap-1 w-[15%] font-bold">
                            <div className="text-[10px] border-black border-2 w-full bg-gray-300 h-1/2 flex justify-center items-center">اجمالي عدد المهام</div>
                            <div className="text-sm border-black border-2 w-full h-1/2 flex justify-center items-center">{selectedMonthTasks?.tasks?.length}</div>
                        </div>
                        {/* orgs titles */}
                        <div className="flex flex-col gap-1 w-1/3 text-[10px] font-bold justify-center items-center">
                            <div className="border-black border-2 h-fit w-full text-center px-2 py-1 flex justify-center items-center">EBDA EDU</div>
                            <div className="border-black border-2 h-fit w-full text-center px-2 py-1 flex justify-center items-center">EBDA EDU</div>
                        </div>
                        {/* orgs details */}
                        <div className="flex flex-col gap-1 min-w-fit max-w-1/3 text-[10px] font-bold justify-center items-center">
                            <div className="border-black border-2 h-fit w-full text-center px-2 py-1 flex justify-center items-center bg-gray-300">الجهة الرئيسية</div>
                            <div className="border-black border-2 h-fit w-full text-center px-2 py-1 flex justify-center items-center bg-gray-300">الجهة الفرعية</div>
                        </div>
                        {/* user's photo */}
                        <div className="border-black border-2 p-1">
                            <img className="w-16" src={person} alt="" />
                        </div>
                        <div className="flex justify-center items-center">
                            <div className="px-2 bg-gray-300 border-black border-2 text-xs">1</div>
                        </div>
                    </div>

                    {/* tasks' summary */}
                    <h1 className="w-full text-end font-bold underline">اولا: اهم الاحصائيات</h1>
                    <div className="w-full h-fit flex items-center gap-2 p-4 border-black border-2">
                        <div className="flex-1 flex flex-col gap-2">
                            <div className={`text-white text-center rounded p-2 bg-[#2f417a]`}>الاجماليات</div>
                            <div className="flex gap-2">
                                <div className="flex-1 flex flex-col gap-1">
                                    <div className={`text-white text-center text-[8px] rounded p-2 bg-[#2f417a]`}>اجمالي عدد المهام المنجزة</div>
                                    <div className={`border-black p-2 border-2 rounded text-center font-bold`}>{selectedMonthDetails.totalFinished}</div>
                                </div>
                                <div className="flex-1 flex flex-col gap-1">
                                    <div className={`text-white text-center text-[8px] rounded p-2 bg-[#2f417a]`}>اجمالي عدد المهام الغير منجزة</div>
                                    <div className={`border-black p-2 border-2 rounded text-center font-bold`}>{selectedMonthDetails.totalUnFinished}</div>
                                </div>
                                <div className="flex-1 flex flex-col gap-1">
                                    <div className={`text-white text-center text-[8px] rounded p-2 bg-[#2f417a]`}>اجمالي عدد المهام الغير منجزة</div>
                                    <div className={`border-black p-2 border-2 rounded text-center font-bold`}>{selectedMonthDetails.totalUnFinished}</div>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 flex flex-col gap-2 justify-start">
                            <div className={`text-white text-center rounded p-2 bg-[#2f417a]`}>مهام اقل من (%50)</div>
                            <div className="w-full flex justify-evenly gap-2">
                                <div className="flex-1 flex flex-col gap-2">
                                    <div className={`text-center rounded p-2 bg-[#5268b1] text-white text-xs`}>اولوية قصوي</div>
                                    <div className={`flex justify-center items-center border-black px-2 border-2 rounded text-center font-bold text-black`}>{selectedMonthDetails.total50Important}</div>
                                </div>
                                <div className="flex-1 flex flex-col gap-2">
                                    <div className={`text-center rounded p-2 bg-[#5268b1] text-white text-xs`}>اولوية متوسطة</div>
                                    <div className={`flex justify-center items-center border-black px-2 border-2 rounded text-center font-bold text-black`}>{selectedMonthDetails.total50Normal}</div>
                                </div>
                                <div className="flex-1 flex flex-col gap-2">
                                    <div className={`text-center rounded py-2 px-3 bg-[#5268b1] text-white text-xs`}>اولوية عادية</div>
                                    <div className={`flex justify-center items-center border-black px-2 border-2 rounded text-center font-bold text-black`}>{selectedMonthDetails.total50Easy}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* user's tasks score summary */}
                    <h1 className="w-full text-end font-bold underline">ثانيا: تقييم معايير معدل تنفيذ المهام</h1>
                    <div className="w-full h-fit flex flex-col items-center gap-4 p-4 border-black border-2">
                        <div className="flex items-center gap-2 w-full">
                            <div
                                className="w-[75%] flex flex-col justify-start overflow-y-auto overflow-x-hidden"
                                style={{
                                    minHeight: 60,
                                    maxHeight: 300,
                                    zIndex: 1,
                                    marginTop: 9
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
                                    <div className="text-start min-w-36" style={{
                                        maxWidth: 120,
                                        fontWeight: 900,
                                        fontSize: 15,
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
                                                width: `${(selectedMonthDetails.avgManagerSpeed + selectedMonthDetails.avgReviewerSpeed) / 2}%`,
                                                background: "red",
                                                borderRadius: 18,
                                                transition: 'width 0.7s cubic-bezier(.4,2,.6,1)',
                                            }}
                                        />
                                    </div>
                                    {/* Percentage (on the right) */}
                                    <div className="text-end" style={{
                                        minWidth: 38,
                                        fontWeight: 900,
                                        fontSize: 17,
                                        textAlign: 'right',
                                        marginLeft: 0,
                                        marginRight: 0,
                                        transition: 'color 0.2s ease'
                                    }}>
                                        {(selectedMonthDetails.avgManagerSpeed + selectedMonthDetails.avgReviewerSpeed) / 2}%
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
                                    <div className="text-start min-w-36" style={{
                                        maxWidth: 120,
                                        fontWeight: 900,
                                        fontSize: 15,
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
                                                width: `${(selectedMonthDetails.avgManagerQuality + selectedMonthDetails.avgReviewerQuality) / 2}%`,
                                                background: "blue",
                                                borderRadius: 18,
                                                transition: 'width 0.7s cubic-bezier(.4,2,.6,1)',
                                            }}
                                        />
                                    </div>
                                    {/* Percentage (on the right) */}
                                    <div className="text-end" style={{
                                        minWidth: 38,
                                        fontWeight: 900,
                                        fontSize: 17,
                                        textAlign: 'right',
                                        marginLeft: 0,
                                        marginRight: 0,
                                        transition: 'color 0.2s ease'
                                    }}>
                                        {(selectedMonthDetails.avgManagerQuality + selectedMonthDetails.avgReviewerQuality) / 2}%
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
                                    <div className="text-start min-w-36" style={{
                                        maxWidth: 120,
                                        fontWeight: 900,
                                        fontSize: 15,
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
                                    <div className="text-end" style={{
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
                                <DonutChart value={roundNumber((((selectedMonthDetails.avgManagerSpeed + selectedMonthDetails.avgReviewerSpeed) / 2) * 0.3) + (((selectedMonthDetails.avgManagerQuality + selectedMonthDetails.avgReviewerQuality) / 2) * 0.3) + (selectedMonthDetails.finishedPercentage * 0.4))} size={90} color='url(#circularBlueGradient)' bg='#23263a' textColor='#fff' />
                                <div className="flex p-2 border-black border-2 gap-2">
                                    <h1>مهمة</h1>
                                    <h1>{selectedMonthTasks?.tasks?.length}</h1>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* user's line chart */}
                    <h1 className="w-full text-end font-bold underline">ثالثا: تحليل معدل تغيير الاداء</h1>
                    <div className="w-full h-fit p-2 border-black border-2">
                        <ResponsiveContainer width="100%" height={200}>
                            <LineChart
                                data={normalizedPerformance}
                                margin={{ top: 6, right: 30, left: -25, bottom: -10 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" /> {/* optional grey grid */}
                                <XAxis
                                    dataKey="month"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: "black" }} // ← white x-axis text
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: "black" }} // ← white y-axis text
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
                                    label={({ x, y, value }) => (
                                        <text
                                            x={x}
                                            y={y - 10} // move up a little
                                            textAnchor="middle"
                                            fill="#ffffff"
                                            fontSize={12}
                                            fontWeight="bold"
                                        >
                                            {value}%
                                        </text>
                                    )}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* task's details */}
                    <div className="h-[35vh] flex items-center">
                        <div className="w-full flex flex-row-reverse gap-3 text-white text-xs cursor-pointer" onClick={() => setShowTablePopup(true)}>
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
                                                { label: "إجمالي مستوى الدقة", values: [`${(selectedMonthDetails.avgManagerQualityImportant * selectedMonthDetails.avgReviewerQualityImportant) / 2}%`, `${(selectedMonthDetails.avgManagerQualityNormal * selectedMonthDetails.avgReviewerQualityNormal) / 2}%`, `${(selectedMonthDetails.avgManagerQualityEasy * selectedMonthDetails.avgReviewerQualityEasy) / 2}%`] },
                                                { label: "إجمالي معدل السرعة", values: [`${(selectedMonthDetails.avgManagerSpeedImportant * selectedMonthDetails.avgReviewerSpeedImportant) / 2}%`, `${(selectedMonthDetails.avgManagerSpeedNormal * selectedMonthDetails.avgReviewerSpeedNormal) / 2}%`, `${(selectedMonthDetails.avgManagerSpeedEasy * selectedMonthDetails.avgReviewerSpeedEasy) / 2}%`] },
                                                { label: "إجمالي التقييم", values: [`${roundNumber((((selectedMonthDetails.avgManagerSpeedImportant + selectedMonthDetails.avgReviewerSpeedImportant) / 2) * 0.3) + (((selectedMonthDetails.avgManagerQualityImportant + selectedMonthDetails.avgReviewerQualityImportant) / 2) * 0.3) + (selectedMonthDetails.importantPercentage * 0.4))}%`, `${roundNumber((((selectedMonthDetails.avgManagerSpeedNormal + selectedMonthDetails.avgReviewerSpeedNormal) / 2) * 0.3) + (((selectedMonthDetails.avgManagerQualityNormal + selectedMonthDetails.avgReviewerQualityNormal) / 2) * 0.3) + (selectedMonthDetails.normalPercentage * 0.4))}%`, `${roundNumber((((selectedMonthDetails.avgManagerSpeedEasy + selectedMonthDetails.avgReviewerSpeedEasy) / 2) * 0.3) + (((selectedMonthDetails.avgManagerQualityEasy + selectedMonthDetails.avgReviewerQualityEasy) / 2) * 0.3) + (selectedMonthDetails.easyPercentage * 0.4))}%`] },
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
                                                { label: "إجمالي مستوى الدقة", value: `${(selectedMonthDetails.avgManagerQuality * selectedMonthDetails.avgReviewerQuality) / 2}%` },
                                                { label: "إجمالي معدل السرعة", value: `${(selectedMonthDetails.avgManagerSpeed * selectedMonthDetails.avgReviewerSpeed) / 2}%` },
                                                { label: "إجمالي التقييم", value: `${roundNumber((((selectedMonthDetails.avgManagerSpeed + selectedMonthDetails.avgReviewerSpeed) / 2) * 0.3) + (((selectedMonthDetails.avgManagerQuality + selectedMonthDetails.avgReviewerQuality) / 2) * 0.3) + (selectedMonthDetails.finishedPercentage * 0.4))}%` },
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
    );

    const calculateTmsDetails = (currentMonthsTasks) => {
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
        const importantLargeTasksCount = currentMonthsTasks ? currentMonthsTasks?.tasks.filter(task => task.importance === "urgent" && task.task_size === "large").length : 0;
        const importantMediumTasksCount = currentMonthsTasks ? currentMonthsTasks?.tasks.filter(task => task.importance === "urgent" && task.task_size === "medium").length : 0;
        const importantSmallTasksCount = currentMonthsTasks ? currentMonthsTasks?.tasks.filter(task => task.importance === "urgent" && task.task_size === "small").length : 0;
        const normalLargeTasksCount = currentMonthsTasks ? currentMonthsTasks?.tasks.filter(task => task.importance === "important" && task.task_size === "large").length : 0;
        const normalMediumTasksCount = currentMonthsTasks ? currentMonthsTasks?.tasks.filter(task => task.importance === "important" && task.task_size === "medium").length : 0;
        const normalSmallTasksCount = currentMonthsTasks ? currentMonthsTasks?.tasks.filter(task => task.importance === "important" && task.task_size === "small").length : 0;
        const easyLargeTasksCount = currentMonthsTasks ? currentMonthsTasks?.tasks.filter(task => task.importance === "normal" && task.task_size === "large").length : 0;
        const easyMediumTasksCount = currentMonthsTasks ? currentMonthsTasks?.tasks.filter(task => task.importance === "normal" && task.task_size === "medium").length : 0;
        const easySmallTasksCount = currentMonthsTasks ? currentMonthsTasks?.tasks.filter(task => task.importance === "normal" && task.task_size === "small").length : 0;
        const importantLarge100TasksCount = currentMonthsTasks ? currentMonthsTasks?.tasks.filter(task => task.importance === "urgent" && task.task_size === "large" && (task.status === "finished" || task.status === "submitted")).length : 0;
        const importantMedium100TasksCount = currentMonthsTasks ? currentMonthsTasks?.tasks.filter(task => task.importance === "urgent" && task.task_size === "medium" && (task.status === "finished" || task.status === "submitted")).length : 0;
        const importantSmall100TasksCount = currentMonthsTasks ? currentMonthsTasks?.tasks.filter(task => task.importance === "urgent" && task.task_size === "small" && (task.status === "finished" || task.status === "submitted")).length : 0;
        const normalLarge100TasksCount = currentMonthsTasks ? currentMonthsTasks?.tasks.filter(task => task.importance === "important" && task.task_size === "large" && (task.status === "finished" || task.status === "submitted")).length : 0;
        const normalMedium100TasksCount = currentMonthsTasks ? currentMonthsTasks?.tasks.filter(task => task.importance === "important" && task.task_size === "medium" && (task.status === "finished" || task.status === "submitted")).length : 0;
        const normalSmall100TasksCount = currentMonthsTasks ? currentMonthsTasks?.tasks.filter(task => task.importance === "important" && task.task_size === "small" && (task.status === "finished" || task.status === "submitted")).length : 0;
        const easyLarge100TasksCount = currentMonthsTasks ? currentMonthsTasks?.tasks.filter(task => task.importance === "normal" && task.task_size === "large" && (task.status === "finished" || task.status === "submitted")).length : 0;
        const easyMedium100TasksCount = currentMonthsTasks ? currentMonthsTasks?.tasks.filter(task => task.importance === "normal" && task.task_size === "medium" && (task.status === "finished" || task.status === "submitted")).length : 0;
        const easySmall100TasksCount = currentMonthsTasks ? currentMonthsTasks?.tasks.filter(task => task.importance === "normal" && task.task_size === "small" && (task.status === "finished" || task.status === "submitted")).length : 0;
        const avgManagerSpeed = currentMonthsTasks?.tasks?.length
            ? roundNumber(
                currentMonthsTasks.tasks.reduce(
                    (sum, task) => sum + (Number(task.manager_speed_percentage) || 0),
                    0
                ) / currentMonthsTasks.tasks.length
            )
            : 0;
        const avgManagerQuality = currentMonthsTasks?.tasks?.length
            ? roundNumber(
                currentMonthsTasks.tasks.reduce(
                    (sum, task) => sum + (Number(task.manager_quality_percentage) || 0),
                    0
                ) / currentMonthsTasks.tasks.length
            )
            : 0;
        const avgReviewerSpeed = currentMonthsTasks?.tasks?.length
            ? roundNumber(
                currentMonthsTasks.tasks.reduce(
                    (sum, task) => sum + (Number(task.reviewer_speed_percentage) || 0),
                    0
                ) / currentMonthsTasks.tasks.length
            )
            : 0;
        const avgReviewerQuality = currentMonthsTasks?.tasks?.length
            ? roundNumber(
                currentMonthsTasks.tasks.reduce(
                    (sum, task) => sum + (Number(task.reviewer_quality_percentage) || 0),
                    0
                ) / currentMonthsTasks.tasks.length
            )
            : 0;
        const avgManagerSpeedImportant = currentMonthsTasks?.tasks?.filter(task => task.importance === "urgent").length
            ? roundNumber(
                currentMonthsTasks.tasks.reduce(
                    (sum, task) => sum + (Number(task.manager_speed_percentage) || 0),
                    0
                ) / currentMonthsTasks.tasks.length
            )
            : 0;
        const avgManagerQualityImportant = currentMonthsTasks?.tasks?.filter(task => task.importance === "urgent").length
            ? roundNumber(
                currentMonthsTasks.tasks.reduce(
                    (sum, task) => sum + (Number(task.manager_quality_percentage) || 0),
                    0
                ) / currentMonthsTasks.tasks.length
            )
            : 0;
        const avgReviewerSpeedImportant = currentMonthsTasks?.tasks?.filter(task => task.importance === "urgent").length
            ? roundNumber(
                currentMonthsTasks.tasks.reduce(
                    (sum, task) => sum + (Number(task.reviewer_speed_percentage) || 0),
                    0
                ) / currentMonthsTasks.tasks.length
            )
            : 0;
        const avgReviewerQualityImportant = currentMonthsTasks?.tasks?.filter(task => task.importance === "urgent").length
            ? roundNumber(
                currentMonthsTasks.tasks.reduce(
                    (sum, task) => sum + (Number(task.reviewer_quality_percentage) || 0),
                    0
                ) / currentMonthsTasks.tasks.length
            )
            : 0;
        const avgManagerSpeedNormal = currentMonthsTasks?.tasks?.filter(task => task.importance === "important").length
            ? roundNumber(
                currentMonthsTasks.tasks.reduce(
                    (sum, task) => sum + (Number(task.manager_speed_percentage) || 0),
                    0
                ) / currentMonthsTasks.tasks.length
            )
            : 0;
        const avgManagerQualityNormal = currentMonthsTasks?.tasks?.filter(task => task.importance === "important").length
            ? roundNumber(
                currentMonthsTasks.tasks.reduce(
                    (sum, task) => sum + (Number(task.manager_quality_percentage) || 0),
                    0
                ) / currentMonthsTasks.tasks.length
            )
            : 0;
        const avgReviewerSpeedNormal = currentMonthsTasks?.tasks?.filter(task => task.importance === "important").length
            ? roundNumber(
                currentMonthsTasks.tasks.reduce(
                    (sum, task) => sum + (Number(task.reviewer_speed_percentage) || 0),
                    0
                ) / currentMonthsTasks.tasks.length
            )
            : 0;
        const avgReviewerQualityNormal = currentMonthsTasks?.tasks?.filter(task => task.importance === "important").length
            ? roundNumber(
                currentMonthsTasks.tasks.reduce(
                    (sum, task) => sum + (Number(task.reviewer_quality_percentage) || 0),
                    0
                ) / currentMonthsTasks.tasks.length
            )
            : 0;

        const avgManagerSpeedEasy = currentMonthsTasks?.tasks?.filter(task => task.importance === "normal").length
            ? roundNumber(
                currentMonthsTasks.tasks.reduce(
                    (sum, task) => sum + (Number(task.manager_speed_percentage) || 0),
                    0
                ) / currentMonthsTasks.tasks.length
            )
            : 0;
        const avgManagerQualityEasy = currentMonthsTasks?.tasks?.filter(task => task.importance === "normal").length
            ? roundNumber(
                currentMonthsTasks.tasks.reduce(
                    (sum, task) => sum + (Number(task.manager_quality_percentage) || 0),
                    0
                ) / currentMonthsTasks.tasks.length
            )
            : 0;
        const avgReviewerSpeedEasy = currentMonthsTasks?.tasks?.filter(task => task.importance === "normal").length
            ? roundNumber(
                currentMonthsTasks.tasks.reduce(
                    (sum, task) => sum + (Number(task.reviewer_speed_percentage) || 0),
                    0
                ) / currentMonthsTasks.tasks.length
            )
            : 0;
        const avgReviewerQualityEasy = currentMonthsTasks?.tasks?.filter(task => task.importance === "normal").length
            ? roundNumber(
                currentMonthsTasks.tasks.reduce(
                    (sum, task) => sum + (Number(task.reviewer_quality_percentage) || 0),
                    0
                ) / currentMonthsTasks.tasks.length
            )
            : 0;

        const avgManagerSpeedImportantLarge = currentMonthsTasks?.tasks?.filter(task => task.importance === "urgent" && task.task_size === "large").length
            ? roundNumber(
                currentMonthsTasks.tasks.reduce(
                    (sum, task) => sum + (Number(task.manager_speed_percentage) || 0),
                    0
                ) / currentMonthsTasks.tasks.length
            )
            : 0;
        const avgManagerQualityImportantLarge = currentMonthsTasks?.tasks?.filter(task => task.importance === "urgent" && task.task_size === "large").length
            ? roundNumber(
                currentMonthsTasks.tasks.reduce(
                    (sum, task) => sum + (Number(task.manager_quality_percentage) || 0),
                    0
                ) / currentMonthsTasks.tasks.length
            )
            : 0;
        const avgReviewerSpeedImportantLarge = currentMonthsTasks?.tasks?.filter(task => task.importance === "urgent" && task.task_size === "large").length
            ? roundNumber(
                currentMonthsTasks.tasks.reduce(
                    (sum, task) => sum + (Number(task.reviewer_speed_percentage) || 0),
                    0
                ) / currentMonthsTasks.tasks.length
            )
            : 0;
        const avgReviewerQualityImportantLarge = currentMonthsTasks?.tasks?.filter(task => task.importance === "urgent" && task.task_size === "large").length
            ? roundNumber(
                currentMonthsTasks.tasks.reduce(
                    (sum, task) => sum + (Number(task.reviewer_quality_percentage) || 0),
                    0
                ) / currentMonthsTasks.tasks.length
            )
            : 0;

        const avgManagerSpeedImportantMedium = currentMonthsTasks?.tasks?.filter(task => task.importance === "urgent" && task.task_size === "medium").length
            ? roundNumber(
                currentMonthsTasks.tasks.reduce(
                    (sum, task) => sum + (Number(task.manager_speed_percentage) || 0),
                    0
                ) / currentMonthsTasks.tasks.length
            )
            : 0;
        const avgManagerQualityImportantMedium = currentMonthsTasks?.tasks?.filter(task => task.importance === "urgent" && task.task_size === "medium").length
            ? roundNumber(
                currentMonthsTasks.tasks.reduce(
                    (sum, task) => sum + (Number(task.manager_quality_percentage) || 0),
                    0
                ) / currentMonthsTasks.tasks.length
            )
            : 0;
        const avgReviewerSpeedImportantMedium = currentMonthsTasks?.tasks?.filter(task => task.importance === "urgent" && task.task_size === "medium").length
            ? roundNumber(
                currentMonthsTasks.tasks.reduce(
                    (sum, task) => sum + (Number(task.reviewer_speed_percentage) || 0),
                    0
                ) / currentMonthsTasks.tasks.length
            )
            : 0;
        const avgReviewerQualityImportantMedium = currentMonthsTasks?.tasks?.filter(task => task.importance === "urgent" && task.task_size === "medium").length
            ? roundNumber(
                currentMonthsTasks.tasks.reduce(
                    (sum, task) => sum + (Number(task.reviewer_quality_percentage) || 0),
                    0
                ) / currentMonthsTasks.tasks.length
            )
            : 0;

        const avgManagerSpeedImportantSmall = currentMonthsTasks?.tasks?.filter(task => task.importance === "urgent" && task.task_size === "small").length
            ? roundNumber(
                currentMonthsTasks.tasks.reduce(
                    (sum, task) => sum + (Number(task.manager_speed_percentage) || 0),
                    0
                ) / currentMonthsTasks.tasks.length
            )
            : 0;
        const avgManagerQualityImportantSmall = currentMonthsTasks?.tasks?.filter(task => task.importance === "urgent" && task.task_size === "small").length
            ? roundNumber(
                currentMonthsTasks.tasks.reduce(
                    (sum, task) => sum + (Number(task.manager_quality_percentage) || 0),
                    0
                ) / currentMonthsTasks.tasks.length
            )
            : 0;
        const avgReviewerSpeedImportantSmall = currentMonthsTasks?.tasks?.filter(task => task.importance === "urgent" && task.task_size === "small").length
            ? roundNumber(
                currentMonthsTasks.tasks.reduce(
                    (sum, task) => sum + (Number(task.reviewer_speed_percentage) || 0),
                    0
                ) / currentMonthsTasks.tasks.length
            )
            : 0;
        const avgReviewerQualityImportantSmall = currentMonthsTasks?.tasks?.filter(task => task.importance === "urgent" && task.task_size === "small").length
            ? roundNumber(
                currentMonthsTasks.tasks.reduce(
                    (sum, task) => sum + (Number(task.reviewer_quality_percentage) || 0),
                    0
                ) / currentMonthsTasks.tasks.length
            )
            : 0;
        // 
        const avgManagerSpeedNormalLarge = currentMonthsTasks?.tasks?.filter(task => task.importance === "important" && task.task_size === "large").length
            ? roundNumber(
                currentMonthsTasks.tasks.reduce(
                    (sum, task) => sum + (Number(task.manager_speed_percentage) || 0),
                    0
                ) / currentMonthsTasks.tasks.length
            )
            : 0;
        const avgManagerQualityNormalLarge = currentMonthsTasks?.tasks?.filter(task => task.importance === "important" && task.task_size === "large").length
            ? roundNumber(
                currentMonthsTasks.tasks.reduce(
                    (sum, task) => sum + (Number(task.manager_quality_percentage) || 0),
                    0
                ) / currentMonthsTasks.tasks.length
            )
            : 0;
        const avgReviewerSpeedNormalLarge = currentMonthsTasks?.tasks?.filter(task => task.importance === "important" && task.task_size === "large").length
            ? roundNumber(
                currentMonthsTasks.tasks.reduce(
                    (sum, task) => sum + (Number(task.reviewer_speed_percentage) || 0),
                    0
                ) / currentMonthsTasks.tasks.length
            )
            : 0;
        const avgReviewerQualityNormalLarge = currentMonthsTasks?.tasks?.filter(task => task.importance === "important" && task.task_size === "large").length
            ? roundNumber(
                currentMonthsTasks.tasks.reduce(
                    (sum, task) => sum + (Number(task.reviewer_quality_percentage) || 0),
                    0
                ) / currentMonthsTasks.tasks.length
            )
            : 0;

        const avgManagerSpeedNormalMedium = currentMonthsTasks?.tasks?.filter(task => task.importance === "important" && task.task_size === "medium").length
            ? roundNumber(
                currentMonthsTasks.tasks.reduce(
                    (sum, task) => sum + (Number(task.manager_speed_percentage) || 0),
                    0
                ) / currentMonthsTasks.tasks.length
            )
            : 0;
        const avgManagerQualityNormalMedium = currentMonthsTasks?.tasks?.filter(task => task.importance === "important" && task.task_size === "medium").length
            ? roundNumber(
                currentMonthsTasks.tasks.reduce(
                    (sum, task) => sum + (Number(task.manager_quality_percentage) || 0),
                    0
                ) / currentMonthsTasks.tasks.length
            )
            : 0;
        const avgReviewerSpeedNormalMedium = currentMonthsTasks?.tasks?.filter(task => task.importance === "important" && task.task_size === "medium").length
            ? roundNumber(
                currentMonthsTasks.tasks.reduce(
                    (sum, task) => sum + (Number(task.reviewer_speed_percentage) || 0),
                    0
                ) / currentMonthsTasks.tasks.length
            )
            : 0;
        const avgReviewerQualityNormalMedium = currentMonthsTasks?.tasks?.filter(task => task.importance === "important" && task.task_size === "medium").length
            ? roundNumber(
                currentMonthsTasks.tasks.reduce(
                    (sum, task) => sum + (Number(task.reviewer_quality_percentage) || 0),
                    0
                ) / currentMonthsTasks.tasks.length
            )
            : 0;

        const avgManagerSpeedNormalSmall = currentMonthsTasks?.tasks?.filter(task => task.importance === "important" && task.task_size === "small").length
            ? roundNumber(
                currentMonthsTasks.tasks.reduce(
                    (sum, task) => sum + (Number(task.manager_speed_percentage) || 0),
                    0
                ) / currentMonthsTasks.tasks.length
            )
            : 0;
        const avgManagerQualityNormalSmall = currentMonthsTasks?.tasks?.filter(task => task.importance === "important" && task.task_size === "small").length
            ? roundNumber(
                currentMonthsTasks.tasks.reduce(
                    (sum, task) => sum + (Number(task.manager_quality_percentage) || 0),
                    0
                ) / currentMonthsTasks.tasks.length
            )
            : 0;
        const avgReviewerSpeedNormalSmall = currentMonthsTasks?.tasks?.filter(task => task.importance === "important" && task.task_size === "small").length
            ? roundNumber(
                currentMonthsTasks.tasks.reduce(
                    (sum, task) => sum + (Number(task.reviewer_speed_percentage) || 0),
                    0
                ) / currentMonthsTasks.tasks.length
            )
            : 0;
        const avgReviewerQualityNormalSmall = currentMonthsTasks?.tasks?.filter(task => task.importance === "important" && task.task_size === "small").length
            ? roundNumber(
                currentMonthsTasks.tasks.reduce(
                    (sum, task) => sum + (Number(task.reviewer_quality_percentage) || 0),
                    0
                ) / currentMonthsTasks.tasks.length
            )
            : 0;
        // 
        const avgManagerSpeedEasyLarge = currentMonthsTasks?.tasks?.filter(task => task.importance === "normal" && task.task_size === "large").length
            ? roundNumber(
                currentMonthsTasks.tasks.reduce(
                    (sum, task) => sum + (Number(task.manager_speed_percentage) || 0),
                    0
                ) / currentMonthsTasks.tasks.length
            )
            : 0;
        const avgManagerQualityEasyLarge = currentMonthsTasks?.tasks?.filter(task => task.importance === "normal" && task.task_size === "large").length
            ? roundNumber(
                currentMonthsTasks.tasks.reduce(
                    (sum, task) => sum + (Number(task.manager_quality_percentage) || 0),
                    0
                ) / currentMonthsTasks.tasks.length
            )
            : 0;
        const avgReviewerSpeedEasyLarge = currentMonthsTasks?.tasks?.filter(task => task.importance === "normal" && task.task_size === "large").length
            ? roundNumber(
                currentMonthsTasks.tasks.reduce(
                    (sum, task) => sum + (Number(task.reviewer_speed_percentage) || 0),
                    0
                ) / currentMonthsTasks.tasks.length
            )
            : 0;
        const avgReviewerQualityEasyLarge = currentMonthsTasks?.tasks?.filter(task => task.importance === "normal" && task.task_size === "large").length
            ? roundNumber(
                currentMonthsTasks.tasks.reduce(
                    (sum, task) => sum + (Number(task.reviewer_quality_percentage) || 0),
                    0
                ) / currentMonthsTasks.tasks.length
            )
            : 0;

        const avgManagerSpeedEasyMedium = currentMonthsTasks?.tasks?.filter(task => task.importance === "normal" && task.task_size === "medium").length
            ? roundNumber(
                currentMonthsTasks.tasks.reduce(
                    (sum, task) => sum + (Number(task.manager_speed_percentage) || 0),
                    0
                ) / currentMonthsTasks.tasks.length
            )
            : 0;
        const avgManagerQualityEasyMedium = currentMonthsTasks?.tasks?.filter(task => task.importance === "normal" && task.task_size === "medium").length
            ? roundNumber(
                currentMonthsTasks.tasks.reduce(
                    (sum, task) => sum + (Number(task.manager_quality_percentage) || 0),
                    0
                ) / currentMonthsTasks.tasks.length
            )
            : 0;
        const avgReviewerSpeedEasyMedium = currentMonthsTasks?.tasks?.filter(task => task.importance === "normal" && task.task_size === "medium").length
            ? roundNumber(
                currentMonthsTasks.tasks.reduce(
                    (sum, task) => sum + (Number(task.reviewer_speed_percentage) || 0),
                    0
                ) / currentMonthsTasks.tasks.length
            )
            : 0;
        const avgReviewerQualityEasyMedium = currentMonthsTasks?.tasks?.filter(task => task.importance === "normal" && task.task_size === "medium").length
            ? roundNumber(
                currentMonthsTasks.tasks.reduce(
                    (sum, task) => sum + (Number(task.reviewer_quality_percentage) || 0),
                    0
                ) / currentMonthsTasks.tasks.length
            )
            : 0;

        const avgManagerSpeedEasySmall = currentMonthsTasks?.tasks?.filter(task => task.importance === "normal" && task.task_size === "small").length
            ? roundNumber(
                currentMonthsTasks.tasks.reduce(
                    (sum, task) => sum + (Number(task.manager_speed_percentage) || 0),
                    0
                ) / currentMonthsTasks.tasks.length
            )
            : 0;
        const avgManagerQualityEasySmall = currentMonthsTasks?.tasks?.filter(task => task.importance === "normal" && task.task_size === "small").length
            ? roundNumber(
                currentMonthsTasks.tasks.reduce(
                    (sum, task) => sum + (Number(task.manager_quality_percentage) || 0),
                    0
                ) / currentMonthsTasks.tasks.length
            )
            : 0;
        const avgReviewerSpeedEasySmall = currentMonthsTasks?.tasks?.filter(task => task.importance === "normal" && task.task_size === "small").length
            ? roundNumber(
                currentMonthsTasks.tasks.reduce(
                    (sum, task) => sum + (Number(task.reviewer_speed_percentage) || 0),
                    0
                ) / currentMonthsTasks.tasks.length
            )
            : 0;
        const avgReviewerQualityEasySmall = currentMonthsTasks?.tasks?.filter(task => task.importance === "normal" && task.task_size === "small").length
            ? roundNumber(
                currentMonthsTasks.tasks.reduce(
                    (sum, task) => sum + (Number(task.reviewer_quality_percentage) || 0),
                    0
                ) / currentMonthsTasks.tasks.length
            )
            : 0;

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
            totalImportantLarge: Number(importantLargeTasksCount),
            totalImportantMedium: Number(importantMediumTasksCount),
            totalImportantSmall: Number(importantSmallTasksCount),
            totalNormalLarge: Number(normalLargeTasksCount),
            totalNormalMedium: Number(normalMediumTasksCount),
            totalNormalSmall: Number(normalSmallTasksCount),
            totalEasyLarge: Number(easyLargeTasksCount),
            totalEasyMedium: Number(easyMediumTasksCount),
            totalEasySmall: Number(easySmallTasksCount),
            importantLargePercentage: importantLarge100TasksCount ? roundNumber((Number(importantLarge100TasksCount) / Number(importantLargeTasksCount)) * 100) : 0,
            importantMediumPercentage: importantMedium100TasksCount ? roundNumber((Number(importantMedium100TasksCount) / Number(importantMediumTasksCount)) * 100) : 0,
            importantSmallPercentage: importantSmall100TasksCount ? roundNumber((Number(importantSmall100TasksCount) / Number(importantSmallTasksCount)) * 100) : 0,
            normalLargePercentage: normalLarge100TasksCount ? roundNumber((Number(normalLarge100TasksCount) / Number(normalLargeTasksCount)) * 100) : 0,
            normalMediumPercentage: normalMedium100TasksCount ? roundNumber((Number(normalMedium100TasksCount) / Number(normalMediumTasksCount)) * 100) : 0,
            normalSmallPercentage: normalSmall100TasksCount ? roundNumber((Number(normalSmall100TasksCount) / Number(normalSmallTasksCount)) * 100) : 0,
            easyLargePercentage: easyLarge100TasksCount ? roundNumber((Number(easyLarge100TasksCount) / Number(easyLargeTasksCount)) * 100) : 0,
            easyMediumPercentage: easyMedium100TasksCount ? roundNumber((Number(easyMedium100TasksCount) / Number(easyMediumTasksCount)) * 100) : 0,
            easySmallPercentage: easySmall100TasksCount ? roundNumber((Number(easySmall100TasksCount) / Number(easySmallTasksCount)) * 100) : 0,
            avgManagerSpeed, avgManagerQuality, avgReviewerSpeed, avgReviewerQuality,
            avgManagerSpeedImportant, avgManagerQualityImportant, avgReviewerSpeedImportant, avgReviewerQualityImportant,
            avgManagerSpeedNormal, avgManagerQualityNormal, avgReviewerSpeedNormal, avgReviewerQualityNormal,
            avgManagerSpeedEasy, avgManagerQualityEasy, avgReviewerSpeedEasy, avgReviewerQualityEasy,
            avgManagerQualityImportantLarge, avgManagerQualityImportantMedium, avgManagerQualityImportantSmall,
            avgReviewerQualityImportantLarge, avgReviewerQualityImportantMedium, avgReviewerQualityImportantSmall,
            avgManagerSpeedImportantLarge, avgManagerSpeedImportantMedium, avgManagerSpeedImportantSmall,
            avgReviewerSpeedImportantLarge, avgReviewerSpeedImportantMedium, avgReviewerSpeedImportantSmall,
            avgManagerQualityNormalLarge, avgManagerQualityNormalMedium, avgManagerQualityNormalSmall,
            avgReviewerQualityNormalLarge, avgReviewerQualityNormalMedium, avgReviewerQualityNormalSmall,
            avgManagerSpeedNormalLarge, avgManagerSpeedNormalMedium, avgManagerSpeedNormalSmall,
            avgReviewerSpeedNormalLarge, avgReviewerSpeedNormalMedium, avgReviewerSpeedNormalSmall,
            avgManagerQualityEasyLarge, avgManagerQualityEasyMedium, avgManagerQualityEasySmall,
            avgReviewerQualityEasyLarge, avgReviewerQualityEasyMedium, avgReviewerQualityEasySmall,
            avgManagerSpeedEasyLarge, avgManagerSpeedEasyMedium, avgManagerSpeedEasySmall,
            avgReviewerSpeedEasyLarge, avgReviewerSpeedEasyMedium, avgReviewerSpeedEasySmall,
        }));

        // === Compute and store monthly performance ===
        const performanceScore = roundNumber(
            (((avgManagerSpeed + avgReviewerSpeed) / 2) * 0.3) +
            (((avgManagerQuality + avgReviewerQuality) / 2) * 0.3) +
            ((finishedTasksPercentage / totalTasks) * 100 * 0.4)
        );

        setMonthlyPerformance(prev => {
            const updated = prev.filter(m => m.monthNumber !== currentMonthsTasks?.monthNumber);
            return [
                ...updated,
                {
                    monthNumber: currentMonthsTasks?.monthNumber,
                    month: NUMBER_TO_ARABIC_MONTHS[currentMonthsTasks?.monthNumber],
                    performance: performanceScore,
                },
            ];
        });

    }

    const toggleMonth = (status) => {
        if (status) {
            if (selectedMonthIdx + 1 !== currentMonth) {
                const selectedMonthTasks = allTasks.find(task => task.monthNumber === selectedMonthIdx + 2);
                setSelectedMonth(NUMBER_TO_ARABIC_MONTHS[selectedMonthIdx + 2]);
                setSelectedMonthIdx(prev => prev + 1);
                setSelectedMonthTasks(selectedMonthTasks ? selectedMonthTasks : { monthNumber: currentMonth, tasks: [] })
                calculateTmsDetails(selectedMonthTasks);
            }
        } else {
            if (selectedMonthIdx !== 0) {
                const selectedMonthTasks = allTasks.find(task => task.monthNumber === selectedMonthIdx);
                setSelectedMonth(NUMBER_TO_ARABIC_MONTHS[selectedMonthIdx]);
                setSelectedMonthIdx(prev => prev - 1);
                setSelectedMonthTasks(selectedMonthTasks ? selectedMonthTasks : { monthNumber: currentMonth, tasks: [] })
                calculateTmsDetails(selectedMonthTasks);
            }
        }
    }

    // Normalize monthlyPerformance to include all 12 months
    const normalizedPerformance = MONTHS_ARABIC.map(m => {
        const found = monthlyPerformance.find(d => d.monthNumber === m.monthNumber);
        return found ? found : { ...m, performance: 0 };
    });

    if (userInfo?.code === 1452 || userInfo?.code === 1476) return <DenyAccessPage homePage='/watoms/dashboard' />;
    if (userInfo?.code === 1475) return <DenyAccessPage homePage='/watoms/news' />;
    if (userInfo?.code === 1310) return <DenyAccessPage homePage='/wisdom/dashboard' />;
    return (
        <>
            <NewNavbar
                shareStatus={false}
                plusStatus={true}
                AddStatus={true}
                notificationStatus={true}
            >
                <AlarmModal userId={userInfo?.id} />
                {/* open Pdf */}
                <button onClick={() => setPdfStatus(true)} className="rounded-full w-10 h-10 flex justify-center items-center bg-white/80 hover:bg-gray-200 shadow transition-all">
                    <FontAwesomeIcon icon={faPrint} className="text-xl text-gray-500" />
                </button>
            </NewNavbar>
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
                                                    width: `${(selectedMonthDetails.avgManagerSpeed + selectedMonthDetails.avgReviewerSpeed) / 2}%`,
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
                                            {(selectedMonthDetails.avgManagerSpeed + selectedMonthDetails.avgReviewerSpeed) / 2}%
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
                                                    width: `${(selectedMonthDetails.avgManagerQuality + selectedMonthDetails.avgReviewerQuality) / 2}%`,
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
                                            {(selectedMonthDetails.avgManagerQuality + selectedMonthDetails.avgReviewerQuality) / 2}%
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
                                    <DonutChart value={roundNumber((((selectedMonthDetails.avgManagerSpeed + selectedMonthDetails.avgReviewerSpeed) / 2) * 0.3) + (((selectedMonthDetails.avgManagerQuality + selectedMonthDetails.avgReviewerQuality) / 2) * 0.3) + (selectedMonthDetails.finishedPercentage * 0.4))} size={90} color='url(#circularBlueGradient)' bg='#23263a' textColor='#fff' />
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
                                    data={normalizedPerformance}
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
                                        label={({ x, y, value }) => (
                                            <text
                                                x={x}
                                                y={y - 10} // move up a little
                                                textAnchor="middle"
                                                fill="#ffffff"
                                                fontSize={12}
                                                fontWeight="bold"
                                            >
                                                {value}%
                                            </text>
                                        )}
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
                            <div className="w-full flex flex-row-reverse gap-3 text-white text-xs cursor-pointer" onClick={() => setShowTablePopup(true)}>
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
                                                    { label: "إجمالي مستوى الدقة", values: [`${(selectedMonthDetails.avgManagerQualityImportant * selectedMonthDetails.avgReviewerQualityImportant) / 2}%`, `${(selectedMonthDetails.avgManagerQualityNormal * selectedMonthDetails.avgReviewerQualityNormal) / 2}%`, `${(selectedMonthDetails.avgManagerQualityEasy * selectedMonthDetails.avgReviewerQualityEasy) / 2}%`] },
                                                    { label: "إجمالي معدل السرعة", values: [`${(selectedMonthDetails.avgManagerSpeedImportant * selectedMonthDetails.avgReviewerSpeedImportant) / 2}%`, `${(selectedMonthDetails.avgManagerSpeedNormal * selectedMonthDetails.avgReviewerSpeedNormal) / 2}%`, `${(selectedMonthDetails.avgManagerSpeedEasy * selectedMonthDetails.avgReviewerSpeedEasy) / 2}%`] },
                                                    { label: "إجمالي التقييم", values: [`${roundNumber((((selectedMonthDetails.avgManagerSpeedImportant + selectedMonthDetails.avgReviewerSpeedImportant) / 2) * 0.3) + (((selectedMonthDetails.avgManagerQualityImportant + selectedMonthDetails.avgReviewerQualityImportant) / 2) * 0.3) + (selectedMonthDetails.importantPercentage * 0.4))}%`, `${roundNumber((((selectedMonthDetails.avgManagerSpeedNormal + selectedMonthDetails.avgReviewerSpeedNormal) / 2) * 0.3) + (((selectedMonthDetails.avgManagerQualityNormal + selectedMonthDetails.avgReviewerQualityNormal) / 2) * 0.3) + (selectedMonthDetails.normalPercentage * 0.4))}%`, `${roundNumber((((selectedMonthDetails.avgManagerSpeedEasy + selectedMonthDetails.avgReviewerSpeedEasy) / 2) * 0.3) + (((selectedMonthDetails.avgManagerQualityEasy + selectedMonthDetails.avgReviewerQualityEasy) / 2) * 0.3) + (selectedMonthDetails.easyPercentage * 0.4))}%`] },
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
                                                    { label: "إجمالي مستوى الدقة", value: `${(selectedMonthDetails.avgManagerQuality * selectedMonthDetails.avgReviewerQuality) / 2}%` },
                                                    { label: "إجمالي معدل السرعة", value: `${(selectedMonthDetails.avgManagerSpeed * selectedMonthDetails.avgReviewerSpeed) / 2}%` },
                                                    { label: "إجمالي التقييم", value: `${roundNumber((((selectedMonthDetails.avgManagerSpeed + selectedMonthDetails.avgReviewerSpeed) / 2) * 0.3) + (((selectedMonthDetails.avgManagerQuality + selectedMonthDetails.avgReviewerQuality) / 2) * 0.3) + (selectedMonthDetails.finishedPercentage * 0.4))}%` },
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
            {pdfStatus && <PdfPages />}
            {showTablePopup && (
                <TmsDashboardTables
                    onClose={() => setShowTablePopup(false)}
                    selectedMonthTasks={selectedMonthTasks}
                    selectedMonthDetails={selectedMonthDetails}
                />
            )}
        </>
    )
}

export default WatomsTmsDashboard;