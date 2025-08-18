import React, { useEffect, useState } from "react";
import { fetchCenters, fetchCenterEvaluationBreakdown, fetchAnnualPerformanceData, fetchProjectUnitsRanking } from "../services/dashboard";
import { ReactComponent as EgyptMap } from '../assets/Egypt_location_map.svg';
import { BarChart, Bar, XAxis, YAxis, Tooltip as ReTooltip, ResponsiveContainer, LabelList, CartesianGrid } from "recharts";
import ReactModal from 'react-modal';
import wabysLogo from "../assets/wabys.png";
import { useNavigate } from "react-router-dom";
import AnnualPerformanceChart from "../components/AnnualPerformanceChart";
import ProjectUnitsRankingModal from '../components/ProjectUnitsRankingModal';
import watomsLogo from '../assets/watoms3.png';
import fullScreen from '../utils/fullScreen';
import useFullScreen from "../hooks/useFullScreen";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExpand, faCompress, faUser } from "@fortawesome/free-solid-svg-icons";
import { useLanguage } from "../context/LanguageContext";
import { userFullName } from "../utils/userFullName";
import { useAuth } from "../context/AuthContext";

const egyptCenter = [26.8206, 30.8025]; // Egypt center

const parseLatLng = (locationStr) => {
  if (!locationStr) return egyptCenter;
  const [lat, lng] = locationStr.split(',').map(Number);
  return [lat, lng];
};

const renderSectionChart = (title, data) => (
  <div style={{ margin: "2rem 0" }}>
    <h3 style={{ textAlign: "center", color: "#222" }}>{title}</h3>
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data}>
        <XAxis dataKey="label" />
        <YAxis />
        <ReTooltip formatter={v => (v * 100).toFixed(0) + '%'} />
        <Bar dataKey="value" fill="#8884d8">
          <LabelList dataKey="value" position="top" formatter={v => (v * 100).toFixed(0) + '%'} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </div>
);

// Helper to group centers by location
const groupCentersByLocation = (centers) => {
  const map = {};
  centers.forEach((c) => {
    const key = c.location;
    if (!map[key]) map[key] = [];
    map[key].push(c);
  });
  return map;
};

const svgAspect = 1054.979 / 972.996; // ≈ 1.084
const mapWidth = 440;
const mapHeight = mapWidth / svgAspect; // ≈ 240

// Add this function to convert lat/lng to SVG coordinates
function latLngToSvgXY(lat, lng) {
  // SVG viewBox: x=106.544, y=-188.858, width=1054.979, height=972.996
  // Egypt's approximate bounds: lat 22-32, lng 25-36
  const svgMinX = 106.544, svgMinY = -188.858, svgWidth = 1054.979, svgHeight = 972.996;
  const minLat = 22, maxLat = 32, minLng = 25, maxLng = 36;
  const x = svgMinX + ((lng - minLng) / (maxLng - minLng)) * svgWidth;
  const y = svgMinY + ((maxLat - lat) / (maxLat - minLat)) * svgHeight;
  return { x, y };
}

// Detailed breakdown data for each main category
const CATEGORY_DETAILS = {
  ODBM: [
    { label: 'Trainee attendance', weight: 40, key: 'traineeAttendance' },
    { label: 'Trainee commitment', weight: 20, key: 'traineeCommitment' },
    { label: 'Trainer courses', weight: 40, key: 'trainerCourses' },
  ],
  APBM: [
    { label: 'Project', weight: 60, key: 'project' },
    { label: 'Formative', weight: 30, key: 'formative' },
    { label: 'Trainee commitment', weight: 10, key: 'traineeCommitment' },
  ],
  TQBM: [
    { label: 'Training regularity', weight: 25, key: 'trainingRegularity' },
    { label: 'Training programs', weight: 25, key: 'trainingPrograms' },
    { label: 'Trainer', weight: 25, key: 'trainer' },
    { label: 'Digitization and data storage', weight: 15, key: 'digitization' },
    { label: 'Quality and development', weight: 10, key: 'quality' },
  ],
  Community: [
    { label: 'Community participation', weight: 100, key: 'COMMUNITY' },
  ],
  Institutional: [
    { label: 'Institutional performance', weight: 100, key: 'INSTITUTIONAL' },
  ],
};

const HEADER_HEIGHT = 64;

// Add this style for the flashing warning dot
const warningDotStyle = {
  display: 'inline-block',
  marginLeft: 6,
  width: 12,
  height: 12,
  borderRadius: '50%',
  background: 'radial-gradient(circle, #f00 60%, #a00 100%)',
  boxShadow: '0 0 8px 2px #f008',
  animation: 'flashDot 1s infinite',
  verticalAlign: 'middle',
};

// Add keyframes for the animation
const styleSheet = document.createElement('style');
styleSheet.innerText = `@keyframes flashDot { 0% { opacity: 1; } 50% { opacity: 0.2; } 100% { opacity: 1; } }`;
document.head.appendChild(styleSheet);

// Custom label for chart values with warning below number
const ChartValueLabel = (props) => {
  const { x, y, value } = props;
  return (
    <g transform={`translate(${x},${y - 8})`}>
      <text x={0} y={0} textAnchor="middle" fontSize="15" fontWeight="900" fill="#fff" style={{ paintOrder: 'stroke', stroke: '#222c', strokeWidth: 2 }}>{value}%</text>
      {value < 50 && (
        <g transform="translate(0, 12)">
          <circle r="7" fill="url(#warnGradient)" style={{ filter: 'drop-shadow(0 0 6px #f008)' }} />
          <text x={0} y={4} textAnchor="middle" fontSize="13" fontWeight="bold" fill="#fff">!</text>
        </g>
      )}
    </g>
  );
};

