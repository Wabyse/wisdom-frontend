import NewNavbar from "../components/NewNavbar";
import ismailiaManager from "../assets/ismailiaManager.jpg";

const WatomsManagersReports = () => {
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
                <fieldset className="my-auto flex justify-center items-center border-2 border-gray-400 p-2 rounded-2xl shadow-white shadow-md min-h-[64vh] h-[64vh] w-[90%]">
                    <legend className="px-2 text-center font-bold text-white">لوحة تحكم البيانات</legend>
                    <div className="flex justify-evenly w-full">
                        <div className="flex flex-col flex-1">
                            <div className="rounded-2xl">
                                <div className="flex flex-col items-center">
                                    {/* manager's photo */}
                                    <img className="rounded-full w-28 h-28 shadow- shadow-green-500" src={ismailiaManager} alt="ismailia's manager" />
                                    <div>
                                        {/* vtc's score */}
                                        <div></div>
                                        {/* manager's detail */}
                                        <div></div>
                                    </div>
                                </div>
                                <div></div>
                                <div></div>
                            </div>
                            <button className="text-white">تحديد</button>
                        </div>
                        <div className="flex flex-col flex-1">
                            <div className="rounded-2xl">

                            </div>
                            <button className="text-white">تحديد</button>
                        </div><div className="flex flex-col flex-1">
                            <div className="rounded-2xl">

                            </div>
                            <button className="text-white">تحديد</button>
                        </div><div className="flex flex-col flex-1">
                            <div className="rounded-2xl">

                            </div>
                            <button className="text-white">تحديد</button>
                        </div><div className="flex flex-col flex-1">
                            <div className="rounded-2xl">

                            </div>
                            <button className="text-white">تحديد</button>
                        </div>
                    </div>
                </fieldset>
            </div>
        </>
    )
}

export default WatomsManagersReports;