import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import Popup from "../components/Popup";

const HeroSection = () => {
    const [notAvailable, setNotAvailable] = useState(false);

    const openPopup = () => setNotAvailable(true);

    const closePopup = () => setNotAvailable(false);
    return (
        <div
            className="w-full p-16 flex flex-col gap-6"
        >
            <h1 className="w-[50%] text-8xl font-bold text-white">Welcome to EBDA EDU</h1>
            <h1 className="w-[50%] text-4xl font-bold text-white">for Development and Training</h1>
            <h1 className="text-3xl text-white">Your Trusted Partner in building Excellence</h1>
            <div className="m-4 flex justify-between">
                <div>
                    <button onClick={openPopup} className="bg-wisdomOrange p-4 border-2 border-wisdomOrange hover:text-white mr-4">Explore Our Projects</button>
                    <button onClick={openPopup} className="p-4 border-wisdomOrange hover:bg-wisdomOrange hover:text-white border-2 text-white">Get in Touch</button>
                </div>
                <div className="border-2 border-gray-400 bg-black flex justify-center items-center p-4 text-2xl">
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
        </div>
    )
};

export default HeroSection;
