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
import { faBook, faPhone, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { updateNewsNotification, viewNews } from "../services/admins";
import { fetchSchools } from "../services/data";
import dashboardIcon from "../assets/dashboardIcon.png";
import reportIcon from "../assets/reportIcon.png";
import report2Icon from "../assets/report2Icon.png";

const WatomsNews = () => {
    const navigate = useNavigate();
    const [selectedOrg, setSelectedOrg] = useState(null);
    const [watomsData, setWatomsData] = useState([]);
    const [selectedMonthIdx, setSelectedMonthIdx] = useState(null);
    const [loading, setLoading] = useState(true);
    const [watomsNewsData, setWatomsNewsData] = useState([]);
    const [selectedNews, setSelectedNews] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [organizationsData, setOrganizationsData] = useState([]);
    const [selectedOrganization, setSelectedOrganization] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState({});
    const [datasMonths, setDatasMonths] = useState([]);

    const toggleMonth = (status) => {
        if (status) {
            if (selectedMonthIdx !== datasMonths.length - 1) {
                setSelectedMonth(datasMonths[selectedMonthIdx + 1]);
                setSelectedMonthIdx(prev => prev + 1);
            }
        } else {
            if (selectedMonthIdx !== 0) {
                setSelectedMonth(datasMonths[selectedMonthIdx - 1]);
                setSelectedMonthIdx(prev => prev - 1);
            }
        }
    }

    // fetching watoms' dashboard data
    useEffect(() => {
        const loadWatomsDetailedData = async () => {
            try {
                setLoading(true);
                const response = await fetchWatomsDetailsData();
                setWatomsData(response);
                setDatasMonths(response.total.months);
                setSelectedMonth(response.total.months[response.total.months.length - 1])
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
                    full_image_url: news.image_path ? (() => {
                        const baseUrl = process.env.REACT_APP_BACKEND_BASE_URL || 'http://localhost:4000';
                        const imagePath = news.image_path.startsWith('/') ? news.image_path : '/uploads/' + news.image_path.replace(/\\/g, '/');
                        return `${baseUrl}${imagePath}`;
                    })() : 'No image path',
                    base_url: process.env.REACT_APP_BACKEND_BASE_URL || 'http://localhost:4000'
                })));
                setWatomsNewsData(response);
            } catch (error) {
                console.error('❌ Error fetching Watoms Data:', error);
            } finally {
                setLoading(false);
            }
        }

        const loadOrganizationsData = async () => {
            try {
                setLoading(true);
                const response = await fetchSchools();
                setOrganizationsData(response);
            } catch (error) {
                console.error('❌ Error fetching Organizations Data:', error);
            } finally {
                setLoading(false);
            }
        }

        loadOrganizationsData();
        loadWatomsDetailedData();
        loadWatomsNewsData();
    }, []);

    const handleNewsClick = async (news) => {
        const body = { "notification": true };
        await updateNewsNotification(news.id, body);
        setSelectedNews(news);
        setIsPopupOpen(true);
        const organization = organizationsData.find(org => org.id === news.organization_id);
        setSelectedOrganization(organization)
    };

    const closePopup = () => {
        setIsPopupOpen(false);
        setSelectedNews(null);
    };

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
            <NewNavbar
                searchStatus={false}
                darkmodeStatus={false}
                shareStatus={false}
                ministerStatus={true}
            />
            <div className="w-full h-[88vh] flex flex-col items-center bg-[#0a183d]">
                <div className="flex justify-center w-[95%] h-full gap-6">
                    <fieldset className="my-auto flex justify-center items-center border-2 border-gray-400 p-2 rounded-2xl shadow-white shadow-md min-h-[80vh] h-[80vh] min-w-1/3 w-1/3">
                        <legend className="px-2 text-center font-bold text-white">ملخص بيانات المشروع</legend>
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
                                className="rounded-2xl flex flex-col h-fit max-h-54 w-full py-2 mb-0 items-stretch"
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
                                        marginTop: 9,
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
                                                    minWidth: 0,                // ✅ allow children to shrink
                                                    transformOrigin: 'center',  // ✅ scale from center
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
                                                            width: `${Math.min(100, Math.max(0, roundNumber(watomsData?.organizations[id].months[selectedMonthIdx]?.performance || 0)))}%`,
                                                            background: WATOMS_MODERN_COLORS[id % WATOMS_MODERN_COLORS.length],
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
                                                    {roundNumber(watomsData?.organizations[id].months[selectedMonthIdx]?.performance || 0) !== undefined ? roundNumber(watomsData?.organizations[id].months[selectedMonthIdx]?.performance || 0) : 0}%
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </div>
                    </fieldset>
                    <div className="my-auto w-0 h-64 border-l-4 border-gray-400 rounded-full" />
                    <div className="flex flex-col justify-start items-center pt-4 min-w-1/3 w-1/3 gap-16">
                        <div className="flex flex-col justify-center items-center text-xl font-bold text-[#FBBF24] gap-2">
                            <div>EVOITS</div>
                            <div>مشروع تطوير مراكز التدريب المهني</div>
                        </div>
                        <div className="flex flex-col items-center gap-2">

                            <div className="mt-2" style={{
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
                                        width: 36,
                                        height: 36,
                                        fontSize: 22,
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
                                        width: 36,
                                        height: 36,
                                        fontSize: 22,
                                        fontWeight: 900,
                                        display: "hidden",
                                    }}></div>}
                                <span style={{ color: '#fff', fontWeight: 700, fontSize: 15, minWidth: 80, textAlign: 'center', letterSpacing: 1 }}>
                                    {selectedMonth?.month}
                                </span>
                                {selectedMonthIdx !== (datasMonths.length - 1) ? <button
                                    onClick={() => toggleMonth(true)}
                                    style={{
                                        background: '#181f2e',
                                        color: '#0af',
                                        border: 'none',
                                        borderRadius: '50%',
                                        width: 36,
                                        height: 36,
                                        fontSize: 22,
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
                                        width: 36,
                                        height: 36,
                                        fontSize: 22,
                                        fontWeight: 900,
                                        display: "hidden",
                                    }}></div>}
                            </div>
                            <DonutChart value={roundNumber(selectedOrg?.months[selectedMonthIdx]?.performance || 0)} size={120} color='url(#circularBlueGradient)' bg='#23263a' textColor='#fff' />
                            <h1 className="text-white">المتوسط العام للمشروع</h1>
                        </div>
                        <div className="flex justify-evenly items-center text-white w-full gap-2">
                            <div className="flex flex-col">
                                <div className="flex pb-4 flex-col rounded-2xl bg-opacity-55 bg-white text-[#0a183d] items-center w-52 h-40 cursor-pointer text-5xl gap-2 px-4" onClick={() => navigate('/watoms/dashboard')}>
                                    <img src={dashboardIcon} className="w-20 h-20" />
                                    <h1 className="text-base text-center w-[75%] font-bold">الؤشرات الرئيسية للاداء اللحظي</h1>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 items-center">
                                <div className="flex text-black justify-between items-center w-52 h-12 cursor-pointer text-xl gap-2 px-4 bg-opacity-55 bg-white rounded-2xl " onClick={() => navigate('/watoms/follow-up')}>
                                    <img src={report2Icon} className="w-6 h-6" />
                                    <div className="my-auto w-0 h-8 border-l-2 border-[#0a183d] rounded-full" />
                                    <h1 className="text-xs text-end w-[75%] font-bold border-b-2 border-[#0a183d] py-5">تقارير المرور والمتابعة</h1>
                                </div>
                                <div className="flex flex-col gap-2 bg-opacity-55 items-center bg-white rounded-2xl" onClick={() => navigate('/watoms/managers')}>
                                    <div className="flex text-black justify-between items-center w-52 h-12 cursor-pointer text-xl gap-2 px-4">
                                        <FontAwesomeIcon icon={faBook} className="text-2xl" />
                                        <div className="my-auto w-0 h-8 border-l-2 border-[#0a183d] rounded-full" />
                                        <h1 className="text-xs text-end w-[75%] font-bold border-b-2 border-[#0a183d] py-5">التقرير السرية الدورية</h1>
                                    </div>

                                    <div className="flex text-black justify-between items-center w-52 h-12 cursor-pointer text-xl gap-2 px-4">
                                        <FontAwesomeIcon icon={faPhone} />
                                        <div className="my-auto w-0 h-8 border-l-2 border-[#0a183d] rounded-full" />
                                        <h1 className="text-xs text-end w-[75%] font-bold">الاتصال المباشر بالمراكز</h1>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="my-auto w-0 h-64 border-l-4 border-gray-400 rounded-full" />
                    <fieldset className="relative my-auto border-2 border-gray-400 p-4 rounded-2xl shadow-white shadow-md min-h-[80vh] h-[80vh] min-w-1/3 w-1/3">
                        <legend className="px-2 text-center font-bold text-white">اهم الاحداث الجارية</legend>
                        <h1 className="absolute text-white -top-6 -right-4 w-7 h-7 text-lg bg-red-600 flex justify-center items-center font-bold text-center rounded-full">{watomsNewsData?.filter(news => news.notification === false).length}</h1>
                        {watomsNewsData && watomsNewsData.length > 0 ?
                            <div className="flex flex-col justify-start w-full h-full p-2 gap-2 overflow-y-auto no-scrollbar">
                                {watomsNewsData.map((news, index) => (
                                    <div
                                        key={news.id || index}
                                        className="relative border-white border-2 rounded-2xl w-full flex gap-2 max-h-20 p-2 justify-between items-center cursor-pointer hover:bg-gray-700 hover:bg-opacity-30 transition-all duration-200"
                                        onClick={() => handleNewsClick(news)}
                                    >
                                        {!news?.notification && <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full"></span>}
                                        <img
                                            src={(() => {
                                                if (!news.image_path) return img;

                                                const baseUrl = process.env.REACT_APP_BACKEND_BASE_URL || 'http://localhost:4000';
                                                const imagePath = news.image_path.startsWith('/') ? news.image_path : '/uploads/' + news.image_path.replace(/\\/g, '/');
                                                const fullUrl = `${baseUrl}${imagePath}`;

                                                console.log('🔍 Image Debug:', {
                                                    baseUrl,
                                                    imagePath,
                                                    fullUrl,
                                                    originalPath: news.image_path,
                                                    newsId: news.id,
                                                    newsTitle: news.title,
                                                    hasImagePath: !!news.image_path,
                                                    imagePathType: typeof news.image_path
                                                });

                                                return fullUrl;
                                            })()}
                                            alt={news.title || "News image"}
                                            className="h-full w-auto object-contain rounded-xl"
                                            onError={(e) => {
                                                console.error('❌ Image failed to load:', {
                                                    failedUrl: e.target.src,
                                                    newsId: news.id,
                                                    newsTitle: news.title,
                                                    originalImagePath: news.image_path,
                                                    fallbackImage: img,
                                                    timestamp: new Date().toISOString()
                                                });

                                                // Test URL accessibility
                                                fetch(e.target.src, { method: 'HEAD' })
                                                    .then(response => {
                                                        console.log('🔍 URL Test Result:', {
                                                            url: e.target.src,
                                                            status: response.status,
                                                            statusText: response.statusText,
                                                            headers: Object.fromEntries(response.headers.entries()),
                                                            timestamp: new Date().toISOString()
                                                        });
                                                    })
                                                    .catch(error => {
                                                        console.log('🔍 URL Test Error:', {
                                                            url: e.target.src,
                                                            error: error.message,
                                                            timestamp: new Date().toISOString()
                                                        });
                                                    });

                                                e.target.src = img;
                                            }}
                                            onLoad={() => {
                                                console.log('✅ Image loaded successfully:', {
                                                    src: news.image_path,
                                                    newsId: news.id,
                                                    newsTitle: news.title,
                                                    timestamp: new Date().toISOString()
                                                });
                                            }}
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
                </div >
            </div >

            {/* News Details Popup Modal */}
            {isPopupOpen && selectedNews && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-[#1a1a2e] border-2 border-[#facc15] rounded-2xl shadow-2xl max-w-2xl w-full max-h-[95vh] overflow-y-auto no-scrollbar">
                        {/* Header */}
                        <div className="flex justify-between items-center p-4 border-b border-[#facc15]">
                            <button
                                onClick={closePopup}
                                className="text-white hover:text-[#facc15] transition-colors duration-200"
                            >
                                <FontAwesomeIcon icon={faTimes} size="lg" />
                            </button>
                            <div className="flex gap-3 justify-center items-center">
                                <h1 className="text-white">{selectedNews.date ? new Date(selectedNews.date).toLocaleDateString('ar-EG', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                }) : "غير محدد"}</h1>
                                <div className="w-0 h-6 border-l-2 border-white" />
                                <h2 className="text-[#facc15] text-xl font-bold">التفاصيل - {selectedOrganization?.name || "غير محدد"}</h2>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-4 m-2 bg-white rounded-2xl">
                            {/* News Image */}
                            {selectedNews.image_path && (
                                <div className="mb-4 flex justify-center items-center gap-2">
                                    <button
                                        style={{
                                            background: '#181f2e',
                                            color: '#0af',
                                            border: 'none',
                                            borderRadius: '50%',
                                            width: 36,
                                            height: 36,
                                            fontSize: 22,
                                            fontWeight: 900,
                                            cursor: 'pointer',
                                            boxShadow: '0 2px 8px #0006',
                                            transition: 'background 0.2s',
                                        }}
                                        title="الصورة السابقة"
                                    >
                                        &#8592;
                                    </button>
                                    <img
                                        src={(() => {
                                            const baseUrl = process.env.REACT_APP_BACKEND_BASE_URL || 'http://localhost:4000';
                                            const imagePath = selectedNews.image_path.startsWith('/') ? selectedNews.image_path : '/uploads/' + selectedNews.image_path.replace(/\\/g, '/');
                                            const fullUrl = `${baseUrl}${imagePath}`;

                                            console.log('🔍 Popup Image Debug:', {
                                                baseUrl,
                                                imagePath,
                                                fullUrl,
                                                originalPath: selectedNews.image_path
                                            });

                                            return fullUrl;
                                        })()}
                                        alt={selectedNews.title || "News image"}
                                        className="w-[85%] h-64 object-cover rounded-xl border-2 border-black"
                                        onError={(e) => {
                                            console.error('❌ Popup Image failed to load:', {
                                                failedUrl: e.target.src,
                                                newsId: selectedNews.id,
                                                newsTitle: selectedNews.title,
                                                originalImagePath: selectedNews.image_path,
                                                fallbackImage: img
                                            });
                                            e.target.src = img;
                                        }}
                                    />
                                    <button
                                        style={{
                                            background: '#181f2e',
                                            color: '#0af',
                                            border: 'none',
                                            borderRadius: '50%',
                                            width: 36,
                                            height: 36,
                                            fontSize: 22,
                                            fontWeight: 900,
                                            cursor: 'pointer',
                                            boxShadow: '0 2px 8px #0006',
                                            transition: 'background 0.2s',
                                        }}
                                        title="الصورة التالي"
                                    >
                                        &#8594;
                                    </button>
                                </div>
                            )}

                            {/* News Details */}
                            <div className="space-y-4">

                                {/* Title */}
                                <div className="p-2">
                                    <h3 className="text-black font-bold text-lg mb-2 text-end">:العنوان</h3>
                                    <p className="text-blue-950 text-right">{selectedNews.title || "غير محدد"}</p>
                                </div>

                                {/* Description */}
                                {selectedNews.description && (
                                    <div className="p-2 min-h-fit">
                                        <h3 className="text-black font-bold text-lg mb-2 text-end">:التفاصيل</h3>
                                        <p className="text-blue-950 text-right leading-relaxed whitespace-pre-wrap break-words">{selectedNews.description}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default WatomsNews;