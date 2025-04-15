// import { useEffect, useState } from "react";
import { useEffect, useState, useRef } from "react";
// import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/Tms.css";
import { fetchTaskCategories, fetchTasks } from "../services/tms";
import { fetchUsers } from "../services/data";
import { scrollDown } from "../utils/scrollDown";
import tms1 from "../assets/tms1.jpg";
import tms2 from "../assets/tms2.jpg";
import tms3 from "../assets/tms3.jpg";
import Navbar3 from "../components/Navbar3";
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

const TomsTms = () => {
  const navigate = useNavigate(); //for navigate to another page (component)
  const { userInfo } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
    navigate(`/watoms/tms/view/${id}`);
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
    navigate(`/watoms/tms/assign`);
  };

  const myTasks = () => {
    navigate(`/watoms/tms/my-tasks`);
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
              !importanceFilter || importanceFilter === filter.importance ||
              importanceFilter === "0";
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
        className="w-[60px] text-wisdomOrange rounded p-2 text:bg-wisdomDarkOrange text-center"
      >
        مهامي
      </button>
      <button
        onClick={assignTasks}
        className="w-[90px] text-wisdomOrange rounded hover:text-wisdomDarkOrange p-2 mx-2"
      >
        تعين مهمة
      </button>
    </div>
  );
  const imgs = [
    {
      img: tms1,
      title: "Productivity Boost",
      description: "Skyrocket your output, achieve peak performance, see results fast."
    },
    {
      img: tms2,
      title: "Deadline Driven",
      description: "Conquer every deadline, ensuring timely success, stress-free now."
    },
    {
      img: tms3,
      title: "Streamlined Workflow",
      description: "Eliminate wasted effort. Work smarter, not harder."
    }
  ]

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
        showNavigate={false}
        img={imgs}
        length="w-[490px]"
        header={header}
        Page="TMS"
        description={tmsDesc}
      >
        <div className="grid grid-cols-2 gap-2">
          <Selector
            label="status"
            title=":الحالة"
            description="برجاء اختيار حالة"
            data={statusOptions}
            value={selectedStatus}
            onChange={handleStatusChange}
            name=""
          />
          <Selector
            label="importance"
            title=":الاهمية"
            description="برجاء اخيار الاهمية"
            data={importance}
            value={selectedImportance}
            onChange={handleImportanceChange}
            name=""
            keyType={true}
          />
          <Selector
            label="category"
            title=":التصنيف"
            description="برجاء اختيار تصنيف"
            data={categories}
            value={selectedCategory}
            onChange={handleCategoryChange}
          />
          <Selector
            label="subCategory"
            title=":التصنيف الفرعي"
            description="برجاء اختيار تصنيف فرعي"
            data={subCategories}
            value={selectedSubCategory}
            onChange={handleSubCategoryChange}
            onClick={handleSubCategoryClick}
          />
          <Selector
            label="assignedBy"
            title=":تكليف من"
            description="برجاء اختيار المعين"
            data={filteredAssignedUsers}
            value={selectedAssignedUser}
            onChange={handleAssignedByChange}
            name="user"
          />
          <Selector
            label="assignee"
            title=":تكليف الي"
            description="برجاء اختيار المعين له"
            data={filteredAssigneeUsers}
            value={selectedAssigneeUser}
            onChange={handleAssigneeChange}
            name="user"
          />
          <div className="flex flex-col items-end justify-center">
            <label
              htmlFor="dateFrom"
              className="mb-[10px] text-center font-bold"
            >
              :من
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
              :الي
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
              :موعد التسليم من
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
              :موعد التسليم الي
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
          مسح
        </button>
      </Navbar3>
      {/* <div className="tmsTitle-ar">
        <h1 className="tmsTitle2-ar">:نظام إدارة المهام</h1>
      </div> */}
      <div
        className="shadow-[5px_5px_10px_gray] rounded-[5px] w-[80%] flex justify-self-center flex-col"
        ref={targetDivRef}
      >
        <div className="flex text-center m-[10px] p-[5px] justify-between shadow-[3px_3px_5px_gray] items-center">
          <div className="font-bold w-[10%] m-[5px]">:تكليف الي</div>
          <div className="font-bold w-[10%] m-[5px]">:تكليف من</div>
          <div className="font-bold w-[10%] m-[5px]">:التصنيف</div>
          <div className="font-bold w-[10%] m-[5px]">:التصنيف الفرعي</div>
          <div className="font-bold w-[10%] m-[5px]">:الاهمية</div>
          <div className="font-bold w-[10%] m-[5px]">:الحالة</div>
          <div className="font-bold w-[10%] m-[5px]">:تاريخ الانتهاء</div>
          <div className="font-bold w-[10%] m-[5px]">:تاريخ البدء</div>
          <div className="font-bold w-[10%] m-[5px]">:تفاصيل</div>
          <div className="font-bold w-[10%] m-[5px]">:مهمة</div>
        </div>
        {tasks.length > 0 ? (
          tasks.map((file, index) => (
            <div
              className="tasks taskColumn"
              onClick={() => handleClick(file.id)}
            >
              <div className="w-[10%]">{file.assignee.first_name}</div>
              <div className="w-[10%]">{file.assigner.first_name}</div>
              <div className="w-[10%]">
                {file.taskSubCategory.taskCategory.name}
              </div>
              <div className="w-[10%]">{file.taskSubCategory.name}</div>
              <div className="w-[10%]">{file.importance}</div>
              <div className="w-[10%]">{file.status}</div>
              <div className="w-[10%]">{formatDate(file.end_date)}</div>
              <div className="w-[10%]">{formatDate(file.start_date)}</div>
              <div className="w-[10%] whitespace-nowrap overflow-hidden text-ellipsis">
                {file.description}
              </div>
              <div className="w-[10%]">{file.task}</div>
            </div>
          ))
        ) : (
          <p className="text-center">لا يوجد ملفات حاليا</p>
        )}
      </div>
    </>
  );
};

export default TomsTms;
