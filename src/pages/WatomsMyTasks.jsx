import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { fetchMyTasks } from "../services/tms";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faArrowUp, faFilter } from "@fortawesome/free-solid-svg-icons";
import { cairoDate } from "../utils/cairoDate";
import { roundNumber } from "../utils/roundNumber";
import TmsNavbar from "../components/TmsNavbar";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";


const WatomsMyTasks = () => {
    const { userInfo } = useAuth();
    const navigate = useNavigate();
    const clickTimeout = useRef(null);
    const [isFilter, setIsFilter] = useState(false);
    const [allTasks, setAllTasks] = useState([]);
    const [allSubTasks, setAllSubTasks] = useState([]);
    const [selectedMonthDetails, setSelectedMonthDetails] = useState({
        finishedPercentage: 0,
        avgManagerSpeed: 0,
        avgManagerQuality: 0,
        avgReviewerSpeed: 0,
        avgReviewerQuality: 0,
    });
    const [isOpen, setIsOpen] = useState(false);

    const [selectedImportance, setSelectedImportance] = useState([]); // store selected items

    const taskImportance = ["عادية", "متوسطة", "قصوى"]; // example values

    const toggleImportance = (size) => {
        if (selectedImportance.includes(size)) {
            setSelectedImportance(selectedImportance.filter((item) => item !== size));
        } else {
            setSelectedImportance([...selectedImportance, size]);
        }
    };

    const toggleSelectAll = () => {
        if (selectedImportance.length === taskImportance.length) {
            setSelectedImportance([]); // deselect all
        } else {
            setSelectedImportance([...taskImportance]); // select all
        }
    };

    const handleClick = (task) => {
        // If there's already a timeout, it means a double-click occurred
        if (clickTimeout.current) {
            clearTimeout(clickTimeout.current);
            clickTimeout.current = null;
            navigate('/watoms/tms/tasks')
        } else {
            // Otherwise, set a timer for single click
            clickTimeout.current = setTimeout(() => {
                const subTasks = allTasks.filter(task => task.sub_task_id === task.id)
                console.log(subTasks);
                clickTimeout.current = null;
            }, 250); // delay to detect double-click (250ms is a good default)
        }
    };

    const taskStatus = (data) => {
        if (new Date(data.end_date) < new Date() && (data.status !== "submitted" && data.status !== "finished")) {
            return "متاخر - لم يتم التسليم - الملف غير مكتمل"
        } else if (new Date(data.end_date) > new Date() && (data.status !== "submitted" || data.status !== "finished")) {
            return "قيد التنفيذ - الملف غير مكتمل"
        } else if (new Date(data.end_date) < new Date() && (data.status === "submitted")) {
            return "متاخر - لم يتم التسليم - الملف مكتمل"
        } else if (new Date(data.end_date) < new Date() && (data.status === "finished")) {
            return "تم التسليم - في الميعاد - الملف مكتمل"
        }
    }

    const calculateTmsDetails = (data) => {
        const finishedTasksPercentage = data ? data?.filter(task => task.status === "finished" || task.status === "submitted").length : 0;
        const totalTasks = data ? data?.length : 0;
        const avgManagerSpeed = data?.length
            ? roundNumber(
                data.reduce(
                    (sum, task) => sum + (Number(task.manager_speed_percentage) || 0),
                    0
                ) / data.length
            )
            : 0;
        const avgManagerQuality = data?.length
            ? roundNumber(
                data.reduce(
                    (sum, task) => sum + (Number(task.manager_quality_percentage) || 0),
                    0
                ) / data.length
            )
            : 0;
        const avgReviewerSpeed = data?.length
            ? roundNumber(
                data.reduce(
                    (sum, task) => sum + (Number(task.reviewer_speed_percentage) || 0),
                    0
                ) / data.length
            )
            : 0;
        const avgReviewerQuality = data?.length
            ? roundNumber(
                data.reduce(
                    (sum, task) => sum + (Number(task.reviewer_quality_percentage) || 0),
                    0
                ) / data.length
            )
            : 0;

        setSelectedMonthDetails(prev => ({
            ...prev,
            finishedPercentage: finishedTasksPercentage ? roundNumber((Number(finishedTasksPercentage) / Number(totalTasks)) * 100) : 0,
            avgManagerSpeed, avgManagerQuality, avgReviewerSpeed, avgReviewerQuality,
        }));
    }

    const statusScore = (status) => {
        if (status === "not started yet" || status === "in progress") {
            return 0;
        } else if (status === "finished" || status === "submitted") {
            return 100;
        } else if (status === "0" || status === "25" || status === "50" || status === "75") {
            return status
        } else {
            return 0;
        }
    }

    const calculateTaskOverallScore = (data) => {
        const finishedTasksPercentage = statusScore(data.status);
        const avgManagerSpeed = Number(data.manager_speed_percentage);
        const avgManagerQuality = Number(data.manager_quality_percentage);
        const avgReviewerSpeed = Number(data.reviewer_speed_percentage);
        const avgReviewerQuality = Number(data.reviewer_quality_percentage);
        return roundNumber(((finishedTasksPercentage * 0.4) + ((avgManagerSpeed + avgReviewerSpeed) * 0.3) + ((avgManagerQuality + avgReviewerQuality) * 0.3)))
    }

    const statusPercentage = (status) => {
        if (status === "not started yet" || status === "in progress") {
            return "0%";
        } else if (status === "finished" || status === "submitted") {
            return "100%";
        } else if (status === "0" || status === "25" || status === "50" || status === "75") {
            return `${status}%`
        } else {
            return status;
        }
    }

    useEffect(() => {
        const loadMyTasks = async () => {
            const response = await fetchMyTasks(userInfo?.employee_id);
            const allTasksFlat = response.flatMap(month => month.tasks);
            calculateTmsDetails(allTasksFlat)
            setAllTasks(allTasksFlat)
        }

        loadMyTasks();
    }, [userInfo])
    return (
        <>
            <TmsNavbar
                newTaskStatus={true}
                shareStatus={false}
                isFilter={isFilter}
                setIsFilter={setIsFilter}
                filterTmsStatus={true}
                addTaskPage={true}
            />
            <div className="flex flex-col gap-8 items-center min-h-[88vh] h-fit bg-[#0a183d] pt-8 text-white">
                <div className="flex w-[95%] justify-between items-center">
                    <div className="flex flex-col">
                        <div className={`text-white text-center rounded p-2 bg-[#2f417a]`}>اجمالي تقييم المهام</div>
                        <div className={`p-2 bg-white text-black rounded text-center font-bold mt-2 ${roundNumber((((selectedMonthDetails.avgManagerSpeed + selectedMonthDetails.avgReviewerSpeed) / 2) * 0.3) + (((selectedMonthDetails.avgManagerQuality + selectedMonthDetails.avgReviewerQuality) / 2) * 0.3) + (selectedMonthDetails.finishedPercentage * 0.4)) < 50 && "text-red-500 font-bold"}`}>{roundNumber((((selectedMonthDetails.avgManagerSpeed + selectedMonthDetails.avgReviewerSpeed) / 2) * 0.3) + (((selectedMonthDetails.avgManagerQuality + selectedMonthDetails.avgReviewerQuality) / 2) * 0.3) + (selectedMonthDetails.finishedPercentage * 0.4))}%</div>
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
                        <div className="relative z-40 flex-1 bg-[#5268b1] p-2 rounded flex justify-center items-center" onClick={() => setIsOpen(!isOpen)}>
                            <div className={`relative text-white text-center text-xs w-full flex justify-center items-center`}>
                                {isFilter && <FontAwesomeIcon icon={faFilter} className="absolute right-1 text-md text-white cursor-pointer" />}
                                {isFilter && <div className="absolute right-9 w-0 h-3 border-white border-l-2" />}
                                <h1>الاولوية</h1>
                            </div>
                            {isOpen && (
                                <div className="absolute top-full mt-1 left-0 w-full bg-[#2f417a] border border-gray-400 rounded shadow-lg z-50">

                                    {/* Select All */}
                                    <div
                                        className="p-2 flex items-center gap-2 text-white text-sm hover:bg-[#5268b1] cursor-pointer transition-colors"
                                        onClick={toggleSelectAll}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedImportance.length === taskImportance.length}
                                            readOnly
                                            className="accent-[#3fd8ff] cursor-pointer"
                                        />
                                        <span>تحديد الكل</span>
                                    </div>

                                    <div className="border-t border-gray-500" />

                                    {/* Individual Items */}
                                    {taskImportance.map((size, i) => (
                                        <div
                                            key={i}
                                            onClick={() => toggleImportance(size)}
                                            className="px-2 py-1 flex items-center gap-2 text-white text-sm hover:bg-[#5268b1] cursor-pointer transition-colors"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedImportance.includes(size)}
                                                readOnly
                                                className="accent-[#3fd8ff] cursor-pointer"
                                            />
                                            <span>{size}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className={`relative text-white text-center rounded p-2 bg-[#5268b1] flex-1 text-xs flex justify-center items-center`}>
                            {isFilter && <FontAwesomeIcon icon={faFilter} className="absolute right-1 text-md text-white" />}
                            {isFilter && <div className="absolute right-8 w-0 h-3 border-white border-l-2" />}
                            <h1>حجم المهمة</h1>
                        </div>
                        <div className={`relative text-white text-center rounded p-2 bg-[#5268b1] flex-1 text-xs flex justify-center items-center`}>
                            {isFilter && <FontAwesomeIcon icon={faFilter} className="absolute right-1 text-md text-white" />}
                            {isFilter && <div className="absolute right-9 w-0 h-3 border-white border-l-2" />}
                            <h1>التصنيف</h1>
                        </div>
                        <div className={`relative text-white text-center rounded p-2 bg-[#5268b1] flex-1 text-xs flex justify-center items-center gap-[10px]`}>
                            {isFilter && <FontAwesomeIcon icon={faFilter} className="absolute right-1 text-md text-white" />}
                            {isFilter && <div className="w-0 h-3 border-white border-l-2" />}
                            <h1>تاريخ و توقيت البدء</h1>
                            {isFilter && <div className="w-0 h-3 border-white border-l-2" />}
                            {isFilter && <FontAwesomeIcon icon={faArrowDown} className="absolute left-1 bottom-2 text-md text-white" />}
                            {isFilter && <FontAwesomeIcon icon={faArrowUp} className="absolute left-2 top-2 text-md text-white" />}
                        </div>
                        <div className={`relative text-white text-center rounded p-2 bg-[#5268b1] flex-1 text-xs flex justify-center items-center gap-[6px]`}>
                            {isFilter && <FontAwesomeIcon icon={faFilter} className="absolute right-1 text-md text-white" />}
                            {isFilter && <div className="w-0 h-3 border-white border-l-2" />}
                            <h1>تاريخ و توقيت التسليم</h1>
                            {isFilter && <div className="w-0 h-3 border-white border-l-2" />}
                            {isFilter && <FontAwesomeIcon icon={faArrowDown} className="absolute left-1 bottom-2 text-md text-white" />}
                            {isFilter && <FontAwesomeIcon icon={faArrowUp} className="absolute left-2 top-2 text-md text-white" />}
                        </div>
                        <div className={`relative text-white text-center rounded p-2 bg-[#5268b1] flex-1 text-xs flex justify-center items-center`}>
                            {isFilter && <FontAwesomeIcon icon={faFilter} className="absolute right-1 text-md text-white" />}
                            {isFilter && <div className="absolute right-[22px] w-0 h-3 border-white border-l-2" />}
                            <h1>نسبة اكتمال المهمة</h1>
                        </div>
                        <div className={`relative text-white text-center rounded p-2 bg-[#5268b1] flex-1 text-xs flex justify-center items-center`}>
                            {isFilter && <FontAwesomeIcon icon={faFilter} className="absolute right-1 text-md text-white" />}
                            {isFilter && <div className="absolute right-[18px] w-0 h-3 border-white border-l-2" />}
                            <h1>تقييم الموقف التنفيذي</h1>
                        </div>
                        <div className={`relative text-white text-center rounded p-2 bg-[#5268b1] flex-1 text-xs flex justify-center items-center gap-4`}>
                            {isFilter && <FontAwesomeIcon icon={faFilter} className="absolute right-1 text-md text-white" />}
                            {isFilter && <div className="w-0 h-3 border-white border-l-2" />}
                            <h1>اجمالي التقييم</h1>
                            {isFilter && <div className="w-0 h-3 border-white border-l-2" />}
                            {isFilter && <FontAwesomeIcon icon={faArrowDown} className="absolute left-1 bottom-2 text-md text-white" />}
                            {isFilter && <FontAwesomeIcon icon={faArrowUp} className="absolute left-2 top-2 text-md text-white" />}
                        </div>
                    </div>
                    {allTasks.map((task, idx) => (
                        <div
                            key={task.id}
                            className="flex gap-2 w-full"
                            dir="rtl"
                            onClick={() => handleClick(task)}
                        >
                            <div className="relative text-black text-center rounded p-2 bg-white flex-1 text-sm flex justify-center items-center max-w-20">
                                {idx + 1}
                                <div className="absolute right-2">
                                    <FontAwesomeIcon icon={faArrowDown} className="text-lg -rotate-45" />
                                </div>
                            </div>
                            <div className="text-black text-center rounded p-2 bg-white flex-1 text-sm flex justify-center items-center">{task.importance}</div>
                            <div className="text-black text-center rounded p-2 bg-white flex-1 text-sm flex justify-center items-center">{task.task_size}</div>
                            <div className="text-black text-center rounded p-2 bg-white flex-1 text-sm flex justify-center items-center">{task.taskSubCategory.name}</div>
                            <div className="text-black text-center rounded p-2 bg-white flex-1 text-sm flex justify-center items-center">{cairoDate(task.start_date)}</div>
                            <div className="text-black text-center rounded p-2 bg-white flex-1 text-sm flex justify-center items-center">{cairoDate(task.end_date)}</div>
                            <div className="text-black text-center rounded p-2 bg-white flex-1 text-sm flex justify-center items-center">{statusPercentage(task.status)}</div>
                            <div className="text-black text-center rounded p-2 bg-white flex-1 text-sm flex justify-center items-center">{taskStatus(task)}</div>
                            <div className={`text-black text-center rounded p-2 bg-white flex-1 text-sm flex justify-center items-center ${calculateTaskOverallScore(task) < 50 && "text-red-500 font-bold"}`}>
                                {calculateTaskOverallScore(task)}%
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default WatomsMyTasks;