import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { fetchingFiles } from "../services/dms";
import { useAuth } from "../context/AuthContext";
import DenyAccessPage from "../components/DenyAccessPage";

const TomsViewDocument = () => {
  const { id } = useParams();
  const [document, setDocument] = useState(null);
  const { userInfo } = useAuth();

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
        const response = await fetchingFiles(userInfo);

        const filteredDocument = response.data.files.find(
          (document) => document.id === Number(id)
        );

        setDocument(filteredDocument);
      } catch (error) {
        console.error("no files", error);
      }
    };
    loadingFiles();
  }, [id, userInfo]);
  if (userInfo?.code === 1452 || userInfo?.code === 1476) return <DenyAccessPage homePage='/watoms/dashboard' />;
  if (userInfo?.code === 1475) return <DenyAccessPage homePage='/watoms/news' />;
  if (userInfo?.code === 1310) return <DenyAccessPage homePage='/wisdom/dashboard' />;
  return (
    <div className="bg-gray-500 h-screen">
      <Navbar showNavigate={false} upload={true}></Navbar>
      <div className="bg-slate-600 p-[20px] rounded-[8px] max-w-[600px] w-full m-auto shadow-md mt-2">
        <h1 className="text-2xl font-bold text-center text-white">بيانات الملف</h1>
        <div className="flex justify-between gap-[15px]">
          <div className="text-center border-2 border-black m-[2px] flex-1 p-[10px] rounded-[6px] bg-slate-200">
            <label className="text-red-600 text-[13px] font-bold block mb-[3px]">:الملف</label>
            <h1 className="text-lg m-0 font-normal">{`${document?.file_path
              .split("\\")
              .pop()
              .replace(/^\d+-/, "")}`}</h1>
          </div>
          <div className="text-center border-2 border-black m-[2px] flex-1 p-[10px] rounded-[6px] bg-slate-200">
            <label className="text-red-600 text-[13px] font-bold block mb-[3px]">:تاريخ رفع الملف</label>
            <h1 className="text-lg m-0 font-normal">{`${formatDate(document?.createdAt)}`}</h1>
          </div>
        </div>
        <div className="flex justify-between gap-[15px]">
          <div className="text-center border-2 border-black m-[2px] flex-1 p-[10px] rounded-[6px] bg-slate-200">
            <label className="text-red-600 text-[13px] font-bold block mb-[3px]">:التصنيف</label>
            <h1 className="text-lg m-0 font-normal">{`${document?.documentSubCategory.documentCategory.name}`}</h1>
          </div>
          <div className="text-center border-2 border-black m-[2px] flex-1 p-[10px] rounded-[6px] bg-slate-200">
            <label className="text-red-600 text-[13px] font-bold block mb-[3px]">:التصنيف الفرعي</label>
            <h1 className="text-lg m-0 font-normal">{`${document?.documentSubCategory.name}`}</h1>
          </div>
        </div>
        <div className="flex justify-between gap-[15px]">
          <div className="text-center border-2 border-black m-[2px] flex-1 p-[10px] rounded-[6px] bg-slate-300">
            <label className="text-red-600 text-[13px] font-bold block mb-[3px]">:المهنة</label>
            <h1 className="text-lg m-0 font-normal">{`${document?.department.Name}`}</h1>
          </div>
          <div className="text-center border-2 border-black m-[2px] flex-1 p-[10px] rounded-[6px] bg-slate-300">
            <label className="text-red-600 text-[13px] font-bold block mb-[3px]">:المركز</label>
            <h1 className="text-lg m-0 font-normal">{`${document?.organization.name}`}</h1>
          </div>
        </div>
        <div className="flex justify-between gap-[15px]">
          <div className="text-center border-2 border-black m-[2px] flex-1 p-[10px] rounded-[6px] bg-slate-400">
            <label className="text-slate-600 text-[13px] font-bold block mb-[3px]">:اسم الموظف</label>
            <h1 className="text-lg m-0 font-normal">{`${document?.uploader.employee?.first_name} ${document?.uploader.employee?.middle_name} ${document?.uploader.employee?.last_name}`}</h1>
          </div>
          <div className="text-center border-2 border-black m-[2px] flex-1 p-[10px] rounded-[6px] bg-slate-400">
            <label className="text-slate-600 text-[13px] font-bold block mb-[3px]">:عمل الموظف</label>
            <h1 className="text-lg m-0 font-normal">{`${document?.uploader.employee?.role.title}`}</h1>
          </div>
        </div>
        <div className="flex justify-between gap-[15px]">
          <div className="text-center border-2 border-black m-[2px] flex-1 p-[10px] rounded-[6px] bg-slate-400">
            <label className="text-slate-600 text-[13px] font-bold block mb-[3px]">:مركز الموظف</label>
            <h1 className="text-lg m-0 font-normal">{`${document?.uploader.employee?.organization.name} (${document?.uploader.employee?.organization.type})`}</h1>
          </div>
          {document?.uploader.employee?.teacher ? <div className="text-center border-2 border-black m-[2px] flex-1 p-[10px] rounded-[6px] bg-slate-400">
            <label className="text-slate-600 text-[13px] font-bold block mb-[3px]">:مهنة الموظف</label>
            <h1 className="text-lg m-0 font-normal">{`${document?.uploader.employee?.teacher?.department.Name}`}</h1>
          </div> : null}
        </div>
        {document?.uploader.employee?.teacher ? <div className="text-center border-2 border-black m-[2px] flex-1 p-[10px] rounded-[6px] bg-slate-400">
          <label className="text-slate-600 text-[13px] font-bold block mb-[3px]">:دورة الموظف التابع لها</label>
          <h1 className="text-lg m-0 font-normal">{`${document?.uploader.employee?.teacher?.subject.name}`}</h1>
        </div> : null}
      </div>
    </div>
  );
};

export default TomsViewDocument;