import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import TmsNavbar from "../components/TmsNavbar";
import { fetchTask, updateTask } from "../services/tms";
import { cairoDate } from "../utils/cairoDate";
import TmsChatAccess from "../components/TmsChatAccess";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faPaperclip, faPaperPlane, faPlus } from "@fortawesome/free-solid-svg-icons";
import { calculateTaskStatus } from "../utils/calculateTaskStatus";
import {
    DndContext,
    closestCenter,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import DraggableRows from "../components/DraggableRows";
import { restrictToParentElement } from "@dnd-kit/modifiers";
import { faGripLines } from "@fortawesome/free-solid-svg-icons";

const WatomsTmsEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [task, setTask] = useState({});
    const [submitTask, setSubmitTask] = useState(false);
    const [taskCount, setTaskCount] = useState(0);
    const [taskDetails, setTaskDetails] = useState([]);
    const [assigneeStatus, setAssigneeStatus] = useState(null);

    const handleChange = (id, field, value) => {
        setTaskDetails((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, [field]: value } : item
            )
        );
    };

    useEffect(() => {
        const loadTask = async () => {
            const response = await fetchTask(id);
            setTask(response);
        };

        loadTask();
    }, [id]);

    useEffect(() => {
        if (!task) return;

        const safeDetails = (task.details || []).map((d, i) => ({
            ...d,
            id: d.id ?? `existing-${i + 1}`,
            isNew: false,
        }));

        const newRows = Array.from({ length: taskCount }, (_, i) => ({
            id: `new-${i + 1}-${Date.now()}`,
            order: safeDetails.length + i + 1,
            isNew: true,
            note: "",
            description: "",
            title: "",
            end_date: "",
            status: 0,
        }));

        setTaskDetails([...safeDetails, ...newRows]);
    }, [task, taskCount]);

    useEffect(() => {
        const submitingTask = async () => {
            try {
                if (assigneeStatus || taskDetails.length > 0) {
                    const average = taskDetails.length > 0 ? taskDetails.reduce((sum, obj) => sum + (Number(obj.status) || 0), 0) / taskDetails.length : Number(assigneeStatus);
                    const taskData = new FormData();
                    taskData.append("task_details", JSON.stringify(taskDetails));
                    taskData.append("assignee_status", average);

                    await updateTask(id, taskData);
                    toast.success("تم تحديث المهمة");
                    setSubmitTask(false);
                    navigate("/watoms/tms/my-tasks")
                }
            } catch (err) {
                console.error("Error submitting data:", err);
            }
        }

        if (submitTask === true) submitingTask();
    }, [submitTask, id])

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = taskDetails.findIndex((i) => i.id === active.id);
        const newIndex = taskDetails.findIndex((i) => i.id === over.id);

        const reordered = arrayMove(taskDetails, oldIndex, newIndex).map(
            (item, i) => ({ ...item, order: i + 1 })
        );

        setTaskDetails(reordered);
    };

    return (
        <div className="flex flex-col items-center w-full">
            <Toaster />
            <TmsNavbar
                shareStatus={false}
                submitedTask={true}
                setSubmitTask={setSubmitTask}
                searchStatus={false}
                notificationStatus={true}
            />
            <div className="border-black border-2 rounded-xl flex flex-col w-[95%] mt-2 pt-2">

                {/* main content (three columns) */}
                <div className="px-3 pb-3 flex justify-between gap-2">
                    {/* first column */}
                    <div className="w-[35%] border-black border-2 p-2 rounded-xl flex flex-col gap-2 items-center">
                        <div className="bg-gradient-to-b from-blue-900 to-blue-950 text-white rounded p-2 text-center w-full">
                            عناصر التنفيذ والتقييم
                        </div>
                        <div className="w-full grid grid-cols-[13%,13%,13%,40%,14%] gap-2">
                            {/* Table Header */}
                            <div className="flex justify-center items-center text-white text-center text-xs rounded p-2 min-h-10 bg-gradient-to-b from-wisdomLighterOrange to-wisdomLightOrange">
                                نسبة الاستكمال
                            </div>
                            <div className="flex justify-center items-center text-white text-center text-xs rounded p-2 min-h-10 bg-gradient-to-b from-wisdomLighterOrange to-wisdomLightOrange">
                                سرعة التنفيذ
                            </div>
                            <div className="flex justify-center items-center text-white text-center text-xs rounded p-2 min-h-10 bg-gradient-to-b from-wisdomLighterOrange to-wisdomLightOrange">
                                تقييم الدقة
                            </div>
                            <div className="flex justify-center items-center text-white text-center text-xs rounded p-2 min-h-10 bg-gradient-to-b from-wisdomLighterOrange to-wisdomLightOrange">
                                الاسم
                            </div>
                            <div className="flex justify-center items-center text-white text-center text-xs rounded p-2 min-h-10 bg-gradient-to-b from-wisdomLighterOrange to-wisdomLightOrange">
                                المسؤلية
                            </div>

                            {/* Reviewer Row */}
                            <div className="text-center font-bold rounded p-2 min-h-10 bg-white border-black border-2 flex justify-center items-center">{task?.reviewer_status}</div>
                            <div className="text-center font-bold rounded p-2 min-h-10 bg-white border-black border-2 flex justify-center items-center">{task?.reviewer_speed}</div>
                            <div className="text-center font-bold rounded p-2 min-h-10 bg-white border-black border-2 flex justify-center items-center">{task?.reviewer_quality}</div>
                            <div className="text-center text-xs font-bold rounded p-2 min-h-10 bg-white border-black border-2 flex justify-center items-center">
                                {task?.reviewer?.employee?.first_name} {task?.reviewer?.employee?.middle_name} {task?.reviewer?.employee?.last_name}
                            </div>
                            <div className="text-center font-bold rounded p-2 min-h-10 bg-white border-black border-2 flex justify-center items-center">المراجع</div>

                            {/* Manager Row */}
                            <div className="text-center font-bold rounded p-2 min-h-10 bg-white border-black border-2 flex justify-center items-center">{task?.manager_status}</div>
                            <div className="text-center font-bold rounded p-2 min-h-10 bg-white border-black border-2 flex justify-center items-center">{task?.manager_speed}</div>
                            <div className="text-center font-bold rounded p-2 min-h-10 bg-white border-black border-2 flex justify-center items-center">{task?.manager_quality}</div>
                            <div className="text-center text-xs font-bold rounded p-2 min-h-10 bg-white border-black border-2 flex justify-center items-center">
                                {task?.manager?.employee?.first_name} {task?.manager?.employee?.middle_name} {task?.manager?.employee?.last_name}
                            </div>
                            <div className="text-center font-bold rounded p-2 min-h-10 bg-white border-black border-2 flex justify-center items-center">المدير</div>
                        </div>
                        {/* Task Status */}
                        <div className="w-full">
                            <div className={`h-16 flex justify-center items-center text-white text-center rounded p-2 bg-gradient-to-b from-wisdomLighterOrange to-wisdomLightOrange`}>
                                الموقف التنفيذي
                            </div>
                            <div className="h-16 flex justify-center items-center border-black p-2 border-2 rounded text-center font-bold mt-2 w-full bg-white text-black" >
                                {calculateTaskStatus(task)}
                            </div>
                        </div>
                    </div>

                    {/* second column */}
                    <div className="w-[30%] border-black border-2 p-2 rounded-xl flex flex-col gap-2 items-center">
                        <div className="bg-gradient-to-b from-blue-900 to-blue-950 text-white rounded p-2 text-center w-full">
                            محادثة
                        </div>
                        <div className="w-full max-h-60 h-60 bg-gradient-to-b min-h-fit from-blue-400 to-blue-600 rounded-xl flex flex-col p-4 overflow-y-auto space-y-3 shadow-inner">
                            {/* Received message */}
                            {/* <div className="bg-blue-800 text-white rounded-2xl py-2 px-4 max-w-[70%] shadow-md break-words">
                                Hey there! How are you doing today?
                            </div> */}

                            {/* Sent message */}
                            {/* <div className="bg-white text-gray-900 rounded-2xl py-2 px-4 max-w-[70%] self-end shadow-md border border-gray-200">
                                I’m good! How about you?
                            </div> */}

                            {/* Sent message with icon */}
                            {/* <button className="flex items-center gap-2 bg-white text-gray-900 hover:bg-slate-600 hover:text-white rounded-2xl py-2 px-4 max-w-[70%] self-end shadow-md transition-all duration-200 border border-gray-200">
                                Download File <FontAwesomeIcon icon={faDownload} />
                            </button> */}

                            {/* Long message wrapping */}
                            {/* <div className="bg-blue-800 text-white rounded-2xl py-2 px-4 max-w-[70%] shadow-md break-words">
                                asdfhbasdjkfnhasldbfnabldnabdfjnajkdnjhkladfadjkdbvadnsvjkndvasjhbsjkvsb
                            </div> */}
                        </div>

                        {/* Input area */}
                        <div className="w-full flex items-center gap-2 mt-2">
                            <button className="text-blue-900 hover:text-blue-600 transition-all duration-200">
                                <FontAwesomeIcon icon={faPaperclip} size="lg" />
                            </button>

                            <input
                                type="text"
                                className="border-slate-400 border-2 rounded-full w-full px-4 py-2 text-end focus:outline-none focus:ring-2 focus:ring-blue-700"
                                placeholder="ابدأ المحادثة"
                            />

                            <button className="text-blue-900 hover:text-blue-600 transition-all duration-200">
                                <FontAwesomeIcon icon={faPaperPlane} size="lg" />
                            </button>
                        </div>
                    </div>

                    {/* three column */}
                    <div className="w-[35%] border-black border-2 p-2 rounded-xl flex flex-col gap-3 items-center">
                        <div className="w-full bg-gradient-to-b from-blue-900 to-blue-950 text-white rounded p-2 text-center">
                            البيانات الاساسية للمهمة
                        </div>
                        <div className="flex gap-2 w-full">
                            {/* org selector */}
                            <div className="w-[25%] overflow-y-auto">
                                <div className={`text-white text-center text-sm rounded p-2 bg-gradient-to-b from-wisdomLighterOrange to-wisdomLightOrange`}>
                                    التصنيف الفرعي
                                </div>
                                <div className="border-black p-2 border-2 rounded text-center text-sm font-bold mt-2 w-full bg-white text-black" >
                                    {task?.organization?.name}
                                </div>
                            </div>
                            {/* program selector */}
                            <div className="w-[25%] overflow-y-auto">
                                <div className={`text-white text-center text-sm rounded p-2 bg-gradient-to-b from-wisdomLighterOrange to-wisdomLightOrange`}>
                                    التصنيف الرئيسي
                                </div>
                                <div className="border-black p-2 border-2 rounded text-center text-sm font-bold mt-2 w-full bg-white text-black" >
                                    {task?.program?.name}
                                </div>
                            </div>
                            {/* project selector */}
                            <div className="w-[25%] overflow-y-auto">
                                <div className={`text-white text-center text-sm rounded p-2 bg-gradient-to-b from-wisdomLighterOrange to-wisdomLightOrange`}>
                                    الجهة الفرعية
                                </div>
                                <div className="border-black p-2 border-2 rounded text-center text-sm font-bold mt-2 w-full bg-white text-black" >
                                    {task?.project?.name}
                                </div>
                            </div>
                            {/* auth selector */}
                            <div className="w-[25%] overflow-y-auto">
                                <div className={`text-white text-center text-sm rounded p-2 bg-gradient-to-b from-wisdomLighterOrange to-wisdomLightOrange`}>
                                    الجهة الرئيسية
                                </div>
                                <div className="border-black p-2 border-2 rounded text-center text-sm font-bold mt-2 w-full bg-white text-black" >
                                    {task?.authority?.name}
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2 w-full">
                            {/* Task Assignee Status */}
                            <div className="flex-1 overflow-y-auto">
                                <div className={`text-white text-center text-sm rounded p-2 bg-gradient-to-b from-wisdomLighterOrange to-wisdomLightOrange`}>
                                    نسبة الاستكمال
                                </div>
                                <input className="h-10 border-black p-2 border-2 rounded text-center text-sm font-bold mt-2 w-full bg-white text-black"
                                    disabled={taskDetails.length > 0 ? true : false}
                                    type="text" max={100} min={0} onChange={(e) => Number(e.target.value) && e.target.value < 101 && e.target.value >= 0 ? setAssigneeStatus(e.target.value) : setAssigneeStatus("")}
                                    value={assigneeStatus}
                                    defaultValue={task?.assignee_status}
                                />
                            </div>
                            {/* Task File */}
                            <div className="flex-1 overflow-y-auto">
                                <div className={`text-white text-center text-sm rounded p-2 bg-gradient-to-b from-wisdomLighterOrange to-wisdomLightOrange`}>
                                    المرفقات
                                </div>
                                <div className="h-10 border-black p-2 border-2 rounded text-center text-sm font-bold mt-2 w-full bg-white text-black" >
                                    {task.file_path ? task.file_path : "لا يوجد"}
                                </div>
                            </div>
                            {/* size selector */}
                            <div className="flex-1">
                                <div className={`text-white text-center text-sm rounded p-2 bg-gradient-to-b from-wisdomLighterOrange to-wisdomLightOrange`}>
                                    حجم المهمة
                                </div>
                                <div className="h-10 border-black p-2 border-2 rounded text-center text-sm font-bold mt-2 w-full bg-white text-black" >
                                    {task?.size}
                                </div>
                            </div>
                            {/* importance selector */}
                            <div className="flex-1">
                                <div className="text-white text-center text-sm rounded p-2 bg-gradient-to-b from-wisdomLighterOrange to-wisdomLightOrange">
                                    الاولوية
                                </div>
                                <div className="h-10 border-black p-2 border-2 rounded text-center text-sm font-bold mt-2 w-full bg-white text-black" >
                                    {task?.importance}
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2 w-full">
                            {/* submitted date */}
                            <div className="flex gap-2 flex-1">
                                <div className="w-full">
                                    <div className={`max-h-10 text-white text-center text-xs rounded p-2 bg-gradient-to-b from-wisdomLighterOrange to-wisdomLightOrange`}>
                                        تاريخ و التوقيتات التسليم
                                    </div>
                                    <div className="min-h-16 flex justify-center items-center border-black p-2 border-2 rounded text-center text-sm font-bold mt-2 w-full bg-white text-black" >
                                        {task.assignee_status === 100 ? cairoDate(task?.updatedAt) : "----"}
                                    </div>
                                </div>
                            </div>
                            {/* Date To input */}
                            <div className="flex gap-2 flex-1">
                                <div className="w-full">
                                    <div className={`max-h-10 text-white text-center text-xs rounded p-2 bg-gradient-to-b from-wisdomLighterOrange to-wisdomLightOrange`}>
                                        تاريخ و التوقيتات الانتهاء
                                    </div>
                                    <div className="min-h-16 flex justify-center items-center border-black p-2 border-2 rounded text-center text-sm font-bold mt-2 w-full bg-white text-black" >
                                        {cairoDate(task?.end_date)}
                                    </div>
                                </div>
                            </div>
                            {/* Date From input */}
                            <div className="flex gap-2 flex-1">
                                <div className="w-full">
                                    <div className={`max-h-10 text-white text-center text-xs rounded py-2 px-4 bg-gradient-to-b from-wisdomLighterOrange to-wisdomLightOrange`}>
                                        تاريخ و التوقيتات البدء
                                    </div>
                                    <div className="min-h-16 flex justify-center items-center border-black p-2 border-2 rounded text-center text-sm font-bold mt-2 w-full bg-white text-black" >
                                        {cairoDate(task?.start_date)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Main Details */}
                <div className="mx-3 mb-3 flex flex-col justify-between border-black border-2 p-2 rounded-xl relative overflow-hidden gap-2">
                    {/* Task Details Title */}
                    <div className="relative flex justify-between">
                        {/* Plus Button */}
                        <div
                            onClick={() => setTaskCount((prev) => prev + 1)}
                            className="absolute -top-2 -right-2 text-xl rounded-full w-7 h-7 flex justify-center items-center bg-gray-300 hover:bg-gray-400 cursor-pointer"
                        >
                            <FontAwesomeIcon icon={faPlus} />
                        </div>
                        <div className="flex gap-2 w-full">
                            <div className="min-w-[33.5%] w-[33.5%] max-w-[33.5%] text-white text-center rounded p-2 bg-gradient-to-b from-wisdomLighterOrange to-wisdomLightOrange">
                                ملاحظات
                            </div>
                            <div className="min-w-[45%] w-[45%] max-w-[45%] text-white text-center rounded p-2 bg-gradient-to-b from-wisdomLighterOrange to-wisdomLightOrange">
                                وصف المهمة
                            </div>
                            <div className="min-w-[20%] w-[20%] text-white text-center rounded p-2 bg-gradient-to-b from-wisdomLighterOrange to-wisdomLightOrange">
                                عنوان المهمة
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <div className="flex gap-2 w-full">

                            {/* Notes */}
                            <div className="min-w-[33.5%] w-[33.5%] max-w-[33.5%]">
                                <div className="min-h-10 border-black p-2 border-2 rounded text-center text-sm font-bold w-full bg-white text-black">
                                    {task.note || "-----"}
                                </div>
                            </div>

                            {/* Description */}
                            <div className="min-w-[45%] w-[45%] max-w-[45%]">
                                <div className="min-h-10 border-black p-2 border-2 rounded text-center text-sm font-bold w-full bg-white text-black">
                                    {task.description}
                                </div>
                            </div>

                            {/* Title */}
                            <div className="min-w-[20%] w-[20%]">
                                <div className="min-h-10 border-black p-2 border-2 rounded text-center text-sm font-bold w-full bg-white text-black">
                                    {task.title}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* task details */}
                <div className="mx-3 mb-3 flex flex-col justify-between border-black border-2 p-2 rounded-xl relative overflow-hidden gap-2">
                    {/* Task Details Title */}
                    <div className="flex justify-between">
                        <div className="flex gap-2 w-full">
                            <div className="min-w-[17.5%] w-[17.5%] max-w-[17.5%] text-white text-center rounded p-2 bg-gradient-to-b from-gray-500 to-gray-600">
                                ملاحظات
                            </div>
                            <div className="min-w-[15%] w-[15%] max-w-[15%] text-white text-center rounded p-2 bg-gradient-to-b from-gray-500 to-gray-600">
                                تاريخ الانتهاء
                            </div>
                            <div className="min-w-[5%] w-[5%] max-w-[5%] text-white text-center rounded p-2 bg-gradient-to-b from-gray-500 to-gray-600">
                                الوزن
                            </div>
                            <div className="min-w-[39.5%] w-[39.5%] max-w-[39.5%] text-white text-center rounded p-2 bg-gradient-to-b from-gray-500 to-gray-600">
                                وصف المهمة
                            </div>
                            <div className="min-w-[15%] w-[15%] text-white text-center rounded p-2 bg-gradient-to-b from-gray-500 to-gray-600">
                                عنوان المهمة
                            </div>
                            <div className="min-w-[5%] w-[5%] text-white text-center rounded p-2 bg-gradient-to-b from-gray-500 to-gray-600">
                                مسلسل
                            </div>
                        </div>
                    </div>

                    {/* Sortable List */}
                    <DndContext
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                        modifiers={[restrictToParentElement]}
                    >
                        <SortableContext
                            items={taskDetails.map((d) => d.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            {taskDetails.map((detail, index) => (
                                <DraggableRows key={detail.id} id={detail.id}>
                                    {({ listeners, attributes }) => (
                                        <div className="flex justify-between">
                                            <div className="flex gap-2 w-full">
                                                {/* Note */}
                                                <div className="min-w-[17.5%]">
                                                    <textarea
                                                        className="border-2 border-black rounded p-2 text-center font-bold w-full h-12 resize-none"
                                                        value={detail.note || ""}
                                                        onChange={(e) =>
                                                            handleChange(detail.id, "note", e.target.value)
                                                        }
                                                    />
                                                </div>

                                                {/* End Date */}
                                                <div className="min-w-[15%]">
                                                    <input
                                                        type="date"
                                                        className="border-2 border-black rounded p-2 text-center font-bold w-full h-12"
                                                        value={detail.end_date ? new Date(detail.end_date).toISOString().split("T")[0] : ""}
                                                        disabled={detail.end_date ? true : false}
                                                        onChange={(e) =>
                                                            handleChange(detail.id, "end_date", e.target.value)
                                                        }
                                                    />
                                                </div>

                                                {/* Status */}
                                                <div className="min-w-[5%]">
                                                    <input
                                                        type="number"
                                                        className="border-2 border-black rounded p-2 text-center font-bold w-full h-12"
                                                        value={detail.status || 0}
                                                        onChange={(e) =>
                                                            handleChange(detail.id, "status", e.target.value)
                                                        }
                                                    />
                                                </div>

                                                {/* Description */}
                                                <div className="min-w-[39.5%]">
                                                    <textarea
                                                        className="border-2 border-black rounded p-2 text-center font-bold w-full h-12 resize-none"
                                                        value={detail.description || ""}
                                                        onChange={(e) =>
                                                            handleChange(detail.id, "description", e.target.value)
                                                        }
                                                    />
                                                </div>

                                                {/* Title */}
                                                <div className="min-w-[15%]">
                                                    <textarea
                                                        className="border-2 border-black rounded p-2 text-center font-bold w-full h-12 resize-none"
                                                        value={detail.title || ""}
                                                        onChange={(e) =>
                                                            handleChange(detail.id, "title", e.target.value)
                                                        }
                                                    />
                                                </div>

                                                {/* Drag handle */}
                                                <div className="min-w-[5%] relative flex justify-center items-center">
                                                    <button
                                                        type="button"
                                                        className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900 cursor-grab"
                                                        {...listeners}
                                                        {...attributes}
                                                    >
                                                        <FontAwesomeIcon icon={faGripLines} />
                                                    </button>
                                                    <div className="border-2 border-black rounded p-2 w-full text-center bg-gray-200 font-bold">
                                                        {index + 1}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </DraggableRows>
                            ))}
                        </SortableContext>
                    </DndContext>
                </div>
            </div>
        </div >
    )
}

export default WatomsTmsEdit;