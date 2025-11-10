import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const PeSideBarNavigation = ({ currentPage = "home", selectedCandidate = {} }) => {
    const navigate = useNavigate();
    return (
        <div className="w-[10%] bg-white/55 flex flex-col justify-evenly items-center">
            <Toaster />
            <div>اجراءات الحوكمة</div>
            <button onClick={currentPage !== "home" ? () => navigate('/watoms/pe') : null} className={`w-[90%] h-[12%] flex justify-center items-center text-yellow-400 text-sm text-center px-2 rounded-xl border-blue-600 border-2 ${currentPage === "home" ? "bg-gray-500 cursor-default" : "bg-[#0a183d] hover:bg-gray-500 cursor-pointer"}`} disabled={currentPage === "home"}>ملفات تاكيد الهوية</button>
            <button onClick={currentPage !== "practical-test" ? () => navigate('/watoms/pe/practical-test') : null} className={`w-[90%] h-[12%] flex justify-center items-center text-yellow-400 text-sm text-center px-2 rounded-xl border-blue-600 border-2 ${currentPage === "practical-test" ? "bg-gray-500 cursor-default" : "bg-[#0a183d] hover:bg-gray-500 cursor-pointer"}`} disabled={currentPage === "practical-test"}>تقييم مراقبين الجودة والحوكمة</button>
            <button onClick={() => currentPage !== "observer-evaluation" ? selectedCandidate ? navigate(`/watoms/pe/observer-evaluation/${selectedCandidate?.candidate_id}`) : toast.error("اختر او اضف متقدم اولا ") : null} className={`w-[90%] h-[12%] flex justify-center items-center text-yellow-400 text-sm text-center px-2 rounded-xl border-blue-600 border-2 ${currentPage === "observer-evaluation" ? "bg-gray-500 cursor-default" : "bg-[#0a183d] hover:bg-gray-500 cursor-pointer"}`} disabled={currentPage === "observer-evaluation"}>تقييم مراقب الاختبار</button>
            <button onClick={() => currentPage !== "candidates-exam" ? selectedCandidate ? navigate(`/watoms/pe/candidates-exam/${selectedCandidate?.candidate_id}`) : toast.error("اختر او اضف متقدم اولا ") : null} className={`w-[90%] h-[12%] flex justify-center items-center text-yellow-400 text-sm text-center px-2 rounded-xl border-blue-600 border-2 ${currentPage === "candidates-exam" ? "bg-gray-500 cursor-default" : "bg-[#0a183d] hover:bg-gray-500 cursor-pointer"}`} disabled={currentPage === "candidates-exam"}>اختبارات المرشحين</button>
        </div>
    )
}

export default PeSideBarNavigation;