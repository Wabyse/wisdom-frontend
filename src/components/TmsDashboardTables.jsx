import React, { useEffect, useState } from "react";
import ebdaeduLogo from "../assets/ebad-edu.png";
import wabysLogo from "../assets/wabys.png";
import golLogo from "../assets/Gov.png";
import { NUMBER_TO_ARABIC_MONTHS, ORG_MANAGER_IMG } from "../constants/constants";
import DonutChart from "./DonutChart";
import CustomLineChart from "./CustomLineChart";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { roundNumber } from "../utils/roundNumber";

const TmsDashboardTables = ({ onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/60 flex overflow-y-auto justify-center gap-6 items-end z-50">
            <div className="relative bg-gray-300 w-[95%] h-[84vh] mb-4 flex flex-col p-4 items-center">
                <button
                    onClick={onClose}
                    className="absolute top-2 left-2 text-white bg-gray-700 hover:bg-gray-800 w-8 h-8 flex justify-center items-center text-2xl font-bold cursor-pointer z-50"
                >
                    <FontAwesomeIcon icon={faXmark} />
                </button>
                <div className="overflow-x-auto rounded-lg border border-gray-400 w-[95%]" dir="rtl">
                    <table className="w-full text-center text-xs text-white border-collapse">
                        <thead>
                            <tr className="bg-[#5268b1] border border-gray-400">
                                <th rowSpan="2" className="border border-gray-400 px-3 py-2 w-[10%]">
                                    البند
                                </th>
                                <th colSpan="3" className="border border-gray-400 px-3 py-2 w-[22%]">
                                    أولوية قصوى <br /> (%90-%100)
                                </th>
                                <th colSpan="3" className="border border-gray-400 px-3 py-2 w-[22%]">
                                    أولوية متوسطة <br /> (%70-%89)
                                </th>
                                <th colSpan="3" className="border border-gray-400 px-3 py-2 w-[22%]">
                                    أولوية عادية <br /> (%01-%69)
                                </th>
                                <th rowSpan="2" className="border border-gray-400 px-3 py-2 w-[8%]">
                                    الإجمالي
                                </th>
                            </tr>
                            <tr className="bg-[#5268b1] border border-gray-400">
                                <th className="border border-gray-400 px-3 py-2">المهام الكبيرة</th>
                                <th className="border border-gray-400 px-3 py-2">المهام المتوسطة</th>
                                <th className="border border-gray-400 px-3 py-2">المهام الصغيرة</th>
                                <th className="border border-gray-400 px-3 py-2">المهام الكبيرة</th>
                                <th className="border border-gray-400 px-3 py-2">المهام المتوسطة</th>
                                <th className="border border-gray-400 px-3 py-2">المهام الصغيرة</th>
                                <th className="border border-gray-400 px-3 py-2">المهام الكبيرة</th>
                                <th className="border border-gray-400 px-3 py-2">المهام المتوسطة</th>
                                <th className="border border-gray-400 px-3 py-2">المهام الصغيرة</th>
                            </tr>
                        </thead>

                        <tbody>
                            {/* Row 1 */}
                            <tr className="bg-[#2f417a] border border-gray-400">
                                <td className="border border-gray-400 px-3 py-2 font-semibold">العدد</td>
                                <td className="border border-gray-400 px-3 py-2">100</td>
                                <td className="border border-gray-400 px-3 py-2">250</td>
                                <td className="border border-gray-400 px-3 py-2">400</td>
                                <td className="border border-gray-400 px-3 py-2">100</td>
                                <td className="border border-gray-400 px-3 py-2">300</td>
                                <td className="border border-gray-400 px-3 py-2">400</td>
                                <td className="border border-gray-400 px-3 py-2">100</td>
                                <td className="border border-gray-400 px-3 py-2">350</td>
                                <td className="border border-gray-400 px-3 py-2">400</td>
                                <td className="border border-gray-400 px-3 py-2 font-bold text-[#7db8ff]">850</td>
                            </tr>

                            {/* Row 2 */}
                            <tr className="bg-[#2f417a] border border-gray-400">
                                <td className="border border-gray-400 px-3 py-2 font-semibold">نسبة الاكتمال</td>
                                <td className="border border-gray-400 px-3 py-2">80%</td>
                                <td className="border border-gray-400 px-3 py-2">70%</td>
                                <td className="border border-gray-400 px-3 py-2">60%</td>
                                <td className="border border-gray-400 px-3 py-2">80%</td>
                                <td className="border border-gray-400 px-3 py-2">70%</td>
                                <td className="border border-gray-400 px-3 py-2">65%</td>
                                <td className="border border-gray-400 px-3 py-2">80%</td>
                                <td className="border border-gray-400 px-3 py-2">70%</td>
                                <td className="border border-gray-400 px-3 py-2">65%</td>
                                <td className="border border-gray-400 px-3 py-2 font-bold">65%</td>
                            </tr>

                            {/* Row 3 */}
                            <tr className="bg-[#2f417a] border border-gray-400">
                                <td className="border border-gray-400 px-3 py-2 font-semibold">مستوى الدقة</td>
                                <td className="border border-gray-400 px-3 py-2 text-red-400 font-bold">%50</td>
                                <td className="border border-gray-400 px-3 py-2">%70</td>
                                <td className="border border-gray-400 px-3 py-2">%80</td>
                                <td className="border border-gray-400 px-3 py-2 text-red-400 font-bold">%50</td>
                                <td className="border border-gray-400 px-3 py-2">%70</td>
                                <td className="border border-gray-400 px-3 py-2">%80</td>
                                <td className="border border-gray-400 px-3 py-2 text-red-400 font-bold">%50</td>
                                <td className="border border-gray-400 px-3 py-2">%70</td>
                                <td className="border border-gray-400 px-3 py-2">%80</td>
                                <td className="border border-gray-400 px-3 py-2 font-bold">%80</td>
                            </tr>

                            {/* Row 4 */}
                            <tr className="bg-[#2f417a] border border-gray-400">
                                <td className="border border-gray-400 px-3 py-2 font-semibold">معدل السرعة</td>
                                <td className="border border-gray-400 px-3 py-2 text-red-500 font-bold">%45</td>
                                <td className="border border-gray-400 px-3 py-2">%65</td>
                                <td className="border border-gray-400 px-3 py-2">%65</td>
                                <td className="border border-gray-400 px-3 py-2 text-red-500 font-bold">%55</td>
                                <td className="border border-gray-400 px-3 py-2">%65</td>
                                <td className="border border-gray-400 px-3 py-2">%65</td>
                                <td className="border border-gray-400 px-3 py-2 text-red-500 font-bold">%65</td>
                                <td className="border border-gray-400 px-3 py-2">%65</td>
                                <td className="border border-gray-400 px-3 py-2">%65</td>
                                <td className="border border-gray-400 px-3 py-2 font-bold">%45</td>
                            </tr>

                            {/* Row 5 */}
                            <tr className="bg-[#2f417a] border border-gray-400">
                                <td className="border border-gray-400 px-3 py-2 font-semibold">إجمالي التقييم</td>
                                <td className="border border-gray-400 px-3 py-2 text-green-500 font-bold">%84</td>
                                <td className="border border-gray-400 px-3 py-2">%70</td>
                                <td className="border border-gray-400 px-3 py-2">%70</td>
                                <td className="border border-gray-400 px-3 py-2 text-green-500 font-bold">%75</td>
                                <td className="border border-gray-400 px-3 py-2">%70</td>
                                <td className="border border-gray-400 px-3 py-2">%70</td>
                                <td className="border border-gray-400 px-3 py-2 text-green-500 font-bold">%90</td>
                                <td className="border border-gray-400 px-3 py-2">%70</td>
                                <td className="border border-gray-400 px-3 py-2">%70</td>
                                <td className="border border-gray-400 px-3 py-2 font-bold text-green-500">%84</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="flex items-center justify-evenly w-full h-72">
                    <div className="flex py-2 px-4 rounded-2xl shadow gap-2 bg-white h-12">
                        <h1>مهمة</h1>
                        <h1>2350</h1>
                    </div>
                    <div className="w-0 border-black border-l-2 h-32" />
                    <div className="w-3/5 rounded-2xl overflow-hidden border border-white/30">
                        <table className="w-full table-fixed border-collapse text-xs text-white" dir="rtl">
                            <thead>
                                <tr className="bg-[#5268b1] border border-white/30">
                                    <th className="py-2 text-center font-semibold border-l border-white/40">البند</th>
                                    <th className="py-2 text-center font-semibold border-l border-white/40">أولوية قصوى</th>
                                    <th className="py-2 text-center font-semibold border-l border-white/40">أولوية متوسطة</th>
                                    <th className="py-2 text-center font-semibold border-l border-white/40">أولوية عادية</th>
                                    <th className="py-2 text-center font-semibold">الإجمالي</th>
                                </tr>
                            </thead>

                            <tbody>
                                {[
                                    "إجمالي العدد",
                                    "إجمالي نسبة الاستكمال",
                                    "إجمالي مستوى الدقة",
                                    "إجمالي معدل السرعة",
                                    "إجمالي التقييم",
                                ].map((label, index) => (
                                    <tr
                                        key={index}
                                        className="bg-[#2f417a] border-t border-white/30 hover:bg-[#3b4e93] transition"
                                    >
                                        <td className="py-2 text-center border-l border-white/30">
                                            <span className="inline-flex items-center justify-center min-w-[3rem] px-2 h-6 rounded-full text-xs text-white">
                                                {label}
                                            </span>
                                        </td>

                                        {[0, 0, 0, 0].map((value, i) => (
                                            <td key={i} className="py-2 text-center border-l border-white/30">
                                                <span className="inline-flex items-center justify-center min-w-[2.25rem] px-2 h-6 rounded-full text-white">
                                                    {value}
                                                </span>
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="w-0 border-black border-l-2 h-32" />
                    <div>
                        <DonutChart value={60} size={90} color='url(#circularBlueGradient)' bg='#23263a' textColor='#fff' />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TmsDashboardTables;