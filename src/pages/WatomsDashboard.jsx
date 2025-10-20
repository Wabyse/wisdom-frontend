import React, { useEffect, useRef, useState } from "react";
import { fetchCenters, fetchCROData, fetchWatomsDetailsData } from "../services/dashboard";
import { useNavigate } from "react-router-dom";
import AnnualPerformanceChart from "../components/AnnualPerformanceChart";
import ProjectUnitsRankingModal from '../components/ProjectUnitsRankingModal';
import useFullScreen from "../hooks/useFullScreen";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
// import Uploading from "../components/Uploading";
import LoadingScreen from "../components/LoadingScreen";
import { CRO_RECOMMENDATIONS, INSTITUTION_NO_CURRICULUMS, ORG_MANAGER_IMG, WATOMS_UNPREPARED_DATA } from "../constants/constants";
import { roundNumber } from "../utils/roundNumber";
import Egypt from "../components/Egypt";
import WatomsDashboardSubDataDetails from "../components/WatomsDashboardSubDataDetails";
import NewNavbar from "../components/NewNavbar";
import DenyAccessPage from "../components/DenyAccessPage";
import { faPrint, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import wabysLogo from '../assets/wabys.png';
import ebdaeduLogo from '../assets/ebad-edu.png';
import molLogo from "../assets/Gov.png";
import person from "../assets/person.jpg";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

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
  const { language, setLanguage } = useLanguage();
  const isFullScreen = useFullScreen();
  const [watomsData, setWatomsData] = useState([]);
  const [centers, setCenters] = useState([]);
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [projectUnitsRankingLoading, setProjectUnitsRankingLoading] = useState(false);
  const [isProjectUnitsModalOpen, setIsProjectUnitsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  // const [uploading, setUploading] = useState(false);
  const [datasMonths, setDatasMonths] = useState([]);
  const [selectedOrgId, setSelectedOrgId] = useState("All");
  const [orgStandards, setOrgStandards] = useState([]);
  const [orgSubStandards, setOrgSubStandards] = useState([]);
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
  const [croPopup, setCroPopup] = useState(false);
  const [croData, setCroData] = useState([]);
  const [filteredCroData, setFilteredCroData] = useState([]);
  const [sortedCroData, setSortedCroData] = useState([]);
  const pdfRef = useRef();
  const pdf2Ref = useRef();
  const [cro2Popup, setCro2Popup] = useState(false);

  const handleDownloadPdf = async (ref) => {
    const element = ref.current;

    // Create a high-res canvas of the element
    const canvas = await html2canvas(element, {
      scale: 2, // higher scale = better quality
      useCORS: true, // allows external images like logos
    });

    const imageData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    // Add first page
    pdf.addImage(imageData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;

    // Add extra pages if needed
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imageData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    pdf.save("report.pdf");
  };

  const combineAllReports = (data) => {
    const grouped = {};

    data.forEach((monthData) => {
      monthData.reports.forEach((report) => {
        report.scores.forEach((score) => {
          const rec = score.recommendation;
          const field = score.field_name;

          // Create recommendation group if not exists
          if (!grouped[rec]) grouped[rec] = {};

          // Create field group if not exists
          if (!grouped[rec][field]) grouped[rec][field] = [];

          // Add score info
          grouped[rec][field].push({
            name: report.name,
            subject: report.subject,
            authority: report.authority,
            avg_score: score.avg_score,
            field_id: score.field_id,
          });
        });
      });
    });

    return grouped;
  };


  useEffect(() => {
    const loadCROData = async () => {
      const response = await fetchCROData();

      const arrangeData = response.map(item => {
        const months = item.months || [];
        return months[months.length - 1];
      });
      setCroData(response);
      setFilteredCroData(arrangeData);
      const sortedData = combineAllReports(arrangeData)
      setSortedCroData(sortedData)
    }

    loadCROData();
  }, [])

  useEffect(() => {
    const filterCROData = async () => {
      if (selectedOrgId !== "All") {
        const result = croData.find(obj => obj.id === selectedOrgId);
        setFilteredCroData([result.months[selectedMonthIdx]]);
        const sortedData = combineAllReports([result.months[selectedMonthIdx]])
        setSortedCroData(sortedData)
      } else {
        const arrangeData = croData.map(item => {
          const months = item.months || [];
          return months[months.length - 1];
        });
        const sortedData = combineAllReports(arrangeData)
        setSortedCroData(sortedData)
        setFilteredCroData(arrangeData);
      }
    }

    filterCROData();
  }, [selectedMonthIdx, selectedOrgId])

  const CroReport = () => (
    <div className="fixed inset-0 bg-black/60 flex flex-col overflow-y-auto justify-start gap-6 items-center z-50">
      <button
        onClick={() => setCroPopup(false)}
        className="absolute top-4 right-4 text-white bg-gray-700 hover:bg-gray-800 w-12 h-12 flex justify-center items-center text-2xl font-bold cursor-pointer z-50"
      >
        <FontAwesomeIcon icon={faXmark} />
      </button>
      <button
        onClick={() => handleDownloadPdf(pdfRef)}
        className="absolute top-4 right-20 text-white bg-gray-700 hover:bg-gray-800 w-12 h-12 flex justify-center items-center text-2xl font-bold cursor-pointer z-50"
      >
        <FontAwesomeIcon icon={faPrint} />
      </button>
      <div ref={pdfRef} className="relative bg-white w-[40%] max-w-5xl h-fit p-4 flex flex-col mt-4 text-black">
        {/* Header */}
        <div className="flex justify-between items-center w-full">
          {/* logo */}
          <div className="flex flex-col items-center w-14">
            <img src={wabysLogo} className="w-14" alt="ebda edu logo" />
            <img src={ebdaeduLogo} className="w-10" alt="ebda edu logo" />
          </div>
          {/* title */}
          <div className="flex flex-col items-center gap-2 text-xs font-bold">
            <h1 className="border-b-2 border-black text-black">تقرير توصيات توجيه مؤشر الاداء</h1>
            <h1 className="border-b-2 border-black text-black"> لتنمية الجوانب المهنية</h1>
          </div>
          {/* logo */}
          <div className="flex flex-col">
            <img src={molLogo} className="w-14" alt="ebda edu logo" />
          </div>
        </div>
        {filteredCroData.map((data, idx) => data.reports.length > 0 && data.reports.map(report => <div className="rounded-xl shadow-black shadow-md p-2 flex flex-col mt-2 w-full gap-2">
          <div className="w-full border-black border-2 flex p-1 gap-1 min-h-20">
            <div className="flex flex-col items-center text-center gap-1 w-[15%] font-bold">
              <div className="text-[10px] border-black border-2 w-full bg-gray-300 h-1/2 flex justify-center items-center">اجمالي التقييم</div>
              <div className="text-sm border-black border-2 w-full h-1/2 flex justify-center items-center">67%</div>
            </div>
            <div className="flex flex-col gap-1 w-2/3 text-[10px] font-bold justify-center items-center">
              <div className="border-black border-2 h-fit w-full text-center px-2 py-1 flex justify-center items-center">{report.name}</div>
              <div className="border-black border-2 h-fit w-full text-center px-2 py-1 flex justify-center items-center">{report.authority}</div>
              <div className="border-black border-2 h-fit w-full text-center px-2 py-1 flex justify-center items-center">{report.subject}</div>
            </div>
            <div className="flex flex-col gap-1 min-w-fit max-w-1/3 text-[10px] font-bold justify-center items-center">
              <div className="border-black border-2 h-fit w-full text-center px-2 py-1 flex justify-center items-center bg-gray-300">الاسم</div>
              <div className="border-black border-2 h-fit w-full text-center px-2 py-1 flex justify-center items-center bg-gray-300">الجهة الرئيسية</div>
              <div className="border-black border-2 h-fit w-full text-center px-2 py-1 flex justify-center items-center bg-gray-300">التخصص</div>
            </div>
            <div className="border-black border-2 p-1 flex items-center">
              <img className="w-16" src={person} alt="" />
            </div>
            <div className="flex justify-center items-center">
              <div className="px-2 bg-gray-300 border-black border-2 text-xs">{idx}</div>
            </div>
          </div>
          <div className="border-2 border-black m-2 p-2 rounded-md overflow-x-auto">
            <table className="w-full border-collapse text-center">
              <thead className="bg-gray-100">
                <tr className="border-b border-black">
                  <th className="min-w-[15%] w-[15%] py-2 border-black border-r-2">التوصية</th>
                  <th colSpan={2} className="min-w-[40%] w-[40%] py-2 border-black border-x-2">
                    النسبة
                  </th>
                  <th className="min-w-[45%] w-[45%] py-2 border-black border-l-2">العنوان</th>
                </tr>
              </thead>

              <tbody>
                {report.scores.map((score, i) => (
                  <tr key={i} className="border-b last:border-0 hover:bg-gray-50">
                    {/* التوصية */}
                    <td className="py-2 text-xs font-medium border-black border-r-2">
                      {score.recommendation}
                    </td>

                    {/* النسبة (الرقم) */}
                    <td className="py-2 font-bold text-sm w-[15%]">{score.avg_score}%</td>

                    {/* النسبة (الشريط) */}
                    <td className="py-2 w-[25%]">
                      <div className="w-[95%] h-5 bg-[#444652] rounded-full shadow-inner relative overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700 ease-[cubic-bezier(.4,2,.6,1)]"
                          style={{
                            width: `${score.avg_score}%`,
                            backgroundColor: 'red',
                          }}
                        />
                      </div>
                    </td>

                    {/* العنوان */}
                    <td className="py-2 text-xs font-medium text-end border-black border-l-2">
                      {score.field_name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>))}
      </div>
    </div>
  )

  const Cro2Report = () => (
    <div className="fixed inset-0 bg-black/60 flex flex-col overflow-y-auto justify-start gap-6 items-center z-50">
      <button
        onClick={() => setCro2Popup(false)}
        className="absolute top-4 right-4 text-white bg-gray-700 hover:bg-gray-800 w-12 h-12 flex justify-center items-center text-2xl font-bold cursor-pointer z-50"
      >
        <FontAwesomeIcon icon={faXmark} />
      </button>
      <button
        onClick={() => handleDownloadPdf(pdf2Ref)}
        className="absolute top-4 right-20 text-white bg-gray-700 hover:bg-gray-800 w-12 h-12 flex justify-center items-center text-2xl font-bold cursor-pointer z-50"
      >
        <FontAwesomeIcon icon={faPrint} />
      </button>
      <div className="w-full flex flex-col items-center" ref={pdf2Ref}>
      {Object.entries(sortedCroData).map(([key, value]) => (
        <div className="bg-white w-[40%] max-w-5xl h-fit p-4 flex flex-col items-center mt-4 text-black rounded-lg shadow-lg">
          {/* Header */}
          <div className="flex justify-between items-center w-full max-w-4xl mb-2">
            {/* Left logos */}
            <div className="flex flex-col items-center w-14">
              <img src={wabysLogo} className="w-14" alt="Wabys logo" />
              <img src={ebdaeduLogo} className="w-10" alt="Ebda Edu logo" />
            </div>

            {/* Center title */}
            <div className="flex flex-col items-center gap-2 text-xs font-bold text-center">
              <h1 className="border-b-2 border-black text-black">تقرير توصيات توجيه مؤشر الاداء</h1>
              <h1 className="border-b-2 border-black text-black">لتنمية الجوانب المهنية - ( {key} )</h1>
            </div>

            {/* Right logo */}
            <div className="flex flex-col">
              <img src={molLogo} className="w-14" alt="MOL logo" />
            </div>
          </div>

          {/* Reports */}
          {Object.entries(value).map(([key, value2]) => (
            <div key={key} className="w-full max-w-4xl rounded-xl shadow mt-2 border border-gray-300 bg-white">
              <h1 className="text-end pr-4 font-bold text-sm mt-2">{key}</h1>
              <div className="w-full border-t border-gray-300 p-2">
                <table className="w-full border-collapse text-center">
                  <thead className="bg-gray-100">
                    <tr className="border-b border-black">
                      <th className="w-2/12 py-2">النسبة</th>
                      <th className="w-2/12 py-2">التخصص</th>
                      <th className="w-2/12 py-2">الجهة</th>
                      <th className="w-3/12 py-2">الاسم</th>
                      <th className="w-2/12 py-2">الصورة</th>
                      <th className="w-1/12 py-2">م</th>
                    </tr>
                  </thead>

                  <tbody>
                    {value2.map((result, idx) => (
                      <tr className="border-b last:border-0 hover:bg-gray-50">
                        <td className="py-2 font-bold text-sm">{result.avg_score}%</td>
                        <td className="py-2 text-xs font-medium text-center">{result.subject}</td>
                        <td className="py-2 text-xs font-medium text-center">{result.authority}</td>
                        <td className="py-2 text-xs font-medium text-center">{result.name}</td>
                        <td className="py-2 text-xs font-medium text-center">
                          <img src={person} className="w-10 h-10 object-cover rounded-full mx-auto" />
                        </td>
                        <td className="py-2 text-xs font-medium text-center">{idx + 1}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>))}
        </div>
    </div>
  )

  useEffect(() => {
    setLanguage(false);
  }, [])

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

  // Remove the fallback data generation since we want real data from database
  // const generateAnnualPerformanceData = () => { ... };
  // const fallbackAnnualData = generateAnnualPerformanceData();

  if (loading) return <LoadingScreen />;
  if (userInfo?.code === 1310) return <DenyAccessPage homePage='/wisdom/dashboard' />;

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
      <NewNavbar
        searchStatus={false}
        darkmodeStatus={false}
        shareStatus={false}
        ministerStatus={true}
        dasboardPage={true}
        projects={projects}
        selectedProject={selectedProject}
        setSelectedProject={setSelectedProject}
        croStatus={true}
        cro2Status={true}
        setCroPopup={setCroPopup}
        setCro2Popup={setCro2Popup}
        filteredCroData={filteredCroData}
      />
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
          <div className="text-2xl font-bold text-amber-400">المؤشرات الإجمالية {userInfo?.code === 1452 || userInfo?.code === 1476 ? "لمشروع وزارة العمل" : selectedOrg?.id === "All" ? selectedProject === "" ? "لمشروع" : `ل${selectedProject}` : selectedOrg?.name}</div>
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
          <div className="flex justify-center px-2 w-full gap-6">
            <div className="w-32 overflow-hidden rounded-xl border border-slate-200/70 bg-[#5268b1] shadow-sm">
              <table className="w-full table-fixed" dir="rtl">
                <thead>
                  <tr className="bg-[#5268b1] border-b border-blue-200/60 text-white text-xs">
                    <th className="py-2 text-center font-semibold">الورش</th>
                    <th className="py-2 text-center font-semibold">المعامل</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  <tr className="bg-[#2f417a] hover:bg-slate-50 transition-colors">

                    <td className="py-2 text-center">
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
            <div className="w-64 overflow-hidden rounded-xl border border-slate-200/70 bg-[#5268b1] shadow-sm">
              <table className="w-full table-fixed" dir="rtl">
                <thead>
                  <tr className="bg-[#5268b1] border-b border-blue-200/60 text-white text-xs">
                    <th className="py-2 text-center font-semibold">مديرين</th>
                    <th className="py-2 text-center font-semibold">الاداريين</th>
                    <th className="py-2 text-center font-semibold">المشرفين</th>
                    <th className="py-2 text-center font-semibold">المدربين</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  <tr className="bg-[#2f417a] hover:bg-slate-50 transition-colors">
                    <td className="py-2 text-center">
                      <span className={`inline-flex items-center justify-center min-w-[2.25rem] px-2 h-6 rounded-full bg-blue-100 text-blue-800`}>
                        {selectedOrg?.id === "All" ? 5 : 1}
                      </span>
                    </td>

                    <td className="py-2 text-center">
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
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="w-32 overflow-hidden rounded-xl border border-slate-200/70 bg-[#5268b1] shadow-sm">
              <table className="w-full table-fixed" dir="rtl">
                <thead>
                  <tr className="bg-[#5268b1] border-b border-blue-200/60 text-white text-xs">
                    <th className="py-2 text-center font-semibold">اجمالي الموظفين</th>
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
        <div className="gap-4 w-1/3" style={{
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
                <div className="flex flex-col items-center justify-center p-2 cursor-pointer" onClick={() => selectedOrg?.id !== "All" && userInfo?.code !== 1452 && userInfo?.code !== 1476 ? setSubDataDetails("الكفاءة و الفاعلية") : null}>
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
                          onClick={() => selectedOrg?.id !== "All" && userInfo?.code !== 1452 && userInfo?.code !== 1476 ? setSubDataDetails(s.name) : null}
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
      {croPopup && <CroReport />}
      {cro2Popup && <Cro2Report />}
    </div>
  );
};

export default WatomsDashboard;