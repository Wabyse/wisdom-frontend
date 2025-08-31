import {
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line, PieChart, Pie, LabelList
} from 'recharts';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight, faHouse } from "@fortawesome/free-solid-svg-icons";
import { useLanguage } from '../context/LanguageContext';
import img from '../assets/ebda-body.jpg';
import { roundNumber } from '../utils/roundNumber';
import { useEffect, useState } from 'react';

const ProjectUnitsRankingModal = ({ isOpen, onClose, loading, centerInfo, newData, selectedId }) => {
    const { language } = useLanguage();
    const [orgSubStandards, setOrgSubStandards] = useState([]);
    const [orgStandards, setOrgStandards] = useState([]);
    const [selectedOrg, setSelectedOrg] = useState();
    const [orgRank, setOrgRank] = useState();

    const arrangedOrg = Object.values(newData?.organizations || {}).sort((a, b) => b.overall - a.overall);
    const changeOrg = (status) => {
        const selectedOrgIdx = arrangedOrg.findIndex(org => org.id === selectedOrg)
        if (status && (selectedOrgIdx + 1) !== arrangedOrg.length) {
            setSelectedOrg(arrangedOrg[selectedOrgIdx + 1].id)
        } else if (!status && (selectedOrgIdx) !== 0) {
            setSelectedOrg(arrangedOrg[selectedOrgIdx - 1].id)
        } else if (status && (selectedOrgIdx + 1) === arrangedOrg.length) {
            setSelectedOrg(arrangedOrg[0].id)
        } else if (!status && (selectedOrgIdx) === 0) {
            setSelectedOrg(arrangedOrg[arrangedOrg.length - 1].id)
        }
    }

    useEffect(() => {
        const changeRankedOrg = () => {
            const selectedOrgIdx = arrangedOrg.findIndex(org => org.id === (selectedOrg || selectedId))
            setOrgRank(selectedOrgIdx + 1);
        }
        changeRankedOrg();
    }, [selectedOrg])

    useEffect(() => {
        const setOrg = () => {
            setSelectedOrg(selectedId);
        }
        setOrg();
    }, [selectedId])

    useEffect(() => {
        const loadStandards = () => {
            setOrgStandards([
                {
                    name: "جودة التدريب",
                    score: roundNumber(newData?.organizations[selectedOrg || selectedId]?.TQBM?.totalTQBM),
                    color: "#3b82f6"
                },
                {
                    name: "مقياس الحوكمة",
                    score: roundNumber(newData?.organizations[selectedOrg || selectedId]?.GOVBM?.totalGOVBM),
                    color: "#10b981"
                },
                {
                    name: "المقياس الاكاديمي",
                    score: roundNumber(newData?.organizations[selectedOrg || selectedId]?.ACBM?.totalACBM),
                    color: "#f59e0b"
                }
            ])
        }

        const loadSubStandards = () => {
            setOrgSubStandards([
                {
                    name: "جودة التدريب",
                    subData: [
                        {
                            name: "البرامج التدريبية",
                            score: roundNumber(newData?.organizations[selectedOrg || selectedId]?.TQBM?.TG?.avgScore * 40),
                            color: "#3b82f6"
                        },
                        {
                            name: "بيئة التدريب",
                            score: roundNumber(newData?.organizations[selectedOrg || selectedId]?.TQBM?.TE?.avgScore * 35),
                            color: "#16a34a"
                        },
                        {
                            name: "اداء المدرب",
                            score: roundNumber(newData?.organizations[selectedOrg || selectedId]?.TQBM?.T?.avgScore * 25),
                            color: "#a855f7"
                        }
                    ],
                },
                {
                    name: "مقياس الحوكمة",
                    subData: [
                        {
                            name: "الاداء المؤسسي",
                            score: roundNumber(newData?.organizations[selectedOrg || selectedId]?.GOVBM?.IP?.avgScore * 15),
                            color: "#2e6f00"
                        },
                        {
                            name: "الرقمنة",
                            score: roundNumber(newData?.organizations[selectedOrg || selectedId]?.GOVBM?.DD?.avgScore * 30),
                            color: "#e43002"
                        },
                        {
                            name: "التخطيط و التشغيل",
                            score: roundNumber(newData?.organizations[selectedOrg || selectedId]?.GOVBM?.PO?.avgScore * 20),
                            color: "#88a064"
                        },
                        {
                            name: "الجودة و التطوير",
                            score: roundNumber(newData?.organizations[selectedOrg || selectedId]?.GOVBM?.QD?.avgScore * 20),
                            color: "#2e8d52"
                        },
                        {
                            name: "بيئة العمل",
                            score: roundNumber(newData?.organizations[selectedOrg || selectedId]?.GOVBM?.W?.avgScore * 15),
                            color: "#00bdbb"
                        }
                    ],
                },
                {
                    name: "المقياس الاكاديمي",
                    subData: [
                        {
                            name: "اداء المتدرب",
                            score: roundNumber(newData?.organizations[selectedOrg || selectedId]?.ACBM?.TR?.avgScore * 40),
                            color: "#aa4642"
                        },
                        {
                            name: "البرامج التدريبية",
                            score: roundNumber(newData?.organizations[selectedOrg || selectedId]?.ACBM?.TG?.avgScore * 60),
                            color: "#925515"
                        }
                    ],
                },
                {
                    name: "الكفاءة و الفاعلية",
                    subData: [
                        {
                            name: "المشاركة المجتمعية",
                            score: roundNumber(newData?.organizations[selectedOrg || selectedId]?.GEEBM?.CP?.avgScore * 10),
                            color: "#520a9c"
                        },
                        {
                            name: "التنمية المهنية",
                            score: roundNumber(newData?.organizations[selectedOrg || selectedId]?.GEEBM?.TV?.avgScore * 5),
                            color: "#596a95"
                        },
                        {
                            name: "الاشراف اليومي",
                            score: roundNumber(newData?.organizations[selectedOrg || selectedId]?.GEEBM?.TRA * 10),
                            color: "#4f46f7"
                        }
                    ],
                },
            ])
        }

        loadStandards();
        loadSubStandards();
    }, [newData, selectedOrg]);

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
                        <span className="relative text-black text-2xl font-bold -translate-y-2">{orgRank}</span>
                    </div>

                    {/* Title and Institution's Name */}
                    <div className="flex flex-col justify-center items-center">
                        <h1 className="text-xl font-bold text-white mb-2 border-b border-gray-600 pb-2">الترتيب العام لوحدات المشروع</h1>
                        <p className="text-gray-300 border-b text-sm border-gray-600 pb-1 w-fit">
                            {`${newData?.organizations[selectedOrg || selectedId]?.name}` || 'مركز تدريب مهني الشرقية'}
                        </p>
                    </div>
                    {/* Navigation Icons */}
                    <div className="flex items-center justify-evenly gap-2 min-w-[15%]">
                        <button onClick={() => changeOrg(false)} className="hover:bg-gray-700 w-10 h-10 rounded-full flex justify-center items-center text-white">
                            <FontAwesomeIcon icon={faArrowLeft} />
                        </button>
                        <button onClick={() => changeOrg(true)} className="hover:bg-gray-700 w-10 h-10 rounded-full flex justify-center items-center text-white">
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
                                            <td className="text-center text-sm font-bold text-gray-800">{newData?.organizations[selectedOrg || selectedId]?.no_of_trainees}</td>
                                            <td className="text-center text-sm font-bold text-gray-800">{newData?.organizations[selectedOrg || selectedId]?.no_of_trainers}</td>
                                            <td className="text-center text-sm font-bold text-gray-800">{0}</td>
                                            <td className="text-center text-sm font-bold text-gray-800">{0}</td>
                                            <td className="text-center text-sm font-bold text-gray-800">{0}</td>
                                            <td className="text-center text-sm font-bold text-gray-800">{0}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        {/* line separator */}
                        <div className='border-t-2 border-white w-36 mx-auto mt-2' />
                        {/* Performance Evaluation */}
                        <div className="rounded-xl py-2 px-3 border-white border-2 m-2">
                            {/* Title */}
                            <h3 className="text-md font-bold text-white mb-2 text-center">
                                {language ? 'Performance Standards Evaluation' : 'تقييم معايير الاداء'}
                            </h3>
                            <div className="bg-white rounded py-4 px-3 flex items-center justify-between">
                                {/* Overall Score Circle */}
                                <div className="flex flex-col items-center justify-center mr-8">
                                    <div className="relative">
                                        <ResponsiveContainer width={120} height={120}>
                                            <PieChart>
                                                <Pie
                                                    data={[
                                                        { name: language ? 'Score' : 'النتيجة', value: roundNumber(newData?.organizations[selectedOrg || selectedId]?.overall), fill: '#3b82f6' },
                                                        { name: language ? 'Remaining' : 'المتبقي', value: 100 - roundNumber(newData?.organizations[selectedOrg || selectedId]?.overall), fill: '#e5e7eb' }
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
                                            <span className="text-2xl font-bold text-blue-600">%{roundNumber(newData?.organizations[selectedOrg || selectedId]?.overall)}</span>
                                        </div>
                                    </div>
                                    <span className='text-black'>الكفاءة و الفاعلية</span>
                                </div>
                                {/* Performance Bars */}
                                <div className="flex flex-col flex-1 gap-8 my-6">
                                    {orgStandards
                                        ?.slice() // make a copy so you don't mutate the original
                                        .sort((a, b) => b.score - a.score) // sort by score descending
                                        .map((s) => (
                                            <div className='flex justify-between items-center mb-1 gap-2'>
                                                <span className="text-sm font-medium text-gray-700 min-w-32">{s.name}</span>
                                                <div className="w-52 bg-gray-200 rounded-full h-4 relative">
                                                    <div
                                                        className="h-4 rounded-full flex items-center justify-center"
                                                        style={{
                                                            width: `${s.score}%`,
                                                            backgroundColor: s.color
                                                        }}
                                                    >
                                                        {s.score > 15 && (
                                                            <span className="text-xs font-bold text-white">
                                                                {s.score}%
                                                            </span>
                                                        )}
                                                    </div>
                                                    {s.score === 0 && (
                                                        <span
                                                            className="text-xs font-bold absolute right-2 top-0 h-full flex items-center"
                                                            style={{ color: s.color }}
                                                        >
                                                        </span>
                                                    )}
                                                </div>
                                                <span className="text-sm font-bold text-gray-800">{s.score}%</span>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="flex-1 flex flex-col gap-2">
                        <div className='flex gap-2'>
                            {/* Annual Performance Chart */}
                            <div className="flex-1 w-1/2 rounded-xl py-2 px-3 border-white border-2 shadow-white shadow-sm">
                                {/* Title */}
                                <h3 className="text-md font-bold text-white mb-2 text-center">
                                    {language ? 'Total Assessment Rate of Active Centers' : 'تحليل معدل تغيير اداء المركز'}
                                </h3>
                                {/* Monthly Chart */}
                                <div className="bg-white rounded p-2">
                                    <ResponsiveContainer width="100%" height={140}>
                                        <LineChart data={newData?.organizations[selectedOrg || selectedId]?.months} margin={{ top: 6, right: 30, left: -25, bottom: -10 }}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis
                                                dataKey="month"
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fontSize: 7 }}
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
                                                strokeWidth={2}
                                                dot={{ fill: '#fbbf24', strokeWidth: 1, r: 4 }}
                                                activeDot={{ r: 8, fill: '#f59e0b' }}
                                            >
                                                <LabelList
                                                    dataKey="performance"
                                                    position="top"
                                                    offset={10}
                                                    fontSize={12}
                                                    fontWeight="bold"
                                                    content={({ x, y, value }) => (
                                                        <text
                                                            x={x}
                                                            y={y - 10}              // move label above dot
                                                            fill={value < 50 ? "red" : "#fbbf24"}
                                                            fontSize={12}
                                                            fontWeight="bold"
                                                            textAnchor="middle"
                                                        >
                                                            {`${value}%`}
                                                        </text>
                                                    )}
                                                />
                                            </Line>
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                            {/* institution image */}
                            <div className='flex-1 w-1/2 h-52 rounded-xl border-2 border-white p-2 shadow-white shadow-sm'><img className='w-full h-full' src={img} alt='' /></div>
                        </div>
                        {/* Global Standards Chart */}
                        <div className="rounded-lg px-2 pt-1 pb-2 border-white border-2 shadow-white shadow-sm">
                            {/* title */}
                            <h3 className="font-bold text-white text-md mb-4 text-center">
                                {language ? 'Project Standards from Global Criteria' : 'نسب المشروع من المعايير العالمية'}
                            </h3>
                            <div className='flex'>
                                {orgSubStandards.map((s, i) => (
                                    <div className=' flex w-1/4'>
                                        <div className='flex flex-col w-full'>
                                            <div className='flex justify-center gap-1 w-full'>
                                                {s.subData.map((item, i) =>
                                                    <div
                                                        key={item.name || `cat${i}`}
                                                        style={{
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            alignItems: 'center',
                                                        }}
                                                    >
                                                        {/* Percentage above bar */}
                                                        <div style={{ fontWeight: 700, fontSize: 11, marginBottom: 4 }}>{item.score}%</div>
                                                        {/* Vertical bar */}
                                                        <div
                                                            style={{
                                                                width: 20,
                                                                height: 85,
                                                                background: "#444652",
                                                                borderRadius: 8,
                                                                position: "relative",
                                                                overflow: "hidden",
                                                                display: "flex",
                                                                alignItems: "flex-end",
                                                                justifyContent: "center",
                                                                marginBottom: 0,
                                                                paddingBottom: 0,
                                                            }}
                                                        >
                                                            {/* colored bar fill */}
                                                            <div
                                                                style={{
                                                                    width: "100%",
                                                                    height: `${item.score}%`,
                                                                    background: item.color,
                                                                    borderRadius: 8,
                                                                    transition: "height 0.7s cubic-bezier(.4,2,.6,1)",
                                                                    position: "absolute",
                                                                    bottom: 0,
                                                                    left: 0,
                                                                }}
                                                            />

                                                            {/* vertical text */}
                                                            <span
                                                                style={{
                                                                    position: "absolute",
                                                                    inset: 0,
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    justifyContent: "center",
                                                                    writingMode: "vertical-rl",    // 👈 vertical text
                                                                    textOrientation: "mixed",
                                                                    transform: "rotate(180deg)",   // makes text bottom-to-top
                                                                    color: "#fff",
                                                                    fontSize: "8px",
                                                                    fontWeight: "bold",
                                                                    pointerEvents: "none",         // so hover still hits the bar
                                                                    textAlign: "center",
                                                                }}
                                                            >
                                                                {item.name}
                                                            </span>
                                                        </div>
                                                    </div>)}
                                            </div>
                                            <h1 className='text-white text-center text-xs border-t-2 border-white pb-2 p-4 mt-2'>{s.name}</h1>
                                        </div>
                                        {orgSubStandards.length !== i + 1 && <div className='border-l-2 border-white h-[85%]' />}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectUnitsRankingModal;