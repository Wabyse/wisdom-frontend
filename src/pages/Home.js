import "../styles/Home.css";
import DMS from "../assets/1.jpg";
import LMS from "../assets/2.png";
import TMS from "../assets/3.jpg";
import IFTS from "../assets/4.png";
import SIS from "../assets/5.png";
import PMS from "../assets/6.png";
import DASHBOARD from "../assets/7.jpg";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import Navbar from "../components/Navbar";

const Home = () => {
  const navigate = useNavigate();
  const handlePmsClick = () => {
    navigate(`/pms`);
  };

  const handleDmsClick = () => {
    navigate(`/dms`);
  };

  const handleTmsClick = () => {
    navigate(`/tms`);
  };

  const notAvailable = () =>
    toast.error("Sorry, This Page isn't available yet.");

  return (
    <>
      <Toaster />
      <Navbar/>

      <div className="cards">
        <button className="card" onClick={handleDmsClick}>
          <img src={DMS} alt="Placeholder" width="100%" />
          <h2>DMS</h2>
        </button>
        <button className="card" onClick={notAvailable}>
          <img src={LMS} alt="Placeholder" width="100%" />
          <h2>LMS</h2>
        </button>
        <button className="card" onClick={handleTmsClick}>
          <img src={TMS} alt="Placeholder" width="100%" />
          <h2>TMS</h2>
        </button>
        <button className="card" onClick={notAvailable}>
          <img src={IFTS} alt="Placeholder" width="100%" />
          <h2>IFTS</h2>
        </button>
        <button className="card" onClick={notAvailable}>
          <img src={SIS} alt="Placeholder" width="100%" />
          <h2>SIS</h2>
        </button>
        <button className="card" onClick={handlePmsClick}>
          <img src={PMS} alt="Placeholder" width="100%" />
          <h2>PMS</h2>
        </button>
        <button className="card" onClick={notAvailable}>
          <img src={DASHBOARD} alt="Placeholder" width="100%" />
          <h2>DASHBOARD</h2>
        </button>
      </div>
    </>
  );
};

export default Home;
