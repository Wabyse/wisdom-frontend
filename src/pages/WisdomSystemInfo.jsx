import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faInfoCircle, faServer, faDatabase, faShieldAlt, faClock, 
  faUsers, faChartLine, faCog, faQuestionCircle, faBook, 
  faHeadset, faDownload, faExternalLinkAlt, faCheckCircle,
  faExclamationTriangle, faArrowLeft, faPhone
} from "@fortawesome/free-solid-svg-icons";
import DenyAccessPage from '../components/DenyAccessPage';

const WisdomSystemInfo = () => {
    const navigate = useNavigate();
    const { userCode } = useAuth();
    const { language } = useLanguage();
    const [activeTab, setActiveTab] = useState('overview');

    const systemInfo = {
        version: '2.1.0',
        lastUpdate: '2024-01-15',
        uptime: '99.9%',
        users: '1,247',
        systems: '9',
        supportEmail: 'support@wabys.com',
        supportPhone: '+966 11 123 4567'
    };

    const systemModules = [
        {
            name: 'PMS',
            status: 'active',
            description: language ? 'Performance Management System' : 'نظام إدارة الأداء',
            version: '2.1.0',
            lastUpdate: '2024-01-15'
        },
        {
            name: 'DMS',
            status: 'active',
            description: language ? 'Document Management System' : 'نظام إدارة الوثائق',
            version: '2.0.8',
            lastUpdate: '2024-01-10'
        },
        {
            name: 'TMS',
            status: 'active',
            description: language ? 'Training Management System' : 'نظام إدارة التدريب',
            version: '2.1.2',
            lastUpdate: '2024-01-12'
        },
        {
            name: 'LMS',
            status: 'development',
            description: language ? 'Learning Management System' : 'نظام إدارة التعلم',
            version: '1.5.0',
            lastUpdate: '2024-01-08'
        },
        {
            name: 'PDMS',
            status: 'development',
            description: language ? 'Project Document Management System' : 'نظام إدارة وثائق المشاريع',
            version: '1.2.0',
            lastUpdate: '2024-01-05'
        }
    ];

    const helpResources = [
        {
            title: language ? 'User Manual' : 'دليل المستخدم',
            description: language ? 'Complete guide for system usage' : 'دليل شامل لاستخدام النظام',
            icon: faBook,
            link: '#',
            type: 'manual'
        },
        {
            title: language ? 'Video Tutorials' : 'فيديوهات تعليمية',
            description: language ? 'Step-by-step video guides' : 'دروس فيديو خطوة بخطوة',
            icon: faHeadset,
            link: '#',
            type: 'video'
        },
        {
            title: language ? 'FAQ' : 'الأسئلة الشائعة',
            description: language ? 'Frequently asked questions' : 'الأسئلة المتكررة',
            icon: faQuestionCircle,
            link: '#',
            type: 'faq'
        },
        {
            title: language ? 'API Documentation' : 'وثائق API',
            description: language ? 'Technical documentation for developers' : 'وثائق تقنية للمطورين',
            icon: faCog,
            link: '#',
            type: 'api'
        }
    ];

    const systemStatus = [
        {
            service: language ? 'Web Server' : 'خادم الويب',
            status: 'operational',
            responseTime: '45ms',
            uptime: '99.9%'
        },
        {
            service: language ? 'Database' : 'قاعدة البيانات',
            status: 'operational',
            responseTime: '12ms',
            uptime: '99.8%'
        },
        {
            service: language ? 'File Storage' : 'تخزين الملفات',
            status: 'operational',
            responseTime: '78ms',
            uptime: '99.7%'
        },
        {
            service: language ? 'Email Service' : 'خدمة البريد الإلكتروني',
            status: 'operational',
            responseTime: '156ms',
            uptime: '99.5%'
        }
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'active':
            case 'operational':
                return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400';
            case 'development':
                return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400';
            case 'maintenance':
                return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20 dark:text-orange-400';
            case 'error':
                return 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400';
            default:
                return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20 dark:text-gray-400';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'active':
            case 'operational':
                return faCheckCircle;
            case 'development':
                return faClock;
            case 'maintenance':
                return faCog;
            case 'error':
                return faExclamationTriangle;
            default:
                return faInfoCircle;
        }
    };

    if (userCode === 1452 || userCode === 1476) return <DenyAccessPage homePage='/watoms/dashboard' />;
    if (userCode === 1475) return <DenyAccessPage homePage='/watoms/news' />;
    if (userCode === 1310) return <DenyAccessPage homePage='/wisdom/dashboard' />;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-100 dark:bg-darkBg font-[Cairo,sans-serif]">
            {/* Header */}
            <div className="bg-white dark:bg-darkCard shadow-lg">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate('/user-home')}
                                className="text-watomsBlue hover:text-watomsLightBlue transition-colors"
                            >
                                <FontAwesomeIcon icon={faArrowLeft} className="text-2xl" />
                            </button>
                            <h1 className="text-2xl font-bold text-watomsBlue dark:text-watomsLightBlue">
                                {language ? 'System Information' : 'معلومات النظام'}
                            </h1>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 px-3 py-1 rounded-full text-sm font-medium">
                                {language ? 'All Systems Operational' : 'جميع الأنظمة تعمل'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* System Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white dark:bg-darkCard rounded-2xl shadow-xl p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
                                <FontAwesomeIcon icon={faServer} className="text-blue-600 text-xl" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 dark:text-darkTextSecondary">
                                    {language ? 'System Version' : 'إصدار النظام'}
                                </p>
                                <p className="text-2xl font-bold text-gray-800 dark:text-darkText">
                                    {systemInfo.version}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-darkCard rounded-2xl shadow-xl p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center">
                                <FontAwesomeIcon icon={faShieldAlt} className="text-green-600 text-xl" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 dark:text-darkTextSecondary">
                                    {language ? 'Uptime' : 'وقت التشغيل'}
                                </p>
                                <p className="text-2xl font-bold text-gray-800 dark:text-darkText">
                                    {systemInfo.uptime}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-darkCard rounded-2xl shadow-xl p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-xl flex items-center justify-center">
                                <FontAwesomeIcon icon={faUsers} className="text-purple-600 text-xl" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 dark:text-darkTextSecondary">
                                    {language ? 'Active Users' : 'المستخدمين النشطين'}
                                </p>
                                <p className="text-2xl font-bold text-gray-800 dark:text-darkText">
                                    {systemInfo.users}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-darkCard rounded-2xl shadow-xl p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-xl flex items-center justify-center">
                                <FontAwesomeIcon icon={faChartLine} className="text-orange-600 text-xl" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 dark:text-darkTextSecondary">
                                    {language ? 'System Modules' : 'وحدات النظام'}
                                </p>
                                <p className="text-2xl font-bold text-gray-800 dark:text-darkText">
                                    {systemInfo.systems}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white dark:bg-darkCard rounded-2xl shadow-xl mb-8">
                    <div className="border-b border-gray-200 dark:border-darkBorder">
                        <nav className="flex space-x-8 px-6">
                            {[
                                { id: 'overview', label: language ? 'Overview' : 'نظرة عامة' },
                                { id: 'modules', label: language ? 'System Modules' : 'وحدات النظام' },
                                { id: 'status', label: language ? 'System Status' : 'حالة النظام' },
                                { id: 'help', label: language ? 'Help & Support' : 'المساعدة والدعم' }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                        activeTab === tab.id
                                            ? 'border-watomsBlue text-watomsBlue'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div className="p-6">
                        {/* Overview Tab */}
                        {activeTab === 'overview' && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-800 dark:text-darkText mb-4">
                                            {language ? 'System Information' : 'معلومات النظام'}
                                        </h3>
                                        <div className="space-y-3">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600 dark:text-darkTextSecondary">
                                                    {language ? 'Version' : 'الإصدار'}
                                                </span>
                                                <span className="font-medium text-gray-800 dark:text-darkText">
                                                    {systemInfo.version}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600 dark:text-darkTextSecondary">
                                                    {language ? 'Last Update' : 'آخر تحديث'}
                                                </span>
                                                <span className="font-medium text-gray-800 dark:text-darkText">
                                                    {systemInfo.lastUpdate}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600 dark:text-darkTextSecondary">
                                                    {language ? 'Uptime' : 'وقت التشغيل'}
                                                </span>
                                                <span className="font-medium text-gray-800 dark:text-darkText">
                                                    {systemInfo.uptime}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-800 dark:text-darkText mb-4">
                                            {language ? 'Contact Support' : 'تواصل مع الدعم'}
                                        </h3>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3">
                                                <FontAwesomeIcon icon={faHeadset} className="text-watomsBlue" />
                                                <span className="text-gray-800 dark:text-darkText">
                                                    {systemInfo.supportEmail}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <FontAwesomeIcon icon={faPhone} className="text-watomsBlue" />
                                                <span className="text-gray-800 dark:text-darkText">
                                                    {systemInfo.supportPhone}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Modules Tab */}
                        {activeTab === 'modules' && (
                            <div className="space-y-4">
                                {systemModules.map((module, index) => (
                                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-darkBorder rounded-lg">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-gradient-to-br from-watomsBlue to-wisdomOrange rounded-xl flex items-center justify-center text-white font-bold">
                                                {module.name}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-800 dark:text-darkText">
                                                    {module.name}
                                                </h4>
                                                <p className="text-sm text-gray-600 dark:text-darkTextSecondary">
                                                    {module.description}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <p className="text-sm text-gray-600 dark:text-darkTextSecondary">
                                                    {language ? 'Version' : 'الإصدار'} {module.version}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {module.lastUpdate}
                                                </p>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(module.status)}`}>
                                                <FontAwesomeIcon icon={getStatusIcon(module.status)} className="mr-1" />
                                                {language ? 
                                                    (module.status === 'active' ? 'Active' : 
                                                     module.status === 'development' ? 'Development' : module.status) :
                                                    (module.status === 'active' ? 'نشط' : 
                                                     module.status === 'development' ? 'قيد التطوير' : module.status)
                                                }
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Status Tab */}
                        {activeTab === 'status' && (
                            <div className="space-y-4">
                                {systemStatus.map((service, index) => (
                                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-darkBorder rounded-lg">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
                                                <FontAwesomeIcon icon={faServer} className="text-blue-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-800 dark:text-darkText">
                                                    {service.service}
                                                </h4>
                                                <p className="text-sm text-gray-600 dark:text-darkTextSecondary">
                                                    {language ? 'Response Time' : 'وقت الاستجابة'}: {service.responseTime}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(service.status)}`}>
                                                <FontAwesomeIcon icon={getStatusIcon(service.status)} className="mr-1" />
                                                {language ? 'Operational' : 'تعمل'}
                                            </span>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {service.uptime}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Help Tab */}
                        {activeTab === 'help' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {helpResources.map((resource, index) => (
                                    <div key={index} className="p-6 bg-gray-50 dark:bg-darkBorder rounded-lg hover:bg-gray-100 dark:hover:bg-darkBorder/80 transition-colors cursor-pointer">
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 bg-watomsBlue rounded-xl flex items-center justify-center text-white">
                                                <FontAwesomeIcon icon={resource.icon} />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-bold text-gray-800 dark:text-darkText mb-2">
                                                    {resource.title}
                                                </h4>
                                                <p className="text-sm text-gray-600 dark:text-darkTextSecondary mb-3">
                                                    {resource.description}
                                                </p>
                                                <button className="text-watomsBlue hover:text-watomsLightBlue text-sm font-medium flex items-center gap-1">
                                                    {language ? 'Access' : 'الوصول'}
                                                    <FontAwesomeIcon icon={faExternalLinkAlt} className="text-xs" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WisdomSystemInfo;