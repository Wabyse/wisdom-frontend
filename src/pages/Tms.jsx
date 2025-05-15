// import { useEffect, useState } from "react";
import { useEffect, useState, useRef } from "react";
// import { useAuth } from "../context/AuthContext";
import { useNavigate, Navigate, useLocation } from "react-router-dom";
import "../styles/Tms.css";
import { fetchTaskCategories, fetchTasks } from "../services/tms";
import { fetchUsers } from "../services/data";
import { scrollDown } from "../utils/scrollDown";
import { useLanguage } from "../context/LanguageContext";
import Navbar3 from "../components/Navbar3";
import Selector from "../components/Selector";
import { useAuth } from "../context/AuthContext";
import LoadingScreen from "../components/LoadingScreen";
import DenyAccessPage from "../components/DenyAccessPage";
import { STATUS_OPTIONS, TMS_DESCRIPTION, TMS_HERO_INFO, IMPORTANCE_LEVELS } from "../constants/constants";

const Tms = () => {
  const location = useLocation();
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
  // const [users, setUsers] = useState([]);
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

  // useEffect(() => {
  //   // Filter Assigned Users to exclude the selected Assignee
  //   setFilteredAssignedUsers(
  //     users.filter(
  //       (user) => user.employee?.employee_id !== Number(selectedAssigneeUser)
  //     )
  //   );
  // }, [selectedAssigneeUser, users, tasks]);

  // useEffect(() => {
  //   // Filter Assignee Users to exclude the selected Assigned By user
  //   setFilteredAssigneeUsers(
  //     users.filter(
  //       (user) => user.employee?.employee_id !== Number(selectedAssignedUser)
  //     )
  //   );
  // }, [selectedAssignedUser, users, tasks]);

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

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetchTaskCategories(userInfo);

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
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, [test, userInfo]);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await fetchUsers(userInfo);

        // setUsers(response);
        setFilteredAssignedUsers(response);
        setFilteredAssigneeUsers(response);
      } catch (err) {
        console.error("API Error:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [userInfo]);

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
        setError(err);
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
    <div className="flex justify-evenly gap-5">
      <button
        onClick={() => navigate(`/tms/my-tasks`)}
        className="w-fit text-wisdomOrange rounded hover:text-wisdomDarkOrange text-center"
      >
        {language ? "My Tasks" : "مهامي"}
      </button>
      <button
        onClick={() => navigate(`/tms/assign`)}
        className="w-[75px] text-wisdomOrange rounded hover:text-wisdomDarkOrange"
      >
        {language ? "Assign Task" : "تعين مهمة"}
      </button>
    </div>
  );

  if (loading) return <LoadingScreen />;
  if (error?.status === 403) return <Navigate to="/login" state={{ from: location }} replace />;
  if (error) return <p>Error: {error.message}</p>;
  if (userInfo.user_role === "Student" || userInfo.user_role === "Trainee") return <DenyAccessPage homePage='/pms' />;

  return (
    <>
      <Navbar3
        showNavigate={true}
        img={TMS_HERO_INFO}
        header={header}
        Page="TMS"
        description={TMS_DESCRIPTION}
      >
        <div className="grid grid-cols-2 gap-2">
          <Selector
            label="status"
            title={language ? "Status:" : ":الحالة"}
            description={
              language ? "Please Select a Status" : "برجاء اختيار حالة"
            }
            data={STATUS_OPTIONS}
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
            optionValue="emp"
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
            optionValue="emp"
          />
          <Selector
            label="importance"
            title={language ? "importance" : ":الاهمية"}
            description={
              language ? "Please Select a level" : "برجاء اخيار الاهمية"
            }
            data={IMPORTANCE_LEVELS}
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
          <div className="font-bold w-[10%]">{language ? "Task:" : ":مهمة"}</div>
          <div className="font-bold w-[10%]">{language ? "Description:" : ":الوصف"}</div>
          <div className="font-bold w-[10%]">{language ? "Start Date:" : ":من"}</div>
          <div className="font-bold w-[10%]">{language ? "End Date:" : ":الي"}</div>
          <div className="font-bold w-[10%]">{language ? "Status:" : ":الحالة"}</div>
          <div className="font-bold w-[10%]">{language ? "Importance:" : ":الاهمية"}</div>
          <div className="font-bold w-[10%]">{language ? "Sub Category:" : ":التصنيف الفرعي"}</div>
          <div className="font-bold w-[10%]">{language ? "Category:" : ":التصنيف"}</div>
          <div className="font-bold w-[10%]">{language ? "Assignee:" : ":تكليف الي"}</div>
          <div className="font-bold w-[10%]">{language ? "AssignedBy:" : ":تكليف من"}</div>
        </div>
        {tasks.length > 0 ? (
          tasks.map((file, index) => (
            <div
              className="tasks taskColumn"
              onClick={() => handleClick(file.id)}
            >
              <div className="w-[10%]">{file.task}</div>
              <div className="w-[10%] whitespace-nowrap overflow-hidden text-ellipsis">{file.description}</div>
              <div className="w-[10%]">{formatDate(file.start_date)}</div>
              <div className="w-[10%]">{formatDate(file.end_date)}</div>
              <div className="w-[10%]">{file.status}</div>
              <div className="w-[10%]">{file.importance}</div>
              <div className="w-[10%]">{file.taskSubCategory.name}</div>
              <div className="w-[10%]">
                {file.taskSubCategory.taskCategory.name}
              </div>
              <div className="w-[10%]">{file.assigner.first_name}</div>
              <div className="w-[10%]">{file.assignee.first_name}</div>
              {/* <div>
                <div>Assignee:</div>
                <div>{file.assignee.first_name}</div>
              </div> */}
            </div>
          ))
        ) : (
          <p className="text-center">{language ? "there is no documents available" : "لا يوجد ملفات"}</p>
        )}
      </div>
    </>
  );
};

export default Tms;