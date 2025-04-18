// import { useEffect, useState } from "react";
import { useEffect, useState, useRef } from "react";
// import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/Tms.css";
import { fetchTaskCategories, fetchTasks } from "../services/tms";
import { fetchUsers } from "../services/data";
import { scrollDown } from "../utils/scrollDown";
import { useLanguage } from "../context/LanguageContext";
import Navbar3 from "../components/Navbar3";
import tms1 from "../assets/tms1.jpg";
import tms2 from "../assets/tms2.jpg";
import tms3 from "../assets/tms3.jpg";
import Selector from "../components/Selector";
import wabys from "../assets/wabys.png";
import { useAuth } from "../context/AuthContext";

const tmsDesc = "This module is fundamental for enhancing accountability and project execution. It allows for the clear assignment of responsibilities, the establishment of deadlines, and the real-time monitoring of task progress. By providing a transparent overview of workloads and potential bottlenecks, it improves team coordination, reduces delays, and ensures the timely completion of crucial activities, directly contributing to increased efficiency and project success."

const statusOptions = [
  // "0",
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

const importance = ["normal", "important", "urgent"];

const Tms = () => {
  const navigate = useNavigate(); //for navigate to another page (component)
  const { userInfo } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { language } = useLanguage();
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [selectedAssignedUser, setSelectedAssignedUser] = useState("");
  const [selectedAssigneeUser, setSelectedAssigneeUser] = useState("");
  const [selectedImportance, setSelectedImportance] = useState("");
  const targetDivRef = useRef(null);
  const [dateFrom, setDateFrom] = useState();
  const [dateTo, setDateTo] = useState();
  const [deadlineFrom, setDeadlineFrom] = useState();
  const [deadlineTo, setDeadlineTo] = useState();
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [filteredAssignedUsers, setFilteredAssignedUsers] = useState([]);
  const [filteredAssigneeUsers, setFilteredAssigneeUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [test, setTest] = useState(0);

  const handleClick = (id) => {
    navigate(`/tms/view/${id}`);
  };

  const handleSubCategoryClick = () => {
    if (!selectedCategory) {
      alert("Please select a category first!");
    }
  };

  const resetFilters = (e) => {
    e.preventDefault();
    setDateTo();
    setDateFrom();
    setDeadlineFrom();
    setDeadlineTo();
    setSelectedStatus("");
    setSelectedAssignedUser("");
    setSelectedAssigneeUser("");
    setSelectedImportance("");
    setSelectedCategory("");
    setSelectedSubCategory("");
  };

  useEffect(() => {
    // Filter Assigned Users to exclude the selected Assignee
    setFilteredAssignedUsers(
      users.filter(
        (user) => user.employee?.employee_id !== Number(selectedAssigneeUser)
      )
    );
  }, [selectedAssigneeUser, users, tasks]);

  useEffect(() => {
    // Filter Assignee Users to exclude the selected Assigned By user
    setFilteredAssigneeUsers(
      users.filter(
        (user) => user.employee?.employee_id !== Number(selectedAssignedUser)
      )
    );
  }, [selectedAssignedUser, users, tasks]);

  const handleDateFromChange = (event) => {
    setDateFrom(event.target.value);
    scrollDown(targetDivRef);
  };

  const handleDeadlineFromChange = (event) => {
    setDeadlineFrom(event.target.value);
    scrollDown(targetDivRef);
  };

  const handleDeadlineToChange = (event) => {
    setDeadlineTo(event.target.value);
    scrollDown(targetDivRef);
  };

  const handleDateToChange = (event) => {
    setDateTo(event.target.value);
    scrollDown(targetDivRef);
  };

  const handleImportanceChange = (event) => {
    setSelectedImportance(event.target.value);
    scrollDown(targetDivRef);
  };

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
    scrollDown(targetDivRef);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    if (!(Number(e.target.value) === 0)) {
      setSubCategories(categories[e.target.value - 1].subCategory);
    } else {
      setTest(test + 1);
    }
    scrollDown(targetDivRef);
  };

  const handleSubCategoryChange = (e) => {
    setSelectedSubCategory(e.target.value);
    scrollDown(targetDivRef);
  };

  const handleAssignedByChange = (e) => {
    setSelectedAssignedUser(e.target.value);
    scrollDown(targetDivRef);
  };

  const handleAssigneeChange = (e) => {
    setSelectedAssigneeUser(e.target.value);
    scrollDown(targetDivRef);
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

  const assignTasks = () => {
    navigate(`/tms/assign`);
  };

  const myTasks = () => {
    navigate(`/tms/my-tasks`);
  };

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetchTaskCategories();

        let subCategory = [];
        setCategories(response);
        response.forEach((subs) => {
          if (Array.isArray(subs.subCategory)) {
            subs.subCategory.forEach((sub) => subCategory.push(sub));
          }
        });
        setSubCategories(subCategory);
      } catch (err) {
        console.error("API Error:", err);
        setError(err.message || "An error occurred while fetching users data.");
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, [test]);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await fetchUsers();

        setUsers(response);
        setFilteredAssignedUsers(response);
        setFilteredAssigneeUsers(response);
      } catch (err) {
        console.error("API Error:", err);
        setError(err.message || "An error occurred while fetching users data.");
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const response = await fetchTasks();
        let filtered = [];
        const filteredTasks = response;

        let statusFilter = selectedStatus ? selectedStatus : null;
        let fromDate = dateFrom ? new Date(dateFrom) : null;
        let toDate = dateTo ? new Date(dateTo) : null;
        let categoryFilter = selectedCategory ? Number(selectedCategory) : null;
        let subCategoryFilter = selectedSubCategory
          ? Number(selectedSubCategory)
          : null;
        let assignedUserFilter = selectedAssignedUser
          ? Number(selectedAssignedUser)
          : null;
        let assigneeUserFilter = selectedAssigneeUser
          ? Number(selectedAssigneeUser)
          : null;
        let importanceFilter = selectedImportance ? selectedImportance : null;
        let fromDeadline = deadlineFrom ? new Date(deadlineFrom) : null;
        let toDeadline = deadlineTo ? new Date(deadlineTo) : null;

        const formatDate = (date) =>
          date
            ? new Date(date.getFullYear(), date.getMonth(), date.getDate())
            : null;

        const hasFilter =
          (selectedStatus !== "0" && selectedStatus !== "") ||
          (selectedCategory !== "0" && selectedCategory !== "") ||
          (selectedSubCategory !== "0" && selectedSubCategory !== "") ||
          (selectedAssignedUser !== "0" && selectedAssignedUser !== "") ||
          (selectedAssigneeUser !== "0" && selectedAssigneeUser !== "") ||
          (selectedImportance !== "0" && selectedImportance !== "") ||
          dateFrom ||
          dateTo ||
          deadlineFrom ||
          deadlineTo;

        if (hasFilter) {
          filteredTasks.forEach((filter) => {
            const fileDate = new Date(filter.createdAt);
            const fileDeadline = new Date(filter.end_date);
            const isDateMatch =
              (!fromDate || formatDate(fileDate) >= formatDate(fromDate)) &&
              (!toDate || formatDate(fileDate) <= formatDate(toDate));
            const isDeadlineMatch =
              (!fromDeadline ||
                formatDate(fileDeadline) >= formatDate(fromDeadline)) &&
              (!toDeadline ||
                formatDate(fileDeadline) <= formatDate(toDeadline));
            const isStatusMatch =
              !statusFilter ||
              statusFilter === filter.status ||
              statusFilter === "0";
            const isCategoryMatch =
              !categoryFilter ||
              categoryFilter === filter.taskSubCategory.taskCategory.id;
            const isSubCategoryMatch =
              !subCategoryFilter ||
              subCategoryFilter === filter.taskSubCategory.id;
            const isAssignedUserMatch =
              !assignedUserFilter || assignedUserFilter === filter.assigner.id;
            const isAssigneeUserMatch =
              !assigneeUserFilter || assigneeUserFilter === filter.assignee.id;
            const isImportanceMatch =
              !importanceFilter || importanceFilter === filter.importance;
            if (
              isDateMatch &&
              isStatusMatch &&
              isCategoryMatch &&
              isSubCategoryMatch &&
              isAssignedUserMatch &&
              isAssigneeUserMatch &&
              isImportanceMatch &&
              isDeadlineMatch
            ) {
              filtered.push(filter);
            }
          });
        } else if (
          selectedStatus === "" &&
          selectedCategory === "" &&
          selectedSubCategory === "" &&
          selectedAssignedUser === "" &&
          selectedAssigneeUser === "" &&
          selectedImportance === ""
        ) {
          console.log("done");
        } else {
          filtered = filteredTasks;
        }
        setTasks(filtered);
      } catch (err) {
        console.error("API Error:", err);
        setError(err.message || "An error occurred while fetching users data.");
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, [
    selectedStatus,
    dateFrom,
    dateTo,
    selectedCategory,
    selectedSubCategory,
    selectedAssignedUser,
    selectedAssigneeUser,
    selectedImportance,
    deadlineFrom,
    deadlineTo,
  ]);

  const header = (label, path) => (
    <div className="flex justify-evenly">
      <button
        onClick={myTasks}
        className="w-[90px] text-wisdomOrange rounded hover:text-wisdomDarkOrange text-center"
      >
        {language ? "My Tasks" : "مهامي"}
      </button>
      <button
        onClick={assignTasks}
        className="w-[100px] text-wisdomOrange rounded hover:text-wisdomDarkOrange mx-2"
      >
        {language ? "Assign Task" : "تعين مهمة"}
      </button>
    </div>
  );
  const imgs = [
    {
      img: tms1,
      title: "Productivity Boost",
      description:
        "Skyrocket your output, achieve peak performance, see results fast.",
    },
    {
      img: tms2,
      title: "Deadline Driven",
      description:
        "Conquer every deadline, ensuring timely success, stress-free now.",
    },
    {
      img: tms3,
      title: "Streamlined Workflow",
      description: "Eliminate wasted effort. Work smarter, not harder.",
    },
  ];

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (userInfo.user_role === "Student") {
    return (
      <>
        <div className="bg-formColor w-full h-screen flex flex-col justify-center items-center">
          <img
            className="w-[25%]"
            src={wabys}
            alt=""
          />
          <h1 className="text-6xl font-bold">401</h1>
          <h1 className="text-4xl text-center text-watomsBlue">You are not authorized to view this page.</h1>
          <h1 className="text-4xl text-center text-watomsBlue">Please contact your administrator if you believe this is an error.</h1>
          <button className="bg-wisdomOrange hover:bg-wisdomDarkOrange text-white rounded p-2 m-4" onClick={() => navigate('/pms')}>Go Back</button>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar3
        showNavigate={true}
        img={imgs}
        length="w-[650px]"
        header={header}
        Page="TMS"
        description={tmsDesc}
      >
        <div className="grid grid-cols-2 gap-2">
          <Selector
            label="status"
            title={language ? "Status:" : ":الحالة"}
            description={
              language ? "Please Select a Status" : "برجاء اختيار حالة"
            }
            data={statusOptions}
            value={selectedStatus}
            onChange={handleStatusChange}
            name=""
          />
          <Selector
            label="category"
            title={language ? "Category:" : ":التصنيف"}
            description={
              language ? "Please Select a Category" : "برجاء اختيار تصنيف"
            }
            data={categories}
            value={selectedCategory}
            onChange={handleCategoryChange}
          />
          <Selector
            label="subCategory"
            title={language ? "Sub Category:" : ":التصنيف الفرعي"}
            description={
              language
                ? "Please Select a Sub Category"
                : "برجاء اختيار تصنيف فرعي"
            }
            data={subCategories}
            value={selectedSubCategory}
            onChange={handleSubCategoryChange}
            onClick={handleSubCategoryClick}
          />
          <Selector
            label="assignedBy"
            title={language ? "AssignedBy:" : ":تكليف من"}
            description={
              language ? "Please Select an Employee" : "برجاء اختيار المعين"
            }
            data={filteredAssignedUsers}
            value={selectedAssignedUser}
            onChange={handleAssignedByChange}
            name="user"
          />
          <Selector
            label="assignee"
            title={language ? "Assignee:" : ":تكليف الي"}
            description={
              language ? "Please Select an Employee" : "برجاء اختيار المعين له"
            }
            data={filteredAssigneeUsers}
            value={selectedAssigneeUser}
            onChange={handleAssigneeChange}
            name="user"
          />
          <Selector
            label="importance"
            title={language ? "importance" : ":الاهمية"}
            description={
              language ? "Please Select a level" : "برجاء اخيار الاهمية"
            }
            data={importance}
            value={selectedImportance}
            onChange={handleImportanceChange}
            name=""
            keyType={true}
          />
          <div className="flex flex-col items-end justify-center">
            <label
              htmlFor="dateFrom"
              className="mb-[10px] text-center font-bold"
            >
              {language ? "From:" : ":من"}
            </label>
            <input
              id="dateFrom"
              name="dateFrom"
              type="date"
              className="p-[10px] border border-[#ccc] box-border w-[150px]"
              onChange={handleDateFromChange}
            />
          </div>
          <div className="flex flex-col items-end justify-center">
            <label htmlFor="dateTo" className="mb-[10px] text-center font-bold">
              {language ? "To:" : ":الي"}
            </label>
            <input
              id="dateTo"
              name="dateTo"
              type="date"
              className="p-[10px] border border-[#ccc] box-border w-[150px]"
              onChange={handleDateToChange}
            />
          </div>
          <div className="flex flex-col items-end justify-center">
            <label
              htmlFor="dateFrom"
              className="mb-[10px] text-center font-bold"
            >
              {language ? "Deadline Date From:" : ":موعد التسليم من"}
            </label>
            <input
              id="dateFrom"
              name="dateFrom"
              type="date"
              className="p-[10px] border border-[#ccc] box-border w-[150px]"
              onChange={handleDeadlineFromChange}
            />
          </div>
          <div className="flex flex-col items-end justify-center">
            <label htmlFor="dateTo" className="mb-[10px] text-center font-bold">
              {language ? "Deadline Date To:" : ":موعد التسليم الي"}
            </label>
            <input
              id="dateTo"
              name="dateTo"
              type="date"
              className="p-[10px] border border-[#ccc] box-border w-[150px]"
              onChange={handleDeadlineToChange}
            />
          </div>
        </div>
        <button
          className="flex justify-center md:w-full w-[200px] md:mt-[41px] md:m-0 m-auto my-2 items-center bg-wisdomOrange hover:bg-wisdomDarkOrange text-white h-[5vh] px-4 py-2 rounded-md"
          onClick={resetFilters}
        >
          {language ? "Reset" : "مسح"}
        </button>
      </Navbar3>
      <div className="files" ref={targetDivRef}>
        <div className="tasks">
          <div className="title">{language ? "Task:" : ":مهمة"}</div>
          <div className="title">{language ? "Description:" : ":الوصف"}</div>
          <div className="title">{language ? "Start Date:" : ":من"}</div>
          <div className="title">{language ? "End Date:" : ":الي"}</div>
          <div className="title">{language ? "Status:" : ":الحالة"}</div>
          <div className="title">{language ? "Importance:" : ":الاهمية"}</div>
          <div className="title">{language ? "Sub Category:" : ":التصنيف الفرعي"}</div>
          <div className="title">{language ? "Category:" : ":التصنيف"}</div>
          <div className="title">{language ? "Assignee:" : ":تكليف الي"}</div>
          <div className="title">{language ? "AssignedBy:" : ":تكليف من"}</div>
        </div>
        {tasks.length > 0 ? (
          tasks.map((file, index) => (
            <div
              className="tasks taskColumn"
              onClick={() => handleClick(file.id)}
            >
              <div className="task">{file.task}</div>
              <div className="task taskDescription">{file.description}</div>
              <div className="task">{formatDate(file.start_date)}</div>
              <div className="task">{formatDate(file.end_date)}</div>
              <div className="task">{file.status}</div>
              <div className="task">{file.importance}</div>
              <div className="task">{file.taskSubCategory.name}</div>
              <div className="task">
                {file.taskSubCategory.taskCategory.name}
              </div>
              <div className="task">{file.assigner.first_name}</div>
              <div className="task">{file.assignee.first_name}</div>
              {/* <div>
                <div>Assignee:</div>
                <div>{file.assignee.first_name}</div>
              </div> */}
            </div>
          ))
        ) : (
          <p className="noData">there is no documents available</p>
        )}
      </div>
    </>
  );
};

export default Tms;
