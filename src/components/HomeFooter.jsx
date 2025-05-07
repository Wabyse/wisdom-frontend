import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpLong } from "@fortawesome/free-solid-svg-icons";
import { faSquareFacebook, faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { useState } from "react";
import Popup from "../components/Popup";

const HomeFooter = () => {
    const [notAvailable, setNotAvailable] = useState(false);

    const openPopup = () => setNotAvailable(true);

    const closePopup = () => setNotAvailable(false);
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' }); // smooth scroll
    };
    return (
        <div className="m-12 border-t-2 border-black">
            <div className="flex justify-between mt-10">
                <div className=" w-[15%]">
                    <h1 className="font-bold text-xl">EBDA EDU</h1>
                    <p>for Development and Training</p>
                </div>
                <div className="flex flex-col gap-4 w-[15%]">
                    <h1 className="font-bold text-xl">Head Office</h1>
                    <p>Fifth Settlement, North 90 St, Chillout Lotus, Bld.1, 3rd Floor</p>
                    <p>(+20) 11-517-84-361</p>
                    <p>(+20) 11-532-41-515</p>
                    <p>info@ebda-edu.com</p>
                </div>
                <div className="flex flex-col gap-4 w-[15%]">
                    <h1 className="font-bold text-xl">Socials</h1>
                    <div className="flex flex-col">
                        <a href="https://www.facebook.com/profile.php?id=61571999491577"><FontAwesomeIcon icon={faSquareFacebook} /> facebook</a>
                        <a href="https://www.instagram.com/ebda_edu?igsh=dWFqYTE3d2l6OXFz&utm_source=ig_contact_invite"><FontAwesomeIcon icon={faInstagram} /> instagram</a>
                        <a href="https://www.linkedin.com/company/ebda-edu-for-development-and-training/posts/?feedView=all"><FontAwesomeIcon icon={faLinkedin} /> linkedIn</a>
                    </div>
                </div>
                <div className="flex flex-col gap-4 w-[15%]">
                    <h1 className="font-bold text-xl">Inquires</h1>
                    <div>
                        <p>For any inquires, questions or commendations, please call:</p>
                        <p>(+20) 11-517-84-361</p>
                        <p>(+20) 11-532-41-515</p>
                    </div>
                </div>
                <button onClick={openPopup} className="bg-wisdomOrange hover:bg-wisdomDarkOrange hover:text-white h-[8vh] px-8 flex self-center items-center">Contact Us</button>
            </div>
            <p className="mt-6">2025 by EBDA EDU for Development and Training</p>
            <button
                onClick={scrollToTop}
                className="fixed bottom-4 right-4 bg-wisdomOrange text-white px-4 py-2 rounded-full shadow-lg hover:bg-wisdomDarkOrange transition"
            >
                <FontAwesomeIcon icon={faUpLong} />
            </button>
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

export default HomeFooter;