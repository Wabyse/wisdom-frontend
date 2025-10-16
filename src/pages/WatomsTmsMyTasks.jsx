// import { useEffect, useState } from "react";
import { useEffect, useState, useRef } from "react";
// import { useAuth } from "../context/AuthContext";
import { useNavigate, Navigate, useLocation } from "react-router-dom";
import "../styles/Tms.css";
import { ebdaeduFetchTasksGeneralInfo, fetchTaskCategories, watomsFetchTasks } from "../services/tms";
import { fetchAuthorities, fetchOrgsCheck, fetchUsers } from "../services/data";
import { scrollDown } from "../utils/scrollDown";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import LoadingScreen from "../components/LoadingScreen";
import DenyAccessPage from "../components/DenyAccessPage";
import { fetchingOrgs } from "../services/dms";
import { STATUS_OPTIONS, IMPORTANCE_LEVELS } from "../constants/constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faUser, faShareNodes, faSun, faMoon, faTasks, faFilter, faCalendarAlt, faUserTie, faClock, faFlag, faFolder, faPlus, faExpand, faCompress, faHouse, faBuilding } from "@fortawesome/free-solid-svg-icons";
import { useState as useThemeState } from "react";
import watomsLogo from '../assets/watoms3.png';
import wabysLogo from '../assets/wabys.png';
import TmsSingleDataTemplate from "../components/TmsSingleDataTemplate";
import TmsSingleTaskDetails from "../components/TmsSingleTaskDetails";
import AddTaskForm from "../components/AddTaskForm";
import { cairoDate } from "../utils/cairoDate";
import { tmsDevliverSituation } from "../utils/tmsDeliverSituation";

const statusPercentage = {
  "0": "0",
  "25": "25",
  "50": "50",
  "75": "75",
  "finished": "100",
  "on hold": "0",
  "in progress": "0",
  "past the due date": "0",
  "submitted": "100",
  "under review": "100",
  "not started yet": "0"
}

