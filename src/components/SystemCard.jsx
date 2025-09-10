import { useLanguage } from "../context/LanguageContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const SystemCard = ({ handleClick = () => { }, available = false, color = 'from-blue-500 to-blue-600', iconType = "img", icon = "", title = "", subtitle = "", redSubtitle = "", subtitle2 = "" }) => {
    const { language } = useLanguage();

    return (
        <div
            onClick={handleClick}
            className={`group cursor-pointer transform transition-all duration-300 hover:scale-105 ${!available ? 'opacity-60' : ''}`}
        >
            <div className={`bg-gradient-to-br ${color} min-h-48 flex justify-center items-center text-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 relative overflow-hidden`}>
                <div>
                    {/* Coming Soon Badge */}
                    {!available && (
                        <div className="absolute top-2 right-2 bg-yellow-500 text-black text-xs px-2 py-1 rounded-full font-bold">
                            {language ? 'Not Available' : 'غير متاح'}
                        </div>
                    )}

                    {/* layer to light background's color on hover */}
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    <div className="relative z-10">
                        {/* system's logo */}
                        {iconType === "img" ? < img src={icon} alt='' className='w-10 m-auto' /> : <div className="text-2xl text-center">
                            <FontAwesomeIcon icon={icon} />
                        </div>}
                        {/* system's title */}
                        <h3 className="text-lg font-bold mb-1 text-center">{title}</h3>
                        {/* system's description */}
                        <p className="text-xs opacity-90 mb-2 text-center">
                            {subtitle}
                            {redSubtitle && <span className='text-black inline-block'>{redSubtitle}</span>}
                            {subtitle2}
                        </p>

                        {/* System's status */}
                        <div className="mt-3 flex items-center justify-center gap-2">
                            {/* dot */}
                            <div className={`w-2 h-2 rounded-full ${available ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
                            {/* status */}
                            <span className="text-xs opacity-75">
                                {available ? (language ? 'Available' : 'متاح') : (language ? 'Not Available' : 'غير متاح')}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SystemCard;