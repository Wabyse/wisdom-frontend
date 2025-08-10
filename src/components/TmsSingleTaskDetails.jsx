import TmsDoubleDataTemplate from "./TmsDoubleDataTemplate";
import TmsSingleDataTemplate from "./TmsSingleDataTemplate";

const TmsSingleTaskDetails = ({ value1="------", value2="------", value3="------", value4="------", value5="------", value6="------", value7="------", value8="------", value9="------", value10="------", value11="------", value12="------", value13="------", value14="------", value15="------", value16="------" }) => {
    return (
        <div className="border-black border-2 rounded flex justify-between p-3 w-[95%] mt-2">
            <div className="w-[25%]">
                <div className="bg-gradient-to-b from-blue-900 to-blue-950 text-white rounded p-2 text-center">
                    التقييمات
                </div>
                <div className="flex gap-2 mt-2">
                    <TmsSingleDataTemplate
                        title="تقييم المدير"
                        value={value1}
                        cardAdditionalCSS="w-[50%] min-w-fit"
                    />
                    <TmsSingleDataTemplate
                        title="تقييم الموقف التنفيذي"
                        value={value2}
                        cardAdditionalCSS="w-[50%] min-w-fit"
                    />
                </div>
                <div className="flex gap-2 mt-2">
                    <TmsSingleDataTemplate
                        title="اجمالي التقييم"
                        value={value3}
                        cardAdditionalCSS="w-[50%] min-w-fit"
                    />
                    <TmsSingleDataTemplate
                        title="تقييم المسؤل"
                        value={value4}
                        cardAdditionalCSS="w-[50%] min-w-fit"
                    />
                </div>
                <div className="flex gap-2 mt-2">
                    <TmsSingleDataTemplate
                        title="ملاحظات المهمة"
                        value={value5}
                        cardAdditionalCSS="w-full"
                    />
                </div>
            </div>
            <div className="w-[12%]">
                <div className="bg-gradient-to-b from-blue-900 to-blue-950 text-white rounded p-2 text-center">
                    الموقف التنفيذي
                </div>
                <div className="flex gap-2 mt-2">
                    <TmsSingleDataTemplate
                        title="نسبة اكتمال المهمة"
                        value={value6}
                        cardAdditionalCSS="w-full"
                    />
                </div>
                <div className="flex gap-2 mt-2">
                    <TmsSingleDataTemplate
                        title="موقف التسليم"
                        value={value7}
                        cardAdditionalCSS="w-full"
                        valueAdditionalCSS=" h-36 flex items-center justify-center"
                    />
                </div>
            </div>
            <div className="w-[12%]">
                <div className="bg-gradient-to-b from-blue-900 to-blue-950 text-white rounded p-2 text-center">
                    التواريخ و التوقيت
                </div>
                <div className="flex gap-2 mt-2">
                    <TmsSingleDataTemplate
                        title="تاريخ و توقيت البدء"
                        value={value8}
                        cardAdditionalCSS="w-full"
                        valueAdditionalCSS="text-[15px]"
                    />
                </div>
                <div className="flex gap-2 mt-2">
                    <TmsSingleDataTemplate
                        title="تاريخ و توقيت الانتهاء"
                        value={value9}
                        cardAdditionalCSS="w-full"
                        valueAdditionalCSS="text-[15px]"
                    />
                </div>
                <div className="flex gap-2 mt-2">
                    <TmsSingleDataTemplate
                        title="تاريخ و توقيت التسليم"
                        value={value10}
                        cardAdditionalCSS="w-full"
                        valueAdditionalCSS="text-[15px]"
                    />
                </div>
            </div>
            <div className="w-[45%]">
                <div className="bg-gradient-to-b from-blue-900 to-blue-950 text-white rounded p-2 text-center">
                    البيانات الاساسية للمهمة
                </div>
                <div className="flex gap-2 mt-2">
                    <TmsSingleDataTemplate
                        title="التصنيف الفرعي للمهمة"
                        value={value11}
                        cardAdditionalCSS="min-w-fit w-[25%]"
                    />
                    <TmsSingleDataTemplate
                        title="التصنيف"
                        value={value12}
                        cardAdditionalCSS="min-w-fit w-[25%]"
                    />
                    <TmsSingleDataTemplate
                        title="حجم المهمة"
                        value={value13}
                        cardAdditionalCSS="min-w-fit w-[25%]"
                    />
                    <TmsSingleDataTemplate
                        title="الاولوية"
                        value={value14}
                        cardAdditionalCSS="min-w-fit w-[25%]"
                    />
                </div>
                <div className="flex gap-2 mt-2">
                    <TmsDoubleDataTemplate
                        title="المرفقات"
                        value={value15}
                        cardAdditionalCSS="min-w-[20%] w-[50%] max-w-[50%] overflow-y-auto"
                        valueAdditionalCSS="h-36 flex items-center justify-center"
                    />
                    <TmsSingleDataTemplate
                        title="وصف المهمة"
                        value={value16}
                        cardAdditionalCSS="min-w-[50%] w-[50%] max-w-[80%] overflow-y-auto"
                        valueAdditionalCSS="h-36 flex items-center justify-center"
                    />
                </div>
            </div>
        </div>
    )
}

export default TmsSingleTaskDetails;