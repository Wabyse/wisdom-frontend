import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import "../styles/Pms.css";
import { useNavigate, Navigate, useLocation } from "react-router-dom";
import { fetchForms } from "../services/pms";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import LoadingScreen from "../components/LoadingScreen";
import { WATOMS_PMS_ROLE_PERMISSION, WATOMS_PMS_FORMS_ORDER, WATOMS_PMS_LIST, WATOMS_PMS_HERO_INFO } from "../constants/constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faChartLine, faGraduationCap, faClock, faUserTie, faBookOpen, faSchool, faAddressCard, faClipboard, faSearch, faUser, faSignOutAlt, faThLarge, faSun, faMoon, faInfoCircle, faFolder, faTasks, faArrowRight, faStar, faExpand, faCompress, faUserGraduate, faUserGear, faDatabase, faPeopleGroup } from "@fortawesome/free-solid-svg-icons";
import watomsLogo from '../assets/watoms3.png'
import wabysLogo from '../assets/wabys.png';
import DenyAccessPage from "../components/DenyAccessPage";

const TomsPms = () => {
  const { userInfo, logout } = useAuth();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [forms, setForms] = useState([]);
  const [pd, setPd] = useState([]);
  const [dailyOperations, setDailyOperations] = useState([]);
  const { language, setLanguage } = useLanguage();
  const [isFullScreen, setIsFullScreen] = useState(false);

  const navigate = useNavigate(); //for navigate to another page (component)

  // Full screen functionality
  const toggleFullScreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullScreen(true);
      }).catch(err => {
        console.error('Error attempting to enable full screen:', err);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullScreen(false);
      }).catch(err => {
        console.error('Error attempting to exit full screen:', err);
      });
    }
  }, []);

  // Listen for full screen changes
  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullScreenChange);
  }, []);

  // Search/filter state
  const [search, setSearch] = useState("");

  // Memoize filtered forms to prevent recalculation on every render
  const filteredForms = useMemo(() => {
    return forms.map(type => ({
      ...type,
      forms: type.forms.filter(form => {
        const name = language ? form.en_name : form.ar_name;
        const test = {
          name: name.toLowerCase().includes(search.toLowerCase()),
          permission: form.permission
        }
        return test;
      })
    })).filter(type => type.forms.length > 0);
  }, [forms, search, language]);

  // Typing effect for hero slide title (type, pause, erase, next)
  const [slideIdx, setSlideIdx] = useState(0);
  const [focusedCardId, setFocusedCardId] = useState(null);
  const [zoomingCardId, setZoomingCardId] = useState(null);
  const [focusExit, setFocusExit] = useState(false);
  const focusedCardRef = useRef(null);

  // Ensure slideIdx is always in bounds
  useEffect(() => {
    if (
      Array.isArray(WATOMS_PMS_HERO_INFO) &&
      WATOMS_PMS_HERO_INFO.length > 0 &&
      slideIdx >= WATOMS_PMS_HERO_INFO.length
    ) {
      setSlideIdx(0);
    }
  }, [slideIdx]);

  // Auto-advance slides
  useEffect(() => {
    if (!Array.isArray(WATOMS_PMS_HERO_INFO) || WATOMS_PMS_HERO_INFO.length === 0) return;
    const timer = setTimeout(() => {
      setSlideIdx((prev) => (prev + 1) % WATOMS_PMS_HERO_INFO.length);
    }, 4000);
    return () => clearTimeout(timer);
  }, [slideIdx]);

  // Guard for hero info
  const currentSlide = Array.isArray(WATOMS_PMS_HERO_INFO) && WATOMS_PMS_HERO_INFO[slideIdx]
    ? WATOMS_PMS_HERO_INFO[slideIdx]
    : { img: '', title: '', description: '' };

  const handleClick = (id, en_name, ar_name, code, reviewee) => {
    navigate(`/watoms/pms/form/${id}`, {
      state: { formEnName: en_name, formArName: ar_name, lang: language, code: code, reviewee },
    });
  };

  const handleTraineeAttendanceClick = () => {
    navigate(`/watoms/pms/trainee-absence`);
  };

  const handleInistituteIncidentClick = () => {
    navigate(`/watoms/pms/inistitute-incident`);
  };

  const handleInterviewClick = () => {
    navigate(`/watoms/pms/interview`);
  };

  const handleTestClick = () => {
    navigate(`/watoms/pms/test`);
  };

  const getCategoryIcon = (categoryCode) => {
    const iconMap = {
      "اداء المدرب": faUserTie,
      "الاداء المؤسسي": faGraduationCap,
      "البرامج التدريبية": faBookOpen,
      "التخطيط و التشغيل": faUserGear,
      "بيئة التدريب": faSchool,
      "المشاركة المجتمعية": faPeopleGroup,
      "الرقمنة و تخزين البيانات": faDatabase,
      "بيئة العمل": faAddressCard,
      "الاشراف اليومي": faClock,
      "التنمية المهنية": faChartLine,
      "اداء المتدرب": faUserGraduate,
      "الجودة و التطوير": faStar
    };
    return iconMap[categoryCode] || faClipboard;
  };

  // Helper: category color gradients
  const getCategoryGradient = (code) => {
    const map = {
      "اداء المدرب": "from-blue-400 to-blue-600",
      "الاداء المؤسسي": "from-purple-400 to-purple-600",
      "بيئة التدريب": "from-yellow-300 to-yellow-500",
      "اداء المتدرب": "from-indigo-400 to-indigo-600",
      "التخطيط و التشغيل": "from-red-400 to-red-600",
      "البرامج التدريبية": "from-green-400 to-green-600",
      "بيئة العمل": "from-gray-400 to-gray-600",
      "التنمية المهنية": "from-pink-400 to-pink-600",
      "الاشراف اليومي": "from-teal-400 to-teal-600",
      "الرقمنة و تخزين البيانات": "from-orange-400 to-orange-600",
      "الجودة و التطوير": "from-yellow-400 to-yellow-600",
      "المشاركة المجتمعية": "from-green-600 to-green-800"
    };
    return map[code] || "from-slate-300 to-slate-500";
  };

  useEffect(() => {
    const loadForms = async () => {
      try {
        const rawData = await fetchForms(userInfo);
        const filtertomsForms = rawData.filter(
          (filter) =>
            filter.type !== "360 Individual Assessment" &&
            filter.type !== "360 Curriculum Assessment" &&
            filter.type !== "normal" &&
            filter.type !== "Wisdom ClassRoom Observation"
        );

        const groupedData = [];

        filtertomsForms.forEach((item) => {
          const codeKey2 = item.code.split(" | ")[1];
          const codePermission = item.code.split(" | ")[0];
          const codePermission2 = WATOMS_PMS_ROLE_PERMISSION[codePermission] || null;
          const codeKey = WATOMS_PMS_LIST[codeKey2] || null;
          const codeKey3 = WATOMS_PMS_ROLE_PERMISSION[codeKey2] || null;

          if (codePermission2 === userInfo.user_role || (codePermission2 === "Self" && codeKey3 === userInfo.user_role) || userInfo.user_role === "Operations Excellence Lead" || (codePermission === "MGR" && userInfo.user_role === "Manager") || (codePermission === "AD" && userInfo.user_role === "ADMIN") || (codePermission === "T" && userInfo.user_role === "Teacher") || (codePermission === "OEL" && userInfo.user_role === "Operations Excellence Lead") || (codePermission === "TR" && userInfo.user_role === "Student")) {
            let existingGroup = groupedData.find(
              (group) => group.code === codeKey
            );

            if (!existingGroup) {
              existingGroup = {
                id: item.id,
                code: codeKey,
                reviewee: codeKey3,
                codeAr: codeKey,
                forms: [],
              };
              groupedData.push(existingGroup);
            }

            existingGroup.forms.push({
              id: item.id,
              en_name: item.ar_name,
              ar_name: item.ar_name,
              permission: codePermission2,
            });
          }
        });

        const generalForms = groupedData.filter(
          (filteredData) => filteredData.code !== "التنمية المهنية"
        );
        const filteredGeneralForms = generalForms.filter(
          (filteredData) => filteredData.code !== "Daily Operations"
        );
        const filter1 = groupedData.filter(
          (testData) => testData.code === "التنمية المهنية"
        );
        const filter2 = groupedData.filter(
          (testData) => testData.code === "Daily Operations"
        );
        const newForms = WATOMS_PMS_FORMS_ORDER.map((id) => filteredGeneralForms[id]).filter((f) => f !== undefined);
        setForms(newForms);
        setPd(filter1);
        setDailyOperations(filter2);
      } catch (err) {
        console.error("API Error:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadForms();
  }, [userInfo]);

  // Escape key support to exit focus mode
  useEffect(() => {
    if (!focusedCardId) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') handleFocusExit();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusedCardId]);

  // Handle card click with animation
  const handleCardClick = (id) => {
    setZoomingCardId(id);
    setTimeout(() => {
      setFocusedCardId(id);
      setZoomingCardId(null);
    }, 400); // match animation duration
  };

  // Handle focus exit with animation
  const handleFocusExit = () => {
    setFocusExit(true);
    setTimeout(() => {
      setFocusedCardId(null);
      setFocusExit(false);
    }, 400); // match exit animation duration
  };

  // THEME STATE
  const [darkMode, setDarkMode] = useState(false);
  // MODAL STATE
  const [activeModal, setActiveModal] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // Memoize mainMenu to prevent recreation on every render
  const handleCategoriesClick = useCallback(() => {
    setModalData({ type: 'categories', data: filteredForms });
    setActiveModal('categories');
  }, [filteredForms]);

  const handleProfileClick = useCallback(() => {
    setModalData({ type: 'profile', data: userInfo });
    setActiveModal('profile');
  }, [userInfo]);

  const handleInfoClick = useCallback(() => {
    setModalData({ type: 'info', data: { heroInfo: WATOMS_PMS_HERO_INFO, currentSlide } });
    setActiveModal('info');
  }, [currentSlide]);

  const mainMenu = useMemo(() => [
    {
      icon: faThLarge,
      label: language ? "Assessment Tools" : "أدوات التقييم",
      color: "from-watomsBlue to-wisdomOrange",
      onClick: handleCategoriesClick,
    },
    {
      icon: faUser,
      label: language ? "Profile" : "الملف الشخصي",
      color: "from-wisdomOrange to-watomsBlue",
      onClick: handleProfileClick,
    },
    {
      icon: faInfoCircle,
      label: language ? "More Info" : "معلومات أكثر",
      color: "from-watomsBlue to-wisdomLightOrange",
      onClick: handleInfoClick,
    },
  ], [language, handleCategoriesClick, handleProfileClick, handleInfoClick]);

  // Debug: Monitor modal state changes
  // useEffect(() => {
  //   if (activeModal) {
  //     console.log('Modal opened:', activeModal, 'Data:', modalData);
  //   } else {
  //     console.log('Modal closed');
  //   }
  // }, [activeModal, modalData]);

  // Close modal function
  const closeModal = useCallback(() => {
    setActiveModal(null);
    setModalData(null);
  }, [activeModal]);

  // Escape key support for modals
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && activeModal) {
        closeModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModal]);

  if (loading) return <LoadingScreen />;
  if (error?.status === 403) return <Navigate to="/login" state={{ from: location }} replace />;
  if (error) return <p>Error: {error.message}</p>;
  if (userInfo?.code === 1452 || userInfo?.code === 1476) return <DenyAccessPage homePage='/watoms/dashboard' />;
  if (userInfo?.code === 1475) return <DenyAccessPage homePage='/watoms/news' />;
  if (userInfo?.code === 1310) return <DenyAccessPage homePage='/wisdom/dashboard' />;

  return (
    <div className={`min-h-screen w-full font-[Cairo,sans-serif] transition-colors duration-500 ${darkMode ? 'bg-watomsBlue text-white' : 'bg-gradient-to-br from-blue-50 via-white to-purple-100 text-gray-900'} relative overflow-hidden`}>
      {/* Modern Background with Abstract Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 via-purple-100/20 to-pink-100/30 animate-pulse" style={{ animationDuration: '8s' }} />

        {/* Floating Geometric Shapes */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-watomsBlue/10 to-wisdomOrange/10 rounded-full blur-xl animate-bounce" style={{ animationDuration: '6s', animationDelay: '0s' }} />
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-wisdomOrange/10 to-watomsBlue/10 rounded-full blur-xl animate-bounce" style={{ animationDuration: '8s', animationDelay: '2s' }} />
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-gradient-to-br from-purple-400/10 to-blue-400/10 rounded-full blur-xl animate-bounce" style={{ animationDuration: '7s', animationDelay: '1s' }} />
        <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-gradient-to-br from-pink-400/10 to-purple-400/10 rounded-full blur-xl animate-bounce" style={{ animationDuration: '9s', animationDelay: '3s' }} />

        {/* Abstract Lines */}
        <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-watomsBlue/20 to-transparent" />
        <div className="absolute bottom-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-wisdomOrange/20 to-transparent" />
        <div className="absolute top-1/2 left-0 w-px h-32 bg-gradient-to-b from-transparent via-purple-400/20 to-transparent" />
        <div className="absolute top-1/2 right-0 w-px h-32 bg-gradient-to-b from-transparent via-blue-400/20 to-transparent" />

        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, ${darkMode ? 'white' : 'gray'} 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>
      </div>

      {/* Modern App Menu (No Navbar) */}
      <div className="flex flex-col items-center justify-center min-h-[80vh] w-full relative z-10">
        {/* Header Section - now full width */}
        <div className="relative z-10 w-full px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-6">
            <img className="w-[100px] md:w-[120px] lg:w-[140px] cursor-pointer" src={wabysLogo} alt="Wabys Logo" onClick={() => navigate('/wabys')} />
            <div className='border-l-2 border-black p-1 h-12' />
            <img className="w-[100px] md:w-[120px] lg:w-[140px] cursor-pointer" src={watomsLogo} alt="watoms Logo" onClick={() => navigate('/watoms')} />
          </div>
          <div className="flex-1 flex justify-center">
            <div className="relative w-full max-w-md">
              <FontAwesomeIcon icon={faSearch} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
              <input
                type="text"
                className="w-full pl-12 pr-4 py-1 rounded-full border border-gray-200 shadow focus:ring-2 focus:ring-watomsBlue bg-white/90 text-lg font-medium placeholder-gray-400 transition-all focus:border-watomsBlue focus:shadow-lg outline-none"
                placeholder={language ? "Search..." : "ابحث..."}
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ fontFamily: 'inherit' }}
              />
            </div>
          </div>
          <div className="flex items-center gap-4 relative flex-wrap justify-evenly">
            <button onClick={() => setDarkMode(!darkMode)} className="rounded-full w-10 h-10 flex justify-center items-center bg-white/80 hover:bg-gray-200 shadow transition-all">
              <FontAwesomeIcon icon={darkMode ? faSun : faMoon} className="text-xl text-watomsBlue" />
            </button>
            {/* Full Screen Toggle Button */}
            <button
              onClick={toggleFullScreen}
              className="rounded-full w-10 h-10 flex justify-center items-center bg-white/80 hover:bg-gray-200 shadow transition-all"
              title={language ? (isFullScreen ? 'Exit Full Screen' : 'Enter Full Screen') : (isFullScreen ? 'خروج من الشاشة الكاملة' : 'دخول الشاشة الكاملة')}
            >
              <FontAwesomeIcon
                icon={isFullScreen ? faCompress : faExpand}
                className="text-xl text-watomsBlue"
              />
            </button>
            {/* User Info: Show Username only */}
            <span className="flex items-center gap-2 font-bold text-lg md:min-w-[120px] min-w-[300px] justify-center">
              <FontAwesomeIcon icon={faUser} className="text-watomsBlue" />
              {userInfo?.name || 'User'}
            </span>
            {/* Language Toggle Button */}
            <button
              className="rounded-full w-10 h-10 flex justify-center items-center bg-white/80 hover:bg-gray-200 shadow transition-all font-bold text-base"
              onClick={() => setLanguage(!language)}
              title={language ? 'العربية' : 'English'}
            >
              {language ? 'AR' : 'EN'}
            </button>
            {/* App Switcher Dropdown */}
            <div className="relative">
              <button
                className="rounded-full w-10 h-10 flex justify-center items-center bg-white/80 hover:bg-gray-200 shadow transition-all"
                onClick={() => setMenuOpen(v => !v)}
                aria-label="App Switcher"
              >
                <FontAwesomeIcon icon={faThLarge} className="svg-inline--fa fa-table-cells-large text-xl text-watomsBlue" />
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 z-50 animate-fadeIn">
                  <button onClick={() => { setMenuOpen(false); navigate('/watoms/pms'); }} className="w-full text-left px-5 py-3 hover:bg-blue-50 flex items-center gap-2">
                    <FontAwesomeIcon icon={faThLarge} className="text-watomsBlue" /> PMS
                  </button>
                  <button onClick={() => { setMenuOpen(false); navigate('/watoms/dms'); }} className="w-full text-left px-5 py-3 hover:bg-blue-50 flex items-center gap-2">
                    <FontAwesomeIcon icon={faFolder} className="text-wisdomOrange" /> DMS
                  </button>
                  <button onClick={() => { setMenuOpen(false); navigate('/watoms/tms'); }} className="w-full text-left px-5 py-3 hover:bg-blue-50 flex items-center gap-2">
                    <FontAwesomeIcon icon={faTasks} className="text-blue-500" /> TMS
                  </button>
                  <button onClick={() => { setMenuOpen(false); navigate('/watoms/dashboard'); }} className="w-full text-left px-5 py-3 hover:bg-blue-50 flex items-center gap-2">
                    <FontAwesomeIcon icon={faInfoCircle} className="text-purple-500" /> Dashboard
                  </button>
                </div>
              )}
            </div>
            <button
              className="rounded-full w-10 h-10 flex justify-center items-center bg-white/80 hover:bg-gray-200 shadow transition-all"
              onClick={() => { logout(); navigate('/login'); }}
            >
              <FontAwesomeIcon icon={faSignOutAlt} className="text-xl text-wisdomOrange" />
            </button>
          </div>
        </div>
        {/* Categories Section - centered and constrained */}
        <div className="w-full max-w-6xl mx-auto mt-4">
          <h2 className="text-3xl font-extrabold mb-2 text-center bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            {language ? 'Performance Categories' : 'فئات الأداء'}
          </h2>
          {/* Centered, subtle line under heading */}
          <div className="mx-auto mb-10 mt-2" style={{ height: '3px', width: '180px', background: 'linear-gradient(90deg,#a259f7 0%,#667eea 100%)', borderRadius: '2px', opacity: 0.18 }} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-4">
            {filteredForms.map((category, idx) => (
              <div
                key={category.id}
                className="group relative bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 cursor-pointer hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 hover:scale-105 card-hover-lift"
                onClick={() => setFocusedCardId(category.id)}
              >
                {/* Category Icon */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl font-bold bg-gradient-to-br ${getCategoryGradient(category.code)}`}>
                    <FontAwesomeIcon icon={getCategoryIcon(category.code)} />
                  </div>
                  <div className="text-right">
                    <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded-full">
                      {category.forms.length} {language ? 'forms' : 'نموذج'}
                    </span>
                  </div>
                </div>
                {/* Category Title */}
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {language ? category.code : category.codeAr}
                </h3>
                {/* Category Description */}
                {/* <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {language ? category.description || 'Performance management category' : category.descriptionAr || 'فئة إدارة الأداء'}
                </p> */}
                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                {/* Click Indicator */}
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <FontAwesomeIcon icon={faArrowRight} className="text-white text-sm" />
                  </div>
                </div>
                {/* Form Count Badge */}
                <div className="absolute top-4 right-4">
                  <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    {category.forms.length}
                  </div>
                </div>
              </div>
            ))}
            {userInfo?.user_role !== "Student" && <div
              key={"التنمية المهنية"}
              className="group relative bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 cursor-pointer hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 hover:scale-105 card-hover-lift"
              onClick={() => setFocusedCardId("التنمية المهنية")}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl font-bold bg-gradient-to-br ${getCategoryGradient("التنمية المهنية")}`}>
                  <FontAwesomeIcon icon={getCategoryIcon("التنمية المهنية")} />
                </div>
                <div className="text-right">
                  <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded-full">
                    2 {language ? 'forms' : 'نموذج'}
                  </span>
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                التنمية المهنية
              </h3>
              {/* <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {language ? category.description || 'Performance management category' : category.descriptionAr || 'فئة إدارة الأداء'}
              </p> */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <FontAwesomeIcon icon={faArrowRight} className="text-white text-sm" />
                </div>
              </div>
              <div className="absolute top-4 right-4">
                <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  2
                </div>
              </div>
            </div>}
            {userInfo?.user_role !== "Student" && <div
              key={"الاشراف اليومي"}
              className="group relative bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 cursor-pointer hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 hover:scale-105 card-hover-lift"
              onClick={() => setFocusedCardId("الاشراف اليومي")}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl font-bold bg-gradient-to-br ${getCategoryGradient("الاشراف اليومي")}`}>
                  <FontAwesomeIcon icon={getCategoryIcon("الاشراف اليومي")} />
                </div>
                <div className="text-right">
                  <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded-full">
                    2 {language ? 'forms' : 'نموذج'}
                  </span>
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                الاشراف اليومي
              </h3>
              {/* <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {language ? category.description || 'Performance management category' : category.descriptionAr || 'فئة إدارة الأداء'}
              </p> */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <FontAwesomeIcon icon={faArrowRight} className="text-white text-sm" />
                </div>
              </div>
              <div className="absolute top-4 right-4">
                <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  2
                </div>
              </div>
            </div>}
          </div>
        </div>
      </div>
      {/* Focus Mode Rendering */}
      {focusedCardId && (focusedCardId !== "التنمية المهنية" || focusedCardId !== "الاشراف اليومي") && (
        <div className="fixed inset-0 z-40 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[6px] transition-all duration-500 animate-fadeIn" onClick={focusExit ? undefined : handleFocusExit} />
          <div className="flex flex-col w-full max-w-[700px] min-h-[400px] max-h-[80vh] bg-white/30 backdrop-blur-xl shadow-2xl border border-white/50 rounded-3xl z-50 relative p-0 overflow-hidden" style={{ margin: '2vh auto', boxSizing: 'border-box' }}>
            {/* Sticky Glassy Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between w-full px-6 py-3 bg-white/40 backdrop-blur-lg border-b border-white/30" style={{ backdropFilter: 'blur(16px)' }}>
              <button
                className="px-5 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2 group z-50 text-base"
                onClick={() => {
                  setFocusedCardId(null);
                }}
                disabled={focusExit}
              >
                <FontAwesomeIcon icon={faArrowRight} className="text-base group-hover:translate-x-1 transition-transform" />
                {language ? 'Back to Categories' : 'العودة للفئات'}
              </button>
              {modalData?.data && (
                <div className="flex items-center gap-3 bg-white/60 px-4 py-2 rounded-2xl shadow text-gray-800 text-sm font-bold">
                  <FontAwesomeIcon icon={faUser} className="text-lg" />
                  <span>{modalData.data.role || ''}</span>
                  {modalData.data.count && <span className="ml-2 bg-orange-500 text-white rounded-full px-2 py-0.5 text-xs">{modalData.data.count}</span>}
                </div>
              )}
            </div>
            {/* Cards Area with Custom Scrollbar */}
            <div className="flex-1 overflow-y-auto w-full pt-4 px-6 pb-6 scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-transparent" style={{ scrollbarWidth: 'thin' }}>
              {filteredForms.filter(type => type.id === focusedCardId).map(type => (
                <div
                  key={type.id}
                  ref={focusedCardRef}
                  className={`focused-card-true relative rounded-2xl border border-white/30 bg-gradient-to-br from-white/60 via-blue-100/60 to-white/40 shadow-xl flex flex-col min-w-0 w-full animate-fadeInUp mb-4`}
                  style={{ padding: '1.25rem', alignSelf: 'center', zIndex: 50, pointerEvents: focusExit ? 'none' : 'auto', opacity: focusExit ? 0.7 : 1, backdropFilter: 'blur(10px)' }}
                >
                  {/* Category Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-400/40 to-purple-400/40 backdrop-blur-md rounded-xl flex items-center justify-center shadow border border-white/30">
                        <FontAwesomeIcon icon={getCategoryIcon(type.code)} className="text-2xl text-blue-700 drop-shadow-lg" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center border border-white shadow animate-pulse">
                        <span className="text-white text-xs font-bold">{type.forms.length}</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold tracking-wide text-blue-900 mb-1 drop-shadow-lg bg-gradient-to-r from-blue-900 to-purple-700 bg-clip-text text-transparent">
                        {language ? type.code : type.codeAr}
                      </h3>
                      <p className="text-xs text-blue-900/80 font-medium leading-relaxed mb-1">
                        {type.description || (language ? 'View and manage forms for this category.' : 'عرض وإدارة النماذج لهذا التصنيف.')}
                      </p>
                    </div>
                  </div>
                  {/* Forms Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {type.forms.map((form, idx) => (
                      <div
                        key={form.id}
                        className="group bg-white/80 backdrop-blur rounded-xl shadow-lg border border-white/40 px-4 py-4 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 animate-fadeInUp cursor-pointer hover:border-blue-400/60 flex flex-col"
                        style={{ animationDelay: `${idx * 80}ms` }}
                        onClick={() => handleClick(form.id, form.ar_name, form.ar_name, form.permission, type.reviewee)}
                      >
                        {/* Form Header */}
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 rounded-lg flex items-center justify-center shadow group-hover:scale-110 transition-transform duration-300">
                            <FontAwesomeIcon icon={faPlus} className="text-white text-base" />
                          </div>
                          <h4 className="text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {form.ar_name}
                          </h4>
                        </div>
                        {/* Action Button */}
                        <div className="pt-2 mt-auto">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleClick(form.id, form.ar_name, form.ar_name, form.permission, type.reviewee);
                            }}
                            className="w-full bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-700 text-white font-bold py-2 px-4 rounded-full shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 group relative overflow-hidden text-base"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                            <span className="relative z-10">{language ? 'Open Form' : 'فتح النموذج'}</span>
                            <FontAwesomeIcon icon={faArrowRight} className="text-xs group-hover:translate-x-1 transition-transform relative z-10" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {focusedCardId && focusedCardId === "التنمية المهنية" && (
        <div className="fixed inset-0 z-40 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[6px] transition-all duration-500 animate-fadeIn" onClick={focusExit ? undefined : handleFocusExit} />
          <div className="flex flex-col w-full max-w-[700px] min-h-[400px] max-h-[80vh] bg-white/30 backdrop-blur-xl shadow-2xl border border-white/50 rounded-3xl z-50 relative p-0 overflow-hidden" style={{ margin: '2vh auto', boxSizing: 'border-box' }}>
            {/* Sticky Glassy Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between w-full px-6 py-3 bg-white/40 backdrop-blur-lg border-b border-white/30" style={{ backdropFilter: 'blur(16px)' }}>
              <button
                className="px-5 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2 group z-50 text-base"
                onClick={() => {
                  setFocusedCardId(null);
                }}
                disabled={focusExit}
              >
                <FontAwesomeIcon icon={faArrowRight} className="text-base group-hover:translate-x-1 transition-transform" />
                {language ? 'Back to Categories' : 'العودة للفئات'}
              </button>
              <div className="flex items-center gap-3 bg-white/60 px-4 py-2 rounded-2xl shadow text-gray-800 text-sm font-bold">
                <FontAwesomeIcon icon={faUser} className="text-lg" />
                <span>التنمية المهنية</span>
                <span className="ml-2 bg-orange-500 text-white rounded-full px-2 py-0.5 text-xs">2</span>
              </div>
            </div>
            {/* Cards Area with Custom Scrollbar */}
            <div className="flex-1 overflow-y-auto w-full pt-4 px-6 pb-6 scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-transparent" style={{ scrollbarWidth: 'thin' }}>
              <div
                key="التنمية المهنية"
                ref={focusedCardRef}
                className={`focused-card-true relative rounded-2xl border border-white/30 bg-gradient-to-br from-white/60 via-blue-100/60 to-white/40 shadow-xl flex flex-col min-w-0 w-full animate-fadeInUp mb-4`}
                style={{ padding: '1.25rem', alignSelf: 'center', zIndex: 50, pointerEvents: focusExit ? 'none' : 'auto', opacity: focusExit ? 0.7 : 1, backdropFilter: 'blur(10px)' }}
              >
                {/* Category Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400/40 to-purple-400/40 backdrop-blur-md rounded-xl flex items-center justify-center shadow border border-white/30">
                      <FontAwesomeIcon icon={getCategoryIcon("التنمية المهنية")} className="text-2xl text-blue-700 drop-shadow-lg" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center border border-white shadow animate-pulse">
                      <span className="text-white text-xs font-bold">2</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold tracking-wide text-blue-900 mb-1 drop-shadow-lg bg-gradient-to-r from-blue-900 to-purple-700 bg-clip-text text-transparent">
                      التنمية المهنية
                    </h3>
                    {/* <p className="text-xs text-blue-900/80 font-medium leading-relaxed mb-1">
                      {type.description || (language ? 'View and manage forms for this category.' : 'عرض وإدارة النماذج لهذا التصنيف.')}
                    </p> */}
                  </div>
                </div>
                {/* Forms Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div
                    key="مقابلات شخصية"
                    className="group bg-white/80 backdrop-blur rounded-xl shadow-lg border border-white/40 px-4 py-4 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 animate-fadeInUp cursor-pointer hover:border-blue-400/60 flex flex-col"
                    style={{ animationDelay: `${1 * 80}ms` }}
                    onClick={handleInterviewClick}
                  >
                    {/* Form Header */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 rounded-lg flex items-center justify-center shadow group-hover:scale-110 transition-transform duration-300">
                        <FontAwesomeIcon icon={faPlus} className="text-white text-base" />
                      </div>
                      <h4 className="text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        مقابلات شخصية
                      </h4>
                    </div>
                    {/* Action Button */}
                    <div className="pt-2 mt-auto">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleInterviewClick();
                        }}
                        className="w-full bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-700 text-white font-bold py-2 px-4 rounded-full shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 group relative overflow-hidden text-base"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                        <span className="relative z-10">{language ? 'Open Form' : 'فتح النموذج'}</span>
                        <FontAwesomeIcon icon={faArrowRight} className="text-xs group-hover:translate-x-1 transition-transform relative z-10" />
                      </button>
                    </div>
                  </div>
                  <div
                    key="ملاحظة جلسة تدريبية"
                    className="group bg-white/80 backdrop-blur rounded-xl shadow-lg border border-white/40 px-4 py-4 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 animate-fadeInUp cursor-pointer hover:border-blue-400/60 flex flex-col"
                    style={{ animationDelay: `${1 * 80}ms` }}
                    onClick={handleTestClick}
                  >
                    {/* Form Header */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 rounded-lg flex items-center justify-center shadow group-hover:scale-110 transition-transform duration-300">
                        <FontAwesomeIcon icon={faPlus} className="text-white text-base" />
                      </div>
                      <h4 className="text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        ملاحظة جلسة تدريبية
                      </h4>
                    </div>
                    {/* Action Button */}
                    <div className="pt-2 mt-auto">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTestClick();
                        }}
                        className="w-full bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-700 text-white font-bold py-2 px-4 rounded-full shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 group relative overflow-hidden text-base"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                        <span className="relative z-10">{language ? 'Open Form' : 'فتح النموذج'}</span>
                        <FontAwesomeIcon icon={faArrowRight} className="text-xs group-hover:translate-x-1 transition-transform relative z-10" />
                      </button>
                    </div>
                  </div>
                  {pd.map(type => (
                    <div>
                        {type.forms.map((form, idx) => (
                          <div
                            key={form.id}
                            className="group bg-white/80 backdrop-blur rounded-xl shadow-lg border border-white/40 px-4 py-4 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 animate-fadeInUp cursor-pointer hover:border-blue-400/60 flex flex-col"
                            style={{ animationDelay: `${idx * 80}ms` }}
                            onClick={() => handleClick(form.id, form.ar_name, form.ar_name, form.permission, type.reviewee)}
                          >
                            {/* Form Header */}
                            <div className="flex items-center gap-2 mb-4">
                              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 rounded-lg flex items-center justify-center shadow group-hover:scale-110 transition-transform duration-300">
                                <FontAwesomeIcon icon={faPlus} className="text-white text-base" />
                              </div>
                              <h4 className="text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                {form.ar_name}
                              </h4>
                            </div>
                            {/* Action Button */}
                            <div className="pt-2 mt-auto">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleClick(form.id, form.ar_name, form.ar_name, form.permission, type.reviewee);
                                }}
                                className="w-full bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-700 text-white font-bold py-2 px-4 rounded-full shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 group relative overflow-hidden text-base"
                              >
                                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                                <span className="relative z-10">{language ? 'Open Form' : 'فتح النموذج'}</span>
                                <FontAwesomeIcon icon={faArrowRight} className="text-xs group-hover:translate-x-1 transition-transform relative z-10" />
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {focusedCardId && focusedCardId === "الاشراف اليومي" && (
        <div className="fixed inset-0 z-40 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[6px] transition-all duration-500 animate-fadeIn" onClick={focusExit ? undefined : handleFocusExit} />
          <div className="flex flex-col w-full max-w-[700px] min-h-[400px] max-h-[80vh] bg-white/30 backdrop-blur-xl shadow-2xl border border-white/50 rounded-3xl z-50 relative p-0 overflow-hidden" style={{ margin: '2vh auto', boxSizing: 'border-box' }}>
            {/* Sticky Glassy Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between w-full px-6 py-3 bg-white/40 backdrop-blur-lg border-b border-white/30" style={{ backdropFilter: 'blur(16px)' }}>
              <button
                className="px-5 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2 group z-50 text-base"
                onClick={() => {
                  setFocusedCardId(null);
                }}
                disabled={focusExit}
              >
                <FontAwesomeIcon icon={faArrowRight} className="text-base group-hover:translate-x-1 transition-transform" />
                {language ? 'Back to Categories' : 'العودة للفئات'}
              </button>
              <div className="flex items-center gap-3 bg-white/60 px-4 py-2 rounded-2xl shadow text-gray-800 text-sm font-bold">
                <FontAwesomeIcon icon={faUser} className="text-lg" />
                <span>الاشراف اليومي</span>
                <span className="ml-2 bg-orange-500 text-white rounded-full px-2 py-0.5 text-xs">2</span>
              </div>
            </div>
            {/* Cards Area with Custom Scrollbar */}
            <div className="flex-1 overflow-y-auto w-full pt-4 px-6 pb-6 scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-transparent" style={{ scrollbarWidth: 'thin' }}>
              <div
                key="الاشراف اليومي"
                ref={focusedCardRef}
                className={`focused-card-true relative rounded-2xl border border-white/30 bg-gradient-to-br from-white/60 via-blue-100/60 to-white/40 shadow-xl flex flex-col min-w-0 w-full animate-fadeInUp mb-4`}
                style={{ padding: '1.25rem', alignSelf: 'center', zIndex: 50, pointerEvents: focusExit ? 'none' : 'auto', opacity: focusExit ? 0.7 : 1, backdropFilter: 'blur(10px)' }}
              >
                {/* Category Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400/40 to-purple-400/40 backdrop-blur-md rounded-xl flex items-center justify-center shadow border border-white/30">
                      <FontAwesomeIcon icon={getCategoryIcon("الاشراف اليومي")} className="text-2xl text-blue-700 drop-shadow-lg" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center border border-white shadow animate-pulse">
                      <span className="text-white text-xs font-bold">2</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold tracking-wide text-blue-900 mb-1 drop-shadow-lg bg-gradient-to-r from-blue-900 to-purple-700 bg-clip-text text-transparent">
                      الاشراف اليومي
                    </h3>
                    {/* <p className="text-xs text-blue-900/80 font-medium leading-relaxed mb-1">
                      {type.description || (language ? 'View and manage forms for this category.' : 'عرض وإدارة النماذج لهذا التصنيف.')}
                    </p> */}
                  </div>
                </div>
                {/* Forms Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div
                    key="غياب المتدرب"
                    className="group bg-white/80 backdrop-blur rounded-xl shadow-lg border border-white/40 px-4 py-4 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 animate-fadeInUp cursor-pointer hover:border-blue-400/60 flex flex-col"
                    style={{ animationDelay: `${1 * 80}ms` }}
                    onClick={handleTraineeAttendanceClick}
                  >
                    {/* Form Header */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 rounded-lg flex items-center justify-center shadow group-hover:scale-110 transition-transform duration-300">
                        <FontAwesomeIcon icon={faPlus} className="text-white text-base" />
                      </div>
                      <h4 className="text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        غياب المتدرب
                      </h4>
                    </div>
                    {/* Action Button */}
                    <div className="pt-2 mt-auto">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTraineeAttendanceClick();
                        }}
                        className="w-full bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-700 text-white font-bold py-2 px-4 rounded-full shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 group relative overflow-hidden text-base"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                        <span className="relative z-10">{language ? 'Open Form' : 'فتح النموذج'}</span>
                        <FontAwesomeIcon icon={faArrowRight} className="text-xs group-hover:translate-x-1 transition-transform relative z-10" />
                      </button>
                    </div>
                  </div>
                  <div
                    key="وقائع المركز"
                    className="group bg-white/80 backdrop-blur rounded-xl shadow-lg border border-white/40 px-4 py-4 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 animate-fadeInUp cursor-pointer hover:border-blue-400/60 flex flex-col"
                    style={{ animationDelay: `${1 * 80}ms` }}
                    onClick={handleInistituteIncidentClick}
                  >
                    {/* Form Header */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 rounded-lg flex items-center justify-center shadow group-hover:scale-110 transition-transform duration-300">
                        <FontAwesomeIcon icon={faPlus} className="text-white text-base" />
                      </div>
                      <h4 className="text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        وقائع المركز
                      </h4>
                    </div>
                    {/* Action Button */}
                    <div className="pt-2 mt-auto">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleInistituteIncidentClick();
                        }}
                        className="w-full bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-700 text-white font-bold py-2 px-4 rounded-full shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 group relative overflow-hidden text-base"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                        <span className="relative z-10">{language ? 'Open Form' : 'فتح النموذج'}</span>
                        <FontAwesomeIcon icon={faArrowRight} className="text-xs group-hover:translate-x-1 transition-transform relative z-10" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TomsPms;