import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import Popup from '../components/Popup';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faUser, faHouse, faSearch, faSun, faMoon, faSignOutAlt, faExpand, faCompress, faChartLine
} from "@fortawesome/free-solid-svg-icons";
import watomsLogo from '../assets/watoms3.png';
import fullScreen from '../utils/fullScreen';
import useFullScreen from '../hooks/useFullScreen';
import { userFullName } from '../utils/userFullName';
import { getWatomsSystems, WATOMS_PROJECTS } from '../constants/constants';
import { useSearchFilter } from '../hooks/useSearchFilter';
import wabysLogo from '../assets/wabys.png';
import DenyAccessPage from '../components/DenyAccessPage';

const Watoms = () => {
    const navigate = useNavigate();
    const { userInfo } = useAuth();
    const { language, setLanguage } = useLanguage();
    const [currentTime, setCurrentTime] = useState(new Date());
    const [notAvailable, setNotAvailable] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const isFullScreen = useFullScreen();
    const systems = useMemo(
        () => getWatomsSystems(language, userInfo?.organization_id, userInfo),
        [language, userInfo?.organization_id, userInfo]
    );
    const getTitle = useCallback(system => system.title, []);
    const { search, setSearch, filteredItems: filteredSystems } = useSearchFilter(systems, getTitle);

    const scrollRef = useRef(null);

    const scroll = (direction) => {
        const { current } = scrollRef;
        if (current) {
            const scrollAmount = 200;
            current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth",
            });
        }
    };

    const parentCardRef = useRef(null);
    const subCardRefs = useRef([]);
    const [arrowLines, setArrowLines] = useState([]);

    useEffect(() => {
        const updateArrows = () => {
            if (!parentCardRef.current) return;

            const parentRect = parentCardRef.current.getBoundingClientRect();
            const lines = subCardRefs.current.map((ref) => {
                if (!ref) return null;
                const rect = ref.getBoundingClientRect();
                return {
                    x1: parentRect.left + parentRect.width / 2,
                    y1: parentRect.bottom,
                    x2: rect.left + rect.width / 2,
                    y2: rect.top,
                };
            }).filter(Boolean);
            setArrowLines(lines);
        };

        updateArrows();
        window.addEventListener('resize', updateArrows);
        return () => window.removeEventListener('resize', updateArrows);
    }, []);

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

    if (userInfo?.code === 1452 || userInfo?.code === 1476) return <DenyAccessPage homePage='/watoms/dashboard' />;
    if (userInfo?.code === 1475) return <DenyAccessPage homePage='/watoms/news' />;
    if (userInfo?.code === 1310) return <DenyAccessPage homePage='/wisdom/dashboard' />;

    return (
        <div className={`min-h-screen w-full font-[Cairo,sans-serif] transition-colors duration-500 ${darkMode ? 'bg-watomsBlue text-white' : 'bg-gradient-to-br from-blue-50 via-white to-purple-100 text-gray-900'} relative overflow-hidden`}>

            {/* Header Section */}
            <div className="relative z-10">
                {/* Logo and Search */}
                <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-7xl mx-auto px-6 py-8 gap-8">
                    <div className="flex items-center gap-6">
                        <img className="w-[100px] md:w-[120px] lg:w-[140px] cursor-pointer" src={wabysLogo} alt="Wabys Logo" onClick={() => navigate('/wabys')} />
                        <div className='border-l-2 border-black p-1 h-12'/>
                        <img className="w-[100px] md:w-[120px] lg:w-[140px] cursor-pointer" src={watomsLogo} alt="Wabys Logo" onClick={() => navigate('/wabys')} />
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
                        {/* dark mode / light mode */}
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
                            {userFullName(userInfo, language)}
                        </span>
                        {/* Dashboard */}
                        <button
                            onClick={() => navigate('/watoms/dashboard')}
                            className="rounded-full w-10 h-10 flex justify-center items-center bg-white/80 hover:bg-gray-200 shadow transition-all"
                            title={language ? (isFullScreen ? 'Exit Full Screen' : 'Enter Full Screen') : (isFullScreen ? 'خروج من الشاشة الكاملة' : 'دخول الشاشة الكاملة')}
                        >
                            <FontAwesomeIcon
                                icon={faChartLine}
                                className="text-xl text-watomsBlue"
                            />
                        </button>
                        {/* Language Toggle Button */}
                        <button
                            className="rounded-full w-10 h-10 flex justify-center items-center bg-white/80 hover:bg-gray-200 shadow transition-all font-bold text-base"
                            onClick={() => setLanguage(!language)}
                            title={language ? 'العربية' : 'English'}
                        >
                            {language ? 'AR' : 'EN'}
                        </button>
                        {/* --- نهاية الأيقونات --- */}
                        <button
                            className="rounded-full w-10 h-10 flex justify-center items-center bg-white/80 hover:bg-gray-200 shadow transition-all"
                            onClick={() => navigate('/wabys')}
                        >
                            <FontAwesomeIcon icon={faHouse} className="text-xl" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="relative w-full px-6">
                {/* Scroll Buttons */}
                <button
                    onClick={() => scroll("left")}
                    className="absolute left-10 top-1/2 transform -translate-y-1/2 bg-gray-200 hover:bg-gray-300 p-2 rounded-full shadow z-10"
                >
                    ←
                </button>

                <div
                    ref={scrollRef}
                    className="flex justify-evenly overflow-x-hidden space-x-4 py-4 px-10 scroll-smooth w-[90%] mx-auto"
                >
                    {WATOMS_PROJECTS.map((project, idx) => (
                        <div className='min-w-[20%] m-0'>
                            <div
                                key={idx}
                                className="flex items-center justify-center bg-white border rounded-2xl shadow-md px-4 py-2 w-[80%]"
                            >
                                <span className="text-lg font-semibold mr-4">{project.code}</span>
                                <img
                                    src={project.image}
                                    alt={project.code}
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    onClick={() => scroll("right")}
                    className="absolute right-10 top-1/2 transform -translate-y-1/2 bg-gray-200 hover:bg-gray-300 p-2 rounded-full shadow z-10"
                >
                    →
                </button>
            </div>
            <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
                <defs>
                    <marker
                        id="arrowhead"
                        markerWidth="10"
                        markerHeight="7"
                        refX="0"
                        refY="3.5"
                        orient="auto"
                        fill="gray"
                    >
                        <polygon points="0 0, 10 3.5, 0 7" />
                    </marker>
                </defs>
                {arrowLines.map((line, idx) => (
                    <line
                        key={idx}
                        x1={line.x1}
                        y1={line.y1}
                        x2={line.x2}
                        y2={line.y2}
                        stroke="gray"
                        strokeWidth="2"
                        markerEnd="url(#arrowhead)"
                    />
                ))}
            </svg>
            <div className="flex flex-col items-center bg-white border rounded-2xl shadow-md px-4 p-2 w-[90%] mx-auto">
                <div className=" bg-white border rounded-2xl shadow-md px-4 p-2 w-[20%] mx-auto" ref={parentCardRef}>
                    <img src={WATOMS_PROJECTS[0].image} className='w-28 mx-auto' />
                    <h1 className="text-lg text-center font-semibold text-gray-500">{WATOMS_PROJECTS[0].code}</h1>
                    <h1 className="text-lg text-center text-gray-500">{WATOMS_PROJECTS[0].arabic_title}</h1>
                    <h1 className="text-lg text-center text-gray-500">{WATOMS_PROJECTS[0].english_title}</h1>
                </div>
                <div className="flex justify-between w-full px-28 mt-4">
                    {WATOMS_PROJECTS[0].projects.map((subProject, index) => (
                        <div
                            key={index}
                            ref={el => subCardRefs.current[index] = el}
                            className="bg-white border rounded-2xl shadow-md px-4 p-2 min-w-fit mx-auto mt-4">
                            <img src={subProject.image} className='w-44 mx-auto' />
                        </div>
                    ))}
                </div>
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

export default Watoms; 