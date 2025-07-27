import HomeBody from "../components/HomeBody";
import HomeFooter from "../components/HomeFooter";
import HomeNabvar from "../components/HomeNavbar";
import { useState } from "react";
import HomeImgSlider from "../components/HomeImgSlider";

const Home = () => {
  const [, setMobileView] = useState(true);

  return (
    <div>
      <div
        className="m-0 bg-no-repeat bg-center md:bg-[length:100%_100%] md:bg-cove">
        <HomeNabvar setViewValue={setMobileView} />
      </div>
      <HomeImgSlider />
      <HomeBody />
      <HomeFooter />
    </div>
  )
};

export default Home;
