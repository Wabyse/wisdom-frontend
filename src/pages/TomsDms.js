import { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import "../styles/Dms.css";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { downloadFileDms, fetchingFiles, fetchingOrgs } from "../services/dms";
import { fetchDepartments, fetchDmsCategories } from "../services/data";
import { scrollDown } from "../utils/scrollDown";

const BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL;

const TomsDms = () => {
  const navigate = useNavigate();

  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedSchool, setSelectedSchool] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtered, setFiltered] = useState([]);
  const [schools, setSchools] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [dateFrom, setDateFrom] = useState();
  const [dateTo, setDateTo] = useState();
  const [test, setTest] = useState(0);
  const { userInfo } = useAuth();
  const targetDivRef = useRef(null);

  const handleClick = (id) => {
    navigate(`/watoms/dms/view/${id}`);
  };

  const uploadDocument = () => {
    navigate(`/watoms/dms/upload`);
  };

  const resetFilters = (e) => {
    e.preventDefault();
    setDateTo();
    setDateFrom();
    setSelectedSchool("");
    setSelectedDepartment("");
    setSelectedCategory("");
    setSelectedSubCategory("");
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

  const handleDateFromChange = (event) => {
    setDateFrom(event.target.value);
    scrollDown(targetDivRef);
  };

  const handleDateToChange = (event) => {
    setDateTo(event.target.value);
    scrollDown(targetDivRef);
  };

  const openPDF = (fileName) => {
    const pdfUrl = `${BASE_URL}/api/v1/files/open/${fileName.filteredPath}`; // Your PDF URL
    window.open(pdfUrl, "_blank"); // Opens PDF in new tab
  };

  const handleDepartmentChange = (e) => {
    setSelectedDepartment(e.target.value);
    scrollDown(targetDivRef);
  };

  const handleSchoolChange = (e) => {
    setSelectedSchool(e.target.value);
    scrollDown(targetDivRef);
  };

  const handleDownload2 = (path) => {
    try {
      // Ensure correct filename extraction for Windows
      const fileName = path.filteredPath.split("\\").pop();
      downloadFileDms(fileName);
    } catch (error) {
      console.error("Download error", error);
      alert("File download failed");
    }
  };

  useEffect(() => {
    const loadingFiles = async () => {
      try {
        const response = await fetchingFiles();
        let newFiltered = [];
        const paths = response.data.files;
        let departmentId = selectedDepartment
          ? Number(selectedDepartment)
          : null;
        let organizationId = selectedSchool ? Number(selectedSchool) : null;
        let fromDate = dateFrom ? new Date(dateFrom) : null;
        let toDate = dateTo ? new Date(dateTo) : null;
        let categoryFilter = selectedCategory ? Number(selectedCategory) : null;
        let subCategoryFilter = selectedSubCategory
          ? Number(selectedSubCategory)
          : null;

        const formatDate = (date) =>
          date
            ? new Date(date.getFullYear(), date.getMonth(), date.getDate())
            : null;

        const hasFilter =
          (selectedDepartment !== 0 && selectedDepartment !== "") ||
          (selectedSchool !== 0 && selectedSchool !== "") ||
          (selectedCategory !== 0 && selectedCategory !== "") ||
          (selectedSubCategory !== 0 && selectedSubCategory !== "") ||
          dateFrom ||
          dateTo;
        if (hasFilter) {
          paths.forEach((filter) => {
            const fileDate = new Date(filter.createdAt);
            const isDateMatch =
              (!fromDate || formatDate(fileDate) >= formatDate(fromDate)) &&
              (!toDate || formatDate(fileDate) <= formatDate(toDate));
            const isDepartmentMatch =
              !departmentId || departmentId === filter.department.id;
            const isOrganizationMatch =
              !organizationId || organizationId === filter.organization.id;
            const isCategoryMatch =
              !categoryFilter ||
              categoryFilter === filter.documentSubCategory.documentCategory.id;
            const isSubCategoryMatch =
              !subCategoryFilter ||
              subCategoryFilter === filter.documentSubCategory.id;

            if (
              isDateMatch &&
              isDepartmentMatch &&
              isOrganizationMatch &&
              isCategoryMatch &&
              isSubCategoryMatch
            ) {
              const filteredPath = filter.file_path.split("\\").pop();
              newFiltered.push({
                id: filter.id,
                filteredPath,
                date: filter.createdAt,
              });
            }
          });
        } else if (
          selectedDepartment === "" &&
          selectedSchool === "" &&
          selectedCategory === "" &&
          selectedSubCategory === ""
        ) {
          console.log("done");
        } else {
          newFiltered = paths.map((filter) => ({
            id: filter.id,
            filteredPath: filter.file_path.split("\\").pop(),
            date: filter.createdAt,
          }));
        }
        setFiltered(newFiltered);
      } catch (error) {
        console.error("no files", error);
      }
    };
    loadingFiles();
  }, [
    userInfo,
    selectedDepartment,
    dateFrom,
    dateTo,
    selectedSchool,
    selectedCategory,
    selectedSubCategory,
  ]);

  useEffect(() => {
    const fetchingOrg = async () => {
      try {
        const response = await fetchingOrgs();
        setSchools(response);
      } catch (error) {
        console.error("no files", error);
      }
    };

    const loadDepartments = async () => {
      try {
        const response = await fetchDepartments();
        setDepartments(response);
      } catch (err) {
        console.error("API Error:", err);
        setError(
          err.message || "An error occurred while fetching curriculums data."
        );
      }
    };

    loadDepartments();
    fetchingOrg();
    setLoading(false);
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetchDmsCategories();

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

    fetchCategories();
  }, [test]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <Navbar showNavigate={false}>
        <button onClick={uploadDocument}>رفع ملف</button>
      </Navbar>
      <div className="dmsTitle-ar">
        <h1 className="dmsTitle2-ar">:نظام إدارة المستندات</h1>
      </div>
      <div className="filters">
        <div className="select">
          <label htmlFor="school">:المركز</label>
          <select
            id="school"
            name="school"
            onChange={handleSchoolChange}
            value={selectedSchool}
          >
            <option value="" disabled>
              الرجاء اختيار مركز
            </option>
            <option value="0">All</option>
            {schools.map((school) => (
              <option key={school.id} value={school.id}>
                {school.name}
              </option>
            ))}
          </select>
        </div>
        <div className="select">
          <label htmlFor="department">:المهنة</label>
          <select
            id="department"
            name="department"
            onChange={handleDepartmentChange}
            value={selectedDepartment}
          >
            <option value="" disabled>
              الرجاء اختيار مهنة
            </option>
            <option value="0">All</option>
            {departments.map((department) => (
              <option key={department.id} value={department.id}>
                {department.Name}
              </option>
            ))}
          </select>
        </div>
        <div className="select">
          <label htmlFor="category">:التصنيف</label>
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
        </div>
        <div className="select">
          <label htmlFor="subCategory">:التصنيف الفرعي</label>
          <select
            id="subCategory"
            name="subCategory"
            onChange={handleSubCategoryChange}
            value={selectedSubCategory}
            // onClick={handleSubCategoryClick}
          >
            <option value="" disabled>
              برجاء اختيار تصنيف فرعي
            </option>
            <option value="0">All</option>
            {subCategories.map((option) => (
              <option value={option.id}>{option.name}</option>
            ))}
          </select>
        </div>
        <div className="date-section-DMS">
          <label htmlFor="dateFrom" className="DMS-date-label">
            :من
          </label>
          <input
            id="dateFrom"
            name="dateFrom"
            type="date"
            className="date-DMS"
            onChange={handleDateFromChange}
          />
        </div>
        <div className="date-section-DMS">
          <label htmlFor="dateTo" className="DMS-date-label">
            :الي
          </label>
          <input
            id="dateTo"
            name="dateTo"
            type="date"
            className="date-DMS"
            onChange={handleDateToChange}
          />
        </div>
        <button className="select DMSBtn" onClick={resetFilters}>
          مسح
        </button>
      </div>
      <div className="files" ref={targetDivRef}>
        {filtered.length > 0 ? (
          filtered.map((file, index) => (
            <div className="file">
              <div className="openFile" onClick={() => handleClick(file.id)}>
                {/* <div>({index + 1})</div> */}
                <div>{file.filteredPath.replace(/^\d+-/, "")}</div>
                <div>{formatDate(file.date)}</div>
              </div>
              <div>
                <button className="dmsButton" onClick={() => openPDF(file)}>
                  فتح
                </button>
                <button
                  className="dmsButton"
                  onClick={() => handleDownload2(file)}
                >
                  تحميل
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="noData">لا يوجد ملفات متاحة</p>
        )}
      </div>
    </div>
  );
};

export default TomsDms;
