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
import { updateNewsNotification, viewNews, getNewsImages } from "../services/admins";
import { fetchSchools } from "../services/data";
import dashboardIcon from "../assets/dashboardIcon.png";
import reportIcon from "../assets/reportIcon.png";
import report2Icon from "../assets/report2Icon.png";
import { useAuth } from "../context/AuthContext";
import DenyAccessPage from "../components/DenyAccessPage";

const WatomsNews = () => {
    const navigate = useNavigate();
    const { userInfo } = useAuth();
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
    const [newsImages, setNewsImages] = useState([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
                console.log('📰 News API Response:', response);
                
                // Log each news item's image information to verify uniqueness
                response.forEach(news => {
                    console.log(`📰 News ${news.id} (${news.title?.substring(0, 30)}...):`, {
                        id: news.id,
                        organization_id: news.organization_id,
                        image_path: news.image_path,
                        image_url: news.image_url,
                        unique: true // Each news should have unique image
                    });
                });
                
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
        setSelectedOrganization(organization);
        
        // Fetch all images for this news item
        try {
            const images = await getNewsImages(news.id);
            console.log(`📸 News ${news.id} - Fetched images:`, images);
            console.log(`📸 News ${news.id} - Images count:`, images.length);
            
            // If we have images from the directory, use them
            if (images && images.length > 0) {
                // Ensure all images have proper URLs
                const imagesWithUrls = images.map((img, idx) => {
                    const baseUrl = process.env.REACT_APP_BACKEND_BASE_URL || 'http://localhost:4000';
                    let imageUrl = img.url || img.path;
                    
                    // Clean up the URL path - remove any /uploads/ prefix if present
                    if (imageUrl && typeof imageUrl === 'string') {
                        imageUrl = imageUrl.replace(/^\/?uploads\/news\//, '/news/');
                    }
                    
                    // Ensure URL is complete
                    if (imageUrl && !imageUrl.startsWith('http')) {
                        imageUrl = imageUrl.startsWith('/') ? imageUrl : '/' + imageUrl;
                    }
                    
                    return {
                        ...img,
                        url: imageUrl || img.url || img.path,
                        fullUrl: imageUrl ? (imageUrl.startsWith('http') ? imageUrl : `${baseUrl}${imageUrl}`) : null
                    };
                });
                
                console.log(`📸 News ${news.id} - Processed images with URLs:`, imagesWithUrls);
                setNewsImages(imagesWithUrls);
            } else if (news.image_url || news.image_path) {
                // If no directory images but news has an image, add it as a single image
                const baseUrl = process.env.REACT_APP_BACKEND_BASE_URL || 'http://localhost:4000';
                const imagePath = news.image_url || news.image_path;
                
                // Determine the correct URL path based on the image path
                let imageUrl;
                const cleanPath = imagePath.replace(/\\/g, '/');
                
                if (cleanPath.includes('news/')) {
                    // Remove any "uploads/" prefix if present and ensure it starts with /news/
                    let newsPath = cleanPath.replace(/^\/?uploads\/news\//, 'news/');
                    if (!newsPath.startsWith('/news/') && !newsPath.startsWith('news/')) {
                        // Extract organization ID and filename
                        const match = cleanPath.match(/news\/(\d+\/[^\/]+)/);
                        if (match) {
                            newsPath = `news/${match[1]}`;
                        }
                    }
                    imageUrl = newsPath.startsWith('/') ? newsPath : `/${newsPath}`;
                } else {
                    imageUrl = cleanPath.startsWith('/') ? cleanPath : '/uploads/' + cleanPath;
                }
                
                const singleImage = [{
                    filename: imagePath.split(/[/\\]/).pop() || 'image.jpg',
                    path: imagePath,
                    url: imageUrl,
                    fullUrl: `${baseUrl}${imageUrl}`
                }];
                console.log(`📸 News ${news.id} - Using single news image:`, singleImage);
                setNewsImages(singleImage);
            } else {
                console.log(`⚠️ News ${news.id} - No images found`);
                setNewsImages([]);
            }
            setCurrentImageIndex(0);
        } catch (error) {
            console.error('❌ Error fetching news images:', error);
            // Fallback to single image if available
            if (news.image_url || news.image_path) {
                const baseUrl = process.env.REACT_APP_BACKEND_BASE_URL || 'http://localhost:4000';
                const imagePath = news.image_url || news.image_path;
                
                // Determine the correct URL path based on the image path
                let imageUrl;
                const cleanPath = imagePath.replace(/\\/g, '/');
                
                if (cleanPath.includes('news/')) {
                    // Remove any "uploads/" prefix if present and ensure it starts with /news/
                    let newsPath = cleanPath.replace(/^\/?uploads\/news\//, 'news/');
                    if (!newsPath.startsWith('/news/') && !newsPath.startsWith('news/')) {
                        // Extract organization ID and filename
                        const match = cleanPath.match(/news\/(\d+\/[^\/]+)/);
                        if (match) {
                            newsPath = `news/${match[1]}`;
                        }
                    }
                    imageUrl = newsPath.startsWith('/') ? newsPath : `/${newsPath}`;
                } else {
                    imageUrl = cleanPath.startsWith('/') ? cleanPath : '/uploads/' + cleanPath;
                }
                
                setNewsImages([{
                    filename: imagePath.split(/[/\\]/).pop() || 'image.jpg',
                    path: imagePath,
                    url: imageUrl,
                    fullUrl: `${baseUrl}${imageUrl}`
                }]);
            } else {
                setNewsImages([]);
            }
            setCurrentImageIndex(0);
        }
    };

    const closePopup = () => {
        setIsPopupOpen(false);
        setSelectedNews(null);
        setNewsImages([]);
        setCurrentImageIndex(0);
    };

    const nextImage = (e) => {
        e?.preventDefault();
        e?.stopPropagation();
        if (newsImages.length > 1) {
            setCurrentImageIndex((prev) => {
                const newIndex = (prev + 1) % newsImages.length;
                console.log('➡️ Next image clicked, new index:', newIndex, 'of', newsImages.length);
                return newIndex;
            });
        }
    };

    const prevImage = (e) => {
        e?.preventDefault();
        e?.stopPropagation();
        if (newsImages.length > 1) {
            setCurrentImageIndex((prev) => {
                const newIndex = (prev - 1 + newsImages.length) % newsImages.length;
                console.log('⬅️ Prev image clicked, new index:', newIndex, 'of', newsImages.length);
                return newIndex;
            });
        }
    };

    const goToImage = (index) => {
        if (newsImages.length > 0 && index >= 0 && index < newsImages.length) {
            setCurrentImageIndex(index);
        }
    };

    const getImageUrl = (imagePath, newsId = null) => {
        if (!imagePath) return null;
        const baseUrl = process.env.REACT_APP_BACKEND_BASE_URL || 'http://localhost:4000';
        
        let finalUrl;
        const cleanPath = imagePath.replace(/\\/g, '/');
        
        // Check if path contains "news/" (could be "news/", "/news/", "uploads/news/", or "/uploads/news/")
        if (cleanPath.includes('news/')) {
            // Extract the part after "news/" - e.g., "news/7/file.jpg" -> "7/file.jpg"
            // Or "uploads/news/7/file.jpg" -> "7/file.jpg"
            let newsPath = cleanPath;
            
            // Remove any leading "uploads/" prefix if present
            newsPath = newsPath.replace(/^\/?uploads\/news\//, 'news/');
            // Ensure it starts with "news/"
            if (!newsPath.startsWith('news/')) {
                // Extract organization ID and filename from various formats
                const match = cleanPath.match(/news\/(\d+\/[^\/]+)/);
                if (match) {
                    newsPath = `news/${match[1]}`;
                }
            }
            
            // Construct final URL with /news/ prefix
            if (newsPath.startsWith('/news/')) {
                finalUrl = `${baseUrl}${newsPath}`;
            } else if (newsPath.startsWith('news/')) {
                finalUrl = `${baseUrl}/${newsPath}`;
            } else {
                // Fallback: try to extract from the path
                const orgMatch = cleanPath.match(/(\d+)\/([^\/]+\.(jpg|jpeg|png|gif|webp|bmp))/i);
                if (orgMatch) {
                    finalUrl = `${baseUrl}/news/${orgMatch[1]}/${orgMatch[2]}`;
                } else {
                    finalUrl = `${baseUrl}/news/${newsPath.replace(/^.*?news\//, '')}`;
                }
            }
        } else {
            // Otherwise, use /uploads route
            const uploadPath = cleanPath.startsWith('/') ? cleanPath : '/uploads/' + cleanPath;
            finalUrl = `${baseUrl}${uploadPath}`;
        }
        
        // Add cache-busting query parameter with news ID to ensure unique URLs
        const separator = finalUrl.includes('?') ? '&' : '?';
        const uniqueUrl = `${finalUrl}${separator}v=${newsId || Date.now()}`;
        
        console.log(`🔗 Image URL construction:`, {
            originalPath: imagePath,
            cleanedPath: cleanPath,
            newsId: newsId,
            finalUrl: uniqueUrl
        });
        
        return uniqueUrl;
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
    if (userInfo?.code === 1310) return <DenyAccessPage homePage='/wisdom/dashboard' />;

    return (
        <>
            <NewNavbar
                searchStatus={false}
                darkmodeStatus={false}
                shareStatus={false}
                homeStatus={false}
                logoutStatus={true}
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
                            <div className="flex flex-col gap-2 items-center bg-white bg-opacity-55 rounded-2xl" onClick={() => navigate('/watoms/managers')}>
                                <div className="flex text-black justify-between items-center w-52 h-12 cursor-pointer text-xl gap-2 px-4">
                                    <img src={report2Icon} className="w-6 h-6" />
                                    <div className="my-auto w-0 h-8 border-l-2 border-[#0a183d] rounded-full" />
                                    <h1 className="text-xs text-end w-[75%] font-bold border-b-2 border-[#0a183d] py-5">تقارير المرور والمتابعة</h1>
                                </div>
                                <div className="flex flex-col gap-2 items-center">
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
                                        className="relative border-white border-2 rounded-2xl w-full flex gap-3 max-h-32 h-fit p-3 justify-between items-center cursor-pointer hover:bg-gray-700 hover:bg-opacity-30 transition-all duration-200"
                                        onClick={() => handleNewsClick(news)}
                                    >
                                        {!news?.notification && <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full z-10"></span>}
                                        {news.image_url || news.image_path ? (
                                            <img
                                                src={getImageUrl(news.image_url || news.image_path, news.id)}
                                                alt={`${news.title || 'News'} ${news.id}`}
                                                className="h-24 w-32 object-cover rounded-xl flex-shrink-0 border-2 border-gray-600"
                                                onError={(e) => {
                                                    console.error(`❌ Failed to load image for news ${news.id}:`, {
                                                        id: news.id,
                                                        title: news.title,
                                                        image_url: news.image_url,
                                                        image_path: news.image_path,
                                                        organization_id: news.organization_id,
                                                        attemptedUrl: e.target.src,
                                                        timestamp: new Date().toISOString()
                                                    });
                                                    // Don't set fallback image - hide it instead
                                                    e.target.style.display = 'none';
                                                    const placeholder = e.target.nextElementSibling;
                                                    if (!placeholder || !placeholder.classList.contains('image-placeholder')) {
                                                        const placeholderDiv = document.createElement('div');
                                                        placeholderDiv.className = 'h-24 w-32 flex items-center justify-center bg-gray-700 rounded-xl flex-shrink-0 border-2 border-gray-600 image-placeholder';
                                                        placeholderDiv.innerHTML = `<span class="text-gray-400 text-xs">${news.id}</span>`;
                                                        e.target.parentNode.insertBefore(placeholderDiv, e.target.nextSibling);
                                                    }
                                                }}
                                                key={`news-img-${news.id}-${news.organization_id}-${news.image_path || news.image_url || index}`}
                                                loading="lazy"
                                            />
                                        ) : (
                                            <div className="h-24 w-32 flex items-center justify-center bg-gray-700 rounded-xl flex-shrink-0 border-2 border-gray-600">
                                                <span className="text-gray-400 text-xs">{news.id}</span>
                                            </div>
                                        )}
                                        <div className="flex flex-col justify-center items-center w-full">
                                            <h1 className="text-white text-md text-center font-semibold">
                                                {news.title || "عنوان الخبر"}
                                            </h1>
                                            <h1 className="text-gray-400 text-sm mt-1">
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
                            <div></div>
                        </div>

                        {/* Content */}
                        <div className="p-4 m-2 bg-white rounded-2xl">
                            {/* News Images Slideshow */}
                            {newsImages.length > 0 && (
                                <div className="mb-4 flex flex-col items-center gap-2">
                                    <div className="relative w-full max-w-2xl">
                                        <img
                                            src={(() => {
                                                const baseUrl = process.env.REACT_APP_BACKEND_BASE_URL || 'http://localhost:4000';
                                                const currentImage = newsImages[currentImageIndex];
                                                
                                                if (!currentImage) {
                                                    console.error('❌ No image at index:', currentImageIndex, 'Total images:', newsImages.length);
                                                    return null;
                                                }
                                                
                                                // Prefer fullUrl if available, otherwise construct from url or path
                                                let fullUrl = currentImage.fullUrl;
                                                
                                                if (!fullUrl) {
                                                    const imageUrl = currentImage.url || currentImage.path;
                                                    console.log(`📸 Loading slideshow image ${currentImageIndex + 1}/${newsImages.length}:`, {
                                                        newsId: selectedNews.id,
                                                        imageUrl,
                                                        currentImage,
                                                        filename: currentImage.filename
                                                    });
                                                    
                                                    if (imageUrl) {
                                                        // Remove any /uploads/ prefix if present
                                                        if (typeof imageUrl === 'string') {
                                                            imageUrl = imageUrl.replace(/^\/?uploads\/news\//, '/news/');
                                                        }
                                                        
                                                        // Construct full URL
                                                        if (imageUrl.startsWith('http')) {
                                                            fullUrl = imageUrl;
                                                        } else {
                                                            const cleanUrl = imageUrl.startsWith('/') ? imageUrl : '/' + imageUrl;
                                                            fullUrl = `${baseUrl}${cleanUrl}`;
                                                        }
                                                    }
                                                } else {
                                                    console.log(`📸 Using pre-constructed fullUrl for image ${currentImageIndex + 1}/${newsImages.length}`);
                                                }
                                                
                                                if (fullUrl) {
                                                    // Add cache-busting with news ID and image index
                                                    const separator = fullUrl.includes('?') ? '&' : '?';
                                                    const finalUrl = `${fullUrl}${separator}v=${selectedNews.id}-${currentImageIndex}-${Date.now()}`;
                                                    console.log(`📸 Final slideshow image URL for news ${selectedNews.id}:`, finalUrl);
                                                    return finalUrl;
                                                }
                                                
                                                // Fallback to news image if available
                                                if (selectedNews.image_url || selectedNews.image_path) {
                                                    const fallbackUrl = getImageUrl(selectedNews.image_url || selectedNews.image_path, selectedNews.id);
                                                    console.log(`📸 Using fallback news image URL:`, fallbackUrl);
                                                    return fallbackUrl;
                                                }
                                                
                                                console.error(`❌ No image URL available for slideshow at index ${currentImageIndex}`);
                                                return null;
                                            })()}
                                            alt={`${selectedNews.title || "News"} - Image ${currentImageIndex + 1}`}
                                            className="w-full h-64 object-cover rounded-xl border-2 border-black"
                                            onError={(e) => {
                                                console.error(`❌ Slideshow image failed to load:`, {
                                                    newsId: selectedNews.id,
                                                    imageIndex: currentImageIndex,
                                                    attemptedUrl: e.target.src,
                                                    newsImages: newsImages,
                                                    currentImage: newsImages[currentImageIndex]
                                                });
                                                // Don't use fallback image - hide it and show placeholder
                                                e.target.style.display = 'none';
                                                if (!e.target.nextElementSibling || !e.target.nextElementSibling.classList.contains('image-error-placeholder')) {
                                                    const placeholder = document.createElement('div');
                                                    placeholder.className = 'w-full h-64 flex items-center justify-center bg-gray-200 rounded-xl border-2 border-gray-400 image-error-placeholder';
                                                    placeholder.innerHTML = `<span class="text-gray-500">فشل تحميل الصورة ${currentImageIndex + 1}</span>`;
                                                    e.target.parentNode.insertBefore(placeholder, e.target.nextSibling);
                                                }
                                            }}
                                            onLoad={() => {
                                                console.log(`✅ Slideshow image ${currentImageIndex + 1} loaded successfully`);
                                            }}
                                        />
                                    </div>
                                    {/* Slideshow Navigation Arrows Below Image */}
                                    {newsImages.length > 0 && (
                                        <div className="flex justify-center items-center gap-4 mt-3" style={{ position: 'relative', zIndex: 10 }}>
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    prevImage(e);
                                                }}
                                                disabled={newsImages.length <= 1}
                                                style={{
                                                    background: newsImages.length > 1 ? '#181f2e' : '#4b5563',
                                                    color: '#facc15',
                                                    border: '2px solid #facc15',
                                                    borderRadius: '50%',
                                                    width: 40,
                                                    height: 40,
                                                    fontSize: 20,
                                                    fontWeight: 900,
                                                    cursor: newsImages.length > 1 ? 'pointer' : 'not-allowed',
                                                    boxShadow: newsImages.length > 1 ? '0 2px 8px rgba(250, 204, 21, 0.3)' : 'none',
                                                    transition: 'all 0.3s ease',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    opacity: newsImages.length > 1 ? 1 : 0.5,
                                                    pointerEvents: newsImages.length > 1 ? 'auto' : 'none',
                                                    position: 'relative',
                                                    zIndex: 10
                                                }}
                                                onMouseEnter={(e) => {
                                                    if (newsImages.length > 1 && !e.target.disabled) {
                                                        e.target.style.background = '#facc15';
                                                        e.target.style.color = '#181f2e';
                                                        e.target.style.transform = 'scale(1.1)';
                                                    }
                                                }}
                                                onMouseLeave={(e) => {
                                                    if (newsImages.length > 1 && !e.target.disabled) {
                                                        e.target.style.background = '#181f2e';
                                                        e.target.style.color = '#facc15';
                                                        e.target.style.transform = 'scale(1)';
                                                    }
                                                }}
                                                title="الصورة السابقة"
                                            >
                                                &#8592;
                                            </button>
                                            {newsImages.length > 1 && (
                                                <div className="text-gray-700 font-semibold text-sm px-3 py-1 bg-gray-100 rounded-full">
                                                    {currentImageIndex + 1} / {newsImages.length}
                                                </div>
                                            )}
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    nextImage(e);
                                                }}
                                                disabled={newsImages.length <= 1}
                                                style={{
                                                    background: newsImages.length > 1 ? '#181f2e' : '#4b5563',
                                                    color: '#facc15',
                                                    border: '2px solid #facc15',
                                                    borderRadius: '50%',
                                                    width: 40,
                                                    height: 40,
                                                    fontSize: 20,
                                                    fontWeight: 900,
                                                    cursor: newsImages.length > 1 ? 'pointer' : 'not-allowed',
                                                    boxShadow: newsImages.length > 1 ? '0 2px 8px rgba(250, 204, 21, 0.3)' : 'none',
                                                    transition: 'all 0.3s ease',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    opacity: newsImages.length > 1 ? 1 : 0.5,
                                                    pointerEvents: newsImages.length > 1 ? 'auto' : 'none',
                                                    position: 'relative',
                                                    zIndex: 10
                                                }}
                                                onMouseEnter={(e) => {
                                                    if (newsImages.length > 1 && !e.target.disabled) {
                                                        e.target.style.background = '#facc15';
                                                        e.target.style.color = '#181f2e';
                                                        e.target.style.transform = 'scale(1.1)';
                                                    }
                                                }}
                                                onMouseLeave={(e) => {
                                                    if (newsImages.length > 1 && !e.target.disabled) {
                                                        e.target.style.background = '#181f2e';
                                                        e.target.style.color = '#facc15';
                                                        e.target.style.transform = 'scale(1)';
                                                    }
                                                }}
                                                title="الصورة التالية"
                                            >
                                                &#8594;
                                            </button>
                                        </div>
                                    )}
                                    {newsImages.length === 0 && (
                                        <div className="text-gray-500 text-sm mt-2 text-center" style={{ minHeight: '24px' }}>
                                            لا توجد صور متاحة
                                        </div>
                                    )}
                                </div>
                            )}
                            
                            {/* Show single image if no slideshow images but news has image */}
                            {newsImages.length === 0 && (selectedNews.image_url || selectedNews.image_path) && (
                                <div className="mb-4 flex justify-center items-center">
                                    <img
                                        src={getImageUrl(selectedNews.image_url || selectedNews.image_path, selectedNews.id)}
                                        alt={`${selectedNews.title || "News"} ${selectedNews.id}`}
                                        className="w-full max-w-2xl h-64 object-cover rounded-xl border-2 border-black"
                                        onError={(e) => {
                                            console.error(`❌ Single news image failed to load:`, {
                                                newsId: selectedNews.id,
                                                image_url: selectedNews.image_url,
                                                image_path: selectedNews.image_path,
                                                attemptedUrl: e.target.src
                                            });
                                            // Don't use fallback - show placeholder
                                            e.target.style.display = 'none';
                                            if (!e.target.nextElementSibling || !e.target.nextElementSibling.classList.contains('image-error-placeholder')) {
                                                const placeholder = document.createElement('div');
                                                placeholder.className = 'w-full h-64 flex items-center justify-center bg-gray-200 rounded-xl border-2 border-gray-400 image-error-placeholder';
                                                placeholder.innerHTML = `<span class="text-gray-500">فشل تحميل الصورة</span>`;
                                                e.target.parentNode.insertBefore(placeholder, e.target.nextSibling);
                                            }
                                        }}
                                        onLoad={() => {
                                            console.log(`✅ News image loaded successfully for news ${selectedNews.id}`);
                                        }}
                                    />
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