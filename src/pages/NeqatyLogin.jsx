import { useNavigate, useLocation } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useState } from "react";
import { useAdminAuth } from "../context/AdminAuthContext";
import { loginAdmin } from "../services/auth";
import wabys from "../assets/wabys.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEyeSlash, faEye } from "@fortawesome/free-solid-svg-icons";

const NeqatyLogin = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/neqaty";
    const [revealPassword, setRevealPassword] = useState(false);
    const { setAdminToken, setAdminInfo } = useAdminAuth();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [status, setStatus] = useState(true);

    const submitLogin = async (e) => {
        e.preventDefault();

        const loginData = {
            username,
            password,
        };

        if (!loginData.username || !loginData.password) {
            toast.error("Username or Password is invalid Please Try Again!");
            setStatus(false);
            return;
        }

        try {
            const userCredentials = {
                username: loginData.username,
                password: loginData.password,
            };
            const response = await loginAdmin(userCredentials);
            const data = await response;
            setAdminInfo(data);
            setAdminToken(data.token);
            setStatus(true);
            toast.success("Login successful!");
            navigate(from, { replace: true });
        } catch (err) {
            console.error("Error submitting data:", err);
            toast.error("Code or Password is invalid Please Try Again!");
            setStatus(false);
        }
    };

    return (
        <div className="bg-formColor flex justify-center items-center h-screen">
            <Toaster />
            <form
                className="w-[90%] md:w-1/3 bg-zinc-500 h-[400px] rounded-xl flex justify-center items-center gap-2 shadow-[10px_10px_20px_gray]"
                onSubmit={submitLogin}
            >
                {/* <img className="w-2/6 md:w-1/5" src={GovLogo} alt="Wabys Logo" /> */}
                <div className="w-[33%] bg-white h-full  rounded-l-xl flex justify-center items-end">
                    <img className="w-[70%] h-fit max-h-[55px] rounded-l-xl" src={wabys} alt="" />
                </div>
                <div className="w-[67%] flex h-full flex-col justify-center  gap-6 p-5">
                    <div className="flex flex-col gap-2">
                        <label className="text-white" htmlFor="code">
                            Username
                        </label>
                        <input
                            className={`w-4/5 md:w-4/5 p-[2px] rounded mb-[5%] ${status ? "border-none" : "border-2 border-red-500"
                                }`}
                            type="text"
                            id="code"
                            name="code"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-white" htmlFor="password">
                            Password
                        </label>
                        <div className="relative w-4/5 md:w-4/5">
                            <input
                                className={`w-full p-[2px] rounded mb-[5%] pr-10 ${status ? "border-none" : "border-2 border-red-500"}`}
                                type={revealPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => setRevealPassword(prev => !prev)}
                                className="absolute right-2 top-[15px] transform -translate-y-1/2 text-black focus:outline-none"
                            >
                                <FontAwesomeIcon icon={revealPassword ? faEyeSlash : faEye} />
                            </button>
                        </div>
                    </div>
                    <button
                        className="bg-wisdomOrange text-white hover:bg-wisdomDarkOrange w-1/5 min-w-[100px] p-2 border-none rounded cursor-pointer"
                        type="submit"
                    >
                        Login
                    </button>
                    <p className="text-white text-[8px] text-center flex ">
                        All rights are reserved &copy; WABYS FOR TRAINING AND EDUCATION
                    </p>
                </div>
            </form>
        </div>
    );
};

export default NeqatyLogin;