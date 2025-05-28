import { useEffect, useState } from "react";
import NeqatyNavbar from "../components/NeqatyNavbar";
import { useAdminAuth } from "../context/AdminAuthContext";
import { fetchPointsRequests } from "../services/neqaty";
import LoadingScreen from "../components/LoadingScreen";
import { Navigate, useLocation } from "react-router-dom";
import { NEQATY_PERMISSION_STATUS } from "../constants/constants";
import DenyAccessPage from "../components/DenyAccessPage";

const NeqatySchoolPermissions = () => {
    const { adminInfo } = useAdminAuth();
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pointsRequests, setPointsRequests] = useState([]);
    const [updateStatus, setUpdateStatus] = useState({});

    const handleCheck = (id) => {
        setUpdateStatus((prev) => ({ ...prev, [id]: true }));
    };

    const handleConfirm = (id) => {
        setUpdateStatus((prev) => ({ ...prev, [id]: false }));
    };

    useEffect(() => {
        const fetchVtcPermissions = async () => {
            try {
                const requests = await fetchPointsRequests();
                const filteredRequest = requests.filter(request => request.point.type === "school_reward" || request.point.type === "school_punishment");
                setPointsRequests(filteredRequest)
            } catch (err) {
                console.error("API Error:", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        }

        fetchVtcPermissions();
    }, [adminInfo]);

    if (loading) return <LoadingScreen />;
    if (error?.status === 403) return <Navigate to="/login" state={{ from: location }} replace />;
    if (error) return <p>Error: {error.message}</p>;
    if (adminInfo?.user_role !== "ceo" && adminInfo?.user_role !== "super_admin") return <DenyAccessPage homePage='/neqaty' />;

    return (
        <>
            <NeqatyNavbar />
            <div className="w-full flex flex-col items-center">
                <div className="w-[90%] bg-slate-100 rounded shadow-md shadow-black mt-5">
                    {pointsRequests.map((request) => {
                        const id = request.id;
                        const isChecked = updateStatus[id];

                        return (
                            <div key={id} className="p-2 m-2 bg-slate-300 flex justify-evenly items-center">
                                <div>{request.admin.username}</div>
                                <div>{`${request.userPoints.user.employee?.first_name} ${request.userPoints.user.employee?.middle_name} ${request.userPoints.user.employee?.last_name}`}</div>
                                <div>{request.userPoints.points}</div>
                                <div>{request.point.name}</div>
                                <div>{request.point.points}</div>
                                <div>{request.point.type}</div>
                                {isChecked ? <select className="w-[8%]">
                                    {NEQATY_PERMISSION_STATUS.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select> : <div>{request.status}</div>}

                                {isChecked ? (
                                    <button
                                        className="p-2 bg-wisdomOrange text-white rounded"
                                        onClick={() => handleConfirm(id)}
                                    >
                                        confirm
                                    </button>
                                ) : (
                                    <button
                                        className="p-2 bg-wisdomOrange text-white rounded"
                                        onClick={() => handleCheck(id)}
                                    >
                                        check
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    )
}

export default NeqatySchoolPermissions;