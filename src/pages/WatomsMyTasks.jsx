import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSheetPlastic } from "@fortawesome/free-solid-svg-icons";
import NewNavbar from "../components/NewNavbar";

const WatomsMyTasks = () => {
    return (
        <>
            <NewNavbar
                printStatus={true}
                shareStatus={false}
            />
            <div className="flex flex-col gap-8 items-center min-h-[88vh] h-fit bg-[#0a183d] pt-8 text-white">
                <div className="flex w-[95%] justify-between items-center">
                    <div className="flex flex-col">
                        <div className={`text-white text-center rounded p-2 bg-[#2f417a]`}>اجمالي تقييم المهام</div>
                        <div className={`p-2 bg-white text-black rounded text-center font-bold mt-2`}>85%</div>
                    </div>
                    <div className="w-0 border-white border-l-2 h-12" />
                    <div className="flex gap-2">
                        <div className="flex flex-col">
                            <div className={`text-white text-center rounded p-2 bg-[#2f417a]`}>اولوية عادية</div>
                            <div className={`p-2 bg-white text-black rounded text-center font-bold mt-2`}>70</div>
                        </div>
                        <div className="flex flex-col">
                            <div className={`text-white text-center rounded p-2 bg-[#2f417a]`}>اولوية متوسطة</div>
                            <div className={`p-2 bg-white text-black rounded text-center font-bold mt-2`}>20</div>
                        </div>
                        <div className="flex flex-col">
                            <div className={`text-white text-center rounded p-2 bg-[#2f417a]`}>اولوية قصوي</div>
                            <div className={`p-2 bg-white text-black rounded text-center font-bold mt-2`}>40</div>
                        </div>
                    </div>
                    <div className="w-0 border-white border-l-2 h-12" />
                    <div className="flex gap-2">
                        <div className="flex flex-col">
                            <div className={`text-white text-center rounded p-2 bg-[#2f417a]`}>مهمة صغيرة</div>
                            <div className={`p-2 bg-white text-black rounded text-center font-bold mt-2`}>24</div>
                        </div>
                        <div className="flex flex-col">
                            <div className={`text-white text-center rounded p-2 bg-[#2f417a]`}>مهمة متوسطة</div>
                            <div className={`p-2 bg-white text-black rounded text-center font-bold mt-2`}>20</div>
                        </div>
                        <div className="flex flex-col">
                            <div className={`text-white text-center rounded p-2 bg-[#2f417a]`}>مهمة كبيرة</div>
                            <div className={`p-2 bg-white text-black rounded text-center font-bold mt-2`}>33</div>
                        </div>
                    </div>
                    <div className="w-0 border-white border-l-2 h-12" />
                    <div className="flex flex-col">
                        <div className={`text-white text-center rounded p-2 bg-[#2f417a]`}>اجمالي عدد المهام</div>
                        <div className={`p-2 bg-white text-black rounded text-center font-bold mt-2`}>77</div>
                    </div>
                </div>
                <div className="h-0 border-t-2 border-white w-[60%]" />
                <div className="flex flex-col w-[95%] gap-2">
                    <div className="flex gap-2 w-full" dir="rtl">
                        <div className={`text-white text-center rounded p-2 bg-[#5268b1] flex-1 text-sm max-w-20`}>م</div>
                        <div className={`text-white text-center rounded p-2 bg-[#5268b1] flex-1 text-sm`}>الاولوية</div>
                        <div className={`text-white text-center rounded p-2 bg-[#5268b1] flex-1 text-sm`}>حجم المهمة</div>
                        <div className={`text-white text-center rounded p-2 bg-[#5268b1] flex-1 text-sm`}>التصنيف</div>
                        <div className={`text-white text-center rounded p-2 bg-[#5268b1] flex-1 text-sm`}>تاريخ و توقيت البدء</div>
                        <div className={`text-white text-center rounded p-2 bg-[#5268b1] flex-1 text-sm`}>تاريخ و توقيت التسليم</div>
                        <div className={`text-white text-center rounded p-2 bg-[#5268b1] flex-1 text-sm`}>نسبة اكتمال المهمة</div>
                        <div className={`text-white text-center rounded p-2 bg-[#5268b1] flex-1 text-sm`}>تقييم الموقف التنفيذي</div>
                        <div className={`text-white text-center rounded p-2 bg-[#5268b1] flex-1 text-sm`}>اجمالي التقييم</div>
                    </div>
                    <div className="flex gap-2 w-full" dir="rtl">
                        <div className={`relative text-black text-center rounded p-2 bg-white flex-1 text-sm flex justify-center items-center max-w-20`}>
                            1
                            <div className="absolute right-2"><FontAwesomeIcon icon={faPlus} className="text-lg" /></div>
                        </div>
                        <div className={`text-black text-center rounded p-2 bg-white flex-1 text-sm flex justify-center items-center`}>قصوي</div>
                        <div className={`text-black text-center rounded p-2 bg-white flex-1 text-sm flex justify-center items-center`}>مهمة متوسطة</div>
                        <div className={`text-black text-center rounded p-2 bg-white flex-1 text-sm flex justify-center items-center`}>مشروع تطوير المراكز</div>
                        <div className={`text-black text-center rounded p-2 bg-white flex-1 text-sm flex justify-center items-center`}>2025 - 03 - 04 12:03:12</div>
                        <div className={`text-black text-center rounded p-2 bg-white flex-1 text-sm flex justify-center items-center`}>2025 - 03 - 09 12:03:12</div>
                        <div className={`text-black text-center rounded p-2 bg-white flex-1 text-sm flex justify-center items-center`}>50%</div>
                        <div className={`text-black text-center rounded p-2 bg-white flex-1 text-sm flex justify-center items-center`}>اثناء المدة غير مكتمل</div>
                        <div className={`text-black text-center rounded p-2 bg-white flex-1 text-sm flex justify-center items-center`}>50%</div>
                    </div>
                    <div className="flex gap-2 w-full" dir="rtl">
                        <div className={`relative text-black text-center rounded p-2 bg-white flex-1 text-sm flex justify-center items-center max-w-20`}>
                            1
                            <div className="absolute right-2"><FontAwesomeIcon icon={faPlus} className="text-lg" /></div>
                        </div>
                        <div className={`text-black text-center rounded p-2 bg-white flex-1 text-sm flex justify-center items-center`}>قصوي</div>
                        <div className={`text-black text-center rounded p-2 bg-white flex-1 text-sm flex justify-center items-center`}>مهمة متوسطة</div>
                        <div className={`text-black text-center rounded p-2 bg-white flex-1 text-sm flex justify-center items-center`}>مشروع تطوير المراكز</div>
                        <div className={`text-black text-center rounded p-2 bg-white flex-1 text-sm flex justify-center items-center`}>2025 - 03 - 04 12:03:12</div>
                        <div className={`text-black text-center rounded p-2 bg-white flex-1 text-sm flex justify-center items-center`}>2025 - 03 - 09 12:03:12</div>
                        <div className={`text-black text-center rounded p-2 bg-white flex-1 text-sm flex justify-center items-center`}>50%</div>
                        <div className={`text-black text-center rounded p-2 bg-white flex-1 text-sm flex justify-center items-center`}>اثناء المدة غير مكتمل</div>
                        <div className={`text-black text-center rounded p-2 bg-white flex-1 text-sm flex justify-center items-center`}>50%</div>
                    </div>
                    <div className="flex gap-2 w-full" dir="rtl">
                        <div className={`relative text-black text-center rounded p-2 bg-white flex-1 text-sm flex justify-center items-center max-w-20`}>
                            1
                            <div className="absolute right-2"><FontAwesomeIcon icon={faPlus} className="text-lg" /></div>
                        </div>
                        <div className={`text-black text-center rounded p-2 bg-white flex-1 text-sm flex justify-center items-center`}>قصوي</div>
                        <div className={`text-black text-center rounded p-2 bg-white flex-1 text-sm flex justify-center items-center`}>مهمة متوسطة</div>
                        <div className={`text-black text-center rounded p-2 bg-white flex-1 text-sm flex justify-center items-center`}>مشروع تطوير المراكز</div>
                        <div className={`text-black text-center rounded p-2 bg-white flex-1 text-sm flex justify-center items-center`}>2025 - 03 - 04 12:03:12</div>
                        <div className={`text-black text-center rounded p-2 bg-white flex-1 text-sm flex justify-center items-center`}>2025 - 03 - 09 12:03:12</div>
                        <div className={`text-black text-center rounded p-2 bg-white flex-1 text-sm flex justify-center items-center`}>50%</div>
                        <div className={`text-black text-center rounded p-2 bg-white flex-1 text-sm flex justify-center items-center`}>اثناء المدة غير مكتمل</div>
                        <div className={`text-black text-center rounded p-2 bg-white flex-1 text-sm flex justify-center items-center`}>50%</div>
                    </div>
                    <div className="flex gap-2 w-full" dir="rtl">
                        <div className={`relative text-black text-center rounded p-2 bg-white flex-1 text-sm flex justify-center items-center max-w-20`}>
                            1
                            <div className="absolute right-2"><FontAwesomeIcon icon={faPlus} className="text-lg" /></div>
                        </div>
                        <div className={`text-black text-center rounded p-2 bg-white flex-1 text-sm flex justify-center items-center`}>قصوي</div>
                        <div className={`text-black text-center rounded p-2 bg-white flex-1 text-sm flex justify-center items-center`}>مهمة متوسطة</div>
                        <div className={`text-black text-center rounded p-2 bg-white flex-1 text-sm flex justify-center items-center`}>مشروع تطوير المراكز</div>
                        <div className={`text-black text-center rounded p-2 bg-white flex-1 text-sm flex justify-center items-center`}>2025 - 03 - 04 12:03:12</div>
                        <div className={`text-black text-center rounded p-2 bg-white flex-1 text-sm flex justify-center items-center`}>2025 - 03 - 09 12:03:12</div>
                        <div className={`text-black text-center rounded p-2 bg-white flex-1 text-sm flex justify-center items-center`}>50%</div>
                        <div className={`text-black text-center rounded p-2 bg-white flex-1 text-sm flex justify-center items-center`}>اثناء المدة غير مكتمل</div>
                        <div className={`text-black text-center rounded p-2 bg-white flex-1 text-sm flex justify-center items-center`}>50%</div>
                    </div>
                    <div className="flex gap-2 w-full" dir="rtl">
                        <div className={`relative text-black text-center rounded p-2 bg-white flex-1 text-sm flex justify-center items-center max-w-20`}>
                            1
                            <div className="absolute right-2"><FontAwesomeIcon icon={faPlus} className="text-lg" /></div>
                        </div>
                        <div className={`text-black text-center rounded p-2 bg-white flex-1 text-sm flex justify-center items-center`}>قصوي</div>
                        <div className={`text-black text-center rounded p-2 bg-white flex-1 text-sm flex justify-center items-center`}>مهمة متوسطة</div>
                        <div className={`text-black text-center rounded p-2 bg-white flex-1 text-sm flex justify-center items-center`}>مشروع تطوير المراكز</div>
                        <div className={`text-black text-center rounded p-2 bg-white flex-1 text-sm flex justify-center items-center`}>2025 - 03 - 04 12:03:12</div>
                        <div className={`text-black text-center rounded p-2 bg-white flex-1 text-sm flex justify-center items-center`}>2025 - 03 - 09 12:03:12</div>
                        <div className={`text-black text-center rounded p-2 bg-white flex-1 text-sm flex justify-center items-center`}>50%</div>
                        <div className={`text-black text-center rounded p-2 bg-white flex-1 text-sm flex justify-center items-center`}>اثناء المدة غير مكتمل</div>
                        <div className={`text-black text-center rounded p-2 bg-white flex-1 text-sm flex justify-center items-center`}>50%</div>
                    </div>
                    <div className="flex gap-2 w-full" dir="rtl">
                        <div className={`relative text-black text-center rounded p-2 bg-white flex-1 text-sm flex justify-center items-center max-w-20`}>
                            1
                            <div className="absolute right-2"><FontAwesomeIcon icon={faPlus} className="text-lg" /></div>
                        </div>
                        <div className={`text-black text-center rounded p-2 bg-white flex-1 text-sm flex justify-center items-center`}>قصوي</div>
                        <div className={`text-black text-center rounded p-2 bg-white flex-1 text-sm flex justify-center items-center`}>مهمة متوسطة</div>
                        <div className={`text-black text-center rounded p-2 bg-white flex-1 text-sm flex justify-center items-center`}>مشروع تطوير المراكز</div>
                        <div className={`text-black text-center rounded p-2 bg-white flex-1 text-sm flex justify-center items-center`}>2025 - 03 - 04 12:03:12</div>
                        <div className={`text-black text-center rounded p-2 bg-white flex-1 text-sm flex justify-center items-center`}>2025 - 03 - 09 12:03:12</div>
                        <div className={`text-black text-center rounded p-2 bg-white flex-1 text-sm flex justify-center items-center`}>50%</div>
                        <div className={`text-black text-center rounded p-2 bg-white flex-1 text-sm flex justify-center items-center`}>اثناء المدة غير مكتمل</div>
                        <div className={`text-black text-center rounded p-2 bg-white flex-1 text-sm flex justify-center items-center`}>50%</div>
                    </div>
                    <div className="flex gap-2 w-full" dir="rtl">
                        <div className={`relative text-black text-center rounded p-2 bg-white flex-1 text-sm flex justify-center items-center max-w-20`}>
                            1
                            <div className="absolute right-2"><FontAwesomeIcon icon={faPlus} className="text-lg" /></div>
                        </div>
                        <div className={`text-black text-center rounded p-2 bg-white flex-1 text-sm flex justify-center items-center`}>قصوي</div>
                        <div className={`text-black text-center rounded p-2 bg-white flex-1 text-sm flex justify-center items-center`}>مهمة متوسطة</div>
                        <div className={`text-black text-center rounded p-2 bg-white flex-1 text-sm flex justify-center items-center`}>مشروع تطوير المراكز</div>
                        <div className={`text-black text-center rounded p-2 bg-white flex-1 text-sm flex justify-center items-center`}>2025 - 03 - 04 12:03:12</div>
                        <div className={`text-black text-center rounded p-2 bg-white flex-1 text-sm flex justify-center items-center`}>2025 - 03 - 09 12:03:12</div>
                        <div className={`text-black text-center rounded p-2 bg-white flex-1 text-sm flex justify-center items-center`}>50%</div>
                        <div className={`text-black text-center rounded p-2 bg-white flex-1 text-sm flex justify-center items-center`}>اثناء المدة غير مكتمل</div>
                        <div className={`text-black text-center rounded p-2 bg-white flex-1 text-sm flex justify-center items-center`}>50%</div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default WatomsMyTasks;