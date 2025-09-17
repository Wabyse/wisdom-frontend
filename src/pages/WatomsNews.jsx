import NewNavbar from "../components/NewNavbar";
import { roundNumber } from "../utils/roundNumber";
import { useEffect, useState } from "react";
import { WATOMS_MODERN_COLORS } from "../constants/constants";
import { fetchWatomsDetailsData } from "../services/dashboard";
import LoadingScreen from "../components/LoadingScreen";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts';


const WatomsNews = () => {
    const [selectedOrg, setSelectedOrg] = useState(null);
    const [watomsData, setWatomsData] = useState([]);
    const [selectedMonthIdx, setSelectedMonthIdx] = useState({});
    const [loading, setLoading] = useState(true);

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

        loadWatomsDetailedData();
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
                <div className="flex justify-center items-center px-12 py-8 w-full">
                    <div className="flex flex-col justify-center items-center text-xl font-bold text-[#FBBF24] gap-2">
                        <div className="w-1/4 h-0 border-t-4 border-gray-400 rounded-full" />
                        <div>EVOITS</div>
                        <div>مشروع تطوير مراكز التدريب المهني</div>
                        <div className="w-1/2 h-0 border-t-4 border-gray-400 rounded-full" />
                    </div>
                </div>
                <div className="flex justify-center items-center w-[90%] gap-6">
                    <fieldset className="flex justify-center items-center border-2 border-gray-400 p-4 rounded-2xl shadow-white shadow-md min-h-[60vh] h-[60vh]">
                        <legend className="px-2 text-center font-bold text-white">ملخص اداء المشروع</legend>
                        <div className="flex flex-col items-center justify-center gap-4">
                            {/* Total Institutions */}
                            <div
                                className="h-28"
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
                            <div className="w-full">
                                <div style={{ fontWeight: 700, fontSize: 16, color: '#facc15', textAlign: 'center', letterSpacing: 0.5 }}>
                                    {`تحليل معدل تغيير الاداء ${selectedOrg?.id === "All" ? "للمشروع" : selectedOrg?.name}`}
                                </div>
                                <ResponsiveContainer width="90%" height={100}>
                                    <LineChart data={selectedOrg ? selectedOrg.months : watomsData?.total?.months}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#444" opacity={0.3} />
                                        <XAxis
                                            dataKey="month"
                                            stroke="#888"
                                            fontSize={10}
                                            tick={{ fill: '#fff' }}
                                        />
                                        <YAxis
                                            stroke="#888"
                                            fontSize={12}
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
                                className="rounded-2xl flex flex-col h-fit max-h-48 w-full py-2 mb-0 items-stretch"
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
                                        marginBottom: 18,
                                        color: '#facc15',
                                        textAlign: 'center',
                                        letterSpacing: 0.5,
                                        zIndex: 1,
                                        textShadow: '0 2px 8px #000a, 0 0 4px #222',
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
                    <div className="w-0 h-64 border-l-4 border-gray-400 rounded-full" />
                    <fieldset className=" border-2 border-gray-400 p-4 rounded-2xl shadow-white shadow-md min-h-[60vh] h-[60vh]">
                        <legend className="px-2 text-center font-bold text-white">اهم الاخداث الجارية</legend>
                    </fieldset>
                </div>
            </div>
        </>
    )
}

export default WatomsNews;