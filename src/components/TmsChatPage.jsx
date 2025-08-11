import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faPaperclip, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { useLanguage } from "../context/LanguageContext";

const TmsChatPage = ({ onClose }) => {
    const { language } = useLanguage();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-3xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden animate-modal-in">
                <div className="bg-gradient-to-r from-watomsBlue to-wisdomOrange p-6 text-white">
                    <div className="flex items-center justify-between">
                        {language && <h2 className="text-3xl font-extrabold">Chat</h2>}
                        <button onClick={onClose} className="text-white hover:text-gray-200 text-2xl">
                            ×
                        </button>
                        {!language && <h2 className="text-3xl font-extrabold">محادثة</h2>}
                    </div>
                </div>
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                    <div className="bg-blue-500 h-96 rounded-lg px-16 gap-4 flex flex-col py-2 overflow-y-scroll">
                        <div className="bg-blue-700 text-white rounded-full p-2 w-fit max-w-[50%]">testing 1</div>
                        <div className="bg-white text-black rounded-full p-2 w-fit max-w-[50%] self-end">testing 2</div>
                        <button className="bg-white hover:bg-slate-500 hover:text-white text-black rounded-full p-2 w-fit max-w-[50%] self-end">testing 3 <FontAwesomeIcon icon={faDownload} /></button>
                        <div className="bg-blue-700 text-white rounded-full p-2 w-fit max-w-[50%] min-h-fit">asdfhbasdjkfnhasldbfnabldnabdfjnajkdnjhkladfadjkdbvadnsvjkndvasjhbsjkvsb</div>
                    </div>
                    <div className="flex justify-evenly mt-4">
                        <input type="text" className={`border-slate-400 border-2 rounded-full w-[80%] px-4 py-2 ${language ? "text-start" : "text-end"}`} placeholder={`${language ? "Type a message" : "ابدا المحادثة"}`} />
                        <button><FontAwesomeIcon icon={faPaperclip} /></button>
                        <button><FontAwesomeIcon icon={faPaperPlane} /></button>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default TmsChatPage;