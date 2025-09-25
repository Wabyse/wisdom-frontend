import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
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

const relatedVideos = {
    4: [video7],
    5: [video12],
    7: [video1, video2, video5, video13],
    8: [video3, video4, video6, video8, video9, video10],
    9: [video11],
}

const WatomsFollowUp = ({ id, onClose, name }) => {
    if (!relatedVideos[id]) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
            <div className="relative bg-[#0a1430] rounded-2xl shadow-xl w-[50%] max-w-5xl h-[80vh] p-4 flex flex-col">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-white bg-red-500 hover:bg-red-600 rounded-full w-8 h-8 flex items-center justify-center shadow"
                >
                    <FontAwesomeIcon icon={faTimes} />
                </button>

                {/* Title */}
                <div className="flex flex-col justify-center items-center text-xl font-bold text-[#FBBF24] mb-4">
                    <div>{name}</div>
                </div>

                {/* Video Container */}
                <fieldset className="flex-1 flex flex-col border-2 border-gray-400 p-2 rounded-2xl shadow-white shadow-md">
                    <legend className="px-2 text-center font-bold text-white">
                        تقارير المرور و المتابعة
                    </legend>

                    <div className="relative w-full h-full">
                        <div className="flex flex-col items-center gap-4 overflow-y-auto w-full max-h-[65vh] p-2 scroll-smooth">
                            {relatedVideos[id].map((video, i) => (
                                <>
                                    <video
                                        key={i}
                                        src={video}
                                        controls
                                        className="w-full max-h-[60vh] rounded-lg shadow-lg"
                                    />
                                    {relatedVideos.length - 1 !== i && <div className="w-[95%] h-0 border-t-4 rounded-full border-white mx-2 opacity-55" />}
                                </>
                            ))}
                        </div>
                    </div>
                </fieldset>
            </div>
        </div>
    );
};

export default WatomsFollowUp;