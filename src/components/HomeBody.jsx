import { PARTNERS } from "../constants/constants";
import style from '../styles/HomeBody.module.css';
import img1 from '../assets/test4.jpg';
import img2 from '../assets/test2.jpg';
import ebda1 from '../assets/ebda-body.jpg';
import phone from '../assets/phone repair.png';
import car from '../assets/car.jpg';
// import fridge from '../assets/fridge.png';
import sweing from '../assets/sweing.png';
import sun from '../assets/solar panel.jpg';
import houseDevices from '../assets/house_devices.png';
import plasterer from '../assets/plasterer.png';
import ceramic from '../assets/ceramic.png';
import building from '../assets/building.png';
import blumbing from '../assets/blumbing.png';
import ac from '../assets/AC.png';
// import shower from '../assets/shower.png';
import computer from '../assets/computer.png';
import metalicFurniture from '../assets/metalic_furniture.png';
import furniture from '../assets/furniture.png';
import plastic from '../assets/plastic.png';
// import realHouse from '../assets/real_house.jpg';
import realSweing from '../assets/real_sweing.jpg';
import realPhone from '../assets/real_phone.jpg';
import realHouseDevices from '../assets/real_house_devices.jpg';
import realPlasterer from '../assets/real_plasterer.png';
import realBuilding from '../assets/real_building.png';
// import realShadadat from '../assets/real_shadadat.jpg';
// import realNegaraMosl7a from '../assets/real_negara_mosl7a.jpg';
import realIronFurniture from '../assets/real_iron_furniture.jpg';
// import real7edadaMosla7a from '../assets/real_7edada_mosl7a.jpg';
// import realTarkeebKahrba from '../assets/real_tarkeeb_kahrba.png';
// import realL7am from '../assets/real_l7am.jpg';
// import realMesa7a from '../assets/real_mesa7a.jpg';
import realPlastic from '../assets/real_plastic.jpg';
// import realLafMo7rkat from '../assets/real_laf_mo7rkat.jpg';
// import realCNC from '../assets/real_cnc.jpg';
// import real5erata3ama from '../assets/real_5erata_3ama.jpg';
// import realNa2shZa5rfa from '../assets/real_na2sh_za5rfa.jpg';
// import realKahrbaTa7kom from '../assets/real_kahrba_ta7kom.jpg';
import realCeramic from '../assets/real_ceramic.jpg';
import realBlumbing from '../assets/real_blumbing.jpg';
import realFurniture from '../assets/real_furniture.png';
import realAc from '../assets/real_ac.jpg';
import realCar from '../assets/real_car.jpg';
// import realShower from '../assets/real_shower.png';
import realSun from '../assets/real_sun.jpg';
import realComputer from '../assets/real_computer.jpg';
// import ebdaeduBlack from '../assets/ebda-edu-black.jpg';
import { useState } from "react";
import Popup from "../components/Popup";
import ebdaVideo from '../assets/ebda-edu-video.mp4';
import news from '../assets/news.mp4';

const CourseCard = ({ img1, text, img2 }) => {
    return (
        <div className="relative w-[20%] border-gray-500 border-2 group h-[40vh] overflow-hidden p-4">

            <div className="absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-700 opacity-100 group-hover:opacity-0">
                <img src={img1} alt="" className="w-52" />
                <p className="text-center text-gray-500">{text}</p>
            </div>

            <div
                className="absolute inset-0 flex items-center justify-center transition-opacity duration-700 opacity-0 group-hover:opacity-100"
            >
                <div
                    className="absolute inset-0 bg-cover bg-center z-0"
                    style={{ backgroundImage: `url(${img2})` }}
                ></div>
                <div className="absolute inset-0 bg-black opacity-50 z-0"></div>
                <p className="text-white text-xl font-semibold z-10 relative">{text}</p>
            </div>

        </div>
    )
}

