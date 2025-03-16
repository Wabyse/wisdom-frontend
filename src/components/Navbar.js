import "../styles/Navbar.css";
import { useAuth } from "../context/AuthContext";

const Navbar = ({ children }) => {
  const { setUserCode } = useAuth();
  const { userCode } = useAuth();
  const loggingOut = async () => {
    localStorage.removeItem("token");
    setUserCode(null);
    window.location.href = "/login";
  };
  return (
    <div className="navbar2">
      <img
        className="logo"
        src="http://pms.wabyse.com/wp-content/uploads/2024/10/cropped-cropped-WABYS-NEW-LOGO1.png"
        alt="Wabys Logo"
      />
      <div className="navController">
        <div>{children}</div>
        <div className="userCode">{userCode || "Guest"}</div>
        <button className="logoutBtn" onClick={loggingOut}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;