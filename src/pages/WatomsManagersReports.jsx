import NewNavbar from "../components/NewNavbar";
import ismailiaManager from "../assets/ismailiaManager.jpg";
import boulaqManager from "../assets/boulaqManager.jpg";
import sharabyaManager from "../assets/sharabyaManager.jpg";
import sharqiaManager from "../assets/sharqiaManager.jpg";
import suezManager from "../assets/suezManager.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faChartSimple, faCheckSquare } from "@fortawesome/free-solid-svg-icons";
import DonutChart from "../components/DonutChart";
import { roundNumber } from "../utils/roundNumber";
import { useEffect, useState } from "react";
import { fetchWatomsDetailsData } from "../services/dashboard";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
import WatomsSingleOrgDashboard from "../components/WatomsSingleOrgDashboard";
import callIcon from '../assets/callIcon.png';
import dashboardIcon from '../assets/DashboardIcon2.png';
import reportIcon from '../assets/ReportIcon2.png';
import secretIcon from '../assets/secretIcon.png';

const WatomsManagersReports = () => {
    const [watomsData, setWatomsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedManagers, setSelectedManagers] = useState(new Set());
    const [hoveredManager, setHoveredManager] = useState(null);
    const [dashboardPopup, setDashboardPopup] = useState(false);
    const [selectedOrg, setSelectedOrg] = useState(null);
    const [orgRank, setOrgRank] = useState();

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

    // Manager images mapping
    const managerImages = {
        4: ismailiaManager,
        5: suezManager,
        7: sharabyaManager,
        8: boulaqManager,
        9: sharqiaManager
    };

    // Organization indices to display
    const organizationIndices = [4, 5, 7, 8, 9];

    // Toggle manager selection
    const toggleManagerSelection = (orgIndex) => {
        setSelectedManagers(prev => {
            const newSet = new Set(prev);
            if (newSet.has(orgIndex)) {
                newSet.delete(orgIndex);
            } else {
                newSet.add(orgIndex);
            }
            return newSet;
        });
    };

    // fetching watoms' dashboard data
    useEffect(() => {
        const loadWatomsDetailedData = async () => {
            try {
                setLoading(true);
                const response = await fetchWatomsDetailsData();
                setWatomsData(response);
            } catch (error) {
                console.error('❌ Error fetching Watoms Data:', error);
            } finally {
                setLoading(false);
            }
        }
        loadWatomsDetailedData();
    }, []);

    // get org's rank due to month
    useEffect(() => {
        if (!watomsData?.organizations || !selectedOrg) return;

        const rankingOrgs = Object.entries(watomsData.organizations)
            .sort(([, a], [, b]) => {
                const perfA = a?.months?.at(-1)?.performance ?? 0;
                const perfB = b?.months?.at(-1)?.performance ?? 0;
                return perfB - perfA; // sort high → low
            });

        const selectedOrgIdx = rankingOrgs.findIndex(
            ([, org]) => org.id === selectedOrg.id
        );

        if (selectedOrgIdx !== -1) {
            setOrgRank(selectedOrgIdx + 1); // rank is 1-based
        }
    }, [selectedOrg, watomsData]);

    return (
        <>
            <NewNavbar
                shareStatus={false}
                dashboardStatus={true}
                callStatus={true}
                searchStatus={false}
                followUpStatus={true}
                ministerStatus={true}
                darkmodeStatus={false}
                fullScreenStatus={false}
            />
            <div className="w-full h-[88vh] bg-[#0a183d] flex flex-col items-center gap-6">
                <div className="my-auto flex justify-center items-start border-2 border-gray-400 p-2 rounded-2xl shadow-white shadow-md min-h-[64vh] h-[74vh] w-[95%]">
                    <div className="flex justify-evenly items-center w-full h-full gap-4">
                        {organizationIndices.map((orgIndex) => (
                            <div key={orgIndex} className="flex flex-col flex-1 gap-2 justify-center items-center max-w-68">
                                <div
                                    className="overflow-hidden flex-1 w-full flex flex-col items-center relative transition-all duration-300 gap-3"
                                >
                                    {/* Selection indicator */}
                                    {selectedManagers.has(orgIndex) && hoveredManager !== orgIndex && (
                                        <div className="absolute top-2 right-2 z-10">
                                            <div className="bg-green-500 rounded-full p-1 w-7 h-7 flex justify-center items-center">
                                                <FontAwesomeIcon icon={faCheckSquare} className="text-white text-sm" />
                                            </div>
                                        </div>
                                    )}
                                    <img src={callIcon} className="absolute top-2 left-2 text-white w-8 cursor-pointer" />
                                    <div
                                        className="flex flex-col items-center p-2 gap-2 w-full rounded-2xl bg-[#2d3347]"
                                    >
                                        {/* manager's photo with hover effect */}
                                        <div
                                            className="relative cursor-pointer"
                                            onMouseEnter={() => setHoveredManager(orgIndex)}
                                            onMouseLeave={() => setHoveredManager(null)}
                                            onClick={() => toggleManagerSelection(orgIndex)}
                                        >
                                            {/* Hover overlay with checkbox */}
                                            {hoveredManager === orgIndex && (
                                                <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center z-10 transition-all duration-300 rounded-full">
                                                    <div className="bg-white rounded-full p-3 shadow-lg w-12 h-12 flex justify-center items-center">
                                                        <FontAwesomeIcon
                                                            icon={faCheckSquare}
                                                            className={`text-2xl ${selectedManagers.has(orgIndex) ? 'text-green-500' : 'text-gray-400'}`}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                            <img
                                                className="rounded-full w-32 h-32 shadow-lg shadow-green-500 mb-2"
                                                src={managerImages[orgIndex]}
                                                alt={`manager ${orgIndex}`}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-evenly w-full items-center gap-2 rounded-2xl bg-[#2d3347]">
                                        {/* vtc's score */}
                                        <DonutChart
                                            value={roundNumber(watomsData?.organizations?.[orgIndex]?.months?.[watomsData?.organizations?.[orgIndex]?.months?.length - 1]?.performance || 0)}
                                            size={60}
                                            color='url(#circularBlueGradient)'
                                            bg='#23263a'
                                            textColor='#fff'
                                        />
                                        {/* manager's detail */}
                                        <div className="text-white text-center">
                                            <h1 className="text-sm font-bold">
                                                {watomsData?.organizations?.[orgIndex]?.managerFirstName} {watomsData?.organizations?.[orgIndex]?.managerMiddleName} {watomsData?.organizations?.[orgIndex]?.managerLastName}
                                            </h1>
                                            <h1 className="text-xs text-gray-300">
                                                {watomsData?.organizations?.[orgIndex]?.name}
                                            </h1>
                                        </div>
                                    </div>
                                    <div className="rounded-2xl bg-[#2d3347] w-full p-2">
                                        <ResponsiveContainer width="100%" height={140}>
                                            <LineChart data={watomsData?.organizations?.[orgIndex]?.months} margin={{ left: -35, right: 15 }}>
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
                                </div>

                                <div className="w-full flex gap-2 rounded-2xl bg-[#2d3347] justify-evenly items-center h-12">
                                    <img className="w-8" src={secretIcon} alt="" />
                                    <div className="w-0 h-5 border-l-2 border-white" />
                                    <img className="w-8 cursor-pointer" src={dashboardIcon} alt="" onClick={() => { setDashboardPopup(true); setSelectedOrg(watomsData?.organizations?.[orgIndex]) }} />
                                    <div className="w-0 h-5 border-l-2 border-white" />
                                    <img className="w-8" src={reportIcon} alt="" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {dashboardPopup && <WatomsSingleOrgDashboard isOpen={dashboardPopup} onClose={() => setDashboardPopup(false)} data={selectedOrg} rank={orgRank} />}
        </>
    )
}

export default WatomsManagersReports;