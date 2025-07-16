import phone from '../assets/phone repair.png';
import car from '../assets/car.jpg';
import kahraba from '../assets/kahraba.png';
import sweing from '../assets/sweing.png';
import sun from '../assets/solar panel.jpg';
import houseDevices from '../assets/house_devices.png';
import plasterer from '../assets/plasterer.png';
import ceramic from '../assets/ceramic.png';
import building from '../assets/building.png';
import blumbing from '../assets/blumbing.png';
import ac from '../assets/AC.png';
import computer from '../assets/computer.png';
import metalicFurniture from '../assets/metalic_furniture.png';
import furniture from '../assets/furniture.png';
import plastic from '../assets/plastic.png';
import el7edada from '../assets/7edada.png';
import shadadat from '../assets/shadadat.png';
import satellite from '../assets/satellite.png';
import paintingWall from '../assets/paintingWall.png';
import el5erata from '../assets/5erata.png';
import cnc from '../assets/cnc.png';
import motor from '../assets/motor.png';
import camera from '../assets/camera.png';
import wires from '../assets/wires.png';
import realSweing from '../assets/real_sweing.jpg';
import realPhone from '../assets/real_phone.jpg';
import realHouseDevices from '../assets/real_house_devices.jpg';
import realPlasterer from '../assets/real_plasterer.png';
import realBuilding from '../assets/real_building.png';
import realShadadat from '../assets/real_shadadat.jpg';
// import realNegaraMosl7a from '../assets/real_negara_mosl7a.jpg';
import realIronFurniture from '../assets/real_iron_furniture.jpg';
import real7edadaMosla7a from '../assets/real_7edada_mosl7a.jpg';
import realTarkeebKahrba from '../assets/real_tarkeeb_kahrba.png';
// import realL7am from '../assets/real_l7am.jpg';
import realMesa7a from '../assets/real_mesa7a.jpg';
import realPlastic from '../assets/real_plastic.jpg';
import realLafMo7rkat from '../assets/real_laf_mo7rkat.jpg';
import realCNC from '../assets/real_cnc.jpg';
import real5erata3ama from '../assets/real_5erata_3ama.jpg';
import realNa2shZa5rfa from '../assets/real_na2sh_za5rfa.jpg';
import realKahrbaTa7kom from '../assets/real_kahrba_ta7kom.jpg';
import realCeramic from '../assets/real_ceramic.jpg';
import realBlumbing from '../assets/real_blumbing.jpg';
import realFurniture from '../assets/real_furniture.png';
import realAc from '../assets/real_ac.jpg';
import realCar from '../assets/real_car.jpg';
import realSatellite from '../assets/real_satellite.png';
import realSun from '../assets/real_sun.jpg';
import realComputer from '../assets/real_computer.jpg';

const CourseCard = ({ img1, text, img2 }) => {
    return (
        <div className="relative md:w-[20%] w-[50%] border-gray-500 border-2 group h-[40vh] overflow-hidden p-4">

            <div className="absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-700 opacity-100 group-hover:opacity-0">
                <img src={img1} alt="" className="w-40" />
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

const InstitutionCourses = () => {
    return (
        <>
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
            <CourseCard
                img1={shadadat}
                text="شدادات معدنية"
                img2={realShadadat}
            />
            {/* <CourseCard
                        img1={car}
                        text="نجارة مسلحه"
                        img2={realNegaraMosl7a}
                    /> */}
            <CourseCard
                img1={el7edada}
                text="حداده مسلحة"
                img2={real7edadaMosla7a}
            />
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
            <CourseCard
                img1={satellite}
                text="صيانة الدش"
                img2={realSatellite}
            />
            <CourseCard
                img1={phone}
                text="صيانة المحمول"
                img2={realPhone}
            />
            <CourseCard
                img1={wires}
                text="تركيبات كهربائية"
                img2={realTarkeebKahrba}
            />
            {/* <CourseCard
                        img1={car}
                        text="اللحام"
                        img2={realL7am}
                    /> */}
            <CourseCard
                img1={camera}
                text="المسحاة"
                img2={realMesa7a}
            />
            <CourseCard
                img1={plastic}
                text="بلاستيك"
                img2={realPlastic}
            />
            <CourseCard
                img1={motor}
                text="لف محركات"
                img2={realLafMo7rkat}
            />
            {/* <CourseCard
                        img1={car}
                        text="الوميتال"
                        img2={realHouse}
                    /> */}
            <CourseCard
                img1={cnc}
                text="CNC"
                img2={realCNC}
            />
            <CourseCard
                img1={el5erata}
                text="خراطة عامة"
                img2={real5erata3ama}
            />
            {/* <CourseCard
                        img1={car}
                        text="تشغيل ماكينات"
                        img2={realHouse}
                    /> */}
            <CourseCard
                img1={paintingWall}
                text="نقش و زخرفه"
                img2={realNa2shZa5rfa}
            />
            <CourseCard
                img1={computer}
                text="صيانة كمبيوتر"
                img2={realComputer}
            />
            <CourseCard
                img1={kahraba}
                text="كهرباء و تحكم الي"
                img2={realKahrbaTa7kom}
            />
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
        </>
    )
}

export default InstitutionCourses;