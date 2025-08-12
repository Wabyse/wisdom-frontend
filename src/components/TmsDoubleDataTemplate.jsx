import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faEye } from "@fortawesome/free-solid-svg-icons";
import { downloadFileDms } from "../services/dms";
import { filterFileName } from "../utils/filterFileName";
import toast, { Toaster } from "react-hot-toast";

const BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL;

const TmsDoubleDataTemplate = ({ title, value, cardAdditionalCSS = "", valueAdditionalCSS = "", titleAdditionalCSS = "bg-gradient-to-b from-wisdomLighterOrange to-wisdomLightOrange" }) => {
    const openPDF = (fileName) => {
        if (fileName && fileName.toLowerCase().endsWith('.pdf')) {
            const pdfUrl = `${BASE_URL}/api/v1/files/open/${fileName}`;
            window.open(pdfUrl, "_blank"); // Opens PDF in new tab
        } else {
            toast.error('You can only open PDF files');
        }
    };
    const handleDownload2 = (path) => {
        try {
            // Ensure correct filename extraction for both windows and ubuntu
            const fileName = encodeURIComponent(path.replace(/\\/g, "/"));
            downloadFileDms(fileName, path);
        } catch (error) {
            console.error("Download error", error);
            alert("File download failed");
        }
    };
    return (
        <div className={cardAdditionalCSS}>
            <Toaster />
            <div className={`text-white text-center rounded p-2 ${titleAdditionalCSS}`}>
                {title}
            </div>
            {value === "------" ?
                <div className={`border-black p-2 border-2 rounded text-center font-bold mt-2 ${valueAdditionalCSS}`}>{value}</div> :
                <div className={`flex justify-evenly border-black py-2 border-2 rounded text-center font-bold mt-2 ${valueAdditionalCSS}`}>
                    <div className={`border-black border-2 w-[46%] h-full rounded overflow-hidden ${!value.sender && "flex justify-center items-center"}`}>{value.sender ?
                        <div className="h-full flex flex-col">
                            <div>file name:</div>
                            <div
                                className="truncate max-w-full"
                                title={filterFileName(value.sender)} // shows full name on hover
                            >
                                {filterFileName(value.sender)}
                            </div>

                            {/* Push buttons to bottom */}
                            <div className="flex justify-evenly mt-auto mb-2">
                                <button
                                    className="py-1 px-2 min-w-[5px] bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        openPDF(value.sender);
                                    }}
                                >
                                    <FontAwesomeIcon icon={faEye} />
                                </button>
                                <button
                                    className="py-1 px-2 min-w-[5px] bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition-colors"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDownload2(value.sender);
                                    }}
                                >
                                    <FontAwesomeIcon icon={faDownload} />
                                </button>
                            </div>
                        </div>
                        : "------"}</div>
                    <div className={`border-black border-2 w-[46%] h-full rounded overflow-hidden ${!value.reciever && "flex justify-center items-center"}`}>{value.reciever ?
                        <div className="h-full flex flex-col">
                            <div>file name:</div>
                            <div
                                className="truncate max-w-full"
                                title={filterFileName(value.reciever)}
                            >
                                {filterFileName(value.reciever)}
                            </div>

                            {/* Push buttons to bottom */}
                            <div className="flex justify-evenly mt-auto mb-2">
                                <button
                                    className="py-1 px-2 min-w-[5px] bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        openPDF(value.reciever);
                                    }}
                                >
                                    <FontAwesomeIcon icon={faEye} />
                                </button>
                                <button
                                    className="py-1 px-2 min-w-[5px] bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition-colors"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDownload2(value.reciever);
                                    }}
                                >
                                    <FontAwesomeIcon icon={faDownload} />
                                </button>
                            </div>
                        </div>
                        : "------"}</div>
                </div>}
        </div>
    )
}

export default TmsDoubleDataTemplate;