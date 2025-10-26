// Components
import NewNavbar from "../../../components/NewNavbar";
// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartSimple, faFolderPlus, faPen, faPlus, faQrcode } from "@fortawesome/free-solid-svg-icons";
// Images
import person from '../../../assets/person.jpg';
import score from '../../../assets/score.jpg';
// tools
import { useNavigate } from "react-router-dom";

const WatomsPEPersonalTest = () => {
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
                    <div className="w-[90%] h-[12%] flex flex-col justify-center items-center text-yellow-400  text-sm text-center bg-gray-500 px-2 rounded-xl border-blue-600 border-2">اختبار السمات الشخصية و السلوكية<p>OCEAN</p></div>
                    <button onClick={() => navigate('/watoms/pe/theoretical-test')} className="w-[90%] h-[12%] flex flex-col justify-center items-center text-yellow-400  text-sm text-center bg-[#0a183d] hover:bg-gray-500 px-2 rounded-xl border-blue-600 border-2">اختبار المعارف الفنية المتخصص <p>JCT</p></button>
                    <button onClick={() => navigate('/watoms/pe/practical-test')} className="w-[90%] h-[12%] flex flex-col justify-center items-center text-yellow-400  text-sm text-center bg-[#0a183d] hover:bg-gray-500 px-2 rounded-xl border-blue-600 border-2">اختبار المهارات الفنية المتخصصة<p>PST</p></button>
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
                            {/* title and count answered scores */}
                            <div className="w-full my-4 flex justify-center gap-2">
                                <div className="flex justify-center items-center">
                                    (0 / 50)
                                </div>
                                <div className="text-yellow-400 font-bold text-center">
                                    (OCEAN)
                                </div>
                                <div className="text-yellow-400 font-bold underline text-center">
                                    قياس كفاءة اختبار السمات الشخصية
                                </div>
                            </div>
                            {/* test score */}
                            <div className="w-full flex flex-col gap-2">
                                {/* title */}
                                <div className="w-full flex justify-center gap-2 pr-3">
                                    <div className="w-[17%] flex text-black font-bold gap-3 bg-white rounded-xl justify-center items-center">
                                        ملاحظات
                                    </div>
                                    <div className="w-[25%] flex flex-col bg-white rounded-xl text-black font-bold">
                                        <img className="rounded-t-xl" src={score} alt="" />
                                        <div className="flex justify-evenly">
                                            <h1>1</h1>
                                            <h1>2</h1>
                                            <h1>3</h1>
                                            <h1>4</h1>
                                            <h1>5</h1>
                                        </div>
                                    </div>
                                    <div className="w-[50%] flex justify-center items-center bg-white rounded-xl text-black font-bold">السؤال</div>
                                    <div className="w-[4%] flex justify-center items-center bg-white rounded-xl text-black font-bold">م</div>
                                </div>
                                {/* scores */}
                                <div className="w-full h-[40vh] flex flex-col gap-2 overflow-y-scroll font-bold">
                                    <div className="w-full flex justify-center gap-2">
                                        <input type="text" className="w-[17%] flex justify-center items-center border-white border-2 bg-transparent text-end rounded-xl py-2" />
                                        <div className="w-[25%] flex justify-center items-center border-white border-2 rounded-xl py-2">
                                            <div className="w-full flex justify-evenly px-1">
                                                <input type="radio" name="1" value="1" />
                                                <input type="radio" name="1" value="2" />
                                                <input type="radio" name="1" value="3" />
                                                <input type="radio" name="1" value="4" />
                                                <input type="radio" name="1" value="5" />
                                            </div>
                                        </div>
                                        <div className="w-[50%] flex justify-center items-center border-white border-2 rounded-xl py-2">أنا منفتح على تعلّم أشياء جديدة ومعقدة</div>
                                        <div className="w-[4%] flex justify-center items-center border-white border-2 rounded-xl py-2">1</div>
                                    </div>
                                    <div className="w-full flex justify-center gap-2">
                                        <input type="text" className="w-[17%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2" />
                                        <div className="w-[25%] flex justify-center items-center border-white border-2 rounded-xl py-2">
                                            <div className="w-full flex justify-evenly px-1">
                                                <input type="radio" name="2" value="1" />
                                                <input type="radio" name="2" value="2" />
                                                <input type="radio" name="2" value="3" />
                                                <input type="radio" name="2" value="4" />
                                                <input type="radio" name="2" value="5" />
                                            </div>
                                        </div>
                                        <div className="w-[50%] flex justify-center items-center border-white border-2 rounded-xl py-2">أؤدي مهامي بتفانٍ وحرص على أدق التفاصيل</div>
                                        <div className="w-[4%] flex justify-center items-center border-white border-2 rounded-xl py-2">2</div>
                                    </div>
                                    <div className="w-full flex justify-center gap-2">
                                        <input type="text" className="w-[17%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2" />
                                        <div className="w-[25%] flex justify-center items-center border-white border-2 rounded-xl py-2">
                                            <div className="w-full flex justify-evenly px-1">
                                                <input type="radio" name="3" value="1" />
                                                <input type="radio" name="3" value="2" />
                                                <input type="radio" name="3" value="3" />
                                                <input type="radio" name="3" value="4" />
                                                <input type="radio" name="3" value="5" />
                                            </div>
                                        </div>
                                        <div className="w-[50%] flex justify-center items-center border-white border-2 rounded-xl py-2">أنا روح الحفل والجلسات الاجتماعية</div>
                                        <div className="w-[4%] flex justify-center items-center border-white border-2 rounded-xl py-2">3</div>
                                    </div>
                                    <div className="w-full flex justify-center gap-2">
                                        <input type="text" className="w-[17%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2" />
                                        <div className="w-[25%] flex justify-center items-center border-white border-2 rounded-xl py-2">
                                            <div className="w-full flex justify-evenly px-1">
                                                <input type="radio" name="4" value="1" />
                                                <input type="radio" name="4" value="2" />
                                                <input type="radio" name="4" value="3" />
                                                <input type="radio" name="4" value="4" />
                                                <input type="radio" name="4" value="5" />
                                            </div>
                                        </div>
                                        <div className="w-[50%] flex justify-center items-center border-white border-2 rounded-xl py-2">أشعر بقليل من الاهتمام تجاه مشاكل الآخرين (معكوسة)</div>
                                        <div className="w-[4%] flex justify-center items-center border-white border-2 rounded-xl py-2">4</div>
                                    </div>
                                    <div className="w-full flex justify-center gap-2">
                                        <input type="text" className="w-[17%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2" />
                                        <div className="w-[25%] flex justify-center items-center border-white border-2 rounded-xl py-2">
                                            <div className="w-full flex justify-evenly px-1">
                                                <input type="radio" name="5" value="1" />
                                                <input type="radio" name="5" value="2" />
                                                <input type="radio" name="5" value="3" />
                                                <input type="radio" name="5" value="4" />
                                                <input type="radio" name="5" value="5" />
                                            </div>
                                        </div>
                                        <div className="w-[50%] flex justify-center items-center border-white border-2 rounded-xl py-2">ينتابني القلق بسهولة حيال الأمور الصغيرة</div>
                                        <div className="w-[4%] flex justify-center items-center border-white border-2 rounded-xl py-2">5</div>
                                    </div>
                                    <div className="w-full flex justify-center gap-2">
                                        <input type="text" className="w-[17%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2" />
                                        <div className="w-[25%] flex justify-center items-center border-white border-2 rounded-xl py-2">
                                            <div className="w-full flex justify-evenly px-1">
                                                <input type="radio" name="6" value="1" />
                                                <input type="radio" name="6" value="2" />
                                                <input type="radio" name="6" value="3" />
                                                <input type="radio" name="6" value="4" />
                                                <input type="radio" name="6" value="5" />
                                            </div>
                                        </div>
                                        <div className="w-[50%] flex justify-center items-center border-white border-2 rounded-xl py-2">أحب قضاء الوقت في التفكير الفلسفي أو المجرد</div>
                                        <div className="w-[4%] flex justify-center items-center border-white border-2 rounded-xl py-2">6</div>
                                    </div>
                                    <div className="w-full flex justify-center gap-2">
                                        <input type="text" className="w-[17%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2" />
                                        <div className="w-[25%] flex justify-center items-center border-white border-2 rounded-xl py-2">
                                            <div className="w-full flex justify-evenly px-1">
                                                <input type="radio" name="7" value="1" />
                                                <input type="radio" name="7" value="2" />
                                                <input type="radio" name="7" value="3" />
                                                <input type="radio" name="7" value="4" />
                                                <input type="radio" name="7" value="5" />
                                            </div>
                                        </div>
                                        <div className="w-[50%] flex justify-center items-center border-white border-2 rounded-xl py-2">أترك الفوضى في مكان العمل أو البيت (معكوسة)</div>
                                        <div className="w-[4%] flex justify-center items-center border-white border-2 rounded-xl py-2">7</div>
                                    </div>
                                    <div className="w-full flex justify-center gap-2">
                                        <input type="text" className="w-[17%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2" />
                                        <div className="w-[25%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">
                                            <div className="w-full flex justify-evenly px-1">
                                                <input type="radio" name="8" value="1" />
                                                <input type="radio" name="8" value="2" />
                                                <input type="radio" name="8" value="3" />
                                                <input type="radio" name="8" value="4" />
                                                <input type="radio" name="8" value="5" />
                                            </div>
                                        </div>
                                        <div className="w-[50%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">أنا شخص هادئ ومتحفظ في العادة (معكوسة)</div>
                                        <div className="w-[4%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">8</div>
                                    </div>
                                    <div className="w-full flex justify-center gap-2">
                                        <input type="text" className="w-[17%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2" />
                                        <div className="w-[25%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">
                                            <div className="w-full flex justify-evenly px-1">
                                                <input type="radio" name="9" value="1" />
                                                <input type="radio" name="9" value="2" />
                                                <input type="radio" name="9" value="3" />
                                                <input type="radio" name="9" value="4" />
                                                <input type="radio" name="9" value="5" />
                                            </div>
                                        </div>
                                        <div className="w-[50%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">أتعاطف مع مشاعر الآخرين وأحاسيسهم</div>
                                        <div className="w-[4%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">9</div>
                                    </div>
                                    <div className="w-full flex justify-center gap-2">
                                        <input type="text" className="w-[17%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2" />
                                        <div className="w-[25%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">
                                            <div className="w-full flex justify-evenly px-1">
                                                <input type="radio" name="10" value="1" />
                                                <input type="radio" name="10" value="2" />
                                                <input type="radio" name="10" value="3" />
                                                <input type="radio" name="10" value="4" />
                                                <input type="radio" name="10" value="5" />
                                            </div>
                                        </div>
                                        <div className="w-[50%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">أكون مستقراً وهادئاً حتى تحت الضغط الشديد (معكوسة)</div>
                                        <div className="w-[4%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">10</div>
                                    </div>
                                    <div className="w-full flex justify-center gap-2">
                                        <input type="text" className="w-[17%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2" />
                                        <div className="w-[25%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">
                                            <div className="w-full flex justify-evenly px-1">
                                                <input type="radio" name="11" value="1" />
                                                <input type="radio" name="11" value="2" />
                                                <input type="radio" name="11" value="3" />
                                                <input type="radio" name="11" value="4" />
                                                <input type="radio" name="11" value="5" />
                                            </div>
                                        </div>
                                        <div className="w-[50%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">لدي مفردات غنية وأعبر عن نفسي بوضوح</div>
                                        <div className="w-[4%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">11</div>
                                    </div>
                                    <div className="w-full flex justify-center gap-2">
                                        <input type="text" className="w-[17%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2" />
                                        <div className="w-[25%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">
                                            <div className="w-full flex justify-evenly px-1">
                                                <input type="radio" name="12" value="1" />
                                                <input type="radio" name="12" value="2" />
                                                <input type="radio" name="12" value="3" />
                                                <input type="radio" name="12" value="4" />
                                                <input type="radio" name="12" value="5" />
                                            </div>
                                        </div>
                                        <div className="w-[50%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">أعمل بجدية حتى ينجز كل شيء بإتقان</div>
                                        <div className="w-[4%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">12</div>
                                    </div>
                                    <div className="w-full flex justify-center gap-2">
                                        <input type="text" className="w-[17%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2" />
                                        <div className="w-[25%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">
                                            <div className="w-full flex justify-evenly px-1">
                                                <input type="radio" name="13" value="1" />
                                                <input type="radio" name="13" value="2" />
                                                <input type="radio" name="13" value="3" />
                                                <input type="radio" name="13" value="4" />
                                                <input type="radio" name="13" value="5" />
                                            </div>
                                        </div>
                                        <div className="w-[50%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">أجد صعوبة في التعبير عن نفسي أمام الغرباء (معكوسة)</div>
                                        <div className="w-[4%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">13</div>
                                    </div>
                                    <div className="w-full flex justify-center gap-2">
                                        <input type="text" className="w-[17%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2" />
                                        <div className="w-[25%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">
                                            <div className="w-full flex justify-evenly px-1">
                                                <input type="radio" name="14" value="1" />
                                                <input type="radio" name="14" value="2" />
                                                <input type="radio" name="14" value="3" />
                                                <input type="radio" name="14" value="4" />
                                                <input type="radio" name="14" value="5" />
                                            </div>
                                        </div>
                                        <div className="w-[50%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">أهين الناس أو أسخر منهم في بعض الأحيان (معكوسة)</div>
                                        <div className="w-[4%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">14</div>
                                    </div>
                                    <div className="w-full flex justify-center gap-2">
                                        <input type="text" className="w-[17%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2" />
                                        <div className="w-[25%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">
                                            <div className="w-full flex justify-evenly px-1">
                                                <input type="radio" name="15" value="1" />
                                                <input type="radio" name="15" value="2" />
                                                <input type="radio" name="15" value="3" />
                                                <input type="radio" name="15" value="4" />
                                                <input type="radio" name="15" value="5" />
                                            </div>
                                        </div>
                                        <div className="w-[50%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">أكون عصبياً وأتوتر بسرعة</div>
                                        <div className="w-[4%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">15</div>
                                    </div>
                                    <div className="w-full flex justify-center gap-2">
                                        <input type="text" className="w-[17%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2" />
                                        <div className="w-[25%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">
                                            <div className="w-full flex justify-evenly px-1">
                                                <input type="radio" name="16" value="1" />
                                                <input type="radio" name="16" value="2" />
                                                <input type="radio" name="16" value="3" />
                                                <input type="radio" name="16" value="4" />
                                                <input type="radio" name="16" value="5" />
                                            </div>
                                        </div>
                                        <div className="w-[50%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">أُفضل الطرق البسيطة والمألوفة لعمل الأشياء بدلاً من الإبداع (معكوسة)</div>
                                        <div className="w-[4%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">16</div>
                                    </div>
                                    <div className="w-full flex justify-center gap-2">
                                        <input type="text" className="w-[17%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2" />
                                        <div className="w-[25%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">
                                            <div className="w-full flex justify-evenly px-1">
                                                <input type="radio" name="17" value="1" />
                                                <input type="radio" name="17" value="2" />
                                                <input type="radio" name="17" value="3" />
                                                <input type="radio" name="17" value="4" />
                                                <input type="radio" name="17" value="5" />
                                            </div>
                                        </div>
                                        <div className="w-[50%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">ألتزم بالمواعيد المحددة ولا أحب التسويف</div>
                                        <div className="w-[4%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">17</div>
                                    </div>
                                    <div className="w-full flex justify-center gap-2">
                                        <input type="text" className="w-[17%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2" />
                                        <div className="w-[25%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">
                                            <div className="w-full flex justify-evenly px-1">
                                                <input type="radio" name="18" value="1" />
                                                <input type="radio" name="18" value="2" />
                                                <input type="radio" name="18" value="3" />
                                                <input type="radio" name="18" value="4" />
                                                <input type="radio" name="18" value="5" />
                                            </div>
                                        </div>
                                        <div className="w-[50%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">أستمتع بالتفاعل والنشاط في الأماكن المزدحمة</div>
                                        <div className="w-[4%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">18</div>
                                    </div>
                                    <div className="w-full flex justify-center gap-2">
                                        <input type="text" className="w-[17%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2" />
                                        <div className="w-[25%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">
                                            <div className="w-full flex justify-evenly px-1">
                                                <input type="radio" name="19" value="1" />
                                                <input type="radio" name="19" value="2" />
                                                <input type="radio" name="19" value="3" />
                                                <input type="radio" name="19" value="4" />
                                                <input type="radio" name="19" value="5" />
                                            </div>
                                        </div>
                                        <div className="w-[50%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">لدي قلب طيب وأميل إلى مساعدة المحتاجين</div>
                                        <div className="w-[4%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">19</div>
                                    </div>
                                    <div className="w-full flex justify-center gap-2">
                                        <input type="text" className="w-[17%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2" />
                                        <div className="w-[25%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">
                                            <div className="w-full flex justify-evenly px-1">
                                                <input type="radio" name="20" value="1" />
                                                <input type="radio" name="20" value="2" />
                                                <input type="radio" name="20" value="3" />
                                                <input type="radio" name="20" value="4" />
                                                <input type="radio" name="20" value="5" />
                                            </div>
                                        </div>
                                        <div className="w-[50%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">أشعر بالحزن أو الإحباط في كثير من الأوقات</div>
                                        <div className="w-[4%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">20</div>
                                    </div>
                                    <div className="w-full flex justify-center gap-2">
                                        <input type="text" className="w-[17%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2" />
                                        <div className="w-[25%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">
                                            <div className="w-full flex justify-evenly px-1">
                                                <input type="radio" name="21" value="1" />
                                                <input type="radio" name="21" value="2" />
                                                <input type="radio" name="21" value="3" />
                                                <input type="radio" name="21" value="4" />
                                                <input type="radio" name="21" value="5" />
                                            </div>
                                        </div>
                                        <div className="w-[50%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">لديّ خيال خصب وأفكار ممتازة</div>
                                        <div className="w-[4%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">21</div>
                                    </div>
                                    <div className="w-full flex justify-center gap-2">
                                        <input type="text" className="w-[17%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2" />
                                        <div className="w-[25%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">
                                            <div className="w-full flex justify-evenly px-1">
                                                <input type="radio" name="22" value="1" />
                                                <input type="radio" name="22" value="2" />
                                                <input type="radio" name="22" value="3" />
                                                <input type="radio" name="22" value="4" />
                                                <input type="radio" name="22" value="5" />
                                            </div>
                                        </div>
                                        <div className="w-[50%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">أتجنب المسؤوليات وأؤجل مهامي (معكوسة)</div>
                                        <div className="w-[4%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">22</div>
                                    </div>
                                    <div className="w-full flex justify-center gap-2">
                                        <input type="text" className="w-[17%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2" />
                                        <div className="w-[25%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">
                                            <div className="w-full flex justify-evenly px-1">
                                                <input type="radio" name="23" value="1" />
                                                <input type="radio" name="23" value="2" />
                                                <input type="radio" name="23" value="3" />
                                                <input type="radio" name="23" value="4" />
                                                <input type="radio" name="23" value="5" />
                                            </div>
                                        </div>
                                        <div className="w-[50%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">أبحث عن الإثارة وأكون مفعماً بالحماس</div>
                                        <div className="w-[4%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">23</div>
                                    </div>
                                    <div className="w-full flex justify-center gap-2">
                                        <input type="text" className="w-[17%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2" />
                                        <div className="w-[25%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">
                                            <div className="w-full flex justify-evenly px-1">
                                                <input type="radio" name="24" value="1" />
                                                <input type="radio" name="24" value="2" />
                                                <input type="radio" name="24" value="3" />
                                                <input type="radio" name="24" value="4" />
                                                <input type="radio" name="24" value="5" />
                                            </div>
                                        </div>
                                        <div className="w-[50%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">أميل إلى إثارة المشاكل والجدل مع الآخرين (معكوسة)</div>
                                        <div className="w-[4%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">24</div>
                                    </div>
                                    <div className="w-full flex justify-center gap-2">
                                        <input type="text" className="w-[17%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2" />
                                        <div className="w-[25%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">
                                            <div className="w-full flex justify-evenly px-1">
                                                <input type="radio" name="25" value="1" />
                                                <input type="radio" name="25" value="2" />
                                                <input type="radio" name="25" value="3" />
                                                <input type="radio" name="25" value="4" />
                                                <input type="radio" name="25" value="5" />
                                            </div>
                                        </div>
                                        <div className="w-[50%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">أنا شخص واثق من نفسي ولا أشكك في قدراتي (معكوسة)</div>
                                        <div className="w-[4%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">25</div>
                                    </div>
                                    <div className="w-full flex justify-center gap-2">
                                        <input type="text" className="w-[17%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2" />
                                        <div className="w-[25%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">
                                            <div className="w-full flex justify-evenly px-1">
                                                <input type="radio" name="26" value="1" />
                                                <input type="radio" name="26" value="2" />
                                                <input type="radio" name="26" value="3" />
                                                <input type="radio" name="26" value="4" />
                                                <input type="radio" name="26" value="5" />
                                            </div>
                                        </div>
                                        <div className="w-[50%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">أهتم بالجمال والفنون (مثل الموسيقى أو الشعر أو العمارة)</div>
                                        <div className="w-[4%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">26</div>
                                    </div>
                                    <div className="w-full flex justify-center gap-2">
                                        <input type="text" className="w-[17%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2" />
                                        <div className="w-[25%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">
                                            <div className="w-full flex justify-evenly px-1">
                                                <input type="radio" name="27" value="1" />
                                                <input type="radio" name="27" value="2" />
                                                <input type="radio" name="27" value="3" />
                                                <input type="radio" name="27" value="4" />
                                                <input type="radio" name="27" value="5" />
                                            </div>
                                        </div>
                                        <div className="w-[50%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">أنسى في الغالب إعادة الأشياء إلى أماكنها الصحيحة (معكوسة)</div>
                                        <div className="w-[4%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">27</div>
                                    </div>
                                    <div className="w-full flex justify-center gap-2">
                                        <input type="text" className="w-[17%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2" />
                                        <div className="w-[25%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">
                                            <div className="w-full flex justify-evenly px-1">
                                                <input type="radio" name="28" value="1" />
                                                <input type="radio" name="28" value="2" />
                                                <input type="radio" name="28" value="3" />
                                                <input type="radio" name="28" value="4" />
                                                <input type="radio" name="28" value="5" />
                                            </div>
                                        </div>
                                        <div className="w-[50%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">أحب أن أكون محور اهتمام الآخرين</div>
                                        <div className="w-[4%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">28</div>
                                    </div>
                                    <div className="w-full flex justify-center gap-2">
                                        <input type="text" className="w-[17%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2" />
                                        <div className="w-[25%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">
                                            <div className="w-full flex justify-evenly px-1">
                                                <input type="radio" name="29" value="1" />
                                                <input type="radio" name="29" value="2" />
                                                <input type="radio" name="29" value="3" />
                                                <input type="radio" name="29" value="4" />
                                                <input type="radio" name="29" value="5" />
                                            </div>
                                        </div>
                                        <div className="w-[50%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">أسامح الآخرين بسهولة ولا أحقد عليهم</div>
                                        <div className="w-[4%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">29</div>
                                    </div>
                                    <div className="w-full flex justify-center gap-2">
                                        <input type="text" className="w-[17%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2" />
                                        <div className="w-[25%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">
                                            <div className="w-full flex justify-evenly px-1">
                                                <input type="radio" name="30" value="1" />
                                                <input type="radio" name="30" value="2" />
                                                <input type="radio" name="30" value="3" />
                                                <input type="radio" name="30" value="4" />
                                                <input type="radio" name="30" value="5" />
                                            </div>
                                        </div>
                                        <div className="w-[50%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">أضطرب بسهولة بسبب التفاصيل غير المهمة</div>
                                        <div className="w-[4%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">30</div>
                                    </div>
                                    <div className="w-full flex justify-center gap-2">
                                        <input type="text" className="w-[17%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2" />
                                        <div className="w-[25%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">
                                            <div className="w-full flex justify-evenly px-1">
                                                <input type="radio" name="31" value="1" />
                                                <input type="radio" name="31" value="2" />
                                                <input type="radio" name="31" value="3" />
                                                <input type="radio" name="31" value="4" />
                                                <input type="radio" name="31" value="5" />
                                            </div>
                                        </div>
                                        <div className="w-[50%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">أنا شخص غير تقليدي وأحب الانفتاح على التجارب الجديدة</div>
                                        <div className="w-[4%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">31</div>
                                    </div>
                                    <div className="w-full flex justify-center gap-2">
                                        <input type="text" className="w-[17%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2" />
                                        <div className="w-[25%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">
                                            <div className="w-full flex justify-evenly px-1">
                                                <input type="radio" name="32" value="1" />
                                                <input type="radio" name="32" value="2" />
                                                <input type="radio" name="32" value="3" />
                                                <input type="radio" name="32" value="4" />
                                                <input type="radio" name="32" value="5" />
                                            </div>
                                        </div>
                                        <div className="w-[50%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">أنا منضبط ذاتياً وأتحكم في دوافعي</div>
                                        <div className="w-[4%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">32</div>
                                    </div>
                                    <div className="w-full flex justify-center gap-2">
                                        <input type="text" className="w-[17%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2" />
                                        <div className="w-[25%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">
                                            <div className="w-full flex justify-evenly px-1">
                                                <input type="radio" name="33" value="1" />
                                                <input type="radio" name="33" value="2" />
                                                <input type="radio" name="33" value="3" />
                                                <input type="radio" name="33" value="4" />
                                                <input type="radio" name="33" value="5" />
                                            </div>
                                        </div>
                                        <div className="w-[50%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">أفضل أن أكون وحيداً على أن أكون محاطاً بالناس (معكوسة)</div>
                                        <div className="w-[4%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">33</div>
                                    </div>
                                    <div className="w-full flex justify-center gap-2">
                                        <input type="text" className="w-[17%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2" />
                                        <div className="w-[25%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">
                                            <div className="w-full flex justify-evenly px-1">
                                                <input type="radio" name="34" value="1" />
                                                <input type="radio" name="34" value="2" />
                                                <input type="radio" name="34" value="3" />
                                                <input type="radio" name="34" value="4" />
                                                <input type="radio" name="34" value="5" />
                                            </div>
                                        </div>
                                        <div className="w-[50%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">أنا شخص متشكك وأصعب تصديقي للناس (معكوسة)</div>
                                        <div className="w-[4%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">34</div>
                                    </div>
                                    <div className="w-full flex justify-center gap-2">
                                        <input type="text" className="w-[17%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2" />
                                        <div className="w-[25%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">
                                            <div className="w-full flex justify-evenly px-1">
                                                <input type="radio" name="35" value="1" />
                                                <input type="radio" name="35" value="2" />
                                                <input type="radio" name="35" value="3" />
                                                <input type="radio" name="35" value="4" />
                                                <input type="radio" name="35" value="5" />
                                            </div>
                                        </div>
                                        <div className="w-[50%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">أشعر بالاستقرار العاطفي معظم الوقت (معكوسة)</div>
                                        <div className="w-[4%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">35</div>
                                    </div>
                                    <div className="w-full flex justify-center gap-2">
                                        <input type="text" className="w-[17%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2" />
                                        <div className="w-[25%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">
                                            <div className="w-full flex justify-evenly px-1">
                                                <input type="radio" name="36" value="1" />
                                                <input type="radio" name="36" value="2" />
                                                <input type="radio" name="36" value="3" />
                                                <input type="radio" name="36" value="4" />
                                                <input type="radio" name="36" value="5" />
                                            </div>
                                        </div>
                                        <div className="w-[50%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">لا أهتم بالعلوم أو الفن أو الثقافة (معكوسة)</div>
                                        <div className="w-[4%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">36</div>
                                    </div>
                                    <div className="w-full flex justify-center gap-2">
                                        <input type="text" className="w-[17%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2" />
                                        <div className="w-[25%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">
                                            <div className="w-full flex justify-evenly px-1">
                                                <input type="radio" name="37" value="1" />
                                                <input type="radio" name="37" value="2" />
                                                <input type="radio" name="37" value="3" />
                                                <input type="radio" name="37" value="4" />
                                                <input type="radio" name="37" value="5" />
                                            </div>
                                        </div>
                                        <div className="w-[50%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">أنا دائماً مستعد لمواجهة أي مهمة صعبة</div>
                                        <div className="w-[4%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">37</div>
                                    </div>
                                    <div className="w-full flex justify-center gap-2">
                                        <input type="text" className="w-[17%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2" />
                                        <div className="w-[25%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">
                                            <div className="w-full flex justify-evenly px-1">
                                                <input type="radio" name="38" value="1" />
                                                <input type="radio" name="38" value="2" />
                                                <input type="radio" name="38" value="3" />
                                                <input type="radio" name="38" value="4" />
                                                <input type="radio" name="38" value="5" />
                                            </div>
                                        </div>
                                        <div className="w-[50%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">أجد سهولة في كسب أصدقاء جدد</div>
                                        <div className="w-[4%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">38</div>
                                    </div>
                                    <div className="w-full flex justify-center gap-2">
                                        <input type="text" className="w-[17%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2" />
                                        <div className="w-[25%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">
                                            <div className="w-full flex justify-evenly px-1">
                                                <input type="radio" name="39" value="1" />
                                                <input type="radio" name="39" value="2" />
                                                <input type="radio" name="39" value="3" />
                                                <input type="radio" name="39" value="4" />
                                                <input type="radio" name="39" value="5" />
                                            </div>
                                        </div>
                                        <div className="w-[50%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">أنا شخص ودود وأتعامل بلطف مع الجميع</div>
                                        <div className="w-[4%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">39</div>
                                    </div>
                                    <div className="w-full flex justify-center gap-2">
                                        <input type="text" className="w-[17%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2" />
                                        <div className="w-[25%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">
                                            <div className="w-full flex justify-evenly px-1">
                                                <input type="radio" name="40" value="1" />
                                                <input type="radio" name="40" value="2" />
                                                <input type="radio" name="40" value="3" />
                                                <input type="radio" name="40" value="4" />
                                                <input type="radio" name="40" value="5" />
                                            </div>
                                        </div>
                                        <div className="w-[50%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">أشعر بالغضب أو الانفعال كثيرا</div>
                                        <div className="w-[4%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">40</div>
                                    </div>
                                    <div className="w-full flex justify-center gap-2">
                                        <input type="text" className="w-[17%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2" />
                                        <div className="w-[25%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">
                                            <div className="w-full flex justify-evenly px-1">
                                                <input type="radio" name="41" value="1" />
                                                <input type="radio" name="41" value="2" />
                                                <input type="radio" name="41" value="3" />
                                                <input type="radio" name="41" value="4" />
                                                <input type="radio" name="41" value="5" />
                                            </div>
                                        </div>
                                        <div className="w-[50%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">أستمتع بمناقشة الأفكار والقضايا العميقة</div>
                                        <div className="w-[4%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">41</div>
                                    </div>
                                    <div className="w-full flex justify-center gap-2">
                                        <input type="text" className="w-[17%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2" />
                                        <div className="w-[25%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">
                                            <div className="w-full flex justify-evenly px-1">
                                                <input type="radio" name="42" value="1" />
                                                <input type="radio" name="42" value="2" />
                                                <input type="radio" name="42" value="3" />
                                                <input type="radio" name="42" value="4" />
                                                <input type="radio" name="42" value="5" />
                                            </div>
                                        </div>
                                        <div className="w-[50%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">أتصرف بإهمال وأفتقر إلى الدقة في عملي (معكوسة)</div>
                                        <div className="w-[4%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">42</div>
                                    </div>
                                    <div className="w-full flex justify-center gap-2">
                                        <input type="text" className="w-[17%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2" />
                                        <div className="w-[25%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">
                                            <div className="w-full flex justify-evenly px-1">
                                                <input type="radio" name="43" value="1" />
                                                <input type="radio" name="43" value="2" />
                                                <input type="radio" name="43" value="3" />
                                                <input type="radio" name="43" value="4" />
                                                <input type="radio" name="43" value="5" />
                                            </div>
                                        </div>
                                        <div className="w-[50%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">أستمد طاقتي من التفاعلات الاجتماعية القوية</div>
                                        <div className="w-[4%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">43</div>
                                    </div>
                                    <div className="w-full flex justify-center gap-2">
                                        <input type="text" className="w-[17%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2" />
                                        <div className="w-[25%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">
                                            <div className="w-full flex justify-evenly px-1">
                                                <input type="radio" name="44" value="1" />
                                                <input type="radio" name="44" value="2" />
                                                <input type="radio" name="44" value="3" />
                                                <input type="radio" name="44" value="4" />
                                                <input type="radio" name="44" value="5" />
                                            </div>
                                        </div>
                                        <div className="w-[50%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">أرى الجانب المشرق في الناس وأثق بهم</div>
                                        <div className="w-[4%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">44</div>
                                    </div>
                                    <div className="w-full flex justify-center gap-2">
                                        <input type="text" className="w-[17%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2" />
                                        <div className="w-[25%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">
                                            <div className="w-full flex justify-evenly px-1">
                                                <input type="radio" name="45" value="1" />
                                                <input type="radio" name="45" value="2" />
                                                <input type="radio" name="45" value="3" />
                                                <input type="radio" name="45" value="4" />
                                                <input type="radio" name="45" value="5" />
                                            </div>
                                        </div>
                                        <div className="w-[50%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">أنا مكتئب في بعض الأوقات</div>
                                        <div className="w-[4%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">45</div>
                                    </div>
                                    <div className="w-full flex justify-center gap-2">
                                        <input type="text" className="w-[17%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2" />
                                        <div className="w-[25%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">
                                            <div className="w-full flex justify-evenly px-1">
                                                <input type="radio" name="46" value="1" />
                                                <input type="radio" name="46" value="2" />
                                                <input type="radio" name="46" value="3" />
                                                <input type="radio" name="46" value="4" />
                                                <input type="radio" name="46" value="5" />
                                            </div>
                                        </div>
                                        <div className="w-[50%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">أنا شخص حكيم ومدرك لذاتي وللعالم من حولي</div>
                                        <div className="w-[4%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">46</div>
                                    </div>
                                    <div className="w-full flex justify-center gap-2">
                                        <input type="text" className="w-[17%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2" />
                                        <div className="w-[25%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">
                                            <div className="w-full flex justify-evenly px-1">
                                                <input type="radio" name="47" value="1" />
                                                <input type="radio" name="47" value="2" />
                                                <input type="radio" name="47" value="3" />
                                                <input type="radio" name="47" value="4" />
                                                <input type="radio" name="47" value="5" />
                                            </div>
                                        </div>
                                        <div className="w-[50%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">أنا شخص منتظم وأحب أن أبقي كل شيء مرتبا</div>
                                        <div className="w-[4%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">47</div>
                                    </div>
                                    <div className="w-full flex justify-center gap-2">
                                        <input type="text" className="w-[17%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2" />
                                        <div className="w-[25%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">
                                            <div className="w-full flex justify-evenly px-1">
                                                <input type="radio" name="48" value="1" />
                                                <input type="radio" name="48" value="2" />
                                                <input type="radio" name="48" value="3" />
                                                <input type="radio" name="48" value="4" />
                                                <input type="radio" name="48" value="5" />
                                            </div>
                                        </div>
                                        <div className="w-[50%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">أنا حازم وواثق من نفسي في التعبير عن آرائي</div>
                                        <div className="w-[4%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">48</div>
                                    </div>
                                    <div className="w-full flex justify-center gap-2">
                                        <input type="text" className="w-[17%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2" />
                                        <div className="w-[25%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">
                                            <div className="w-full flex justify-evenly px-1">
                                                <input type="radio" name="49" value="1" />
                                                <input type="radio" name="49" value="2" />
                                                <input type="radio" name="49" value="3" />
                                                <input type="radio" name="49" value="4" />
                                                <input type="radio" name="49" value="5" />
                                            </div>
                                        </div>
                                        <div className="w-[50%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">أنا لا أعبأ كثيراً بمشاعر الآخرين (معكوسة)</div>
                                        <div className="w-[4%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">49</div>
                                    </div>
                                    <div className="w-full flex justify-center gap-2">
                                        <input type="text" className="w-[17%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2" />
                                        <div className="w-[25%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">
                                            <div className="w-full flex justify-evenly px-1">
                                                <input type="radio" name="50" value="1" />
                                                <input type="radio" name="50" value="2" />
                                                <input type="radio" name="50" value="3" />
                                                <input type="radio" name="50" value="4" />
                                                <input type="radio" name="50" value="5" />
                                            </div>
                                        </div>
                                        <div className="w-[50%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">نادراً ما أشعر بالضيق أو الخوف (معكوسة)</div>
                                        <div className="w-[4%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">50</div>
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

export default WatomsPEPersonalTest;