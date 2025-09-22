import { useCallback, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faHouse, faSearch, faSun, faMoon, faExpand, faCompress, faShareNodes, faChartSimple, faPhone, faBell } from "@fortawesome/free-solid-svg-icons";
import { useLanguage } from "../context/LanguageContext";
import { useNavigate } from "react-router-dom";
import useFullScreen from "../hooks/useFullScreen";
import { userFullName } from "../utils/userFullName";
import fullScreen from "../utils/fullScreen";
import wabysLogo from '../assets/wabys.png';
import ebdaeduLogo from '../assets/ebad-edu.png';
import molLogo from "../assets/Gov.png";
import { useSearchFilter } from "../hooks/useSearchFilter";
import { getWatomsSystems } from "../constants/constants";
import report2Icon from "../assets/report2Icon.png";

const NewNavbar = ({ searchStatus = true, darkmodeStatus = true, shareStatus = true, homeStatus = true, dashboardStatus = false, callStatus = false, followUpStatus = false, ministerStatus = false, fullScreenStatus = true, dashboardPage = false, selectedProject, setSelectedProject, projects }) => {
    const navigate = useNavigate();
    const { logout, userInfo } = useAuth();
    const { language } = useLanguage();
    const isFullScreen = useFullScreen();
    const [darkMode, setDarkMode] = useState(false);
    const systems = useMemo(
        () => getWatomsSystems(language, userInfo?.organization_id),
        [language, userInfo?.organization_id]
    );
    const getTitle = useCallback(system => system.title, []);
    const { search, setSearch, filteredItems: filteredSystems } = useSearchFilter(systems, getTitle);
    return (
        <div className="relative z-10 bg-white">
            <div className="relative flex flex-col md:flex-row items-center justify-between w-full px-6 h-[12vh] gap-8">
                {/* Logos */}
                <div className="flex items-center gap-6 my-2">
                    <img className="w-[100px] md:w-[120px] lg:w-[140px] cursor-pointer rounded-xl" src={wabysLogo} alt="Wabys Logo" onClick={() => { userInfo?.code !== 1475 && navigate('/wabys') }} />
                    <div className='border-l-2 border-black p-1 h-6' />
                    <img className="w-[70px] md:w-[70px] lg:w-[70px]" src={ebdaeduLogo} alt="ebda edu Logo" />
                    <div className='border-l-2 border-black p-1 h-6' />
                    <img className="w-[60px] md:w-[60px] lg:w-[60px]" src={molLogo} alt="mol Logo" />
                </div>
                <div className="flex-1 flex justify-center">
                    {/* Search */}
                    {searchStatus && <div className="relative w-full max-w-md">
                        <FontAwesomeIcon icon={faSearch} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                        <input
                            type="text"
                            className="w-full pl-12 pr-4 py-1 rounded-full border border-gray-200 shadow focus:ring-2 focus:ring-watomsBlue bg-white/90 text-lg font-medium placeholder-gray-400 transition-all focus:border-watomsBlue focus:shadow-lg outline-none"
                            placeholder={language ? "Search..." : "ابحث..."}
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            style={{ fontFamily: 'inherit' }}
                        />
                    </div>}
                </div>
                {ministerStatus && (
                    <h1 className="absolute left-1/2 -translate-x-1/2 font-bold w-72 text-center text-lg text-black">
                        His Excellency
                        Egyptian Minister Of Labor
                    </h1>
                )}
                <div className="flex items-center gap-4 relative flex-wrap justify-evenly">
                    {/* dark mode / light mode */}
                    {darkmodeStatus && <button onClick={() => setDarkMode(!darkMode)} className="rounded-full w-10 h-10 flex justify-center items-center bg-white/80 hover:bg-gray-200 shadow transition-all">
                        <FontAwesomeIcon icon={darkMode ? faSun : faMoon} className="text-xl text-watomsBlue" />
                    </button>}
                    {/* Full Screen Toggle Button */}
                    {fullScreenStatus && <button
                        onClick={fullScreen}
                        className="rounded-full w-10 h-10 flex justify-center items-center bg-white/80 hover:bg-gray-200 shadow transition-all"
                        title={language ? (isFullScreen ? 'Exit Full Screen' : 'Enter Full Screen') : (isFullScreen ? 'خروج من الشاشة الكاملة' : 'دخول الشاشة الكاملة')}
                    >
                        <FontAwesomeIcon
                            icon={isFullScreen ? faCompress : faExpand}
                            className="text-xl text-watomsBlue"
                        />
                    </button>}
                    {/* User Info */}
                    <span className="flex items-center gap-2 font-bold text-lg md:min-w-[120px] min-w-[300px] justify-center text-watomsBlue">
                        <FontAwesomeIcon icon={faUser} className="text-watomsBlue" />
                        {userFullName(userInfo, language)}
                    </span>
                    {/* Share Button */}
                    {shareStatus && <button
                        className="rounded-full w-10 h-10 flex justify-center items-center bg-white/80 hover:bg-gray-200 shadow transition-all"
                    >
                        <FontAwesomeIcon icon={faShareNodes} className="text-xl text-gray-500" />
                    </button>}
                    {/* follow up Button */}
                    {followUpStatus &&
                        <button
                            className="rounded-full w-10 h-10 flex justify-center items-center bg-white/80 hover:bg-gray-200 shadow transition-all"
                            onClick={() => navigate('/watoms/follow-up')}
                        >
                            <img className="w-7 h-7" src={report2Icon} alt="" />
                        </button>}
                    {/* dashboard Button */}
                    {dashboardStatus && <button
                        onClick={() => navigate('/watoms/dashboard')}
                        className="rounded-full w-10 h-10 flex justify-center items-center bg-white/80 hover:bg-gray-200 shadow transition-all"
                    >
                        <FontAwesomeIcon icon={faChartSimple} className="text-xl text-gray-500" />
                    </button>}
                    {/* call Button */}
                    {callStatus && <button
                        className="rounded-full w-10 h-10 flex justify-center items-center bg-white/80 hover:bg-gray-200 shadow transition-all"
                    >
                        <FontAwesomeIcon icon={faPhone} className="text-xl text-gray-500" />
                    </button>}
                    {/* Filter bar */}
                    {(userInfo?.code !== 1452 || userInfo?.code !== 1475) && dashboardPage && <div className="flex justify-center items-center bg-[#bdbdbd] px-2 rounded-full w-52">
                        <select
                            value={selectedProject}
                            onChange={(e) => setSelectedProject(e.target.value)}
                            className="text-black bg-[#bdbdbd] max-h-8 h-8 text-xs flex justify-center w-full items-center py-1"
                            dir="rtl"
                        >
                            <option value="" disabled>الرجاء اختيار مشروع</option>
                            {projects.map((project, i) => (
                                <option key={`${project}-${i}`} value={project}>
                                    {project}
                                </option>
                            ))}
                        </select>
                    </div>}
                    {/* Bell icon */}
                    {(userInfo?.code !== 1452 || userInfo?.code !== 1475) && dashboardPage && <button
                        className="rounded-full w-10 h-10 flex justify-center items-center bg-white/80 hover:bg-gray-200 shadow transition-all"
                        title="notification"
                    >
                        <FontAwesomeIcon
                            icon={faBell}
                            className="text-xl text-watomsBlue"
                        />
                    </button>}
                    {/* --- نهاية الأيقونات --- */}
                    {homeStatus && <button
                        className="rounded-full w-10 h-10 flex justify-center items-center bg-white/80 hover:bg-gray-200 shadow transition-all"
                        onClick={() => { userInfo?.code === 1475 ? logout() : navigate('/watoms') }}
                    >
                        <FontAwesomeIcon icon={faHouse} className="text-xl text-green-700" />
                    </button>}
                </div>
            </div>
        </div>
    )
}

export default NewNavbar;