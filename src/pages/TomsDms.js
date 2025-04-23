import { useState, useEffect, useRef } from "react";
import "../styles/Dms.css";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { downloadFileDms, fetchingFiles, fetchingOrgs } from "../services/dms";
import { fetchDepartments, fetchDmsCategories } from "../services/data";
import { scrollDown } from "../utils/scrollDown";
import Selector from "../components/Selector";
import dms1 from "../assets/dms1.jpg";
import dms2 from "../assets/dms2.jpg";
import dms3 from "../assets/dms3.jpg";
import Navbar3 from "../components/Navbar3";
import LoadingScreen from "../components/LoadingScreen";
import DenyAccessPage from "../components/DenyAccessPage";

const dmsDesc = "This module ensures operational efficiency and compliance by providing a secure, organized repository for critical documents. It streamlines access, version control, collaboration, and reduces risks from lost or mismanaged information."

const BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL;

const TomsDms = () => {
  const navigate = useNavigate();
  const { userInfo } = useAuth();
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
    const pdfUrl = `${BASE_URL}/api/v1/files/open/${fileName.filteredPath}`;
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
        let departmentId = selectedDepartment && (userInfo.user_role === "Operations Excellence Lead" ||userInfo.user_role === "Manager") 
          ? Number(selectedDepartment)
          : userInfo.user_role !== "Operations Excellence Lead" || userInfo.user_role !== "Manager" ? userInfo.department_id : null;
          console.log(userInfo)
        let organizationId = selectedSchool && userInfo.user_role === "Operations Excellence Lead" ? Number(selectedSchool) : userInfo.user_role !== "Operations Excellence Lead" ? userInfo.organization_id : null;
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

  const header = (label, path) => (
    <button
      className="text-wisdomOrange hover:text-wisdomDarkOrange rounded w-[100px] h-[5vh] flex items-center justify-center self-center"
      onClick={uploadDocument}
    >
      رفع ملف
    </button>
  );

  const imgs = [
    {
      img: dms1,
      title: "Effortless Access",
      description: "Find and utilize crucial information right at your fingertips."
    },
    {
      img: dms2,
      title: "Information Hub",
      description: "Your secure, centralized source for all essential knowledge and data."
    },
    {
      img: dms3,
      title: "Centralized Control",
      description: "Manage all documents and data with ease and security."
    }
  ]

  if (loading) return <LoadingScreen />;
  if (error) return <p>Error: {error}</p>;
  if (userInfo.user_role === "Student") return <DenyAccessPage homePage='/watoms/pms' />;

  return (
    <div className="w-full">
      <Navbar3
        showNavigate={false}
        img={imgs}
        length="w-[570px]"
        header={header}
        Page="DMS"
        description={dmsDesc}
      >
        {/* <button className="bg-wisdomOrange hover:bg-wisdomDarkOrange rounded px-4 py-2 text-white w-[90px]" onClick={uploadDocument}>رفع ملف</button> */}
        {userInfo.user_role === "Operations Excellence Lead" ? <Selector
          label="school"
          title=":المركز"
          description="الرجاء اختيار مركز"
          data={schools}
          value={selectedSchool}
          onChange={handleSchoolChange}
        /> : null}
        {userInfo.user_role === "Operations Excellence Lead" || userInfo.user_role === "Manager" ? <Selector
          label="department"
          title=":المهنة"
          description="الرجاء اختيار مهنة"
          data={departments}
          value={selectedDepartment}
          onChange={handleDepartmentChange}
          name="Name"
        /> : null}
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
        />
        <div className="flex flex-col items-end justify-center">
          <label htmlFor="dateFrom" className="mb-[10px] text-center font-bold">
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
        <button
          className="flex justify-center md:w-full w-[200px] md:mt-[41px] md:m-0 m-auto my-2 items-center bg-wisdomOrange hover:bg-wisdomDarkOrange text-white h-[5vh] px-4 py-2 rounded-md"
          onClick={resetFilters}
        >
          مسح
        </button>
      </Navbar3>
      {/* <div className="w-100 flex justify-end text-white md:h-[70vh] h-[20vh] bg-[url('../assets/DMS.jpg')] bg-no-repeat bg-center bg-[length:100%_100%]">
        <h1 className="mt-[2%] mr-[3%] text-end">:نظام إدارة المستندات</h1>
      </div> */}
      {/* <div className="flex md:flex-row md:justify-evenly flex-col">
        <Selector
          label="school"
          title=":المركز"
          description="الرجاء اختيار مركز"
          data={schools}
          value={selectedSchool}
          onChange={handleSchoolChange}
        />
        <Selector
          label="department"
          title=":المهنة"
          description="الرجاء اختيار مهنة"
          data={departments}
          value={selectedDepartment}
          onChange={handleDepartmentChange}
          name="Name"
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
        />
        <div className="flex flex-col items-center justify-center">
          <label htmlFor="dateFrom" className="mb-[10px] text-center font-bold">
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
        <div className="flex flex-col items-center justify-center">
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
        <button className="flex justify-center md:w-[75px] w-[200px] md:mt-[41px] md:m-0 m-auto my-2 items-center bg-wisdomOrange hover:bg-wisdomDarkOrange text-white h-[5vh] px-4 py-2 rounded-md" onClick={resetFilters}>
          مسح
        </button>
      </div> */}
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
