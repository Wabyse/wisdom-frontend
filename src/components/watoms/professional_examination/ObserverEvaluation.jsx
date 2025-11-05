// tools
import { useEffect, useState } from "react";
// libraries
import toast, { Toaster } from "react-hot-toast";
// APIs
import { submitExamAnswers } from "../../../services/watoms/professionalExamination";

const ObserverEvaluation = ({ examQuestions, candidate, onAnswersChange }) => {
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const evaluation1 = examQuestions.filter(e => e.rate_scale === 6)
    const evaluation2 = examQuestions.filter(e => e.rate_scale === 11)

    const handleChoiceChange = (qIndex, value) => {
        setAnswers(prev => ({ ...prev, [qIndex]: value }));
        onAnswersChange?.(prev => ({ ...prev, [qIndex]: value }));
    };

    const handleSubmit = async () => {
        if (submitted) return;
        setSubmitted(true);

        try {
            if (!candidate?.id) { toast.error('اختر متقدم أولاً!'); setSubmitted(false); return; }
            if (examQuestions.length === 0) { toast.error('لا يوجد أسئلة في هذا الاختبار!'); setSubmitted(false); return; }

            const allAnswers = examQuestions.map((q, idx) => ({
                question_id: q.id,
                answer: answers[idx] ?? 0,  // unanswered -> 0
            }));

            const formData = {
                candidate_id: candidate.id,
                exam_id: examQuestions[0]?.exam_id,
                allAnswers,
            };

            // await submitExamAnswers(formData);
            toast.success('تم تسجيل الإجابات بنجاح!');
        } catch (error) {
            console.error('Error submitting exam answers:', error);
            toast.error('حدث خطأ أثناء تسجيل الإجابات!');
            setSubmitted(false);
        }
    };
    const totalQuestions = examQuestions.length;
    const answeredCount = Object.keys(answers).length;

    return (
        <div className="w-full h-[95%] flex gap-4 text-white">
            <Toaster />
            <div className="w-full border-white border-2 rounded-xl px-6 py-4 flex flex-col justify-between space-y-4">
                {/* test score */}
                <div className="w-full flex flex-col gap-2">
                    {/* title */}
                    <div className="w-full flex justify-center gap-2 pr-3">
                        <div className="w-[17%] flex text-black font-bold gap-3 bg-white rounded-xl justify-center items-center">
                            ملاحظات
                        </div>
                        <div className="w-[25%] flex flex-col bg-white rounded-xl text-black font-bold">
                            <div className="flex justify-evenly">
                                <h1>5</h1>
                                <h1>4</h1>
                                <h1>3</h1>
                                <h1>2</h1>
                                <h1>1</h1>
                                <h1>0</h1>
                            </div>
                        </div>
                        <div className="w-[50%] flex justify-center items-center bg-white rounded-xl text-black font-bold">السؤال</div>
                        <div className="w-[4%] flex justify-center items-center bg-white rounded-xl text-black font-bold">م</div>
                    </div>
                    {/* scores */}
                    <div className="w-full h-[46vh] flex flex-col gap-2 overflow-y-scroll font-bold">
                        {evaluation1.map((question, idx) => (
                            <div key={question.id ?? idx} className="w-full flex justify-center gap-2">
                                {/* Notes input (optional to wire later) */}
                                <input
                                    type="text"
                                    className="w-[17%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2"
                                // onChange={(e)=> ... store notes if you want }
                                />

                                <div className="w-[25%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">
                                    <div className="w-full flex justify-evenly px-1">
                                        {Array.from({ length: Number(question.rate_scale) }, (_, i) => (
                                            <input
                                                key={i}
                                                type="radio"
                                                name={`q-${question.id}`}   // group per question
                                                value={i}
                                                checked={answers[idx] === i}
                                                onChange={() => handleChoiceChange(idx, i)}
                                                className="cursor-pointer"
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div className="w-[50%] flex justify-end items-center text-sm text-end border-white border-2 bg-transparent rounded-xl py-2">
                                    {question.name}
                                </div>

                                <div className="w-[4%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">
                                    {idx + 1}
                                </div>
                            </div>
                        ))}
                        <div className="w-full h-0 border-white border-t-2 my-2" />
                        <div className="w-full flex justify-center gap-2 pr-3">
                            <div className="w-[17%] flex text-black font-bold gap-3 bg-white rounded-xl justify-center items-center">
                                ملاحظات
                            </div>
                            <div className="w-[25%] flex flex-col bg-white rounded-xl text-black font-bold">
                                <div className="flex justify-evenly">
                                    <h1>10</h1>
                                    <h1>9</h1>
                                    <h1>8</h1>
                                    <h1>7</h1>
                                    <h1>6</h1>
                                    <h1>5</h1>
                                    <h1>4</h1>
                                    <h1>3</h1>
                                    <h1>2</h1>
                                    <h1>1</h1>
                                    <h1>0</h1>
                                </div>
                            </div>
                            <div className="w-[50%] flex justify-center items-center bg-white rounded-xl text-black font-bold">السؤال</div>
                            <div className="w-[4%] flex justify-center items-center bg-white rounded-xl text-black font-bold">م</div>
                        </div>
                        {evaluation2.map((question, idx) => (
                            <div key={question.id ?? idx} className="w-full flex justify-center gap-2">
                                {/* Notes input (optional to wire later) */}
                                <input
                                    type="text"
                                    className="w-[17%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2"
                                // onChange={(e)=> ... store notes if you want }
                                />

                                <div className="w-[25%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">
                                    <div className="w-full flex justify-evenly px-1">
                                        {Array.from({ length: Number(question.rate_scale) }, (_, i) => (
                                            <input
                                                key={i}
                                                type="radio"
                                                name={`q-${question.id}`}   // group per question
                                                value={i}
                                                checked={answers[idx] === i}
                                                onChange={() => handleChoiceChange(idx, i)}
                                                className="cursor-pointer"
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div className="w-[50%] flex justify-end items-center text-sm text-end border-white border-2 bg-transparent rounded-xl py-2">
                                    {question.name}
                                </div>

                                <div className="w-[4%] flex justify-center items-center border-white border-2 bg-transparent rounded-xl py-2">
                                    {idx + 1}
                                </div>
                            </div>
                        ))}
                        <div className="flex flex-col gap-2">
                            <h1 className="text-center">الاقرار و الالتزام</h1>
                            <h1 className="text-end px-1">انا الموقع أدناه, أقر بموجب هذا بأنني أتحمل المسؤلية الكاملة عن دقة المعلومات المقدمة في نموذج التقييم العملي هذا. وأقر بأنني سأتحمل المسؤلية القانونية اذا تبين ايا من المعلومات المذكورة أعلاه غير صحيحة او مضللة</h1>
                            <h1 className="text-end px-1">:معلومات المقييم</h1>
                            <div className="flex justify-start text-sm">
                                <div className="h-8 flex justify-center gap-1">
                                    <input type="text" className="w-40" />
                                    <label className="text-sm">التوقيع الالكتروني</label>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-center mt-4">
                            <button
                                onClick={handleSubmit}
                                disabled={submitted}
                                className={`px-6 py-2 rounded-lg text-white font-bold transition ${submitted ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
                                    }`}
                            >
                                {submitted ? "تم التسجيل" : "تسجيل التقييم"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ObserverEvaluation;