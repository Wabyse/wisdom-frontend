import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import "../styles/Pms.css";
import { useNavigate, Navigate, useLocation } from "react-router-dom";
import { fetchForms } from "../services/pms";
import { useLanguage } from "../context/LanguageContext";
import Navbar2 from "../components/Navbar2";
import CollapsibleSection from "../components/CollapsibleSection";
import { useAuth } from "../context/AuthContext";
import LoadingScreen from "../components/LoadingScreen";
import { WISDOM_PMS_AR_LIST, PMS_DISCREPTION, WISDOM_PMS_EN_LIST, WISDOM_PMS_FORMS_LOGOS, WISDOM_PMS_HERO_INFO, WISDOM_PMS_ROLE_PERMISSION, WSIDOM_PMS_FORMS_ORDER } from "../constants/constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faChevronDown, faPlus, faChartLine, faUsers, faClipboardCheck, faGraduationCap, faShieldAlt, faClock, faExclamationTriangle, faUserTie, faBookOpen, faBuilding, faSchool, faIdCard, faAddressCard, faBriefcase, faClipboard, faSearch, faUser, faSignOutAlt, faThLarge, faSun, faMoon, faInfoCircle, faFolder, faTasks, faTimes, faArrowRight, faFolderOpen, faCog, faEdit, faKey, faStar, faFileAlt, faCheckCircle, faLink, faBook, faHeadset, faExpand, faCompress, faList, faLayerGroup } from "@fortawesome/free-solid-svg-icons";
import DenyAccessPage from "../components/DenyAccessPage";

