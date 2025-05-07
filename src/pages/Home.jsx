import HeroSection from "../components/HeroSection";
import HomeBody from "../components/HomeBody";
import HomeFooter from "../components/HomeFooter";
import HomeNabvar from "../components/HomeNavbar";
import img from '../assets/HeroSection.jpg'

const Home = () => {
  return (
    <div>
      <div
        className="m-0"
        style={{
          backgroundImage: `url(${img})`,
          backgroundSize: 'cover'
        }}>
        <HomeNabvar />
        <HeroSection />
      </div>
      <HomeBody />
      <HomeFooter />
    </div>
  )
};

export default Home;
