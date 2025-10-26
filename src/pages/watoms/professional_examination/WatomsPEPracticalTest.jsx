// Components
import NewNavbar from "../../../components/NewNavbar";
// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartSimple, faFolderPlus, faPen, faPlus, faQrcode } from "@fortawesome/free-solid-svg-icons";
// Images
import person from '../../../assets/person.jpg';
// tools
import { useNavigate } from "react-router-dom";

const WatomsPEPracticalTest = () => {
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
                    <button onClick={() => navigate('/watoms/pe')} className="w-[90%] h-[12%] flex justify-center items-center text-yellow-400 text-sm text-center bg-[#0a183d] hover:bg-gray-500 px-2 rounded-xl border-blue-600 border-2">ملفات تاكيد الهوية</button>
                    <button onClick={() => navigate('/watoms/pe/personal-test')} className="w-[90%] h-[12%] flex flex-col justify-center items-center text-yellow-400  text-sm text-center bg-[#0a183d] hover:bg-gray-500 px-2 rounded-xl border-blue-600 border-2">اختبار السمات الشخصية و السلوكية<p>OCEAN</p></button>
                    <button onClick={() => navigate('/watoms/pe/theoretical-test')} className="w-[90%] h-[12%] flex flex-col justify-center items-center text-yellow-400  text-sm text-center bg-[#0a183d] hover:bg-gray-500 px-2 rounded-xl border-blue-600 border-2">اختبار المعارف الفنية المتخصص <p>JCT</p></button>
                    <div className="w-[90%] h-[12%] flex flex-col justify-center items-center text-yellow-400  text-sm text-center bg-gray-500 px-2 rounded-xl border-blue-600 border-2">اختبار المهارات الفنية المتخصصة<p>PST</p></div>
                    <button onClick={() => navigate('/watoms/pe/soft-test')} className="w-[90%] h-[12%] flex flex-col justify-center items-center text-yellow-400  text-sm text-center bg-[#0a183d] hover:bg-gray-500 px-2 rounded-xl border-blue-600 border-2">اختبار المهارات الوظيفية الناعمة<p>SJT</p></button>
                    <button onClick={() => navigate('/watoms/pe/cognitive-test')} className="w-[90%] h-[12%] flex flex-col justify-center items-center text-yellow-400  text-sm text-center bg-[#0a183d] hover:bg-gray-500 px-2 rounded-xl border-blue-600 border-2">اختبار القدرات المعرفية الاساسية<p>CAT</p></button>
                </div>
                {/* user's personal test score */}
                <div className="w-[90%] flex justify-center items-center">
                    <div className="w-[95%] h-[95%] flex flex-col border-white border-2 rounded-xl">
                        {/* user's info and import photos */}
                        <div className="w-full flex items-center gap-10 px-4 py-2 border-b-2 border-white text-white">
                            <div className="relative w-[10%] flex justify-center items-center text-center hover:bg-gray-500 cursor-pointer border-white border-2 px-2 py-1 rounded-xl">
                                <button className="absolute -top-2 -left-2 rounded-full w-5 h-5 flex justify-center items-center bg-white/80 hover:bg-gray-200 shadow transition-all" >
                                    <FontAwesomeIcon icon={faPlus} className="text-sm text-gray-500" />
                                </button>
                                الصورة الامامية للمتقدم اثناء الاختبار
                            </div>
                            <div className="relative w-[10%] flex justify-center items-center text-center hover:bg-gray-500 cursor-pointer border-white border-2 px-2 py-1 rounded-xl">
                                <button className="absolute -top-2 -right-2 rounded-full w-5 h-5 flex justify-center items-center bg-white/80 hover:bg-gray-200 shadow transition-all" >
                                    <FontAwesomeIcon icon={faPlus} className="text-sm text-gray-500" />
                                </button>
                                الصورة الجانبية للمتقدم اثناء الاختبار
                            </div>
                            <div className="w-0 h-12 border-x-2 border-blue-500 rounded-full" />
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
                        <div className="w-full flex flex-col text-white">
                            {/* test details */}
                            <div className="flex justify-between p-3">
                                <div className="flex gap-2">
                                    <div className="border-white border-2 rounded px-2 flex justify-center items-center text-yellow-400">75%</div>
                                    <div className="border-white border-2 rounded px-2 flex justify-center items-center">اجمالي التقييم</div>
                                </div>
                                <div className="w-0 h-8 border-x-2 border-blue-500" />
                                <div className="flex gap-2">
                                    <div className="border-white border-2 rounded px-2 flex justify-center items-center">60 د</div>
                                    <div className="border-white border-2 rounded px-2 flex justify-center items-center">مدة الاختبار</div>
                                </div>
                                <div className="flex gap-2">
                                    <div className="border-white border-2 rounded px-2 flex justify-center items-center">11:00 am</div>
                                    <div className="border-white border-2 rounded px-2 flex justify-center items-center">توقيت الانتهاء</div>
                                </div>
                                <div className="flex gap-2">
                                    <div className="border-white border-2 rounded px-2 flex justify-center items-center">10:00 am</div>
                                    <div className="border-white border-2 rounded px-2 flex justify-center items-center">توقيت البدء</div>
                                </div>
                                <div className="w-0 h-8 border-x-2 border-blue-500" />
                                <div className="flex gap-2">
                                    <div className="border-white border-2 rounded px-2 flex justify-center items-center">د/ احمد حسن محمد فهمي</div>
                                    <div className="border-white border-2 rounded px-2 flex justify-center items-center">اسم المسؤل</div>
                                </div>
                            </div>
                            <div className="w-full my-4 flex justify-center gap-2">
                                <div className="flex justify-center items-center">
                                    (0 / 9)
                                </div>
                                <div className="text-yellow-400 font-bold text-center">
                                    (PST)
                                </div>
                                <div className="text-yellow-400 font-bold underline text-center">
                                    قياس كفاءة الاختبار العملي
                                </div>
                            </div>
                            {/* test score */}
                            <div className="w-full flex flex-col gap-2">
                                {/* title */}
                                <div className="w-full flex justify-center gap-2 pr-4">
                                    <div className="w-[22%] h-10 flex justify-center items-center bg-white rounded-xl text-black font-bold">
                                        ملاحظات
                                    </div>
                                    <div className="w-[10%] h-10 flex justify-center items-center bg-white rounded-xl text-black font-bold">
                                        التقييم
                                    </div>
                                    <div className="w-[60%] h-10 flex justify-center items-center bg-white rounded-xl text-black font-bold">السؤال</div>
                                    <div className="w-[4%] h-10 flex justify-center items-center bg-white rounded-xl text-black font-bold">م</div>
                                </div>
                                {/* scores */}
                                <div className="w-full h-[43vh] flex flex-col gap-2 overflow-y-scroll font-bold">
                                    <div className="w-full flex justify-center gap-2">
                                        <input type="text" className="w-[22%] flex justify-center items-center border-white border-2 bg-transparent text-end rounded-xl py-2" />
                                        <select
                                            name="score"
                                            defaultValue=""
                                            className="w-[10%] bg-transparent text-white border-2 border-white rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-white cursor-pointer"
                                            dir="rtl"
                                        >
                                            <option value="" selected disabled className="text-black">
                                                اختار نسبة
                                            </option>
                                            {[...Array(20)].map((_, i) => {
                                                const value = (i + 1) * 5;
                                                return (
                                                    <option key={value} value={value} className="text-black">
                                                        {value}
                                                    </option>
                                                );
                                            })}
                                        </select>
                                        <div className="w-[60%] flex justify-center items-center border-white border-2 rounded-xl py-2">مدي انضباط المتقدم بالتوقيتات</div>
                                        <div className="w-[4%] flex justify-center items-center border-white border-2 rounded-xl py-2">1</div>
                                    </div>
                                    <div className="w-full flex justify-center gap-2">
                                        <input type="text" className="w-[22%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2" />
                                        <select
                                            name="score"
                                            defaultValue=""
                                            className="w-[10%] bg-transparent text-white border-2 border-white rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-white cursor-pointer"
                                            dir="rtl"
                                        >
                                            <option value="" selected disabled className="text-black">
                                                اختار نسبة
                                            </option>
                                            {[...Array(20)].map((_, i) => {
                                                const value = (i + 1) * 5;
                                                return (
                                                    <option key={value} value={value} className="text-black">
                                                        {value}
                                                    </option>
                                                );
                                            })}
                                        </select>
                                        <div className="w-[60%] flex justify-center items-center border-white border-2 rounded-xl py-2">مدي التزام المتقدم بالتعليمات والتوجيهات</div>
                                        <div className="w-[4%] flex justify-center items-center border-white border-2 rounded-xl py-2">2</div>
                                    </div>
                                    <div className="w-full flex justify-center gap-2">
                                        <input type="text" className="w-[22%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2" />
                                        <select
                                            name="score"
                                            defaultValue=""
                                            className="w-[10%] bg-transparent text-white border-2 border-white rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-white cursor-pointer"
                                            dir="rtl"
                                        >
                                            <option value="" selected disabled className="text-black">
                                                اختار نسبة
                                            </option>
                                            {[...Array(20)].map((_, i) => {
                                                const value = (i + 1) * 5;
                                                return (
                                                    <option key={value} value={value} className="text-black">
                                                        {value}
                                                    </option>
                                                );
                                            })}
                                        </select>
                                        <div className="w-[60%] flex justify-center items-center border-white border-2 rounded-xl py-2">مدي التزام المراقب بعدم التدخل مع المتقدم أثناء الاختبار العملي</div>
                                        <div className="w-[4%] flex justify-center items-center border-white border-2 rounded-xl py-2">3</div>
                                    </div>
                                    <div className="w-full flex justify-center gap-2">
                                        <input type="text" className="w-[22%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2" />
                                        <select
                                            name="score"
                                            defaultValue=""
                                            className="w-[10%] bg-transparent text-white border-2 border-white rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-white cursor-pointer"
                                            dir="rtl"
                                        >
                                            <option value="" selected disabled className="text-black">
                                                اختار نسبة
                                            </option>
                                            {[...Array(20)].map((_, i) => {
                                                const value = (i + 1) * 5;
                                                return (
                                                    <option key={value} value={value} className="text-black">
                                                        {value}
                                                    </option>
                                                );
                                            })}
                                        </select>
                                        <div className="w-[60%] flex justify-center items-center border-white border-2 rounded-xl py-2">مدي رضاء المتقدم عن الاختبار العملي</div>
                                        <div className="w-[4%] flex justify-center items-center border-white border-2 rounded-xl py-2">4</div>
                                    </div>
                                    <div className="w-full flex justify-center gap-2">
                                        <input type="text" className="w-[22%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2" />
                                        <select
                                            name="score"
                                            defaultValue=""
                                            className="w-[10%] bg-transparent text-white border-2 border-white rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-white cursor-pointer"
                                            dir="rtl"
                                        >
                                            <option value="" selected disabled className="text-black">
                                                اختار نسبة
                                            </option>
                                            {[...Array(20)].map((_, i) => {
                                                const value = (i + 1) * 5;
                                                return (
                                                    <option key={value} value={value} className="text-black">
                                                        {value}
                                                    </option>
                                                );
                                            })}
                                        </select>
                                        <div className="w-[60%] flex justify-center items-center border-white border-2 rounded-xl py-2">⁠مدي رضاء المتقدم علي التعامل والاستقبال</div>
                                        <div className="w-[4%] flex justify-center items-center border-white border-2 rounded-xl py-2">5</div>
                                    </div>
                                    <div className="w-full flex justify-center gap-2">
                                        <input type="text" className="w-[22%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2" />
                                        <select
                                            name="score"
                                            defaultValue=""
                                            className="w-[10%] bg-transparent text-white border-2 border-white rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-white cursor-pointer"
                                            dir="rtl"
                                        >
                                            <option value="" selected disabled className="text-black">
                                                اختار نسبة
                                            </option>
                                            {[...Array(20)].map((_, i) => {
                                                const value = (i + 1) * 5;
                                                return (
                                                    <option key={value} value={value} className="text-black">
                                                        {value}
                                                    </option>
                                                );
                                            })}
                                        </select>
                                        <div className="w-[60%] flex justify-center items-center border-white border-2 rounded-xl py-2">مدي رضاء المتقدم عن تفهم التلقين قبل بدء الاختبار العملي</div>
                                        <div className="w-[4%] flex justify-center items-center border-white border-2 rounded-xl py-2">6</div>
                                    </div>
                                    <div className="w-full flex justify-center gap-2">
                                        <input type="text" className="w-[22%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2" />
                                        <select
                                            name="score"
                                            defaultValue=""
                                            className="w-[10%] bg-transparent text-white border-2 border-white rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-white cursor-pointer"
                                            dir="rtl"
                                        >
                                            <option value="" selected disabled className="text-black">
                                                اختار نسبة
                                            </option>
                                            {[...Array(20)].map((_, i) => {
                                                const value = (i + 1) * 5;
                                                return (
                                                    <option key={value} value={value} className="text-black">
                                                        {value}
                                                    </option>
                                                );
                                            })}
                                        </select>
                                        <div className="w-[60%] flex justify-center items-center border-white border-2 rounded-xl py-2">مدي رضاء المتقدم عن توفر وجاهزية الأجهزة والمعدات الأزمة للاختبار العملي</div>
                                        <div className="w-[4%] flex justify-center items-center border-white border-2 rounded-xl py-2">7</div>
                                    </div>
                                    <div className="w-full flex justify-center gap-2">
                                        <input type="text" className="w-[22%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2" />
                                        <select
                                            name="score"
                                            defaultValue=""
                                            className="w-[10%] bg-transparent text-white border-2 border-white rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-white cursor-pointer"
                                            dir="rtl"
                                        >
                                            <option value="" selected disabled className="text-black">
                                                اختار نسبة
                                            </option>
                                            {[...Array(20)].map((_, i) => {
                                                const value = (i + 1) * 5;
                                                return (
                                                    <option key={value} value={value} className="text-black">
                                                        {value}
                                                    </option>
                                                );
                                            })}
                                        </select>
                                        <div className="w-[60%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">مدي رضاء المتقدم علي المساواة في الإجراءات بين المتقدمين</div>
                                        <div className="w-[4%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">8</div>
                                    </div>
                                    <div className="w-full flex justify-center gap-2">
                                        <input type="text" className="w-[22%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2" />
                                        <select
                                            name="score"
                                            defaultValue=""
                                            className="w-[10%] bg-transparent text-white border-2 border-white rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-white cursor-pointer"
                                            dir="rtl"
                                        >
                                            <option value="" selected disabled className="text-black">
                                                اختار نسبة
                                            </option>
                                            {[...Array(20)].map((_, i) => {
                                                const value = (i + 1) * 5;
                                                return (
                                                    <option key={value} value={value} className="text-black">
                                                        {value}
                                                    </option>
                                                );
                                            })}
                                        </select>
                                        <div className="w-[60%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">تقييم المراقب للجودة عن عملية الاختبار العملي</div>
                                        <div className="w-[4%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">9</div>
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

export default WatomsPEPracticalTest;