import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const PeSideBarNavigation = ({ currentPage = "home", selectedCandidate = null }) => {
    const navigate = useNavigate();
    const baseBtn =  "w-[90%] h-[12%] flex justify-center items-center text-yellow-400 text-sm text-center px-2 rounded-xl border-2 border-blue-600 transition";
    const activeBtn = "bg-gray-500 cursor-default";
    const inactiveBtn = "bg-[#0a183d] hover:bg-gray-500 cursor-pointer";

    return (
        <nav className="w-[10%] bg-white/55 flex flex-col justify-evenly items-center" aria-label="Professional Examination Sidebar Navigation">
            <div>اجراءات الحوكمة</div>
            <button onClick={currentPage !== "home" ? () => navigate('/watoms/pe') : null} className={`${baseBtn} ${currentPage === "home" ? activeBtn : "bg-[#0a183d] hover:bg-gray-500 cursor-pointer"}`} disabled={currentPage === "home"}>ملفات تاكيد الهوية</button>
            <button onClick={() => currentPage !== "qg-observer-evaluation" ? selectedCandidate ? navigate(`/watoms/pe/qg-observers-evaluation/${selectedCandidate?.candidate_id}`) : toast.error("اختر او اضف متقدم اولا ") : null} className={`${baseBtn} ${currentPage === "qg-observer-evaluation" ? activeBtn : inactiveBtn}`} disabled={currentPage === "qg-observer-evaluation"}>تقييم مراقبين الجودة والحوكمة</button>
            <button onClick={() => currentPage !== "observer-evaluation" ? selectedCandidate ? navigate(`/watoms/pe/observer-evaluation/${selectedCandidate?.candidate_id}`) : toast.error("اختر او اضف متقدم اولا ") : null} className={`${baseBtn} ${currentPage === "observer-evaluation" ? activeBtn : inactiveBtn}`} disabled={currentPage === "observer-evaluation"}>تقييم مراقب الاختبار</button>
            <button onClick={() => currentPage !== "candidates-exam" ? selectedCandidate ? navigate(`/watoms/pe/candidates-exam/${selectedCandidate?.candidate_id}`) : toast.error("اختر او اضف متقدم اولا ") : null} className={`${baseBtn} ${currentPage === "candidates-exam" ? activeBtn : inactiveBtn}`} disabled={currentPage === "candidates-exam"}>اختبارات المرشحين</button>
        </nav>
    )
}

export default PeSideBarNavigation;