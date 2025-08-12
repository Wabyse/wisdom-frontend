import TmsChatAccess from "./TmsChatAccess";
import TmsDoubleDataTemplate from "./TmsDoubleDataTemplate";
import TmsSingleDataTemplate from "./TmsSingleDataTemplate";
import { useLanguage } from "../context/LanguageContext";

const TmsSubTaskDetails = ({
    value1 = "------", value2 = "------", value3 = "------", value4 = "------",
    value5 = "------", value6 = "------", value7 = "------", value8 = "------",
    value9 = "------", value10 = "------", value11 = "------", value12 = "------",
    value13 = "------", value14 = "------", value15 = "------", value16 = "------",
    value17 = "------", value18 = "------",
}) => {
    const { language } = useLanguage();

    return (
        // make the card a column so we can add an expandable area below
            <div className="border-black border-2 rounded flex flex-col w-[90%] mt-2 pt-2 ml-2 self-center">

                {/* main content (your three columns) */}
                <div className="px-3 pb-3 flex justify-between">
                    <div className="w-[25%]">
                        <div className="bg-gradient-to-b from-slate-400 to-slate-600 text-white rounded p-2 text-center">
                            التقييمات
                        </div>
                        <div className="flex gap-2 mt-2">
                            <TmsSingleDataTemplate titleAdditionalCSS="bg-gradient-to-b from-slate-400 to-slate-600" title="تقييم المدير" value={value1} cardAdditionalCSS="w-[50%] min-w-fit" />
                            <TmsSingleDataTemplate titleAdditionalCSS="bg-gradient-to-b from-slate-400 to-slate-600" title="تقييم الموقف التنفيذي" value={value2} cardAdditionalCSS="w-[50%] min-w-fit" />
                        </div>
                        <div className="flex gap-2 mt-2">
                            <TmsSingleDataTemplate titleAdditionalCSS="bg-gradient-to-b from-slate-400 to-slate-600" title="اجمالي التقييم" value={value3} cardAdditionalCSS="w-[50%] min-w-fit" />
                            <TmsSingleDataTemplate titleAdditionalCSS="bg-gradient-to-b from-slate-400 to-slate-600" title="تقييم المسؤل" value={value4} cardAdditionalCSS="w-[50%] min-w-fit" />
                        </div>
                        <div className="flex gap-2 mt-2">
                            <TmsChatAccess titleAdditionalCSS="bg-gradient-to-b from-slate-400 to-slate-600" title="المحادثة" value={value5} cardAdditionalCSS="w-full" />
                        </div>
                    </div>

                    <div className="w-[12%]">
                        <div className="bg-gradient-to-b from-slate-400 to-slate-600 text-white rounded p-2 text-center">
                            الموقف التنفيذي
                        </div>
                        <div className="flex gap-2 mt-2">
                            <TmsSingleDataTemplate titleAdditionalCSS="bg-gradient-to-b from-slate-400 to-slate-600" title="نسبة اكتمال المهمة" value={value6} cardAdditionalCSS="w-full" />
                        </div>
                        <div className="flex gap-2 mt-2">
                            <TmsSingleDataTemplate titleAdditionalCSS="bg-gradient-to-b from-slate-400 to-slate-600" title="موقف التسليم" value={value7} cardAdditionalCSS="w-full" valueAdditionalCSS=" h-36 flex items-center justify-center" />
                        </div>
                    </div>

                    <div className="w-[12%]">
                        <div className="bg-gradient-to-b from-slate-400 to-slate-600 text-white rounded p-2 text-center">
                            التواريخ و التوقيت
                        </div>
                        <div className="flex gap-2 mt-2">
                            <TmsSingleDataTemplate titleAdditionalCSS="bg-gradient-to-b from-slate-400 to-slate-600" title="تاريخ و توقيت البدء" value={value8} cardAdditionalCSS="w-full" valueAdditionalCSS="text-[15px]" />
                        </div>
                        <div className="flex gap-2 mt-2">
                            <TmsSingleDataTemplate titleAdditionalCSS="bg-gradient-to-b from-slate-400 to-slate-600" title="تاريخ و توقيت الانتهاء" value={value9} cardAdditionalCSS="w-full" valueAdditionalCSS="text-[15px]" />
                        </div>
                        <div className="flex gap-2 mt-2">
                            <TmsSingleDataTemplate titleAdditionalCSS="bg-gradient-to-b from-slate-400 to-slate-600" title="تاريخ و توقيت التسليم" value={value10} cardAdditionalCSS="w-full" valueAdditionalCSS="text-[15px]" />
                        </div>
                    </div>

                    <div className="w-[45%]">
                        <div className="bg-gradient-to-b from-slate-400 to-slate-600 text-white rounded p-2 text-center">
                            البيانات الاساسية للمهمة الفرعية
                        </div>
                        <div className="flex gap-2 mt-2">
                            <TmsSingleDataTemplate titleAdditionalCSS="bg-gradient-to-b from-slate-400 to-slate-600" title="اسم المنفذ" value={value17} cardAdditionalCSS="w-[75%] overflow-y-auto" valueAdditionalCSS="flex items-center justify-center" />
                            <TmsSingleDataTemplate titleAdditionalCSS="bg-gradient-to-b from-slate-400 to-slate-600" title="الجهة" value={value18} cardAdditionalCSS="w-[25%] overflow-y-auto" valueAdditionalCSS="flex items-center justify-center" />
                        </div>
                        <div className="flex gap-2 mt-2">
                            <TmsSingleDataTemplate titleAdditionalCSS="bg-gradient-to-b from-slate-400 to-slate-600" title="التصنيف الفرعي للمهمة" value={value11} cardAdditionalCSS="min-w-fit w-[25%]" />
                            <TmsSingleDataTemplate titleAdditionalCSS="bg-gradient-to-b from-slate-400 to-slate-600" title="التصنيف" value={value12} cardAdditionalCSS="min-w-fit w-[25%]" />
                            <TmsSingleDataTemplate titleAdditionalCSS="bg-gradient-to-b from-slate-400 to-slate-600" title="حجم المهمة" value={value13} cardAdditionalCSS="min-w-fit w-[25%]" />
                            <TmsSingleDataTemplate titleAdditionalCSS="bg-gradient-to-b from-slate-400 to-slate-600" title="الاولوية" value={value14} cardAdditionalCSS="min-w-fit w-[25%]" />
                        </div>
                        <div className="flex gap-2 mt-2">
                            <TmsDoubleDataTemplate titleAdditionalCSS="bg-gradient-to-b from-slate-400 to-slate-600" title="المرفقات" value={value15} cardAdditionalCSS="min-w-[20%] w-[50%] max-w-[50%] overflow-y-auto" valueAdditionalCSS="h-32 flex items-center justify-center" />
                            <TmsSingleDataTemplate titleAdditionalCSS="bg-gradient-to-b from-slate-400 to-slate-600" title="وصف المهمة" value={value16} cardAdditionalCSS="min-w-[50%] w-[50%] max-w-[80%] overflow-y-auto" valueAdditionalCSS="h-32 flex items-center justify-center" />
                        </div>
                    </div>
                </div>
            </div>
    );
};

export default TmsSubTaskDetails;