import DenyAccessPage from "../components/DenyAccessPage";
import { useAuth } from "../context/AuthContext";
import BulkTraineesUsers from "../components/bulkTraineesUsers";
import BulkStudentTeacherForm from "../components/bulkStudentTeacherForm";
import BulkForms from "../components/bulkForms";

const BulkData = () => {
    const { userInfo } = useAuth();

    if (userInfo.user_role !== "Operations Excellence Lead")
        return <DenyAccessPage homePage='/pms' />;

    return (
        <div>
          <BulkForms />
          <BulkTraineesUsers />
        </div>
    );
};

export default BulkData;