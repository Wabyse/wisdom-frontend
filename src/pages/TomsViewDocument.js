import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/ViewDocument.css";
import { useEffect, useState } from "react";
import { fetchingFiles } from "../services/dms";

const TomsViewDocument = () => {
  const { id } = useParams();
  const [document, setDocument] = useState(null);

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
  return (
    <>
      <Navbar showNavigate={false} upload={true}></Navbar>
      <div className="view">
        <h1 className="text-2xl font-bold">بيانات الملف</h1>
        <div className="part">
          <div className="detail-container">
            <label>:الملف</label>
            <h1>{`${document?.file_path
              .split("\\")
              .pop()
              .replace(/^\d+-/, "")}`}</h1>
          </div>
          <div className="detail-container">
            <label>:تاريخ رفع الملف</label>
            <h1>{`${formatDate(document?.createdAt)}`}</h1>
          </div>
        </div>
        <div className="part">
          <div className="detail-container">
            <label>:التصنيف</label>
            <h1>{`${document?.documentSubCategory.documentCategory.name}`}</h1>
          </div>
          <div className="detail-container">
            <label>:التصنيف الفرعي</label>
            <h1>{`${document?.documentSubCategory.name}`}</h1>
          </div>
        </div>
        <div className="part">
          <div className="detail-container">
            <label>:المهنة</label>
            <h1>{`${document?.department.Name}`}</h1>
          </div>
          <div className="detail-container">
            <label>:المركز</label>
            <h1>{`${document?.organization.name}`}</h1>
          </div>
        </div>
        <div className="part">
          <div className="detail-container">
            <label>:اسم الموظف</label>
            <h1>{`${document?.uploader.employee?.first_name} ${document?.uploader.employee?.middle_name} ${document?.uploader.employee?.last_name}`}</h1>
          </div>
          <div className="detail-container">
            <label>:عمل الموظف</label>
            <h1>{`${document?.uploader.employee?.role.title}`}</h1>
          </div>
        </div>
        <div className="part">
          <div className="detail-container">
            <label>:مركز الموظف</label>
            <h1>{`${document?.uploader.employee?.organization.name} (${document?.uploader.employee?.organization.type})`}</h1>
          </div>
          <div className="detail-container">
            <label>:مهنة الموظف</label>
            <h1>{`${document?.uploader.employee?.teacher?.department.Name}`}</h1>
          </div>
        </div>
        <div className="detail-container">
          <label>:دورة الموظف التابع لها</label>
          <h1>{`${document?.uploader.employee?.teacher?.subject.name}`}</h1>
        </div>
      </div>
    </>
  );
};

export default TomsViewDocument;