const HomeBody = () => {
    const [notAvailable, setNotAvailable] = useState(false);

    const openPopup = () => setNotAvailable(true);

    const closePopup = () => setNotAvailable(false);
    const infiniteItems = [...PARTNERS, ...PARTNERS, ...PARTNERS, ...PARTNERS,];

    return (
        <div>
            <div className="flex justify-between m-12">
                <div className="w-[50%]">
                    <p className="text-wisdomOrange md:text-7xl text-xl">EBDA EDU: Transforming Visions into Reality</p>
                </div>
                <button onClick={openPopup} className="bg-wisdomOrange hover:bg-wisdomDarkOrange h-[8vh] px-8 flex self-center items-center">Learn More</button>
            </div>
            <div className="flex justify-center items-center">
                <div className="w-[94%] bg-slate-200 flex md:flex-row flex-col p-4 rounded items-center">
                    <div className="gap-4 flex flex-col md:mb-0 mb-2 justify-center">
                        {/* <img src={ebdaeduBlack} alt="" className="w-[25%]" /> */}
                        <h1 className="text-6xl font-bold">EBDA EDU</h1>
                        <p className="text-xl">EBDA EDU is a dynamic and innovative academy for technical education and vocational training services  dedicated to fostering excellence in education and workforce development.</p>
                        <p className="text-xl">With a comprehensive range of services, EBDA EDU is committed to empowering individuals, schools and organizations in the vocational sector to achieve their full potential.</p>
                    </div>
                    <img src={ebda1} alt="" />
                </div>
            </div>
            <div className="flex md:flex-row flex-col justify-between m-12">
                <div className="md:w-[45%] w-full mt-10 group md:mb-auto mb-5">
                    <div className="w-[15%] border-2 border-black transition-all duration-300 group-hover:w-[100%]"></div>
                    <h1 className="text-6xl font-bold">EVOTS</h1>
                    <p className="font-bold text-2xl">Elevating Vocational Training System</p>
                    <p className="text-xl mt-10">
                        <p className="font-bold inline"> EBDA EDU</p> recognizes the vital role of a strong vocational training system in advancing Egypt’s economic growth and workforce development. The Elevating Vocational Training System (EVOTS) is a strategic initiative with the <p className="font-bold inline">Ministry Of Labor</p> aimed at overhauling vocational training to better align with labor market needs. By focusing on demand-driven training, high-quality standards, modernized facilities, and international-level curricula, EVOTS ensures graduates are equipped with relevant skills to enhance their employability.
                    </p>
                    <p className="text-xl mt-4"> It also promotes strong collaboration among training providers, industry, and government to improve practical learning and facilitate workforce integration. Through improved governance, clear policies, and continuous evaluation, EVOTS strengthens accountability and system efficiency. EBDA EDU supports this vision by actively contributing to the development of a skilled, adaptable workforce that supports Egypt’s long-term economic sustainability.</p>
                </div>
                <img src={img1} alt="" className="md:w-[45%] w-screen" />
            </div>
            <div className="flex justify-center">
                <div className="flex flex-wrap border-gray-500 border-2 w-[80%]">

                    <CourseCard
                        img1={sun}
                        text="تركيبات الطاقة شمسية"
                        img2={realSun}
                    />
                    <CourseCard
                        img1={houseDevices}
                        text="اجهزة منزلية"
                        img2={realHouseDevices}
                    />
                    <CourseCard
                        img1={blumbing}
                        text="سباكة"
                        img2={realBlumbing}
                    />
                    {/* <CourseCard
                        img1={car}
                        text="شدادات معدنية"
                        img2={realShadadat}
                    /> */}
                    {/* <CourseCard
                        img1={car}
                        text="نجارة مسلحه"
                        img2={realNegaraMosl7a}
                    /> */}
                    {/* <CourseCard
                        img1={car}
                        text="حداده مسلحة"
                        img2={real7edadaMosla7a}
                    /> */}
                    <CourseCard
                        img1={metalicFurniture}
                        text="اثاث معدني"
                        img2={realIronFurniture}
                    />
                    <CourseCard
                        img1={furniture}
                        text="نجارة اثاث"
                        img2={realFurniture}
                    />
                    <CourseCard
                        img1={sweing}
                        text="تفصيل و خياطة"
                        img2={realSweing}
                    />
                    <CourseCard
                        img1={ac}
                        text="تبريد و تكييف"
                        img2={realAc}
                    />
                    <CourseCard
                        img1={car}
                        text="ميكانيكا السيارات"
                        img2={realCar}
                    />
                    {/* <CourseCard
                        img1={shower}
                        text="صيانة الدش"
                        img2={realShower}
                    /> */}
                    <CourseCard
                        img1={phone}
                        text="صيانة المحمول"
                        img2={realPhone}
                    />
                    {/* <CourseCard
                        img1={car}
                        text="تركيبات كهربائية"
                        img2={realTarkeebKahrba}
                    /> */}
                    {/* <CourseCard
                        img1={car}
                        text="اللحام"
                        img2={realL7am}
                    /> */}
                    {/* <CourseCard
                        img1={car}
                        text="المسحاة"
                        img2={realMesa7a}
                    /> */}
                    <CourseCard
                        img1={plastic}
                        text="بلاستيك"
                        img2={realPlastic}
                    />
                    {/* <CourseCard
                        img1={car}
                        text="لف محركات"
                        img2={realLafMo7rkat}
                    /> */}
                    {/* <CourseCard
                        img1={car}
                        text="الوميتال"
                        img2={realHouse}
                    /> */}
                    {/* <CourseCard
                        img1={car}
                        text="CNC"
                        img2={realCNC}
                    /> */}
                    {/* <CourseCard
                        img1={car}
                        text="خراطة عامة"
                        img2={real5erata3ama}
                    /> */}
                    {/* <CourseCard
                        img1={car}
                        text="تشغيل ماكينات"
                        img2={realHouse}
                    /> */}
                    {/* <CourseCard
                        img1={car}
                        text="نقش و زخرفه"
                        img2={realNa2shZa5rfa}
                    /> */}
                    <CourseCard
                        img1={computer}
                        text="صيانة كمبيوتر"
                        img2={realComputer}
                    />
                    {/* <CourseCard
                        img1={fridge}
                        text="كهرباء و تحكم الي"
                        img2={realKahrbaTa7kom}
                    /> */}
                    <CourseCard
                        img1={plasterer}
                        text="محارة"
                        img2={realPlasterer}
                    />
                    <CourseCard
                        img1={building}
                        text="بناء"
                        img2={realBuilding}
                    />
                    <CourseCard
                        img1={ceramic}
                        text="تشطيب (سيراميك)"
                        img2={realCeramic}
                    />
                </div>
            </div>

            <div className="flex md:flex-row flex-col justify-between m-12">
                <img src={img2} alt="" className="w-[45%] hidden md:flex" />
                <div className="md:w-[45%] w-full mt-20 group md:mb-auto mb-5">
                    <div className="w-[15%] border-2 border-black transition-all duration-300 group-hover:w-[100%]"></div>
                    <h1 className="text-6xl font-bold">WATOMS</h1>
                    <p className="text-2xl font-bold">WABYS Automated Training Operations Managment System</p>
                    <p className="text-xl mt-4">
                        It is a holistic integrated electronic system developed to support digital transformation and enhance governance in vocational training centers. As part of the project’s digital transformation efforts and commitment to improved governance in vocational training centers, WATOMS was developed as a central digital platform for managing and monitoring all aspects of the training process. It supports the entire training lifecycle—from trainee registration and performance tracking to the issuance of accredited certificates.

                        WATOMS enables centralized management of data related to trainees, trainers, and programs; monitors performance; documents attendance and progress using modern tools; and stores feedback from various stakeholders, with over 130 surveys already analyzed to enhance training quality.

                        Designed to support decision-making, the system offers interactive dashboards that track KPIs, highlight operational challenges, and assess training quality and compliance. With these capabilities, WATOMS plays a key role in strengthening the vocational training system and promoting continuous improvement.
                    </p>
                </div>
                <img src={img2} alt="" className="w-screen md:hidden" />
            </div>
            <div className="flex justify-center my-12">
                <video
                    className="w-[90%] max-w-5xl rounded-lg shadow-lg"
                    autoPlay
                    muted
                    loop
                >
                    <source src={ebdaVideo} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>
            <div className="flex justify-center">
                <h1 className="text-center text-4xl font-bold border-b-4 border-black pb-2 w-[20%]">Our Latest News</h1>

            </div>
            <div className="flex justify-center my-12">
                <video
                    className="w-[90%] max-w-5xl rounded-lg shadow-lg"
                    controls
                >
                    <source src={news} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
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
