import { faArrowDown, faRotateRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const QRCodeScan = ({ isOpen, onClose, title }) => {
    if (!isOpen) return null;

    return (
        // Overlay (dark transparent background)
        <div className="fixed inset-0 bg-black/40 flex items-end justify-center z-50">
            {/* Popup container */}
            <div className="bg-white w-[595px] h-[595px] rounded-2xl shadow-lg relative flex flex-col justify-start items-center mb-4 p-2">
                {/* Close button */}
                <div className="w-full flex flex-col gap-2" >
                    <div className="w-full flex justify-between border-b-2 border-b-black pb-3">
                        <button
                            onClick={onClose}
                            className="text-start text-gray-500 hover:text-gray-800 text-3xl"
                        >
                            ×
                        </button>
                        <button className=" flex justify-center items-center gap-2 text-blue-600 hover:text-blue-800 rounded-2xl">اعادة المحاولة <FontAwesomeIcon icon={faRotateRight} /></button>
                        <button className=" flex justify-center items-center gap-2 text-green-600 hover:text-green-800 rounded-2xl">حفظ <FontAwesomeIcon icon={faArrowDown} /></button>
                        <h1 className="w-fit flex justify-center items-center text-end text-yellow-500 text-[18px] font-bold" >
                            {title} | 2025-11-10
                        </h1>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QRCodeScan;