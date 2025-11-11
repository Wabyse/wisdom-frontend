// tools
import { useState } from "react";
// libraries
import toast from "react-hot-toast";
import { submitEvaluationExamAnswers } from "../../../services/watoms/professionalExamination";
// APIs

const QGObserverEvaluation = ({ examQuestions, candidate, onAnswersChange }) => {
    const [answers, setAnswers] = useState({});
    const [comments, setComments] = useState({});
    const [submitted, setSubmitted] = useState(false);

    const handleChoiceChange = (questionId, value) => {
        setAnswers(prev => ({ ...prev, [questionId]: Number(value) }));
        onAnswersChange?.(prev => ({ ...prev, [questionId]: Number(value) }));
    };

    const handleCommentChange = (questionId, value) => {
        setComments(prev => ({ ...prev, [questionId]: value }));
    };

    const handleSubmit = async () => {
        if (submitted) return;
        setSubmitted(true);

        try {
            if (!candidate?.id) {
                toast.error("اختر متقدم أولاً!");
                setSubmitted(false);
                return;
            }
            if (examQuestions.length === 0) {
                toast.error("لا يوجد أسئلة في هذا الاختبار!");
                setSubmitted(false);
                return;
            }

            // ✅ Backend expects: allAnswers = [{ question_id, answer, comment }]
            const allAnswers = examQuestions.map(q => ({
                question_id: q.id,
                answer: Number(answers[q.id]) ?? 0,  // ensure numeric
                comment: comments[q.id]?.trim() || "",
            }));

            const formData = {
                candidate_id: candidate.id,
                exam_id: examQuestions[0]?.exam_id,
                allAnswers,
            };

            await submitEvaluationExamAnswers(formData)
            toast.success("تم تسجيل الإجابات بنجاح!");
        } catch (error) {
            console.error("Error submitting exam answers:", error);
            toast.error("حدث خطأ أثناء تسجيل الإجابات!");
            setSubmitted(false);
        }
    };

    return (
        <div className="w-full h-[95%] flex gap-4 text-white">
            <div className="w-full flex flex-col gap-2">
                {/* Header */}
                <div className="w-full flex justify-center gap-2 pr-4">
                    <div className="w-[22%] h-10 flex justify-center items-center bg-white rounded-xl text-black font-bold">
                        ملاحظات
                    </div>
                    <div className="w-[10%] h-10 flex justify-center items-center bg-white rounded-xl text-black font-bold">
                        التقييم
                    </div>
                    <div className="w-[60%] h-10 flex justify-center items-center bg-white rounded-xl text-black font-bold">
                        السؤال
                    </div>
                    <div className="w-[4%] h-10 flex justify-center items-center bg-white rounded-xl text-black font-bold">
                        م
                    </div>
                </div>

                {/* Questions */}
                <div className="w-full h-[39vh] flex flex-col gap-2 overflow-y-scroll font-bold">
                    {examQuestions.map((question, idx) => (
                        <div key={question.id} className="w-full flex justify-center gap-2">
                            {/* Comment */}
                            <input
                                type="text"
                                value={comments[question.id] || ""}
                                onChange={(e) => handleCommentChange(question.id, e.target.value)}
                                className="w-[22%] flex justify-center items-center border-white border-2 bg-transparent text-end rounded-xl py-2"
                            />

                            {/* Score Dropdown */}
                            <select
                                value={answers[question.id] ?? ""}
                                onChange={(e) => handleChoiceChange(question.id, e.target.value)}
                                className="w-[10%] bg-transparent text-white border-2 border-white rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-white cursor-pointer"
                                dir="rtl"
                            >
                                <option value="" disabled className="text-black">
                                    اختار نسبة
                                </option>
                                {[...Array(Math.floor(question.percentage / 5) + 1)].map((_, i) => {
                                    const value = i * 5;
                                    return (
                                        <option key={value} value={value} className="text-black">
                                            {value}
                                        </option>
                                    );
                                })}
                            </select>

                            {/* Question Text */}
                            <div className="w-[60%] flex justify-center items-center border-white border-2 rounded-xl py-2">
                                {question.name}
                            </div>

                            {/* Index */}
                            <div className="w-[4%] flex justify-center items-center border-white border-2 rounded-xl py-2">
                                {idx + 1}
                            </div>
                        </div>
                    ))}
                    {/* Submit Button */}
                    <div className="flex justify-center mt-4">
                        <button
                            onClick={handleSubmit}
                            disabled={submitted}
                            className={`px-6 py-2 rounded-lg text-white font-bold transition ${submitted
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-blue-500 hover:bg-blue-600"
                                }`}
                        >
                            {submitted ? "تم التسجيل" : "تسجيل التقييم"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QGObserverEvaluation;