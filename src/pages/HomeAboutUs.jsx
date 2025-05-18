import HomeFooter from "../components/HomeFooter";
import HomeNabvar from "../components/HomeNavbar";
import aboutus from '../assets/aboutus.jpg';
import aboutusPhoto from '../assets/aboutus-photo.png';
import { useState } from "react";

const HomeAboutUs = () => {
    const [mobileView, setMobileView] = useState(true);
    return (
        <>
            <div className="bg-zinc-600">
                <HomeNabvar current="aboutus"  setViewValue={setMobileView} />
            </div>
            <div className="m-4 flex flex-col gap-4">
                <h1 className="font-bold md:text-6xl text-4xl">About Us</h1>
                <div className="w-full flex justify-center items-center">
                    <div className="w-[90%] flex md:flex-row flex-col justify-between items-center text-center gap-2">
                        <p className="text-xl md:w-[20%] w-full font-bold">To be Egypt's premier provider of innovative vocational training and technical education, driving economic growth and global competitiveness.</p>
                        <img src={aboutus} alt="" className="md:w-[50%] w-fit" />
                        <p className="text-xl md:w-[20%] w-full font-bold">Providing distinguished vocational training programs and technical education that enable Egyptians to acquire the skills required in the local and international labor market, promote a culture of continuous learning, and support sustainable development</p>
                    </div>
                </div>
                <div className="flex justify-center items-center">
                    <img src={aboutusPhoto} alt="" className="w-[90%] rounded-3xl" />
                </div>
            </div>
            <HomeFooter />
        </>
    )
};

export default HomeAboutUs;