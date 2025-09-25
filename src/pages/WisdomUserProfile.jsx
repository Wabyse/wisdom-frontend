import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faUser, faEnvelope, faPhone, faBuilding, faIdCard,
    faCalendarAlt, faMapMarkerAlt, faEdit, faSave, faTimes,
    faCamera, faShieldAlt, faKey, faBell, faCog, faSignOutAlt, faHome
} from "@fortawesome/free-solid-svg-icons";
import DenyAccessPage from '../components/DenyAccessPage';

const WisdomUserProfile = () => {
    const navigate = useNavigate();
    const { userCode, logout, userInfo } = useAuth();
    const { language } = useLanguage();
    const getFullName = (info) => {
        if (!info) return null;
        if (typeof info?.name === 'string') {
            return info?.name;
        }
        return null;
    };
    const initialName = getFullName(userInfo) || (typeof userInfo === 'string' ? userInfo : '') || 'مستخدم النظام';
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState({
        name: initialName,
        email: userInfo?.email,
        phone: '+966 50 123 4567',
        department: 'إدارة تقنية المعلومات',
        position: userInfo?.employee_role,
        employeeId: 'EMP-2024-001',
        joinDate: '2024-01-15',
        location: 'الرياض، المملكة العربية السعودية',
        avatar: null
    });

    const handleInputChange = (field, value) => {
        setProfileData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = () => {
        // هنا يمكن إضافة منطق حفظ البيانات
        setIsEditing(false);
    };

    const handleCancel = () => {
        setIsEditing(false);
        // إعادة تعيين البيانات للقيم الأصلية
        setProfileData({
            name: initialName,
            email: userInfo?.email,
            phone: '+966 50 123 4567',
            department: 'إدارة تقنية المعلومات',
            position: userInfo?.employee_role,
            employeeId: 'EMP-2024-001',
            joinDate: '2024-01-15',
            location: 'الرياض، المملكة العربية السعودية',
            avatar: null
        });
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (userInfo?.code === 1452) return <DenyAccessPage homePage='/watoms/dashboard' />;
    if (userInfo?.code === 1475) return <DenyAccessPage homePage='/watoms/news' />;
    if (userInfo?.code === 1310) return <DenyAccessPage homePage='/wisdom/dashboard' />;

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
                                <FontAwesomeIcon icon={faUser} className="text-2xl" />
                            </button>
                            <h1 className="text-2xl font-bold text-watomsBlue dark:text-watomsLightBlue">
                                {language ? 'My Profile' : 'الملف الشخصي'}
                            </h1>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => navigate('/watoms')}
                                className="bg-watomsBlue hover:bg-watomsLightBlue text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                                title="الصفحة الرئيسية"
                            >
                                <FontAwesomeIcon icon={faHome} />
                                {language ? 'Home' : 'الرئيسية'}
                            </button>
                            {/* {!isEditing ? (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="bg-watomsBlue hover:bg-watomsLightBlue text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                                >
                                    <FontAwesomeIcon icon={faEdit} />
                                    {language ? 'Edit' : 'تعديل'}
                                </button>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={handleSave}
                                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                                    >
                                        <FontAwesomeIcon icon={faSave} />
                                        {language ? 'Save' : 'حفظ'}
                                    </button>
                                    <button
                                        onClick={handleCancel}
                                        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                                    >
                                        <FontAwesomeIcon icon={faTimes} />
                                        {language ? 'Cancel' : 'إلغاء'}
                                    </button>
                                </div>
                            )} */}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Profile Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-darkCard rounded-2xl shadow-xl p-6">
                            <div className="text-center">
                                <div className="relative inline-block">
                                    <div className="w-32 h-32 bg-gradient-to-br from-watomsBlue to-wisdomOrange rounded-full flex items-center justify-center text-white text-4xl font-bold mb-4">
                                        {typeof profileData.name === 'string' && profileData.name.length > 0 ? profileData.name.charAt(0).toUpperCase() : '?'}
                                    </div>
                                    {isEditing && (
                                        <button className="absolute bottom-2 right-2 bg-white dark:bg-darkCard rounded-full p-2 shadow-lg">
                                            <FontAwesomeIcon icon={faCamera} className="text-watomsBlue" />
                                        </button>
                                    )}
                                </div>
                                <h2 className="text-xl font-bold text-gray-800 dark:text-darkText mb-2">
                                    {profileData.name}
                                </h2>
                                <p className="text-gray-600 dark:text-darkTextSecondary mb-4">
                                    {profileData.position}
                                </p>
                                <div className="flex justify-center gap-2">
                                    <span className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 px-3 py-1 rounded-full text-sm font-medium">
                                        {language ? 'Active' : 'نشط'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Profile Details */}
                    <div className="lg:col-span-2">
                        <div className="bg-white dark:bg-darkCard rounded-2xl shadow-xl p-6">
                            <h3 className="text-xl font-bold text-gray-800 dark:text-darkText mb-6">
                                {language ? 'Personal Information' : 'المعلومات الشخصية'}
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-darkTextSecondary mb-2">
                                        {language ? 'Full Name' : 'الاسم الكامل'}
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={profileData.name}
                                            onChange={(e) => handleInputChange('name', e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-darkBorder rounded-lg focus:ring-2 focus:ring-watomsBlue focus:border-transparent dark:bg-darkCard dark:text-darkText"
                                        />
                                    ) : (
                                        <p className="text-gray-800 dark:text-darkText">{profileData.name}</p>
                                    )}
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-darkTextSecondary mb-2">
                                        {language ? 'Email' : 'البريد الإلكتروني'}
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="email"
                                            value={profileData.email}
                                            onChange={(e) => handleInputChange('email', e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-darkBorder rounded-lg focus:ring-2 focus:ring-watomsBlue focus:border-transparent dark:bg-darkCard dark:text-darkText"
                                        />
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <FontAwesomeIcon icon={faEnvelope} className="text-gray-400" />
                                            <p className="text-gray-800 dark:text-darkText">{profileData.email}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Phone */}
                                {/* <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-darkTextSecondary mb-2">
                                        {language ? 'Phone' : 'رقم الهاتف'}
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="tel"
                                            value={profileData.phone}
                                            onChange={(e) => handleInputChange('phone', e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-darkBorder rounded-lg focus:ring-2 focus:ring-watomsBlue focus:border-transparent dark:bg-darkCard dark:text-darkText"
                                        />
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <FontAwesomeIcon icon={faPhone} className="text-gray-400" />
                                            <p className="text-gray-800 dark:text-darkText">{profileData.phone}</p>
                                        </div>
                                    )}
                                </div> */}

                                {/* Department */}
                                {/* <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-darkTextSecondary mb-2">
                                        {language ? 'Department' : 'القسم'}
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={profileData.department}
                                            onChange={(e) => handleInputChange('department', e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-darkBorder rounded-lg focus:ring-2 focus:ring-watomsBlue focus:border-transparent dark:bg-darkCard dark:text-darkText"
                                        />
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <FontAwesomeIcon icon={faBuilding} className="text-gray-400" />
                                            <p className="text-gray-800 dark:text-darkText">{profileData.department}</p>
                                        </div>
                                    )}
                                </div> */}

                                {/* Position */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-darkTextSecondary mb-2">
                                        {language ? 'Position' : 'المنصب'}
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={profileData.position}
                                            onChange={(e) => handleInputChange('position', e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-darkBorder rounded-lg focus:ring-2 focus:ring-watomsBlue focus:border-transparent dark:bg-darkCard dark:text-darkText"
                                        />
                                    ) : (
                                        <p className="text-gray-800 dark:text-darkText">{profileData.position}</p>
                                    )}
                                </div>

                                {/* Employee ID */}
                                {/* <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-darkTextSecondary mb-2">
                                        {language ? 'Employee ID' : 'رقم الموظف'}
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <FontAwesomeIcon icon={faIdCard} className="text-gray-400" />
                                        <p className="text-gray-800 dark:text-darkText">{profileData.employeeId}</p>
                                    </div>
                                </div> */}

                                {/* Join Date */}
                                {/* <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-darkTextSecondary mb-2">
                                        {language ? 'Join Date' : 'تاريخ الانضمام'}
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-400" />
                                        <p className="text-gray-800 dark:text-darkText">{profileData.joinDate}</p>
                                    </div>
                                </div> */}

                                {/* Location */}
                                {/* <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-darkTextSecondary mb-2">
                                        {language ? 'Location' : 'الموقع'}
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={profileData.location}
                                            onChange={(e) => handleInputChange('location', e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-darkBorder rounded-lg focus:ring-2 focus:ring-watomsBlue focus:border-transparent dark:bg-darkCard dark:text-darkText"
                                        />
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-400" />
                                            <p className="text-gray-800 dark:text-darkText">{profileData.location}</p>
                                        </div>
                                    )}
                                </div> */}
                            </div>
                        </div>

                        {/* Security & Settings */}
                        <div className="mt-6 bg-white dark:bg-darkCard rounded-2xl shadow-xl p-6">
                            <h3 className="text-xl font-bold text-gray-800 dark:text-darkText mb-6">
                                {language ? 'Security & Settings' : 'الأمان والإعدادات'}
                            </h3>

                            <div className="space-y-4">
                                {/* <button className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-darkBorder rounded-lg hover:bg-gray-100 dark:hover:bg-darkBorder/80 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <FontAwesomeIcon icon={faKey} className="text-watomsBlue" />
                                        <span className="text-gray-800 dark:text-darkText">
                                            {language ? 'Change Password' : 'تغيير كلمة المرور'}
                                        </span>
                                    </div>
                                    <FontAwesomeIcon icon={faEdit} className="text-gray-400" />
                                </button>

                                <button className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-darkBorder rounded-lg hover:bg-gray-100 dark:hover:bg-darkBorder/80 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <FontAwesomeIcon icon={faBell} className="text-watomsBlue" />
                                        <span className="text-gray-800 dark:text-darkText">
                                            {language ? 'Notification Settings' : 'إعدادات الإشعارات'}
                                        </span>
                                    </div>
                                    <FontAwesomeIcon icon={faCog} className="text-gray-400" />
                                </button>

                                <button className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-darkBorder rounded-lg hover:bg-gray-100 dark:hover:bg-darkBorder/80 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <FontAwesomeIcon icon={faShieldAlt} className="text-watomsBlue" />
                                        <span className="text-gray-800 dark:text-darkText">
                                            {language ? 'Privacy Settings' : 'إعدادات الخصوصية'}
                                        </span>
                                    </div>
                                    <FontAwesomeIcon icon={faCog} className="text-gray-400" />
                                </button> */}

                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <FontAwesomeIcon icon={faSignOutAlt} className="text-red-600" />
                                        <span className="text-red-600 font-medium">
                                            {language ? 'Sign Out' : 'تسجيل الخروج'}
                                        </span>
                                    </div>
                                    <FontAwesomeIcon icon={faSignOutAlt} className="text-red-400" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WisdomUserProfile;