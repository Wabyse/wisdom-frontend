import DonutChart from "./DonutChart";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { roundNumber } from "../utils/roundNumber";

const TmsDashboardTables = ({ onClose, selectedMonthTasks, selectedMonthDetails }) => {
    return (
        <div className="fixed inset-0 bg-black/60 flex overflow-y-auto justify-center items-end z-50">
            <div className="relative bg-gray-300 w-[95%] h-[86vh] mb-4 flex flex-col p-4 items-center gap-6">
                <button
                    onClick={onClose}
                    className="absolute top-2 left-2 text-white bg-gray-700 hover:bg-gray-800 w-8 h-8 flex justify-center items-center text-2xl font-bold cursor-pointer z-50"
                >
                    <FontAwesomeIcon icon={faXmark} />
                </button>
                <div className="flex flex-row-reverse gap-3 w-[95%] text-xs text-white" dir="rtl">
                    {/* === Left section (الإجمالي) === */}
                    <div className="flex-1 max-w-[6rem] flex flex-col gap-3">
                        {/* === Top === */}
                        <div className="overflow-hidden rounded-xl border border-white/30 bg-[#4459a8] shadow-sm">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-[#4459a8] border-b border-white/30 h-16">
                                        <th className="py-2 text-center font-semibold">الإجمالي</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="bg-[#2f417a]">
                                        <td className="py-2 text-center">
                                            {selectedMonthTasks?.tasks?.length || 0}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* === Middle === */}
                        <div className="overflow-hidden rounded-xl border border-white/30 bg-[#4459a8] shadow-sm">
                            <table className="w-full border-collapse">
                                <tbody>
                                    {[
                                        { value: `${selectedMonthDetails.finishedPercentage || 0}%` },
                                        { value: `${(selectedMonthDetails.avgManagerQuality * selectedMonthDetails.avgReviewerQuality) / 2}%` },
                                        { value: `${(selectedMonthDetails.avgManagerSpeed * selectedMonthDetails.avgReviewerSpeed) / 2}%` },
                                    ].map((row, i) => (
                                        <tr
                                            key={i}
                                            className="bg-[#2f417a] border-t border-white/20 hover:bg-[#3b4e93] transition"
                                        >
                                            <td className="py-2 text-center">
                                                <span className="inline-flex items-center justify-center min-w-[2.25rem] px-2 h-6 rounded-full bg-white/20">
                                                    {row.value}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* === Bottom === */}
                        <div className="overflow-hidden rounded-xl border border-white/30 bg-[#4459a8] shadow-sm">
                            <table className="w-full border-collapse">
                                <tbody>
                                    {[
                                        { value: `${roundNumber((((selectedMonthDetails.avgManagerSpeed + selectedMonthDetails.avgReviewerSpeed) / 2) * 0.3) + (((selectedMonthDetails.avgManagerQuality + selectedMonthDetails.avgReviewerQuality) / 2) * 0.3) + (selectedMonthDetails.finishedPercentage * 0.4))}%` },
                                    ].map((row, i) => (
                                        <tr
                                            key={i}
                                            className="bg-[#2f417a] border-t border-white/20 hover:bg-[#3b4e93] transition"
                                        >
                                            <td className="py-2 text-center">
                                                <span className="inline-flex items-center justify-center min-w-[2.25rem] px-2 h-6 rounded-full bg-white/20">
                                                    {row.value}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* === Main (Right side) === */}
                    <div className="flex-1 flex flex-col gap-3">
                        {/* === Top section (العدد row) === */}
                        <div className="overflow-hidden rounded-xl border border-white/30 bg-[#5268b1] shadow-sm">
                            <table className="w-full table-fixed border-collapse">
                                <thead>
                                    <tr className="bg-[#5268b1] border-b border-white/30">
                                        <th className="py-2 text-center font-semibold border-l border-white/30 w-[10%]">البند</th>
                                        <th colSpan="3" className="py-2 text-center font-semibold border-l border-white/30">
                                            أولوية قصوى (%90-%100)
                                        </th>
                                        <th colSpan="3" className="py-2 text-center font-semibold border-l border-white/30">
                                            أولوية متوسطة (%70-%89)
                                        </th>
                                        <th colSpan="3" className="py-2 text-center font-semibold">
                                            أولوية عادية (%01-%69)
                                        </th>
                                    </tr>
                                    <tr className="bg-[#5268b1] border-t border-white/20">
                                        <th className="py-2 text-center border-l border-white/30">العدد</th>
                                        <th className="py-2 text-center border-l border-white/30">المهام الكبيرة</th>
                                        <th className="py-2 text-center border-l border-white/30">المهام المتوسطة</th>
                                        <th className="py-2 text-center border-l border-white/30">المهام الصغيرة</th>
                                        <th className="py-2 text-center border-l border-white/30">المهام الكبيرة</th>
                                        <th className="py-2 text-center border-l border-white/30">المهام المتوسطة</th>
                                        <th className="py-2 text-center border-l border-white/30">المهام الصغيرة</th>
                                        <th className="py-2 text-center border-l border-white/30">المهام الكبيرة</th>
                                        <th className="py-2 text-center border-l border-white/30">المهام المتوسطة</th>
                                        <th className="py-2 text-center">المهام الصغيرة</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="bg-[#2f417a] hover:bg-[#3b4e93] transition">
                                        <td className="py-2 text-center border-l border-white/30 font-semibold">العدد</td>
                                        <td className="py-2 text-center border-l border-white/30">{selectedMonthDetails.totalImportantLarge}</td>
                                        <td className="py-2 text-center border-l border-white/30">{selectedMonthDetails.totalImportantMedium}</td>
                                        <td className="py-2 text-center border-l border-white/30">{selectedMonthDetails.totalImportantSmall}</td>
                                        <td className="py-2 text-center border-l border-white/30">{selectedMonthDetails.totalNormalLarge}</td>
                                        <td className="py-2 text-center border-l border-white/30">{selectedMonthDetails.totalNormalMedium}</td>
                                        <td className="py-2 text-center border-l border-white/30">{selectedMonthDetails.totalNormalSmall}</td>
                                        <td className="py-2 text-center border-l border-white/30">{selectedMonthDetails.totalEasyLarge}</td>
                                        <td className="py-2 text-center border-l border-white/30">{selectedMonthDetails.totalEasyMedium}</td>
                                        <td className="py-2 text-center">{selectedMonthDetails.totalEasySmall}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* === Middle section (rest of rows) === */}
                        <div className="overflow-hidden rounded-xl border border-white/30 bg-[#2f417a] shadow-sm">
                            <table className="w-full table-fixed border-collapse">
                                <tbody>
                                    {[
                                        {
                                            label: "نسبة الاكتمال",
                                            values: [
                                                `${selectedMonthDetails.importantLargePercentage}%`,
                                                `${selectedMonthDetails.importantMediumPercentage}%`,
                                                `${selectedMonthDetails.importantSmallPercentage}%`,
                                                `${selectedMonthDetails.normalLargePercentage}%`,
                                                `${selectedMonthDetails.normalMediumPercentage}%`,
                                                `${selectedMonthDetails.normalSmallPercentage}%`,
                                                `${selectedMonthDetails.easyLargePercentage}%`,
                                                `${selectedMonthDetails.easyMediumPercentage}%`,
                                                `${selectedMonthDetails.easySmallPercentage}%`,
                                            ],
                                        },
                                        {
                                            label: "مستوى الدقة",
                                            values: [
                                                `${roundNumber((selectedMonthDetails.avgManagerQualityImportantLarge + selectedMonthDetails.avgReviewerQualityImportantLarge) / 2)}%`,
                                                `${roundNumber((selectedMonthDetails.avgManagerQualityImportantMedium + selectedMonthDetails.avgReviewerQualityImportantMedium) / 2)}%`,
                                                `${roundNumber((selectedMonthDetails.avgManagerQualityImportantSmall + selectedMonthDetails.avgReviewerQualityImportantSmall) / 2)}%`,
                                                `${roundNumber((selectedMonthDetails.avgManagerQualityNormalLarge + selectedMonthDetails.avgReviewerQualityNormalLarge) / 2)}%`,
                                                `${roundNumber((selectedMonthDetails.avgManagerQualityNormalMedium + selectedMonthDetails.avgReviewerQualityNormalMedium) / 2)}%`,
                                                `${roundNumber((selectedMonthDetails.avgManagerQualityNormalSmall + selectedMonthDetails.avgReviewerQualityNormalSmall) / 2)}%`,
                                                `${roundNumber((selectedMonthDetails.avgManagerQualityEasyLarge + selectedMonthDetails.avgReviewerQualityEasyLarge) / 2)}%`,
                                                `${roundNumber((selectedMonthDetails.avgManagerQualityEasyMedium + selectedMonthDetails.avgReviewerQualityEasyMedium) / 2)}%`,
                                                `${roundNumber((selectedMonthDetails.avgManagerQualityEasySmall + selectedMonthDetails.avgReviewerQualityEasySmall) / 2)}%`,
                                            ],
                                        },
                                        {
                                            label: "معدل السرعة",
                                            values: [
                                                `${roundNumber((selectedMonthDetails.avgManagerSpeedImportantLarge + selectedMonthDetails.avgReviewerSpeedImportantLarge) / 2)}%`,
                                                `${roundNumber((selectedMonthDetails.avgManagerSpeedImportantMedium + selectedMonthDetails.avgReviewerSpeedImportantMedium) / 2)}%`,
                                                `${roundNumber((selectedMonthDetails.avgManagerSpeedImportantSmall + selectedMonthDetails.avgReviewerSpeedImportantSmall) / 2)}%`,
                                                `${roundNumber((selectedMonthDetails.avgManagerSpeedNormalLarge + selectedMonthDetails.avgReviewerSpeedNormalLarge) / 2)}%`,
                                                `${roundNumber((selectedMonthDetails.avgManagerSpeedNormalMedium + selectedMonthDetails.avgReviewerSpeedNormalMedium) / 2)}%`,
                                                `${roundNumber((selectedMonthDetails.avgManagerSpeedNormalSmall + selectedMonthDetails.avgReviewerSpeedNormalSmall) / 2)}%`,
                                                `${roundNumber((selectedMonthDetails.avgManagerSpeedEasyLarge + selectedMonthDetails.avgReviewerSpeedEasyLarge) / 2)}%`,
                                                `${roundNumber((selectedMonthDetails.avgManagerSpeedEasyMedium + selectedMonthDetails.avgReviewerSpeedEasyMedium) / 2)}%`,
                                                `${roundNumber((selectedMonthDetails.avgManagerSpeedEasySmall + selectedMonthDetails.avgReviewerSpeedEasySmall) / 2)}%`,
                                            ],
                                        },
                                    ].map((row, index) => (
                                        <tr
                                            key={index}
                                            className="border-t border-white/20 hover:bg-[#3b4e93] transition"
                                        >
                                            <td className="py-2 text-center border-l border-white/30 font-semibold bg-[#5268b1]">
                                                {row.label}
                                            </td>
                                            {row.values.map((v, i) => (
                                                <td key={i} className="py-2 text-center border-l border-white/20">
                                                    <span className="inline-flex items-center justify-center min-w-[2.25rem] px-2 h-6 rounded-full bg-white/20">
                                                        {v}
                                                    </span>
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* === Bottom section (rest of rows) === */}
                        <div className="overflow-hidden rounded-xl border border-white/30 bg-[#2f417a] shadow-sm">
                            <table className="w-full table-fixed border-collapse">
                                <tbody>
                                    {[
                                        {
                                            label: "إجمالي التقييم", values: [
                                                `${roundNumber((selectedMonthDetails.importantLargePercentage * 0.4) + (((selectedMonthDetails.avgManagerQualityImportantLarge + selectedMonthDetails.avgReviewerQualityImportantLarge) / 2) * 0.3) + (((selectedMonthDetails.avgManagerSpeedImportantLarge + selectedMonthDetails.avgReviewerSpeedImportantLarge) / 2) * 0.3))}%`,
                                                `${roundNumber((selectedMonthDetails.importantMediumPercentage * 0.4) + (((selectedMonthDetails.avgManagerQualityImportantMedium + selectedMonthDetails.avgReviewerQualityImportantMedium) / 2) * 0.3) + (((selectedMonthDetails.avgManagerSpeedImportantMedium + selectedMonthDetails.avgReviewerSpeedImportantMedium) / 2) * 0.3))}%`,
                                                `${roundNumber((selectedMonthDetails.importantSmallPercentage * 0.4) + (((selectedMonthDetails.avgManagerQualityImportantSmall + selectedMonthDetails.avgReviewerQualityImportantSmall) / 2) * 0.3) + (((selectedMonthDetails.avgManagerSpeedImportantSmall + selectedMonthDetails.avgReviewerSpeedImportantSmall) / 2) * 0.3))}%`,
                                                `${roundNumber((selectedMonthDetails.normalLargePercentage * 0.4) + (((selectedMonthDetails.avgManagerQualityNormalLarge + selectedMonthDetails.avgReviewerQualityNormalLarge) / 2) * 0.3) + (((selectedMonthDetails.avgManagerSpeedNormalLarge + selectedMonthDetails.avgReviewerSpeedNormalLarge) / 2) * 0.3))}%`,
                                                `${roundNumber((selectedMonthDetails.normalMediumPercentage * 0.4) + (((selectedMonthDetails.avgManagerQualityNormalMedium + selectedMonthDetails.avgReviewerQualityNormalMedium) / 2) * 0.3) + (((selectedMonthDetails.avgManagerSpeedNormalMedium + selectedMonthDetails.avgReviewerSpeedNormalMedium) / 2) * 0.3))}%`,
                                                `${roundNumber((selectedMonthDetails.normalSmallPercentage * 0.4) + (((selectedMonthDetails.avgManagerQualityNormalSmall + selectedMonthDetails.avgReviewerQualityNormalSmall) / 2) * 0.3) + (((selectedMonthDetails.avgManagerSpeedNormalSmall + selectedMonthDetails.avgReviewerSpeedNormalSmall) / 2) * 0.3))}%`,
                                                `${roundNumber((selectedMonthDetails.easyLargePercentage * 0.4) + (((selectedMonthDetails.avgManagerQualityEasyLarge + selectedMonthDetails.avgReviewerQualityEasyLarge) / 2) * 0.3) + (((selectedMonthDetails.avgManagerSpeedEasyLarge + selectedMonthDetails.avgReviewerSpeedEasyLarge) / 2) * 0.3))}%`,
                                                `${roundNumber((selectedMonthDetails.easyMediumPercentage * 0.4) + (((selectedMonthDetails.avgManagerQualityEasyMedium + selectedMonthDetails.avgReviewerQualityEasyMedium) / 2) * 0.3) + (((selectedMonthDetails.avgManagerSpeedEasyMedium + selectedMonthDetails.avgReviewerSpeedEasyMedium) / 2) * 0.3))}%`,
                                                `${roundNumber((selectedMonthDetails.easySmallPercentage * 0.4) + (((selectedMonthDetails.avgManagerQualityEasySmall + selectedMonthDetails.avgReviewerQualityEasySmall) / 2) * 0.3) + (((selectedMonthDetails.avgManagerSpeedEasySmall + selectedMonthDetails.avgReviewerSpeedEasySmall) / 2) * 0.3))}%`,

                                            ]
                                        },
                                    ].map((row, index) => (
                                        <tr
                                            key={index}
                                            className="border-t border-white/20 hover:bg-[#3b4e93] transition"
                                        >
                                            <td className="py-2 text-center border-l border-white/30 font-semibold bg-[#5268b1]">
                                                {row.label}
                                            </td>
                                            {row.values.map((v, i) => (
                                                <td key={i} className="py-2 text-center border-l border-white/20">
                                                    <span className="inline-flex items-center justify-center min-w-[2.25rem] px-2 h-6 rounded-full bg-white/20">
                                                        {v}
                                                    </span>
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-between w-[95%] h-72">
                    <div className="flex flex-col gap-2">
                        <div className="p-4 bg-[#5268b1] rounded-2xl">
                            <DonutChart value={roundNumber((((selectedMonthDetails.avgManagerSpeed + selectedMonthDetails.avgReviewerSpeed) / 2) * 0.3) + (((selectedMonthDetails.avgManagerQuality + selectedMonthDetails.avgReviewerQuality) / 2) * 0.3) + (selectedMonthDetails.finishedPercentage * 0.4))} size={170} color='url(#circularBlueGradient)' bg='#23263a' textColor='#fff' stroke={14} />
                        </div>
                        <div className="flex py-2 px-4 rounded-2xl shadow gap-2 bg-[#5268b1] text-white h-12 justify-center items-center">
                            <h1>مهمة</h1>
                            <h1>{selectedMonthTasks?.tasks?.length}</h1>
                        </div>
                    </div>
                    <div className="w-0 border-black border-l-2 h-32" />
                    <div className="w-4/5 rounded-2xl overflow-hidden border border-white/30">
                        <div className="w-full flex flex-row-reverse gap-3 text-white text-xs cursor-pointer">
                            {/* === Priority columns === */}
                            <div className="flex-1 flex flex-col gap-3">
                                {/* === Top section: إجمالي العدد === */}
                                <div className="overflow-hidden rounded-xl border border-white/30 bg-[#5268b1] shadow-sm">
                                    <table className="w-full table-fixed border-collapse" dir="rtl">
                                        <thead>
                                            <tr className="bg-[#5268b1] border-b border-white/30">
                                                <th className="py-2 text-center font-semibold border-l border-white/30">البند</th>
                                                <th className="py-2 text-center font-semibold border-l border-white/30">أولوية قصوى</th>
                                                <th className="py-2 text-center font-semibold border-l border-white/30">أولوية متوسطة</th>
                                                <th className="py-2 text-center font-semibold">أولوية عادية</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className="bg-[#2f417a] hover:bg-[#3b4e93] transition">
                                                <td className="py-2 text-center border-l border-white/30">إجمالي العدد</td>
                                                {[selectedMonthDetails.totalImportant, selectedMonthDetails.totalNormal, selectedMonthDetails.totalEasy].map(
                                                    (value, i) => (
                                                        <td key={i} className="py-2 text-center border-l border-white/30">
                                                            <span className="inline-flex items-center justify-center min-w-[2.25rem] px-2 h-6 rounded-full bg-white/20">
                                                                {value}
                                                            </span>
                                                        </td>
                                                    )
                                                )}
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                {/* === Bottom section: other rows === */}
                                <div className="overflow-hidden rounded-xl border border-white/30 bg-[#5268b1] shadow-sm">
                                    <table className="w-full table-fixed border-collapse" dir="rtl">
                                        <tbody>
                                            {[
                                                {
                                                    label: "إجمالي نسبة الاستكمال",
                                                    values: [
                                                        `${selectedMonthDetails.importantPercentage}%`,
                                                        `${selectedMonthDetails.normalPercentage}%`,
                                                        `${selectedMonthDetails.easyPercentage}%`,
                                                    ],
                                                },
                                                { label: "إجمالي مستوى الدقة", values: [`${(selectedMonthDetails.avgManagerQualityImportant * selectedMonthDetails.avgReviewerQualityImportant) / 2}%`, `${(selectedMonthDetails.avgManagerQualityNormal * selectedMonthDetails.avgReviewerQualityNormal) / 2}%`, `${(selectedMonthDetails.avgManagerQualityEasy * selectedMonthDetails.avgReviewerQualityEasy) / 2}%`] },
                                                { label: "إجمالي معدل السرعة", values: [`${(selectedMonthDetails.avgManagerSpeedImportant * selectedMonthDetails.avgReviewerSpeedImportant) / 2}%`, `${(selectedMonthDetails.avgManagerSpeedNormal * selectedMonthDetails.avgReviewerSpeedNormal) / 2}%`, `${(selectedMonthDetails.avgManagerSpeedEasy * selectedMonthDetails.avgReviewerSpeedEasy) / 2}%`] },
                                            ].map((row, index) => (
                                                <tr
                                                    key={index}
                                                    className="bg-[#2f417a] border-t border-white/20 hover:bg-[#3b4e93] transition"
                                                >
                                                    <td className="py-2 text-center border-l border-white/30">{row.label}</td>
                                                    {row.values.map((value, i) => (
                                                        <td key={i} className="py-2 text-center border-l border-white/30">
                                                            <span className="inline-flex items-center justify-center min-w-[2.25rem] px-2 h-6 rounded-full bg-white/20">
                                                                {value}
                                                            </span>
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* === Bottom section: other rows === */}
                                <div className="overflow-hidden rounded-xl border border-white/30 bg-[#5268b1] shadow-sm">
                                    <table className="w-full table-fixed border-collapse" dir="rtl">
                                        <tbody>
                                            {[
                                                { label: "إجمالي التقييم", values: [`${roundNumber((((selectedMonthDetails.avgManagerSpeedImportant + selectedMonthDetails.avgReviewerSpeedImportant) / 2) * 0.3) + (((selectedMonthDetails.avgManagerQualityImportant + selectedMonthDetails.avgReviewerQualityImportant) / 2) * 0.3) + (selectedMonthDetails.importantPercentage * 0.4))}%`, `${roundNumber((((selectedMonthDetails.avgManagerSpeedNormal + selectedMonthDetails.avgReviewerSpeedNormal) / 2) * 0.3) + (((selectedMonthDetails.avgManagerQualityNormal + selectedMonthDetails.avgReviewerQualityNormal) / 2) * 0.3) + (selectedMonthDetails.normalPercentage * 0.4))}%`, `${roundNumber((((selectedMonthDetails.avgManagerSpeedEasy + selectedMonthDetails.avgReviewerSpeedEasy) / 2) * 0.3) + (((selectedMonthDetails.avgManagerQualityEasy + selectedMonthDetails.avgReviewerQualityEasy) / 2) * 0.3) + (selectedMonthDetails.easyPercentage * 0.4))}%`] },
                                            ].map((row, index) => (
                                                <tr
                                                    key={index}
                                                    className="bg-[#2f417a] border-t border-white/20 hover:bg-[#3b4e93] transition"
                                                >
                                                    <td className="py-2 text-center border-l border-white/30">{row.label}</td>
                                                    {row.values.map((value, i) => (
                                                        <td key={i} className="py-2 text-center border-l border-white/30">
                                                            <span className="inline-flex items-center justify-center min-w-[2.25rem] px-2 h-6 rounded-full bg-white/20">
                                                                {value}
                                                            </span>
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* === Total column (الإجمالي) === */}
                            <div className="flex-1 max-w-[6rem] flex flex-col gap-3">
                                {/* === Top section (إجمالي العدد) === */}
                                <div className="overflow-hidden rounded-xl border border-white/30 bg-[#4459a8] shadow-sm">
                                    <table className="w-full border-collapse" dir="rtl">
                                        <thead>
                                            <tr className="bg-[#4459a8] border-b border-white/30">
                                                <th className="py-2 text-center font-semibold">الإجمالي</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className="bg-[#2f417a] hover:bg-[#3b4e93] transition">
                                                <td className="py-2 text-center">
                                                    <span className="inline-flex items-center justify-center min-w-[2.25rem] px-2 h-6 rounded-full bg-white/20">
                                                        {selectedMonthTasks?.tasks?.length}
                                                    </span>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                {/* === Bottom section (other rows) === */}
                                <div className="overflow-hidden rounded-xl border border-white/30 bg-[#4459a8] shadow-sm">
                                    <table className="w-full border-collapse" dir="rtl">
                                        <tbody>
                                            {[
                                                { label: "إجمالي نسبة الاستكمال", value: `${selectedMonthDetails.finishedPercentage}%` },
                                                { label: "إجمالي مستوى الدقة", value: `${(selectedMonthDetails.avgManagerQuality * selectedMonthDetails.avgReviewerQuality) / 2}%` },
                                                { label: "إجمالي معدل السرعة", value: `${(selectedMonthDetails.avgManagerSpeed * selectedMonthDetails.avgReviewerSpeed) / 2}%` },
                                            ].map((row, index) => (
                                                <tr
                                                    key={index}
                                                    className="bg-[#2f417a] border-t border-white/20 hover:bg-[#3b4e93] transition"
                                                >
                                                    <td className="py-2 text-center">
                                                        <span className="inline-flex items-center justify-center min-w-[2.25rem] px-2 h-6 rounded-full bg-white/20">
                                                            {row.value}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* === Bottom section (other rows) === */}
                                <div className="overflow-hidden rounded-xl border border-white/30 bg-[#4459a8] shadow-sm">
                                    <table className="w-full border-collapse" dir="rtl">
                                        <tbody>
                                            {[
                                                { label: "إجمالي التقييم", value: `${roundNumber((((selectedMonthDetails.avgManagerSpeed + selectedMonthDetails.avgReviewerSpeed) / 2) * 0.3) + (((selectedMonthDetails.avgManagerQuality + selectedMonthDetails.avgReviewerQuality) / 2) * 0.3) + (selectedMonthDetails.finishedPercentage * 0.4))}%` },
                                            ].map((row, index) => (
                                                <tr
                                                    key={index}
                                                    className="bg-[#2f417a] border-t border-white/20 hover:bg-[#3b4e93] transition"
                                                >
                                                    <td className="py-2 text-center">
                                                        <span className="inline-flex items-center justify-center min-w-[2.25rem] px-2 h-6 rounded-full bg-white/20">
                                                            {row.value}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TmsDashboardTables;