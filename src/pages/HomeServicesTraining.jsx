import HomeNabvar from "../components/HomeNavbar";
import training from '../assets/training.png';
import trainingChart from '../assets/training-chart.png';
import trainingList from '../assets/training-list.png';
import trainingimg1 from '../assets/training-img1.png';
import trainingimg2 from '../assets/training-img2.png';
import trainingimg3 from '../assets/training-img3.jpg';
import trainingList2 from '../assets/training-list2.png';
import HomeFooter from "../components/HomeFooter";
import { useState } from "react";

const HomeServicesTraining = () => {
    const [mobileView, setMobileView] = useState(true);
    return (
        <>
            <div className="bg-zinc-600">
                <HomeNabvar current="services" setViewValue={setMobileView} />
            </div>
            <div className="w-full gap-10 flex flex-col">
                <h1 className="md:text-6xl text-4xl font-bold py-2 px-4">Training</h1>
                <div className="flex justify-center items-center">
                    <img src={training} alt="" />
                </div>
                <div className="flex flex-col justify-center items-center">
                    <h1 className="md:text-6xl text-4xl font-bold text-center">Development of Competency-Based Curricula</h1>
                    <div className="flex justify-center md:flex-row flex-col items-center w-[90%]">
                        <img src={trainingChart} alt="" />
                        <p className="text-xl md:w-[50%] w-full text-center">To develop knowledge, skills, and attitudes in a competency-based curriculum, define clear competencies and create measurable learning outcomes. Use lectures and readings for knowledge, hands-on practice for skills, and role-playing or reflection for attitudes. Assess through tests, practical tasks, and behavior observations to ensure learners fully master each competency.</p>
                    </div>
                </div>
                <div className="flex flex-col justify-center items-center">
                    <h1 className="md:text-6xl text-4xl font-bold text-center">Specially Tailored Training Packages based on job descriptions</h1>
                    <div className="flex justify-center md:flex-row flex-col items-center w-[90%]">
                        <img src={trainingList} alt="" />
                        <p className="text-xl md:w-[50%] w-full text-center">Tailored Training Packages are customized programs designed to match job descriptions, ensuring employees develop the exact knowledge, skills, and attitudes needed for their roles. This improves relevance, performance, and productivity.</p>
                    </div>
                </div>
                <div className="flex flex-col items-center justify-center">
                    <h1 className="md:text-6xl text-4xl text-center w-[90%] font-bold mb-2">Soft and Employability Skills</h1>
                    <div className="flex justify-center items-center md:flex-row flex-col">
                        <h1 className="text-xl md:w-[50%] w-full text-center">Soft Skills are personal traits like communication, teamwork, and problem-solving that improve work interactions.</h1>
                        <img src={trainingimg1} alt="" />
                    </div>
                    <div className="flex justify-center items-center md:flex-row flex-col">
                        <img src={trainingimg2} alt="" />
                        <h1 className="text-xl md:w-[50%] w-full text-center">Soft Skills are personal traits like communication, teamwork, and problem-solving that improve work interactions.</h1>
                    </div>
                </div>
                <div className="flex flex-col justify-center items-center">
                    <h1 className="md:text-6xl text-4xl font-bold text-center">International Standards with specific KPIs</h1>
                    <div className="flex justify-center md:flex-row flex-col items-center w-[90%]">
                        <img src={trainingList2} alt="" />
                        <p className="text-xl md:w-[50%] w-full text-center">This initiative, aligned with Egypt's Vision 2030, aims to transform the vocational training sector to support a knowledge- and innovation-based economy. A collaboration between the Egyptian Ministry of Labor and Abda Adio Company, the project establishes high-quality standards to meet local and international labor market needs. The guide provides a comprehensive framework to improve training center efficiency, upgrade technical and administrative staff, and align programs with global standards, including ISO, UNESCO, and IEEE guidelines.</p>
                    </div>
                </div>
                <div className="flex flex-col justify-center items-center">
                    <h1 className="md:text-6xl text-4xl font-bold text-center mb-4">In factory Training</h1>
                    <div className="flex justify-center md:flex-row flex-col items-center w-[90%]">
                        <p className="text-xl md:w-[50%] w-full text-center">We ensure the integration of theoretical and practical skills, regularly evaluate the quality of training based on standards, and consider the feedback of trainees, trainers, and supervisors</p>
                        <img src={trainingimg3} alt="" />
                    </div>
                </div>
            </div>
            <HomeFooter />
        </>
    )
};

export default HomeServicesTraining;