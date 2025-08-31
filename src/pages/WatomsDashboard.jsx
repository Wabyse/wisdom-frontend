import React, { useEffect, useState } from "react";
import { fetchCenters, fetchCenterEvaluationBreakdown, fetchAnnualPerformanceData, fetchProjectUnitsRanking, fetchWatomsDetailsData } from "../services/dashboard";
import { ReactComponent as EgyptMap } from '../assets/Egypt_location_map.svg';
import { BarChart, Bar, XAxis, YAxis, Tooltip as ReTooltip, ResponsiveContainer, LabelList, PieChart, Pie } from "recharts";
import ReactModal from 'react-modal';
import wabysLogo from "../assets/wabys.png";
import { useNavigate } from "react-router-dom";
import AnnualPerformanceChart from "../components/AnnualPerformanceChart";
import ProjectUnitsRankingModal from '../components/ProjectUnitsRankingModal';
import watomsLogo from '../assets/watoms3.png';
import fullScreen from '../utils/fullScreen';
import useFullScreen from "../hooks/useFullScreen";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExpand, faCompress, faUser, faBell } from "@fortawesome/free-solid-svg-icons";
import { useLanguage } from "../context/LanguageContext";
import { userFullName } from "../utils/userFullName";
import { useAuth } from "../context/AuthContext";
import Uploading from "../components/Uploading";
import LoadingScreen from "../components/LoadingScreen";
import { ALL_MONTHS } from "../constants/constants";
import { roundNumber } from "../utils/roundNumber";

const egyptCenter = [26.8206, 30.8025]; // Egypt center

const parseLatLng = (locationStr) => {
  if (!locationStr) return egyptCenter;
  const [lat, lng] = locationStr.split(',').map(Number);
  return [lat, lng];
};

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

