// Components
import NewNavbar from "../../../components/NewNavbar";
// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartSimple } from "@fortawesome/free-solid-svg-icons";
// Images
import person from '../../../assets/person.jpg';
import addButton from '../../../assets/addButtonImg.png';
import editButton from '../../../assets/editButtonImg.png';
import qrcodeButton from '../../../assets/qrcodeButtonImg.png';
// tools
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
// APIs
import { fetchAllExams, fetchCandidate, fetchExam, fetchForcedChoiceExam, fetchMCQExam } from "../../../services/watoms/professionalExamination";
import { fetchCurriculums, fetchSchools } from "../../../services/data";
import OceanExam from "../../../components/watoms/professional_examination/OceanExam";
import CatExam from "../../../components/watoms/professional_examination/CatExam";
import SjtExam from "../../../components/watoms/professional_examination/SjtExam";
import PeSideBarNavigation from "../../../components/watoms/professional_examination/PeSideBarNavigation";

const WatomsPECandidatesExam = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [examTitles, setExamsTitles] = useState([]);
    const [selectedExamTitle, setSelectedExamTitles] = useState(null);
    const [selectedExamId, setSelectedExamId] = useState(1);
    const [oceanExamQuestions, setOceanExamQuestions] = useState([]);
    const [catExamQuestions, setCatExamQuestions] = useState([]);
    const [sjtExamQuestions, setSjtExamQuestions] = useState([]);
    const [candidate, setCandidate] = useState(null);
    const [vtcs, setVtcs] = useState([]);
    const [courses, setCourses] = useState([]);
    const [oceanAnswers, setOceanAnswers] = useState({});
    const [catAnswers, setCatAnswers] = useState({});
    const [sjtAnswers, setSjtAnswers] = useState({});

    useEffect(() => {
        const loadExams = async () => {
            const response = await fetchAllExams();
            setExamsTitles(response);
        };

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

        loadExams();
        loadOrgs();
        loadCurriculums();
    }, []);

    useEffect(() => {
        const loadCandidate = async () => {
            const response = await fetchCandidate(id);
            setCandidate(response);
        }

        loadCandidate();
    }, [id]);

    useEffect(() => {
        const getExamTitle = () => {
            const filteredExam = examTitles.filter(e => e.id === selectedExamId);
            setSelectedExamTitles(filteredExam[0]);
        }

        getExamTitle();
    }, [examTitles, selectedExamId])

    useEffect(() => {
        const loadOceanExamQuestions = async () => {
            const response = await fetchExam(1);
            setOceanExamQuestions(response);
        };

        const loadCatExamQuestions = async () => {
            const response = await fetchMCQExam(2);
            setCatExamQuestions(response);
        };

        const loadSjtExamQuestions = async () => {
            const response = await fetchForcedChoiceExam(3);
            setSjtExamQuestions(response);
        };

        loadOceanExamQuestions();
        loadCatExamQuestions();
        loadSjtExamQuestions();
    }, []);

    const handleOceanCountChange = (value) => {
        setOceanAnswers(value);
    };
    const handleCatCountChange = (value) => {
        setCatAnswers(value);
    };

    const handleSjtCountChange = (value) => {
        setSjtAnswers(value);
    };

    // Calculate progress percentage
    const oceanAnsweredCount = Object.keys(oceanAnswers).length;
    const catAnsweredCount = Object.keys(catAnswers).length;
    const sjtAnsweredCount = Object.keys(sjtAnswers).length;
    const progress = Math.round(((oceanAnsweredCount + catAnsweredCount + sjtAnsweredCount) / (oceanExamQuestions.length + catExamQuestions.length + sjtExamQuestions.length)) * 100);

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
                    currentPage={"candidates-exam"}
                    selectedCandidate={candidate}
                />
                <div className="w-[90%] flex flex-col justify-center items-center p-2 gap-2">
                    <div className="w-full flex items-center gap-10 px-4 py-2 border-b-2 border-white text-white">
                        <div className="flex-1 flex flex-col gap-1">
                            <div className="flex gap-1">
                                <div className="w-3/5 text-center text-black bg-white rounded border-white border-2">{candidate?.recommended_country}</div>
                                <div className="w-2/5 text-center text-white rounded border-white border-2">الدولة</div>
                            </div>
                            <div className="flex gap-1">
                                <div className="w-3/5 text-center text-black bg-white rounded border-white border-2">{candidate?.phone_number}</div>
                                <div className="w-2/5 text-center text-white rounded border-white border-2">رقم الهاتف</div>
                            </div>
                        </div>
                        <div className="flex-1 flex flex-col gap-1">
                            <div className="flex gap-1">
                                <div className="w-3/5 text-center text-black bg-white rounded border-white border-2">{vtcs[candidate?.organization_id]?.name || "غير تابع للمراكز"}</div>
                                <div className="w-2/5 text-center text-white rounded border-white border-2">مركز الاختبار</div>
                            </div>
                            <div className="flex gap-1">
                                <div className="w-3/5 text-center text-black bg-white rounded border-white border-2">{courses[candidate?.category]?.code}</div>
                                <div className="w-2/5 text-center text-white rounded border-white border-2">الفئة</div>
                            </div>
                        </div>
                        <div className="flex-1 flex flex-col gap-1">
                            <div className="flex gap-1">
                                <div className="w-3/5 text-center text-black bg-white rounded border-white border-2">{candidate?.name}</div>
                                <div className="w-2/5 text-center text-white rounded border-white border-2">الاسم</div>
                            </div>
                            <div className="flex gap-1">
                                <div className="w-3/5 text-center text-black bg-white rounded border-white border-2">{candidate?.candidate_id}</div>
                                <div className="w-2/5 text-center text-white rounded border-white border-2">رقم الممتحن</div>
                            </div>
                        </div>
                        <div className="w-[8%] flex justify-center items-center">
                            <img className="w-full rounded-xl" src={person} alt="" />
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
                            <span>[{oceanAnsweredCount + catAnsweredCount + sjtAnsweredCount} / {oceanExamQuestions.length + catExamQuestions.length + sjtExamQuestions.length}]</span>
                        </div>
                    </div>
                    {selectedExamId === 1 && <OceanExam
                        selectedExamTitle={selectedExamTitle}
                        examQuestions={oceanExamQuestions}
                        candidate={candidate}
                        onAnswersChange={handleOceanCountChange}
                        onChangeExam={setSelectedExamId}
                    />}
                    {selectedExamId === 2 && <CatExam
                        selectedExamTitle={selectedExamTitle}
                        examQuestions={catExamQuestions}
                        candidate={candidate}
                        onAnswersChange={handleCatCountChange}
                        onChangeExam={setSelectedExamId}
                    />}
                    {selectedExamId === 3 && <SjtExam
                        selectedExamTitle={selectedExamTitle}
                        examQuestions={sjtExamQuestions}
                        candidate={candidate}
                        onAnswersChange={handleSjtCountChange}
                        onChangeExam={setSelectedExamId}
                    />}
                </div>
            </div>
        </>
    )
}

export default WatomsPECandidatesExam;