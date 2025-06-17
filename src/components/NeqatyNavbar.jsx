import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";
import { useState } from "react";
import wisdom from "../assets/wisdom.png";

const NeqatyNavbar = () => {
    const { setAdminToken, setAdminInfo, adminInfo } = useAdminAuth();
    const [mobile, setMobile] = useState(false);
    const navigate = useNavigate();
    const loggingOut = () => {
        setAdminToken(null);
        setAdminInfo(null);
        setTimeout(() => {
            navigate("/neqaty/login");
        }, 0);
    };

    return (
        <div
            className="w-full flex flex-col md:h-[75px] h-[45px] bg-wisdomDarkOrange"
        >
            <div className="w-full flex justify-between items-center px-4 py-2">
                <div className="flex items-center gap-2">
                    <img className="w-[15%]" src={wisdom} alt="Wabys Logo" />
                </div>

                <div
                    className={`hidden md:flex items-center gap-4 bg-white py-2 px-2 rounded-full shadow-lg shadow-black/30 min-w-fit`}
                >
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/neqaty/school-permissions')}
                            className={`min-w-fit relative inline-block px-4 py-2 font-bold text-white rounded-full overflow-hidden bg-watomsBlue hover:bg-wisdomOrange`}
                        >
                            <span className="relative z-10 transition-colors duration-400">
                                Permissions
                            </span>
                        </button>
                        {/* <button
                            onClick={() => navigate('/neqaty/vtc-permissions')}
                            className={`min-w-fit relative inline-block px-4 py-2 font-bold text-white rounded-full overflow-hidden bg-watomsBlue hover:bg-wisdomOrange`}
                        >
                            <span className="relative z-10 transition-colors duration-400">
                                VTC Permissions
                            </span>
                        </button> */}
                        <div className="bg-white text-center p-2 rounded-full font-bold min-w-fit h-10 border-2 border-gray-300 flex items-center justify-center">
                            {adminInfo?.username}
                        </div>
                        <button
                            onClick={loggingOut}
                            className={`min-w-fit relative inline-block px-4 py-2 font-bold text-white rounded-full overflow-hidden bg-watomsBlue hover:bg-wisdomOrange`}
                        >
                            <span className="relative z-10 transition-colors duration-400">
                                Logout
                            </span>
                        </button>
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
                <div className="md:hidden w-screen flex flex-col gap-2 bg-white px-4 py-4 shadow-md z-[1000]">
                    <div className="bg-white flex justify-center items-center text-center p-2 min-w-fit h-[50px] rounded-full font-bold border-2 border-gray-300 mx-auto">
                        {adminInfo?.username}
                    </div>
                    <button
                        onClick={loggingOut}
                        className="bg-gray-300 hover:bg-gray-400 py-2 px-4 rounded mx-auto"
                    >
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
}

export default NeqatyNavbar;