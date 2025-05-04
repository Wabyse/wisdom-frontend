import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/ViewTask.css";
import { useEffect, useState } from "react";
import { downloadTaskFile, fetchTasks } from "../services/tms";

const TomsViewTask = () => {
  const { id } = useParams();
  const [task, setTask] = useState(null);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";

    const date = new Date(dateString);

    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;

    const formattedTime = `${date.getHours().toString().padStart(2, "0")}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}:${date.getSeconds().toString().padStart(2, "0")}`;

    return `${formattedDate} ${formattedTime}`;
  };

  const downloadFile = async (path) => {
    try {
      const fileName = path.split("\\").pop();
      await downloadTaskFile(fileName)
    } catch (error) {
      console.error("Download error", error);
      alert("File download failed");
    }
  };

  useEffect(() => {
    const loadingTasks = async () => {
      try {
        const response = await fetchTasks();
        const filteredTask = response.find(
          (task) => task.id === Number(id)
        );

        setTask(filteredTask);
      } catch (error) {
        console.error("no files", error);
      }
    };
    loadingTasks();
  }, [id]);
  return (
    <div className="bg-gray-500 h-screen">
      <Navbar showNavigate={false} upload={true}></Navbar>
      <div className="bg-slate-600 p-[20px] rounded-[8px] max-w-[600px] w-full m-auto shadow-md mt-2">
        <h1 className="text-2xl font-bold text-center text-white">تفاصيل المهمة</h1>
        <div className="flex justify-between gap-[15px]">
          <div className="detail-container bg-slate-200">
            <label className="text-red-600">:المهمة</label>
            <h1>{`${task?.task}`}</h1>
          </div>
          <div className="detail-container bg-slate-200">
            <label className="text-red-600">:الوصف</label>
            <h1>{`${task?.description}`}</h1>
          </div>
        </div>
        <div className="flex justify-between gap-[15px]">
          <div className="detail-container bg-slate-200">
            <label className="text-red-600">:تاريخ البدئ</label>
            <h1>{`${formatDate(task?.start_date)}`}</h1>
          </div>
          <div className="detail-container bg-slate-200">
            <label className="text-red-600">:تاريخ الانتهاء</label>
            <h1>{`${formatDate(task?.end_date)}`}</h1>
          </div>
        </div>
        <div className="flex justify-between gap-[15px]">
          <div className="detail-container bg-slate-300">
            <label className="text-red-600">:الحالة</label>
            <h1>{`${task?.status}`}</h1>
          </div>
          <div className="detail-container bg-slate-300">
            <label className="text-red-600">:الاهمية</label>
            <h1>{`${task?.importance}`}</h1>
          </div>
        </div>
        <div className="flex justify-between gap-[15px]">
          <div className="detail-container bg-slate-400">
            <label className="text-slate-600">:الملف</label>
            <h1
              className="hover:font-bold hover:cursor-pointer"
              onClick={
                task?.file_path ? () => downloadFile(task?.file_path) : null
              }
            >{`${
              task?.file_path
                ? task?.file_path.split("\\").pop().replace(/^\d+-/, "")
                : "No File"
            }`}</h1>
          </div>
          <div className="detail-container bg-slate-400">
            <label className="text-slate-600">:تاريخ انشاء المهمة</label>
            <h1>{`${formatDate(task?.createdAt)}`}</h1>
          </div>
        </div>
        <div className="flex justify-between gap-[15px]">
          <div className="detail-container bg-slate-400">
            <label className="text-slate-600">:تصنيف</label>
            <h1 className="font-normal text-lg">{`${task?.taskSubCategory.taskCategory.name}`}</h1>
          </div>
          <div className="detail-container bg-slate-400">
            <label className="text-slate-600">:تصنيف فرعي</label>
            <h1 className="font-normal text-lg">{`${task?.taskSubCategory.name}`}</h1>
          </div>
        </div>
        <div className="flex justify-between gap-[15px]">
          <div className="detail-container bg-slate-400">
            <label className="text-slate-600">:المعين</label>
            <h1>{`${task?.assigner.first_name} ${task?.assigner.middle_name} ${task?.assigner.last_name}`}</h1>
          </div>
          <div className="detail-container bg-slate-400">
            <label className="text-slate-600">:المعين له</label>
            <h1>{`${task?.assignee.first_name} ${task?.assignee.middle_name} ${task?.assignee.last_name}`}</h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TomsViewTask;