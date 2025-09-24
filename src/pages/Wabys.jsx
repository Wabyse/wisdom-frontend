import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import Popup from '../components/Popup';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faUser, faInfoCircle, faSearch, faSun, faMoon, faSignOutAlt, faExpand, faCompress,
    faSheetPlastic
} from "@fortawesome/free-solid-svg-icons";
import wabysLogo from '../assets/wabys.png'
import fullScreen from '../utils/fullScreen';
import useFullScreen from '../hooks/useFullScreen';
import { userFullName } from '../utils/userFullName';
import { getWabysSystems } from '../constants/constants';
import languageIcon from '../assets/languageIcon.png';
import { useSearchFilter } from '../hooks/useSearchFilter';
import SystemCard from '../components/SystemCard';
import DenyAccessPage from "../components/DenyAccessPage";

const Wabys = () => {
    const navigate = useNavigate();
    const { logout, userInfo } = useAuth();
    const { language, setLanguage } = useLanguage();
    const [notAvailable, setNotAvailable] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const isFullScreen = useFullScreen();
    // get all wabys system and turn only the systems that the user has access to available
    const systems = useMemo(
        () => getWabysSystems(language, userInfo?.organization_id),
        [language, userInfo?.organization_id]
    );
    // getTitle to use it in the search
    const getTitle = useCallback(system => system.title, []);
    const { search, setSearch, filteredItems: filteredSystems } = useSearchFilter(systems, getTitle);

    const handleSystemClick = (system) => {
        if (system.available) {
            navigate(system.path);
        } else {
            setNotAvailable(true);
        }
    };

    if (userInfo?.code === 1452) return <DenyAccessPage homePage='/watoms/dashboard' />;
    if (userInfo?.code === 1475) return <DenyAccessPage homePage='/watoms/news' />;

    return (
        <div className={`min-h-screen w-full font-[Cairo,sans-serif] transition-colors duration-500 ${darkMode ? 'bg-watomsBlue text-white' : 'bg-gradient-to-br from-blue-50 via-white to-purple-100 text-gray-900'} relative overflow-hidden`}>

            {/* Navbar */}
            <div className="relative z-10">
                {/* Navbar's Content */}
                <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-7xl mx-auto px-6 py-8 gap-8">
                    {/* Logo */}
                    <div className="flex items-center gap-6">
                        <img className={`w-[100px] md:w-[120px] lg:w-[140px] cursor-pointer ${darkMode && "bg-white rounded-full px-2"}`} src={wabysLogo} alt="Wabys Logo" onClick={() => navigate('/wabys')} />
                    </div>
                    {/* Search */}
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
                        {/* Dark Mode */}
                        <button onClick={() => setDarkMode(!darkMode)} className="rounded-full w-10 h-10 flex justify-center items-center bg-white/80 hover:bg-gray-200 shadow transition-all">
                            <FontAwesomeIcon icon={darkMode ? faSun : faMoon} className="text-xl text-watomsBlue" />
                        </button>
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
                        <span className="flex items-center gap-2 font-bold text-lg md:min-w-[120px] min-w-[300px] justify-center">
                            <FontAwesomeIcon icon={faUser} className="text-watomsBlue" />
                            {userFullName(userInfo, language)}
                        </span>
                        {/* Language Button */}
                        <img
                            src={languageIcon}
                            className="rounded-full w-10 h-10 flex justify-center items-center shadow transition-all font-bold text-base cursor-pointer"
                            onClick={() => setLanguage(!language)}
                            title={language ? 'العربية' : 'English'}
                            alt=''
                        />
                        {/* Trainees Registration Form */}
                        {(userInfo?.code === 3 || userInfo?.code === 10) && <button
                            className="rounded-full w-10 h-10 flex justify-center items-center bg-white/80 hover:bg-gray-200 shadow transition-all"
                            title={language ? 'trainees registration form' : 'استمارة تسجيل المتدربين'}
                            onClick={() => navigate('/view-trainees-registrations')}
                        >
                            <FontAwesomeIcon icon={faSheetPlastic} className="text-watomsBlue text-lg" />
                        </button>}
                        {/* System Info */}
                        <button
                            className="rounded-full w-10 h-10 flex justify-center items-center bg-white/80 hover:bg-gray-200 shadow transition-all"
                            title={language ? 'System Info' : 'معلومات النظام'}
                            onClick={() => setNotAvailable(true)}
                        >
                            <FontAwesomeIcon icon={faInfoCircle} className="text-watomsBlue text-lg" />
                        </button>
                        {/* Log out */}
                        <button
                            className="rounded-full w-10 h-10 flex justify-center items-center bg-white/80 hover:bg-gray-200 shadow transition-all"
                            onClick={() => { logout(); navigate('/login'); }}
                        >
                            <FontAwesomeIcon icon={faSignOutAlt} className="text-xl text-wisdomOrange" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 px-6 pb-4">
                {/* Wabys Systems Header */}
                <div className="text-center mb-8">
                    <h2 className={`text-3xl font-bold mb-2 ${darkMode ? "text-white" : "text-watomsBlue dark:text-watomsLightBlue"}`}>
                        {language ? "Wabys Systems" : "أنظمة وابيز"}
                    </h2>
                    <p className={`text-lg ${darkMode ? "text-white" : "text-gray-600 dark:text-darkTextSecondary"}`}>
                        {language ? "Access all integrated systems" : "الوصول لجميع الأنظمة المتكاملة"}
                    </p>
                </div>

                {/* Wabys Systems */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-12 max-w-7xl mx-auto">
                    {filteredSystems.map(system => (
                        <SystemCard
                            key={system.id}
                            handleClick={() => handleSystemClick(system)}
                            available={system.available}
                            color={system.color}
                            icon={system.icon}
                            title={system.title}
                            subtitle={system.subtitle}
                            redSubtitle={system.redSubtitle}
                            subtitle2={system.subtitle2}
                        />
                    ))}
                </div>
            </div>

            <Popup
                isOpen={notAvailable}
                onClose={() => setNotAvailable(false)}
                message={language ? "This system will be available soon" : "هذا النظام سيتم إطلاقه قريباً"}
                button={language ? "OK" : "حسناً"}
                form={false}
            />
        </div>
    );
};

export default Wabys;