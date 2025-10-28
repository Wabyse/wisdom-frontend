// Components
import NewNavbar from "../../../components/NewNavbar";
import CustomHorizontalBarChart from "../../../components/customCharts/customHorizontalBarChart";
import CustomCircularProgressBar from "../../../components/customCharts/customCircularProgressBar";
import World from "../../../components/maps/World";
// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolderPlus, faPen, faQrcode } from "@fortawesome/free-solid-svg-icons";
// tools
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
// images
import { WATOMS_MODERN_COLORS_TW } from "../../../constants/constants";
import AnnualPerformanceChart from "../../../components/AnnualPerformanceChart";

const WatomsPEDashboard = () => {
    const navigate = useNavigate();
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
            </div>
        </>
    )
}

export default WatomsPEDashboard;