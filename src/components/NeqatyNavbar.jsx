import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faUser, faSearch, faSun, faMoon, faExpand, faCompress, faHouse, faShareNodes,
    faSignOutAlt
} from "@fortawesome/free-solid-svg-icons";
import { useLanguage } from "../context/LanguageContext";
import wabysLogo from '../assets/wabys.png';
import watomsLogo from '../assets/watoms3.png';
import fullScreen from '../utils/fullScreen';
import useFullScreen from "../hooks/useFullScreen";

const NeqatyNavbar = ({ homePage = false }) => {
    const { setAdminToken, setAdminInfo, adminInfo } = useAdminAuth();
    const navigate = useNavigate();
    const { language, setLanguage } = useLanguage();
    const [darkMode, setDarkMode] = useState(false);
    const isFullScreen = useFullScreen();

    const loggingOut = () => {
        setAdminToken(null);
        setAdminInfo(null);
        setTimeout(() => {
            navigate("/neqaty/login");
        }, 0);
    };

    return (
        <div className="relative z-10">
            {/* Logo and Search */}
            <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-7xl mx-auto px-6 py-5 gap-8">
                <div className="flex items-center gap-6">
                    <img className="w-[100px] md:w-[120px] lg:w-[140px] cursor-pointer" src={wabysLogo} alt="Wabys Logo" onClick={() => navigate('/wabys')} />
                    <div className='border-l-2 border-gray-500 p-1 h-8' />
                    <img className="w-[100px] md:w-[120px] lg:w-[140px] cursor-pointer" src={watomsLogo} alt="Wabys Logo" onClick={() => navigate('/watoms')} />
                </div>
                <div className="flex-1 flex justify-center">
                    <div className="relative w-full max-w-md">
                        <FontAwesomeIcon icon={faSearch} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                        <input
                            type="text"
                            className="w-full pl-12 pr-4 py-1 rounded-full border border-gray-200 shadow focus:ring-2 focus:ring-watomsBlue bg-white/90 text-lg font-medium placeholder-gray-400 transition-all focus:border-watomsBlue focus:shadow-lg outline-none"
                            placeholder={language ? "Search..." : "ابحث..."}
                            // value={search}
                            // onChange={e => setSearch(e.target.value)}
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
                        {adminInfo?.username}
                    </span>
                    {/* Share Button */}
                    <button
                        className="rounded-full w-10 h-10 flex justify-center items-center bg-white/80 hover:bg-gray-200 shadow transition-all"
                    >
                        <FontAwesomeIcon icon={faShareNodes} className="text-xl text-gray-500" />
                    </button>
                    {/* Logout / Home Button */}
                    {homePage ? <button
                        className="rounded-full w-10 h-10 flex justify-center items-center bg-white/80 hover:bg-gray-200 shadow transition-all"
                        onClick={loggingOut}
                    >
                        <FontAwesomeIcon icon={faSignOutAlt} className="text-xl text-wisdomOrange" />
                    </button> : <button
                        className="rounded-full w-10 h-10 flex justify-center items-center bg-white/80 hover:bg-gray-200 shadow transition-all"
                        onClick={() => navigate('/neqaty')}
                    >
                        <FontAwesomeIcon icon={faHouse} className="text-xl text-green-700" />
                    </button>}
                </div>
            </div>
        </div>
    );
}

export default NeqatyNavbar;