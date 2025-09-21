import NewNavbar from "../components/NewNavbar";
import ismailiaManager from "../assets/ismailiaManager.jpg";
import boulaqManager from "../assets/boulaqManager.jpg";
import sharabyaManager from "../assets/sharabyaManager.jpg";
import sharqiaManager from "../assets/sharqiaManager.jpg";
import suezManager from "../assets/suezManager.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartSimple, faCheckSquare, faPhone, faScroll } from "@fortawesome/free-solid-svg-icons";
import DonutChart from "../components/DonutChart";
import { roundNumber } from "../utils/roundNumber";
import { useEffect, useState } from "react";
import { fetchWatomsDetailsData } from "../services/dashboard";

const WatomsManagersReports = () => {
    const [watomsData, setWatomsData] = useState([]);
    const [loading, setLoading] = useState(true);

    // Manager images mapping
    const managerImages = {
        4: ismailiaManager,
        5: boulaqManager,
        7: sharabyaManager,
        8: sharqiaManager,
        9: suezManager
    };

    // Organization indices to display
    const organizationIndices = [4, 5, 7, 8, 9];

    // fetching watoms' dashboard data
    useEffect(() => {
        const loadWatomsDetailedData = async () => {
            try {
                setLoading(true);
                const response = await fetchWatomsDetailsData();
                setWatomsData(response);
            } catch (error) {
                console.error('❌ Error fetching Watoms Data:', error);
            } finally {
                setLoading(false);
            }
        }
        loadWatomsDetailedData();
    }, []);
    return (
        <>
            <NewNavbar />
            <div className="w-full h-[88vh] bg-[#0a183d] flex flex-col items-center gap-6">
                <div className="flex flex-col justify-center items-center text-xl font-bold text-[#FBBF24] gap-2 mt-4">
                    <div className="w-1/4 h-0 border-t-4 border-gray-400 rounded-full" />
                    <div>EVOITS</div>
                    <div>مشروع تطوير مراكز التدريب المهني</div>
                    <div className="w-1/2 h-0 border-t-4 border-gray-400 rounded-full" />
                </div>
                <fieldset className="my-auto flex justify-center items-start border-2 border-gray-400 p-2 rounded-2xl shadow-white shadow-md min-h-[64vh] h-[64vh] w-[90%]">
                    <legend className="flex gap-2 px-2 text-start font-bold text-white">
                        <FontAwesomeIcon icon={faPhone} />
                        <FontAwesomeIcon icon={faChartSimple} />
                        <FontAwesomeIcon icon={faCheckSquare} />
                        <h1>لوحة تحكم البيانات</h1>
                    </legend>
                    <div className="flex justify-evenly items-center w-full h-full gap-4">
                        {organizationIndices.map((orgIndex) => (
                            <div key={orgIndex} className="flex flex-col flex-1 gap-2 h-[90%] justify-center items-center max-w-60">
                                <div className="rounded-2xl bg-blue-900 overflow-hidden flex-1 w-full">
                                    <div className="flex flex-col items-center p-2 gap-4">
                                        {/* manager's photo */}
                                        <img
                                            className="rounded-full w-32 h-32 shadow-lg shadow-green-500 mb-2"
                                            src={managerImages[orgIndex]}
                                            alt={`manager ${orgIndex}`}
                                        />
                                        <div className="flex justify-evenly w-full items-center gap-2 my-2">
                                            {/* vtc's score */}
                                            <DonutChart
                                                value={roundNumber(watomsData?.organizations?.[orgIndex]?.months?.[watomsData?.organizations?.[orgIndex]?.months?.length - 1]?.performance || 0)}
                                                size={60}
                                                color='url(#circularBlueGradient)'
                                                bg='#23263a'
                                                textColor='#fff'
                                            />
                                            {/* manager's detail */}
                                            <div className="text-white text-center">
                                                <h1 className="text-sm font-bold">
                                                    {watomsData?.organizations?.[orgIndex]?.managerFirstName} {watomsData?.organizations?.[orgIndex]?.managerMiddleName} {watomsData?.organizations?.[orgIndex]?.managerLastName}
                                                </h1>
                                                <h1 className="text-xs text-gray-300">
                                                    {watomsData?.organizations?.[orgIndex]?.name}
                                                </h1>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex bg-gray-500 gap-2 justify-evenly items-center px-1 py-2">
                                        <FontAwesomeIcon icon={faChartSimple} />
                                        <h1>لوحة تحكم البيانات</h1>
                                    </div>
                                    <div className="flex bg-yellow-500 gap-2 justify-evenly items-center px-1 py-2">
                                        <FontAwesomeIcon icon={faScroll} />
                                        <h1>تقرير البيانات</h1>
                                    </div>
                                    <div className="flex bg-blue-500 gap-2 justify-evenly items-center px-1 py-2">
                                        <FontAwesomeIcon icon={faPhone} />
                                        <h1>اتصال مباشر</h1>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </fieldset>
            </div>
        </>
    )
}

export default WatomsManagersReports;