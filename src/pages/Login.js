import "../styles/login.css";
import { useNavigate, useLocation } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../services/auth";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dms";
  console.log(from);
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
      toast.error("Code or Password is invalid Please Try Again!");
      setStatus(false);
      return;
    }

    try {
      const userCredentials = {
        code: loginData.code,
        password: loginData.password,
      }
      const response = await loginUser(userCredentials)
      const data = await response;
      setUserInfo(data);
      setUserCode(response.code);
      setStatus(true);
      localStorage.setItem("token", response.token);
      toast.success("Login successful!");
      setUserInfo(data);
      navigate(from, { replace: true });
    } catch (err) {
      console.error("Error submitting data:", err);
      toast.error("Code or Password is invalid Please Try Again!");
      setStatus(false);
    }
  };

  return (
    <div className="loginPage">
      <Toaster />
      <div className="loginContainer">
        <form className="login" onSubmit={submitLogin}>
          <img
            className="loginImg"
            src="http://pms.wabyse.com/wp-content/uploads/2024/10/cropped-cropped-WABYS-NEW-LOGO1.png"
            alt="Wabys Logo"
          />
          <label className="loginLabel" HtmlFor="code">
            Code
          </label>
          <input
            className={status ? "loginInput" : "failedLogin"}
            type="text"
            id="code"
            name="code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <label className="loginLabel" HtmlFor="password">
            Password
          </label>
          <input
            className={status ? "loginInput" : "failedLogin"}
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="loginSubmit" type="submit">
            Login
          </button>
        </form>
        {/* <div className="signup-link">
          <Link to="/signup">Don't have an account? Sign up as a guest.</Link>
        </div> */}
      </div>
    </div>
  );
};

export default Login;