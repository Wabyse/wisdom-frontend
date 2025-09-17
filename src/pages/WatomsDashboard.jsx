import React, { useEffect, useState } from "react";
import { fetchCenters, fetchWatomsDetailsData } from "../services/dashboard";
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
// import Uploading from "../components/Uploading";
import LoadingScreen from "../components/LoadingScreen";
import { INSTITUTION_NO_CURRICULUMS, ORG_MANAGER_IMG, WATOMS_UNPREPARED_DATA } from "../constants/constants";
import { roundNumber } from "../utils/roundNumber";
import Egypt from "../components/Egypt";
import molLogo from '../assets/Gov.png';
import ebdaeduLogo from '../assets/ebad-edu.png';
import WatomsDashboardSubDataDetails from "../components/WatomsDashboardSubDataDetails";

const HEADER_HEIGHT = 60;

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
  const navigate = useNavigate();
  const { userInfo } = useAuth();
  const { language } = useLanguage();
  const isFullScreen = useFullScreen();
  const [watomsData, setWatomsData] = useState([]);
  const [centers, setCenters] = useState([]);
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [projectUnitsRankingLoading, setProjectUnitsRankingLoading] = useState(false);
  const [isProjectUnitsModalOpen, setIsProjectUnitsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  // const [uploading, setUploading] = useState(false);
  const [datasMonths, setDatasMonths] = useState([]);
  const [selectedOrgId, setSelectedOrgId] = useState(null);
  const [orgStandards, setOrgStandards] = useState([]);
  const [orgSubStandards, setOrgSubStandards] = useState([]);
  const [orgSubSubStandards, setOrgSubSubStandards] = useState([]);
  const [managerImg, setManagerImg] = useState(null);
  const [orgImg, setOrgImg] = useState(null);
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
  const [selectedMonth, setSelectedMonth] = useState({});
  const [selectedMonthIdx, setSelectedMonthIdx] = useState({});
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [arrangedOrg, setArrangedOrg] = useState([]);
  const [arrangedOrgIdx, setArrangedOrgIdx] = useState();
  const [orgRank, setOrgRank] = useState();
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [subDataDetails, setSubDataDetails] = useState("");


  useEffect(() => {
    const loadProjects = () => {
      setProjects(['مشروع وزارة العمل', 'مشروع اختبار'])
    }

    loadProjects();
  }, []);

  useEffect(() => {

  }, [selectedProject])

  // get org's rank due to month
  useEffect(() => {
    const changeRankedOrg = () => {
      const rankingOrgs = Object.entries(watomsData?.organizations || {})
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
      const selectedOrgIdx = rankingOrgs.findIndex(org => org[1].id === selectedOrg?.id)
      setOrgRank(selectedOrgIdx + 1);
    }
    changeRankedOrg();
  }, [selectedOrg, arrangedOrg, selectedMonthIdx, watomsData])

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
        console.log(watomsDataArray)
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
            score: roundNumber(selectedOrg?.months[selectedMonthIdx]?.TQBM?.totalTQBM) || 0,
            subData: [
              {
                name: "البرامج التدريبية",
                score: roundNumber(selectedOrg?.months[selectedMonthIdx]?.TQBM?.TG?.avgScore) || 0,
                codes: selectedOrg?.months[selectedMonthIdx]?.TQBM?.TG?.codeScores || [],
                scores: selectedOrg?.months[selectedMonthIdx]?.TQBM?.TG?.scores || [],
                no_of_forms: selectedOrg?.months[selectedMonthIdx]?.TQBM?.TG?.no_of_forms || 0,
                color: "#3b82f6"
              },
              {
                name: "بيئة التدريب",
                score: roundNumber(watomsDataArray[0]?.months[response.total.months.length - 1]?.TQBM?.TE?.avgScore) || 0,
                codes: selectedOrg?.months[selectedMonthIdx]?.TQBM?.TE?.codeScores || [],
                scores: selectedOrg?.months[selectedMonthIdx]?.TQBM?.TE?.scores || [],
                no_of_forms: selectedOrg?.months[selectedMonthIdx]?.TQBM?.TE?.no_of_forms || 0,
                color: "#16a34a"
              },
              {
                name: "اداء المدرب",
                score: roundNumber(watomsDataArray[0]?.months[response.total.months.length - 1]?.TQBM?.T?.avgScore) || 0,
                codes: selectedOrg?.months[selectedMonthIdx]?.TQBM?.T?.codeScores || [],
                scores: selectedOrg?.months[selectedMonthIdx]?.TQBM?.T?.scores || [],
                no_of_forms: selectedOrg?.months[selectedMonthIdx]?.TQBM?.T?.no_of_forms || 0,
                color: "#a855f7"
              }
            ],
          },
          {
            name: "مقياس الحوكمة",
            score: roundNumber(selectedOrg?.months[selectedMonthIdx]?.GOVBM?.totalGOVBM) || 0,
            subData: [
              {
                name: "الاداء المؤسسي",
                score: roundNumber(watomsDataArray[0]?.months[response.total.months.length - 1]?.GOVBM?.IP?.avgScore) || 0,
                codes: selectedOrg?.months[selectedMonthIdx]?.GOVBM?.IP?.codeScores || [],
                scores: selectedOrg?.months[selectedMonthIdx]?.GOVBM?.IP?.scores || [],
                no_of_forms: selectedOrg?.months[selectedMonthIdx]?.GOVBM?.IP?.no_of_forms || 0,
                color: "#2e6f00"
              },
              {
                name: "الرقمنة",
                score: roundNumber(watomsDataArray[0]?.months[response.total.months.length - 1]?.GOVBM?.DD?.avgScore) || 0,
                codes: selectedOrg?.months[selectedMonthIdx]?.GOVBM?.DD?.codeScores || [],
                scores: selectedOrg?.months[selectedMonthIdx]?.GOVBM?.DD?.scores || [],
                no_of_forms: selectedOrg?.months[selectedMonthIdx]?.GOVBM?.DD?.no_of_forms || 0,
                color: "#e43002"
              },
              {
                name: "التخطيط و التشغيل",
                score: roundNumber(watomsDataArray[0]?.months[response.total.months.length - 1]?.GOVBM?.PO?.avgScore) || 0,
                codes: selectedOrg?.months[selectedMonthIdx]?.GOVBM?.PO?.codeScores || [],
                scores: selectedOrg?.months[selectedMonthIdx]?.GOVBM?.PO?.scores || [],
                no_of_forms: selectedOrg?.months[selectedMonthIdx]?.GOVBM?.PO?.no_of_forms || 0,
                color: "#88a064"
              },
              {
                name: "الجودة و التطوير",
                score: roundNumber(watomsDataArray[0]?.months[response.total.months.length - 1]?.GOVBM?.QD?.avgScore) || 0,
                codes: selectedOrg?.months[selectedMonthIdx]?.GOVBM?.QD?.codeScores || [],
                scores: selectedOrg?.months[selectedMonthIdx]?.GOVBM?.QD?.scores || [],
                no_of_forms: selectedOrg?.months[selectedMonthIdx]?.GOVBM?.QD?.no_of_forms || 0,
                color: "#2e8d52"
              },
              {
                name: "بيئة العمل",
                score: roundNumber(watomsDataArray[0]?.months[response.total.months.length - 1]?.GOVBM?.W?.avgScore) || 0,
                codes: selectedOrg?.months[selectedMonthIdx]?.GOVBM?.W?.codeScores || [],
                scores: selectedOrg?.months[selectedMonthIdx]?.GOVBM?.W?.scores || [],
                no_of_forms: selectedOrg?.months[selectedMonthIdx]?.GOVBM?.W?.no_of_forms || 0,
                color: "#00bdbb"
              }
            ],
          },
          {
            name: "المقياس الاكاديمي",
            score: roundNumber(selectedOrg?.months[selectedMonthIdx]?.ACBM?.totalACBM) || 0,
            subData: [
              {
                name: "اداء المتدرب",
                score: roundNumber(watomsDataArray[0]?.months[response.total.months.length - 1]?.ACBM?.TR?.avgScore) || 0,
                codes: selectedOrg?.months[selectedMonthIdx]?.ACBM?.TR?.codeScores || [],
                scores: selectedOrg?.months[selectedMonthIdx]?.ACBM?.TR?.scores || [],
                no_of_forms: selectedOrg?.months[selectedMonthIdx]?.ACBM?.TR?.no_of_forms || 0,
                color: "#aa4642"
              },
              {
                name: "البرامج التدريبية",
                score: roundNumber(watomsDataArray[0]?.months[response.total.months.length - 1]?.ACBM?.TG?.avgScore) || 0,
                codes: selectedOrg?.months[selectedMonthIdx]?.ACBM?.TG?.codeScores || [],
                scores: selectedOrg?.months[selectedMonthIdx]?.ACBM?.TG?.scores || [],
                no_of_forms: selectedOrg?.months[selectedMonthIdx]?.ACBM?.TG?.no_of_forms || 0,
                color: "#925515"
              }
            ],
          },
          {
            name: "الكفاءة و الفاعلية",
            score: roundNumber(selectedOrg?.months[selectedMonthIdx]?.GEEBM?.totalGEEBM) || 0,
            subData: [
              {
                name: "المشاركة المجتمعية",
                score: roundNumber(watomsDataArray[0]?.months[response.total.months.length - 1]?.GEEBM?.CP?.avgScore) || 0,
                codes: selectedOrg?.months[selectedMonthIdx]?.GEEBM?.CP?.codeScores || [],
                scores: selectedOrg?.months[selectedMonthIdx]?.GEEBM?.CP?.scores || [],
                no_of_forms: selectedOrg?.months[selectedMonthIdx]?.GEEBM?.CP?.no_of_forms || 0,
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
        setSelectedMonth(datasMonths[selectedMonthIdx - 1]);
        setSelectedMonthIdx(prev => prev - 1);
      }
    }
  }

  useEffect(() => {
    const loadStandards = () => {

      if ((selectedMonthIdx || selectedMonthIdx === 0) && watomsData.length !== 0) {
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
      if ((selectedMonthIdx || selectedMonthIdx === 0) && watomsData.length !== 0) {
        setOrgSubStandards([
          {
            name: "جودة التدريب",
            score: roundNumber(selectedOrg?.months[selectedMonthIdx]?.TQBM?.totalTQBM) || 0,
            subData: [
              {
                name: "البرامج التدريبية",
                score: roundNumber(selectedOrg?.months[selectedMonthIdx]?.TQBM?.TG?.avgScore) || 0,
                codes: selectedOrg?.months[selectedMonthIdx]?.TQBM?.TG?.codeScores || [],
                scores: selectedOrg?.months[selectedMonthIdx]?.TQBM?.TG?.scores || [],
                no_of_forms: selectedOrg?.months[selectedMonthIdx]?.TQBM?.TG?.no_of_forms || 0,
                color: "#3b82f6"
              },
              {
                name: "بيئة التدريب",
                score: roundNumber(selectedOrg?.months[selectedMonthIdx]?.TQBM?.TE?.avgScore) || 0,
                codes: selectedOrg?.months[selectedMonthIdx]?.TQBM?.TE?.codeScores || [],
                scores: selectedOrg?.months[selectedMonthIdx]?.TQBM?.TE?.scores || [],
                no_of_forms: selectedOrg?.months[selectedMonthIdx]?.TQBM?.TE?.no_of_forms || 0,
                color: "#16a34a"
              },
              {
                name: "اداء المدرب",
                score: roundNumber(selectedOrg?.months[selectedMonthIdx]?.TQBM?.T?.avgScore) || 0,
                codes: selectedOrg?.months[selectedMonthIdx]?.TQBM?.T?.codeScores || [],
                scores: selectedOrg?.months[selectedMonthIdx]?.TQBM?.T?.scores || [],
                no_of_forms: selectedOrg?.months[selectedMonthIdx]?.TQBM?.T?.no_of_forms || 0,
                color: "#a855f7"
              }
            ],
          },
          {
            name: "مقياس الحوكمة",
            score: roundNumber(selectedOrg?.months[selectedMonthIdx]?.GOVBM?.totalGOVBM) || 0,
            subData: [
              {
                name: "الاداء المؤسسي",
                score: roundNumber(selectedOrg?.months[selectedMonthIdx]?.GOVBM?.IP?.avgScore) || 0,
                codes: selectedOrg?.months[selectedMonthIdx]?.GOVBM?.IP?.codeScores || [],
                scores: selectedOrg?.months[selectedMonthIdx]?.GOVBM?.IP?.scores || [],
                no_of_forms: selectedOrg?.months[selectedMonthIdx]?.GOVBM?.IP?.no_of_forms || 0,
                color: "#2e6f00"
              },
              {
                name: "الرقمنة",
                score: roundNumber(selectedOrg?.months[selectedMonthIdx]?.GOVBM?.DD?.avgScore) || 0,
                codes: selectedOrg?.months[selectedMonthIdx]?.GOVBM?.DD?.codeScores || [],
                scores: selectedOrg?.months[selectedMonthIdx]?.GOVBM?.DD?.scores || [],
                no_of_forms: selectedOrg?.months[selectedMonthIdx]?.GOVBM?.DD?.no_of_forms || 0,
                color: "#e43002"
              },
              {
                name: "التخطيط و التشغيل",
                score: roundNumber(selectedOrg?.months[selectedMonthIdx]?.GOVBM?.PO?.avgScore) || 0,
                codes: selectedOrg?.months[selectedMonthIdx]?.GOVBM?.PO?.codeScores || [],
                scores: selectedOrg?.months[selectedMonthIdx]?.GOVBM?.PO?.scores || [],
                no_of_forms: selectedOrg?.months[selectedMonthIdx]?.GOVBM?.PO?.no_of_forms || 0,
                color: "#88a064"
              },
              {
                name: "الجودة و التطوير",
                score: roundNumber(selectedOrg?.months[selectedMonthIdx]?.GOVBM?.QD?.avgScore) || 0,
                codes: selectedOrg?.months[selectedMonthIdx]?.GOVBM?.QD?.codeScores || [],
                scores: selectedOrg?.months[selectedMonthIdx]?.GOVBM?.QD?.scores || [],
                no_of_forms: selectedOrg?.months[selectedMonthIdx]?.GOVBM?.QD?.no_of_forms || 0,
                color: "#2e8d52"
              },
              {
                name: "بيئة العمل",
                score: roundNumber(selectedOrg?.months[selectedMonthIdx]?.GOVBM?.W?.avgScore) || 0,
                codes: selectedOrg?.months[selectedMonthIdx]?.GOVBM?.W?.codeScores || [],
                scores: selectedOrg?.months[selectedMonthIdx]?.GOVBM?.W?.scores || [],
                no_of_forms: selectedOrg?.months[selectedMonthIdx]?.GOVBM?.W?.no_of_forms || 0,
                color: "#00bdbb"
              }
            ],
          },
          {
            name: "المقياس الاكاديمي",
            score: roundNumber(selectedOrg?.months[selectedMonthIdx]?.ACBM?.totalACBM) || 0,
            subData: [
              {
                name: "اداء المتدرب",
                score: roundNumber(selectedOrg?.months[selectedMonthIdx]?.ACBM?.TR?.avgScore) || 0,
                codes: selectedOrg?.months[selectedMonthIdx]?.ACBM?.TR?.codeScores || [],
                scores: selectedOrg?.months[selectedMonthIdx]?.ACBM?.TR?.scores || [],
                no_of_forms: selectedOrg?.months[selectedMonthIdx]?.ACBM?.TR?.no_of_forms || 0,
                color: "#aa4642"
              },
              {
                name: "البرامج التدريبية",
                score: roundNumber(selectedOrg?.months[selectedMonthIdx]?.ACBM?.TG?.avgScore) || 0,
                codes: selectedOrg?.months[selectedMonthIdx]?.ACBM?.TG?.codeScores || [],
                scores: selectedOrg?.months[selectedMonthIdx]?.ACBM?.TG?.scores || [],
                no_of_forms: selectedOrg?.months[selectedMonthIdx]?.ACBM?.TG?.no_of_forms || 0,
                color: "#925515"
              }
            ],
          },
          {
            name: "الكفاءة و الفاعلية",
            score: roundNumber(selectedOrg?.months[selectedMonthIdx]?.GEEBM?.totalGEEBM) || 0,
            subData: [
              {
                name: "المشاركة المجتمعية",
                score: roundNumber(selectedOrg?.months[selectedMonthIdx]?.GEEBM?.CP?.avgScore) || 0,
                codes: selectedOrg?.months[selectedMonthIdx]?.GEEBM?.CP?.codeScores || [],
                scores: selectedOrg?.months[selectedMonthIdx]?.GEEBM?.CP?.scores || [],
                no_of_forms: selectedOrg?.months[selectedMonthIdx]?.GEEBM?.CP?.no_of_forms || 0,
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

  useEffect(() => {
    const changeManagerImg = () => {
      setManagerImg(ORG_MANAGER_IMG.filter(mng => mng.id === selectedOrg?.id)[0]?.img);
      setOrgImg(ORG_MANAGER_IMG.filter(mng => mng.id === selectedOrg?.id)[0]?.org);
    }

    changeManagerImg();
  }, [selectedOrg])

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
    });
  }, []);

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
          <img className="w-[100px] md:w-[120px] lg:w-[140px] cursor-pointer rounded-xl" src={wabysLogo} alt="Wabys Logo" onClick={() => userInfo?.code !== 1452 ? navigate('/wabys') : navigate('/login') } />
          <div className='border-l-2 border-black p-1 h-6' />
          <img className="w-[70px] md:w-[70px] lg:w-[70px]" src={ebdaeduLogo} alt="ebda edu Logo" />
          <div className='border-l-2 border-black p-1 h-6' />
          <img className="w-[70px] md:w-[70px] lg:w-[70px]" src={molLogo} alt="mol Logo" />
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
          <div className="flex justify-center items-center bg-[#bdbdbd] px-2 rounded-full w-52">
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="text-black bg-[#bdbdbd] max-h-8 h-8 text-xs flex justify-center w-full items-center py-1"
              dir="rtl"
            >
              <option value="" disabled>الرجاء اختيار مشروع</option>
              {projects.map((project, i) => (
                <option key={`${project}-${i}`} value={project}>
                  {project}
                </option>
              ))}
            </select>
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
      <div className="flex flex-row justify-between gap-4 relative w-full box-border" style={{
        maxHeight: `calc(100vh - ${HEADER_HEIGHT}px)`,
      }}>
        {/* يسار: الرسوم البيانية */}
        <div className="flex flex-col justify-start gap-4 w-1/3" style={{
          flex: '0 1 28%',
          minWidth: 320,
          maxWidth: 420,
          maxHeight: "85vh",
          padding: '1vw 0vw 0vw 1vw',
          boxSizing: 'border-box',
        }}>
          {selectedOrg?.id !== "All" ?
            <div className="flex flex-col min-h-80 max-h-80 rounded-2xl bg-[#2d3347]">
              <div className="flex py-2 justify-evenly items-center">
                {/* Org's Rank */}
                <div className="relative h-16 flex items-center justify-center w-1/4">
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
                {/* Org's Manager info */}
                <div className="flex flex-col justify-center items-center gap-2 w-1/2">
                  <div className="bg-gray-700 text-white p-2 w-full text-center">{`مدير ${selectedOrg?.name}`}</div>
                  <div className="bg-gray-700 text-white p-2 w-full text-center">{selectedOrg?.managerFirstName} {selectedOrg?.managerMiddleName} {selectedOrg?.managerLastName}</div>
                </div>
                <img className="w-1/4 p-2 rounded-2xl" src={managerImg} alt="" />
              </div>
              {/* Org's img */}
              {orgImg !== "" ? <img className="w-full px-2 h-fit max-h-48 rounded-2xl" src={orgImg} alt="" /> :
                <div className="p-4 w-full h-full"><div className="rounded-2xl border-2 border-blue-500 shadow-lg shadow-blue-400 w-full h-full" /></div>}
            </div> :
            <div className="flex flex-col justify-start gap-4 min-h-80">
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
                className="rounded-2xl flex flex-col h-fit max-h-48 px-5 py-2 mb-0 items-stretch"
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
                          {roundNumber(watomsData?.organizations[id].months[selectedMonthIdx]?.performance || 0) !== undefined ? roundNumber(watomsData?.organizations[id].months[selectedMonthIdx]?.performance || 0) : 0}%
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          }
          {/* Monthly Chart */}
          <AnnualPerformanceChart
            data={selectedOrg ? selectedOrg.months : watomsData?.total?.months}
            title={`تحليل معدل تغيير الاداء ${selectedOrg?.id === "All" ? "للمشروع" : selectedOrg?.name}`}
            loading={loading}
          />
        </div>
        {/* وسط: الخريطة والدائرة */}
        <div className="rounded-xl mt-4 w-1/3 py-2" style={{
          flex: '1 1 36%',
          background: "#2d3347",
          minHeight: 260,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}>
          {/* Title */}
          <div className="text-2xl font-bold text-amber-400">المؤشرات الإجمالية {selectedOrg?.id === "All" ? selectedProject === "" ? "لمشروع" : `ل${selectedProject}` : selectedOrg?.name}</div>
          <div className="flex" style={{
            position: 'relative',
            width: "95%",
            height: 360,
            maxWidth: "95%",
            maxHeight: 400,
            minWidth: 260,
            minHeight: 260,
            margin: '0 auto',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {selectedOrg?.id === "All" && <div className="text-xs self-end pb-4 absolute left-28">
              <p className="flex gap-2"><p>(049)</p><p>معيار فرعي</p></p>
              <p className="flex gap-2"><p>(143)</p><p>مؤشر اداء</p></p>
              <p className="flex gap-2"><p>(233)</p><p>ممارسة و دليل</p></p>
            </div>}
            <Egypt
              width={400}
              height={340}
              ids={selectedOrg?.id === "All" ? [4, 5, 7, 8, 9] : selectedOrg?.id || watomsData?.total?.id}
              markerSrc={require("../assets/marker.png")}  // or import pin from "..."; markerSrc={pin}
              markerSize={80}
              showLabels
            />
            {selectedOrg?.id === "All" && <div className="text-xs self-end pb-4 absolute right-28">
              <p className="flex gap-2 justify-end"><p>مؤشرات مرجعية</p><p>(04)</p></p>
              <p className="flex gap-2 justify-end"><p>مجال عام</p><p>(11)</p></p>
              <p className="flex gap-2 justify-end"><p>اداة جمع بيانات</p><p>(45)</p></p>
            </div>}
            {/* Selected center evaluation circle with arrow and info box */}
            {selectedCenter && (
              <>
                {/* Evaluation circle as circular progress bar */}
                <div style={{
                  position: 'absolute',
                  right: `40px`,
                  top: `30px`,
                  width: arrangedOrg[arrangedOrgIdx]?.id === "All" ? 100 : 64,
                  height: arrangedOrg[arrangedOrgIdx]?.id === "All" ? 100 : 64,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 15,
                  background: 'none',
                  boxShadow: '0 0 15px #0af8',
                }}>
                  <CircularProgressBar value={roundNumber(arrangedOrg[arrangedOrgIdx]?.months[selectedMonthIdx]?.performance || 0) || 0} size={arrangedOrg[arrangedOrgIdx]?.id === "All" ? 100 : 64} />
                </div>
                {/* Info box */}
                {selectedOrg?.id !== "All" && <div style={{
                  position: 'absolute',
                  left: `25px`,
                  bottom: `40px`,
                  background: '#c3c8d6',
                  color: '#222',
                  padding: '10px 15px',
                  borderRadius: 16,
                  fontSize: 12,
                  width: 125,
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
                </div>}
              </>
            )}
          </div>
          <div className="px-2 w-full">
            <div className="w-full overflow-hidden rounded-xl border border-slate-200/70 bg-[#5268b1] shadow-sm">
              <table className="w-full table-fixed" dir="rtl">
                <thead>
                  <tr className="bg-[#5268b1] border-b border-blue-200/60 text-white text-xs">
                    <th className="py-2 text-center font-semibold">اجمالي الموظفين</th>
                    <th className="py-2 text-center font-semibold border-r-2 border-white">الاداريين</th>
                    <th className="py-2 text-center font-semibold">المشرفين</th>
                    <th className="py-2 text-center font-semibold">المدربين</th>
                    <th className="py-2 text-center font-semibold border-r-2 border-white">الورش</th>
                    <th className="py-2 text-center font-semibold">المعامل</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  <tr className="bg-[#2f417a] hover:bg-slate-50 transition-colors">
                    <td className="py-2 text-center">
                      <span className={`inline-flex items-center justify-center min-w-[2.25rem] px-2 h-6 rounded-full
            ${(selectedOrg?.no_of_employees ?? 0) > 0 ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-black'}`}>
                        {WATOMS_UNPREPARED_DATA[selectedOrg.id].employees ?? 0}
                      </span>
                    </td>

                    <td className="py-2 text-center border-r-2 border-white">
                      <span className={`inline-flex items-center justify-center min-w-[2.25rem] px-2 h-6 rounded-full
            ${(selectedOrg?.no_of_employees ?? 0) > 0 ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-black'}`}>
                        {WATOMS_UNPREPARED_DATA[selectedOrg.id].admins ?? 0}
                      </span>
                    </td>

                    <td className="py-2 text-center">
                      <span className={`inline-flex items-center justify-center min-w-[2.25rem] px-2 h-6 rounded-full
            ${(selectedOrg?.no_of_employees ?? 0) > 0 ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-black'}`}>
                        {WATOMS_UNPREPARED_DATA[selectedOrg.id].supervisors ?? 0}
                      </span>
                    </td>

                    <td className="py-2 text-center">
                      <span className={`inline-flex items-center justify-center min-w-[2.25rem] px-2 h-6 rounded-full
            ${(selectedOrg?.no_of_employees ?? 0) > 0 ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-black'}`}>
                        {WATOMS_UNPREPARED_DATA[selectedOrg.id].trainers ?? 0}
                      </span>
                    </td>

                    <td className="py-2 text-center border-r-2 border-white">
                      <span className={`inline-flex items-center justify-center min-w-[2.25rem] px-2 h-6 rounded-full
            ${(selectedOrg?.no_of_employees ?? 0) > 0 ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-black'}`}>
                        {WATOMS_UNPREPARED_DATA[selectedOrg.id].workShops ?? 0}
                      </span>
                    </td>

                    <td className="py-2 text-center">
                      <span className={`inline-flex items-center justify-center min-w-[2.25rem] px-2 h-6 rounded-full
            ${(selectedOrg?.no_of_employees ?? 0) > 0 ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-black'}`}>
                        {WATOMS_UNPREPARED_DATA[selectedOrg.id].labs ?? 0}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
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
        <div className="gap-6 w-1/3" style={{
          flex: '0 1 28%',
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
              <div className="text-3xl w-fit">{selectedOrg?.id === "All" ? watomsData?.total.no_of_trainees : selectedOrg?.no_of_trainees}</div>
              <div className="text-xs text-end w-fit">عدد المتدربين</div>
            </div>
            <div className='border-l-2 border-white h-3/4' />
            <div className="flex justify-center items-center gap-1">
              <div className="text-3xl w-fit">{selectedOrg?.id === "All" ? watomsData?.totalCurriculums : INSTITUTION_NO_CURRICULUMS[selectedOrg?.id].length}</div>
              <div className="text-xs text-end w-1/2">عدد التخصصات</div>
            </div>
            <div className='border-l-2 border-white h-3/4' />
            <div className="flex justify-center items-center">
              <div className="text-3xl w-fit">0%</div>
              <div className="text-xs text-end w-fit">نسبة تسرب المتدربين</div>
            </div>
          </div>
          <div className="flex flex-col rounded-xl w-full gap-7 py-7" style={{
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
                <div className="flex flex-col items-center justify-center p-2 cursor-pointer" onClick={() => selectedOrg?.id !== "All" && userInfo?.code !== 1452 ? setSubDataDetails("الكفاءة و الفاعلية") : null}>
                  <CircularProgressBar value={roundNumber(arrangedOrg[arrangedOrgIdx]?.months[selectedMonthIdx]?.performance || 0)} size={100} color='url(#circularBlueGradient)' bg='#23263a' textColor='#fff' />
                  <span className='text-white mt-2'>الكفاءة و الفاعلية</span>
                </div>
                {/* Performance Bars */}
                <div className="flex flex-col flex-1 gap-1 my-2">
                  {orgStandards
                    ?.slice()
                    .sort((a, b) => b.score - a.score)
                    .map((s) => (
                      <div className='flex justify-between items-center mb-1'>
                        <span className="text-sm font-bold text-white w-fit px-1">{s.score}%</span>
                        <div
                          className="min-w-3/5 max-w-3/5 w-3/5 cursor-pointer"
                          style={{
                            height: 22,
                            background: '#444652',
                            borderRadius: 18,
                            boxShadow: '0 2px 8px #0002',
                            position: 'relative',
                            overflow: 'hidden',
                            transition: 'box-shadow 0.2s ease',
                          }}
                          onClick={() => selectedOrg?.id !== "All" && userInfo?.code !== 1452 ? setSubDataDetails(s.name) : null}
                        >
                          {/* Bar fill */}
                          <div
                            className="h-4 rounded-full"
                            style={{
                              height: '100%',
                              width: `${s.score}%`,
                              background: s.color,
                              transition: 'width 0.7s cubic-bezier(.4,2,.6,1)',
                            }}
                          />
                        </div>
                        <span className="min-w-1/5 max-w-1/5 w-1/5 text-xs font-medium text-white text-center">{s.name}</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
            {/* data's and sub-data's section */}
            <div>
              <div className='flex'>
                {/* each data's section */}
                {orgSubStandards.map((s, i) => (
                  <div className=' flex w-1/4'>
                    <div className='flex flex-col w-full gap-1'>
                      <div className='flex justify-center w-full px-1'>
                        {/* percentage bar for each sub data */}
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
                              className="relative flex items-end justify-center w-[80%] bg-[#444652] overflow-hidden mb-0 pb-0"
                              style={{
                                height: 85,
                                borderRadius: 8,
                              }}
                            >
                              {/* colored bar fill */}
                              <div
                                className={`w-full bottom-0 left-0 absolute`}
                                style={{
                                  backgroundColor: item.color,
                                  height: item.score,
                                  borderRadius: 8,
                                  transition: "height 0.7s cubic-bezier(.4,2,.6,1)",
                                }}
                              />

                              {/* vertical text inside the bar */}
                              <span className="flex justify-center items-center text-center font-cold text-white absolute pointer-events-none inset-0 [writing-mode:vertical-rl] [text-orientation:mixed] rotate-180 text-[8px]">
                                {item.name}
                              </span>
                            </div>
                          </div>)}
                      </div>
                      {/* the data's title and top separater between it and the sub data's related to it */}
                      <div className={`border-t-2 border-white h-[85%] ${(i + 1 === orgSubStandards.length) && "w-[90%]"} ${(i === 0) && "w-[90%] self-end"}`} />
                      <h1 className='text-white text-center text-[10px] py-2'>{s.name}</h1>
                    </div>
                    {/* white line separating the data's title */}
                    {orgSubStandards.length !== i + 1 && <div className='border-l-2 border-white h-[90%]' />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Project Units Ranking Modal */}
      <ProjectUnitsRankingModal
        isOpen={isProjectUnitsModalOpen}
        onClose={() => setIsProjectUnitsModalOpen(false)}
        loading={projectUnitsRankingLoading}
        centerInfo={selectedCenter}
        watomsData={watomsData}
        selectedId={selectedOrgId}
      />
      {/* sub data's detail popup */}
      <WatomsDashboardSubDataDetails
        isOpen={subDataDetails !== ""}
        onClose={() => setSubDataDetails("")}
        selectedMonthIdx={selectedMonthIdx}
        toggleMonth={toggleMonth}
        selectedMonth={selectedMonth}
        datasMonths={datasMonths}
        arrangedOrg={arrangedOrg}
        arrangedOrgIdx={arrangedOrgIdx}
        orgStandards={orgStandards}
        orgSubStandards={orgSubStandards.find(sub => sub.name === subDataDetails)}
        selectedOrg={selectedOrg}
      />
    </div>
  );
};

export default WatomsDashboard;