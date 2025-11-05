// tools
import { useEffect, useState } from "react";
// libraries
import toast, { Toaster } from "react-hot-toast";
// APIs
import { submitForcedChoiceExamAnswers } from "../../../services/watoms/professionalExamination";

const SjtExam = ({ selectedExamTitle, examQuestions, candidate, onAnswersChange }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [selectedAnswer, setSelectedAnswer] = useState("");
    const [timeLeft, setTimeLeft] = useState(59);
    const [, setAutoNextCount] = useState(0);
    const [submitted, setSubmitted] = useState(false);

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
        onAnswersChange((prev) => ({ ...prev, [currentIndex]: value }));
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

            console.log(formData)
            await submitForcedChoiceExamAnswers(formData);
            toast.success('تم تسجيل الإجابات بنجاح!');
        } catch (error) {
            console.error('Error submitting exam answers:', error);
            toast.error('حدث خطأ أثناء تسجيل الإجابات!');
            setSubmitted(false); // allow retry if submission failed
        }
    };

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const formattedTime = `${minutes.toString().padStart(2, "0")} : ${seconds.toString().padStart(2, "0")}`;

    return (
        <div className="w-full h-[95%] flex gap-4 text-white">
            <Toaster />
            <div className="w-1/4 flex flex-col justify-center items-center">
                <h1 className="text-3xl text-yellow-400 text-center">{selectedExamTitle?.code}</h1>
                <h1 className="text-3xl text-yellow-400 text-center">{selectedExamTitle?.name}</h1>
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
                            {examQuestions[currentIndex] ? examQuestions[currentIndex].choices.map((answer, idx) => (
                                <label
                                    key={answer.id}
                                    className={`flex items-center gap-2 hover:text-black border rounded-lg px-3 py-2 cursor-pointer transition ${selectedAnswer === answer.id
                                        ? "text-black border-blue-500 bg-blue-50"
                                        : "border-gray-300 hover:bg-gray-100"
                                        }`}
                                    dir="rtl"
                                >
                                    <input
                                        type="radio"
                                        name={`question-${currentIndex}`}
                                        value={answer.id}
                                        checked={selectedAnswer === answer.id}
                                        onChange={handleChange}
                                        className="cursor-pointer"
                                    />
                                    <span>{answer.name}</span>
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
    )
}

export default SjtExam;