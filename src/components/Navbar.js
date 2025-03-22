import "../styles/Navbar.css";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import GovLogo from "../assets/GovLogo.jpg";

const Navbar = ({ children, showNavigate = true }) => {
  const { setUserCode } = useAuth();
  const { userCode } = useAuth();
  const navigate = useNavigate();
  const loggingOut = async () => {
    localStorage.removeItem("token");
    setUserCode(null);
    window.location.href = "/login";
  };

  const navigatePmsHandler = () => {
    navigate("/pms");
  };

  const navigateTmsHandler = () => {
    navigate("/tms");
  };

  const navigateDmsHandler = () => {
    navigate("/dms");
  };

  const navigateTomsPmsHandler = () => {
    navigate("/watoms/pms");
  };

  const navigateTomsTmsHandler = () => {
    navigate("/watoms/tms");
  };

  const navigateTomsDmsHandler = () => {
    navigate("/watoms/dms");
  };

  return (
    <div className="navbar2">
      <div className="logoDiv">
        <img
          className="logo"
          src="http://pms.wabyse.com/wp-content/uploads/2024/10/cropped-cropped-WABYS-NEW-LOGO1.png"
          alt="Wabys Logo"
        />
        {showNavigate ? null : (
          <img className="logo logoGov" src={GovLogo} alt="Wabys Logo" />
        )}
      </div>
      {showNavigate ? (
        <button className="navigate" onClick={navigatePmsHandler}>
          Pms
        </button>
      ) : null}
      {showNavigate ? (
        <button className="navigate" onClick={navigateDmsHandler}>
          Dms
        </button>
      ) : null}
      {showNavigate ? (
        <button className="navigate" onClick={navigateTmsHandler}>
          Tms
        </button>
      ) : null}
      {!showNavigate ? (
        <button className="navigate" onClick={navigateTomsPmsHandler}>
          Watoms Pms
        </button>
      ) : null}
      {!showNavigate ? (
        <button className="navigate" onClick={navigateTomsDmsHandler}>
          Watoms Dms
        </button>
      ) : null}
      {!showNavigate ? (
        <button className="navigate" onClick={navigateTomsTmsHandler}>
          Watoms Tms
        </button>
      ) : null}
      <div className="navController">
        <div className="navbarChildren">{children}</div>
        <div className="userCode">{userCode || "Guest"}</div>
        <button className="logoutBtn" onClick={loggingOut}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
