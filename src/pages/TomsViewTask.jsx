import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { downloadTaskFile, watomsFetchTasks } from "../services/tms";
import DenyAccessPage from "../components/DenyAccessPage";
import { useAuth } from "../context/AuthContext";

const TomsViewTask = () => {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const { userInfo } = useAuth();

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
        const response = await watomsFetchTasks();
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
  if (userInfo?.code === 1452) return <DenyAccessPage homePage='/watoms/dashboard' />;
  if (userInfo?.code === 1475) return <DenyAccessPage homePage='/watoms/news' />;
  if (userInfo?.code === 1310) return <DenyAccessPage homePage='/wisdom/dashboard' />;
  return (
    <div className="bg-gray-500 h-screen">
      <Navbar showNavigate={false} upload={true}></Navbar>
      <div className="bg-slate-600 p-[20px] rounded-[8px] max-w-[600px] w-full m-auto shadow-md mt-2">
        <h1 className="text-2xl font-bold text-center text-white">تفاصيل المهمة</h1>
        <div className="flex justify-between gap-[15px]">
          <div className="border-2 border-black m-0.5 flex-1 p-2.5 rounded text-center bg-slate-200">
            <label className="text-red-600 text-[13px] font-bold block mb-[3px]">:المهمة</label>
            <h1 className="text-lg m-0 font-normal">{`${task?.task}`}</h1>
          </div>
          <div className="border-2 border-black m-0.5 flex-1 p-2.5 rounded text-center bg-slate-200">
            <label className="text-red-600 text-[13px] font-bold block mb-[3px]">:الوصف</label>
            <h1 className="text-lg m-0 font-normal">{`${task?.description}`}</h1>
          </div>
        </div>
        <div className="flex justify-between gap-[15px]">
          <div className="border-2 border-black m-0.5 flex-1 p-2.5 rounded text-center bg-slate-200">
            <label className="text-red-600 text-[13px] font-bold block mb-[3px]">:تاريخ البدئ</label>
            <h1 className="text-lg m-0 font-normal">{`${formatDate(task?.start_date)}`}</h1>
          </div>
          <div className="border-2 border-black m-0.5 flex-1 p-2.5 rounded text-center bg-slate-200">
            <label className="text-red-600 text-[13px] font-bold block mb-[3px]">:تاريخ الانتهاء</label>
            <h1 className="text-lg m-0 font-normal">{`${formatDate(task?.end_date)}`}</h1>
          </div>
        </div>
        <div className="flex justify-between gap-[15px]">
          <div className="border-2 border-black m-0.5 flex-1 p-2.5 rounded text-center bg-slate-300">
            <label className="text-red-600 text-[13px] font-bold block mb-[3px]">:الحالة</label>
            <h1 className="text-lg m-0 font-normal">{`${task?.status}`}</h1>
          </div>
          <div className="border-2 border-black m-0.5 flex-1 p-2.5 rounded text-center bg-slate-300">
            <label className="text-red-600 text-[13px] font-bold block mb-[3px]">:الاهمية</label>
            <h1 className="text-lg m-0 font-normal">{`${task?.importance}`}</h1>
          </div>
        </div>
        <div className="flex justify-between gap-[15px]">
          <div className="border-2 border-black m-0.5 flex-1 p-2.5 rounded text-center bg-slate-400">
            <label className="text-slate-600 text-[13px] font-bold block mb-[3px]">:الملف</label>
            <h1
              className="hover:font-bold hover:cursor-pointer text-lg m-0 font-normal"
              onClick={
                task?.file_path ? () => downloadFile(task?.file_path) : null
              }
            >{`${task?.file_path
                ? task?.file_path.split("\\").pop().replace(/^\d+-/, "")
                : "No File"
              }`}</h1>
          </div>
          <div className="border-2 border-black m-0.5 flex-1 p-2.5 rounded text-center bg-slate-400">
            <label className="text-slate-600 text-[13px] font-bold block mb-[3px]">:تاريخ انشاء المهمة</label>
            <h1 className="text-lg m-0 font-normal">{`${formatDate(task?.createdAt)}`}</h1>
          </div>
        </div>
        <div className="flex justify-between gap-[15px]">
          <div className="border-2 border-black m-0.5 flex-1 p-2.5 rounded text-center bg-slate-400">
            <label className="text-slate-600 text-[13px] font-bold block mb-[3px]">:تصنيف</label>
            <h1 className="text-lg m-0 font-normal">{`${task?.taskSubCategory.taskCategory.name}`}</h1>
          </div>
          <div className="border-2 border-black m-0.5 flex-1 p-2.5 rounded text-center bg-slate-400">
            <label className="text-slate-600 text-[13px] font-bold block mb-[3px]">:تصنيف فرعي</label>
            <h1 className="text-lg m-0 font-normal">{`${task?.taskSubCategory.name}`}</h1>
          </div>
        </div>
        <div className="flex justify-between gap-[15px]">
          <div className="border-2 border-black m-0.5 flex-1 p-2.5 rounded text-center bg-slate-400">
            <label className="text-slate-600 text-[13px] font-bold block mb-[3px]">:المعين</label>
            <h1 className="text-lg m-0 font-normal">{`${task?.assigner.first_name} ${task?.assigner.middle_name} ${task?.assigner.last_name}`}</h1>
          </div>
          <div className="border-2 border-black m-0.5 flex-1 p-2.5 rounded text-center bg-slate-400">
            <label className="text-slate-600 text-[13px] font-bold block mb-[3px]">:المعين له</label>
            <h1 className="text-lg m-0 font-normal">{`${task?.assignee.first_name} ${task?.assignee.middle_name} ${task?.assignee.last_name}`}</h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TomsViewTask;