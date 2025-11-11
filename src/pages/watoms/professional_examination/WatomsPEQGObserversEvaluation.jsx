// Components
import NewNavbar from "../../../components/NewNavbar";
// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartSimple } from "@fortawesome/free-solid-svg-icons";
// Images
import person from '../../../assets/person.jpg';
import qrcodeButton from '../../../assets/qrcodeButtonImg.png';
import editButton from '../../../assets/editButtonImg.png';
import addButton from '../../../assets/addButtonImg.png';
// tools
import { useNavigate, useParams } from "react-router-dom";
import PeSideBarNavigation from "../../../components/watoms/professional_examination/PeSideBarNavigation";
import { useEffect, useState } from "react";
import { fetchCandidate, fetchEvaluationExam } from "../../../services/watoms/professionalExamination";
import { useAuth } from "../../../context/AuthContext";
import { fetchSchools } from "../../../services/data";
import QGObserverEvaluation from "../../../components/watoms/professional_examination/QGObserverEvauation";

const WatomsPEQGObserversEvaluation = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { userInfo } = useAuth();
    const [vtcs, setVtcs] = useState([]);
    const [candidate, setCandidate] = useState([]);
    const [evaluationQuestions, setEvaluationQuestions] = useState([]);
    const [evaluationAnswers, setEvaluationAnswers] = useState({});

    useEffect(() => {
        const loadOrgs = async () => {
            const response = await fetchSchools();
            const filteredOrgs = response.filter(org => org.id !== 12 && org.id !== 14 && org.id !== 1 && org.id !== 2);
            setVtcs(filteredOrgs)
        }

        const loadEvaluationQuestions = async () => {
            const response = await fetchEvaluationExam(5);
            setEvaluationQuestions(response);
        };

        loadOrgs();
        loadEvaluationQuestions();
    }, []);

    useEffect(() => {
        const loadCandidate = async () => {
            const response = await fetchCandidate(id);
            setCandidate(response);
        }

        loadCandidate();
    }, [id]);

    const handleEvaluationCountChange = (value) => {
        setEvaluationAnswers(value);
    };

    const evaluationAnsweredCount = Object.keys(evaluationAnswers).length;
    const progress = Math.round(((evaluationAnsweredCount) / (evaluationQuestions.length)) * 100);

    return (
        <>
            <NewNavbar
                shareStatus={false}
                darkmodeStatus={false}
                fullScreenStatus={false}
            >
                <div className="flex gap-3">
                    <button
                        className="rounded-full w-10 h-10 flex justify-center items-center bg-white/80 hover:bg-gray-200 shadow transition-all p-1"
                        title="QRCode Scan"
                    >
                        <img src={qrcodeButton} alt="qr code" />
                    </button>
                    <button
                        className="rounded-full w-10 h-10 flex justify-center items-center bg-white/80 hover:bg-gray-200 shadow transition-all p-2"
                        title="Edit Candidate's data"
                    >
                        <img src={editButton} alt="edit candidate" />
                    </button>
                    <button
                        className="rounded-full w-10 h-10 flex justify-center items-center bg-white/80 hover:bg-gray-200 shadow transition-all p-2"
                        title="Add New Candidate"
                    >
                        <img src={addButton} alt="add candidate" />
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
                <PeSideBarNavigation
                    currentPage={"qg-observer-evaluation"}
                    selectedCandidate={candidate}
                />
                {/* candidate's personal test score */}
                <div className="w-[90%] flex justify-center items-center">
                    <div className="w-[95%] h-[95%] flex flex-col border-white border-2 rounded-xl">
                        {/* user's info and import photos */}
                        <div className="w-full max-h-36 flex justify-center items-center gap-4 border-white border-b-2 pb-4">
                            <div className="w-[40%] flex flex-col gap-2">
                                <div className="w-full h-7 flex justify-center items-center text-center text-yellow-400 rounded">بيانات الممتحن</div>
                                <div className="w-full flex">
                                    <div className="w-3/4 flex flex-col gap-1">
                                        <div className="flex gap-1">
                                            <div className="w-3/5 h-7 flex justify-center items-center text-center bg-white rounded border-white border-2">{candidate?.name}</div>
                                            <div className="w-2/5 h-7 flex justify-center items-center text-center text-white rounded border-white border-2">الاسم</div>
                                        </div>
                                        <div className="flex gap-1">
                                            <div className="w-3/5 h-7 flex justify-center items-center text-center bg-white rounded border-white border-2">{candidate?.candidate_id}</div>
                                            <div className="w-2/5 h-7 flex justify-center items-center text-center text-white rounded border-white border-2">رقم الممتحن</div>
                                        </div>
                                        <div className="flex gap-1">
                                            <div className="w-3/5 h-7 flex justify-center items-center text-center bg-white rounded border-white border-2">{candidate?.recommended_country}</div>
                                            <div className="w-2/5 h-7 flex justify-center items-center text-center text-white rounded border-white border-2">الدولة</div>
                                        </div>
                                    </div>
                                    <div className="w-1/4 flex justify-center items-center">
                                        <img className="w-[70%] rounded-xl" src={person} alt="" />
                                    </div>
                                </div>
                            </div>
                            <div className="w-0 h-[90%] border-white border-l-2 mr-4" />
                            <div className="w-[40%] flex flex-col gap-2">
                                <div className="w-full h-7 flex justify-center items-center text-center text-yellow-400 rounded">بيانات المراقب</div>
                                <div className="w-full flex">
                                    <div className="w-3/4 flex flex-col gap-1">
                                        <div className="flex gap-1">
                                            <div className="w-3/5 h-7 flex justify-center items-center text-center bg-white rounded border-white border-2">{userInfo?.name}</div>
                                            <div className="w-2/5 h-7 flex justify-center items-center text-center text-white rounded border-white border-2">الاسم</div>
                                        </div>
                                        <div className="flex gap-1">
                                            <div className="w-3/5 h-7 flex justify-center items-center text-center bg-white rounded border-white border-2">{userInfo?.employee_role}</div>
                                            <div className="w-2/5 h-7 flex justify-center items-center text-center text-white rounded border-white border-2">الوظيفة</div>
                                        </div>
                                        <div className="flex gap-1">
                                            <div className="w-3/5 h-7 flex justify-center items-center text-center bg-white rounded border-white border-2">{vtcs.filter(vtc => vtc.id === Number(userInfo?.organization_id))[0]?.name || "غير تابع للمراكز"}</div>
                                            <div className="w-2/5 h-7 flex justify-center items-center text-center text-white rounded border-white border-2">مركز</div>
                                        </div>
                                    </div>
                                    <div className="w-1/4 flex justify-center items-center">
                                        <img className="w-[70%] rounded-xl" src={person} alt="" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* user's test details */}
                        <div className="w-full flex flex-col text-white gap-2 p-2">
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
                            {/* Progress Bar */}
                            <div className="w-full bg-gray-300 rounded-full h-8 relative flex items-center">
                                {/* Filled section */}
                                <div
                                    className="bg-blue-500 h-full rounded-full absolute left-0 top-0 transition-all duration-500"
                                    style={{ width: `${progress}%` }}
                                />

                                {/* Text layer (always visible) */}
                                <div className="relative z-10 flex justify-center items-center gap-2 w-full px-3 text-sm font-medium text-gray-800">
                                    <span>[{progress}%]</span>
                                    <span> - </span>
                                    <span>[{evaluationAnsweredCount} / {evaluationQuestions.length}]</span>
                                </div>
                            </div>
                            {/* test score */}
                            <QGObserverEvaluation
                                examQuestions={evaluationQuestions}
                                candidate={candidate}
                                onAnswersChange={handleEvaluationCountChange}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default WatomsPEQGObserversEvaluation;