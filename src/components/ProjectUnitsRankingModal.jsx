import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
    LineChart, Line, PieChart, Pie, Cell, LabelList
} from 'recharts';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight, faHouse, faTrophy } from "@fortawesome/free-solid-svg-icons";
import { useLanguage } from '../context/LanguageContext';
import Chart from './Chart';

const data = [
    { name: "ODBM", a: 30, b: 50, c: 20 },
    { name: "APBM", a: 40, b: 60, c: 30 },
    { name: "TQBM", a: 35, b: 55, c: 25 },
    { name: "Community", a: 20, b: 40, c: 10 },
    { name: "Institutional", a: 0, b: 0, c: 65 },
];

const ProjectUnitsRankingModal = ({ isOpen, onClose, data, loading, centerInfo, newData }) => {
    const { language } = useLanguage();

    // Generate fallback data that respects current month limitation
    const generateFallbackData = () => {
        const currentMonth = new Date().getMonth(); // 0-11
        const monthsToShow = currentMonth + 1;
        const allMonths = [
            'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
            'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
        ];

        const performanceValues = [75, 82, 84, 83, 85, 88, 93, 89, 92, 90, 87, 91];

        const annualPerformance = allMonths.slice(0, monthsToShow).map((month, index) => ({
            month,
            performance: performanceValues[index] || 75
        }));

        return {
            statistics: {
                students: 50,
                trainers: 10,
                supervisors: 7,
                generalManagers: 5,
                boardOfTrustees: 3,
                trainers2: 2,
                workshops: 5,
                labs: 3,
                specializations: 5
            },
            globalStandards: {
                "ODBM": {
                    value: 65,
                    color: '#22c55e',
                    nameEn: "ODBM - Organizational Development & Behavior Management",
                    nameAr: "ODBM - إدارة التطوير والسلوك",
                    details: {
                        attendance: { value: 68, nameEn: "Attendance & Presence", nameAr: "الحضور والغياب" },
                        commitment: { value: 62, nameEn: "Commitment & Discipline", nameAr: "الالتزام والانضباط" },
                        behavior: { value: 58, nameEn: "Institutional Behavior", nameAr: "السلوك المؤسسي" },
                        engagement: { value: 72, nameEn: "Participation & Engagement", nameAr: "المشاركة والتفاعل" }
                    }
                },
                "APBM": {
                    value: 55,
                    color: '#f59e0b',
                    nameEn: "APBM - Academic Performance & Business Management",
                    nameAr: "APBM - الأداء الأكاديمي والإداري",
                    details: {
                        academic: { value: 52, nameEn: "Academic Performance", nameAr: "الأداء الأكاديمي" },
                        projects: { value: 58, nameEn: "Applied Projects", nameAr: "المشاريع التطبيقية" },
                        practical: { value: 57, nameEn: "Practical Application", nameAr: "التطبيق العملي" },
                        management: { value: 53, nameEn: "Executive Management", nameAr: "الإدارة التنفيذية" }
                    }
                },
                "TQBM": {
                    value: 75,
                    color: '#22c55e',
                    nameEn: "TQBM - Training Quality & Business Management",
                    nameAr: "TQBM - جودة التدريب والأعمال",
                    details: {
                        quality: { value: 73, nameEn: "Training Quality", nameAr: "جودة التدريب" },
                        resources: { value: 82, nameEn: "Resources & Capabilities", nameAr: "الموارد والإمكانيات" },
                        methodology: { value: 76, nameEn: "Training Methodology", nameAr: "المنهجية التدريبية" },
                        effectiveness: { value: 74, nameEn: "Effectiveness & Impact", nameAr: "الفعالية والتأثير" }
                    }
                },
                "Community": {
                    value: 60,
                    color: '#ef4444',
                    nameEn: "Community Engagement",
                    nameAr: "Community - المشاركة المجتمعية",
                    details: {
                        interaction: { value: 52, nameEn: "Community Interaction", nameAr: "التفاعل المجتمعي" },
                        outreach: { value: 68, nameEn: "Community Outreach", nameAr: "الوصول المجتمعي" },
                        partnerships: { value: 60, nameEn: "Cooperation & Partnerships", nameAr: "التعاون والشراكات" },
                        impact: { value: 56, nameEn: "Community Impact", nameAr: "التأثير المجتمعي" }
                    }
                },
                "Institutional": {
                    value: 77,
                    color: '#3b82f6',
                    nameEn: "Institutional Excellence",
                    nameAr: "Institutional - التميز المؤسسي",
                    details: {
                        governance: { value: 75, nameEn: "Institutional Governance", nameAr: "الحوكمة المؤسسية" },
                        infrastructure: { value: 79, nameEn: "Infrastructure", nameAr: "البنية التحتية" },
                        policies: { value: 77, nameEn: "Policies & Procedures", nameAr: "السياسات والإجراءات" },
                        compliance: { value: 76, nameEn: "Compliance & Quality", nameAr: "الامتثال والجودة" }
                    }
                }
            },
            annualPerformance,
            overallScore: 75
        };
    };

    // Use real data or dynamic fallback
    const modalData = data || generateFallbackData();

    const { statistics, globalStandards, annualPerformance, overallScore } = modalData;

    if (!isOpen) return null;

    if (loading) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-8">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">جاري تحميل البيانات...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto p-4 top-16">
            <div className="bg-white rounded-lg w-full max-w-7xl max-h-[84vh] overflow-y-auto" style={{ backgroundColor: '#1e293b' }}>
                {/* Navbar */}
                <div className="flex items-center justify-between px-6 py-2">
                    {/* Ranking logo and number */}
                        <div className="relative w-16 h-16 flex items-center justify-center min-w-[15%]">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 640 640"
                                className="absolute inset-0 w-full h-full"
                                aria-hidden="true"
                            >
                                <path
                                    fill="#fff"
                                    d="M208.3 64L432.3 64C458.8 64 480.4 85.8 479.4 112.2C479.2 117.5 479 122.8 478.7 128L528.3 128C554.4 128 577.4 149.6 575.4 177.8C567.9 281.5 514.9 338.5 457.4 368.3C441.6 376.5 425.5 382.6 410.2 387.1C390 415.7 369 430.8 352.3 438.9L352.3 512L416.3 512C434 512 448.3 526.3 448.3 544C448.3 561.7 434 576 416.3 576L224.3 576C206.6 576 192.3 561.7 192.3 544C192.3 526.3 206.6 512 224.3 512L288.3 512L288.3 438.9C272.3 431.2 252.4 416.9 233 390.6C214.6 385.8 194.6 378.5 175.1 367.5C121 337.2 72.2 280.1 65.2 177.6C63.3 149.5 86.2 127.9 112.3 127.9L161.9 127.9C161.6 122.7 161.4 117.5 161.2 112.1C160.2 85.6 181.8 63.9 208.3 63.9zM165.5 176L113.1 176C119.3 260.7 158.2 303.1 198.3 325.6C183.9 288.3 172 239.6 165.5 176zM444 320.8C484.5 297 521.1 254.7 527.3 176L475 176C468.8 236.9 457.6 284.2 444 320.8z"
                                />
                            </svg>
                            <span className="relative text-black text-2xl font-bold -translate-y-2">5</span>
                        </div>

                        {/* Title and Institution's Name */}
                        <div className="flex flex-col justify-center items-center">
                            <h1 className="text-xl font-bold text-white mb-2 border-b border-gray-600 pb-2">الترتيب العام لوحدات المشروع</h1>
                            <p className="text-gray-300 border-b text-sm border-gray-600 pb-1 w-fit">
                                {`${centerInfo?.name}` || 'مركز تدريب مهني الشرقية'}
                            </p>
                        </div>
                        {/* Navigation Icons */}
                        <div className="flex items-center justify-evenly gap-2 min-w-[15%]">
                            <button className="hover:bg-gray-700 w-10 h-10 rounded-full flex justify-center items-center text-white">
                                <FontAwesomeIcon icon={faArrowLeft} />
                            </button>
                            <button className="hover:bg-gray-700 w-10 h-10 rounded-full flex justify-center items-center text-white">
                                <FontAwesomeIcon icon={faArrowRight} />
                            </button>
                            <button onClick={onClose} className="hover:bg-gray-700 w-10 h-10 rounded-full flex justify-center items-center text-white">
                                <FontAwesomeIcon icon={faHouse} />
                            </button>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex justify-evenly mx-6 mb-2 gap-4">
                        {/* Left Column */}
                        <div className="shadow-white shadow-sm border-white border-2 rounded-xl flex-1">
                            {/* Statistics Table */}
                            <div className="rounded-lg px-4 pt-1 pb-2 border-white border-2 m-3">
                                <h3 className="text-md font-bold text-white mb-2 text-center">أهم الاحصائيات</h3>
                                <div className="bg-white rounded px-4 py-1">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b">
                                                <th className="text-center text-sm py-2 text-gray-800">المتدربين</th>
                                                <th className="text-center text-sm py-2 text-gray-800">المدربين</th>
                                                <th className="text-center text-sm py-2 text-gray-800">المشرفين</th>
                                                <th className="text-center text-sm py-2 text-gray-800">الورش</th>
                                                <th className="text-center text-sm py-2 text-gray-800">المعامل</th>
                                                <th className="text-center text-sm py-2 text-gray-800">التخصصات</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className="text-center text-sm font-bold text-gray-800">{newData?.organizations[centerInfo?.id]?.no_of_trainees}</td>
                                                <td className="text-center text-sm font-bold text-gray-800">{newData?.organizations[centerInfo?.id]?.no_of_trainers}</td>
                                                <td className="text-center text-sm font-bold text-gray-800">{statistics.supervisors}</td>
                                                <td className="text-center text-sm font-bold text-gray-800">{statistics.workshops}</td>
                                                <td className="text-center text-sm font-bold text-gray-800">{statistics.labs}</td>
                                                <td className="text-center text-sm font-bold text-gray-800">{statistics.specializations}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            {/* line separator */}
                            <div className='border-t-2 border-white w-36 mx-auto mt-2' />
                            {/* Global Standards Chart */}
                            <div className="rounded-lg px-2 pt-1 pb-2 border-white border-2 m-3">
                                {/* title */}
                                <h3 className="font-bold text-white text-md mb-4 text-center">
                                    {language ? 'Project Standards from Global Criteria' : 'نسب المشروع من المعايير العالمية'}
                                </h3>
                                <div className="bg-white rounded flex flex-col" style={{ minWidth: '600px', height: "260px", overflowX: 'auto' }}>
                                    <div className='h-[85%] flex items-end'>
                                        <div className='w-[5%] flex flex-col text-black gap-6 text-center'>
                                            <h1>100</h1>
                                            <h1>75</h1>
                                            <h1>50</h1>
                                            <h1>25</h1>
                                            <h1>0</h1>
                                        </div>
                                        <div className='h-[100%] w-[1%] self-start border-l-2 border-black' />
                                        <div className='w-[95%] flex justify-evenly'>
                                            <div className='flex justify-center w-[15%] gap-1'>
                                                <div className='flex-1' style={{ width: 20, height: 220, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', marginBottom: 0, paddingBottom: 0 }}>
                                                    <div style={{ width: '100%', height: `20%`, background: '#3b82f6', transition: 'height 0.7s cubic-bezier(.4,2,.6,1)', position: 'absolute', bottom: 0, left: 0 }} />
                                                </div>
                                                <div className='flex-1' style={{ width: 20, height: 220, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', marginBottom: 0, paddingBottom: 0 }}>
                                                    <div style={{ width: '100%', height: `100%`, background: '#16a34a', transition: 'height 0.7s cubic-bezier(.4,2,.6,1)', position: 'absolute', bottom: 0, left: 0 }} />
                                                </div>
                                                <div className='flex-1' style={{ width: 20, height: 220, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', marginBottom: 0, paddingBottom: 0 }}>
                                                    <div style={{ width: '100%', height: `25%`, background: '#444652', transition: 'height 0.7s cubic-bezier(.4,2,.6,1)', position: 'absolute', bottom: 0, left: 0 }} />
                                                </div>
                                            </div>
                                            <div className='flex justify-center w-[15%] gap-1'>
                                                <div className='flex-1' style={{ width: 20, height: 220, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', marginBottom: 0, paddingBottom: 0 }}>
                                                    <div style={{ width: '100%', height: `60%`, background: '#001c56', transition: 'height 0.7s cubic-bezier(.4,2,.6,1)', position: 'absolute', bottom: 0, left: 0 }} />
                                                </div>
                                                <div className='flex-1' style={{ width: 20, height: 220, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', marginBottom: 0, paddingBottom: 0 }}>
                                                    <div style={{ width: '100%', height: `10%`, background: '#a855f7', transition: 'height 0.7s cubic-bezier(.4,2,.6,1)', position: 'absolute', bottom: 0, left: 0 }} />
                                                </div>
                                                <div className='flex-1' style={{ width: 20, height: 220, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', marginBottom: 0, paddingBottom: 0 }}>
                                                    <div style={{ width: '100%', height: `57%`, background: '#d34102', transition: 'height 0.7s cubic-bezier(.4,2,.6,1)', position: 'absolute', bottom: 0, left: 0 }} />
                                                </div>
                                                <div className='flex-1' style={{ width: 20, height: 220, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', marginBottom: 0, paddingBottom: 0 }}>
                                                    <div style={{ width: '100%', height: `5%`, background: '#444652', transition: 'height 0.7s cubic-bezier(.4,2,.6,1)', position: 'absolute', bottom: 0, left: 0 }} />
                                                </div>
                                                <div className='flex-1' style={{ width: 20, height: 220, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', marginBottom: 0, paddingBottom: 0 }}>
                                                    <div style={{ width: '100%', height: `95%`, background: '#444652', transition: 'height 0.7s cubic-bezier(.4,2,.6,1)', position: 'absolute', bottom: 0, left: 0 }} />
                                                </div>
                                            </div>
                                            <div className='flex justify-center w-[15%] gap-1'>
                                                <div className='flex-1' style={{ width: 20, height: 220, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', marginBottom: 0, paddingBottom: 0 }}>
                                                    <div style={{ width: '100%', height: `75%`, background: '#444652', transition: 'height 0.7s cubic-bezier(.4,2,.6,1)', position: 'absolute', bottom: 0, left: 0 }} />
                                                </div>
                                                <div className='flex-1' style={{ width: 20, height: 220, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', marginBottom: 0, paddingBottom: 0 }}>
                                                    <div style={{ width: '100%', height: `17%`, background: '#444652', transition: 'height 0.7s cubic-bezier(.4,2,.6,1)', position: 'absolute', bottom: 0, left: 0 }} />
                                                </div>
                                            </div>
                                            <div className='flex justify-center w-[15%] gap-1'>
                                                <div className='flex-1' style={{ width: 20, height: 220, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', marginBottom: 0, paddingBottom: 0 }}>
                                                    <div style={{ width: '100%', height: `33%`, background: '#444652', transition: 'height 0.7s cubic-bezier(.4,2,.6,1)', position: 'absolute', bottom: 0, left: 0 }} />
                                                </div>
                                            </div>
                                            <div className='flex justify-center w-[15%] gap-1'>
                                                <div className='flex-1' style={{ width: 20, height: 220, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', marginBottom: 0, paddingBottom: 0 }}>
                                                    <div style={{ width: '100%', height: `80%`, background: '#444652', transition: 'height 0.7s cubic-bezier(.4,2,.6,1)', position: 'absolute', bottom: 0, left: 0 }} />
                                                </div>
                                            </div>
                                            <div className='flex justify-center w-[15%] gap-1'>
                                                <div className='flex-1' style={{ width: 20, height: 220, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', marginBottom: 0, paddingBottom: 0 }}>
                                                    <div style={{ width: '100%', height: `22%`, background: '#444652', transition: 'height 0.7s cubic-bezier(.4,2,.6,1)', position: 'absolute', bottom: 0, left: 0 }} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='w-[95%] self-end border-t-2 border-black' />
                                    <div className='w-[95%] self-end h-[5%] flex text-black justify-evenly text-xs pl-2'>
                                        <h1 className='w-[17%] text-center'>جودة التدريب</h1>
                                        <h1 className='w-[17%] text-center'>الحوكمة</h1>
                                        <h1 className='w-[17%] text-center'>المقياس الاكاديمي</h1>
                                        <h1 className='w-[17%] text-center'>المشاركة المجتمعية</h1>
                                        <h1 className='w-[17%] text-center'>التنمية المهنية</h1>
                                        <h1 className='w-[17%] text-center'>الاشراف اليومي</h1>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="flex-1 flex flex-col gap-2">
                            {/* Annual Performance Chart */}
                            <div className="rounded-xl py-2 px-3 border-white border-2 shadow-white shadow-sm">
                                {/* Title */}
                                <h3 className="text-md font-bold text-white mb-2 text-center">
                                    {language ? 'Total Assessment Rate of Active Centers' : 'إجمالي نسبة تقييم المراكز المفعلة'}
                                </h3>
                                {/* Monthly Chart */}
                                <div className="bg-white rounded p-2">
                                    <ResponsiveContainer width="100%" height={140}>
                                        <LineChart data={annualPerformance} margin={{ top: 6, right: 30, left: -25, bottom: -10 }}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis
                                                dataKey="month"
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fontSize: 12 }}
                                            />
                                            <YAxis
                                                domain={[0, 100]}
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fontSize: 12 }}
                                            />
                                            <Tooltip
                                                formatter={(value) => [`${value}%`, language ? 'Performance' : 'الأداء']}
                                                contentStyle={{
                                                    backgroundColor: '#1a202c',
                                                    border: '1px solid #4a5568',
                                                    borderRadius: '6px',
                                                    color: '#e2e8f0'
                                                }}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="performance"
                                                stroke="#fbbf24"
                                                strokeWidth={3}
                                                dot={{ fill: '#fbbf24', strokeWidth: 2, r: 8 }}
                                                activeDot={{ r: 10, fill: '#f59e0b' }}
                                            >
                                                <LabelList
                                                    dataKey="performance"
                                                    position="top"
                                                    offset={10}
                                                    fill="#fbbf24"
                                                    fontSize={12}
                                                    fontWeight="bold"
                                                    formatter={(value) => `${value}%`}
                                                />
                                            </Line>
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Performance Evaluation */}
                            <div className="rounded-xl py-2 px-3 border-white border-2 shadow-white shadow-md">
                                {/* Title */}
                                <h3 className="text-md font-bold text-white mb-2 text-center">
                                    {language ? 'Performance Standards Evaluation' : 'تقييم معايير الاداء'}
                                </h3>
                                <div className="bg-white rounded py-2 px-3 flex items-center justify-between">
                                    {/* Performance Bars */}
                                    <div className="flex-1">
                                        {Object.entries(globalStandards).map(([key, value], index) => (
                                            <div key={key} className="mb-1">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm font-medium text-gray-700">
                                                        {(() => {
                                                            // Force short standard names mapping
                                                            if (key.includes('ODBM')) return 'ODBM';
                                                            else if (key.includes('APBM')) return 'APBM';
                                                            else if (key.includes('TQBM')) return 'TQBM';
                                                            else if (key.includes('Community')) return 'Community';
                                                            else if (key.includes('Institutional')) return 'Institutional';
                                                            return key;
                                                        })()}
                                                    </span>
                                                    <span className="text-sm font-bold text-gray-800">{value.value}%</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-4 relative">
                                                    <div
                                                        className="h-4 rounded-full flex items-center justify-center"
                                                        style={{
                                                            width: `${value.value}%`,
                                                            backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'][index % 5]
                                                        }}
                                                    >
                                                        {value.value > 15 && (
                                                            <span className="text-xs font-bold text-white">
                                                                {value.value}%
                                                            </span>
                                                        )}
                                                    </div>
                                                    {value.value <= 15 && (
                                                        <span
                                                            className="text-xs font-bold absolute right-2 top-0 h-full flex items-center"
                                                            style={{ color: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'][index % 5] }}
                                                        >
                                                            {value.value}%
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Overall Score Circle */}
                                    <div className="flex items-center justify-center ml-8">
                                        <div className="relative">
                                            <ResponsiveContainer width={120} height={120}>
                                                <PieChart>
                                                    <Pie
                                                        data={[
                                                            { name: language ? 'Score' : 'النتيجة', value: overallScore, fill: '#3b82f6' },
                                                            { name: language ? 'Remaining' : 'المتبقي', value: 100 - overallScore, fill: '#e5e7eb' }
                                                        ]}
                                                        cx="50%"
                                                        cy="50%"
                                                        innerRadius={30}
                                                        outerRadius={50}
                                                        startAngle={90}
                                                        endAngle={-270}
                                                        dataKey="value"
                                                    />
                                                </PieChart>
                                            </ResponsiveContainer>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <span className="text-2xl font-bold text-blue-600">%{overallScore}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            );
};

            export default ProjectUnitsRankingModal;