// Move modal outside component to prevent recreation
const SimpleCategoriesModal = ({ data, onClose, language, getCategoryIcon, getCategoryGradient, setFocusedCardId }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
    <div className="relative bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[85vh] overflow-hidden border border-gray-100 modal-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-orange-500 p-6 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <FontAwesomeIcon icon={faThLarge} className="text-2xl" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">{language ? "Performance Categories" : "فئات الأداء"}</h2>
              <p className="text-white/80 text-lg">{language ? "Select a category to view forms" : "اختر فئة لعرض النماذج"}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-200 text-2xl"
          >
            ×
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 overflow-y-auto max-h-[calc(85vh-120px)] custom-scrollbar smooth-scroll">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {data?.map((category, idx) => (
            <div
              key={category.id}
              className="group relative bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 cursor-pointer hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 hover:scale-105 card-hover-lift"
              onClick={() => {
                setFocusedCardId(category.id);
                onClose();
              }}
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
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {language ? category.description || 'Performance management category' : category.descriptionAr || 'فئة إدارة الأداء'}
              </p>

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
        </div>

        {/* Empty State */}
        {(!data || data.length === 0) && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FontAwesomeIcon icon={faFolderOpen} className="text-4xl text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {language ? "No Categories Found" : "لم يتم العثور على فئات"}
            </h3>
            <p className="text-gray-600">
              {language ? "There are no performance categories available at the moment." : "لا توجد فئات أداء متاحة في الوقت الحالي."}
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>
            {language ? `Showing ${data?.length || 0} categories` : `عرض ${data?.length || 0} فئات`}
          </span>
          <span>
            {language ? "Click any category to view forms" : "انقر على أي فئة لعرض النماذج"}
          </span>
        </div>
      </div>
    </div>
  </div>
);

const ProfileModal = ({ data, onClose, language }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
    <div className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden modal-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 via-red-500 to-blue-600 p-6 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <FontAwesomeIcon icon={faUser} className="text-2xl" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">{language ? "User Profile" : "الملف الشخصي"}</h2>
              <p className="text-white/80 text-lg">{language ? "Account information and system access" : "معلومات الحساب والوصول للنظام"}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-200 text-2xl"
          >
            ×
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 overflow-y-auto max-h-[calc(85vh-120px)] custom-scrollbar smooth-scroll">
        {/* User Avatar and Basic Info */}
        <div className="flex items-center gap-6 mb-8">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
              <FontAwesomeIcon icon={faUser} className="text-3xl text-white" />
            </div>
            <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-1">{data?.username || 'User'}</h3>
            <p className="text-lg text-gray-600 mb-2">{data?.user_role || 'Role'}</p>
            <div className="flex items-center gap-2">
              <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full">
                {language ? 'Active' : 'نشط'}
              </span>
              <span className="text-sm text-gray-500">
                {language ? 'Last login: Today' : 'آخر تسجيل: اليوم'}
              </span>
            </div>
          </div>
        </div>

        {/* Account Information */}
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <FontAwesomeIcon icon={faIdCard} className="text-blue-600" />
              </div>
              <h4 className="text-lg font-bold text-gray-900">{language ? "Account Information" : "معلومات الحساب"}</h4>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                <span className="font-semibold text-gray-700">{language ? "Username:" : "اسم المستخدم:"}</span>
                <span className="text-gray-900 font-medium">{data?.username}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                <span className="font-semibold text-gray-700">{language ? "Role:" : "الدور:"}</span>
                <span className="text-gray-900 font-medium">{data?.user_role}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                <span className="font-semibold text-gray-700">{language ? "Email:" : "البريد الإلكتروني:"}</span>
                <span className="text-gray-900 font-medium">{data?.email || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* System Access */}
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <FontAwesomeIcon icon={faShieldAlt} className="text-green-600" />
              </div>
              <h4 className="text-lg font-bold text-gray-900">{language ? "System Access" : "الوصول للنظام"}</h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white px-4 py-3 rounded-lg flex items-center gap-2">
                <FontAwesomeIcon icon={faThLarge} className="text-sm" />
                <span className="font-semibold">PMS</span>
              </div>
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white px-4 py-3 rounded-lg flex items-center gap-2">
                <FontAwesomeIcon icon={faFolder} className="text-sm" />
                <span className="font-semibold">DMS</span>
              </div>
              <div className="bg-gradient-to-br from-gray-500 to-gray-600 text-white px-4 py-3 rounded-lg flex items-center gap-2">
                <FontAwesomeIcon icon={faTasks} className="text-sm" />
                <span className="font-semibold">TMS</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <FontAwesomeIcon icon={faCog} className="text-purple-600" />
              </div>
              <h4 className="text-lg font-bold text-gray-900">{language ? "Quick Actions" : "إجراءات سريعة"}</h4>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-3 rounded-lg flex items-center gap-2 transition-colors">
                <FontAwesomeIcon icon={faEdit} className="text-sm" />
                <span className="font-medium">{language ? "Edit Profile" : "تعديل الملف"}</span>
              </button>
              <button className="bg-orange-50 hover:bg-orange-100 text-orange-700 px-4 py-3 rounded-lg flex items-center gap-2 transition-colors">
                <FontAwesomeIcon icon={faKey} className="text-sm" />
                <span className="font-medium">{language ? "Change Password" : "تغيير كلمة المرور"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const InfoModal = ({ data, onClose, language, filteredForms }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
    <div className="relative bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden modal-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-orange-500 p-6 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <FontAwesomeIcon icon={faInfoCircle} className="text-2xl" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">{language ? "System Information" : "معلومات النظام"}</h2>
              <p className="text-white/80 text-lg">{language ? "System overview and featured features" : "نظرة عامة على النظام والميزات المميزة"}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-200 text-2xl"
          >
            ×
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)] custom-scrollbar smooth-scroll">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Featured Features */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <FontAwesomeIcon icon={faStar} className="text-white text-lg" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{language ? "Featured Features" : "الميزات المميزة"}</h3>
            </div>
            <div className="space-y-4">
              {data?.heroInfo?.map((slide, idx) => (
                <div key={idx} className="group bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-orange-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {slide.title}
                      </h4>
                      <p className="text-gray-700 leading-relaxed">
                        {slide.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Overview */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center">
                <FontAwesomeIcon icon={faChartLine} className="text-white text-lg" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{language ? "System Overview" : "نظرة عامة على النظام"}</h3>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <FontAwesomeIcon icon={faThLarge} className="text-2xl opacity-80" />
                  <span className="text-3xl font-bold">{filteredForms?.length || 0}</span>
                </div>
                <div className="text-sm opacity-90">{language ? "Categories" : "فئات"}</div>
              </div>
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <FontAwesomeIcon icon={faFileAlt} className="text-2xl opacity-80" />
                  <span className="text-3xl font-bold">{filteredForms?.reduce((acc, cat) => acc + cat.forms.length, 0) || 0}</span>
                </div>
                <div className="text-sm opacity-90">{language ? "Total Forms" : "إجمالي النماذج"}</div>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <FontAwesomeIcon icon={faClock} className="text-2xl opacity-80" />
                  <span className="text-3xl font-bold">24/7</span>
                </div>
                <div className="text-sm opacity-90">{language ? "Availability" : "التوفر"}</div>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <FontAwesomeIcon icon={faShieldAlt} className="text-2xl opacity-80" />
                  <span className="text-3xl font-bold">100%</span>
                </div>
                <div className="text-sm opacity-90">{language ? "Secure" : "آمن"}</div>
              </div>
            </div>

            {/* System Status */}
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-green-600" />
                </div>
                <h4 className="text-lg font-bold text-gray-900">{language ? "System Status" : "حالة النظام"}</h4>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-700">{language ? "Database Connection" : "اتصال قاعدة البيانات"}</span>
                  <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full">
                    {language ? 'Online' : 'متصل'}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-700">{language ? "API Services" : "خدمات API"}</span>
                  <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full">
                    {language ? 'Active' : 'نشط'}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-700">{language ? "Security Layer" : "طبقة الأمان"}</span>
                  <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full">
                    {language ? 'Protected' : 'محمي'}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FontAwesomeIcon icon={faLink} className="text-blue-600" />
                </div>
                <h4 className="text-lg font-bold text-gray-900">{language ? "Quick Links" : "روابط سريعة"}</h4>
              </div>
              <div className="grid grid-cols-1 gap-3">
                <button className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-3 rounded-lg flex items-center gap-2 transition-colors">
                  <FontAwesomeIcon icon={faBook} className="text-sm" />
                  <span className="font-medium">{language ? "Documentation" : "التوثيق"}</span>
                </button>
                <button className="bg-orange-50 hover:bg-orange-100 text-orange-700 px-4 py-3 rounded-lg flex items-center gap-2 transition-colors">
                  <FontAwesomeIcon icon={faHeadset} className="text-sm" />
                  <span className="font-medium">{language ? "Support Center" : "مركز الدعم"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const Pms = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [forms, setForms] = useState([]);
  const [pd, setPd] = useState([]);
  const [dailyOperations, setDailyOperations] = useState([]);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const { language, setLanguage } = useLanguage();
  const { userInfo, logout } = useAuth();
  const [isFullScreen, setIsFullScreen] = useState(false);

  const navigate = useNavigate();

  // Full screen functionality
  const toggleFullScreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullScreen(true);
      }).catch(err => {
        console.log('Error attempting to enable full screen:', err);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullScreen(false);
      }).catch(err => {
        console.log('Error attempting to exit full screen:', err);
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
        return name.toLowerCase().includes(search.toLowerCase());
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
      Array.isArray(WISDOM_PMS_HERO_INFO) &&
      WISDOM_PMS_HERO_INFO.length > 0 &&
      slideIdx >= WISDOM_PMS_HERO_INFO.length
    ) {
      setSlideIdx(0);
    }
  }, [slideIdx]);

  // Auto-advance slides
  useEffect(() => {
    if (!Array.isArray(WISDOM_PMS_HERO_INFO) || WISDOM_PMS_HERO_INFO.length === 0) return;
    const timer = setTimeout(() => {
      setSlideIdx((prev) => (prev + 1) % WISDOM_PMS_HERO_INFO.length);
    }, 4000);
    return () => clearTimeout(timer);
  }, [slideIdx]);

  // Animated hero text
  const heroText = language ? "Performance Management System" : "نظام إدارة الأداء";
  const heroDesc = language ? "Empower your organization with a next-generation, data-driven performance platform. Track, evaluate, and grow with style." : "منصة أداء عصرية لقياس وتطوير الأداء المؤسسي والفردي.";

  // Guard for hero info
  const currentSlide = Array.isArray(WISDOM_PMS_HERO_INFO) && WISDOM_PMS_HERO_INFO[slideIdx]
    ? WISDOM_PMS_HERO_INFO[slideIdx]
    : { img: '', title: '', description: '' };

  const handleClick = (id, en_name, ar_name, code, reviewee) => {
    navigate(`/pms/form/${id}`, {
      state: { formEnName: en_name, formArName: ar_name, lang: language, code, reviewee },
    });
  };

  const handleTeacherSubstitutionClick = () => {
    navigate(`/pms/teacher-substitutions`);
  };

  const handleTeacherLatnessClick = () => {
    navigate(`/pms/teacher-latness`);
  };

  const handleStudentAbsenceClick = () => {
    navigate(`/pms/student-absence`);
  };

  const handleSchoolIncidentClick = () => {
    navigate(`/pms/school-incident`);
  };

  const handleInterviewClick = () => {
    navigate(`/pms/interview`);
  };

  const handleStudentBehaviorClick = () => {
    navigate(`/pms/student-behavior`);
  };

  const handleTestClick = () => {
    navigate(`/pms/test`);
  };

  const toggleCategory = (categoryId) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  const getCategoryIcon = (categoryCode) => {
    const iconMap = {
      'Teacher': faUserTie,
      'Academic Principle': faGraduationCap,
      'Curriculum': faBookOpen,
      'HOD': faShieldAlt,
      'Edu Environment': faSchool,
      'Executive Manager': faBuilding,
      'Specialist': faIdCard,
      'Work Environment': faAddressCard,
      'Daily Operations': faClock,
      'PD': faChartLine,
      'behavior': faExclamationTriangle
    };
    return iconMap[categoryCode] || faClipboard;
  };

  const getCategoryColor = (categoryCode) => {
    const colorMap = {
      'Teacher': 'bg-blue-500',
      'Academic Principle': 'bg-purple-500',
      'Curriculum': 'bg-green-500',
      'HOD': 'bg-red-500',
      'Edu Environment': 'bg-yellow-500',
      'Executive Manager': 'bg-indigo-500',
      'Specialist': 'bg-pink-500',
      'Work Environment': 'bg-orange-500',
      'Daily Operations': 'bg-teal-500',
      'PD': 'bg-emerald-500',
      'Student behavior': 'bg-rose-500'
    };
    return colorMap[categoryCode] || 'bg-gray-500';
  };

  // Helper: category color gradients
  const getCategoryGradient = (code) => {
    const map = {
      "Teacher": "from-blue-400 to-blue-600",
      "Academic Principle": "from-purple-400 to-purple-600",
      "Edu Environment": "from-yellow-300 to-yellow-500",
      "Executive Manager": "from-indigo-400 to-indigo-600",
      "HOD": "from-red-400 to-red-600",
      "Curriculum": "from-green-400 to-green-600",
      "Work Enivornment": "from-gray-400 to-gray-600",
      "PD": "from-pink-400 to-pink-600",
      "Daily Operations": "from-teal-400 to-teal-600",
      "behavior": "from-orange-400 to-orange-600"
    };
    return map[code] || "from-slate-300 to-slate-500";
  };

  useEffect(() => {
    const loadForms = async () => {
      try {
        const rawData = await fetchForms(userInfo);
        const filtertomsForms = rawData.filter(
          (filter) =>
            filter.type !== "ClassRoom Observation" &&
            filter.type !== "curriculum" &&
            filter.type !== "normal2"
        );

        const groupedData = [];

        filtertomsForms.forEach((item) => {
          const codeKey2 = item.code.split(" | ")[1];
          const codePermission = item.code.split(" | ")[0];
          const codePermission2 = WISDOM_PMS_ROLE_PERMISSION[codePermission] || null;
          const codeKey = WISDOM_PMS_EN_LIST[codeKey2] || null;
          const codeAr = WISDOM_PMS_AR_LIST[codeKey2] || null;
          const codeKey3 = WISDOM_PMS_ROLE_PERMISSION[codeKey2] || null;
          if (codePermission2 === userInfo.user_role || (codePermission2 === "Employee" && userInfo.user_role !== "Student") || (codePermission2 === "Self" && codeKey === userInfo.user_role) || (codePermission2 === "Self" && codeKey === "Teacher" && userInfo.user_role === "Head of Department (HOD)") || (codePermission === "Cl" && userInfo.user_role === "Head of Department (HOD)") || userInfo.user_role === "Operations Excellence Lead") {
            let existingGroup = groupedData.find(
              (group) => group.code === codeKey
            );

            if (!existingGroup) {
              existingGroup = {
                id: item.id,
                code: codeKey,
                reviewee: codeKey3,
                codeAr: codeAr,
                forms: [],
              };
              groupedData.push(existingGroup);
            }

            existingGroup.forms.push({
              id: item.id,
              en_name: item.en_name,
              ar_name: item.ar_name,
              permission: codePermission2,
            });
          }
        });

        const generalForms = groupedData.filter(
          (filteredData) => filteredData.code !== "PD"
        );
        const filteredGeneralForms = generalForms.filter(
          (filteredData) => filteredData.code !== "Daily Operations"
        );
        const filter1 = groupedData.filter(
          (testData) => testData.code === "PD"
        );
        const filter2 = groupedData.filter(
          (testData) => testData.code === "Daily Operations"
        );

        const formsOrder = [6, 15, 9, 1, 18, 31, 22];

        const newForms = WSIDOM_PMS_FORMS_ORDER
          .map((id) => filteredGeneralForms[id])
          .filter((f) => f !== undefined);

        // Sort newForms according to formsOrder array
        const orderedForms = newForms.sort((a, b) => {
          const indexA = formsOrder.indexOf(a.id);
          const indexB = formsOrder.indexOf(b.id);

          // Forms not in formsOrder go to the end
          const safeIndexA = indexA === -1 ? formsOrder.length : indexA;
          const safeIndexB = indexB === -1 ? formsOrder.length : indexB;

          return safeIndexA - safeIndexB;
        });

        setForms(orderedForms);
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
    console.log('Opening categories modal with data:', filteredForms);
    setModalData({ type: 'categories', data: filteredForms });
    setActiveModal('categories');
  }, [filteredForms]);

  const handleProfileClick = useCallback(() => {
    console.log('Opening profile modal with data:', userInfo);
    setModalData({ type: 'profile', data: userInfo });
    setActiveModal('profile');
  }, [userInfo]);

  const handleInfoClick = useCallback(() => {
    console.log('Opening info modal with data:', { heroInfo: WISDOM_PMS_HERO_INFO, currentSlide });
    setModalData({ type: 'info', data: { heroInfo: WISDOM_PMS_HERO_INFO, currentSlide } });
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
  useEffect(() => {
    if (activeModal) {
      console.log('Modal opened:', activeModal, 'Data:', modalData);
    } else {
      console.log('Modal closed');
    }
  }, [activeModal, modalData]);

  // Close modal function
  const closeModal = useCallback(() => {
    console.log('Closing modal:', activeModal);
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
  if (!Array.isArray(WISDOM_PMS_HERO_INFO) || WISDOM_PMS_HERO_INFO.length === 0) {
    return <LoadingScreen />;
  }
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
        <div className="relative z-10 w-full px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <img className="w-[100px] md:w-[120px] lg:w-[140px]" src={require('../assets/wisdom.png')} alt="Wabys Logo" />
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
          <div className="flex items-center gap-4 relative">
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
            <span className="flex items-center gap-2 font-bold text-lg min-w-[120px]">
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
                  <button onClick={() => { setMenuOpen(false); navigate('/pms'); }} className="w-full text-left px-5 py-3 hover:bg-blue-50 flex items-center gap-2">
                    <FontAwesomeIcon icon={faThLarge} className="text-watomsBlue" /> PMS
                  </button>
                  <button onClick={() => { setMenuOpen(false); navigate('/dms'); }} className="w-full text-left px-5 py-3 hover:bg-blue-50 flex items-center gap-2">
                    <FontAwesomeIcon icon={faFolder} className="text-wisdomOrange" /> DMS
                  </button>
                  <button onClick={() => { setMenuOpen(false); navigate('/tms'); }} className="w-full text-left px-5 py-3 hover:bg-blue-50 flex items-center gap-2">
                    <FontAwesomeIcon icon={faTasks} className="text-blue-500" /> TMS
                  </button>
                  <button onClick={() => { setMenuOpen(false); navigate('/wisdom/dashboard'); }} className="w-full text-left px-5 py-3 hover:bg-blue-50 flex items-center gap-2">
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
            {language ? 'Performance Categories' : 'الفئات المستهدفة'}
          </h2>
          {/* Centered, subtle line under heading */}
          <div className="mx-auto mb-10 mt-2" style={{ height: '3px', width: '180px', background: 'linear-gradient(90deg,#a259f7 0%,#667eea 100%)', borderRadius: '2px', opacity: 0.18 }} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
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
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {language ? category.description || 'Performance management category' : category.descriptionAr || 'فئة إدارة الأداء'}
                </p>
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
            {pd.map((category, idx) => (
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
                      3 {language ? 'forms' : 'نموذج'}
                    </span>
                  </div>
                </div>
                {/* Category Title */}
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {language ? category.code : category.codeAr}
                </h3>
                {/* Category Description */}
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {language ? category.description || 'Performance management category' : category.descriptionAr || 'فئة إدارة الأداء'}
                </p>
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
                    3
                  </div>
                </div>
              </div>
            ))}
            {dailyOperations.map((category, idx) => (
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
                      5 {language ? 'forms' : 'نموذج'}
                    </span>
                  </div>
                </div>
                {/* Category Title */}
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {language ? category.code : category.codeAr}
                </h3>
                {/* Category Description */}
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {language ? category.description || 'Performance management category' : category.descriptionAr || 'فئة إدارة الأداء'}
                </p>
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
                    5
                  </div>
                </div>
              </div>
            ))}
            <div
              key="behavior"
              className="group relative bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 cursor-pointer hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 hover:scale-105 card-hover-lift"
              onClick={() => setFocusedCardId("behavior")}
            >
              {/* Category Icon */}
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl font-bold bg-gradient-to-br ${getCategoryGradient("behavior")}`}>
                  <FontAwesomeIcon icon={getCategoryIcon("behavior")} />
                </div>
                <div className="text-right">
                  <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded-full">
                    1 {language ? 'forms' : 'نموذج'}
                  </span>
                </div>
              </div>
              {/* Category Title */}
              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                {language ? "Student Behavior" : "سلوك الطالب"}
              </h3>
              {/* Category Description */}
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {language ? 'Performance management category' : 'فئة إدارة الأداء'}
              </p>
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
                  1
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Focus Mode Rendering */}
      {focusedCardId && (
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
                        onClick={() => handleClick(form.id, form.en_name, form.ar_name, form.permission, type.reviewee)}
                      >
                        {/* Form Header */}
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 rounded-lg flex items-center justify-center shadow group-hover:scale-110 transition-transform duration-300">
                            <FontAwesomeIcon icon={faPlus} className="text-white text-base" />
                          </div>
                          <h4 className="text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {language ? form.en_name : form.ar_name}
                          </h4>
                        </div>
                        {/* Action Button */}
                        <div className="pt-2 mt-auto">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleClick(form.id, form.en_name, form.ar_name, form.permission, type.reviewee);
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
              {pd.filter(type => type.id === focusedCardId).map(type => (
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
                        <span className="text-white text-xs font-bold">3</span>
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
                        onClick={() => handleClick(form.id, form.en_name, form.ar_name, form.permission, type.reviewee)}
                      >
                        {/* Form Header */}
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 rounded-lg flex items-center justify-center shadow group-hover:scale-110 transition-transform duration-300">
                            <FontAwesomeIcon icon={faPlus} className="text-white text-base" />
                          </div>
                          <h4 className="text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {language ? form.en_name : form.ar_name}
                          </h4>
                        </div>
                        {/* Action Button */}
                        <div className="pt-2 mt-auto">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleClick(form.id, form.en_name, form.ar_name, form.permission, type.reviewee);
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
                    <div
                      key="interviews"
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
                          {language ? "interview" : "مقابلات شخصية"}
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
                      key="test"
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
                          {language ? "test" : "اختبار تربوي"}
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
                  </div>
                </div>
              ))}
              {dailyOperations.filter(type => type.id === focusedCardId).map(type => (
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
                        <span className="text-white text-xs font-bold">5</span>
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
                        onClick={() => handleClick(form.id, form.en_name, form.ar_name, form.permission, type.reviewee)}
                      >
                        {/* Form Header */}
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 rounded-lg flex items-center justify-center shadow group-hover:scale-110 transition-transform duration-300">
                            <FontAwesomeIcon icon={faPlus} className="text-white text-base" />
                          </div>
                          <h4 className="text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {language ? form.en_name : form.ar_name}
                          </h4>
                        </div>
                        {/* Action Button */}
                        <div className="pt-2 mt-auto">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleClick(form.id, form.en_name, form.ar_name, form.permission, type.reviewee);
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
                    <div
                      key="substitution"
                      className="group bg-white/80 backdrop-blur rounded-xl shadow-lg border border-white/40 px-4 py-4 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 animate-fadeInUp cursor-pointer hover:border-blue-400/60 flex flex-col"
                      style={{ animationDelay: `${1 * 80}ms` }}
                      onClick={handleTeacherSubstitutionClick}
                    >
                      {/* Form Header */}
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 rounded-lg flex items-center justify-center shadow group-hover:scale-110 transition-transform duration-300">
                          <FontAwesomeIcon icon={faPlus} className="text-white text-base" />
                        </div>
                        <h4 className="text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {language ? "Teacher Substitution" : "الاحتياطي"}
                        </h4>
                      </div>
                      {/* Action Button */}
                      <div className="pt-2 mt-auto">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTeacherSubstitutionClick();
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
                      key="latness"
                      className="group bg-white/80 backdrop-blur rounded-xl shadow-lg border border-white/40 px-4 py-4 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 animate-fadeInUp cursor-pointer hover:border-blue-400/60 flex flex-col"
                      style={{ animationDelay: `${1 * 80}ms` }}
                      onClick={handleTeacherLatnessClick}
                    >
                      {/* Form Header */}
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 rounded-lg flex items-center justify-center shadow group-hover:scale-110 transition-transform duration-300">
                          <FontAwesomeIcon icon={faPlus} className="text-white text-base" />
                        </div>
                        <h4 className="text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {language ? "Teacher Latness" : "تاخير المعلم"}
                        </h4>
                      </div>
                      {/* Action Button */}
                      <div className="pt-2 mt-auto">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTeacherLatnessClick();
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
                      key="incident"
                      className="group bg-white/80 backdrop-blur rounded-xl shadow-lg border border-white/40 px-4 py-4 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 animate-fadeInUp cursor-pointer hover:border-blue-400/60 flex flex-col"
                      style={{ animationDelay: `${1 * 80}ms` }}
                      onClick={handleSchoolIncidentClick}
                    >
                      {/* Form Header */}
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 rounded-lg flex items-center justify-center shadow group-hover:scale-110 transition-transform duration-300">
                          <FontAwesomeIcon icon={faPlus} className="text-white text-base" />
                        </div>
                        <h4 className="text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {language ? "School Incident" : "حوادث المدرسة"}
                        </h4>
                      </div>
                      {/* Action Button */}
                      <div className="pt-2 mt-auto">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSchoolIncidentClick();
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
                      key="attendance"
                      className="group bg-white/80 backdrop-blur rounded-xl shadow-lg border border-white/40 px-4 py-4 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 animate-fadeInUp cursor-pointer hover:border-blue-400/60 flex flex-col"
                      style={{ animationDelay: `${1 * 80}ms` }}
                      onClick={handleStudentAbsenceClick}
                    >
                      {/* Form Header */}
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 rounded-lg flex items-center justify-center shadow group-hover:scale-110 transition-transform duration-300">
                          <FontAwesomeIcon icon={faPlus} className="text-white text-base" />
                        </div>
                        <h4 className="text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {language ? "Student Absence" : "غياب الطلاب"}
                        </h4>
                      </div>
                      {/* Action Button */}
                      <div className="pt-2 mt-auto">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStudentAbsenceClick();
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
              ))}
              {focusedCardId === "behavior" && <div
                key="studentBehavior"
                ref={focusedCardRef}
                className={`focused-card-true relative rounded-2xl border border-white/30 bg-gradient-to-br from-white/60 via-blue-100/60 to-white/40 shadow-xl flex flex-col min-w-0 w-full animate-fadeInUp mb-4`}
                style={{ padding: '1.25rem', alignSelf: 'center', zIndex: 50, pointerEvents: focusExit ? 'none' : 'auto', opacity: focusExit ? 0.7 : 1, backdropFilter: 'blur(10px)' }}
              >
                {/* Category Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400/40 to-purple-400/40 backdrop-blur-md rounded-xl flex items-center justify-center shadow border border-white/30">
                      <FontAwesomeIcon icon={getCategoryIcon("behavior")} className="text-2xl text-blue-700 drop-shadow-lg" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center border border-white shadow animate-pulse">
                      <span className="text-white text-xs font-bold">5</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold tracking-wide text-blue-900 mb-1 drop-shadow-lg bg-gradient-to-r from-blue-900 to-purple-700 bg-clip-text text-transparent">
                      {language ? "Student Behavior" : "سلوك الطالب"}
                    </h3>
                    <p className="text-xs text-blue-900/80 font-medium leading-relaxed mb-1">
                      {(language ? 'View and manage forms for this category.' : 'عرض وإدارة النماذج لهذا التصنيف.')}
                    </p>
                  </div>
                </div>
                {/* Forms Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div
                    key="studentBehavior"
                    className="group bg-white/80 backdrop-blur rounded-xl shadow-lg border border-white/40 px-4 py-4 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 animate-fadeInUp cursor-pointer hover:border-blue-400/60 flex flex-col"
                    style={{ animationDelay: `${1 * 80}ms` }}
                    onClick={handleStudentBehaviorClick}
                  >
                    {/* Form Header */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 rounded-lg flex items-center justify-center shadow group-hover:scale-110 transition-transform duration-300">
                        <FontAwesomeIcon icon={faPlus} className="text-white text-base" />
                      </div>
                      <h4 className="text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {language ? "Student Behavior" : "سلوك الطالب"}
                      </h4>
                    </div>
                    {/* Action Button */}
                    <div className="pt-2 mt-auto">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStudentBehaviorClick();
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
              </div>}
            </div>
          </div>
        </div>
      )}
      {/* Modals */}
      {activeModal === 'categories' && (
        <SimpleCategoriesModal
          key="categories-modal"
          data={modalData?.data}
          onClose={closeModal}
          language={language}
          getCategoryIcon={getCategoryIcon}
          getCategoryGradient={getCategoryGradient}
          setFocusedCardId={setFocusedCardId}
        />
      )}
      {activeModal === 'profile' && (
        <ProfileModal
          key="profile-modal"
          data={modalData?.data}
          onClose={closeModal}
          language={language}
        />
      )}
      {activeModal === 'info' && (
        <InfoModal
          key="info-modal"
          data={modalData?.data}
          onClose={closeModal}
          language={language}
          filteredForms={filteredForms}
        />
      )}
    </div>
  );
};

export default Pms;