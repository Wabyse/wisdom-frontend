import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import Popup from '../components/Popup';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faThLarge, faUser, faInfoCircle, faSearch, faSun, faMoon, 
  faSignOutAlt, faChartLine, faUsers, faClipboardCheck, faGraduationCap, 
  faShieldAlt, faClock, faExclamationTriangle, faUserTie, faBookOpen, 
  faBuilding, faSchool, faIdCard, faAddressCard, faBriefcase, 
  faClipboard, faFolder, faTasks, faExpand, faCompress, faArrowRight,
  faHome, faCog, faBell, faStar, faTrophy, faCalendarAlt, faFileAlt,
  faLink, faBook, faHeadset, faLayerGroup, faRocket, faGem, faCrown,
  faDesktop, faMoneyBill, faChartBar
} from "@fortawesome/free-solid-svg-icons";
import watomsLogo from '../assets/watoms2.jpg'

const Watoms = () => {
    const navigate = useNavigate();
    const { logout, userInfo } = useAuth();
    const { language, setLanguage } = useLanguage();
    const [currentTime, setCurrentTime] = useState(new Date());
    const [notAvailable, setNotAvailable] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [search, setSearch] = useState('');
    const [isFullScreen, setIsFullScreen] = useState(false);

    // Update time every minute
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000);
        return () => clearInterval(timer);
    }, []);

    // Full screen functionality
    useEffect(() => {
        const handleFullScreenChange = () => {
            setIsFullScreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullScreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullScreenChange);
    }, []);

    const toggleFullScreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    };

    const openPopup = () => setNotAvailable(true);
    const closePopup = () => setNotAvailable(false);

    // Get greeting based on time
    const getGreeting = () => {
        const hour = currentTime.getHours();
        if (hour < 12) return language ? 'Good Morning' : 'صباح الخير';
        if (hour < 17) return language ? 'Good Afternoon' : 'مساء الخير';
        return language ? 'Good Evening' : 'مساء الخير';
    };

    // Helper function to get user display name
    const getUserDisplayName = () => {
        if (!userInfo) return language ? 'User' : 'مستخدم';
        return String(userInfo?.name);
    };

    // Wabys Systems Data
    const wabysSystems = [
        {
            id: 'pms',
            title: 'PMS',
            subtitle: language ? 'Performance Management System' : 'نظام إدارة الأداء',
            description: language ? 'Performance management and human resources' : 'إدارة الأداء والموارد البشرية',
            icon: faChartLine,
            path: '/watoms/pms',
            color: 'from-blue-500 to-blue-600',
            available: true
        },
        {
            id: 'dms',
            title: 'DMS',
            subtitle: language ? 'Document Management System' : 'نظام إدارة الوثائق',
            description: language ? 'Document and file management' : 'إدارة الوثائق والملفات',
            icon: faFolder,
            path: '/watoms/dms',
            color: 'from-green-500 to-green-600',
            available: true
        },
        {
            id: 'tms',
            title: 'TMS',
            subtitle: language ? 'Training Management System' : 'نظام إدارة التدريب',
            description: language ? 'Training and development management' : 'إدارة التدريب والتطوير',
            icon: faGraduationCap,
            path: '/watoms/tms',
            color: 'from-purple-500 to-purple-600',
            available: true
        },
        {
            id: 'lms',
            title: 'LMS',
            subtitle: language ? 'Learning Management System' : 'نظام إدارة التعلم',
            description: language ? 'E-learning management system' : 'نظام إدارة التعلم الإلكتروني',
            icon: faDesktop,
            path: '/lms',
            color: 'from-indigo-500 to-indigo-600',
            available: false
        },
        {
            id: 'pdms',
            title: 'PDMS',
            subtitle: language ? 'Project Document Management System' : 'نظام إدارة وثائق المشاريع',
            description: language ? 'Project document management' : 'إدارة وثائق المشاريع',
            icon: faFileAlt,
            path: '/pdms',
            color: 'from-orange-500 to-orange-600',
            available: false
        },
        {
            id: 'points',
            title: language ? 'Point System' : 'نظام النقاط',
            subtitle: language ? 'Points and Rewards System' : 'نظام النقاط والمكافآت',
            description: language ? 'Points management and incentives' : 'إدارة النقاط والحوافز',
            icon: faStar,
            path: '/points',
            color: 'from-yellow-500 to-yellow-600',
            available: false
        },
        {
            id: 'finance',
            title: language ? 'Finance System' : 'نظام المالية',
            subtitle: language ? 'Financial Management System' : 'نظام إدارة المالية',
            description: language ? 'Financial and accounting management' : 'إدارة الشؤون المالية والمحاسبية',
            icon: faMoneyBill,
            path: '/finance',
            color: 'from-emerald-500 to-emerald-600',
            available: false
        },
        {
            id: 'hr',
            title: 'HR System',
            subtitle: language ? 'Human Resources System' : 'نظام الموارد البشرية',
            description: language ? 'Employee affairs management' : 'إدارة شؤون الموظفين',
            icon: faUserTie,
            path: '/hr',
            color: 'from-pink-500 to-pink-600',
            available: false
        },
        {
            id: 'dashboards',
            title: language ? 'Dashboards' : 'لوحات التحكم',
            subtitle: language ? 'Control Panels and Statistics' : 'لوحات التحكم والإحصائيات',
            description: language ? 'Interactive management dashboards' : 'لوحات تحكم تفاعلية للإدارة',
            icon: faChartBar,
            path: '/watoms/dashboard',
            color: 'from-cyan-500 to-cyan-600',
            available: true
        }
    ];

    // Quick Stats Data
    const quickStats = [
        {
            icon: faChartLine,
            label: language ? "Completed Tasks" : "المهام المكتملة",
            value: "24",
            color: "from-blue-500 to-blue-600",
            change: "+12%"
        },
        {
            icon: faFolder,
            label: language ? "Documents" : "الوثائق",
            value: "156",
            color: "from-green-500 to-green-600",
            change: "+8%"
        },
        {
            icon: faGraduationCap,
            label: language ? "Training Sessions" : "جلسات التدريب",
            value: "8",
            color: "from-purple-500 to-purple-600",
            change: "+15%"
        }
    ];

    // Recent Activity Data
    const recentActivity = [
        {
            icon: faChartLine,
            title: language ? "Performance report completed" : "تم إكمال تقرير الأداء الشهري",
            time: language ? "2 hours ago" : "منذ ساعتين",
            color: "bg-blue-500"
        },
        {
            icon: faFolder,
            title: language ? "New document uploaded to DMS" : "تم رفع وثيقة جديدة في DMS",
            time: language ? "4 hours ago" : "منذ 4 ساعات",
            color: "bg-green-500"
        },
        {
            icon: faGraduationCap,
            title: language ? "Training session attendance recorded" : "تم تسجيل حضور في جلسة تدريبية",
            time: language ? "1 day ago" : "منذ يوم واحد",
            color: "bg-purple-500"
        }
    ];

    const handleSystemClick = (system) => {
        if (system.available) {
            navigate(system.path);
        } else {
            openPopup();
        }
    };

    return (
        <div className={`min-h-screen w-full font-[Cairo,sans-serif] transition-colors duration-500 ${darkMode ? 'bg-watomsBlue text-white' : 'bg-gradient-to-br from-blue-50 via-white to-purple-100 text-gray-900'} relative overflow-hidden`}>
            {/* Modern Background with Abstract Shapes */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Animated Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 via-purple-100/20 to-pink-100/30 animate-pulse" style={{animationDuration: '8s'}} />
                
                {/* Floating Geometric Shapes */}
                <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-watomsBlue/10 to-wisdomOrange/10 rounded-full blur-xl animate-bounce" style={{animationDuration: '6s', animationDelay: '0s'}} />
                <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-wisdomOrange/10 to-watomsBlue/10 rounded-full blur-xl animate-bounce" style={{animationDuration: '8s', animationDelay: '2s'}} />
                <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-gradient-to-br from-purple-400/10 to-blue-400/10 rounded-full blur-xl animate-bounce" style={{animationDuration: '7s', animationDelay: '1s'}} />
                <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-gradient-to-br from-pink-400/10 to-purple-400/10 rounded-full blur-xl animate-bounce" style={{animationDuration: '9s', animationDelay: '3s'}} />
                
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

            {/* Header Section */}
            <div className="relative z-10">
                {/* Logo and Search */}
                <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-7xl mx-auto px-6 py-8 gap-8">
                    <div className="flex items-center gap-6">
                        <img className="w-[100px] md:w-[120px] lg:w-[140px]" src={watomsLogo} alt="Wabys Logo" />
                    </div>
                    <div className="flex-1 flex justify-center">
                        <div className="relative w-full max-w-md">
                            <FontAwesomeIcon icon={faSearch} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                            <input
                                type="text"
                                className="w-full pl-12 pr-4 py-4 rounded-full border border-gray-200 shadow focus:ring-2 focus:ring-watomsBlue bg-white/90 text-lg font-medium placeholder-gray-400 transition-all focus:border-watomsBlue focus:shadow-lg outline-none"
                                placeholder={language ? "Search..." : "ابحث..."}
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                style={{fontFamily:'inherit'}}
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
                        {/* User Info */}
                        <span className="flex items-center gap-2 font-bold text-lg min-w-[120px]">
                            <FontAwesomeIcon icon={faUser} className="text-watomsBlue" />
                            {getUserDisplayName()}
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

                {/* Welcome Section - Text Only */}
                <div className="text-center mb-12 px-6">
                    <h1 className="text-4xl md:text-5xl font-bold text-watomsBlue dark:text-watomsLightBlue mb-4">
                        {getGreeting()}، {getUserDisplayName()}
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-darkTextSecondary mb-6">
                        {language ? "Welcome to the integrated Wabys system" : "مرحباً بك في نظام وابيز المتكامل"}
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 px-6 pb-12">
                {/* Wabys Systems Sub Header */}
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-watomsBlue dark:text-watomsLightBlue mb-2">
                        {language ? "Wabys Systems" : "أنظمة وابيز"}
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-darkTextSecondary">
                        {language ? "Access all integrated systems" : "الوصول لجميع الأنظمة المتكاملة"}
                    </p>
                </div>

                {/* Wabys Systems Grid - Smaller Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-12 max-w-7xl mx-auto">
                    {wabysSystems.map((system, idx) => (
                        <div
                            key={system.id}
                            onClick={() => handleSystemClick(system)}
                            className={`group cursor-pointer transform transition-all duration-300 hover:scale-105 ${
                                !system.available ? 'opacity-60' : ''
                            }`}
                        >
                            <div className={`bg-gradient-to-br ${system.color} text-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 relative overflow-hidden`}>
                                {/* Coming Soon Badge */}
                                {!system.available && (
                                    <div className="absolute top-2 right-2 bg-yellow-500 text-black text-xs px-2 py-1 rounded-full font-bold">
                                        {language ? 'Coming Soon' : 'قريباً'}
                                    </div>
                                )}
                                
                                {/* Background Pattern */}
                                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                
                                <div className="relative z-10">
                                    <div className="text-2xl mb-3 text-center">
                                        <FontAwesomeIcon icon={system.icon} />
                                    </div>
                                    <h3 className="text-lg font-bold mb-1 text-center">{system.title}</h3>
                                    <p className="text-xs opacity-90 mb-2 text-center">{system.subtitle}</p>
                                    <p className="text-xs opacity-75 leading-relaxed text-center">{system.description}</p>
                                    
                                    {/* Status Indicator */}
                                    <div className="mt-3 flex items-center justify-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${system.available ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
                                        <span className="text-xs opacity-75">
                                            {system.available ? (language ? 'Available' : 'متاح') : (language ? 'Coming Soon' : 'قريباً')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
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
                onClose={closePopup}
                message={language ? "This system will be available soon" : "هذا النظام سيتم إطلاقه قريباً"}
                button={language ? "OK" : "حسناً"}
                form={false}
            />
        </div>
    );
};

export default Watoms; 