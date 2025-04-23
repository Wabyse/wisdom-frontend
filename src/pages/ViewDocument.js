import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/ViewDocument.css";
import { useEffect, useState } from "react";
import { fetchingFiles } from "../services/dms";
import { useAuth } from "../context/AuthContext";
import ChangeLanguage from "../components/ChangeLanguage";
import { useLanguage } from "../context/LanguageContext";
import DenyAccessPage from "../components/DenyAccessPage";

const ViewDocument = () => {
  const { id } = useParams();
  const { userInfo } = useAuth();
  const [document, setDocument] = useState(null);
  const { language } = useLanguage();

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"; // Handle undefined/null

    const date = new Date(dateString); // Convert to Date object

    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;

    const formattedTime = `${date.getHours().toString().padStart(2, "0")}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}:${date.getSeconds().toString().padStart(2, "0")}`;

    return `${formattedDate} ${formattedTime}`;
  };

  useEffect(() => {
    const loadingFiles = async () => {
      try {
        const response = await fetchingFiles();

        const filteredDocument = response.data.files.find(
          (document) => document.id === Number(id)
        );

        setDocument(filteredDocument);
      } catch (error) {
        console.error("no files", error);
      }
    };
    loadingFiles();
  }, [id]);

  if (userInfo.user_role === "Student" || userInfo.user_role === "Trainee") return <DenyAccessPage homePage='/pms' />;

  return (
    <div className="bg-gray-500 h-screen">
      <Navbar upload={true} length="w-[430px]">
        <ChangeLanguage />
      </Navbar>
      <div className=" bg-slate-600 text-white p-[20px] rounded-[8px] max-w-[600px] w-full m-auto shadow-md mt-2">
        <h1 className="text-2xl font-bold text-center">{language ? "View Document" : "تفاصيل الملف"}</h1>
        <div className="part">
          <div className="detail-container  bg-slate-200">
            <label className="text-red-600">{language ? "File:" : ":الملف"}</label>
            <h1>{`${document?.file_path
              .split("\\")
              .pop()
              .replace(/^\d+-/, "")}`}</h1>
          </div>
          <div className="detail-container  bg-slate-200">
            <label className="text-red-600">{language ? "Created Date:" : ":تاريخ رفع الملف"}</label>
            <h1>{`${formatDate(document?.createdAt)}`}</h1>
          </div>
        </div>
        <div className="part">
          <div className="detail-container  bg-slate-200">
            <label className="text-red-600">{language ? "Category:" : ":التصنيف"}</label>
            <h1>{`${document?.documentSubCategory.documentCategory.name}`}</h1>
          </div>
          <div className="detail-container  bg-slate-200">
            <label className="text-red-600">{language ? "Sub-Category:" : ":التصنيف الفرعي"}</label>
            <h1>{`${document?.documentSubCategory.name}`}</h1>
          </div>
        </div>
        <div className="part">
          <div className="detail-container  bg-slate-300">
            <label className="text-red-600">{language ? "Department:" : ":القسم"}</label>
            <h1>{`${document?.department.Name}`}</h1>
          </div>
          <div className="detail-container  bg-slate-300">
            <label className="text-red-600">{language ? "Organization:" : ":الجهة"}</label>
            <h1>{`${document?.organization.name}`}</h1>
          </div>
        </div>
        <div className="part">
          <div className="detail-container bg-slate-400">
            <label className="text-slate-600">{language ? "Employee's Name:" : ":اسم الموظف"}</label>
            <h1>{`${document?.uploader.employee?.first_name} ${document?.uploader.employee?.middle_name} ${document?.uploader.employee?.last_name}`}</h1>
          </div>
          <div className="detail-container bg-slate-400">
            <label className="text-slate-600">{language ? "Employee's Role:" : ":مهنة الموظف"}</label>
            <h1>{`${document?.uploader.employee?.role.title}`}</h1>
          </div>
        </div>
        <div className="part">
          <div className="detail-container bg-slate-400">
            <label className="text-slate-600">{language ? "Employee's Organization:" : ":الجهة التابع لها الموظف"}</label>
            <h1>{`${document?.uploader.employee?.organization.name} (${document?.uploader.employee?.organization.type})`}</h1>
          </div>
              {document?.uploader.employee?.teacher ? <div className="detail-container bg-slate-400">
            <label className="text-slate-600">{language ? "Employee's Department:" : ":القسم التابع له الموظف"}</label>
            <h1>{`${document?.uploader.employee?.teacher?.department.Name}`}</h1>
          </div> : null}
        </div>
        {document?.uploader.employee?.teacher ? <div className="detail-container bg-slate-400">
          <label className="text-slate-600">{language ? "Employee's Subject:" : ":المادة"}</label>
          <h1>{`${document?.uploader.employee?.teacher?.subject.name}`}</h1>
        </div> : null}
      </div>
    </div>
  );
};

export default ViewDocument;
