import { useNavigate, useLocation } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useRef, useState } from "react";
import { useEbdaEduAuth } from "../context/EbdaEduAuthContext";
import { loginEbdaEdu, loginUser } from "../services/auth";
import ebdaEduLogo from "../assets/ebad-edu.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEyeSlash, faEye } from "@fortawesome/free-solid-svg-icons";

const EbdaEduLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/IEES";

  const [revealPassword, setRevealPassword] = useState(false);
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState(true);
  const [language, setLanguage] = useState(false);
  const buttonRef = useRef(null);

  // ✅ Use the new EbdaEduAuthContext
  const { setEbdaToken, setEbdaUserInfo } = useEbdaEduAuth();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        buttonRef.current?.click();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const submitLogin = async (e) => {
    e.preventDefault();

    if (!code || !password) {
        language
        ? toast.error("Username or password are incorrect, please try again!")
        : toast.error("اسم المستخدم أو كلمة المرور غير صحيحة، يرجى المحاولة مرة أخرى!");
        setStatus(false);
        return;
    }
    
    try {
      const userCredentials = { code, password };
      const response = await loginEbdaEdu(userCredentials);

      // ✅ Example backend response structure (adjust if needed)
      // response = { token: "...", userInfo: {...}, code: "123" }

      // Save token & user info into context
      setEbdaToken(response.token);
      setEbdaUserInfo(response.userInfo || response);

      setStatus(true);
      language
        ? toast.success("Login Successful!")
        : toast.success("تم تسجيل الدخول بنجاح!");

      // Navigate to dashboard
      navigate(from, { replace: true });
    } catch (err) {
      console.error("Login error:", err);
      language
        ? toast.error("Username or password are incorrect, please try again!")
        : toast.error("اسم المستخدم أو كلمة المرور غير صحيحة، يرجى المحاولة مرة أخرى!");
      setStatus(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#667eea] to-[#764ba2] overflow-hidden">
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
        {/* Left Side */}
        <div className={`flex-1 flex flex-col justify-between p-8 min-w-[250px] max-w-[350px] text-white ${language ? "text-start" : "text-end"}`}>
          <div>
            <img src={ebdaEduLogo} alt="Ebda Edu Logo" className="w-24 h-20 mb-4 rounded-xl shadow-lg bg-white/30 p-2" />
            <div className="font-extrabold text-2xl mb-2 tracking-wide">{language ? "EBDA EDU" : "ابدا اديو"}</div>
            <div className="font-bold text-lg mb-1">
              {language
                ? "Ebda Edu System for Smart School Management"
                : "نظام ابدا اديو لإدارة المنشآت التعليمية والتدريبية والفنية"}
            </div>
            <p className="text-xs opacity-80 mb-8">
              {language
                ? "An integrated platform for efficiently and easily managing all school operations, supporting digital transformation and providing advanced tools for teachers, administrators, and students."
                : "منصة متكاملة لإدارة جميع عمليات المنشآة التعليمية بكفاءة وسهولة، تدعم التحول الرقمي وتوفر أدوات متقدمة لجميع المستويات الإدارية والتعليمية والفنية"}
            </p>
          </div>
          <div className={`text-xs opacity-60 ${language ? "" : "mt-8"}`}>
            {language
              ? "All rights reserved © Ebda Edu for Training and Education 2024"
              : "جميع الحقوق محفوظة © ابدا اديو للتدريب والتعليم 2024"}
          </div>
        </div>

        {/* Divider */}
        <div className="w-px bg-white/30 mx-2 my-8 hidden md:block" />

        {/* Right Side - Login Form */}
        <form
          className={`flex-1 flex flex-col justify-center gap-6 p-8 min-w-[250px] max-w-[350px] ${language ? "text-start" : "text-end"}`}
          onSubmit={submitLogin}
        >
          <div className="mb-2 flex justify-between">
            {!language && (
              <button
                type="button"
                className="px-4 py-1 rounded-lg bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white font-semibold shadow-md hover:scale-[1.03] transition-transform border-none"
                onClick={() => setLanguage(!language)}
              >
                EN
              </button>
            )}
            <div className="font-semibold text-lg text-white">{language ? "Login" : "تسجيل الدخول"}</div>
            {language && (
              <button
                type="button"
                className="px-4 py-1 rounded-lg bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white font-semibold shadow-md hover:scale-[1.03] transition-transform border-none"
                onClick={() => setLanguage(!language)}
              >
                AR
              </button>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <input
              className={`w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-[#667eea] border-none ${status ? "" : "ring-2 ring-red-500"} ${language ? "text-start" : "text-end"}`}
              type="text"
              placeholder={language ? "Username" : "اسم المستخدم"}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              autoComplete="username"
            />

            <div className="relative">
              {!language && (
                <button
                  type="button"
                  onClick={() => setRevealPassword((prev) => !prev)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 focus:outline-none"
                  tabIndex={-1}
                >
                  <FontAwesomeIcon icon={revealPassword ? faEyeSlash : faEye} />
                </button>
              )}
              <input
                className={`w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-[#667eea] border-none ${status ? "" : "ring-2 ring-red-500"} ${language ? "text-start pr-10" : "text-end"}`}
                type={revealPassword ? "text" : "password"}
                placeholder={language ? "Password" : "كلمة المرور"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              {language && (
                <button
                  type="button"
                  onClick={() => setRevealPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 focus:outline-none"
                  tabIndex={-1}
                >
                  <FontAwesomeIcon icon={revealPassword ? faEyeSlash : faEye} />
                </button>
              )}
            </div>

            <button
              className="w-full py-2 rounded-lg bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white font-semibold shadow-md hover:scale-[1.03] transition-transform border-none"
              type="submit"
              ref={buttonRef}
            >
              {language ? "Login" : "دخول"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EbdaEduLogin;