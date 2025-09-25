import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import ebdaeduLogo from "../assets/ebad-edu.png";
import wabysLogo from "../assets/wabys.png";
import golLogo from "../assets/Gov.png";

const WatomsSecretReport = ({ id, onClose, name }) => {

    return (
        <div className="fixed inset-0 bg-black/60 flex justify-center gap-6 items-center z-50">
            <div className="relative bg-white w-[35%] max-w-5xl h-[95vh] p-4 flex flex-col">
                <div className="rounded-2xl border-black border-2 h-full flex flex-col items-center">
                    <div className="flex justify-between w-full p-2">
                        <div className="flex flex-col">
                            <img src={wabysLogo} className="w-14" alt="wabys logo" />
                            <img src={ebdaeduLogo} className="w-14" alt="ebda edu logo" />
                        </div>
                        <div className="flex flex-col items-center gap-2 text-xs font-bold">
                            <h1 className="text-red-600 border-b-2 border-red-600">سري و شخصي</h1>
                            <h1 className="border-b-2 border-black">تقرير التقييم العام لمديري مركز التدريب المهني</h1>
                            <h1 className="border-b-2 border-black">عن شهر سبتمبر 2025</h1>
                        </div>
                        <img src={golLogo} className="w-14 h-14" alt="gol logo" />
                    </div>
                </div>
            </div>
            <div className="relative bg-white w-[35%] max-w-5xl h-[95vh] p-4 flex flex-col">
                <div className="rounded-2xl border-black border-2 h-full flex flex-col items-center">
                    <div className="flex justify-between w-full p-2">
                        <div className="flex flex-col">
                        <img src={wabysLogo} className="w-14" alt="wabys logo" />
                        <img src={ebdaeduLogo} className="w-14" alt="ebda edu logo" />
                        </div>
                        <div className="flex flex-col items-center gap-2 text-xs font-bold">
                            <h1 className="text-red-600 border-b-2 border-red-600">سري و شخصي</h1>
                            <h1 className="border-b-2 border-black">تقرير التقييم العام لمديري مراكز التدريب المهني</h1>
                            <h1 className="border-b-2 border-black">عن شهر سبتمبر 2025</h1>
                        </div>
                        <img src={golLogo} className="w-14 h-14" alt="gol logo" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WatomsSecretReport;