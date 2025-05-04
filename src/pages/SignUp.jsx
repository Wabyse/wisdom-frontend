import "../styles/SignUp.css";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useState } from "react";
import { signUpUser } from "../services/auth";

const SignUp = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState(true);

  const submitLogin = async (e) => {
    e.preventDefault();

    const loginData = {
      firstName,
      middleName,
      lastName,
      password,
      confirmPassword,
    };

    if (
      !loginData.firstName ||
      !loginData.middleName ||
      !loginData.lastName ||
      !loginData.password ||
      !loginData.confirmPassword
    ) {
      toast.error("Please insert all required data!");
      setStatus(false);
      return;
    } else if (loginData.password !== loginData.confirmPassword) {
      toast.error("Password and Confirm Password doesn't match!");
      setStatus(false);
      return;
    } else if (loginData.password.length < 4) {
      toast.error("Password must be 4 characters or more");
      setStatus(false);
      return;
    } else {
      setStatus(true);
    }

    try {
      const signUpCredendials = {
        first_name: loginData.firstName,
        middle_name: loginData.middleName,
        last_name: loginData.lastName,
        password: loginData.password,
      };
      const response = await signUpUser(signUpCredendials)
      setStatus(true);
      localStorage.setItem("token", response.token);
      toast.success("Login successful!");
      navigate(`/`);
    } catch (err) {
      console.error("Error submitting data:", err);
      toast.error("Please insert all required data!");
      setStatus(false);
    }
  };

  return (
    <div className="signUpPage">
      <Toaster />
      <form className="signup form2" onSubmit={submitLogin}>
        <img
          className="w-[30%]"
          src="http://pms.wabyse.com/wp-content/uploads/2024/10/cropped-cropped-WABYS-NEW-LOGO1.png"
          alt="Wabys Logo"
        />
        <label className="text-white" htmlFor="firstName">
          First Name
        </label>
        <input
          className={status || firstName ? "signupInput" : "failedsignup"}
          type="text"
          id="firstName"
          name="firstName"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <label className="text-white" htmlFor="middleName">
          Middle Name
        </label>
        <input
          className={status || middleName ? "signupInput" : "failedsignup"}
          type="text"
          id="middleName"
          name="middleName"
          value={middleName}
          onChange={(e) => setMiddleName(e.target.value)}
        />
        <label className="text-white" htmlFor="lastName">
          Last Name
        </label>
        <input
          className={status || lastName ? "signupInput" : "failedsignup"}
          type="text"
          id="lastName"
          name="lastName"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <label className="text-white" htmlFor="password">
          Password
        </label>
        <input
          className={status || password ? "signupInput" : "failedsignup"}
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <label className="text-white" htmlFor="confirmPassword">
          Confirm Password
        </label>
        <input
          className={status || confirmPassword ? "signupInput" : "failedsignup"}
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button className="signupSubmit" type="submit">
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignUp;