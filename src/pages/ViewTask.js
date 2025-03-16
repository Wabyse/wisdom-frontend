import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/ViewTask.css";
import { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL;

const ViewTask = () => {
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

      const response = await axios.get(
        `${BASE_URL}/api/v1/files/download/${fileName}`,
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Download error", error);
      alert("File download failed");
    }
  };

  useEffect(() => {
    const fetchingTasks = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/v1/tasks/view`,
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        const filteredTask = response.data.Tasks.find(
          (task) => task.id === Number(id)
        );

        setTask(filteredTask);
      } catch (error) {
        console.error("no files", error);
      }
    };
    fetchingTasks();
  }, [id]);
  return (
    <>
      <Navbar></Navbar>
      <div className="view">
        <h1>View Task</h1>
        <div className="part">
          <div className="detail-container">
            <label>Task: </label>
            <h1>{`${task?.task}`}</h1>
          </div>
          <div className="detail-container">
            <label>Description: </label>
            <h1>{`${task?.description}`}</h1>
          </div>
        </div>
        <div className="part">
          <div className="detail-container">
            <label>Task Starting Date: </label>
            <h1>{`${formatDate(task?.start_date)}`}</h1>
          </div>
          <div className="detail-container">
            <label>Task Ending Date: </label>
            <h1>{`${formatDate(task?.end_date)}`}</h1>
          </div>
        </div>
        <div className="part">
          <div className="detail-container">
            <label>Status: </label>
            <h1>{`${task?.status}`}</h1>
          </div>
          <div className="detail-container">
            <label>Importance: </label>
            <h1>{`${task?.importance}`}</h1>
          </div>
        </div>
        <div className="part">
          <div className="detail-container">
            <label>File: </label>
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
            <label>Task Create Date: </label>
            <h1>{`${formatDate(task?.createdAt)}`}</h1>
          </div>
        </div>
        <div className="part">
          <div className="detail-container">
            <label>Category: </label>
            <h1 className="viewDocument">{`${task?.taskSubCategory.taskCategory.name}`}</h1>
          </div>
          <div className="detail-container">
            <label>Sub-Category: </label>
            <h1 className="viewDocument">{`${task?.taskSubCategory.name}`}</h1>
          </div>
        </div>
        <div className="part">
          <div className="detail-container">
            <label>Assigner: </label>
            <h1>{`${task?.assigner.first_name} ${task?.assigner.middle_name} ${task?.assigner.last_name}`}</h1>
          </div>
          <div className="detail-container">
            <label>Assignee: </label>
            <h1>{`${task?.assignee.first_name} ${task?.assignee.middle_name} ${task?.assignee.last_name}`}</h1>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewTask;
