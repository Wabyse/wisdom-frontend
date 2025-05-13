import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import Popup from "../components/Popup";

const HeroSection = ({ viewValue }) => {
    const [notAvailable, setNotAvailable] = useState(false);

    const openPopup = () => setNotAvailable(true);

    const closePopup = () => setNotAvailable(false);
    return (
        viewValue ? <div
            className="w-full p-16 flex flex-col gap-6"
        >
            <h1 className="md:w-[50%] md:text-8xl text-2xl font-bold text-white">Welcome to EBDA EDU</h1>
            <h1 className="md:w-[50%] md:text-4xl text-xl font-bold text-white">for Development and Training</h1>
            <h1 className="md:text-3xl text-xl text-white">Your Trusted Partner in building Excellence</h1>
            <div className="md:m-4 flex justify-between">
                <div>
                    <button onClick={openPopup} className="bg-wisdomOrange md:p-4 p-2 border-2 border-wisdomOrange hover:text-white md:mr-4 mb-4 md:mb-auto">Explore Our Projects</button>
                    <button onClick={openPopup} className="md:p-4 p-2 border-wisdomOrange hover:bg-wisdomOrange hover:text-white border-2 text-white">Get in Touch</button>
                </div>
                <div className="border-2 border-gray-400 bg-black flex justify-center items-center p-4 text-2xl max-h-[9vh]">
                    <FontAwesomeIcon className="text-wisdomLightOrange" icon={faComment} />
                </div>
            </div>
            <Popup
                isOpen={notAvailable}
                onClose={closePopup}
                message="This page is under maintenance"
                button="close"
                form={false}
            />
        </div> : null
    )
};

export default HeroSection;