// Custom bar shape for warning highlight
const WarningBarShape = (props) => {
  const { x, y, width, height, fill, value } = props;
  const isWarning = value < 50;
  return (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      fill={fill}
      stroke={isWarning ? '#FFD600' : 'none'}
      strokeWidth={isWarning ? 4 : 0}
      rx={6}
      style={isWarning ? { filter: 'drop-shadow(0 0 8px #FFD600)' } : {}}
    />
  );
};

// Color palette and gradients for bars and bubbles
const rankingColors = [
  {
    solid: '#00bfff',
    gradient: 'url(#blueBarGradient)',
    bubble: '#00bfff',
  },
  {
    solid: '#ff5ebc',
    gradient: 'url(#pinkBarGradient)',
    bubble: '#ff5ebc',
  },
  {
    solid: '#ffa600',
    gradient: 'url(#orangeBarGradient)',
    bubble: '#ffa600',
  },
  {
    solid: '#bdbdbd',
    gradient: 'url(#grayBarGradient)',
    bubble: '#bdbdbd',
  },
];

// Custom pill-shaped bar with gradient fill
const PillBar = (props) => {
  const { x, y, width, height, fill, payload, index } = props;
  const colorIdx = index % rankingColors.length;
  return (
    <g>
      {/* Bar background */}
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={height / 2}
        fill="#23242a"
        style={{ filter: 'drop-shadow(0 2px 8px #0005)' }}
      />
      {/* Bar fill (gradient) */}
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={height / 2}
        fill={rankingColors[colorIdx].gradient}
        style={{ filter: 'drop-shadow(0 2px 8px #0003)' }}
        clipPath={`url(#clipBar${index})`}
      />
      {/* ClipPath for rounded fill */}
      <clipPath id={`clipBar${index}`}><rect x={x} y={y} width={width} height={height} rx={height / 2} /></clipPath>
    </g>
  );
};

// Custom label: percentage in a colored bubble at the end of the bar
const PercentBubble = (props) => {
  const { x, y, width, height, value, index } = props;
  const colorIdx = index % rankingColors.length;
  return (
    <g>
      <circle
        cx={x + width + height / 2 + 4}
        cy={y + height / 2}
        r={height / 2 + 4}
        fill={rankingColors[colorIdx].bubble}
        style={{ filter: 'drop-shadow(0 2px 8px #0007)' }}
      />
      <text
        x={x + width + height / 2 + 4}
        y={y + height / 2 + 4}
        textAnchor="middle"
        fontWeight="bold"
        fontSize={14}
        fill="#fff"
        style={{ textShadow: '0 1px 4px #222, 0 0 2px #000' }}
      >
        {value}%
      </text>
    </g>
  );
};

// Modern CSS bar colors (gradients)
const modernBarGradients = [
  'linear-gradient(90deg, #3fd8ff 0%, #0072ff 100%)',
  'linear-gradient(90deg, #ffb6ec 0%, #ff3c8e 100%)',
  'linear-gradient(90deg, #ffb347 0%, #ff7c00 100%)',
  'linear-gradient(90deg, #bdbdbd 0%, #757575 100%)',
];