// Add keyframes for the animation
const styleSheet = document.createElement('style');
styleSheet.innerText = `@keyframes flashDot { 0% { opacity: 1; } 50% { opacity: 0.2; } 100% { opacity: 1; } }`;
document.head.appendChild(styleSheet);

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
  const [hoveredCenterId, setHoveredCenterId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [overallModalOpen, setOverallModalOpen] = useState(false);
  const [allBreakdowns, setAllBreakdowns] = useState([]);
  const [breakdownsLoading, setBreakdownsLoading] = useState(false);
  const [annualPerformanceData, setAnnualPerformanceData] = useState([]);
  const [projectUnitsRankingLoading, setProjectUnitsRankingLoading] = useState(false);
  const [isProjectUnitsModalOpen, setIsProjectUnitsModalOpen] = useState(false);
  const isFullScreen = useFullScreen();
  const { language, setLanguage } = useLanguage();
  const [watomsData, setWatomsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [datasMonths, setDatasMonths] = useState([]);
  const [selectedOrgId, setSelectedOrgId] = useState(null);
  const [orgStandards, setOrgStandards] = useState([]);
  const [orgSubStandards, setOrgSubStandards] = useState([]);

  const [detailedData, setDetailedData] = useState({
    TQBM: { TG: 0, TE: 0, T: 0 },
    GOVBM: { IP: 0, DD: 0, PO: 0, QD: 0, W: 0 },
    ACBM: { TR: 0, TG: 0 },
    GEEBBM: {
      TQBM: { TG: 0, TE: 0, T: 0 },
      GOVBM: { IP: 0, DD: 0, PO: 0, QD: 0, W: 0 },
      ACBM: { TR: 0, TG: 0 },
      TRA: 0,
      TV: 0,
      CP: 0
    }
  });

  const [totalScore, setTotalScore] = useState([]);
  const [totalScoreDetailed, setTotalScoreDetailed] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState({});
  const [selectedMonthIdx, setSelectedMonthIdx] = useState({});
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [arrangedOrg, setArrangedOrg] = useState([]);
  const [arrangedOrgIdx, setArrangedOrgIdx] = useState();

  // fetching watoms' dashboard data
  useEffect(() => {
    const loadWatomsDetailedData = async () => {
      try {
        setLoading(true);
        const response = await fetchWatomsDetailsData();
        setWatomsData(response);
        // remove this later
        setDatasMonths(response.total.months);
        setSelectedMonthIdx(response.total.months.length - 1);
        const arrangingOrg = Object.values(response?.organizations || {}).sort((a, b) => b.overall - a.overall);
        const watomsDataArray = [response.total, ...arrangingOrg];
        setArrangedOrg(watomsDataArray);
        setSelectedOrg(watomsDataArray[0]);
        setArrangedOrgIdx(0);
        setOrgStandards([
          {
            name: "جودة التدريب",
            score: roundNumber(watomsDataArray[0]?.months[response.total.months.length - 1]?.TQBM?.totalTQBM) || 0,
            color: "#3b82f6"
          },
          {
            name: "مقياس الحوكمة",
            score: roundNumber(watomsDataArray[0]?.months[response.total.months.length - 1]?.GOVBM?.totalGOVBM) || 0,
            color: "#10b981"
          },
          {
            name: "المقياس الاكاديمي",
            score: roundNumber(watomsDataArray[0]?.months[response.total.months.length - 1]?.ACBM?.totalACBM) || 0,
            color: "#f59e0b"
          }
        ])
        setOrgSubStandards([
          {
            name: "جودة التدريب",
            subData: [
              {
                name: "البرامج التدريبية",
                score: roundNumber(watomsDataArray[0]?.months[response.total.months.length - 1]?.TQBM?.TG?.avgScore) || 0,
                color: "#3b82f6"
              },
              {
                name: "بيئة التدريب",
                score: roundNumber(watomsDataArray[0]?.months[response.total.months.length - 1]?.TQBM?.TE?.avgScore) || 0,
                color: "#16a34a"
              },
              {
                name: "اداء المدرب",
                score: roundNumber(watomsDataArray[0]?.months[response.total.months.length - 1]?.TQBM?.T?.avgScore) || 0,
                color: "#a855f7"
              }
            ],
          },
          {
            name: "مقياس الحوكمة",
            subData: [
              {
                name: "الاداء المؤسسي",
                score: roundNumber(watomsDataArray[0]?.months[response.total.months.length - 1]?.GOVBM?.IP?.avgScore) || 0,
                color: "#2e6f00"
              },
              {
                name: "الرقمنة",
                score: roundNumber(watomsDataArray[0]?.months[response.total.months.length - 1]?.GOVBM?.DD?.avgScore) || 0,
                color: "#e43002"
              },
              {
                name: "التخطيط و التشغيل",
                score: roundNumber(watomsDataArray[0]?.months[response.total.months.length - 1]?.GOVBM?.PO?.avgScore) || 0,
                color: "#88a064"
              },
              {
                name: "الجودة و التطوير",
                score: roundNumber(watomsDataArray[0]?.months[response.total.months.length - 1]?.GOVBM?.QD?.avgScore) || 0,
                color: "#2e8d52"
              },
              {
                name: "بيئة العمل",
                score: roundNumber(watomsDataArray[0]?.months[response.total.months.length - 1]?.GOVBM?.W?.avgScore) || 0,
                color: "#00bdbb"
              }
            ],
          },
          {
            name: "المقياس الاكاديمي",
            subData: [
              {
                name: "اداء المتدرب",
                score: roundNumber(watomsDataArray[0]?.months[response.total.months.length - 1]?.ACBM?.TR?.avgScore) || 0,
                color: "#aa4642"
              },
              {
                name: "البرامج التدريبية",
                score: roundNumber(watomsDataArray[0]?.months[response.total.months.length - 1]?.ACBM?.TG?.avgScore) || 0,
                color: "#925515"
              }
            ],
          },
          {
            name: "الكفاءة و الفاعلية",
            subData: [
              {
                name: "المشاركة المجتمعية",
                score: roundNumber(watomsDataArray[0]?.months[response.total.months.length - 1]?.GEEBM?.CP?.avgScore) || 0,
                color: "#520a9c"
              },
              {
                name: "التنمية المهنية",
                score: roundNumber(watomsDataArray[0]?.months[response.total.months.length - 1]?.GEEBM?.TV?.avgScore) || 0,
                color: "#596a95"
              },
              {
                name: "الاشراف اليومي",
                score: roundNumber(watomsDataArray[0]?.months[response.total.months.length - 1]?.GEEBM?.TRA) || 0,
                color: "#4f46f7"
              }
            ],
          },
        ])
      } catch (error) {
        console.error('❌ Error fetching Watoms Data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadWatomsDetailedData();
  }, []);

  useEffect(() => {
    const setDefaultMonth = () => {
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentMonthData = datasMonths.find(month => month.monthNumber === (currentMonth + 1));
      const findMonth = datasMonths.findIndex(month => month.monthNumber === currentMonthData.monthNumber);
      setSelectedMonthIdx(findMonth)
      setSelectedMonth(currentMonthData)
    }

    setDefaultMonth();
  }, [datasMonths])

  const toggleMonth = (status) => {
    if (status) {
      if (selectedMonthIdx !== datasMonths.length - 1) {
        setSelectedMonth(datasMonths[selectedMonthIdx + 1]);
        setSelectedMonthIdx(prev => prev + 1);
      }
    } else {
      if (selectedMonthIdx !== 0) {
        setSelectedMonth(datasMonths[selectedMonthIdx]);
        setSelectedMonthIdx(prev => prev - 1);
      }
    }
  }

  useEffect(() => {
    const loadStandards = () => {

      if (selectedMonthIdx && watomsData.length !== 0) {
        setOrgStandards([
          {
            name: "جودة التدريب",
            score: roundNumber(selectedOrg?.months[selectedMonthIdx]?.TQBM?.totalTQBM) || 0,
            color: "#3b82f6"
          },
          {
            name: "مقياس الحوكمة",
            score: roundNumber(selectedOrg?.months[selectedMonthIdx]?.GOVBM?.totalGOVBM) || 0,
            color: "#10b981"
          },
          {
            name: "المقياس الاكاديمي",
            score: roundNumber(selectedOrg?.months[selectedMonthIdx]?.ACBM?.totalACBM) || 0,
            color: "#f59e0b"
          }
        ])
      }
    }

    const loadSubStandards = () => {
      if (selectedMonthIdx && watomsData.length !== 0) {
        setOrgSubStandards([
          {
            name: "جودة التدريب",
            subData: [
              {
                name: "البرامج التدريبية",
                score: roundNumber(selectedOrg?.months[selectedMonthIdx]?.TQBM?.TG?.avgScore) || 0,
                color: "#3b82f6"
              },
              {
                name: "بيئة التدريب",
                score: roundNumber(selectedOrg?.months[selectedMonthIdx]?.TQBM?.TE?.avgScore) || 0,
                color: "#16a34a"
              },
              {
                name: "اداء المدرب",
                score: roundNumber(selectedOrg?.months[selectedMonthIdx]?.TQBM?.T?.avgScore) || 0,
                color: "#a855f7"
              }
            ],
          },
          {
            name: "مقياس الحوكمة",
            subData: [
              {
                name: "الاداء المؤسسي",
                score: roundNumber(selectedOrg?.months[selectedMonthIdx]?.GOVBM?.IP?.avgScore) || 0,
                color: "#2e6f00"
              },
              {
                name: "الرقمنة",
                score: roundNumber(selectedOrg?.months[selectedMonthIdx]?.GOVBM?.DD?.avgScore) || 0,
                color: "#e43002"
              },
              {
                name: "التخطيط و التشغيل",
                score: roundNumber(selectedOrg?.months[selectedMonthIdx]?.GOVBM?.PO?.avgScore) || 0,
                color: "#88a064"
              },
              {
                name: "الجودة و التطوير",
                score: roundNumber(selectedOrg?.months[selectedMonthIdx]?.GOVBM?.QD?.avgScore) || 0,
                color: "#2e8d52"
              },
              {
                name: "بيئة العمل",
                score: roundNumber(selectedOrg?.months[selectedMonthIdx]?.GOVBM?.W?.avgScore) || 0,
                color: "#00bdbb"
              }
            ],
          },
          {
            name: "المقياس الاكاديمي",
            subData: [
              {
                name: "اداء المتدرب",
                score: roundNumber(selectedOrg?.months[selectedMonthIdx]?.ACBM?.TR?.avgScore) || 0,
                color: "#aa4642"
              },
              {
                name: "البرامج التدريبية",
                score: roundNumber(selectedOrg?.months[selectedMonthIdx]?.ACBM?.TG?.avgScore) || 0,
                color: "#925515"
              }
            ],
          },
          {
            name: "الكفاءة و الفاعلية",
            subData: [
              {
                name: "المشاركة المجتمعية",
                score: roundNumber(selectedOrg?.months[selectedMonthIdx]?.GEEBM?.CP?.avgScore) || 0,
                color: "#520a9c"
              },
              {
                name: "التنمية المهنية",
                score: roundNumber(selectedOrg?.months[selectedMonthIdx]?.GEEBM?.TV?.avgScore) || 0,
                color: "#596a95"
              },
              {
                name: "الاشراف اليومي",
                score: roundNumber(selectedOrg?.months[selectedMonthIdx]?.GEEBM?.TRA) || 0,
                color: "#4f46f7"
              }
            ],
          },
        ])
      }
    }

    loadStandards();
    loadSubStandards();
  }, [watomsData, selectedOrg, selectedMonthIdx]);

  const changeOrg = (status) => {
    if (status && (arrangedOrgIdx + 1) !== arrangedOrg.length) {
      setArrangedOrgIdx(prev => prev + 1);
      setSelectedOrg(arrangedOrg[arrangedOrgIdx + 1]);
      setSelectedOrgId(arrangedOrg[arrangedOrgIdx + 1].id);
    } else if (!status && (arrangedOrgIdx) !== 0) {
      setArrangedOrgIdx(prev => prev - 1);
      setSelectedOrg(arrangedOrg[arrangedOrgIdx - 1])
      setSelectedOrgId(arrangedOrg[arrangedOrgIdx - 1].id);
    } else if (status && (arrangedOrgIdx + 1) === arrangedOrg.length) {
      setArrangedOrgIdx(0);
      setSelectedOrg(arrangedOrg[0])
      setSelectedOrgId(arrangedOrg[0].id);
    } else if (!status && (arrangedOrgIdx) === 0) {
      setArrangedOrgIdx(arrangedOrg.length - 1);
      setSelectedOrg(arrangedOrg[arrangedOrg.length - 1]);
      setSelectedOrgId(arrangedOrg[arrangedOrg.length - 1].id);
    }
  }

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
      }
    };

    // Fetch data only once when component mounts
    fetchAnnualData();
  }, []); // Empty dependency array - only run once

  useEffect(() => {
    if (selectedCenter) {
      setUploading(true);
      fetchCenterEvaluationBreakdown(selectedCenter.id)
        .then(setEvaluation)
        .finally(() => setUploading(false));
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

  // calculate overall data for each section

  const calculateAverage = (arr = []) => {
    if (!Array.isArray(arr) || arr.length === 0) return 0;
    const sum = arr.reduce((acc, cur) => acc + (cur?.average_score || 0), 0);
    return sum / arr.length;
  };

  useEffect(() => {
    if (!watomsData?.length) return;

    const summedData = structuredClone(detailedData); // deep clone
    const orgCount = watomsData.length;

    watomsData.forEach(org => {
      Object.keys(summedData.TQBM).forEach(key => {
        const section = org.TQBM?.[key];
        summedData.TQBM[key] += calculateAverage(section);
      });

      Object.keys(summedData.GOVBM).forEach(key => {
        const section = org.GOVBM?.[key];
        summedData.GOVBM[key] += calculateAverage(section);
      });

      Object.keys(summedData.ACBM).forEach(key => {
        const section = org.ACBM?.[key];
        summedData.ACBM[key] += calculateAverage(section);
      });

      Object.keys(summedData.GEEBBM).forEach(key => {
        const section = summedData.GEEBBM[key];
        if (typeof section === 'object') {
          Object.keys(section).forEach(subKey => {
            const orgSection = org.GEEBBM?.[key]?.[subKey];
            section[subKey] += calculateAverage(orgSection);
          });
        } else {
          const value = org.GEEBBM?.[key];
          if (typeof value === 'number') {
            summedData.GEEBBM[key] += value;
          }
        }
      });
    });

    const averageNestedScores = (obj) => {
      Object.keys(obj).forEach(key => {
        if (typeof obj[key] === 'object') {
          averageNestedScores(obj[key]);
        } else if (typeof obj[key] === 'number') {
          obj[key] = obj[key] / orgCount;
        }
      });
    };

    averageNestedScores(summedData);
    setDetailedData(summedData); // ✅ This triggers the second useEffect
  }, [watomsData]);

  useEffect(() => {
    setTotalScore([
      {
        name: "الكفاءة و الفاعلية",
        value: roundNumber(datasMonths[selectedMonthIdx]?.geebm || 0)
      }
    ])
    setTotalScoreDetailed([
      {
        name: "جودة التدريب",
        value: roundNumber(datasMonths[selectedMonthIdx]?.tqbm || 0)
      },
      {
        name: "مقياس الحوكمة",
        value: roundNumber(datasMonths[selectedMonthIdx]?.govbm || 0)
      },
      {
        name: "المقياس الاكاديمي",
        value: roundNumber(datasMonths[selectedMonthIdx]?.acbm || 0)
      }
    ])
  }, [selectedMonthIdx]);

  const handleProjectUnitsRankingClick = async () => {
    console.log('Project units ranking clicked');
    console.log('Selected center:', selectedCenter);

    setProjectUnitsRankingLoading(true);
    setIsProjectUnitsModalOpen(true);
  };

  // New function to handle center-specific ranking click
  const handleCenterRankingClick = async (center) => {
    setIsProjectUnitsModalOpen(true);
    setSelectedCenter(center); // Set the selected center to display its name in modal
    setSelectedOrgId(center.id);
  };

  // Remove the fallback data generation since we want real data from database
  // const generateAnnualPerformanceData = () => { ... };
  // const fallbackAnnualData = generateAnnualPerformanceData();

  if (loading) return <LoadingScreen />;

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
      {/* Navbar */}
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
        {/* WABYS and Watoms logo */}
        <div className="flex items-center gap-6 my-2">
          <img className="w-[100px] md:w-[120px] lg:w-[140px] cursor-pointer rounded-xl" src={wabysLogo} alt="Wabys Logo" onClick={() => navigate('/wabys')} />
          <div className='border-l-2 border-black p-1 h-6' />
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
          <button
            className="rounded-full w-10 h-10 flex justify-center items-center bg-white/80 hover:bg-gray-200 shadow transition-all"
            title="notification"
          >
            <FontAwesomeIcon
              icon={faBell}
              className="text-xl text-watomsBlue"
            />
          </button>
        </div>
      </div>
      {/* Page Body: left - middle - right sections*/}
      <div className="flex flex-row justify-between gap-4 relative w-[100vw] box-border" style={{
        maxHeight: `calc(100vh - ${HEADER_HEIGHT}px)`,
      }}>
        {/* يسار: الرسوم البيانية */}
        <div className="flex flex-col justify-start gap-4" style={{
          flex: '0 1 28%',
          minWidth: 320,
          maxWidth: 420,
          maxHeight: "85vh",
          padding: '1vw 0vw 0vw 1vw',
          boxSizing: 'border-box',
        }}>
          {/* Total Institutions */}
          <div style={{
            background: "#2d3347",
            borderRadius: 16,
            padding: '10px 24px 10px 24px',
            minWidth: 220,
            minHeight: 100,
            boxShadow: '0 2px 8px #0002',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12
          }}>
            <div className="flex flex-col items-center gap-2" style={{ width: '100%', textAlign: 'center', fontWeight: 700, fontSize: 15, color: '#fff', alignItems: 'center', padding: '0 8px' }}>
              <span>{'المفعل'}</span>
              <span className="rounded-full w-14 h-14 flex justify-center items-center text-xl" style={{ fontWeight: 900, color: "black", backgroundColor: '#22c55e' }}>{String(onlineCenters.length).padStart(2, '0')}</span>
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
          {/* General Ranking Chart */}
          <div
            className="rounded-2xl flex flex-col h-fit flex-1 px-5 py-2 mb-0 items-stretch"
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
              onClick={handleProjectUnitsRankingClick}
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
                .sort(([, a], [, b]) => b.overall - a.overall) // sort high → low
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
                    onClick={() => handleCenterRankingClick(c)}
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
                          width: `${Math.min(100, Math.max(0, roundNumber(watomsData?.organizations[id].overall) || 0))}%`,
                          background: modernBarGradients[id % modernBarGradients.length],
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
                      {roundNumber(watomsData?.organizations[id].overall) !== undefined ? roundNumber(watomsData?.organizations[id].overall) : 0}%
                    </div>
                  </div>
                ))}
            </div>
          </div>
          {/* Annual Performance Chart */}
          <AnnualPerformanceChart
            data={selectedOrg ? selectedOrg.months : watomsData?.total?.months}
            title="تحليل معدل تغيير الاداء للمشروع"
            loading={loading}
          />
        </div>
        {/* وسط: الخريطة والدائرة */}
        <div className="rounded-xl mt-4" style={{
          flex: '1 1 36%',
          minWidth: 260,
          background: "#2d3347",
          minHeight: 260,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}>
          <div className="text-2xl font-bold mb-5 text-amber-400">المؤشرات الإجمالية للمشروع</div>
          <div className="flex" style={{
            position: 'relative',
            width: mapWidth,
            height: mapHeight,
            maxWidth: mapWidth,
            maxHeight: mapHeight,
            minWidth: 260,
            minHeight: 260,
            margin: '0 auto',
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
                  <CircularProgressBar value={roundNumber(selectedOrg?.performance) || 0} />
                </div>
                {/* Info box */}
                <div style={{
                  position: 'absolute',
                  right: `calc(${((latLngToSvgXY(parseLatLng(selectedCenter.location)[0], parseLatLng(selectedCenter.location)[1]).x + 75) / 1054.979) * 100}% + 90px)`,
                  top: `calc(${((latLngToSvgXY(parseLatLng(selectedCenter.location)[0], parseLatLng(selectedCenter.location)[1]).y + 188.858) / 972.996) * 100}% - 40px)`,
                  background: '#c3c8d6',
                  color: '#222',
                  padding: '10px 18px',
                  borderRadius: 16,
                  fontSize: 12,
                  width: 130,
                  maxWidth: 160,
                  boxShadow: '0 4px 16px #0004',
                  zIndex: 16,
                }}>
                  <div style={{ fontWeight: 'bold', marginBottom: 4 }}>{selectedOrg?.id === "All" ? language ? selectedOrg?.en_name : selectedOrg?.ar_name : selectedOrg?.name}</div>
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
                  <div style={{ fontSize: 8, color: '#006400' }}>
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
              onClick={() => changeOrg(false)}
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
            <span className={`${selectedOrg?.id === "All" ? "font-bold text-2xl" : "text-md"}`} style={{ color: selectedOrg?.id === "All" ? "#fbbf24" : '#fff', fontWeight: 700, minWidth: 80, textAlign: 'center', letterSpacing: 1 }}>
              {selectedOrg?.id === "All" ? selectedOrg?.ar_name || '' : selectedOrg?.name || ''}
            </span>
            <button
              onClick={() => changeOrg(true)}
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
        <div className="gap-4" style={{
          flex: '0 1 28%',
          minWidth: 320,
          maxWidth: 420,
          maxHeight: "85vh",
          padding: '1vw 1vw 0vw 0vw',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'stretch',
          boxSizing: 'border-box',
        }}>
          {/* sum details */}
          <div className="p-2 gap-4 flex justify-evenly items-center" style={{
            background: "#2d3347",
            borderRadius: 16,
            minWidth: 220,
            minHeight: 60,
            boxShadow: '0 2px 8px #0002',
          }}>
            <div className="flex justify-center items-center">
              <div className="text-3xl w-fit">{watomsData?.total.no_of_trainees}</div>
              <div className="text-xs text-end w-fit">عدد المتدربين بالمراكز</div>
            </div>
            <div className='border-l-2 border-white h-3/4' />
            <div className="flex justify-center items-center">
              <div className="text-3xl w-fit">{watomsData?.totalCurriculums}</div>
              <div className="text-xs text-end w-1/2">عدد البرامج التدريبية</div>
            </div>
            <div className='border-l-2 border-white h-3/4' />
            <div className="flex justify-center items-center">
              <div className="text-3xl w-fit">78%</div>
              <div className="text-xs text-end w-fit">نسبة التشغيل للخريجين</div>
            </div>
          </div>
          {/* إجمالي نسبة تقييم المراكز المفعلة */}
          {/* <div className="flex flex-col rounded-xl" style={{
            backgroundColor: "#2d3347"
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 16,
              minWidth: 220,
              minHeight: 250,
              gap: 10,
            }}>
              <div style={{
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
              <div style={{ fontWeight: 600, fontSize: 15, color: '#e0c77c' }}>
                المتوسط العام لتقييم المشروع
              </div>
              <div className="flex flex-row gap-8 justify-between">
                <div className="flex flex-col items-start gap-1">
                  <p className="text-sm">(233) ممارسة و دليل</p>
                  <p className="text-sm">(143) مؤشر اداء</p>
                  <p className="text-sm">(49) معيار فرعي</p>
                  <p className="text-sm">(45) اداة جمع بيانات</p>
                  <p className="text-sm">(11) مجال</p>
                  <p className="text-sm">(4) مؤشرات مرجعية (benchmarks)</p>
                </div>
                <CircularProgressBar value={fullNumber(datasMonths[selectedMonthIdx]?.performance || 0)} size={150} color='url(#circularBlueGradient)' bg='#23263a' textColor='#fff' />
              </div>
            </div>
            <div style={{
              borderRadius: 16,
              padding: 10,
              marginTop: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'stretch',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none' }} />
              <div style={{ position: 'relative', zIndex: 2 }}>
                {totalScoreDetailed && totalScore && (
                  <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', minHeight: 90, gap: 30 }}>
                    <div className="flex justify-center">
                      {totalScoreDetailed.map((item, i) => (
                        <div
                          className="mx-2"
                          key={item.name || `cat${i}`}
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            minWidth: 40,
                            width: item.name === "جودة التدريب" ? 40 : 50,
                          }}
                        >
                          <div style={{ fontWeight: 700, fontSize: 11, color: '#fff', marginBottom: 4 }}>{item.value}%</div>
                          <div style={{ width: 20, height: 54, background: '#444652', borderRadius: 8, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', marginBottom: 0, paddingBottom: 0 }}>
                            <div style={{ width: '100%', height: `${item.value}%`, background: modernBarGradients[i % modernBarGradients.length], borderRadius: 8, transition: 'height 0.7s cubic-bezier(.4,2,.6,1)', position: 'absolute', bottom: 0, left: 0 }} />
                          </div>
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
                    <div className='border-r-2 border-white p-1 h-8' />
                    <div
                      key={totalScore[0].name || `cat 3`}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        minWidth: 44,
                      }}
                    >
                      <div style={{ fontWeight: 700, fontSize: 11, color: '#fff', marginBottom: 4 }}>{totalScore[0].value}%</div>
                      <div style={{ width: 20, height: 54, background: '#444652', borderRadius: 8, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', marginBottom: 0, paddingBottom: 0 }}>
                        <div style={{ width: '100%', height: `${totalScore[0].value}%`, background: modernBarGradients[3 % modernBarGradients.length], borderRadius: 8, transition: 'height 0.7s cubic-bezier(.4,2,.6,1)', position: 'absolute', bottom: 0, left: 0 }} />
                      </div>
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
                        }} title={totalScore[0].name || 'تصنيف'}>{totalScore[0].name || 'تصنيف'}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div> */}
          <div className="flex flex-col rounded-xl w-full gap-7" style={{
            backgroundColor: "#2d3347"
          }}>
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
            <div className="rounded-xl py-2 px-3">
              {/* Title */}
              <h3 className="text-md font-bold text-white mb-2 text-center">
                {language ? 'Performance Standards Evaluation' : 'تقييم معايير الاداء'}
              </h3>
              <div className="flex items-center justify-between gap-2">
                {/* Overall Score Circle */}
                <div className="flex flex-col items-center justify-center p-2">
                  <CircularProgressBar value={roundNumber(arrangedOrg[arrangedOrgIdx]?.months[selectedMonthIdx]?.performance || 0)} size={100} color='url(#circularBlueGradient)' bg='#23263a' textColor='#fff' />
                  <span className='text-white'>الكفاءة و الفاعلية</span>
                </div>
                {/* Performance Bars */}
                <div className="flex flex-col flex-1 gap-1 my-2">
                  {orgStandards
                    ?.slice()
                    .sort((a, b) => b.score - a.score)
                    .map((s) => (
                      <div className='flex justify-between items-center mb-1 gap-2'>
                        <span className="text-sm font-bold text-white w-1/5">{s.score}%</span>
                        <div className="w-3/5 bg-white rounded-full h-4 relative">
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
                        <span className="text-sm font-medium text-white w-1/5">{s.name}</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
            <div>
              <div className='flex'>
                {orgSubStandards.map((s, i) => (
                  <div className=' flex w-1/4'>
                    <div className='flex flex-col w-full gap-1'>
                      <div className='flex justify-center w-full'>
                        {s.subData.map((item, i) =>
                          <div
                            className="flex-1"
                            key={item.name || `cat${i}`}
                            style={{
                              maxWidth: `20%`,
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
                                width: `80%`,
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
                      <h1 className='text-white text-center text-xs border-t-2 border-white py-2'>{s.name}</h1>
                    </div>
                    {orgSubStandards.length !== i + 1 && <div className='border-l-2 border-white h-[85%]' />}
                  </div>
                ))}
              </div>
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
                    selectedCategory === 'TQBM' && evaluation?.TQBM?.[item.key] != null ? `${Math.round(evaluation.TQBM[item.key] * 100)}%` :
                      selectedCategory === 'APBM' && evaluation?.APBM?.[item.key] != null ? `${Math.round(evaluation.APBM[item.key] * 100)}%` :
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
        loading={projectUnitsRankingLoading}
        centerInfo={selectedCenter}
        watomsData={watomsData}
        selectedId={selectedOrgId}
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