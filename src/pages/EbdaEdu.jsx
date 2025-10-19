import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import Popup from '../components/Popup';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faUser, faInfoCircle, faSearch, faSun, faMoon, faSignOutAlt, faExpand, faCompress,
    faSheetPlastic
} from "@fortawesome/free-solid-svg-icons";
import watomsLogo from '../assets/watoms3.png';
import fullScreen from '../utils/fullScreen';
import useFullScreen from '../hooks/useFullScreen';
import { userFullName } from '../utils/userFullName';
import { getEbdaEduSystems } from '../constants/constants';
import { useSearchFilter } from '../hooks/useSearchFilter';
import wabysLogo from '../assets/wabys.png';
import SystemCard from '../components/SystemCard';
import DenyAccessPage from '../components/DenyAccessPage';
import { useEbdaEduAuth } from '../context/EbdaEduAuthContext';
import ebdaeduLogo from '../assets/ebad-edu.png'

const EbdaEdu = () => {
    const navigate = useNavigate();
    const { logout, ebdaUserInfo } = useEbdaEduAuth();
    const { language, setLanguage } = useLanguage();
    const [currentTime, setCurrentTime] = useState(new Date());
    const [notAvailable, setNotAvailable] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const isFullScreen = useFullScreen();
    const systems = useMemo(
        () => getEbdaEduSystems(language, ebdaUserInfo?.organization_id),
        [language, ebdaUserInfo?.organization_id]
    );
    const getTitle = useCallback(system => system.title, []);
    const { search, setSearch, filteredItems: filteredSystems } = useSearchFilter(systems, getTitle);

    // Update time every minute // why?
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000);
        return () => clearInterval(timer);
    }, []);

    const togglePopup = (status) => setNotAvailable(status);

    // Get greeting based on time
    const getGreeting = () => {
        const hour = currentTime.getHours();
        if (hour < 12) return language ? 'Good Morning' : 'صباح الخير';
        if (hour < 17) return language ? 'Good Afternoon' : 'مساء الخير';
        return language ? 'Good Evening' : 'مساء الخير';
    };

    const handleSystemClick = (system) => {
        if (system.available) {
            navigate(system.path);
        } else {
            togglePopup(true);
        }
    };

    return (
        <div className={`min-h-screen w-full font-[Cairo,sans-serif] transition-colors duration-500 ${darkMode ? 'bg-watomsBlue text-white' : 'bg-gradient-to-br from-blue-50 via-white to-purple-100 text-gray-900'} relative overflow-hidden`}>
            {/* Modern Background with Abstract Shapes */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Animated Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 via-purple-100/20 to-pink-100/30 animate-pulse" style={{ animationDuration: '8s' }} />

                
                {/* Grid Pattern */}
                <div className="absolute inset-0 opacity-5">
                    <div className="w-full h-full" style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, ${darkMode ? 'white' : 'gray'} 1px, transparent 0)`,
                        backgroundSize: '40px 40px'
                    }} />
                </div>
            </div>

            {/* Header Section */}
            <div className="relative z-10">
                {/* Logo and Search */}
                <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-7xl mx-auto px-6 py-8 gap-8">
                    <div className="flex items-center gap-6">
                        <img className="w-[100px] md:w-[100px] lg:w-[100px] cursor-pointer" src={ebdaeduLogo} alt="Wabys Logo" onClick={() => navigate('/IEES')} />
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
                            onClick={fullScreen}
                            className="rounded-full w-10 h-10 flex justify-center items-center bg-white/80 hover:bg-gray-200 shadow transition-all"
                            title={language ? (isFullScreen ? 'Exit Full Screen' : 'Enter Full Screen') : (isFullScreen ? 'خروج من الشاشة الكاملة' : 'دخول الشاشة الكاملة')}
                        >
                            <FontAwesomeIcon
                                icon={isFullScreen ? faCompress : faExpand}
                                className="text-xl text-watomsBlue"
                            />
                        </button>
                        {/* User Info */}
                        <span className="flex items-center gap-2 font-bold text-lg md:min-w-[120px] min-w-[300px] justify-center">
                            <FontAwesomeIcon icon={faUser} className="text-watomsBlue" />
                            {userFullName(ebdaUserInfo, language)}
                        </span>
                        {/* Language Toggle Button */}
                        <button
                            className="rounded-full w-10 h-10 flex justify-center items-center bg-white/80 hover:bg-gray-200 shadow transition-all font-bold text-base"
                            onClick={() => setLanguage(!language)}
                            title={language ? 'العربية' : 'English'}
                        >
                            {language ? 'AR' : 'EN'}
                        </button>
                        {/* --- أيقونات الملف الشخصي ومعلومات النظام --- */}
                        <button
                            className="rounded-full w-10 h-10 flex justify-center items-center bg-white/80 hover:bg-gray-200 shadow transition-all"
                            title={language ? 'My Profile' : 'الملف الشخصي'}
                            onClick={() => navigate('/watoms/user-profile')}
                        >
                            <FontAwesomeIcon icon={faUser} className="text-watomsBlue text-lg" />
                        </button>
                        <button
                            className="rounded-full w-10 h-10 flex justify-center items-center bg-white/80 hover:bg-gray-200 shadow transition-all"
                            title={language ? 'System Info' : 'معلومات النظام'}
                            onClick={() => navigate('/watoms/system-info')}
                        >
                            <FontAwesomeIcon icon={faInfoCircle} className="text-watomsBlue text-lg" />
                        </button>
                        {/* --- نهاية الأيقونات --- */}
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
            <div className="relative z-10 px-6 pb-5">

                {/* Wabys Systems Grid - Smaller Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4 mb-12 max-w-7xl mx-auto">
                    {filteredSystems.map(system => (
                        <SystemCard
                            key={system.id}
                            handleClick={() => handleSystemClick(system)}
                            available={system.available}
                            color={system.color}
                            iconType="awesome"
                            icon={system.icon}
                            title={system.title}
                            subtitle={system.subtitle}
                        />
                    ))}
                </div>

                {/* Quick Stats */}
                {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-6xl mx-auto">
                    {quickStats.map((stat, idx) => (
                        <div key={idx} className="bg-white/90 dark:bg-darkCard/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 hover:scale-105 transition-transform duration-300">
                            <div className="flex items-center gap-4">
                                <div className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                                    <FontAwesomeIcon icon={stat.icon} className="text-2xl text-white" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-gray-600 dark:text-darkTextSecondary mb-1">{stat.label}</p>
                                    <p className="text-3xl font-bold text-watomsBlue dark:text-watomsLightBlue">{stat.value}</p>
                                    <p className="text-xs text-green-600 font-semibold">{stat.change}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div> */}

                {/* Recent Activity */}
                {/* <div className="bg-white/90 dark:bg-darkCard/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 max-w-6xl mx-auto">
                    <div className="flex items-center gap-3 mb-6">
                        <FontAwesomeIcon icon={faClock} className="text-2xl text-watomsBlue" />
                        <h3 className="text-2xl font-bold text-watomsBlue dark:text-watomsLightBlue">
                            {language ? "Recent Activity" : "النشاط الأخير"}
                        </h3>
                    </div>
                    <div className="space-y-4">
                        {recentActivity.map((activity, idx) => (
                            <div key={idx} className="flex items-center gap-4 p-4 bg-gray-50/50 dark:bg-darkBorder/50 rounded-2xl hover:bg-gray-100/50 dark:hover:bg-darkBorder transition-colors duration-200">
                                <div className={`w-12 h-12 ${activity.color} rounded-xl flex items-center justify-center text-white`}>
                                    <FontAwesomeIcon icon={activity.icon} className="text-lg" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-gray-800 dark:text-darkText">
                                        {activity.title}
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-darkTextSecondary">
                                        {activity.time}
                                    </p>
                                </div>
                                <FontAwesomeIcon icon={faArrowRight} className="text-gray-400" />
                            </div>
                        ))}
                    </div>
                </div> */}
            </div>

            <Popup
                isOpen={notAvailable}
                onClose={() => togglePopup(false)}
                message={language ? "This system will be available soon" : "هذا النظام سيتم إطلاقه قريباً"}
                button={language ? "OK" : "حسناً"}
                form={false}
            />
        </div>
    );
};

export default EbdaEdu; 