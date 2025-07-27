import { useNavigate, useLocation } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../services/auth";
import wabysLogo from "../assets/wabys.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEyeSlash, faEye } from "@fortawesome/free-solid-svg-icons";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/watoms";
  const [revealPassword, setRevealPassword] = useState(false);
  const { setUserCode } = useAuth();
  const { setUserInfo } = useAuth();
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState(true);

  const submitLogin = async (e) => {
    e.preventDefault();

    const loginData = {
      code,
      password,
    };

    if (!loginData.code || !loginData.password) {
      toast.error("اسم المستخدم أو كلمة المرور غير صحيحة، يرجى المحاولة مرة أخرى!");
      setStatus(false);
      return;
    }

    try {
      const userCredentials = {
        code: loginData.code,
        password: loginData.password,
      };
      const response = await loginUser(userCredentials);
      const data = await response;
      setUserInfo(data);
      setUserCode(response.code);
      setStatus(true);
      localStorage.setItem("token", response.token);
      toast.success("تم تسجيل الدخول بنجاح!");
      setUserInfo(data);
      navigate(from, { replace: true });
    } catch (err) {
      console.error("Error submitting data:", err);
      toast.error("اسم المستخدم أو كلمة المرور غير صحيحة، يرجى المحاولة مرة أخرى!");
      setStatus(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#667eea] to-[#764ba2] overflow-hidden">
      {/* Abstract background shape (optional) */}
      <div className="absolute inset-0 pointer-events-none">
        <svg width="100%" height="100%" viewBox="0 0 600 400" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="bg-grad" cx="50%" cy="50%" r="80%" fx="50%" fy="50%" gradientTransform="rotate(20)">
              <stop offset="0%" stopColor="#fff" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#000" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="600" height="400" fill="url(#bg-grad)" />
        </svg>
      </div>
      <Toaster />
      <div className="relative w-[95%] max-w-3xl mx-auto rounded-3xl bg-white/10 backdrop-blur-md shadow-2xl flex flex-col md:flex-row overflow-hidden border border-white/20">
        {/* Left side: WABYS Logo, Title, Description */}
        <div className="flex-1 flex flex-col justify-between p-8 min-w-[250px] max-w-[350px] text-white">
          <div>
            <img src={wabysLogo} alt="WABYS Logo" className="w-32 h-20 mb-4 rounded-xl shadow-lg bg-white/30 p-2" />
            <div className="font-extrabold text-2xl mb-2 tracking-wide">WABYS</div>
            <div className="font-bold text-lg mb-1">نظام وابيز لإدارة المدارس الذكية</div>
            <p className="text-xs opacity-80 mb-8">
              منصة متكاملة لإدارة جميع عمليات المدرسة بكفاءة وسهولة، تدعم التحول الرقمي وتوفر أدوات متقدمة للمعلمين والإداريين والطلاب.
            </p>
          </div>
          <div className="text-xs opacity-60 mt-8">جميع الحقوق محفوظة &copy; وابيز للتدريب والتعليم 2024</div>
        </div>
        {/* Divider */}
        <div className="w-px bg-white/30 mx-2 my-8 hidden md:block" />
        {/* Right side: Login Form */}
        <form
          className="flex-1 flex flex-col justify-center gap-6 p-8 min-w-[250px] max-w-[350px]"
          onSubmit={submitLogin}
        >
          <div className="font-semibold text-lg text-white mb-2">تسجيل الدخول</div>
          <div className="flex flex-col gap-4">
            <input
              className={`w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-[#667eea] border-none ${status ? "" : "ring-2 ring-red-500"}`}
              type="text"
              id="code"
              name="code"
              placeholder="اسم المستخدم"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              autoComplete="username"
            />
            <div className="relative">
              <input
                className={`w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-[#667eea] border-none pr-10 ${status ? "" : "ring-2 ring-red-500"}`}
                type={revealPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="كلمة المرور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setRevealPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 focus:outline-none"
                tabIndex={-1}
              >
                <FontAwesomeIcon icon={revealPassword ? faEyeSlash : faEye} />
              </button>
            </div>
            <button
              className="w-full py-2 rounded-lg bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white font-semibold shadow-md hover:scale-[1.03] transition-transform border-none"
              type="submit"
            >
              دخول
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;