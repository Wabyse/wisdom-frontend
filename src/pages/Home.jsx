import HeroSection from "../components/HeroSection";
import HomeBody from "../components/HomeBody";
import HomeFooter from "../components/HomeFooter";
import HomeNabvar from "../components/HomeNavbar";
import img from '../assets/HeroSection.jpg'
import { useState } from "react";

const Home = () => {
  const [mobileView, setMobileView] = useState(true);

  return (
    <div>
      <div
        className="m-0 bg-no-repeat bg-center md:bg-[length:100%_100%] md:bg-cove"
        style={{
          backgroundImage: `url(${img})`
        }}>
        <HomeNabvar setViewValue={setMobileView}/>
        <HeroSection viewValue={mobileView}/>
      </div>
      <HomeBody />
      <HomeFooter />
    </div>
  )
};

export default Home;
