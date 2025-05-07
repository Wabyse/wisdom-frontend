import React from "react";
import { PARTNERS } from "../constants/constants";
import style from '../styles/HomeBody.module.css';
import img1 from '../assets/test4.jpg';
import img2 from '../assets/test2.jpg';
import { useState } from "react";
import Popup from "../components/Popup";

const HomeBody = () => {
    const [notAvailable, setNotAvailable] = useState(false);

    const openPopup = () => setNotAvailable(true);

    const closePopup = () => setNotAvailable(false);
    const infiniteItems = [...PARTNERS, ...PARTNERS, ...PARTNERS, ...PARTNERS,];

    return (
        <div>
            <div className="flex justify-between m-12">
                <div className="w-[25%]">
                    <h1 className="text-xl">Crafting Execptional Spaces</h1>
                    <p className="text-wisdomOrange text-4xl">EBDA EDU: Transforming Visions into Reality</p>
                </div>
                <button onClick={openPopup} className="bg-wisdomOrange hover:bg-wisdomDarkOrange h-[8vh] px-8 flex self-center items-center">Learn More</button>
            </div>
            <div className="flex justify-between m-12">
                <div className="w-[25%] mt-20 group">
                    <div className="w-[15%] border-2 border-black transition-all duration-300 group-hover:w-[78%]"></div>
                    <h1 className="text-2xl font-bold">EVOTS</h1>
                    <p className="text-xl">
                        EVOTS is a centralized digital platform developed by Idar Edu and the Ministry of Labor to manage and coordinate the vocational training system development project. It centralizes documentation, enables real-time project tracking, and integrates with WATOMS to display performance metrics. With role-based access and secure data management, EVOTS enhances transparency, coordination, and informed decision-making across all project phases.
                    </p>
                </div>
                <img src={img1} alt="" className="w-[45%]" />
            </div>
            <div className="flex justify-between m-12">
                <img src={img2} alt="" className="w-[45%]" />
                <div className="w-[25%] mt-20 group">
                    <div className="w-[15%] border-2 border-black transition-all duration-300 group-hover:w-[78%]"></div>
                    <h1 className="text-2xl font-bold">WATOMS</h1>
                    <p className="text-xl">
                    WATOMS is a centralized electronic system developed to support digital transformation and enhance governance in vocational training centers. It manages the full training lifecycle—from trainee registration to certificate issuance—while tracking performance, attendance, and evaluations. With over 130 surveys analyzed, the system provides data-driven insights via interactive dashboards, helping decision-makers monitor KPIs, address operational challenges, and uphold training quality. WATOMS is a cornerstone in advancing and sustaining improvements in vocational training.
                    </p>
                </div>
            </div>
            <div className="w-full overflow-hidden py-10">
                <h1 className="text-center text-4xl font-bold mb-8">OUR PARTNERS</h1>
                <div className="relative w-full overflow-hidden">
                    <div className={`${style["animate-scroll"]} flex whitespace-nowrap`}>
                        {infiniteItems.map((item, index) => (
                            <div
                                key={index}
                                className="min-w-[350px] flex-shrink-0 flex flex-col items-center justify-center p-4"
                            >
                                <img src={item.image} alt={item.title} className={item.width} />
                                <p className="mt-2 font-bold text-center">{item.title}</p>
                            </div>
                        ))}
                    </div>
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
    );
};

export default HomeBody;