// Circular progress bar for evaluation percentage
function CircularProgressBar({ value, size = 64, stroke = 8, color = 'url(#circularBlueGradient)', bg = '#444652', textColor = '#fff' }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - value / 100);
  return (
    <svg width={size} height={size} style={{ display: 'block', zIndex: 2, position: 'relative' }}>
      <defs>
        <linearGradient id="circularBlueGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3fd8ff" />
          <stop offset="100%" stopColor="#0072ff" />
        </linearGradient>
      </defs>
      {/* خلفية الدائرة */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={bg}
        strokeWidth={stroke}
        fill="none"
      />
      {/* دائرة النسبة */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={color}
        strokeWidth={stroke}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.7s cubic-bezier(.4,2,.6,1)' }}
      />
      {/* النسبة في المنتصف */}
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy="0.35em"
        fontSize={size * 0.32}
        fontWeight="bold"
        fill={textColor}
        style={{ textShadow: '0 1px 4px #222' }}
      >
        {Math.round(value)}%
      </text>
    </svg>
  );
}

const WatomsDashboard = () => {
  const { userInfo } = useAuth();
  const navigate = useNavigate();
  const [centers, setCenters] = useState([]);
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [evaluation, setEvaluation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hoveredCenterId, setHoveredCenterId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [overallModalOpen, setOverallModalOpen] = useState(false);
  const [allBreakdowns, setAllBreakdowns] = useState([]);
  const [breakdownsLoading, setBreakdownsLoading] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [annualPerformanceData, setAnnualPerformanceData] = useState([]);
  const [annualDataLoading, setAnnualDataLoading] = useState(false);
  const [projectUnitsRanking, setProjectUnitsRanking] = useState(null);
  const [projectUnitsRankingLoading, setProjectUnitsRankingLoading] = useState(false);
  const [isProjectUnitsModalOpen, setIsProjectUnitsModalOpen] = useState(false);
  const isFullScreen = useFullScreen();
  const { language, setLanguage } = useLanguage();

  useEffect(() => {
    fetchCenters().then(async data => {
      setCenters(data.centers || []);
      if (data.centers && data.centers.length > 0) setSelectedCenter(data.centers[0]);
      // Fetch all breakdowns in parallel
      setBreakdownsLoading(true);
      const breakdowns = await Promise.all(
        (data.centers || []).map(center =>
          fetchCenterEvaluationBreakdown(center.id).catch(() => null)
        )
      );
      setAllBreakdowns(breakdowns);
      setBreakdownsLoading(false);
    });
  }, []);

  // Fetch annual performance data only once when component loads
  useEffect(() => {
    const fetchAnnualData = async () => {
      setAnnualDataLoading(true);
      try {
        // Use a default organization ID since the backend now calculates for ALL centers
        const response = await fetchAnnualPerformanceData('1');
        console.log('🎯 Dashboard received response:', response);
        if (response.success) {
          console.log('✅ Setting annual performance data:', response.data);
          console.log('✅ Data length:', response.data?.length);
          setAnnualPerformanceData(response.data);
        } else {
          console.error('❌ Annual performance API returned success: false');
          // setAnnualPerformanceData(fallbackAnnualData); // REMOVED
        }
      } catch (error) {
        console.error('❌ Error fetching annual performance data:', error);
        // setAnnualPerformanceData(fallbackAnnualData); // REMOVED
      } finally {
        setAnnualDataLoading(false);
      }
    };

    // Fetch data only once when component mounts
    fetchAnnualData();
  }, []); // Empty dependency array - only run once

  useEffect(() => {
    if (selectedCenter) {
      setLoading(true);
      fetchCenterEvaluationBreakdown(selectedCenter.id)
        .then(setEvaluation)
        .finally(() => setLoading(false));

      // Fetch annual performance data
      // setAnnualDataLoading(true); // This is now handled by the useEffect above
      // fetchAnnualPerformanceData(selectedCenter.id) // This is now handled by the useEffect above
      //   .then(response => {
      //     console.log('Annual performance response:', response);
      //     if (response.success) {
      //       setAnnualPerformanceData(response.data);
      //     } else {
      //       console.error('Annual performance API returned success: false');
      //       // Use generated fallback data based on activated centers evaluation
      //       // setAnnualPerformanceData(fallbackAnnualData); // REMOVED
      //     }
      //   })
      //   .catch(error => {
      //     console.error('Error fetching annual performance data:', error);
      //     // Use generated fallback data based on activated centers evaluation
      //     // setAnnualPerformanceData(fallbackAnnualData); // REMOVED
      //   })
      //   .finally(() => setAnnualDataLoading(false)); // This is now handled by the useEffect above
    }
  }, [selectedCenter]);

  // حساب الإحصائيات
  const totalCenters = centers.length;
  const onlineCenters = centers.filter(c => c.status === "online");
  const offlineCenters = centers.filter(c => c.status === "offline");
  const avgOnlineEval = onlineCenters.length
    ? Math.round(onlineCenters.reduce((sum, c) => sum + c.evaluation, 0) / onlineCenters.length)
    : 0;

  // Carousel logic
  const carouselRef = React.useRef();
  const scrollToCenter = (idx) => {
    if (carouselRef.current) {
      const el = carouselRef.current.children[idx];
      if (el) el.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  };
  useEffect(() => {
    if (selectedCenter && centers.length > 0) {
      const idx = centers.findIndex(c => c.id === selectedCenter.id);
      if (idx !== -1) scrollToCenter(idx);
    }
  }, [selectedCenter, centers]);

  // Group centers by location for offsetting
  const locationGroups = groupCentersByLocation(centers);

  // Calculate overall project evaluation breakdown from allBreakdowns
  const calculateOverallEvaluation = () => {
    if (!allBreakdowns.length) return null;
    const validBreakdowns = allBreakdowns.filter(Boolean);
    if (!validBreakdowns.length) return null;
    const sum = {
      ODBM: { traineeAttendance: 0, traineeCommitment: 0, trainerCourses: 0 },
      APBM: { project: 0, formative: 0, traineeCommitment: 0 },
      TQBM: { trainingRegularity: 0, trainingPrograms: 0, trainer: 0, digitization: 0, quality: 0 },
      Community: 0,
      Institutional: 0
    };
    validBreakdowns.forEach(b => {
      if (b.ODBM) {
        sum.ODBM.traineeAttendance += b.ODBM.traineeAttendance || 0;
        sum.ODBM.traineeCommitment += b.ODBM.traineeCommitment || 0;
        sum.ODBM.trainerCourses += b.ODBM.trainerCourses || 0;
      }
      if (b.APBM) {
        sum.APBM.project += b.APBM.project || 0;
        sum.APBM.formative += b.APBM.formative || 0;
        sum.APBM.traineeCommitment += b.APBM.traineeCommitment || 0;
      }
      if (b.TQBM) {
        sum.TQBM.trainingRegularity += b.TQBM.trainingRegularity || 0;
        sum.TQBM.trainingPrograms += b.TQBM.trainingPrograms || 0;
        sum.TQBM.trainer += b.TQBM.trainer || 0;
        sum.TQBM.digitization += b.TQBM.digitization || 0;
        sum.TQBM.quality += b.TQBM.quality || 0;
      }
      if (b.COMMUNITY !== undefined) sum.Community += b.COMMUNITY || 0;
      if (b.INSTITUTIONAL !== undefined) sum.Institutional += b.INSTITUTIONAL || 0;
    });
    const n = validBreakdowns.length;
    return {
      ODBM: {
        traineeAttendance: sum.ODBM.traineeAttendance / n,
        traineeCommitment: sum.ODBM.traineeCommitment / n,
        trainerCourses: sum.ODBM.trainerCourses / n,
      },
      APBM: {
        project: sum.APBM.project / n,
        formative: sum.APBM.formative / n,
        traineeCommitment: sum.APBM.traineeCommitment / n,
      },
      TQBM: {
        trainingRegularity: sum.TQBM.trainingRegularity / n,
        trainingPrograms: sum.TQBM.trainingPrograms / n,
        trainer: sum.TQBM.trainer / n,
        digitization: sum.TQBM.digitization / n,
        quality: sum.TQBM.quality / n,
      },
      Community: sum.Community / n,
      Institutional: sum.Institutional / n,
    };
  };

  const overallEvaluation = calculateOverallEvaluation();

  // بعد حساب overallEvaluation وقبل return مباشرة:
  const overallData = overallEvaluation ? [
    {
      name: 'ODBM', value: Math.round((
        overallEvaluation?.ODBM?.traineeAttendance * 0.4 +
        overallEvaluation?.ODBM?.traineeCommitment * 0.2 +
        overallEvaluation?.ODBM?.trainerCourses * 0.4
      ) * 100) || 0
    },
    {
      name: 'APBM', value: Math.round((
        overallEvaluation?.APBM?.project * 0.6 +
        overallEvaluation?.APBM?.formative * 0.3 +
        overallEvaluation?.APBM?.traineeCommitment * 0.1
      ) * 100) || 0
    },
    {
      name: 'TQBM', value: Math.round((
        overallEvaluation?.TQBM?.trainingRegularity * 0.25 +
        overallEvaluation?.TQBM?.trainingPrograms * 0.25 +
        overallEvaluation?.TQBM?.trainer * 0.25 +
        overallEvaluation?.TQBM?.digitization * 0.15 +
        overallEvaluation?.TQBM?.quality * 0.10
      ) * 100) || 0
    },
    { name: 'Community', value: Math.round((overallEvaluation?.Community || 0) * 100) },
    { name: 'Institutional', value: Math.round((overallEvaluation?.Institutional || 0) * 100) },
  ] : [];

  const handleProjectUnitsRankingClick = async () => {
    console.log('Project units ranking clicked');
    console.log('Selected center:', selectedCenter);

    setProjectUnitsRankingLoading(true);
    setIsProjectUnitsModalOpen(true);

    try {
      // Use a default organization ID if no center is selected
      const organizationId = selectedCenter?.id || '1'; // Default to organization ID 1
      console.log('Using organization ID:', organizationId);

      const response = await fetchProjectUnitsRanking(organizationId);
      console.log('API response:', response);

      if (response.success) {
        setProjectUnitsRanking(response.data);
        console.log('Project units ranking data set:', response.data);
      } else {
        console.error('Project units ranking API returned success: false');
        setProjectUnitsRanking(null);
      }
    } catch (error) {
      console.error('Error fetching project units ranking data:', error);
      setProjectUnitsRanking(null);
    } finally {
      setProjectUnitsRankingLoading(false);
    }
  };

  // New function to handle center-specific ranking click
  const handleCenterRankingClick = async (center) => {
    console.log('=== CENTER RANKING CLICK ===');
    console.log('Center clicked:', center);
    console.log('Center ID:', center?.id);
    console.log('Center name:', center?.name);

    setProjectUnitsRankingLoading(true);
    setIsProjectUnitsModalOpen(true);
    setSelectedCenter(center); // Set the selected center to display its name in modal

    try {
      const organizationId = center?.id || '1';
      console.log('Making API call for organization ID:', organizationId);

      const response = await fetchProjectUnitsRanking(organizationId);
      console.log('=== API RESPONSE ===');
      console.log('Full response:', response);
      console.log('Response data:', response.data);

      if (response.success) {
        setProjectUnitsRanking(response.data);
        console.log('✅ Center ranking data successfully set for center:', center?.name);
      } else {
        console.error('❌ Center ranking API returned success: false');
        setProjectUnitsRanking(null);
      }
    } catch (error) {
      console.error('❌ Error fetching center ranking data:', error);
      setProjectUnitsRanking(null);
    } finally {
      setProjectUnitsRankingLoading(false);
      console.log('=== RANKING CLICK COMPLETE ===');
    }
  };

  // Remove the fallback data generation since we want real data from database
  // const generateAnnualPerformanceData = () => { ... };
  // const fallbackAnnualData = generateAnnualPerformanceData();

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      background: 'radial-gradient(ellipse at center, #0a183d 60%, #1a1a2e 100%)',
      color: '#fff',
      overflow: 'hidden',
      fontFamily: 'Cairo, sans-serif',
      position: 'relative',
      padding: 0,
      boxSizing: 'border-box',
    }}>
      {/* Header - matches screenshot structure */}
      <div className="bg-white" style={{
        width: '100vw',
        minHeight: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 32px',
        boxSizing: 'border-box',
        position: 'relative',
        zIndex: 100,
        borderBottom: '1px solid #222',
      }}>
        {/* Left: WABYS and Watoms logo */}
        <div className="flex items-center gap-6 my-2">
          <img className="w-[100px] md:w-[120px] lg:w-[140px] cursor-pointer rounded-xl" src={wabysLogo} alt="Wabys Logo" onClick={() => navigate('/wabys')} />
          <div className='border-l-2 border-black p-1 h-12' />
          <img className="w-[100px] md:w-[140px] lg:w-[150px] cursor-pointer" src={watomsLogo} alt="Wabys Logo" onClick={() => navigate('/wabys')} />
        </div>
        <div className="flex items-center gap-4 relative flex-wrap justify-evenly">
          {/* Full Screen */}
          <button
            onClick={fullScreen}
            className="rounded-full w-10 h-10 flex justify-center items-center bg-white/80 hover:bg-gray-200 shadow transition-all"
            title={language ? (isFullScreen ? 'Exit Full Screen' : 'Enter Full Screen') : (isFullScreen ? 'خروج من الشاشة الكاملة' : 'دخول الشاشة الكاملة')}
          >
            <FontAwesomeIcon
              icon={isFullScreen ? faCompress : faExpand}
              className="text-xl text-watomsBlue"
            />
          </button>
          {/* User Name */}
          <span className="flex items-center gap-2 font-bold text-lg md:min-w-[120px] min-w-[300px] justify-center text-watomsBlue">
            <FontAwesomeIcon icon={faUser} />
            {userFullName(userInfo, language)}
          </span>
          {/* Filter bar */}
          <div style={{ display: 'flex', alignItems: 'center', background: '#bdbdbd', borderRadius: 6, padding: '2px 10px', minWidth: 120, height: 28, boxShadow: '0 1px 2px #0002', border: '1px solid #888' }}>
            {/* Filter icon */}
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" style={{ marginRight: 6 }}>
              <rect x="3" y="5" width="14" height="2" rx="1" fill="#222" />
              <rect x="6" y="9" width="8" height="2" rx="1" fill="#222" />
              <rect x="9" y="13" width="2" height="2" rx="1" fill="#222" />
            </svg>
            <input type="text" placeholder="" style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: 15, color: '#222', width: 70 }} />
          </div>
          {/* Bell icon */}
          <svg className="text-black" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#bdbdbd" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', marginLeft: 8 }}>
            <path d="M18 16v-5a6 6 0 1 0-12 0v5l-1.5 2v1h15v-1l-1.5-2z" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </div>
      </div>
      {/* توزيع الصفحة: يسار - وسط - يمين */}
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'stretch',
        maxHeight: `calc(100vh - ${HEADER_HEIGHT}px)`,
        width: '100vw',
        position: 'relative',
        gap: 0,
        boxSizing: 'border-box',
      }}>
        {/* يسار: الرسوم البيانية */}
        <div style={{
          flex: '0 1 28%',
          minWidth: 320,
          maxWidth: 420,
          maxHeight: "85vh",
          padding: '1vw 1vw 1vw 1vw',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'stretch',
          gap: 28,
          boxSizing: 'border-box',
        }}>
          {/* General Ranking Chart */}
          <div className="rounded-2xl flex flex-col h-fit flex-1 p-5"
            style={{
              background: '#36393f',
              boxShadow: '0 2px 12px #0004',
              marginBottom: 0,
              alignItems: 'stretch',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <svg width="0" height="0" style={{ position: 'absolute' }}>
              <defs>
                <linearGradient id="blueBarGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#00bfff" />
                  <stop offset="100%" stopColor="#0099ff" />
                </linearGradient>
                <linearGradient id="pinkBarGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#ff5ebc" />
                  <stop offset="100%" stopColor="#ff3c8e" />
                </linearGradient>
                <linearGradient id="orangeBarGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#ffa600" />
                  <stop offset="100%" stopColor="#ff7c00" />
                </linearGradient>
                <linearGradient id="grayBarGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#bdbdbd" />
                  <stop offset="100%" stopColor="#757575" />
                </linearGradient>
              </defs>
            </svg>
            {/* Dotted pattern background */}
            <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
              <defs>
                <pattern id="dots" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="2" fill="#555" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#dots)" />
            </svg>
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
              onClick={handleProjectUnitsRankingClick}
            >
              الترتيب العام لوحدات المشروع
            </div>
            {/* Modern CSS Bar Chart */}
            <div style={{ minHeight: 60, display: 'flex', flexDirection: 'column', justifyContent: 'center', zIndex: 1, marginTop: 4, gap: 14 }}>
              {onlineCenters.slice().sort((a, b) => (b.evaluation || 0) - (a.evaluation || 0)).map((c, i) => (
                <div
                  key={c.id || i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: 0,
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease, opacity 0.2s ease',
                    borderRadius: 8,
                    padding: '4px'
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
                  onClick={() => handleCenterRankingClick(c)}
                >
                  {/* Center name (on the left) */}
                  <div style={{
                    minWidth: 115,
                    maxWidth: 120,
                    fontWeight: 900,
                    fontSize: 15,
                    color: '#fff',
                    marginRight: 8,
                    textAlign: 'right',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    transition: 'color 0.2s ease'
                  }}>
                    {c.name}
                  </div>
                  {/* Bar background with fixed width */}
                  <div style={{
                    maxWidth: 180,
                    height: 22,
                    background: '#444652',
                    borderRadius: 18,
                    boxShadow: '0 2px 8px #0002',
                    position: 'relative',
                    overflow: 'hidden',
                    marginLeft: 8,
                    marginRight: 8,
                    transition: 'box-shadow 0.2s ease'
                  }}
                    className="min-w-[175px]"
                  >
                    {/* Bar fill */}
                    <div style={{
                      height: '100%',
                      width: `${c.evaluation || 0}%`,
                      background: modernBarGradients[i % modernBarGradients.length],
                      borderRadius: 18,
                      transition: 'width 0.7s cubic-bezier(.4,2,.6,1)'
                    }} />
                  </div>
                  {/* Percentage (on the right) */}
                  <div style={{
                    minWidth: 38,
                    fontWeight: 900,
                    fontSize: 17,
                    color: '#444652',
                    textShadow: '0 1px 4px #fff, 0 0 2px #fff',
                    textAlign: 'left',
                    marginLeft: 0,
                    marginRight: 0,
                    transition: 'color 0.2s ease'
                  }}>
                    {c.evaluation !== undefined ? c.evaluation : 0}%
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Annual Performance Chart */}
          <AnnualPerformanceChart
            data={annualPerformanceData}
            title="التقييم السنوي للمشروع"
            loading={annualDataLoading}
          />
        </div>
        {/* وسط: الخريطة والدائرة */}
        <div style={{
          flex: '1 1 36%',
          minWidth: 260,
          minHeight: 260,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}>
          <div style={{
            position: 'relative',
            width: mapWidth,
            height: mapHeight,
            maxWidth: mapWidth,
            maxHeight: mapHeight,
            minWidth: 260,
            minHeight: 260,
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {/* Static SVG Map inside a circle */}
            <div style={{
              width: 400,
              height: 400,
              borderRadius: '50%',
              overflow: 'hidden',
              background: 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 12px #0003',
            }}>
              <EgyptMap style={{ width: '80%', height: '80%', display: 'block', background: 'none', margin: 'auto' }} />
            </div>
            {/* Overlay center dots */}
            {Object.entries(locationGroups).flatMap(([location, group], groupIdx) => {
              // Parse lat/lng for this location
              let lat = egyptCenter[0], lng = egyptCenter[1];
              if (location && location.includes(',')) {
                [lat, lng] = location.split(',').map(Number);
              }
              const { x, y } = latLngToSvgXY(lat, lng);
              const n = group.length;
              // Offset dots in a circle if more than one at this location
              const radius = 20; // px offset from center
              return group.map((center, i) => {
                let angle = (2 * Math.PI * i) / n;
                let dx = n > 1 ? Math.cos(angle) * radius : 0;
                let dy = n > 1 ? Math.sin(angle) * radius : 0;
                const isOnline = center.status === 'online';
                const isSelected = selectedCenter && selectedCenter.id === center.id;
                const isHovered = hoveredCenterId === center.id;
                return (
                  <div
                    key={center.id}
                    style={{
                      position: 'absolute',
                      left: `calc(${((x - 106.544) / 1054.979) * 100}% + ${dx * 0.75}px)`,
                      top: `calc(${((y + 188.858) / 972.996) * 100}% + ${dy * 0.75}px)`,
                      transform: 'translate(-50%, -50%)',
                      width: 12,
                      height: 12,
                      background: center.location ? (isOnline ? '#22c55e' : '#ef4444') : '#6b7280',
                      border: isSelected ? '3px solid #facc15' : isHovered ? '3px solid #38bdf8' : '2px solid #fff',
                      borderRadius: '50%',
                      boxShadow: isSelected ? '0 0 8px 2px #facc1588' : (center.location ? (isOnline ? '0 0 4px #22c55e88' : '0 0 4px #ef444488') : '0 0 4px #6b728088'),
                      zIndex: 10,
                      cursor: 'pointer',
                    }}
                    onMouseEnter={() => setHoveredCenterId(center.id)}
                    onMouseLeave={() => setHoveredCenterId(null)}
                    onClick={() => setSelectedCenter(center)}
                  >
                  </div>
                );
              });
            })}
            {/* Selected center evaluation circle with arrow and info box */}
            {selectedCenter && (
              <>
                {/* Evaluation circle as circular progress bar */}
                <div style={{
                  position: 'absolute',
                  left: `calc(${((latLngToSvgXY(parseLatLng(selectedCenter.location)[0], parseLatLng(selectedCenter.location)[1]).x + 100) / 1054.979) * 100}% + 30px)`,
                  top: `calc(${((latLngToSvgXY(parseLatLng(selectedCenter.location)[0], parseLatLng(selectedCenter.location)[1]).y + 188.858) / 972.996) * 100}% - 30px)`,
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 15,
                  background: 'none',
                  boxShadow: '0 0 15px #0af8',
                }}>
                  <CircularProgressBar value={selectedCenter.evaluation || 0} />
                </div>
                {/* Info box */}
                <div style={{
                  position: 'absolute',
                  left: `calc(${((latLngToSvgXY(parseLatLng(selectedCenter.location)[0], parseLatLng(selectedCenter.location)[1]).x + 75) / 1054.979) * 100}% + 110px)`,
                  top: `calc(${((latLngToSvgXY(parseLatLng(selectedCenter.location)[0], parseLatLng(selectedCenter.location)[1]).y + 188.858) / 972.996) * 100}% - 40px)`,
                  background: '#c3c8d6',
                  color: '#222',
                  padding: '10px 18px',
                  borderRadius: 16,
                  fontSize: 12,
                  width: 160,
                  maxWidth: 160,
                  boxShadow: '0 4px 16px #0004',
                  zIndex: 16,
                }}>
                  <div style={{ fontWeight: 'bold', marginBottom: 4 }}>{selectedCenter.name}</div>
                  <div style={{ fontSize: 9, marginBottom: 2 }}>{selectedCenter.address || 'No address'}</div>
                  {selectedCenter.location && (
                    <a
                      href={`https://www.google.com/maps?q=${selectedCenter.location}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontSize: 9,
                        color: '#1a237e',
                        textDecoration: 'none',
                        display: 'block',
                        marginBottom: 2
                      }}
                    >
                      📍 فتح في جوجل ماب
                    </a>
                  )}
                  <div style={{ fontSize: 9, color: '#006400' }}>
                    تاريخ بدء المشروع: {selectedCenter.startDate || 'غير محدد'}
                  </div>
                </div>
              </>
            )}
          </div>
          {/* Carousel navigation below the map, inside the map column */}
          <div style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 18,
            gap: 18,
          }}>
            <button
              onClick={() => {
                if (!centers.length) return;
                const idx = centers.findIndex(c => c.id === selectedCenter?.id);
                setSelectedCenter(centers[(idx - 1 + centers.length) % centers.length]);
              }}
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
              title="المركز السابق"
            >
              &#8592;
            </button>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 15, minWidth: 80, textAlign: 'center', letterSpacing: 1 }}>
              {selectedCenter?.name || ''}
            </span>
            <button
              onClick={() => {
                if (!centers.length) return;
                const idx = centers.findIndex(c => c.id === selectedCenter?.id);
                setSelectedCenter(centers[(idx + 1) % centers.length]);
              }}
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
              title="المركز التالي"
            >
              &#8594;
            </button>
          </div>
        </div>
        {/* يمين: الإحصائيات */}
        <div style={{
          flex: '0 1 28%',
          minWidth: 320,
          maxWidth: 420,
          maxHeight: "85vh",
          padding: '1vw 1vw 1vw 1vw',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'stretch',
          gap: 10,
          boxSizing: 'border-box',
        }}>
          <div style={{
            background: '#181c2a',
            borderRadius: 16,
            padding: '18px 24px 18px 24px',
            margin: '18px 0',
            minWidth: 220,
            minHeight: 120,
            boxShadow: '0 2px 8px #0002',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12
          }}>
            <div style={{ width: '100%', textAlign: 'center', fontWeight: 700, fontSize: 15, color: '#fff', marginBottom: 8, display: 'flex', flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', padding: '0 8px' }}>
              <span>{'إجمالي عدد المراكز'}</span>
              <span style={{ fontWeight: 900, fontSize: 17, color: '#3fd8ff', paddingLeft: 6 }}>({String(totalCenters).padStart(2, '0')})</span>
            </div>
            <div style={{ width: '100%', textAlign: 'center', fontWeight: 700, fontSize: 15, color: '#fff', marginBottom: 8, display: 'flex', flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', padding: '0 8px' }}>
              <span>{'إجمالي الغير مفعّل'}</span>
              <span style={{ fontWeight: 900, fontSize: 17, color: '#ef4444', paddingLeft: 6 }}>({String(offlineCenters.length).padStart(2, '0')})</span>
            </div>
            <div style={{ width: '100%', textAlign: 'center', fontWeight: 700, fontSize: 15, color: '#fff', display: 'flex', flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', padding: '0 8px' }}>
              <span>{'إجمالي المراكز المفعلة'}</span>
              <span style={{ fontWeight: 900, fontSize: 17, color: '#22c55e', paddingLeft: 6 }}>({String(onlineCenters.length).padStart(2, '0')})</span>
            </div>
          </div>
          {/* إجمالي نسبة تقييم المراكز المفعلة */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#181c2a',
            borderRadius: 16,
            padding: '18px 0 10px 0',
            margin: '18px 0',
            minWidth: 220,
            minHeight: 170,
            boxShadow: '0 2px 8px #0002'
          }}>
            <CircularProgressBar value={avgOnlineEval} size={90} color='url(#circularBlueGradient)' bg='#23263a' textColor='#fff' />
            <div style={{ fontWeight: 600, fontSize: 15, color: '#e0c77c', marginTop: 12 }}>
              إجمالي نسبة تقييم المراكز المفعلة
            </div>
          </div>
          <div style={{
            background: '#202a3a',
            borderRadius: 16,
            boxShadow: '0 2px 16px #0005',
            padding: 10,
            marginTop: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Dotted pattern background */}
            <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
              <defs>
                <pattern id="dots-overall" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="2" fill="#555" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#dots-overall)" />
            </svg>
            {/* Overlay to darken pattern under content */}
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(32,42,58,0.15)', zIndex: 1, pointerEvents: 'none' }} />
            {/* Content above pattern/overlay */}
            <div style={{ position: 'relative', zIndex: 2 }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: '#facc15', marginBottom: 8, textAlign: 'center' }}>إجمالي نسب تقييم المشروع</div>
              {overallEvaluation && (
                <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', gap: 20, minHeight: 90 }}>
                  {overallData.map((item, i) => (
                    <div
                      key={item.name || `cat${i}`}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        flex: 1,
                        minWidth: 44,
                        cursor: 'pointer',
                      }}
                      onClick={() => {
                        setSelectedCategory(item.name);
                        setOverallModalOpen(true);
                      }}
                    >
                      {/* Percentage above bar */}
                      <div style={{ fontWeight: 700, fontSize: 11, color: '#fff', marginBottom: 4 }}>{item.value}%</div>
                      {/* Vertical bar */}
                      <div style={{ width: 20, height: 54, background: '#444652', borderRadius: 8, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', marginBottom: 0, paddingBottom: 0 }}>
                        <div style={{ width: '100%', height: `${item.value}%`, background: modernBarGradients[i % modernBarGradients.length], borderRadius: 8, transition: 'height 0.7s cubic-bezier(.4,2,.6,1)', position: 'absolute', bottom: 0, left: 0 }} />
                      </div>
                      {/* Category name below bar */}
                      <div style={{
                        height: 28,
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'center',
                        width: '100%',
                        marginTop: 5,
                      }}>
                        <span style={{
                          fontWeight: 700,
                          fontSize: 10,
                          color: '#fff',
                          textAlign: 'center',
                          maxWidth: 70,
                          wordBreak: 'break-word',
                          textShadow: '0 2px 8px #000',
                          lineHeight: 1.1,
                          display: 'block',
                        }} title={item.name || 'تصنيف'}>{item.name || 'تصنيف'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Modal for detailed breakdown */}
      <ReactModal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        style={{
          overlay: { background: 'rgba(0,0,0,0.4)', zIndex: 1000 },
          content: {
            maxWidth: 400,
            margin: 'auto',
            borderRadius: 16,
            padding: 24,
            background: '#181f2e',
            color: '#fff',
            border: 'none',
            boxShadow: '0 4px 32px #000a',
          },
        }}
        ariaHideApp={false}
      >
        <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 16, textAlign: 'center' }}>
          {selectedCategory === 'City Ranking' ? 'تفاصيل ترتيب المحافظات' :
            selectedCategory ? `تفاصيل ${selectedCategory} - ${selectedCenter?.name || ''}` : ''}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {selectedCategory === 'City Ranking' ? (
            centers.map((city, i) => (
              <div key={city.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#222c', borderRadius: 8, padding: '8px 14px', fontSize: 14 }}>
                <span>{city.name}</span>
                <span style={{ color: '#0af', fontWeight: 600 }}>{Math.round(city.evaluation || 0)}%</span>
              </div>
            ))
          ) : (
            selectedCategory && CATEGORY_DETAILS[selectedCategory] && CATEGORY_DETAILS[selectedCategory].map((item, i) => (
              <div key={item.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#222c', borderRadius: 8, padding: '8px 14px', fontSize: 14 }}>
                <span>{item.label}</span>
                <span style={{ color: '#0af', fontWeight: 600 }}>{item.weight}%</span>
                <span style={{ color: '#0f0', fontWeight: 600 }}>
                  {selectedCategory === 'ODBM' && evaluation?.ODBM?.[item.key] != null ? `${Math.round(evaluation.ODBM[item.key] * 100)}%` :
                    selectedCategory === 'APBM' && evaluation?.APBM?.[item.key] != null ? `${Math.round(evaluation.APBM[item.key] * 100)}%` :
                      selectedCategory === 'TQBM' && evaluation?.TQBM?.[item.key] != null ? `${Math.round(evaluation.TQBM[item.key] * 100)}%` :
                        selectedCategory === 'Community' && evaluation?.COMMUNITY != null ? `${Math.round(evaluation.COMMUNITY * 100)}%` :
                          selectedCategory === 'Institutional' && evaluation?.INSTITUTIONAL != null ? `${Math.round(evaluation.INSTITUTIONAL * 100)}%` :
                            ''}
                </span>
              </div>
            ))
          )}
        </div>
        <button onClick={() => setModalOpen(false)} style={{ margin: '24px auto 0', display: 'block', background: '#0af', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 24px', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>إغلاق</button>
      </ReactModal>
      {/* Modal for overall project breakdown */}
      <ReactModal
        isOpen={overallModalOpen}
        onRequestClose={() => setOverallModalOpen(false)}
        style={{
          overlay: { background: 'rgba(0,0,0,0.4)', zIndex: 1000 },
          content: {
            maxWidth: 700,
            margin: 'auto',
            borderRadius: 16,
            padding: 24,
            background: '#181f2e',
            color: '#fff',
            border: 'none',
            boxShadow: '0 4px 32px #000a',
          },
        }}
        ariaHideApp={false}
      >
        <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 16, textAlign: 'center' }}>
          {selectedCategory ? `تفاصيل ${selectedCategory} - جميع المراكز` : ''}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {selectedCategory === 'City Ranking' ? (
            centers.map((city, i) => (
              <div key={city.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#222c', borderRadius: 8, padding: '8px 14px', fontSize: 14 }}>
                <span>{city.name}</span>
                <span style={{ color: '#0af', fontWeight: 600 }}>{Math.round(city.evaluation || 0)}%</span>
              </div>
            ))
          ) : (
            selectedCategory && CATEGORY_DETAILS[selectedCategory] && CATEGORY_DETAILS[selectedCategory].map((item, i) => (
              <div key={item.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#222c', borderRadius: 8, padding: '8px 14px', fontSize: 14 }}>
                <span>{item.label}</span>
                <span style={{ color: '#0af', fontWeight: 600 }}>{item.weight}%</span>
                <span style={{ color: '#0f0', fontWeight: 600 }}>
                  {selectedCategory === 'ODBM' && evaluation?.ODBM?.[item.key] != null ? `${Math.round(evaluation.ODBM[item.key] * 100)}%` :
                    selectedCategory === 'APBM' && evaluation?.APBM?.[item.key] != null ? `${Math.round(evaluation.APBM[item.key] * 100)}%` :
                      selectedCategory === 'TQBM' && evaluation?.TQBM?.[item.key] != null ? `${Math.round(evaluation.TQBM[item.key] * 100)}%` :
                        selectedCategory === 'Community' && evaluation?.COMMUNITY != null ? `${Math.round(evaluation.COMMUNITY * 100)}%` :
                          selectedCategory === 'Institutional' && evaluation?.INSTITUTIONAL != null ? `${Math.round(evaluation.INSTITUTIONAL * 100)}%` :
                            ''}
                </span>
              </div>
            ))
          )}
        </div>
        <button onClick={() => setOverallModalOpen(false)} style={{ margin: '24px auto 0', display: 'block', background: '#0af', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 24px', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>إغلاق</button>
      </ReactModal>

      {/* Project Units Ranking Modal */}
      <ProjectUnitsRankingModal
        isOpen={isProjectUnitsModalOpen}
        onClose={() => setIsProjectUnitsModalOpen(false)}
        data={projectUnitsRanking}
        loading={projectUnitsRankingLoading}
        centerInfo={selectedCenter}
      />

      {/* Add warning gradient to chart SVG root */}
      <defs>
        <radialGradient id="warnGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f00" />
          <stop offset="100%" stopColor="#a00" />
        </radialGradient>
      </defs>
    </div>
  );
};

export default WatomsDashboard;