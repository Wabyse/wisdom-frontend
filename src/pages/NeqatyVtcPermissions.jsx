import { useEffect, useState } from "react";
import NeqatyNavbar from "../components/NeqatyNavbar";
import { useAdminAuth } from "../context/AdminAuthContext";
import { fetchPointsRequests, grantUserPoints } from "../services/neqaty";
import LoadingScreen from "../components/LoadingScreen";
import { Navigate, useLocation } from "react-router-dom";
import { NEQATY_PERMISSION_STATUS } from "../constants/constants";
import DenyAccessPage from "../components/DenyAccessPage";

const NeqatyVtcPermissions = () => {
    const { adminInfo } = useAdminAuth();
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pointsRequests, setPointsRequests] = useState([]);
    const [updateStatus, setUpdateStatus] = useState({});
    const [selectedStatus, setSelectedStatus] = useState({
        id: "",
        status: ""
    });

    const handleSelectChange = (event, id) => {
        setSelectedStatus({ id, status: event.target.value });
    };

    const handleCheck = (id) => {
        setUpdateStatus((prev) => ({ ...prev, [id]: true }));
    };

    const handleConfirm = async (id) => {
        try {
            const request = {
                id: selectedStatus?.id,
                status: selectedStatus?.status,
                adminId: adminInfo.id
            }
            console.log(request)
            const response = await grantUserPoints(request)
            console.log(response)
            setUpdateStatus((prev) => ({ ...prev, [id]: false }));
        } catch (err) {

        }
    };

    useEffect(() => {
        const fetchVtcPermissions = async () => {
            try {
                const requests = await fetchPointsRequests();
                const filteredRequest = requests.filter(request => request.point.type === "vtc_reward" || request.point.type === "vtc_punishment");
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
                    {pointsRequests.length > 0 ? pointsRequests.map((request) => {
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
                                {isChecked ? <select className="w-[8%]" value={selectedStatus.status}
                                    onChange={(e) => handleSelectChange(e, id)}>
                                    <option key="option" value="" disabled>
                                        please select a status
                                    </option>
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
                    }) : <div className="text-center p-2 font-bold">there is no requests available</div>}
                </div>
            </div>
        </>
    )
}

export default NeqatyVtcPermissions;