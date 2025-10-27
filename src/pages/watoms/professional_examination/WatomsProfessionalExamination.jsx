// Components
import NewNavbar from "../../../components/NewNavbar";
// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartSimple, faFolderPlus, faPen, faPlus, faQrcode } from "@fortawesome/free-solid-svg-icons";
// Images
import application from '../../../assets/ksaApplication.jpg';
import person from '../../../assets/person.jpg';
import passport from '../../../assets/passport.jpg';
import { useNavigate } from "react-router-dom";

const WatomsProfessionalExamination = () => {
    const navigate = useNavigate();
    return (
        <>
            <NewNavbar
                shareStatus={false}
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
                        title="QRCode Scan"
                    >
                        <FontAwesomeIcon
                            icon={faPen}
                            className="text-xl text-watomsBlue"
                        />
                    </button>
                    <button
                        className="rounded-full w-10 h-10 flex justify-center items-center bg-white/80 hover:bg-gray-200 shadow transition-all"
                        title="QRCode Scan"
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
                    <div className="w-[90%] h-[12%] flex justify-center items-center text-yellow-400 text-sm text-center bg-gray-500 px-2 rounded-xl border-blue-600 border-2">ملفات تاكيد الهوية</div>
                    <button onClick={() => navigate('/watoms/pe/personal-test')} className="w-[90%] h-[12%] flex flex-col justify-center items-center text-yellow-400  text-sm text-center bg-[#0a183d] hover:bg-gray-500 px-2 rounded-xl border-blue-600 border-2">اختبار السمات الشخصية و السلوكية<p>OCEAN</p></button>
                    <button onClick={() => navigate('/watoms/pe/theoretical-test')} className="w-[90%] h-[12%] flex flex-col justify-center items-center text-yellow-400  text-sm text-center bg-[#0a183d] hover:bg-gray-500 px-2 rounded-xl border-blue-600 border-2">اختبار المعارف الفنية المتخصص <p>JCT</p></button>
                    <button onClick={() => navigate('/watoms/pe/practical-test')} className="w-[90%] h-[12%] flex flex-col justify-center items-center text-yellow-400  text-sm text-center bg-[#0a183d] hover:bg-gray-500 px-2 rounded-xl border-blue-600 border-2">اختبار المهارات الفنية المتخصصة<p>PST</p></button>
                    <button onClick={() => navigate('/watoms/pe/soft-test')} className="w-[90%] h-[12%] flex flex-col justify-center items-center text-yellow-400  text-sm text-center bg-[#0a183d] hover:bg-gray-500 px-2 rounded-xl border-blue-600 border-2">اختبار المهارات الوظيفية الناعمة<p>SJT</p></button>
                    <button onClick={() => navigate('/watoms/pe/cognitive-test')} className="w-[90%] h-[12%] flex flex-col justify-center items-center text-yellow-400  text-sm text-center bg-[#0a183d] hover:bg-gray-500 px-2 rounded-xl border-blue-600 border-2">اختبار القدرات المعرفية الاساسية<p>CAT</p></button>
                </div>
                {/* user's details */}
                <div className="w-[90%] flex justify-center items-center">
                    <div className="w-[95%] h-[95%] flex border-white border-2 rounded-xl">
                        {/* application and import documents */}
                        <div className="w-[35%] flex flex-col items-center gap-5 pt-6">
                            {/* application */}
                            <div className="w-[77%] border-white border-2 rounded-xl">
                                <img className="rounded-xl" src={application} alt="" />
                            </div>
                            {/* import documents */}
                            <div className="w-[77%] flex gap-2 text-white text-sm">
                                <div className="relative flex-1 flex justify-center items-center text-center hover:bg-gray-500 cursor-pointer border-white border-2 px-2 py-1 rounded-xl">
                                    <button className="absolute -top-2 -right-2 rounded-full w-5 h-5 flex justify-center items-center bg-white/80 hover:bg-gray-200 shadow transition-all" >
                                        <FontAwesomeIcon icon={faPlus} className="text-sm text-gray-500" />
                                    </button>
                                    صورة المتقدم مع البطاقة الشخصية
                                </div>
                                <div className="relative flex-1 flex justify-center items-center text-center hover:bg-gray-500 cursor-pointer border-white border-2 px-2 py-1 rounded-xl">
                                    <button className="absolute -top-2 -right-2 rounded-full w-5 h-5 flex justify-center items-center bg-white/80 hover:bg-gray-200 shadow transition-all" >
                                        <FontAwesomeIcon icon={faPlus} className="text-sm text-gray-500" />
                                    </button>
                                    صورة المتقدم مع الباسبور السفر
                                </div>
                                <div className="relative flex-1 flex justify-center items-center text-center hover:bg-gray-500 cursor-pointer border-white border-2 px-2 py-1 rounded-xl">
                                    <button className="absolute -top-2 -right-2 rounded-full w-5 h-5 flex justify-center items-center bg-white/80 hover:bg-gray-200 shadow transition-all" >
                                        <FontAwesomeIcon icon={faPlus} className="text-sm text-gray-500" />
                                    </button>
                                    صورة مع تذكرة الاختبار
                                </div>
                            </div>
                        </div>
                        {/* user's data and passport */}
                        <div className="w-[65%] flex flex-col items-center gap-4">
                            {/* user's data */}
                            <div className="w-full flex justify-center gap-2 mt-6">
                                <div className="w-[40%] flex flex-col gap-1">
                                    <div className="flex gap-1">
                                        <div className="w-3/5 text-center bg-white rounded border-white border-2">مركز الشرابية</div>
                                        <div className="w-2/5 text-center text-white rounded border-white border-2">مركز الاختبار</div>
                                    </div>
                                    <div className="flex gap-1">
                                        <div className="w-3/5 text-center bg-white rounded border-white border-2">تجارة (1)</div>
                                        <div className="w-2/5 text-center text-white rounded border-white border-2">الفئة</div>
                                    </div>
                                    <div className="flex gap-1">
                                        <div className="w-3/5 text-center bg-white rounded border-white border-2">74211</div>
                                        <div className="w-2/5 text-center text-white rounded border-white border-2">رقم الممتحن</div>
                                    </div>
                                    <div className="flex gap-1">
                                        <div className="w-3/5 text-center bg-white rounded border-white border-2">0110659889</div>
                                        <div className="w-2/5 text-center text-white rounded border-white border-2">رقم الموبيل</div>
                                    </div>
                                </div>
                                <div className="w-[40%] flex flex-col gap-1">
                                    <div className="flex gap-1">
                                        <div className="w-3/5 text-center bg-white rounded border-white border-2">محمد احمد سيد محمد</div>
                                        <div className="w-2/5 text-center text-white rounded border-white border-2">الاسم</div>
                                    </div>
                                    <div className="flex gap-1">
                                        <div className="w-3/5 text-center bg-white rounded border-white border-2">52841342967245</div>
                                        <div className="w-2/5 text-center text-white rounded border-white border-2">الرقم القومي</div>
                                    </div>
                                    <div className="flex gap-1">
                                        <div className="w-3/5 text-center bg-white rounded border-white border-2">284-87197187</div>
                                        <div className="w-2/5 text-center text-white rounded border-white border-2">رقم جواز السفر</div>
                                    </div>
                                    <div className="flex gap-1">
                                        <div className="w-3/5 text-center bg-white rounded border-white border-2">test@gmail.com</div>
                                        <div className="w-2/5 text-center text-white rounded border-white border-2">البريد الالكتروني</div>
                                    </div>
                                </div>
                                <div className="w-[19%] flex justify-center items-center">
                                    <img className="w-[75%] rounded-xl" src={person} alt="" />
                                </div>
                            </div>
                            <div className="w-full flex gap-2">
                                {/* passport */}
                                <img className="rounded-xl w-[73%]" src={passport} alt="" />
                                {/* dates */}
                                <div className="w-[25%] flex flex-col gap-4">
                                    <div className="flex flex-col gap-1">
                                        <div className="w-full text-center text-white rounded border-white border-2">الدولة المرشح لها المتقدم</div>
                                        <div className="w-full text-center bg-white rounded border-white border-2 py-2">السعودية</div>
                                    </div>
                                    <div className="w-full h-0 border-b-2 border-white" />
                                    <div className="flex flex-col gap-1">
                                        <div className="w-full text-center text-white rounded border-white border-2">توقيت اختبار النفسي</div>
                                        <div className="w-full text-center bg-white rounded border-white border-2 py-2">26-10-2025 19:46</div>
                                    </div>
                                    <div className="w-full h-0 border-b-2 border-white" />
                                    <div className="flex flex-col gap-1">
                                        <div className="w-full text-center text-white rounded border-white border-2">توقيت اختبار الشخصي</div>
                                        <div className="w-full text-center bg-white rounded border-white border-2 py-2">26-10-2025 19:46</div>
                                    </div>
                                    <div className="w-full h-0 border-b-2 border-white" />
                                    <div className="flex flex-col gap-1">
                                        <div className="w-full text-center text-white rounded border-white border-2">توقيت اختبار النظري</div>
                                        <div className="w-full text-center bg-white rounded border-white border-2 py-2">26-10-2025 19:46</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default WatomsProfessionalExamination;