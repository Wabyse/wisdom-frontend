import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { fetchMyTasks } from "../services/tms";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import NewNavbar from "../components/NewNavbar";
import { cairoDate } from "../utils/cairoDate";

const WatomsMyTasks = () => {
    const { userInfo } = useAuth();
    const [allTasks, setAllTasks] = useState([]);

    useEffect(() => {
        const loadMyTasks = async () => {
            const response = await fetchMyTasks(userInfo?.employee_id);
            const allTasksFlat = response.flatMap(month => month.tasks);
            setAllTasks(allTasksFlat)
        }

        loadMyTasks();
    }, [userInfo])
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
                            <div className={`p-2 bg-white text-black rounded text-center font-bold mt-2`}>{allTasks.filter(task => task.importance === "normal").length}</div>
                        </div>
                        <div className="flex flex-col">
                            <div className={`text-white text-center rounded p-2 bg-[#2f417a]`}>اولوية متوسطة</div>
                            <div className={`p-2 bg-white text-black rounded text-center font-bold mt-2`}>{allTasks.filter(task => task.importance === "important").length}</div>
                        </div>
                        <div className="flex flex-col">
                            <div className={`text-white text-center rounded p-2 bg-[#2f417a]`}>اولوية قصوي</div>
                            <div className={`p-2 bg-white text-black rounded text-center font-bold mt-2`}>{allTasks.filter(task => task.importance === "urgent").length}</div>
                        </div>
                    </div>
                    <div className="w-0 border-white border-l-2 h-12" />
                    <div className="flex gap-2">
                        <div className="flex flex-col">
                            <div className={`text-white text-center rounded p-2 bg-[#2f417a]`}>مهمة صغيرة</div>
                            <div className={`p-2 bg-white text-black rounded text-center font-bold mt-2`}>{allTasks.filter(task => task.task_size === "small").length}</div>
                        </div>
                        <div className="flex flex-col">
                            <div className={`text-white text-center rounded p-2 bg-[#2f417a]`}>مهمة متوسطة</div>
                            <div className={`p-2 bg-white text-black rounded text-center font-bold mt-2`}>{allTasks.filter(task => task.task_size === "medium").length}</div>
                        </div>
                        <div className="flex flex-col">
                            <div className={`text-white text-center rounded p-2 bg-[#2f417a]`}>مهمة كبيرة</div>
                            <div className={`p-2 bg-white text-black rounded text-center font-bold mt-2`}>{allTasks.filter(task => task.task_size === "large").length}</div>
                        </div>
                    </div>
                    <div className="w-0 border-white border-l-2 h-12" />
                    <div className="flex flex-col">
                        <div className={`text-white text-center rounded p-2 bg-[#2f417a]`}>اجمالي عدد المهام</div>
                        <div className={`p-2 bg-white text-black rounded text-center font-bold mt-2`}>{allTasks.length}</div>
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
                    {allTasks.map((task, idx) => (
                        <div className="flex gap-2 w-full" dir="rtl">
                            <div className={`relative text-black text-center rounded p-2 bg-white flex-1 text-sm flex justify-center items-center max-w-20`}>
                                {idx + 1}
                                <div className="absolute right-2"><FontAwesomeIcon icon={faPlus} className="text-lg" /></div>
                            </div>
                            <div className={`text-black text-center rounded p-2 bg-white flex-1 text-sm flex justify-center items-center`}>{task.importance}</div>
                            <div className={`text-black text-center rounded p-2 bg-white flex-1 text-sm flex justify-center items-center`}>{task.task_size}</div>
                            <div className={`text-black text-center rounded p-2 bg-white flex-1 text-sm flex justify-center items-center`}>{task.taskSubCategory.name}</div>
                            <div className={`text-black text-center rounded p-2 bg-white flex-1 text-sm flex justify-center items-center`}>{cairoDate(task.start_date)}</div>
                            <div className={`text-black text-center rounded p-2 bg-white flex-1 text-sm flex justify-center items-center`}>{cairoDate(task.end_date)}</div>
                            <div className={`text-black text-center rounded p-2 bg-white flex-1 text-sm flex justify-center items-center`}>{task.status}</div>
                            <div className={`text-black text-center rounded p-2 bg-white flex-1 text-sm flex justify-center items-center`}>اثناء المدة غير مكتمل</div>
                            <div className={`text-black text-center rounded p-2 bg-white flex-1 text-sm flex justify-center items-center`}>50%</div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default WatomsMyTasks;