import { WATOMS_MODERN_COLORS_TW } from "../../constants/constants";
import { roundNumber } from "../../utils/roundNumber";

const CustomHorizontalBarChart = ({ data, title }) => {
    return (
        <div className="relative w-full h-fit max-h-full flex flex-col items-stretch bg-[#2d3347] rounded-2xl py-2 mb-0 overflow-hidden shadow-[0_2px_12px_#0004]" >
            <div className="relative text-[15px] text-[#facc15] text-center font-bold cursor-pointer tracking-[0.5px] transition-colors duration-200 ease-in-out"
                onMouseEnter={(e) => {
                    e.target.style.color = '#fbbf24';
                    e.target.style.textShadow = '0 2px 12px #000a, 0 0 8px #facc15';
                }}
                onMouseLeave={(e) => {
                    e.target.style.color = '#facc15';
                    e.target.style.textShadow = '0 2px 8px #000a, 0 0 4px #222';
                }}
            >
                {title}
            </div>
            <div className="min-h-[60px] max-h-[300px] flex flex-col justify-start overflow-y-auto overflow-x-hidden mt-[9px] z-[1]" >
                {data.map((singleData, idx) => (
                    <div
                        className="min-w-0 flex justify-between items-center hover:bg-gray-600 hover:bg-opacity-20 cursor-pointer px-6 py-[4px] mb-0 transition-opacity duration-200 ease-in-out rounded-[8px] origin-center"
                        key={singleData.id}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.02)';
                            e.currentTarget.style.opacity = '0.9';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.opacity = '1';
                        }}
                    >
                        <div className="min-w-[115px] max-w-[150px] text-[13px] text-[#fff] text-start font-black overflow-hidden mr-2 truncate transition-colors duration-200 ease-in-out" >
                            {singleData?.name}
                        </div>
                        <div className="relative flex-1 min-w-0 max-w-[140px] h-[20px] rounded-[18px] overflow-hidden transition-shadow duration-200 ease-in-out mx-2" >
                            <div className={`h-full w-[${Math.min(100, Math.max(0, roundNumber(((singleData?.performance / data[0]?.performance) * 100) || 0)))}%] ${WATOMS_MODERN_COLORS_TW[idx % WATOMS_MODERN_COLORS_TW.length]} rounded-[18px] transition-[width] duration-[700ms] ease-[cubic-bezier(.4,2,.6,1)]`} />
                        </div>
                        <div className="min-w-[38px] text-[17px] text-white text-end font-black transition-colors duration-200 ease-in-out mx-0" >
                            {roundNumber(singleData?.performance || 0) !== undefined ? roundNumber(singleData?.performance || 0) : 0}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default CustomHorizontalBarChart;