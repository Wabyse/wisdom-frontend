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
import { useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { useParams } from "react-router-dom";

const relatedVideos = {
    4: [video7],
    5: [video12],
    7: [video1, video2, video5, video13],
    8: [video3, video4, video6, video8, video9, video10],
    9: [video11],
}

const WatomsFollowUp = () => {
    const { id } = useParams();
    const scrollRef = useRef(null);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const scrollAmount = 400; // adjust for how much you want to move
            scrollRef.current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth",
            });
        }
    };
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
                    <div className="relative w-full h-full">
                        {/* Left Arrow */}
                        <button
                            onClick={() => scroll("left")}
                            className="absolute w-10 h-10 flex justify-center items-center left-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 rounded-full shadow p-2 hover:bg-gray-200"
                        >
                            <FontAwesomeIcon icon={faChevronLeft} className="text-xl" />
                        </button>

                        {/* Scrollable Container */}
                        <div
                            ref={scrollRef}
                            className="flex flex-row gap-4 overflow-x-auto w-full h-full p-2 scroll-smooth no-scrollbar"
                        >
                            {relatedVideos[id].map(
                                (video, i) => (
                                    <video
                                        key={i}
                                        src={video}
                                        controls
                                        className="h-full max-h-[60vh] rounded-lg shadow-lg flex-shrink-0"
                                    />
                                )
                            )}
                        </div>

                        {/* Right Arrow */}
                        <button
                            onClick={() => scroll("right")}
                            className="absolute w-10 h-10 flex justify-center items-center right-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 rounded-full shadow p-2 hover:bg-gray-200"
                        >
                            <FontAwesomeIcon icon={faChevronRight} className="text-xl" />
                        </button>
                    </div>
                </fieldset>
            </div>
        </>
    )
}

export default WatomsFollowUp;