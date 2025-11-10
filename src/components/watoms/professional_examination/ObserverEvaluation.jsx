// tools
import { useState } from "react";
// libraries
import toast, { Toaster } from "react-hot-toast";
// APIs
import { submitRateScaleCommentExamAnswers } from "../../../services/watoms/professionalExamination";

const ObserverEvaluation = ({ examQuestions, candidate, onAnswersChange }) => {
    const [answers, setAnswers] = useState({});
    const [comments, setComments] = useState({});
    const [submitted, setSubmitted] = useState(false);

    const evaluation1 = examQuestions.filter(e => e.rate_scale === 6);
    const evaluation2 = examQuestions.filter(e => e.rate_scale === 11);

    const handleChoiceChange = (questionId, value) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }));
        onAnswersChange?.(prev => ({ ...prev, [questionId]: value }));
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
                answer: Number(answers[q.id]) ?? 0,  // numeric value
                comment: comments[q.id]?.trim() || "", // string comment
            }));

            const formData = {
                candidate_id: candidate.id,
                exam_id: examQuestions[0]?.exam_id,
                allAnswers,
            };

            await submitRateScaleCommentExamAnswers(formData);
            toast.success("تم تسجيل الإجابات بنجاح!");
        } catch (error) {
            console.error("Error submitting exam answers:", error);
            toast.error("حدث خطأ أثناء تسجيل الإجابات!");
            setSubmitted(false);
        }
    };

    // Helper functions
    const renderLabels = (max) => {
        const labels = Array.from({ length: max }, (_, i) => max - 1 - i);
        return (
            <div className="flex justify-evenly">
                {labels.map(num => (
                    <h1 key={num}>{num}</h1>
                ))}
            </div>
        );
    };

    const renderRadioGroup = (question) => (
        <div className="w-full flex justify-evenly px-1">
            {Array.from({ length: Number(question.rate_scale) }, (_, i) => {
                const value = Number(question.rate_scale) - 1 - i; // reverse order
                return (
                    <input
                        key={value}
                        type="radio"
                        name={`q-${question.id}`}
                        value={value}
                        checked={answers[question.id] === value}
                        onChange={() => handleChoiceChange(question.id, value)}
                        className="cursor-pointer"
                    />
                );
            })}
        </div>
    );

    return (
        <div className="w-full h-[95%] flex gap-4 text-white">
            <Toaster />
            <div className="w-full border-white border-2 rounded-xl px-6 py-4 flex flex-col justify-between space-y-4">
                <div className="w-full flex flex-col gap-2">
                    {/* Evaluation 1 Header */}
                    <div className="w-full flex justify-center gap-2 pr-3">
                        <div className="w-[17%] flex text-black font-bold gap-3 bg-white rounded-xl justify-center items-center">
                            ملاحظات
                        </div>
                        <div className="w-[25%] flex flex-col bg-white rounded-xl text-black font-bold">
                            {renderLabels(6)}
                        </div>
                        <div className="w-[50%] flex justify-center items-center bg-white rounded-xl text-black font-bold">
                            السؤال
                        </div>
                        <div className="w-[4%] flex justify-center items-center bg-white rounded-xl text-black font-bold">
                            م
                        </div>
                    </div>

                    {/* Evaluation 1 Body */}
                    <div className="w-full h-[46vh] flex flex-col gap-2 overflow-y-scroll font-bold">
                        {evaluation1.map((question, idx) => (
                            <div key={question.id} className="w-full flex justify-center gap-2">
                                {/* Notes */}
                                <input
                                    type="text"
                                    value={comments[question.id] || ""}
                                    onChange={(e) => handleCommentChange(question.id, e.target.value)}
                                    className="w-[17%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2 text-white placeholder:text-gray-400"
                                    placeholder="ملاحظة"
                                />

                                {/* Radio Scale */}
                                <div className="w-[25%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">
                                    {renderRadioGroup(question)}
                                </div>

                                {/* Question */}
                                <div className="w-[50%] flex justify-end items-center text-sm text-end border-white border-2 bg-transparent rounded-xl py-2">
                                    {question.name}
                                </div>

                                {/* Index */}
                                <div className="w-[4%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">
                                    {idx + 1}
                                </div>
                            </div>
                        ))}

                        {/* Divider */}
                        <div className="w-full h-0 border-white border-t-2 my-2" />

                        {/* Evaluation 2 */}
                        {evaluation2.map((question, idx) => (
                            <div key={question.id} className="w-full flex justify-center gap-2">
                                <input
                                    type="text"
                                    value={comments[question.id] || ""}
                                    onChange={(e) => handleCommentChange(question.id, e.target.value)}
                                    className="w-[17%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2 text-white placeholder:text-gray-400"
                                    placeholder="ملاحظة"
                                />

                                <div className="w-[25%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">
                                    {renderRadioGroup(question)}
                                </div>

                                <div className="w-[50%] flex justify-end items-center text-sm text-end border-white border-2 bg-transparent rounded-xl py-2">
                                    {question.name}
                                </div>

                                <div className="w-[4%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">
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
        </div>
    );
};

export default ObserverEvaluation;