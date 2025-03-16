// import { useEffect, useState } from "react";
import { useEffect, useState, useRef } from "react";
import Navbar from "../components/Navbar";
// import { useAuth } from "../context/AuthContext";
// import axios from "axios";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Tms.css";

const BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL;

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
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [language, setLanguage] = useState(true);
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
    window.scrollTo({ top: 0, behavior: "smooth" });

    setTimeout(() => {
      if (targetDivRef.current) {
        const divPosition = targetDivRef.current.offsetTop;
        window.scrollTo({ top: divPosition, behavior: "smooth" });
      }
    }, 500);
  };

  const handleDeadlineFromChange = (event) => {
    setDeadlineFrom(event.target.value);
    window.scrollTo({ top: 0, behavior: "smooth" });

    setTimeout(() => {
      if (targetDivRef.current) {
        const divPosition = targetDivRef.current.offsetTop;
        window.scrollTo({ top: divPosition, behavior: "smooth" });
      }
    }, 500);
  };

  const handleDeadlineToChange = (event) => {
    setDeadlineTo(event.target.value);
    window.scrollTo({ top: 0, behavior: "smooth" });

    setTimeout(() => {
      if (targetDivRef.current) {
        const divPosition = targetDivRef.current.offsetTop;
        window.scrollTo({ top: divPosition, behavior: "smooth" });
      }
    }, 500);
  };

  const handleDateToChange = (event) => {
    setDateTo(event.target.value);
    window.scrollTo({ top: 0, behavior: "smooth" });

    setTimeout(() => {
      if (targetDivRef.current) {
        const divPosition = targetDivRef.current.offsetTop;
        window.scrollTo({ top: divPosition, behavior: "smooth" });
      }
    }, 500);
  };

  const handleImportanceChange = (event) => {
    setSelectedImportance(event.target.value);
    window.scrollTo({ top: 0, behavior: "smooth" });

    setTimeout(() => {
      if (targetDivRef.current) {
        const divPosition = targetDivRef.current.offsetTop;
        window.scrollTo({ top: divPosition, behavior: "smooth" });
      }
    }, 500);
  };

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
    // First, reset the scroll to the top of the page
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Wait for 500ms (adjustable) before scrolling to the div
    setTimeout(() => {
      if (targetDivRef.current) {
        const divPosition = targetDivRef.current.offsetTop;
        window.scrollTo({ top: divPosition, behavior: "smooth" });
      }
    }, 500);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    if (!(Number(e.target.value) === 0)) {
      setSubCategories(categories[e.target.value - 1].subCategory);
    } else {
      setTest(test + 1);
    }
    // First, reset the scroll to the top of the page
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Wait for 500ms (adjustable) before scrolling to the div
    setTimeout(() => {
      if (targetDivRef.current) {
        const divPosition = targetDivRef.current.offsetTop;
        window.scrollTo({ top: divPosition, behavior: "smooth" });
      }
    }, 500);
  };

  const handleSubCategoryChange = (e) => {
    setSelectedSubCategory(e.target.value);
    // First, reset the scroll to the top of the page
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Wait for 500ms (adjustable) before scrolling to the div
    setTimeout(() => {
      if (targetDivRef.current) {
        const divPosition = targetDivRef.current.offsetTop;
        window.scrollTo({ top: divPosition, behavior: "smooth" });
      }
    }, 500);
  };

  const handleAssignedByChange = (e) => {
    setSelectedAssignedUser(e.target.value);
    // First, reset the scroll to the top of the page
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Wait for 500ms (adjustable) before scrolling to the div
    setTimeout(() => {
      if (targetDivRef.current) {
        const divPosition = targetDivRef.current.offsetTop;
        window.scrollTo({ top: divPosition, behavior: "smooth" });
      }
    }, 500);
  };

  const handleAssigneeChange = (e) => {
    setSelectedAssigneeUser(e.target.value);
    // First, reset the scroll to the top of the page
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Wait for 500ms (adjustable) before scrolling to the div
    setTimeout(() => {
      if (targetDivRef.current) {
        const divPosition = targetDivRef.current.offsetTop;
        window.scrollTo({ top: divPosition, behavior: "smooth" });
      }
    }, 500);
  };

  const changeLanguage = () => {
    setLanguage(!language);
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
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/v1/tasks/categories`,
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        let subCategory = [];
        setCategories(response.data?.categories || []);
        (response.data?.categories || []).forEach((subs) => {
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

    fetchCategories();
  }, [test]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/v1/forms/AllUsers`,
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        setUsers(response.data?.data || []);
        setFilteredAssignedUsers(response.data?.data || []);
        setFilteredAssigneeUsers(response.data?.data || []);
      } catch (err) {
        console.error("API Error:", err);
        setError(err.message || "An error occurred while fetching users data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/v1/tasks/view`,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        let filtered = [];
        const filteredTasks = response.data.Tasks;

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

    fetchTasks();
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <Navbar>
        <button onClick={myTasks}>{language ? "My Tasks" : "مهامي"}</button>
        <button onClick={assignTasks}>{language ? "Assign Task" : "تعين مهمة"}</button>
        <button className="language" onClick={changeLanguage}>
          {language ? "AR" : "EN"}
        </button>
      </Navbar>
      <div className={language ? "tmsTitle" : "tmsTitle-ar"}>
        {language ? (
          <h1 className="tmsTitle2">Task Management System:</h1>
        ) : (
          <h1 className="tmsTitle2-ar">:نظام إدارة المهام</h1>
        )}
      </div>
      <div className="filtersTms">
        <div className="TmsFilters">
          <div className="sectionTms">
            {language ? (
              <div className="selectTms">
                <label htmlFor="status">Status:</label>
                <select
                  id="status"
                  name="status"
                  onChange={handleStatusChange}
                  value={selectedStatus}
                >
                  <option value="" disabled>
                    Please Select a Status
                  </option>
                  <option value="0">All</option>
                  {statusOptions.map((option) => (
                    <option value={option}>{option}</option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="selectTms-ar">
                <select
                  id="status"
                  name="status"
                  onChange={handleStatusChange}
                  value={selectedStatus}
                >
                  <option value="" disabled>
                    برجاء اختيار حالة
                  </option>
                  <option value="0">All</option>
                  {statusOptions.map((option) => (
                    <option value={option}>{option}</option>
                  ))}
                </select>
                <label htmlFor="status">:الحالة</label>
              </div>
            )}
            {language ? (
              <div className="selectTms">
                <label htmlFor="category">Category:</label>
                <select
                  id="category"
                  name="category"
                  onChange={handleCategoryChange}
                  value={selectedCategory}
                >
                  <option value="" disabled>
                    Please Select a Category
                  </option>
                  <option value="0">All</option>
                  {categories.map((option) => (
                    <option value={option.id}>{option.name}</option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="selectTms-ar">
                <select
                  id="category"
                  name="category"
                  onChange={handleCategoryChange}
                  value={selectedCategory}
                >
                  <option value="" disabled>
                    برجاء اختيار تصنيف
                  </option>
                  <option value="0">All</option>
                  {categories.map((option) => (
                    <option value={option.id}>{option.name}</option>
                  ))}
                </select>
                <label htmlFor="category">:التصنيف</label>
              </div>
            )}
            {language ? (
              <div className="selectTms">
                <label htmlFor="subCategory">Sub Category:</label>
                <select
                  id="subCategory"
                  name="subCategory"
                  onChange={handleSubCategoryChange}
                  value={selectedSubCategory}
                  // onClick={handleSubCategoryClick}
                >
                  <option value="" disabled>
                    Please Select a Sub Category
                  </option>
                  <option value="0">All</option>
                  {subCategories.map((option) => (
                    <option value={option.id}>{option.name}</option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="selectTms-ar">
                <select
                  id="subCategory"
                  name="subCategory"
                  onChange={handleSubCategoryChange}
                  value={selectedSubCategory}
                  onClick={handleSubCategoryClick}
                >
                  <option value="" disabled>
                    برجاء اختيار تصنيف فرعي
                  </option>
                  <option value="0">All</option>
                  {subCategories.map((option) => (
                    <option value={option.id}>{option.name}</option>
                  ))}
                </select>
                <label htmlFor="subCategory">:التصنيف الفرعي</label>
              </div>
            )}
            {language ? (
              <div className="selectTms">
                <label htmlFor="assignedBy">Assigned By:</label>
                <select
                  id="assignedBy"
                  name="assignedBy"
                  onChange={handleAssignedByChange}
                  value={selectedAssignedUser}
                >
                  <option value="" disabled>
                    Please Select an Employee
                  </option>
                  <option value="0">All</option>
                  {filteredAssignedUsers.map((user) => (
                    <option
                      value={user.employee?.employee_id}
                    >{`${user.employee?.employee_first_name} ${user.employee?.employee_middle_name} ${user.employee?.employee_last_name}`}</option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="selectTms-ar">
                <select
                  id="assignedBy"
                  name="assignedBy"
                  onChange={handleAssignedByChange}
                  value={selectedAssignedUser}
                >
                  <option value="" disabled>
                    برجاء اختيار المعين
                  </option>
                  <option value="0">All</option>
                  {filteredAssignedUsers.map((user) => (
                    <option
                      value={user.employee?.employee_id}
                    >{`${user.employee?.employee_first_name} ${user.employee?.employee_middle_name} ${user.employee?.employee_last_name}`}</option>
                  ))}
                </select>
                <label htmlFor="assignedBy">:المعين</label>
              </div>
            )}
            {language ? (
              <div className="selectTms">
                <label htmlFor="assignee">Assignee:</label>
                <select
                  id="assignee"
                  name="assignee"
                  onChange={handleAssigneeChange}
                  value={selectedAssigneeUser}
                >
                  <option value="" disabled>
                    Please Select an Employee
                  </option>
                  <option value="0">All</option>
                  {filteredAssigneeUsers.map((user) => (
                    <option
                      value={user.employee?.employee_id}
                    >{`${user.employee?.employee_first_name} ${user.employee?.employee_middle_name} ${user.employee?.employee_last_name}`}</option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="selectTms-ar">
                <select
                  id="assignee"
                  name="assignee"
                  onChange={handleAssigneeChange}
                  value={selectedAssigneeUser}
                >
                  <option value="" disabled>
                    برجاء اختيار المعين له
                  </option>
                  <option value="0">All</option>
                  {filteredAssigneeUsers.map((user) => (
                    <option
                      value={user.employee?.employee_id}
                    >{`${user.employee?.employee_first_name} ${user.employee?.employee_middle_name} ${user.employee?.employee_last_name}`}</option>
                  ))}
                </select>
                <label htmlFor="assignee">:المعين له</label>
              </div>
            )}
          </div>
          <div className="sectionTms">
            {language ? (
              <div className="selectTms">
                <label htmlFor="importance">Importance:</label>
                <select
                  id="importance"
                  name="importance"
                  onChange={handleImportanceChange}
                  value={selectedImportance}
                >
                  <option value="" disabled>
                    Please Select a level
                  </option>
                  <option value="0">All</option>
                  {importance.map((state) => (
                    <option value={state}>{state}</option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="selectTms-ar">
                <select
                  id="importance"
                  name="importance"
                  onChange={handleImportanceChange}
                  value={selectedImportance}
                >
                  <option value="" disabled>
                    برجاء اخيار الاهمية
                  </option>
                  <option value="0">All</option>
                  {importance.map((state) => (
                    <option value={state}>{state}</option>
                  ))}
                </select>
                <label htmlFor="importance">:الاهمية</label>
              </div>
            )}
            {language ? (
              <div className="selectTms">
                <label htmlFor="dateFrom" className="TMS-date-label">
                  From:
                </label>
                <input
                  id="dateFrom"
                  name="dateFrom"
                  type="date"
                  className="date-TMS"
                  onChange={handleDateFromChange}
                />
              </div>
            ) : (
              <div className="selectTms-ar">
                <input
                  id="dateFrom"
                  name="dateFrom"
                  type="date"
                  className="date-TMS"
                  onChange={handleDateFromChange}
                />
                <label htmlFor="dateFrom" className="TMS-date-label">
                  :من
                </label>
              </div>
            )}
            {language ? (
              <div className="selectTms">
                <label htmlFor="dateTo" className="TMS-date-label">
                  To:
                </label>
                <input
                  id="dateTo"
                  name="dateTo"
                  type="date"
                  className="date-TMS"
                  onChange={handleDateToChange}
                />
              </div>
            ) : (
              <div className="selectTms-ar">
                <input
                  id="dateTo"
                  name="dateTo"
                  type="date"
                  className="date-TMS"
                  onChange={handleDateToChange}
                />
                <label htmlFor="dateTo" className="TMS-date-label">
                  :الي
                </label>
              </div>
            )}
            {language ? (
              <div className="selectTms">
                <label htmlFor="dateFrom" className="TMS-date-label">
                  Deadline From:
                </label>
                <input
                  id="dateFrom"
                  name="dateFrom"
                  type="date"
                  className="date-TMS"
                  onChange={handleDeadlineFromChange}
                />
              </div>
            ) : (
              <div className="selectTms-ar">
                <input
                  id="dateFrom"
                  name="dateFrom"
                  type="date"
                  className="date-TMS"
                  onChange={handleDeadlineFromChange}
                />
                <label htmlFor="dateFrom" className="TMS-date-label">
                  :موعد التسليم من
                </label>
              </div>
            )}
            {language ? (
              <div className="selectTms">
                <label htmlFor="dateTo" className="TMS-date-label">
                  Deadline To:
                </label>
                <input
                  id="dateTo"
                  name="dateTo"
                  type="date"
                  className="date-TMS"
                  onChange={handleDeadlineToChange}
                />
              </div>
            ) : (
              <div className="selectTms-ar">
                <input
                  id="dateTo"
                  name="dateTo"
                  type="date"
                  className="date-TMS"
                  onChange={handleDeadlineToChange}
                />
                <label htmlFor="dateTo" className="TMS-date-label">
                  :موعد التسليم الي
                </label>
              </div>
            )}
          </div>
        </div>
        <button className="TmsBtn" onClick={resetFilters}>
          {language ? "Reset" : "مسح"}
        </button>
      </div>
      <div className="files" ref={targetDivRef}>
        <div className="tasks">
          <div className="title">Task:</div>
          <div className="title">Description:</div>
          <div className="title">Start Date:</div>
          <div className="title">End Date:</div>
          <div className="title">Status:</div>
          <div className="title">Importance:</div>
          <div className="title">Sub-Category:</div>
          <div className="title">Category:</div>
          <div className="title">Assigned By:</div>
          <div className="title">Assignee:</div>
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
