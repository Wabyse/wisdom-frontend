import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { roundNumber } from '../utils/roundNumber';
import DonutChart from './DonutChart';
import { useRef } from "react";

const limit = 8;

const WatomsDashboardSubDataDetails = ({ isOpen, onClose, selectedMonthIdx, toggleMonth, selectedMonth, datasMonths, selectedOrg, orgSubStandards }) => {
    const scrollRef = useRef([]);

    const scroll = (direction) => {
        if (!scrollRef.current) return;
        const scrollAmount = 300;
        scrollRef.current.scrollBy({
            left: direction === "left" ? -scrollAmount : scrollAmount,
            behavior: "smooth",
        });
    };

    const totalCodes = orgSubStandards?.subData?.reduce(
        (sum, s) => sum + (s.codes?.length || 0),
        0
    );

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto p-4 top-16">
            <div className="bg-white rounded-lg w-fit max-w-6xl max-h-[84vh] overflow-y-auto flex flex-col justify-center items-center" style={{
                backgroundColor: "#2d3347"
            }}>
                {/* Navbar */}
                <div className="flex items-center justify-between px-6 py-2 w-full" style={{ backgroundColor: '#1e293b' }}>
                    <button onClick={onClose} className="hover:bg-gray-700 w-10 h-10 rounded-full flex justify-center items-center text-white">
                        <FontAwesomeIcon icon={faX} />
                    </button>
                    <div className='flex gap-4 justify-center items-center'>
                        <h1 className='text-xl'>{selectedOrg?.name}</h1>
                        <div className='h-4 border-l-2 border-white w-0' />
                        <h1 className='text-xl'>{orgSubStandards?.name}</h1>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex flex-col justify-center items-center w-full gap-2 p-2">
                    <div className='flex flex-col justify-center items-center w-full max-w-[1040px] rounded-2xl gap-6 p-4' style={{ backgroundColor: '#1e293b' }}>
                        <div className="flex items-center gap-4">
                            {selectedMonthIdx !== 0 ? (
                                <button
                                    onClick={() => toggleMonth(false)}
                                    style={{
                                        background: '#181f2e',
                                        color: '#0af',
                                        border: 'none',
                                        borderRadius: '50%',
                                        width: 36,
                                        height: 36,
                                        fontSize: 22,
                                        fontWeight: 900,
                                        cursor: 'pointer',
                                        boxShadow: '0 2px 8px #0006',
                                    }}
                                    title="الشهر السابق"
                                >
                                    &#8592;
                                </button>
                            ) : (
                                <div style={{ width: 36, height: 36 }} />
                            )}

                            <span
                                style={{
                                    color: '#fff',
                                    fontWeight: 700,
                                    fontSize: 15,
                                    minWidth: 80,
                                    textAlign: 'center',
                                    letterSpacing: 1,
                                }}
                            >
                                {selectedMonth?.month}
                            </span>

                            {selectedMonthIdx !== datasMonths.length - 1 ? (
                                <button
                                    onClick={() => toggleMonth(true)}
                                    style={{
                                        background: '#181f2e',
                                        color: '#0af',
                                        border: 'none',
                                        borderRadius: '50%',
                                        width: 36,
                                        height: 36,
                                        fontSize: 22,
                                        fontWeight: 900,
                                        cursor: 'pointer',
                                        boxShadow: '0 2px 8px #0006',
                                    }}
                                    title="الشهر التالي"
                                >
                                    &#8594;
                                </button>
                            ) : (
                                <div style={{ width: 36, height: 36 }} />
                            )}
                        </div>
                        <div className='flex w-full max-w-[700px] justify-center items-center gap-12'>
                            {/* Performance Bars */}
                            <div className="flex flex-col gap-1 my-2 w-full max-w-[500px]">
                                {orgSubStandards?.subData
                                    ?.slice()
                                    .sort((a, b) => b.score - a.score)
                                    .map((s) => (
                                        <div className='flex justify-between items-center mb-1 min-w-[500px]'>
                                            <span className="text-sm font-bold text-white w-1/6 px-1 min-w-1/6 max-w-1/6">{s.score}%</span>
                                            <div
                                                className="min-w-3/6 max-w-3/6 w-3/6"
                                                style={{
                                                    height: 22,
                                                    background: '#444652',
                                                    borderRadius: 18,
                                                    boxShadow: '0 2px 8px #0002',
                                                    position: 'relative',
                                                    overflow: 'hidden',
                                                    transition: 'box-shadow 0.2s ease',
                                                }}
                                            >
                                                {/* Bar fill */}
                                                <div
                                                    className="h-4 rounded-full"
                                                    style={{
                                                        height: '100%',
                                                        width: `${s.score}%`,
                                                        background: s.color,
                                                        transition: 'width 0.7s cubic-bezier(.4,2,.6,1)',
                                                    }}
                                                />
                                            </div>
                                            <span className="min-w-2/6 max-w-2/6 w-2/6 text-xs font-medium text-white text-end">{s.name}</span>
                                        </div>
                                    ))}
                            </div>
                            {/* Overall Score Circle */}
                            <div className="flex items-center justify-center gap-2">
                                <DonutChart value={orgSubStandards?.score || 0} size={100} color='url(#circularBlueGradient)' bg='#23263a' textColor='#fff' />
                            </div>
                        </div>
                    </div>
                    {/* data's and sub-data's section */}
                    <div className="flex justify-center items-center w-full rounded-2xl p-2 gap-2">
                        {/* Left Button */}
                        {totalCodes > limit && (
                            <button
                                onClick={() => scroll("left")}
                                className="bg-[#181f2e] text-[#0af] rounded-full w-9 h-9 shadow-md hover:bg-[#223] transition"
                            >
                                &#8592;
                            </button>
                        )}

                        {/* Scrollable Container */}
                        <div
                            ref={scrollRef}
                            className={`flex w-full items-center gap-2 ${totalCodes > limit ? "justify-start overflow-x-auto no-scrollbar" : "justify-center"}`}
                        >
                            {orgSubStandards?.subData?.map((s, i) => (
                                <div
                                    key={i}
                                    className="flex flex-col rounded-2xl justify-center items-center flex-shrink-0"
                                >
                                    {s.codes && s.codes.length > 0 && (
                                        <div className="flex w-full">
                                            <div
                                                className="flex flex-col w-full gap-1 rounded-2xl p-2 min-h-56"
                                                style={{ backgroundColor: "#3d4f6dff" }}
                                            >
                                                <h1 className="text-white text-center text-sm">{s.name}</h1>
                                                <div className="flex justify-center items-center w-full px-1 gap-2">
                                                    {s.codes.map((item, j) => (
                                                        <div
                                                            key={j}
                                                            className="flex flex-col justify-center items-center rounded-2xl p-2 gap-2 min-h-44 w-28 bg-[#1e293b] flex-shrink-0"
                                                        >
                                                            <h1 className="text-white text-center text-[9px] py-2 bg-sky-900 rounded-xl p-2 w-full min-h-[55px] flex justify-center items-center">
                                                                {item.name}
                                                            </h1>
                                                            <div className="bg-sky-900 w-full flex justify-center items-center p-2 rounded-xl">
                                                                <DonutChart
                                                                    value={roundNumber(item.average_score * 100) || 0}
                                                                    size={50}
                                                                    color="url(#circularBlueGradient)"
                                                                    bg="#23263a"
                                                                    textColor={item.average_score === 0 ? "#ff3232" : "#fff"}
                                                                />
                                                            </div>
                                                            <div className="bg-sky-900 rounded-xl py-2 w-full flex justify-center items-center gap-2 px-4">
                                                                <h1 className="min-w-fit text-[9px]">
                                                                    {s.scores.filter((f) => f.code === item.code).length}
                                                                </h1>
                                                                <div className="h-4 border-l-2 border-white w-0" />
                                                                <h1 className="min-w-fit text-[9px]">عدد التقييمات</h1>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Right Button */}
                        {totalCodes > limit && (
                            <button
                                onClick={() => scroll("right")}
                                className="bg-[#181f2e] text-[#0af] rounded-full w-9 h-9 shadow-md hover:bg-[#223] transition"
                            >
                                &#8594;
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WatomsDashboardSubDataDetails;