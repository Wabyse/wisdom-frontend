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
// libraries
import toast, { Toaster } from "react-hot-toast";
// APIs
import { fetchAllExams, fetchCandidate, fetchExam, submitExamAnswers } from "../../../services/watoms/professionalExamination";
import { fetchCurriculums, fetchSchools } from "../../../services/data";

const WatomsPECandidatesExam = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [, setExamsTitles] = useState([]);
    const [selectedExamTitle, setSelectedExamTitles] = useState(null);
    const [examQuestions, setExamQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [selectedAnswer, setSelectedAnswer] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);
    const [candidate, setCandidate] = useState(null);
    const [vtcs, setVtcs] = useState([]);
    const [courses, setCourses] = useState([]);
    const [timeLeft, setTimeLeft] = useState(59);
    const [autoNextCount, setAutoNextCount] = useState(0);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        const loadExams = async () => {
            const response = await fetchAllExams();
            setExamsTitles(response);
            setSelectedExamTitles(response[0]);
        };

        const loadCandidate = async () => {
            const response = await fetchCandidate(id);
            setCandidate(response);
        }

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
        loadCandidate();
        loadOrgs();
        loadCurriculums();
    }, []);

    useEffect(() => {
        const loadExamQuestions = async () => {
            if (selectedExamTitle?.id) {
                const response = await fetchExam(selectedExamTitle.id);
                setExamQuestions(response);
            }
        };
        loadExamQuestions();
    }, [selectedExamTitle]);

    useEffect(() => {
        if (examQuestions.length === 0 || submitted) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev > 0) {
                    return prev - 1;
                } else {
                    clearInterval(timer);

                    // Auto advance logic
                    setAutoNextCount((prevCount) => {
                        const nextCount = prevCount + 1;

                        // If still within question count
                        if (nextCount < examQuestions.length && currentIndex < examQuestions.length - 1) {
                            setCurrentIndex((prevIndex) => prevIndex + 1);
                            setSelectedAnswer(answers[currentIndex + 1] || "");
                            setTimeLeft(59); // reset timer only after finishing a cycle
                        } else {
                            // Timer finished for all questions — submit answers
                            handleSubmit();
                            setTimeLeft(0);
                        }

                        return nextCount;
                    });

                    return 0;
                }
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, examQuestions.length, currentIndex, submitted]);

    const handleChange = (e) => {
        const value = Number(e.target.value);
        setSelectedAnswer(value);
        setAnswers((prev) => ({ ...prev, [currentIndex]: value }));
    };

    const handleNext = () => {
        if (currentIndex < examQuestions.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setSelectedAnswer(answers[currentIndex + 1] || "");
        }
    };
    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            setSelectedAnswer(answers[currentIndex - 1] || "");
        }
    };

    const handleSubmit = async () => {
        if (submitted) return; // ✅ prevent multiple submissions

        setSubmitted(true); // lock submission

        try {
            if (!candidate?.id) {
                toast.error('اختر متقدم أولاً!');
                setSubmitted(false);
                return;
            }

            if (examQuestions.length === 0) {
                toast.error('لا يوجد أسئلة في هذا الاختبار!');
                setSubmitted(false);
                return;
            }

            // ✅ Fill unanswered questions with 0
            const allAnswers = examQuestions.map((q, idx) => ({
                question_id: q.id,
                answer: answers[idx] ?? 0,
            }));

            const formData = {
                candidate_id: candidate.id,
                exam_id: examQuestions[0]?.exam_id,
                allAnswers,
            };

            await submitExamAnswers(formData);
            toast.success('تم تسجيل الإجابات بنجاح!');
        } catch (error) {
            console.error('Error submitting exam answers:', error);
            toast.error('حدث خطأ أثناء تسجيل الإجابات!');
            setSubmitted(false); // allow retry if submission failed
        }
    };

    // Calculate progress percentage
    const answeredCount = Object.keys(answers).length;
    const progress = Math.round((answeredCount / examQuestions.length) * 100);
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const formattedTime = `${minutes.toString().padStart(2, "0")} : ${seconds
        .toString()
        .padStart(2, "0")}`;

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
                    <button onClick={() => navigate('/watoms/pe/practical-test')} className="w-[90%] h-[12%] flex flex-col justify-center items-center text-yellow-400  text-sm text-center bg-[#0a183d] hover:bg-gray-500 px-2 rounded-xl border-blue-600 border-2">تقييم مراقبين الجودة والحوكمة</button>
                    <div className="w-[90%] h-[12%] flex flex-col justify-center items-center text-yellow-400  text-sm text-center bg-gray-500 px-2 rounded-xl border-blue-600 border-2">اختبارات المرشحين</div>
                    <button onClick={() => navigate('/watoms/pe/cognitive-test')} className="w-[90%] h-[12%] flex flex-col justify-center items-center text-yellow-400  text-sm text-center bg-[#0a183d] hover:bg-gray-500 px-2 rounded-xl border-blue-600 border-2">مؤشرات تحليل الأداء العام</button>
                </div>
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
                                <div className="w-3/5 text-center text-black bg-white rounded border-white border-2">{vtcs[candidate?.organization_id]?.name}</div>
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
                    <div className="w-full bg-gray-300 rounded-full h-12 relative flex items-center">
                        {/* Filled section */}
                        <div
                            className="bg-blue-500 h-full rounded-full absolute left-0 top-0 transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        />

                        {/* Text layer (always visible) */}
                        <div className="relative z-10 flex justify-center items-center gap-2 w-full px-3 text-sm font-medium text-gray-800">
                            <span>[{progress}%]</span>
                            <span> - </span>
                            <span>[{answeredCount} / {examQuestions.length}]</span>
                        </div>
                    </div>

                    <div className="w-full h-[95%] flex gap-4 text-white">
                        <div className="w-1/4 flex flex-col justify-center items-center">
                            <h1 className="text-3xl text-yellow-400 text-center">{selectedExamTitle?.name}</h1>
                            <h1 className="text-3xl text-yellow-400 text-center">{selectedExamTitle?.code}</h1>
                        </div>
                        <div className="w-3/4 border-white border-2 rounded-xl px-6 py-4 flex flex-col justify-between space-y-4">
                            {examQuestions.length > 0 && examQuestions[currentIndex] ? (
                                <div className="space-y-4">
                                    <h1 className="text-sm text-yellow-400 text-end">
                                        الوقت المتبقي لإجابة السؤال ({formattedTime})
                                    </h1>

                                    {/* Question */}
                                    <h2 className="text-lg font-bold mb-3 text-right" dir="rtl">
                                        {examQuestions[currentIndex].id} - {examQuestions[currentIndex].name}
                                    </h2>

                                    {/* Answers */}
                                    <div className="flex flex-col gap-2">
                                        {examQuestions[currentIndex]?.rate_scale
                                            ? Array.from({ length: examQuestions[currentIndex].rate_scale }, (_, idx) => (
                                                <label
                                                    key={idx + 1}
                                                    className={`flex items-center gap-2 border rounded-lg px-3 py-2 cursor-pointer transition ${selectedAnswer === idx + 1
                                                        ? "text-black border-blue-500 bg-blue-50"
                                                        : "border-gray-300 hover:bg-gray-100"
                                                        }`}
                                                    dir="rtl"
                                                >
                                                    <input
                                                        type="radio"
                                                        name={`question-${currentIndex}`}
                                                        value={idx + 1}
                                                        checked={selectedAnswer === idx + 1}
                                                        onChange={handleChange}
                                                        className="cursor-pointer"
                                                    />
                                                    <span>{idx + 1}</span>
                                                </label>
                                            ))
                                            : <p className="text-center text-gray-400">لا يوجد مقياس تقييم لهذا السؤال</p>
                                        }
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center text-yellow-400">جاري تحميل الأسئلة...</div>
                            )}

                            {/* ✅ Buttons pinned to bottom-right */}
                            <div className="flex justify-between gap-4 mt-6">
                                {currentIndex ? <button
                                    onClick={handlePrevious}
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
                                >
                                    السابق
                                </button> : <div className="w-20"></div>}
                                <h1 className="text-center">{currentIndex + 1} / {examQuestions.length}</h1>
                                {(currentIndex + 1) === examQuestions.length ?
                                    <button
                                        onClick={handleSubmit}
                                        disabled={submitted} // ✅ disable after submit
                                        className={`px-4 py-2 rounded-lg transition text-white ${submitted
                                                ? "bg-gray-400 cursor-not-allowed"
                                                : "bg-blue-500 hover:bg-blue-600"
                                            }`}
                                    >
                                        {submitted ? "تم التسجيل" : "تسجيل"}
                                    </button>
                                    :
                                    <button
                                        onClick={handleNext}
                                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
                                    >
                                        التالي
                                    </button>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default WatomsPECandidatesExam;