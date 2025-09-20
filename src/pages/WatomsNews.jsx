import NewNavbar from "../components/NewNavbar";
import { roundNumber } from "../utils/roundNumber";
import { useEffect, useState } from "react";
import { WATOMS_MODERN_COLORS } from "../constants/constants";
import { fetchWatomsDetailsData } from "../services/dashboard";
import LoadingScreen from "../components/LoadingScreen";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
import img from "../assets/homeCover2.jpg";
import DonutChart from "../components/DonutChart";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faChartSimple, faPhone, faScroll } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { viewNews } from "../services/admins";


const WatomsNews = () => {
    const navigate = useNavigate();
    const [selectedOrg, setSelectedOrg] = useState(null);
    const [watomsData, setWatomsData] = useState([]);
    const [selectedMonthIdx, setSelectedMonthIdx] = useState(null);
    const [loading, setLoading] = useState(true);
    const [watomsNewsData, setWatomsNewsData] = useState([]);

    // fetching watoms' dashboard data
    useEffect(() => {
        const loadWatomsDetailedData = async () => {
            try {
                setLoading(true);
                const response = await fetchWatomsDetailsData();
                setWatomsData(response);
                setSelectedMonthIdx(response.total.months.length - 1);
                setSelectedOrg(response.total);
            } catch (error) {
                console.error('❌ Error fetching Watoms Data:', error);
            } finally {
                setLoading(false);
            }
        }

        const loadWatomsNewsData = async () => {
            try {
                setLoading(true);
                const response = await viewNews();
                console.log('News API Response:', response);
                console.log('News data with image paths:', response.map(news => ({
                    id: news.id,
                    title: news.title,
                    image_path: news.image_path,
                    normalized_path: news.image_path ? news.image_path.replace(/\\/g, '/') : 'No image path',
                    full_image_url: news.image_path ? `${process.env.REACT_APP_API_URL || 'http://localhost:4000'}/uploads/${news.image_path.replace(/\\/g, '/')}` : 'No image path',
                    base_url: process.env.REACT_APP_API_URL || 'http://localhost:4000'
                })));
                setWatomsNewsData(response);
            } catch (error) {
                console.error('❌ Error fetching Watoms Data:', error);
            } finally {
                setLoading(false);
            }
        }

        loadWatomsDetailedData();
        loadWatomsNewsData();
    }, []);

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div style={{
                    background: 'rgba(32, 42, 58, 0.95)',
                    border: '1px solid #444',
                    borderRadius: 8,
                    padding: '12px 16px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                    color: '#fff',
                    fontSize: 14,
                    backdropFilter: 'blur(10px)',
                }}>
                    <p style={{ margin: '0 0 8px 0', fontWeight: 'bold', color: '#facc15' }}>
                        {label}
                    </p>
                    <p style={{ margin: 0, color: payload[0].payload.color }}>
                        الأداء: {payload[0].value}%
                    </p>
                </div>
            );
        }
        return null;
    };

    if (loading) return <LoadingScreen />;

    return (
        <>
            <NewNavbar />
            <div className="w-full h-[88vh] flex flex-col items-center bg-[#0a183d]">
                <div className="flex justify-center w-[95%] h-full gap-6">
                    <fieldset className="my-auto flex justify-center items-center border-2 border-gray-400 p-2 rounded-2xl shadow-white shadow-md min-h-[80vh] h-[80vh] min-w-1/3 w-1/3">
                        <legend className="px-2 text-center font-bold text-white">لوحة تحكم البيانات</legend>
                        <div className="flex flex-col items-center justify-center gap-2 w-full">
                            {/* Total Institutions */}
                            <div
                                className="h-28 w-full"
                                style={{
                                    background: "#2d3347",
                                    borderRadius: 16,
                                    padding: '10px 24px 10px 24px',
                                    minWidth: 220,
                                    boxShadow: '0 2px 8px #0002',
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 12
                                }}>
                                <div className="flex flex-col items-center gap-2" style={{ width: '100%', textAlign: 'center', fontWeight: 700, fontSize: 15, color: '#fff', alignItems: 'center', padding: '0 8px' }}>
                                    <span>{'المفعل'}</span>
                                    <span className="rounded-full w-14 h-14 flex justify-center items-center text-xl" style={{ fontWeight: 900, color: "black", backgroundColor: '#22c55e' }}>{String(5).padStart(2, '0')}</span>
                                </div>
                                <div className="flex flex-col gap-2 min-w-fit" style={{ width: '100%', textAlign: 'center', fontWeight: 700, fontSize: 15, color: '#fff', alignItems: 'center', padding: '0 8px' }}>
                                    <span>{'الغير مفعّل'}</span>
                                    <span className="rounded-full w-14 h-14 flex justify-center items-center text-xl" style={{ fontWeight: 900, color: "black", backgroundColor: '#ef4444' }}>{String(33).padStart(2, '0')}</span>
                                </div>
                                <div className="flex flex-col gap-2" style={{ width: '100%', textAlign: 'center', fontWeight: 700, fontSize: 15, color: '#fff', alignItems: 'center', padding: '0 8px' }}>
                                    <span>{'إجمالي'}</span>
                                    <span className="rounded-full w-14 h-14 flex justify-center items-center text-xl" style={{ fontWeight: 900, color: "black", backgroundColor: '#3fd8ff' }}>{String(38).padStart(2, '0')}</span>
                                </div>
                            </div>
                            {/* Monthly Chart */}
                            <div className="w-full bg-[#2d3347] rounded-xl">
                                <div className="mb-2" style={{ fontWeight: 700, fontSize: 16, color: '#facc15', textAlign: 'center', letterSpacing: 0.5 }}>
                                    {`تحليل معدل تغيير الاداء ${selectedOrg?.id === "All" ? "للمشروع" : selectedOrg?.name}`}
                                </div>
                                <ResponsiveContainer width="90%" height={150}>
                                    <LineChart data={selectedOrg ? selectedOrg.months : watomsData?.total?.months}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#444" opacity={0.3} />
                                        <XAxis
                                            dataKey="month"
                                            stroke="#888"
                                            fontSize={8}
                                            tick={{ fill: '#fff' }}
                                        />
                                        <YAxis
                                            stroke="#888"
                                            fontSize={8}
                                            tick={{ fill: '#fff' }}
                                            domain={[0, 100]}
                                            ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
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
                                                    fill={props.payload.color}
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
                                                offset={15}
                                                fill="#facc15"
                                                fontSize={11}
                                                fontWeight="bold"
                                                formatter={(value) => `${value}%`}
                                            />
                                        </Line>
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                            {/* General Ranking Chart */}
                            <div
                                className="rounded-2xl flex flex-col h-fit max-h-52 w-full py-2 mb-0 items-stretch"
                                style={{
                                    background: "#2d3347",
                                    boxShadow: '0 2px 12px #0004',
                                    position: 'relative',
                                    overflow: 'hidden',         // already hides both axes; fine to keep
                                }}
                            >
                                <div
                                    style={{
                                        fontWeight: 700,
                                        fontSize: 15,
                                        color: '#facc15',
                                        textAlign: 'center',
                                        letterSpacing: 0.5,
                                        cursor: 'pointer',
                                        transition: 'color 0.2s ease, text-shadow 0.2s ease',
                                        position: 'relative'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.color = '#fbbf24';
                                        e.target.style.textShadow = '0 2px 12px #000a, 0 0 8px #facc15';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.color = '#facc15';
                                        e.target.style.textShadow = '0 2px 8px #000a, 0 0 4px #222';
                                    }}
                                >
                                    الترتيب العام لوحدات المشروع
                                </div>
                                {/* Modern CSS Bar Chart */}
                                <div
                                    style={{
                                        minHeight: 60,
                                        maxHeight: 300,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'flex-start',   // ✅ start at top
                                        zIndex: 1,
                                        marginTop: 4,
                                        gap: 14,
                                        overflowY: 'auto',
                                        overflowX: 'hidden',            // ✅ prevent x scroll
                                    }}
                                >
                                    {Object.entries(watomsData?.organizations || {})
                                        .sort(([, a], [, b]) => {
                                            if (selectedMonthIdx !== undefined) {
                                                // Safely get performance for this month (fallback to 0 if missing)
                                                const perfA = a.months?.[selectedMonthIdx]?.performance ?? 0;
                                                const perfB = b.months?.[selectedMonthIdx]?.performance ?? 0;
                                                return perfB - perfA; // high → low
                                            } else {
                                                return b.overall - a.overall; // default sort
                                            }
                                        })
                                        .map(([id, c]) => (
                                            <div
                                                key={id}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    marginBottom: 0,
                                                    cursor: 'pointer',
                                                    transition: 'transform 0.2s ease, opacity 0.2s ease',
                                                    borderRadius: 8,
                                                    padding: '4px',
                                                    minWidth: 0,                // ✅ allow children to shrink
                                                    transformOrigin: 'center',  // ✅ scale from center
                                                }}
                                                className="justify-between hover:bg-gray-600 hover:bg-opacity-20"
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
                                                <div className="text-start" style={{
                                                    minWidth: 115,
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
                                                    {c.name}
                                                </div>
                                                {/* Bar background with fixed width */}
                                                <div style={{
                                                    flex: 1,                   // ✅ take remaining space
                                                    minWidth: 0,               // ✅ allow shrink
                                                    height: 22,
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
                                                            width: `${Math.min(100, Math.max(0, roundNumber(watomsData?.organizations[id].months[selectedMonthIdx]?.performance || 0)))}%`,
                                                            background: WATOMS_MODERN_COLORS[id % WATOMS_MODERN_COLORS.length],
                                                            borderRadius: 18,
                                                            transition: 'width 0.7s cubic-bezier(.4,2,.6,1)',
                                                        }}
                                                    />
                                                </div>
                                                {/* Percentage (on the right) */}
                                                <div className="text-white" style={{
                                                    minWidth: 38,
                                                    fontWeight: 900,
                                                    fontSize: 17,
                                                    textAlign: 'left',
                                                    marginLeft: 0,
                                                    marginRight: 0,
                                                    transition: 'color 0.2s ease'
                                                }}>
                                                    {roundNumber(watomsData?.organizations[id].months[selectedMonthIdx]?.performance || 0) !== undefined ? roundNumber(watomsData?.organizations[id].months[selectedMonthIdx]?.performance || 0) : 0}%
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </div>
                    </fieldset>
                    <div className="my-auto w-0 h-64 border-l-4 border-gray-400 rounded-full" />
                    <div className="flex flex-col justify-start items-center pt-8  min-w-1/3 w-1/3 gap-10">
                        <div className="flex flex-col justify-center items-center text-xl font-bold text-[#FBBF24] gap-2">
                            <div className="w-1/4 h-0 border-t-4 border-gray-400 rounded-full" />
                            <div>EVOITS</div>
                            <div>مشروع تطوير مراكز التدريب المهني</div>
                            <div className="w-1/2 h-0 border-t-4 border-gray-400 rounded-full" />
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <DonutChart value={roundNumber(selectedOrg?.months[selectedMonthIdx]?.performance || 0)} size={120} color='url(#circularBlueGradient)' bg='#23263a' textColor='#fff' />
                            <h1 className="text-white">المتوسط العام للمشروع</h1>
                        </div>
                        <div className="flex justify-evenly items-center text-white w-full flex-wrap gap-2">
                            <div className="flex rounded-2xl bg-white text-[#0a183d] justify-between items-center w-52 h-28 cursor-pointer text-5xl gap-2 px-4 opacity-55 hover:opacity-80" onClick={() => navigate('/watoms/dashboard')}>
                                <FontAwesomeIcon icon={faChartSimple} />
                                <div className="my-auto w-0 h-8 border-l-2 border-[#0a183d] rounded-full" />
                                <h1 className="text-base text-end w-[75%] font-bold">صفحة عرض بيانات المشروع</h1>
                            </div>
                            <div className="flex rounded-2xl bg-white text-[#0a183d] justify-between items-center w-52 h-28 cursor-pointer text-5xl gap-2 px-4 opacity-55 hover:opacity-80">
                                <FontAwesomeIcon icon={faPhone} />
                                <div className="my-auto w-0 h-8 border-l-2 border-[#0a183d] rounded-full" />
                                <h1 className="text-base text-end w-[75%] font-bold">الاتصال المباشر بالمراكز</h1>
                            </div>
                            <div className="flex rounded-2xl bg-white text-[#0a183d] justify-between items-center w-52 h-28 cursor-pointer text-5xl gap-2 px-4 opacity-55 hover:opacity-80">
                                <FontAwesomeIcon icon={faBook} />
                                <div className="my-auto w-0 h-8 border-l-2 border-[#0a183d] rounded-full" />
                                <h1 className="text-base text-end w-[75%] font-bold">التقرير السرية الدولية</h1>
                            </div>
                            <div className="flex rounded-2xl bg-white text-[#0a183d] justify-between items-center w-52 h-28 cursor-pointer text-5xl gap-2 px-4 opacity-55 hover:opacity-80">
                                <FontAwesomeIcon icon={faScroll} />
                                <div className="my-auto w-0 h-8 border-l-2 border-[#0a183d] rounded-full" />
                                <h1 className="text-base text-end w-[75%] font-bold">التقارير المصورة ابدا اديو</h1>
                            </div>
                        </div>
                    </div>
                    <div className="my-auto w-0 h-64 border-l-4 border-gray-400 rounded-full" />
                    <fieldset className="my-auto border-2 border-gray-400 p-4 rounded-2xl shadow-white shadow-md min-h-[80vh] h-[80vh] min-w-1/3 w-1/3">
                        <legend className="px-2 text-center font-bold text-white">اهم الاحداث الجارية</legend>
                        {watomsNewsData && watomsNewsData.length > 0 ?
                            <div className="flex flex-col justify-start w-full h-full p-2 gap-2 overflow-y-auto no-scrollbar">
                                {watomsNewsData.map((news, index) => (
                                    <div key={news.id || index} className="relative border-white border-2 rounded-2xl w-full flex gap-2 max-h-20 p-2 justify-between items-center cursor-pointer" onClick={() => navigate('/watoms/publish-news')}>
                                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full"></span>
                                        <img
                                            src={news.image_path ? 
                                                `${process.env.REACT_APP_API_URL || 'http://localhost:4000'}/uploads/${news.image_path.replace(/\\/g, '/')}` : 
                                                img}
                                            alt={news.title || "News image"}
                                            className="h-full w-auto object-contain"
                                        />
                                        <div className="flex flex-col justify-center items-center">
                                            <h1 className="text-white text-md text-center">
                                                {news.title || "عنوان الخبر"}
                                            </h1>
                                            <h1 className="text-gray-400">
                                                {news.date ? new Date(news.date).toLocaleDateString('ar-EG') : "تاريخ غير محدد"}
                                            </h1>
                                        </div>
                                    </div>
                                ))}
                            </div> :
                            <div className="flex justify-center items-center w-full h-full">
                                <h1 className="text-[#FBBF24] font-bold">
                                    لا يوجد احداث حاليا
                                </h1>
                            </div>
                        }
                    </fieldset>
                </div>
            </div>
        </>
    )
}

export default WatomsNews;