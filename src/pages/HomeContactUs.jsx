import { useState } from "react";
import HomeFooter from "../components/HomeFooter";
import HomeNabvar from "../components/HomeNavbar";
import MapLocation from "../components/MapLocation";

const HomeContactUs = () => {
    const [mobileView, setMobileView] = useState(true);
    const Ebda_Edu_Main_location = [30.030631763312556, 31.505379613830097];
    const Ebda_Edu_Second_location = [30.056583, 31.467278];
    return (
        <>
            <div className="bg-zinc-600">
                <HomeNabvar current="contactus" setViewValue={setMobileView} />
            </div>

            <h2 className="md:text-6xl text-4xl font-bold text-center p-4">Find Us Here</h2>
            <div className="px-4 py-10 bg-white">
                <h2 className="text-2xl font-bold text-center p-4">headquarters</h2>
                <MapLocation position={Ebda_Edu_Main_location} />
            </div>
            <div className="px-4 py-10 bg-white">
                <h2 className="text-2xl font-bold text-center p-4">First Branch</h2>
                <MapLocation position={Ebda_Edu_Second_location} />
            </div>

            <HomeFooter />
        </>
    );
};

export default HomeContactUs;