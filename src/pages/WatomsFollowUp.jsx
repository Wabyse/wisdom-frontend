import NewNavbar from "../components/NewNavbar";
import video1 from "../assets/followupvideo1.mp4";
import video2 from "../assets/followupvideo2.mp4";
import video3 from "../assets/followupvideo3.mp4";
import video4 from "../assets/followupvideo4.mp4";
import video5 from "../assets/followupvideo5.mp4";
import video6 from "../assets/followupvideo6.mp4";
import video7 from "../assets/followupvideo7.mp4";
import video8 from "../assets/followupvideo8.mp4";
import video9 from "../assets/followupvideo9.mp4";
import video10 from "../assets/followupvideo10.mp4";
import video11 from "../assets/followupvideo11.mp4";
import video12 from "../assets/followupvideo12.mp4";
import video13 from "../assets/followupvideo13.mp4";
import ebdaeduLogo from '../assets/ebad-edu.png';
import molLogo from "../assets/Gov.png";

const WatomsFollowUp = () => {
    return (
        <>
            <NewNavbar
                shareStatus={false}
                dashboardStatus={true}
                searchStatus={false}
                ministerStatus={true}
                darkmodeStatus={false}
                fullScreenStatus={false}
            />
            <div className="w-full h-[88vh] bg-[#0a183d] flex flex-col items-center gap-6 py-4">
                <div className="flex flex-col justify-center items-center text-xl font-bold text-[#FBBF24] gap-2">
                    <div>EVOITS</div>
                    <div>مشروع تطوير مراكز التدريب المهني</div>
                </div>
                <fieldset className="flex flex-col border-2 border-gray-400 p-2 rounded-2xl shadow-white shadow-md min-h-[70vh] h-[70vh] w-[95%]">
                    <legend className="px-2 text-center font-bold text-white">تقارير المرور و المتابعة</legend>

                    {/* Video container */}
                    <div className="flex flex-row gap-4 overflow-x-auto w-full h-full p-2">
                        <video
                            src={video1}
                            controls
                            className="h-full max-h-[60vh] rounded-lg shadow-lg"
                        />
                        <video
                            src={video2}
                            controls
                            className="h-full max-h-[60vh] rounded-lg shadow-lg"
                        />
                        <video
                            src={video3}
                            controls
                            className="h-full max-h-[60vh] rounded-lg shadow-lg"
                        />
                        <video
                            src={video4}
                            controls
                            className="h-full max-h-[60vh] rounded-lg shadow-lg"
                        />
                        <video
                            src={video5}
                            controls
                            className="h-full max-h-[60vh] rounded-lg shadow-lg"
                        />
                        <video
                            src={video6}
                            controls
                            className="h-full max-h-[60vh] rounded-lg shadow-lg"
                        />
                        <video
                            src={video7}
                            controls
                            className="h-full max-h-[60vh] rounded-lg shadow-lg"
                        />
                        <video
                            src={video8}
                            controls
                            className="h-full max-h-[60vh] rounded-lg shadow-lg"
                        />
                        <video
                            src={video9}
                            controls
                            className="h-full max-h-[60vh] rounded-lg shadow-lg"
                        />
                        <video
                            src={video10}
                            controls
                            className="h-full max-h-[60vh] rounded-lg shadow-lg"
                        />
                        <video
                            src={video11}
                            controls
                            className="h-full max-h-[60vh] rounded-lg shadow-lg"
                        />
                        <video
                            src={video12}
                            controls
                            className="h-full max-h-[60vh] rounded-lg shadow-lg"
                        />
                        <video
                            src={video13}
                            controls
                            className="h-full max-h-[60vh] rounded-lg shadow-lg"
                        />
                    </div>
                </fieldset>
            </div>
        </>
    )
}

export default WatomsFollowUp;