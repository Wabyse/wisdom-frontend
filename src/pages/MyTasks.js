import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "../styles/MyTasks.css";
import { useAuth } from "../context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import { LuDownload } from "react-icons/lu";
import { downloadTaskFile, fetchTasks, updateMyTask } from "../services/tms";
import LoadingScreen from "../components/LoadingScreen";
import DenyAccessPage from "../components/DenyAccessPage";

const statusOptions = [
  "0",
  "25",
  "50",
  "75",
  "finished",
  "on hold",
  "in progress",
  "past the due date",
  "submitted",
  "under review",
  "not started yet",
];

const MyTasks = () => {
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
      setError(err.message || "An error occurred while updating status.");
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
        setError(err.message || "An error occurred while fetching tasks.");
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, []);

  const filteredTasks = tasks.filter(
    (task) => task.assignee.id === userInfo.id
  );

  if (loading) return <LoadingScreen />;
  if (error) return <p>Error: {error}</p>;
  if (userInfo.user_role === "Trainee" || userInfo.user_role === "Student") return <DenyAccessPage homePage='/pms' />;

  return (
    <>
      <Toaster />
      <Navbar upload={true} length="w-[370px]"/>
      <h1 className="myTaskTitle text-2xl font-bold">My Tasks:</h1>
      <div className="files">
        <div className="myTasks">
          <div className="myTitle">Task:</div>
          <div className="myTitle">Description:</div>
          <div className="myTitle">Start Date:</div>
          <div className="myTitle">End Date:</div>
          <div className="myTitle">Status:</div>
          <div className="myTitle">Sub-Category:</div>
          <div className="myTitle">Category:</div>
          <div className="myTitle">Assigned By:</div>
          <div className="myTitle">Assignee:</div>
          <div className="myTitle">File:</div>
          <div className="myTitle">Action:</div>
        </div>
        {filteredTasks.length > 0 ? (
          filteredTasks.map((file, index) => (
            <div className="tasks myTaskColumn" key={file.id}>
              <div className="myTask">{file.task}</div>
              <div className="myTask">{file.description}</div>
              <div className="myTask">{formatDate(file.start_date)}</div>
              <div className="myTask">{formatDate(file.end_date)}</div>

              {editStates[index] ? (
                // ✅ Fixed `value` to correctly reflect status changes
                <select
                  className="myTask"
                  onChange={(e) => changeStatus(file.id, e)}
                  value={
                    status[file.id] !== undefined
                      ? status[file.id]
                      : file.status
                  }
                >
                  {statusOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="myTask">
                  {status[file.id] !== undefined
                    ? status[file.id]
                    : file.status}
                </div>
              )}

              <div className="myTask">{file.taskSubCategory.name}</div>
              <div className="myTask">
                {file.taskSubCategory.taskCategory.name}
              </div>
              <div className="myTask">{file.assigner.first_name}</div>
              <div className="myTask">{file.assignee.first_name}</div>
              {file.file_path ? (
                <div
                  className="myTask"
                  onClick={() => downloadFile(file?.file_path)}
                >
                  <LuDownload size={24} />
                </div>
              ) : (
                <div className="myTask">No File</div>
              )}
              {/* {editStates[index] ? (
                <input type="file" name={`file-${file.id}`} />
              ) : (
                <div className="myTask"></div>
              )} */}
              <button
                className="myTask"
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
