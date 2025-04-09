import style from "../styles/Navbar.module.css";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import GovLogo from "../assets/NewLogoGovEbda.png";
import watoms2 from "../assets/watoms2.jpg";
import wisdom from "../assets/wisdom.png";
import { useEffect, useState } from "react";
import ChangeLanguage from "./ChangeLanguage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const Navbar2 = ({ children, showNavigate = true, img, length = "w-[300px]", Page }) => {
    const { setUserCode } = useAuth();
    const [sideBar, setSideBar] = useState(true);
    const [profile, setProfile] = useState("hidden");
    const [profileHover, setProfileHover] = useState(false);
    const { userCode } = useAuth();
    const [current, setCurrent] = useState(0);
    const [mobile, setMobile] = useState(false);
    const [typedTitle, setTypedTitle] = useState("");
    const [typedSubtitle, setTypedSubtitle] = useState("");
    const navigate = useNavigate();
    const loggingOut = async () => {
        localStorage.removeItem("token");
        setUserCode(null);
        window.location.href = "/login";
    };

    const viewProfile = () => {
        setProfileHover(true);
        setProfile("");
    }

    const hideProfile = () => {
        setProfileHover(false);
        setProfile("hidden");
    }

    const navItem = (label, path) => (
        <button
            onClick={() => {
                navigate(path);
                setMobile(false);
            }}
            className={`relative bg-transparent text-black rounded-none shadow-none border-none px-2 py-1 group  ${mobile ? "" : profile}`}
        >
            <span
                className="font-bold relative z-10
                after:content-['']
                after:absolute
                after:left-0
                after:-bottom-[3px]
                after:h-[3px]
                after:rounded
                after:w-full
                after:bg-watomsBlue
                after:transform
                after:scale-x-0
                after:origin-left
                after:transition-transform
                after:duration-300
                group-hover:after:scale-x-100"
            >
                {label}
            </span>
        </button>
    );

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % img.length);
        }, 5000);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const { title, description } = img[current];
        let titleIndex = 0;
        let subtitleIndex = 0;

        setTypedTitle("");
        setTypedSubtitle("");

        let titleTimer = null;
        let subtitleTimer = null;

        function typeTitle() {
            titleTimer = setInterval(() => {
                setTypedTitle((prev) => {
                    const next = prev + title.charAt(titleIndex);
                    titleIndex++;
                    if (titleIndex >= title.length) {
                        clearInterval(titleTimer);
                    }
                    return next;
                });
            }, 50);
        }

        function typeSubtitle() {
            subtitleTimer = setInterval(() => {
                setTypedSubtitle((prev) => {
                    const next = prev + description.charAt(subtitleIndex);
                    subtitleIndex++;
                    if (subtitleIndex >= description.length) {
                        clearInterval(subtitleTimer);
                    }
                    return next;
                });
            }, 30);
        }

        typeTitle();
        const subtitleDelay = setTimeout(typeSubtitle, 600);

        return () => {
            clearInterval(titleTimer);
            clearInterval(subtitleTimer);
            clearTimeout(subtitleDelay);
        };
    }, [current]);

    return (
        <div
            className="w-full flex flex-col h-[700px] bg-cover bg-center m-0 transition-all duration-1000 ease-in-out"
            style={{
                backgroundImage: `url(${img[current].img})`,
            }}
        >
            <div className="w-full flex justify-between items-center px-4 py-2">
                <div className="flex items-center gap-2">
                    {showNavigate ? <img className="w-[15%]" src={wisdom} alt="Wabys Logo" /> : <img className="w-[8%]" src={watoms2} alt="Wabys Logo" />}
                    {showNavigate ? null : (
                        <img
                            className="w-[12%] border-l-2 border-white pl-2"
                            src={GovLogo}
                            alt="Wabys Logo"
                        />
                    )}
                </div>
                <div className="flex">
                <div className="text-black text-md font-bold bg-blue-300 rounded-full shadow-lg shadow-black/30 mr-6">
                        <span className="inline-block px-1 py-2 rounded-full border-black border-2 m-1">
                            {Page}
                        </span>
                    </div>
                    <div
                        className={`hidden md:flex items-center gap-4 bg-white p-1 rounded-full shadow-lg shadow-black/30 transition-all duration-300 ease-in-out overflow-hidden ${profileHover ? length : "w-[52px]"}`}
                        onMouseEnter={viewProfile}
                        onMouseLeave={hideProfile}
                    >
                        {showNavigate
                            ? navItem("PMS", "/pms")
                            : navItem("PMS", "/watoms/pms")}
                        {showNavigate
                            ? navItem("DMS", "/dms")
                            : navItem("DMS", "/watoms/dms")}
                        {showNavigate
                            ? navItem("TMS", "/tms")
                            : navItem("TMS", "/watoms/tms")}
                        <div className={`${profile}`}>{showNavigate ? <ChangeLanguage /> : null}</div>
                        <div className="flex items-center gap-2">
                            <div className="bg-white text-center p-2 rounded-full font-bold w-11 h-11 border-2 border-gray-300 flex items-center justify-center">
                                {userCode || "Guest"}
                            </div>
                            <button
                                onClick={loggingOut}
                                className={`relative inline-block px-4 py-2 font-bold text-white rounded-full overflow-hidden bg-watomsBlue hover:bg-wisdomOrange ${style["nav-button"]} ${profile}`}
                            >
                                <span className="relative z-10 transition-colors duration-400">
                                    Logout
                                </span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="md:hidden">
                    <button onClick={() => setMobile(!mobile)}>
                        <svg
                            className="w-6 h-6 text-white"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        </svg>
                    </button>
                </div>
            </div>
            {mobile && (
                <div className="md:hidden w-screen flex flex-col gap-2 bg-white px-4 py-4 shadow-md">
                    {showNavigate
                        ? navItem("PMS", "/pms")
                        : navItem("PMS", "/watoms/pms")}
                    {showNavigate
                        ? navItem("DMs", "/dms")
                        : navItem("DMS", "/watoms/dms")}
                    {showNavigate
                        ? navItem("TMS", "/tms")
                        : navItem("TMS", "/watoms/tms")}
                    <div className="bg-white flex justify-center items-center text-center p-2 w-[50px] h-[50px] rounded-full font-bold border-2 border-gray-300 mx-auto">
                        {userCode || "Guest"}
                    </div>
                    <button
                        onClick={loggingOut}
                        className="bg-gray-300 hover:bg-gray-400 py-2 px-4 rounded mx-auto"
                    >
                        Logout
                    </button>
                    {children}
                </div>
            )}
            <div className={`md:flex ${mobile ? "hidden" : ""} justify-between h-[650px]`}>
                <div className="flex h-full flex-col justify-center p-5">
                    <div className="text-black text-5xl">
                        <span className="inline-block bg-white shadow-lg shadow-black/30 px-2 py-3 rounded">
                            {typedTitle}
                        </span>
                    </div>
                    <div className="text-black text-2xl mt-4">
                        <span className="inline-block bg-white shadow-lg shadow-black/30 px-2 rounded">
                            {typedSubtitle}
                        </span>
                    </div>
                </div>
                <div
                    className={`relative bg-white opacity-75 my-2 mx-2 shadow-lg shadow-black/30 rounded hidden md:flex flex-col items-end transition-all duration-1000 ease-in-out ${sideBar ? "max-w-[100px] max-h-[40px] rounded-l-full" : "max-w-[500px] max-h-[600px]"
                        }`}
                    onMouseEnter={() => setSideBar(false)}
                    onMouseLeave={() => setSideBar(true)}
                >
                    <div className={`w-full h-full p-2 transition-all duration-1000 ease-in-out ${sideBar ? "overflow-hidden" : "overflow-visible"}`}>
                        {sideBar ? <FontAwesomeIcon icon={faArrowLeft} /> : children}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Navbar2;