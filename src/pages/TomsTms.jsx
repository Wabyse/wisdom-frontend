// import { useEffect, useState } from "react";
import { useEffect, useState, useRef } from "react";
// import { useAuth } from "../context/AuthContext";
import { useNavigate, Navigate, useLocation } from "react-router-dom";
import "../styles/Tms.css";
import { fetchTaskCategories, fetchTasks } from "../services/tms";
import { fetchUsers } from "../services/data";
import { scrollDown } from "../utils/scrollDown";
import Navbar3 from "../components/Navbar3";
import Selector from "../components/Selector";
import { useAuth } from "../context/AuthContext";
import LoadingScreen from "../components/LoadingScreen";
import DenyAccessPage from "../components/DenyAccessPage";
import { fetchingOrgs } from "../services/dms";
import { IMPORTANCE_LEVELS, STATUS_OPTIONS, TMS_DESCRIPTION, TMS_HERO_INFO } from "../constants/constants";

const TomsTms = () => {
  const location = useLocation();
  const navigate = useNavigate(); //for navigate to another page (component)
  const { userInfo } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedAssigneeOrganization, setSelectedAssigneeOrganization] = useState("");
  const [selectedAssignerOrganization, setSelectedAssignerOrganization] = useState("");
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
  const [assigneeInistitutions, setAssigneeInistitutions] = useState([]);
  const [assignerInistitutions, setAssignerInistitutions] = useState([]);
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
    setSelectedAssigneeOrganization("");
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

  const handleAssigneeOrganizationChange = (e) => {
    setSelectedAssigneeOrganization(e.target.value);
    scrollDown(targetDivRef);
  };

  const handleAssignerOrganizationChange = (e) => {
    setSelectedAssignerOrganization(e.target.value);
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
    const loadingOrg = async () => {
      try {
        const response = await fetchingOrgs(userInfo);
        setAssigneeInistitutions(response)
        setAssignerInistitutions(response);
      } catch (error) {
        console.error("no files", error);
      }
    };

    loadingOrg();

    const loadUsers = async () => {
      try {
        const response = await fetchUsers(userInfo);

        setUsers(response);
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

        let assigneeOrganizationFilter = selectedAssigneeOrganization ? selectedAssigneeOrganization : null;
        let assignerOrganizationFilter = selectedAssignerOrganization ? selectedAssignerOrganization : null;
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
          (selectedAssigneeOrganization !== "0" && selectedAssigneeOrganization !== "") ||
          (selectedAssignerOrganization !== "0" && selectedAssignerOrganization !== "") ||
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
            const isAssigneeOrganizationMatch = !Number(assigneeOrganizationFilter) || Number(assigneeOrganizationFilter) === filter.assignee.organization_id;
            const isAssignerOrganizationMatch = !Number(assignerOrganizationFilter) || Number(assignerOrganizationFilter) === filter.assigner.organization_id;
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
              isDeadlineMatch &&
              isAssigneeOrganizationMatch &&
              isAssignerOrganizationMatch
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
          selectedImportance === "" &&
          selectedAssigneeOrganization === "" &&
          selectedAssignerOrganization === ""
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
    selectedAssigneeOrganization,
    selectedAssignerOrganization,
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

  if (loading) return <LoadingScreen />;
  if (error?.status === 403) return <Navigate to="/login" state={{ from: location }} replace />;
  if (error) return <p>Error: {error.message}</p>;
  if (userInfo.user_role === "Student" || userInfo.user_role === "Trainee") return <DenyAccessPage homePage='/watoms/pms' />;

  return (
    <>
      <Navbar3
        showNavigate={false}
        img={TMS_HERO_INFO}
        length="w-[640px]"
        header={header}
        Page="TMS"
        description={TMS_DESCRIPTION}
      >
        <div className="grid grid-cols-2 gap-x-2">
          {userInfo.user_role === "Operations Excellence Lead" ? <Selector
            label="assigneeOrganization"
            title=":مركز المكلف الي"
            description="برجاء اختيار مركز"
            data={assigneeInistitutions}
            value={selectedAssigneeOrganization}
            onChange={handleAssigneeOrganizationChange}
          /> : null}
          {userInfo.user_role === "Operations Excellence Lead" ? <Selector
            label="assignerOrganization"
            title=":مركز المكلف من"
            description="برجاء اختيار مركز"
            data={assignerInistitutions}
            value={selectedAssignerOrganization}
            onChange={handleAssignerOrganizationChange}
          /> : null}
          <Selector
            label="status"
            title=":الحالة"
            description="برجاء اختيار حالة"
            data={STATUS_OPTIONS}
            value={selectedStatus}
            onChange={handleStatusChange}
            name=""
          />
          <Selector
            label="importance"
            title=":الاهمية"
            description="برجاء اخيار الاهمية"
            data={IMPORTANCE_LEVELS}
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
          className="flex justify-center md:w-full w-[200px] md:mt-4 md:m-0 m-auto my-2 items-center bg-wisdomOrange hover:bg-wisdomDarkOrange text-white h-[5vh] px-4 py-2 rounded-md"
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