const WatomsTmsMyTasks = () => {
  const location = useLocation();
  const navigate = useNavigate(); //for navigate to another page (component)
  const { userInfo } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { language, setLanguage } = useLanguage();
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
  // const [users, setUsers] = useState([]);
  const [assigneeInistitutions, setAssigneeInistitutions] = useState([]);
  const [assignerInistitutions, setAssignerInistitutions] = useState([]);
  const [test, setTest] = useState(0);
  // THEME STATE
  const [darkMode, setDarkMode] = useThemeState(false);
  // MODAL STATE
  const [activeModal, setActiveModal] = useState(null);
  const [modalData, setModalData] = useState(null);
  // SEARCH STATE
  const [search, setSearch] = useState("");
  // FULLSCREEN STATE
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [generalInfo, setGeneralInfo] = useState(null);
  const [openTaskId, setOpenTaskId] = useState(null);
  // Authority's state variable
  const [auth, setAuth] = useState([]);
  const [selectedAuthority, setSelectedAuthority] = useState("");
  // Project's state variable
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");

  const handleToggle = (taskId) => {
    setOpenTaskId(prev => (prev === taskId ? null : taskId));
  };

  useEffect(() => {
    const loadTasksGeneralInfo = async () => {
      try {
        setLoading(true);
        const response = await ebdaeduFetchTasksGeneralInfo();
        setGeneralInfo(response);
      } catch (err) {
        console.error("API Error:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    const loadAuthority = async () => {
      const response = await fetchAuthorities();
      const watomsAuth = response.filter(authority => authority.id !== 3)
      setAuth(watomsAuth);
    }

    const loadProjects = async () => {
      const response = await fetchOrgsCheck();
      const watomsProjects = response.filter(project => project.authority_id === 1 || project.authority_id === 2);
      setProjects(watomsProjects);
    }

    loadTasksGeneralInfo();
    loadAuthority();
    loadProjects();
  }, [])

  const handleClick = (id) => {
    navigate(`/watoms/tms/view/${id}`);
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

  const handleAuthorityChange = (e) => {
    setSelectedAuthority(e.target.value);
    scrollDown(targetDivRef);
  };

  const handle2Change = (e) => {
    setSelectedProject(e.target.value);
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
        const response = await watomsFetchTasks();
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
            const fileDate = new Date(filter.start_date);
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

  // Fullscreen toggle function
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullScreen(true);
    } else {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  // Fullscreen change event listener
  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullScreenChange);
  }, []);

  // Close modal function
  const closeModal = () => {
    setActiveModal(null);
    setModalData(null);
  };

  // Escape key support for modals
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && activeModal) {
        closeModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModal]);

  // Modal Components
  const TasksModal = ({ data, onClose }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden animate-modal-in">
        <div className="bg-gradient-to-r from-watomsBlue to-wisdomOrange p-6 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-extrabold">{language ? "Task Management" : "إدارة المهام"}</h2>
            <button onClick={onClose} className="text-white hover:text-gray-200 text-2xl">
              ×
            </button>
          </div>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {data?.length > 0 ? (
            <div className="space-y-4">
              {data.map((task, idx) => (
                <div key={task.id} className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors cursor-pointer" onClick={() => handleClick(task.id)}>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faTasks} className="text-watomsBlue" />
                        <span className="font-bold text-gray-900">{task.task}</span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">{task.description}</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faCalendarAlt} className="text-wisdomOrange" />
                        <span className="text-sm font-medium">{formatDate(task.start_date)} - {formatDate(task.end_date)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faFlag} className="text-red-500" />
                        <span className="text-sm font-medium">{task.importance}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faUserTie} className="text-green-500" />
                        <span className="text-sm font-medium">{task.assignee.first_name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faClock} className="text-blue-500" />
                        <span className="text-sm font-medium">{task.status}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FontAwesomeIcon icon={faTasks} className="text-6xl text-gray-300 mb-4" />
              <p className="text-xl text-gray-600">{language ? "No tasks available" : "لا توجد مهام متاحة"}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const FiltersModal = ({ data, onClose }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden animate-modal-in">
        <div className="bg-gradient-to-r from-wisdomOrange to-watomsBlue p-6 text-white">
          <div className="flex items-center justify-between">
            {language && <h2 className="text-3xl font-extrabold">Advanced Filters</h2>}
            <button onClick={onClose} className="text-white hover:text-gray-200 text-2xl">
              ×
            </button>
            {!language && <h2 className="text-3xl font-extrabold">فلاتر متقدمة</h2>}
          </div>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className={`text-xl font-bold text-gray-900 flex items-center gap-2 ${language ? "justify-start" : "justify-end"}`}>
                <FontAwesomeIcon icon={faBuilding} className="text-watomsBlue" />
                {language ? "الجهة" : "الجهة"}
              </h3>
              <select
                value={selectedAuthority || ""}
                onChange={handleAuthorityChange}
                className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-watomsBlue focus:border-transparent ${language ? "text-start" : "text-end"}`}
              >
                <option value="">{language ? "Select an authority" : "اختر جهة"}</option>
                {auth?.map((authority) => (
                  <option key={authority.id} value={authority.id}>{authority.name}</option>
                ))}
              </select>
              <select
                value={selectedProject || ""}
                onChange={handle2Change}
                className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-watomsBlue focus:border-transparent ${language ? "text-start" : "text-end"}`}
              >
                <option value="">{language ? "Select project" : "اختر المشروع"}</option>
                {projects?.map((project) => (
                  <option key={project.id} value={project.id}>{project.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-4">
              <h3 className={`text-xl font-bold text-gray-900 flex items-center gap-2 ${language ? "justify-start" : "justify-end"}`}>
                <FontAwesomeIcon icon={faClock} className="text-watomsBlue" />
                {language ? "Status & Importance" : "الحالة والأهمية"}
              </h3>
              <select
                value={selectedStatus || ""}
                onChange={handleStatusChange}
                className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-watomsBlue focus:border-transparent ${language ? "text-start" : "text-end"}`}
              >
                <option value="">{language ? "Select Status" : "اختر الحالة"}</option>
                {STATUS_OPTIONS?.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
              <select
                value={selectedImportance || ""}
                onChange={handleImportanceChange}
                className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-watomsBlue focus:border-transparent ${language ? "text-start" : "text-end"}`}
              >
                <option value="">{language ? "Select Importance" : "اختر الأهمية"}</option>
                {IMPORTANCE_LEVELS?.map((level) => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
            <div className="space-y-4">
              <h3 className={`text-xl font-bold text-gray-900 flex items-center gap-2 ${language ? "justify-start" : "justify-end"}`}>
                <FontAwesomeIcon icon={faFolder} className="text-watomsBlue" />
                {language ? "Assessment Tools" : "أدوات التقييم"}
              </h3>
              <select
                value={selectedCategory || ""}
                onChange={handleCategoryChange}
                className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-watomsBlue focus:border-transparent ${language ? "text-start" : "text-end"}`}
              >
                <option value="">{language ? "Select Category" : "اختر التصنيف"}</option>
                {categories?.map((cat, idx) => (
                  <option key={idx} value={idx + 1}>{cat.name}</option>
                ))}
              </select>
              <select
                value={selectedSubCategory || ""}
                onChange={handleSubCategoryChange}
                className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-watomsBlue focus:border-transparent ${language ? "text-start" : "text-end"}`}
              >
                <option value="">{language ? "Select Sub Category" : "اختر التصنيف الفرعي"}</option>
                {subCategories?.map((subCat) => (
                  <option key={subCat.id} value={subCat.id}>{subCat.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-4">
              <h3 className={`text-xl font-bold text-gray-900 flex items-center gap-2 ${language ? "justify-start" : "justify-end"}`}>
                <FontAwesomeIcon icon={faUserTie} className="text-watomsBlue" />
                {language ? "Users" : "المستخدمون"}
              </h3>
              <select
                value={selectedAssignedUser || ""}
                onChange={handleAssignedByChange}
                className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-watomsBlue focus:border-transparent ${language ? "text-start" : "text-end"}`}
              >
                <option value="">{language ? "Assigned By" : "تم التكليف من"}</option>
                {data?.filteredAssignedUsers?.map((user) => (
                  <option key={user.employee?.employee_id} value={user.employee?.employee_id}>{user.employee?.employee_first_name} {user.employee?.employee_middle_name} {user.employee?.employee_last_name}</option>
                ))}
              </select>
              {userInfo.code === 3 && <select
                value={selectedAssigneeUser || ""}
                onChange={handleAssigneeChange}
                className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-watomsBlue focus:border-transparent ${language ? "text-start" : "text-end"}`}
              >
                <option value="">{language ? "Assignee" : "المكلف إليه"}</option>
                {data?.filteredAssigneeUsers?.map((user) => (
                  <option key={user.employee?.employee_id} value={user.employee?.employee_id}>{user.employee?.employee_first_name} {user.employee?.employee_middle_name} {user.employee?.employee_last_name}</option>
                ))}
              </select>}
            </div>
            <div className="space-y-4">
              <h3 className={`text-xl font-bold text-gray-900 flex items-center gap-2 ${language ? "justify-start" : "justify-end"}`}>
                <FontAwesomeIcon icon={faCalendarAlt} className="text-watomsBlue" />
                {language ? "Date Range" : "نطاق التاريخ"}
              </h3>
              <div className={`grid grid-cols-2 gap-4 ${language ? "text-start" : "text-end"}`}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{language ? "Start From:" : "البداية من:"}</label>
                  <input
                    type="date"
                    value={dateFrom || ""}
                    onChange={handleDateFromChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-watomsBlue focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{language ? "Start To:" : "البداية إلى:"}</label>
                  <input
                    type="date"
                    value={dateTo || ""}
                    onChange={handleDateToChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-watomsBlue focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{language ? "Deadline From:" : "الموعد النهائي من:"}</label>
                  <input
                    type="date"
                    value={deadlineFrom || ""}
                    onChange={handleDeadlineFromChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-watomsBlue focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{language ? "Deadline To:" : "الموعد النهائي إلى:"}</label>
                  <input
                    type="date"
                    value={deadlineTo || ""}
                    onChange={handleDeadlineToChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-watomsBlue focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-4 mt-8">
            <button
              onClick={resetFilters}
              className="flex-1 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-bold"
            >
              {language ? "Reset Filters" : "مسح الفلاتر"}
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-watomsBlue text-white rounded-lg hover:bg-blue-700 transition-colors font-bold"
            >
              {language ? "Apply Filters" : "تطبيق الفلاتر"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) return <LoadingScreen />;
  if (error?.status === 403) return <Navigate to="/login" state={{ from: location }} replace />;
  if (error) return <p>Error: {error.message}</p>;
  if (userInfo.user_role === "Student" || userInfo.user_role === "Trainee") return <DenyAccessPage homePage='/watoms/pms' />;
  if (userInfo?.code === 1452 || userInfo?.code === 1476) return <DenyAccessPage homePage='/watoms/dashboard' />;
  if (userInfo?.code === 1475) return <DenyAccessPage homePage='/watoms/news' />;
  if (userInfo?.code === 1310) return <DenyAccessPage homePage='/wisdom/dashboard' />;

  return (
    <div className={`min-h-screen w-full font-[Cairo,sans-serif] transition-colors duration-500 ${darkMode ? 'bg-watomsBlue text-white' : 'bg-gradient-to-br from-blue-50 via-white to-purple-100 text-gray-900'} relative overflow-hidden`}>

      {/* Navbar */}
      <div className="flex flex-col items-center justify-center min-h-[80vh] w-full relative z-10">
        {/* Navbar's content */}
        <div className="flex flex-col md:flex-row items-center justify-between w-full mb-12 px-4">
          {/* Logo */}
          <div className="flex items-center gap-6">
            <img className="w-[100px] md:w-[120px] lg:w-[140px] cursor-pointer" src={wabysLogo} alt="Wabys Logo" onClick={() => navigate('/wabys')} />
            <div className='border-l-2 border-gray-500 p-1 h-8' />
            <img className="w-[100px] md:w-[120px] lg:w-[140px] cursor-pointer" src={watomsLogo} alt="Wabys Logo" onClick={() => navigate('/wabys')} />
          </div>
          {/* Search */}
          <div className="flex-1 flex justify-center">
            <div className="relative w-full max-w-md">
              <FontAwesomeIcon icon={faSearch} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
              <input
                type="text"
                className="w-full pl-12 pr-4 py-1 rounded-full border border-gray-200 shadow focus:ring-2 focus:ring-watomsBlue bg-white/90 text-lg font-medium placeholder-gray-400 transition-all focus:border-watomsBlue focus:shadow-lg outline-none"
                placeholder={language ? "Search tasks..." : "ابحث في المهام..."}
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ fontFamily: 'inherit' }}
              />
            </div>
          </div>
          <div className="flex items-center gap-4 relative">
            {/* Dark Mode Button */}
            <button onClick={() => setDarkMode(!darkMode)} className="rounded-full w-10 h-10 flex justify-center items-center bg-white/80 hover:bg-gray-200 shadow transition-all">
              <FontAwesomeIcon icon={darkMode ? faSun : faMoon} className="text-xl text-watomsBlue" />
            </button>
            {/* Full Screen Toggle Button */}
            <button
              onClick={toggleFullScreen}
              className="rounded-full w-10 h-10 flex justify-center items-center bg-white/80 hover:bg-gray-200 shadow transition-all"
              title={language ? (isFullScreen ? 'Exit Full Screen' : 'Enter Full Screen') : (isFullScreen ? 'خروج من الشاشة الكاملة' : 'دخول الشاشة الكاملة')}
            >
              <FontAwesomeIcon
                icon={isFullScreen ? faCompress : faExpand}
                className="text-xl text-watomsBlue"
              />
            </button>
            {/* User Info: Show Username only */}
            <span className="flex items-center gap-2 font-bold text-lg min-w-[120px]">
              <FontAwesomeIcon icon={faUser} className="text-watomsBlue" />
              {userInfo?.name || 'User'}
            </span>
            {/* Language Toggle Button */}
            <button
              className="rounded-full w-10 h-10 flex justify-center items-center bg-white/80 hover:bg-gray-200 shadow transition-all font-bold text-base"
              onClick={() => setLanguage(!language)}
              title={language ? 'العربية' : 'English'}
            >
              {language ? 'AR' : 'EN'}
            </button>
            {/* Share Button */}
            <button
              className="rounded-full w-10 h-10 flex justify-center items-center bg-white/80 hover:bg-gray-200 shadow transition-all"
            >
              <FontAwesomeIcon icon={faShareNodes} className="text-xl text-gray-500" />
            </button>
            {/* My Tasks Button */}
            {/* <button
              className="rounded-full w-10 h-10 flex justify-center items-center bg-white/80 hover:bg-gray-200 shadow transition-all"
            >
              <FontAwesomeIcon icon={faFilter} className="text-xl text-wisdomOrange" />
            </button> */}
            {/* Filter Button */}
            <button
              className="rounded-full w-10 h-10 flex justify-center items-center bg-white/80 hover:bg-gray-200 shadow transition-all"
              onClick={() => {
                setModalData({
                  type: 'filters',
                  data: {
                    categories,
                    subCategories,
                    filteredAssignedUsers,
                    filteredAssigneeUsers,
                    selectedCategory,
                    selectedSubCategory,
                    selectedAssignedUser,
                    selectedAssigneeUser,
                    selectedStatus,
                    selectedImportance,
                    dateFrom,
                    dateTo,
                    deadlineFrom,
                    deadlineTo
                  }
                });
                setActiveModal('filters');
              }}
            >
              <FontAwesomeIcon icon={faFilter} className="text-xl text-wisdomOrange" />
            </button>
            {/* Add Task Button */}
            <button
              className="rounded-full w-10 h-10 flex justify-center items-center bg-white/80 hover:bg-gray-200 shadow transition-all"
              onClick={() => {
                setModalData({ type: 'tasks', data: tasks });
                setActiveModal('add');
              }}
            >
              <FontAwesomeIcon icon={faPlus} className="text-xl text-blue-800" />
            </button>
            {/* Home Button */}
            <button
              className="rounded-full w-10 h-10 flex justify-center items-center bg-white/80 hover:bg-gray-200 shadow transition-all"
              onClick={() => navigate('/watoms')}
            >
              <FontAwesomeIcon icon={faHouse} className="text-xl text-green-700" />
            </button>
          </div>
        </div>
        {/* Main Menu Grid */}
        {/* Add Task */}
        {activeModal === 'add' && <AddTaskForm onClose={closeModal} mainTask={true} />}
        {/* Total tasks info */}
        <div className="flex justify-center gap-4 items-center">
          <TmsSingleDataTemplate
            title="اجمالي تقييم المهام"
            value={`${generalInfo?.totalEvaluationTasks}%`}
            valueAdditionalCSS="text-red-600"
          />
          <div className='border-l-2 border-gray-500 p-1 h-8' />
          <div className="flex gap-2">
            <TmsSingleDataTemplate
              title="مهمة صغيرة"
              value={generalInfo?.totalNormalTasks}
            />
            <TmsSingleDataTemplate
              title="مهمة متوسطة"
              value={generalInfo?.totalImportantTasks}
            />
            <TmsSingleDataTemplate
              title="مهمة كبيرة"
              value={generalInfo?.totalUrgentTasks}
            />
          </div>
          <div className='border-l-2 border-gray-500 p-1 h-8' />
          <TmsSingleDataTemplate
            title="اجمالي عدد المهام"
            value={generalInfo?.totalTasks}
          />
        </div>
        {/* separater */}
        <div className="w-[80%] border-gray-400 rounded-full border-2 my-4" />
        {/* Detailed Tasks info */}
        {tasks.length > 0 ? tasks.map(task => (
          <TmsSingleTaskDetails
            key={task.id}
            onAddClick={() => handleToggle(task.id)}
            onCloseClick={() => setOpenTaskId(null)}
            isOpen={openTaskId === task.id}
            taskId={openTaskId === task.id && openTaskId}
            value1={`${task.manager_evaluation !== null ? task.manager_evaluation : 0}%`}
            value2={`${statusPercentage[task.status]}%`}
            value3={`${(task.manager_evaluation !== null ? Number(task.manager_evaluation) * 0.3 : 0 * 0.3) + (task.assigned_by_evaluation !== null ? Number(task.assigned_by_evaluation) * 0.5 : 0 * 0.5) + (Number(statusPercentage[task.status]) * 0.2)}%`}
            value4={`${task.assigned_by_evaluation !== null ? task.assigned_by_evaluation : 0}%`}
            value6={task.status}
            value7={tmsDevliverSituation(task.start_date, task.end_date, task.status, task.updatedAt)}
            value8={cairoDate(task.start_date)}
            value9={cairoDate(task.end_date)}
            value10={cairoDate(task.updatedAt)}
            value11={task.taskSubCategory.name}
            value12={task.taskSubCategory.taskCategory.name}
            value13={task.task_size}
            value14={task.importance}
            value15={task.file_path || task.submit_file_path ? { sender: task.file_path, reciever: task.submit_file_path } : "------"}
            value16={task.description}
            value17={`${task.assigner.first_name} ${task.assigner.middle_name} ${task.assigner.last_name}`}
            subTasks={task.subTasks}
          />
        )) : <TmsSingleTaskDetails />}
      </div>

      {/* Render Modals */}
      {activeModal === 'tasks' && <TasksModal data={modalData?.data} onClose={closeModal} />}
      {activeModal === 'filters' && <FiltersModal data={modalData?.data} onClose={closeModal} />}
    </div >
  );
};

export default WatomsTmsMyTasks;