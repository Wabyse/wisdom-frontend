// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartSimple, faFolderPlus, faPen, faPlus, faQrcode } from "@fortawesome/free-solid-svg-icons";
// libraries
import toast, { Toaster } from "react-hot-toast";
// Components
import NewNavbar from "../../../components/NewNavbar";
// tools
import { useNavigate } from "react-router-dom";
// Images
import person from '../../../assets/person.jpg';

const WatomsPETestsConfirmation = () => {
    const navigate = useNavigate();
    return (
        <>
            <Toaster />
            <NewNavbar
                shareStatus={false}
                darkmodeStatus={false}
            >
                <div className="flex gap-3">
                    <button
                        className="rounded-full w-10 h-10 flex justify-center items-center bg-white/80 hover:bg-gray-200 shadow transition-all"
                        title="QRCode Scan"
                    >
                        <FontAwesomeIcon
                            icon={faQrcode}
                            className="text-xl text-watomsBlue"
                        />
                    </button>
                    <button
                        className="rounded-full w-10 h-10 flex justify-center items-center bg-white/80 hover:bg-gray-200 shadow transition-all"
                        title="Edit Candidate's data"
                    >
                        <FontAwesomeIcon
                            icon={faPen}
                            className="text-xl text-watomsBlue"
                        />
                    </button>
                    <button
                        className="rounded-full w-10 h-10 flex justify-center items-center bg-white/80 hover:bg-gray-200 shadow transition-all"
                        title="Add New Candidate"
                    >
                        <FontAwesomeIcon
                            icon={faFolderPlus}
                            className="text-xl text-watomsBlue"
                        />
                    </button>
                    <button
                        className="rounded-full w-10 h-10 flex justify-center items-center bg-white/80 hover:bg-gray-200 shadow transition-all"
                        title="Dashboard"
                        onClick={() => navigate('/watoms/pe/dashboard')}
                    >
                        <FontAwesomeIcon
                            icon={faChartSimple}
                            className="text-xl text-watomsBlue"
                        />
                    </button>
                </div>
            </NewNavbar>
            <div className="w-full h-[88vh] flex bg-[#0a183d]">
                {/* left side bar navigator */}
                <div className="w-[10%] bg-white/55 flex flex-col justify-evenly items-center">
                    <div>اجراءات الحوكمة</div>
                    <button onClick={() => navigate('/watoms/pe')} className="w-[90%] h-[12%] flex justify-center items-center text-yellow-400 text-sm text-center bg-[#0a183d] hover:bg-gray-500 px-2 rounded-xl border-blue-600 border-2">ملفات تاكيد الهوية</button>
                    <div onClick={() => navigate('/watoms/pe/tests-confirmation')} className="w-[90%] h-[12%] flex flex-col justify-center items-center text-yellow-400  text-sm text-center bg-gray-500 px-2 rounded-xl border-blue-600 border-2">ملفات تاكيد الاختبارات</div>
                    <button onClick={() => navigate('/watoms/pe/practical-test')} className="w-[90%] h-[12%] flex flex-col justify-center items-center text-yellow-400  text-sm text-center bg-[#0a183d] hover:bg-gray-500 px-2 rounded-xl border-blue-600 border-2">تقييم مراقبين الجودة والحوكمة</button>
                    <button onClick={() => navigate('/watoms/pe/soft-test')} className="w-[90%] h-[12%] flex flex-col justify-center items-center text-yellow-400  text-sm text-center bg-[#0a183d] hover:bg-gray-500 px-2 rounded-xl border-blue-600 border-2">اختبارات المرشحين</button>
                    <button onClick={() => navigate('/watoms/pe/cognitive-test')} className="w-[90%] h-[12%] flex flex-col justify-center items-center text-yellow-400  text-sm text-center bg-[#0a183d] hover:bg-gray-500 px-2 rounded-xl border-blue-600 border-2">مؤشرات تحليل الأداء العام</button>
                </div>
                {/* user's details */}
                <div className="w-[90%] flex justify-center items-center">
                    <div className="w-[95%] h-[95%] flex flex-col justify-start border-white border-2 rounded-xl">
                        {/* user's info and import photos */}
                        <div className="w-full flex items-center gap-8 px-4 py-2 border-b-2 border-white text-white">
                            <div className="w-[15%] flex flex-col gap-1">
                                <div className="flex flex-col gap-1">
                                    <div className="w-full text-center text-white rounded border-white border-2">تقييم ملفات اثبات الاختبارات</div>
                                    <div className="w-full flex justify-center items-center text-center text-black bg-white rounded border-white border-2">10</div>
                                </div>
                            </div>
                            <div className="flex-1 flex flex-col gap-1">
                                <div className="flex gap-1">
                                    <div className="w-3/5 text-center text-black bg-white rounded border-white border-2">السعودية</div>
                                    <div className="w-2/5 text-center text-white rounded border-white border-2">الدولة</div>
                                </div>
                                <div className="flex gap-1">
                                    <div className="w-3/5 text-center text-black bg-white rounded border-white border-2">01090000000</div>
                                    <div className="w-2/5 text-center text-white rounded border-white border-2">رقم الهاتف</div>
                                </div>
                            </div>
                            <div className="flex-1 flex flex-col gap-1">
                                <div className="flex gap-1">
                                    <div className="w-3/5 text-center text-black bg-white rounded border-white border-2">مركز الشرابية</div>
                                    <div className="w-2/5 text-center text-white rounded border-white border-2">مركز الاختبار</div>
                                </div>
                                <div className="flex gap-1">
                                    <div className="w-3/5 text-center text-black bg-white rounded border-white border-2">تجارة (1)</div>
                                    <div className="w-2/5 text-center text-white rounded border-white border-2">الفئة</div>
                                </div>
                            </div>
                            <div className="flex-1 flex flex-col gap-1">
                                <div className="flex gap-1">
                                    <div className="w-3/5 text-center text-black bg-white rounded border-white border-2">محمد احمد سيد محمد</div>
                                    <div className="w-2/5 text-center text-white rounded border-white border-2">الاسم</div>
                                </div>
                                <div className="flex gap-1">
                                    <div className="w-3/5 text-center text-black bg-white rounded border-white border-2">74211</div>
                                    <div className="w-2/5 text-center text-white rounded border-white border-2">رقم الممتحن</div>
                                </div>
                            </div>
                            <div className="w-[8%] flex justify-center items-center">
                                <img className="w-full rounded-xl" src={person} alt="" />
                            </div>
                        </div>
                        {/* user's test details */}
                        <div className="w-full flex flex-col">
                            {/* practical test details */}
                            <div className="w-full flex flex-col text-white p-2 gap-3">
                                {/* test details */}
                                <div className="flex justify-end gap-4">
                                    <div className="w-[12%] border-white border-2 rounded px-2 flex justify-center items-center">الملاحظات</div>
                                    <div className="w-[7%] border-white border-2 rounded px-2 flex justify-center items-center">الامامية</div>
                                    <div className="w-[7%] border-white border-2 rounded px-2 flex justify-center items-center">الجانبية</div>
                                    <div className="w-[10%] border-white border-2 rounded px-2 flex justify-center items-center">مدة الاختبار</div>
                                    <div className="w-[10%] border-white border-2 rounded px-2 flex justify-center items-center">توقيت الانتهاء</div>
                                    <div className="w-[10%] border-white border-2 rounded px-2 flex justify-center items-center">توقيت البدء</div>
                                    <div className="w-[30%] border-white border-2 rounded px-2 flex justify-center items-center">اسم الاختبار</div>
                                    <div className="w-[5%] border-white border-2 rounded px-2 flex justify-center items-center">مسلسل</div>
                                </div>
                                <div className="flex justify-end gap-4">
                                    <div className="w-[12%] border-white border-2 rounded px-2 flex justify-center items-center">-----</div>
                                    <div className="w-[7%] px-2 flex justify-center items-center">
                                        <img className="max-w-full max-h-20 flex justify-center items-center" src={person} />
                                    </div>
                                    <div className="w-[7%] px-2 flex justify-center items-center">
                                        <img className="max-w-full max-h-20 flex justify-center items-center" src={person} />
                                    </div>
                                    <div className="w-[10%] border-white border-2 rounded px-2 flex justify-center items-center">60 د</div>
                                    <div className="w-[10%] border-white border-2 rounded px-2 flex justify-center items-center">11:00 am</div>
                                    <div className="w-[10%] border-white border-2 rounded px-2 flex justify-center items-center">10:00 am</div>
                                    <div className="w-[30%] text-yellow-400 border-white border-2 rounded px-2 flex justify-center items-center">الاختبار العملي</div>
                                    <div className="w-[5%] border-white border-2 rounded px-2 flex justify-center items-center">1</div>
                                </div>
                                <div className="w-full h-0 border-t-2 border-w" />
                                <div className="flex justify-end gap-4">
                                    <div className="w-[12%] border-white border-2 rounded px-2 flex justify-center items-center">-----</div>
                                    <div className="w-[7%] px-2 flex justify-center items-center">
                                        <img className="max-w-full max-h-20 flex justify-center items-center" src={person} />
                                    </div>
                                    <div className="w-[7%] px-2 flex justify-center items-center">
                                        <img className="max-w-full max-h-20 flex justify-center items-center" src={person} />
                                    </div>
                                    <div className="w-[10%] border-white border-2 rounded px-2 flex justify-center items-center">60 د</div>
                                    <div className="w-[10%] border-white border-2 rounded px-2 flex justify-center items-center">11:00 am</div>
                                    <div className="w-[10%] border-white border-2 rounded px-2 flex justify-center items-center">10:00 am</div>
                                    <div className="w-[30%] text-yellow-400 border-white border-2 rounded px-2 flex justify-center items-center">الاختبار النظري</div>
                                    <div className="w-[5%] border-white border-2 rounded px-2 flex justify-center items-center">2</div>
                                </div>
                                <div className="w-full h-0 border-t-2 border-w" />
                                <div className="flex justify-end gap-4">
                                    <div className="w-[12%] border-white border-2 rounded px-2 flex justify-center items-center">-----</div>
                                    <div className="w-[7%] px-2 flex justify-center items-center">
                                        <img className="max-w-full max-h-20 flex justify-center items-center" src={person} />
                                    </div>
                                    <div className="w-[7%] px-2 flex justify-center items-center">
                                        <img className="max-w-full max-h-20 flex justify-center items-center" src={person} />
                                    </div>
                                    <div className="w-[10%] border-white border-2 rounded px-2 flex justify-center items-center">60 د</div>
                                    <div className="w-[10%] border-white border-2 rounded px-2 flex justify-center items-center">11:00 am</div>
                                    <div className="w-[10%] border-white border-2 rounded px-2 flex justify-center items-center">10:00 am</div>
                                    <div className="w-[30%] text-yellow-400 border-white border-2 rounded px-2 flex justify-center items-center">الاختبار السمات و الكفاءة</div>
                                    <div className="w-[5%] border-white border-2 rounded px-2 flex justify-center items-center">3</div>
                                </div>
                                <div className="w-full h-0 border-t-2 border-w" />
                                <div className="flex justify-end gap-4">
                                    <div className="w-[12%] border-white border-2 rounded px-2 flex justify-center items-center">-----</div>
                                    <div className="w-[7%] px-2 flex justify-center items-center">
                                        <img className="max-w-full max-h-20 flex justify-center items-center" src={person} />
                                    </div>
                                    <div className="w-[7%] px-2 flex justify-center items-center">
                                        <img className="max-w-full max-h-20 flex justify-center items-center" src={person} />
                                    </div>
                                    <div className="w-[10%] border-white border-2 rounded px-2 flex justify-center items-center">60 د</div>
                                    <div className="w-[10%] border-white border-2 rounded px-2 flex justify-center items-center">11:00 am</div>
                                    <div className="w-[10%] border-white border-2 rounded px-2 flex justify-center items-center">10:00 am</div>
                                    <div className="w-[30%] text-yellow-400 border-white border-2 rounded px-2 flex justify-center items-center">تقييم الجودة و الحوكمة</div>
                                    <div className="w-[5%] border-white border-2 rounded px-2 flex justify-center items-center">4</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default WatomsPETestsConfirmation;