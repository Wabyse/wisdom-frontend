import HomeFooter from "../components/HomeFooter";
import HomeNabvar from "../components/HomeNavbar";
import evotsVideo from '../assets/evots-video.mp4';
import { useState } from "react";

const HomeEVOTS = () => {
    const [mobileView, setMobileView] = useState(true);
    return (
        <>
            <div className="bg-zinc-600">
                <HomeNabvar current="evots" setViewValue={setMobileView} />
            </div>
            <h1 className="md:text-6xl text-4xl font-bold p-4">EVOTS</h1>
            <div className="flex justify-center my-12">
                <video
                    className="md:w-[50%] w-[90%] max-w-5xl rounded-lg shadow-lg"
                    autoPlay
                    muted
                    loop
                >
                    <source src={evotsVideo} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>
            <HomeFooter />
        </>
    )
};

export default HomeEVOTS;