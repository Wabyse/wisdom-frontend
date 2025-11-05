// Components
import NewNavbar from "../../../components/NewNavbar";
// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartSimple, faX } from "@fortawesome/free-solid-svg-icons";
// Images
import addButton from '../../../assets/addButtonImg.png';
import editButton from '../../../assets/editButtonImg.png';
import qrcodeButton from '../../../assets/qrcodeButtonImg.png';
import person from '../../../assets/person.jpg';
// tools
import { useNavigate, useParams } from "react-router-dom";
// libraries
import toast, { Toaster } from "react-hot-toast";
// context
import { useAuth } from "../../../context/AuthContext";
import { useEffect, useState } from "react";
// APIs
import { fetchCurriculums, fetchSchools } from "../../../services/data";
import { fetchAllCandidates } from "../../../services/watoms/watomsData";
import { fetchCandidate, fetchExam } from "../../../services/watoms/professionalExamination";
import ObserverEvaluation from "../../../components/watoms/professional_examination/ObserverEvaluation";

const WatomsPEObserverEvaluation = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { userInfo } = useAuth();
    const [vtcs, setVtcs] = useState([]);
    const [courses, setCourses] = useState([]);
    const [candidate, setCandidate] = useState([]);
    const [evaluationQuestions, setEvaluationQuestions] = useState([]);
    const [evaluationAnswers, setEvaluationAnswers] = useState({});

    useEffect(() => {
        const loadOrgs = async () => {
            const response = await fetchSchools();
            const filteredOrgs = response.filter(org => org.id !== 12 && org.id !== 14 && org.id !== 1 && org.id !== 2);
            setVtcs(filteredOrgs)
        }

        const loadCurriculums = async () => {
            const response = await fetchCurriculums();
            const filteredCurriculums = response.filter(course => course.id !== 1 && course.id !== 2 && course.id !== 3 && course.id !== 13 && course.id !== 14 && course.id !== 15 && course.id !== 16 && course.id !== 17 && course.id !== 18 && course.id !== 48 && course.id !== 49 && course.id !== 50 && course.id !== 51 && course.id !== 53);
            setCourses(filteredCurriculums);
        }

        const loadEvaluationQuestions = async () => {
            const response = await fetchExam(4);
            setEvaluationQuestions(response);
        };

        loadOrgs();
        loadCurriculums();
        loadEvaluationQuestions();
    }, []);

    useEffect(() => {
        const loadCandidate = async () => {
            const response = await fetchCandidate(id);
            setCandidate(response);
        }

        loadCandidate();
    }, [id])

    const handleOceanCountChange = (value) => {
        setEvaluationAnswers(value);
    };

    // Calculate progress percentage
    const evaluationAnsweredCount = Object.keys(evaluationAnswers).length;
    const progress = Math.round(((evaluationAnsweredCount) / (evaluationQuestions.length)) * 100);

    return (
        <>
            <Toaster />
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
                <div className="w-[10%] bg-white/55 flex flex-col justify-evenly items-center">
                    <div>اجراءات الحوكمة</div>
                    <button onClick={() => navigate('/watoms/pe')} className="w-[90%] h-[12%] flex justify-center items-center text-yellow-400 text-sm text-center bg-[#0a183d] hover:bg-gray-500 px-2 rounded-xl border-blue-600 border-2">ملفات تاكيد الهوية</button>
                    <button onClick={() => navigate('/watoms/pe')} className="w-[90%] h-[12%] flex justify-center items-center text-yellow-400 text-sm text-center bg-[#0a183d] hover:bg-gray-500 px-2 rounded-xl border-blue-600 border-2">تقييم مسئول الجودة والحوكمة</button>
                    <div className="w-[90%] h-[12%] flex justify-center items-center text-yellow-400 text-sm text-center bg-gray-500 px-2 rounded-xl border-blue-600 border-2">تقييم مراقب الاختبار</div>
                    <button onClick={() => navigate('/watoms/pe')} className="w-[90%] h-[12%] flex justify-center items-center text-yellow-400 text-sm text-center bg-[#0a183d] hover:bg-gray-500 px-2 rounded-xl border-blue-600 border-2">اختبارات المرشحين</button>
                </div>
                {/* user's details */}
                <div className="w-[90%] flex justify-center items-center">
                    <div className="w-[95%] h-[95%] flex flex-col border-white border-2 rounded-xl p-2 gap-2">
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
                                            <div className="w-3/5 h-7 flex justify-center items-center text-center bg-white rounded border-white border-2">{vtcs.filter(vtc => vtc.id === Number(userInfo?.organization_id))[0]?.name}</div>
                                            <div className="w-2/5 h-7 flex justify-center items-center text-center text-white rounded border-white border-2">مركز</div>
                                        </div>
                                    </div>
                                    <div className="w-1/4 flex justify-center items-center">
                                        <img className="w-[70%] rounded-xl" src={person} alt="" />
                                    </div>
                                </div>
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
                        <ObserverEvaluation
                            examQuestions={evaluationQuestions}
                            candidate={candidate}
                            onAnswersChange={handleOceanCountChange}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export default WatomsPEObserverEvaluation;