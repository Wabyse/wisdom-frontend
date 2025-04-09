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
    <>
      <Navbar showNavigate={false} upload={true}></Navbar>
      <div className="view">
        <h1 className="text-2xl font-bold">تفاصيل المهمة</h1>
        <div className="part">
          <div className="detail-container">
            <label>:المهمة</label>
            <h1>{`${task?.task}`}</h1>
          </div>
          <div className="detail-container">
            <label>:الوصف</label>
            <h1>{`${task?.description}`}</h1>
          </div>
        </div>
        <div className="part">
          <div className="detail-container">
            <label>:تاريخ البدئ</label>
            <h1>{`${formatDate(task?.start_date)}`}</h1>
          </div>
          <div className="detail-container">
            <label>:تاريخ الانتهاء</label>
            <h1>{`${formatDate(task?.end_date)}`}</h1>
          </div>
        </div>
        <div className="part">
          <div className="detail-container">
            <label>:الحالة</label>
            <h1>{`${task?.status}`}</h1>
          </div>
          <div className="detail-container">
            <label>:الاهمية</label>
            <h1>{`${task?.importance}`}</h1>
          </div>
        </div>
        <div className="part">
          <div className="detail-container">
            <label>:الملف</label>
            <h1
              className="tmsFile"
              onClick={
                task?.file_path ? () => downloadFile(task?.file_path) : null
              }
            >{`${
              task?.file_path
                ? task?.file_path.split("\\").pop().replace(/^\d+-/, "")
                : "No File"
            }`}</h1>
          </div>
          <div className="detail-container">
            <label>:تاريخ انشاء المهمة</label>
            <h1>{`${formatDate(task?.createdAt)}`}</h1>
          </div>
        </div>
        <div className="part">
          <div className="detail-container">
            <label>:تصنيف</label>
            <h1 className="viewDocument">{`${task?.taskSubCategory.taskCategory.name}`}</h1>
          </div>
          <div className="detail-container">
            <label>:تصنيف فرعي</label>
            <h1 className="viewDocument">{`${task?.taskSubCategory.name}`}</h1>
          </div>
        </div>
        <div className="part">
          <div className="detail-container">
            <label>:المعين</label>
            <h1>{`${task?.assigner.first_name} ${task?.assigner.middle_name} ${task?.assigner.last_name}`}</h1>
          </div>
          <div className="detail-container">
            <label>:المعين له</label>
            <h1>{`${task?.assignee.first_name} ${task?.assignee.middle_name} ${task?.assignee.last_name}`}</h1>
          </div>
        </div>
      </div>
    </>
  );
};

export default TomsViewTask;