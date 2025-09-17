import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import { LuDownload } from "react-icons/lu";
import { downloadTaskFile, fetchTasks, updateMyTask } from "../services/tms";
import LoadingScreen from "../components/LoadingScreen";
import DenyAccessPage from "../components/DenyAccessPage";
import { STATUS_OPTIONS } from "../constants/constants";
import { Navigate, useLocation } from "react-router-dom";

const MyTasks = () => {
  const location = useLocation();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState({}); // Fix: Maintain statuses for each task
  const { userInfo } = useAuth();
  const [editStates, setEditStates] = useState({});

  const downloadFile = async (path) => {
    try {
      const fileName = path.split("\\").pop();

      await downloadTaskFile(fileName)

    } catch (error) {
      console.error("Download error", error);
      alert("File download failed");
    }
  };

  const changeStatus = (id, event) => {
    setStatus((prevStatus) => ({
      ...prevStatus, // Preserve existing statuses
      [id]: event.target.value, // Update only the selected task's status
    }));
  };

  const editStatus = (index) => {
    setEditStates((prev) => ({ ...prev, [index]: true }));
  };

  const confirmStatus = async (index, id) => {
    const formData = new FormData();

    // Get the selected file from the file input
    const fileInput = document.querySelector(`input[name="file-${id}"]`);
    const selectedFile = fileInput?.files[0]; // Get the file if selected

    if (selectedFile) {
      formData.append("file", selectedFile); // ✅ Attach file only if selected
    }
    if (status[id] === undefined) {
      setEditStates((prev) => ({ ...prev, [index]: false }));
      return toast.error("you didn't update the task");
    }
    formData.append("status", status[id]); // ✅ Attach status

    try {
      await updateMyTask(id, formData)
      toast.success("Updated successfully!");
      setEditStates((prev) => ({ ...prev, [index]: false }));
    } catch (err) {
      console.error("API Error:", err);
      setError(err);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date
      .toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
      .replace(",", ""); // Remove comma
  };

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const response = await fetchTasks();

        setTasks(response);
      } catch (err) {
        console.error("API Error:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, []);
  console.log(userInfo)

  const filteredTasks = tasks.filter(
    (task) => task.assignee.id === userInfo.employee_id
  );

  if (loading) return <LoadingScreen />;
  if (error?.status === 403) return <Navigate to="/login" state={{ from: location }} replace />;
  if (error) return <p>Error: {error.message}</p>;
  if (userInfo.user_role === "Trainee" || userInfo.user_role === "Student") return <DenyAccessPage homePage='/pms' />;
  if (userInfo?.code === 1452) return <DenyAccessPage homePage='/watoms/dashboard' />;

  return (
    <>
      <Toaster />
      <Navbar upload={true} />
      <h1 className="ml-[3%] text-2xl font-bold">My Tasks:</h1>
      <div className="files">
        <div className="flex text-center m-2.5 p-1.5 justify-between items-center shadow-[3px_3px_5px_gray]">
          <div className="font-bold w-[9%] m-[5px]">Task:</div>
          <div className="font-bold w-[9%] m-[5px]">Description:</div>
          <div className="font-bold w-[9%] m-[5px]">Start Date:</div>
          <div className="font-bold w-[9%] m-[5px]">End Date:</div>
          <div className="font-bold w-[9%] m-[5px]">Status:</div>
          <div className="font-bold w-[9%] m-[5px]">Sub-Category:</div>
          <div className="font-bold w-[9%] m-[5px]">Category:</div>
          <div className="font-bold w-[9%] m-[5px]">Assigned By:</div>
          <div className="font-bold w-[9%] m-[5px]">Assignee:</div>
          <div className="font-bold w-[9%] m-[5px]">File:</div>
          <div className="font-bold w-[9%] m-[5px]">Action:</div>
        </div>
        {filteredTasks.length > 0 ? (
          filteredTasks.map((file, index) => (
            <div className="tasks hover:bg-gray-300 cursor-pointer" key={file.id}>
              <div className="w-[9%]">{file.task}</div>
              <div className="w-[9%]">{file.description}</div>
              <div className="w-[9%]">{formatDate(file.start_date)}</div>
              <div className="w-[9%]">{formatDate(file.end_date)}</div>

              {editStates[index] ? (
                // ✅ Fixed `value` to correctly reflect status changes
                <select
                  className="w-[9%]"
                  onChange={(e) => changeStatus(file.id, e)}
                  value={
                    status[file.id] !== undefined
                      ? status[file.id]
                      : file.status
                  }
                >
                  {STATUS_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="w-[9%]">
                  {status[file.id] !== undefined
                    ? status[file.id]
                    : file.status}
                </div>
              )}

              <div className="w-[9%]">{file.taskSubCategory.name}</div>
              <div className="w-[9%]">
                {file.taskSubCategory.taskCategory.name}
              </div>
              <div className="w-[9%]">{file.assigner.first_name}</div>
              <div className="w-[9%]">{file.assignee.first_name}</div>
              {file.file_path ? (
                <div
                  className="w-[9%] flex justify-center"
                  onClick={() => downloadFile(file?.file_path)}
                >
                  <LuDownload size={24} />
                </div>
              ) : (
                <div className="w-[9%]">No File</div>
              )}
              <button
                className="w-[9%]"
                onClick={() =>
                  editStates[index]
                    ? confirmStatus(index, file.id)
                    : editStatus(index)
                }
              >
                {editStates[index] ? "Confirm" : "Edit"}
              </button>
            </div>
          ))
        ) : (
          <p className="text-center">No tasks available</p>
        )}
      </div>
    </>
  );
};

export default MyTasks;
