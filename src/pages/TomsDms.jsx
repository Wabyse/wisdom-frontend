import { useState, useEffect, useRef } from "react";
import "../styles/Dms.css";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Navigate, useLocation } from "react-router-dom";
import { downloadFileDms, downloadFileDms2, fetchingFiles, fetchingOrgs } from "../services/dms";
import { fetchDmsCategories } from "../services/data";
import { scrollDown } from "../utils/scrollDown";
import { useLanguage } from "../context/LanguageContext";
import LoadingScreen from "../components/LoadingScreen";
import DenyAccessPage from "../components/DenyAccessPage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faUser, faSignOutAlt, faThLarge, faSun, faMoon, faInfoCircle, faUpload, faFolder, faFileAlt, faDownload, faEye, faFilter, faCalendarAlt, faBuilding, faExpand, faCompress, faTasks } from "@fortawesome/free-solid-svg-icons";
import { useState as useThemeState } from "react";
import watomsLogo from '../assets/watoms3.png';
import { filterFileName } from "../utils/filterFileName";
import wabysLogo from '../assets/wabys.png';

const BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL;

const TomsDms = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userInfo, logout } = useAuth();
  const [selectedSchool, setSelectedSchool] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { language, setLanguage } = useLanguage();
  const [filtered, setFiltered] = useState([]);
  const [schools, setSchools] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [dateFrom, setDateFrom] = useState();
  const [dateTo, setDateTo] = useState();
  const [test, setTest] = useState(0);
  const targetDivRef = useRef(null);
  // THEME STATE
  const [darkMode, setDarkMode] = useThemeState(false);
  // MODAL STATE
  const [activeModal, setActiveModal] = useState(null);
  const [modalData, setModalData] = useState(null);
  // SEARCH STATE
  const [search, setSearch] = useState("");
  // FOCUS MODE STATE
  const [focusedSection, setFocusedSection] = useState(null);
  // MENU STATE
  const [menuOpen, setMenuOpen] = useState(false);
  // FULLSCREEN STATE
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Fullscreen toggle function
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullScreen(true);
    } else {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  // Fullscreen change event listener
  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullScreenChange);
  }, []);

  const handleClick = (id) => {
    navigate(`/watoms/dms/view/${id}`);
  };

  // const handleSubCategoryClick = () => {
  //   if (!selectedCategory) {
  //     alert("Please select a category first!");
  //   }
  // };

  const uploadDocument = () => {
    navigate(`/watoms/dms/upload`);
  };

  const resetFilters = (e) => {
    e.preventDefault();
    setDateTo();
    setDateFrom();
    setSelectedSchool("");
    setSelectedCategory("");
    setSelectedSubCategory("");
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date
      .toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
      .replace(",", ""); // Remove comma
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setSubCategories([]);
    setSelectedSubCategory("");
    if (!(Number(e.target.value) === 0)) {
      const filterSubCategories = categories.filter(category => Number(category.id) === Number(e.target.value))
      setSubCategories(filterSubCategories[0].subCategory);
    } else {
      setTest(test + 1);
    }
    scrollDown(targetDivRef);
  };

  const handleSubCategoryChange = (e) => {
    setSelectedSubCategory(e.target.value);
    scrollDown(targetDivRef);
  };

  const handleDateFromChange = (event) => {
    setDateFrom(event.target.value);
    scrollDown(targetDivRef);
  };

  const handleDateToChange = (event) => {
    setDateTo(event.target.value);
    scrollDown(targetDivRef);
  };

  const openPDF = (path) => {
    const safePath = path.filteredPath.replace(/\\/g, "/");
    const fileName = safePath.split("/").pop();
    const pdfUrl = `${BASE_URL}/api/v1/files/open/${encodeURIComponent(fileName)}`;
    window.open(pdfUrl, "_blank");
  };

  const handleSchoolChange = (e) => {
    setSelectedSchool(e.target.value);
    scrollDown(targetDivRef);
  };
  const handleDownload2 = async (path) => {
    try {
      // Ensure correct filename extraction for both windows and ubuntu
      const safePath = path.filteredPath.replace(/\\/g, "/");
      const fileName = safePath.split("/").pop(); // "1755607028842-دورة تفصيل ....pdf"

      await downloadFileDms2(encodeURIComponent(fileName), path);
    } catch (error) {
      console.error("Download error", error);
      alert("File download failed");
    }
  };

  // Main Menu Configuration
  const mainMenu = [
    {
      icon: faUpload,
      label: language ? "Upload Document" : "رفع ملف",
      color: "from-watomsBlue to-wisdomOrange",
      onClick: uploadDocument,
    },
    {
      icon: faFolder,
      label: language ? "Browse Files" : "تصفح الملفات",
      color: "from-wisdomOrange to-watomsBlue",
      onClick: () => {
        setModalData({ type: 'files', data: filtered });
        setActiveModal('files');
      },
    },
    {
      icon: faFilter,
      label: language ? "Advanced Filters" : "فلاتر متقدمة",
      color: "from-watomsBlue to-wisdomLightOrange",
      onClick: () => {
        setModalData({
          type: 'filters',
          data: {
            schools,
            categories,
            subCategories,
            selectedSchool,
            selectedCategory,
            selectedSubCategory,
            dateFrom,
            dateTo
          }
        });
        setActiveModal('filters');
      },
    },
  ];

  // Close modal function
  const closeModal = () => {
    setActiveModal(null);
    setModalData(null);
  };

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

  // Modal Components
  const FilesModal = ({ data, onClose }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden animate-modal-in">
        <div className="bg-gradient-to-r from-watomsBlue to-wisdomOrange p-6 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-extrabold">{language ? "Document Files" : "ملفات المستندات"}</h2>
            <button onClick={onClose} className="text-white hover:text-gray-200 text-2xl">
              ×
            </button>
          </div>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {data?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
              {data.map((file, idx) => (
                <div key={file.id} className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors cursor-pointer" onClick={() => handleClick(file.id)}>
                  <div className="flex items-center gap-3 mb-3">
                    <FontAwesomeIcon icon={faFileAlt} className="text-2xl text-watomsBlue" />
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 truncate">{filterFileName(file.filteredPath)}</h4>
                      <p className="text-sm text-gray-600">{formatDate(file.date)}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors" onClick={(e) => { e.stopPropagation(); openPDF(file); }}>
                      <FontAwesomeIcon icon={faEye} className="mr-1" />
                      {language ? "View" : "عرض"}
                    </button>
                    <button className="flex-1 px-3 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition-colors" onClick={(e) => { e.stopPropagation(); handleDownload2(file); }}>
                      <FontAwesomeIcon icon={faDownload} className="mr-1" />
                      {language ? "Download" : "تحميل"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FontAwesomeIcon icon={faFolder} className="text-6xl text-gray-300 mb-4" />
              <p className="text-xl text-gray-600">{language ? "No files available" : "لا توجد ملفات متاحة"}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const FiltersModal = ({ data, onClose }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-modal-in">
        <div className="bg-gradient-to-r from-wisdomOrange to-watomsBlue p-6 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-extrabold">{language ? "Advanced Filters" : "فلاتر متقدمة"}</h2>
            <button onClick={onClose} className="text-white hover:text-gray-200 text-2xl">
              ×
            </button>
          </div>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {userInfo.user_role === "Operations Excellence Lead" && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <FontAwesomeIcon icon={faBuilding} className="text-watomsBlue" />
                  {language ? "Institution Selection" : "اختيار المركز"}
                </h3>
                <select
                  value={selectedSchool || ""}
                  onChange={(e) => setSelectedSchool(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-watomsBlue focus:border-transparent"
                >
                  <option value="">{language ? "Select Institution" : "اختر المركز"}</option>
                  {data?.schools?.map((school) => (
                    <option key={school.id} value={school.id}>{school.name}</option>
                  ))}
                </select>
              </div>
            )}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <FontAwesomeIcon icon={faFolder} className="text-watomsBlue" />
                {language ? "Category Selection" : "اختيار التصنيف"}
              </h3>
              <select
                value={selectedCategory || ""}
                onChange={handleCategoryChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-watomsBlue focus:border-transparent"
              >
                <option value="">{language ? "Select Category" : "اختر التصنيف"}</option>
                {categories?.map((cat, idx) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <FontAwesomeIcon icon={faFileAlt} className="text-watomsBlue" />
                {language ? "Sub Category Selection" : "اختيار التصنيف الفرعي"}
              </h3>
              <select
                value={selectedSubCategory || ""}
                onChange={handleSubCategoryChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-watomsBlue focus:border-transparent"
              >
                <option value="">{language ? "Select Sub Category" : "اختر التصنيف الفرعي"}</option>
                {subCategories?.map((subCat) => (
                  <option key={subCat.id} value={subCat.id}>{subCat.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <FontAwesomeIcon icon={faCalendarAlt} className="text-watomsBlue" />
                {language ? "Date Range" : "نطاق التاريخ"}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{language ? "From:" : "من:"}</label>
                  <input
                    type="date"
                    value={dateFrom || ""}
                    onChange={handleDateFromChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-watomsBlue focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{language ? "To:" : "إلى:"}</label>
                  <input
                    type="date"
                    value={dateTo || ""}
                    onChange={handleDateToChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-watomsBlue focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-4 mt-8">
            <button
              onClick={resetFilters}
              className="flex-1 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-bold"
            >
              {language ? "Reset Filters" : "مسح الفلاتر"}
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-watomsBlue text-white rounded-lg hover:bg-blue-700 transition-colors font-bold"
            >
              {language ? "Apply Filters" : "تطبيق الفلاتر"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  useEffect(() => {
    const loadingFiles = async () => {
      try {
        const response = await fetchingFiles(userInfo);
        let newFiltered = [];
        const paths = response.data.files;
        let organizationId = selectedSchool && userInfo.user_role === "Operations Excellence Lead" ? Number(selectedSchool) : userInfo.user_role !== "Operations Excellence Lead" ? userInfo.organization_id : null;
        let fromDate = dateFrom ? new Date(dateFrom) : null;
        let toDate = dateTo ? new Date(dateTo) : null;
        let categoryFilter = selectedCategory ? Number(selectedCategory) : null;
        let subCategoryFilter = selectedSubCategory
          ? Number(selectedSubCategory)
          : null;

        const formatDate = (date) =>
          date
            ? new Date(date.getFullYear(), date.getMonth(), date.getDate())
            : null;

        const hasFilter =
          (selectedSchool !== 0 && selectedSchool !== "") ||
          (selectedCategory !== 0 && selectedCategory !== "") ||
          (selectedSubCategory !== 0 && selectedSubCategory !== "") ||
          dateFrom ||
          dateTo;
        if (hasFilter) {
          paths.forEach((filter) => {
            const fileDate = new Date(filter.createdAt);
            const isDateMatch =
              (!fromDate || formatDate(fileDate) >= formatDate(fromDate)) &&
              (!toDate || formatDate(fileDate) <= formatDate(toDate));
            const isOrganizationMatch =
              !organizationId || organizationId === filter.organization.id;
            const isCategoryMatch =
              !categoryFilter ||
              categoryFilter === filter.documentSubCategory.documentCategory.id;
            const isSubCategoryMatch =
              !subCategoryFilter ||
              subCategoryFilter === filter.documentSubCategory.id;

            if (
              isDateMatch &&
              isOrganizationMatch &&
              isCategoryMatch &&
              isSubCategoryMatch
            ) {
              const filteredPath = filter.file_path.split("\\").pop();
              newFiltered.push({
                id: filter.id,
                filteredPath,
                date: filter.createdAt,
              });
            }
          });
        } else if (
          selectedSchool === "" &&
          selectedCategory === "" &&
          selectedSubCategory === ""
        ) {
          console.log("done");
        } else {
          newFiltered = paths.map((filter) => ({
            id: filter.id,
            filteredPath: filter.file_path.split("\\").pop(),
            date: filter.createdAt,
          }));
        }
        setFiltered(newFiltered);
      } catch (error) {
        console.error("no files", error);
        setError(error);
      }
    };
    loadingFiles();
  }, [
    userInfo,
    dateFrom,
    dateTo,
    selectedSchool,
    selectedCategory,
    selectedSubCategory,
  ]);

  useEffect(() => {
    const fetchingOrg = async () => {
      try {
        const response = await fetchingOrgs(userInfo);
        const filteredVtcs = response.filter(vtc => vtc.id !== 1 && vtc.id !== 2 && vtc.id !== 6 && vtc.id !== 11);
        setSchools(filteredVtcs);
      } catch (error) {
        console.error("no files", error);
      }
    };

    fetchingOrg();
    setLoading(false);
  }, [userInfo]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetchDmsCategories(userInfo);

        let subCategory = [];
        setCategories(response);
        response.forEach((subs) => {
          if (Array.isArray(subs.subCategory)) {
            subs.subCategory.forEach((sub) => subCategory.push(sub));
          }
        });
        setSubCategories(subCategory);
      } catch (err) {
        console.error("API Error:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [test, userInfo]);

  const header = (label, path) => (
    <div className="flex justify-evenly">
      <button
        className={`text-wisdomOrange p-1 rounded hover:Text-wisdomDarkOrange ${language ? "w-[160px]" : "w-[90px]"
          }`}
        onClick={uploadDocument}
      >
        {language ? "Upload Document" : "رفع ملف"}
      </button>
    </div>
  );

  if (loading) return <LoadingScreen />;
  if (error?.status === 403) return <Navigate to="/login" state={{ from: location }} replace />;
  if (error) return <p>Error: {error.message}</p>;
  if (userInfo.user_role === "Student" || userInfo.user_role === "Trainee") return <DenyAccessPage homePage='/pms' />;
  if (userInfo?.code === 1452) return <DenyAccessPage homePage='/watoms/dashboard' />;
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
        {/* Logo and Search */}
        <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-6xl mb-12 gap-8">
          <div className="flex items-center gap-6">
            <img className="w-[100px] md:w-[120px] lg:w-[140px] cursor-pointer" src={wabysLogo} alt="Wabys Logo" onClick={() => navigate('/wabys')} />
            <div className='border-l-2 border-gray-500 p-1 h-8' />
            <img className="w-[100px] md:w-[120px] lg:w-[140px] cursor-pointer" src={watomsLogo} alt="Wabys Logo" onClick={() => navigate('/wabys')} />
          </div>
          <div className="flex-1 flex justify-center">
            <div className="relative w-full max-w-md">
              <FontAwesomeIcon icon={faSearch} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
              <input
                type="text"
                className="w-full pl-12 pr-4 py-1 rounded-full border border-gray-200 shadow focus:ring-2 focus:ring-watomsBlue bg-white/90 text-lg font-medium placeholder-gray-400 transition-all focus:border-watomsBlue focus:shadow-lg outline-none"
                placeholder={language ? "Search documents..." : "ابحث في المستندات..."}
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
        {/* Main Menu Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12 w-full max-w-5xl mt-8">
          {mainMenu.map((item, idx) => (
            <div
              key={item.label}
              className={`flex flex-col items-center justify-center bg-gradient-to-br ${item.color} rounded-3xl shadow-xl p-10 cursor-pointer hover:scale-105 transition-transform duration-300 group backdrop-blur-sm`}
              style={{ minHeight: '220px' }}
              onClick={item.onClick}
            >
              <FontAwesomeIcon icon={item.icon} className="text-6xl mb-6 text-white drop-shadow-lg group-hover:scale-110 transition-transform duration-300" />
              <span className="text-2xl font-extrabold text-white text-center drop-shadow-lg group-hover:scale-105 transition-transform duration-300">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Render Modals */}
      {activeModal === 'files' && <FilesModal data={modalData?.data} onClose={closeModal} />}
      {activeModal === 'filters' && <FiltersModal data={modalData?.data} onClose={closeModal} />}
    </div>
  );
};

export default TomsDms;