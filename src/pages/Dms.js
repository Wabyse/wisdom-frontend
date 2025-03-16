import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import "../styles/Dms.css";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL;

const Dms = () => {
  const navigate = useNavigate();

  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedSchool, setSelectedSchool] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [language, setLanguage] = useState(true);
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
    navigate(`/dms/view/${id}`);
  };

  // const handleSubCategoryClick = () => {
  //   if (!selectedCategory) {
  //     alert("Please select a category first!");
  //   }
  // };

  const uploadDocument = () => {
    navigate(`/dms/upload`);
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

  const changeLanguage = () => {
    setLanguage(!language);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    if (!(Number(e.target.value) === 0)) {
      setSubCategories(categories[e.target.value - 1].subCategory)
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

  const openPDF = (fileName) => {
    const pdfUrl = `${BASE_URL}/api/v1/files/open/${fileName.filteredPath}`; // Your PDF URL
    window.open(pdfUrl, "_blank"); // Opens PDF in new tab
  };

  const handleDepartmentChange = (e) => {
    setSelectedDepartment(e.target.value);
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

  const handleSchoolChange = (e) => {
    setSelectedSchool(e.target.value);
    window.scrollTo({ top: 0, behavior: "smooth" });

    setTimeout(() => {
      if (targetDivRef.current) {
        const divPosition = targetDivRef.current.offsetTop;
        window.scrollTo({ top: divPosition, behavior: "smooth" });
      }
    }, 500);
  };

  const handleDownload2 = async (path) => {
    try {
      // Ensure correct filename extraction for Windows
      const fileName = path.filteredPath.split("\\").pop();

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
    const fetchingFiles = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/v1/files/view`,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
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
    fetchingFiles();
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
        const response = await axios.get(
          `${BASE_URL}/api/v1/forms/AllOrgs`,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        setSchools(response.data.data);
      } catch (error) {
        console.error("no files", error);
      }
    };
    fetchingOrg();
  }, []);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/v1/forms/AllDepartments`,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        setDepartments(response.data?.data || []);
      } catch (err) {
        console.error("API Error:", err);
        setError(
          err.message || "An error occurred while fetching curriculums data."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/v1/files/categories`,
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <Navbar>
        <button onClick={uploadDocument}>
          {language ? "Upload Document" : "رفع ملف"}
        </button>
        <button className="language" onClick={changeLanguage}>
          {language ? "AR" : "EN"}
        </button>
      </Navbar>
      <div className={language ? "dmsTitle" : "dmsTitle-ar"}>
        {language ? (
          <h1 className="dmsTitle2">Document Management System:</h1>
        ) : (
          <h1 className="dmsTitle2-ar">:نظام إدارة المستندات</h1>
        )}
      </div>
      <div className="filters">
        <div className="select">
          <label htmlFor="school">{language ? "School:" : ":المدرسة"}</label>
          <select
            id="school"
            name="school"
            onChange={handleSchoolChange}
            value={selectedSchool}
          >
            <option value="" disabled>
              {language ? "Please Select a School" : "الرجاء اختيار مدرسة"}
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
          <label htmlFor="department">
            {language ? "Department:" : ":القسم"}
          </label>
          <select
            id="department"
            name="department"
            onChange={handleDepartmentChange}
            value={selectedDepartment}
          >
            <option value="" disabled>
              {language ? "Please Select a Department" : "الرجاء اختيار قسم"}
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
          <label htmlFor="category">
            {language ? "Category:" : ":التصنيف"}
          </label>
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
        <div className="select">
          <label htmlFor="subCategory">
            {language ? "Sub Category:" : ":التصنيف الفرعي"}
          </label>
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
        <div className="date-section-DMS">
          <label htmlFor="dateFrom" className="DMS-date-label">
            {language ? "From:" : ":من"}
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
            {language ? "To:" : ":الي"}
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
          {language ? "Reset" : "مسح"}
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
                  Open
                </button>
                <button
                  className="dmsButton"
                  onClick={() => handleDownload2(file)}
                >
                  download
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="noData">there is no documents available</p>
        )}
      </div>
    </div>
  );
};

export default Dms;
