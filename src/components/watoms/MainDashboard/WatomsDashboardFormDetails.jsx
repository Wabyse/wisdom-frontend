// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { roundNumber } from "../../../utils/roundNumber";
import { cairoDate } from "../../../utils/cairoDate";

const WatomsDashboardFormDetails = ({ isOpen, onClose, orgSubStandards, selectedFormCode, selectedOrg }) => {
    const [forms, setForms] = useState([])

    useEffect(() => {
        const filterAllRelatedForm = () => {
            const code = selectedFormCode.split("|")[1]?.trim();
            const filteredForm = orgSubStandards?.subData.filter(data => data.code === code)
            const filteredFormPerCode = filteredForm && filteredForm[0]?.scores.filter(data => data.code === selectedFormCode)
            setForms(filteredFormPerCode)
        }

        filterAllRelatedForm();
    }, [orgSubStandards, selectedFormCode])
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto p-4">
            <div className="bg-white rounded-lg w-fit max-w-6xl max-h-[84vh] overflow-y-auto flex flex-col justify-center items-center" style={{
                backgroundColor: "#2d3347"
            }}>
                {/* Navbar */}
                <div className="flex items-center justify-between px-6 py-2 w-full" style={{ backgroundColor: '#1e293b' }}>
                    <button onClick={onClose} className="hover:bg-gray-700 w-10 h-10 rounded-full flex justify-center items-center text-white">
                        <FontAwesomeIcon icon={faX} />
                    </button>
                    <div className='flex gap-4 justify-center items-center'>
                        <h1 className='text-xl'>{selectedOrg?.name || ""}</h1>
                        <div className='h-4 border-l-2 border-white w-0' />
                        <h1 className='text-xl'>{orgSubStandards?.name || ""}</h1>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-h-[500px] overflow-y-auto p-4 bg-gray-900 rounded-2xl shadow-lg">
                    {forms && forms.map((report, idx) => (
                        <div
                            key={idx}
                            className="bg-gray-800 hover:bg-gray-700 transition-all duration-200 rounded-xl p-4 mb-3 border border-gray-700 flex flex-col gap-3"
                        >
                            <div className="flex justify-between items-center gap-4">
                                <div className="flex items-center gap-1">
                                    <span className="text-sm text-gray-400">{cairoDate(report.formDate)}</span>
                                    <h3 className="text-lg font-semibold text-white">:التاريخ</h3>
                                </div>
                                <div className="flex gap-1">
                                    <h3 className="text-lg text-white">{report.assessorName}</h3>
                                    <h3 className="text-lg font-semibold text-white">:القائم بالتقييم</h3>
                                </div>
                            </div>
                            <div className="flex justify-end gap-1">
                                <h3 className="text-lg text-white">{report.ReportedData}</h3>
                                <h3 className="text-lg font-semibold text-white">:المقيم</h3>
                            </div>
                            <div className="flex justify-between text-sm text-gray-300">
                                <p className="flex gap-2">
                                    <span>{report.name}</span>
                                    <span className="font-semibold text-gray-200">:الاستمارة</span>
                                </p>
                                <p>
                                    <span className="text-emerald-400 font-semibold">
                                        {`${roundNumber(report.average_score * 100)}%`}
                                    </span>{" "}
                                    <span className="font-semibold text-gray-200">:التقييم</span>

                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default WatomsDashboardFormDetails;