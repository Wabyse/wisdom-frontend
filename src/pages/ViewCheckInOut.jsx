import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import DenyAccessPage from "../components/DenyAccessPage";
import { fetchUsers, getCheckInOut } from "../services/data";
import LoadingScreen from "../components/LoadingScreen";
import { Navigate, useLocation } from "react-router-dom";
import MapLocation from "../components/MapLocation";
import Selector2 from "../components/Selector2";

const checks = ["check in", "check out"]

const ViewCheckInOut = () => {
    const { userInfo } = useAuth();
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState("");
    const [checkIns, setCheckIns] = useState([]);
    useEffect(() => {
        const loadUsers = async () => {
            try {
                const fetchedUsers = await fetchUsers(userInfo)
                const ebdaEmp = fetchedUsers.filter(emp => emp.employee?.organization_id === 3);
                setUsers(ebdaEmp);
            } catch (err) {
                console.error("API Error:", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        loadUsers();
    }, []);

    useEffect(() => {
        const loadMaps = async () => {
            try {
                if (selectedUser) {
                    const userLocations = {
                        user_id: Number(selectedUser),
                    };
                    const userCheckIns = await getCheckInOut(userLocations);
                    setCheckIns(userCheckIns.checkInOuts);
                }
            } catch (err) {
                console.error("API Error:", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        loadMaps();
    }, [selectedUser]);

    if (userInfo.employee_role !== "Software Developer" && userInfo.employee_role !== "CEO" && userInfo.user_role !== "Operations Excellence Lead") return <DenyAccessPage homePage='/' />;
    if (loading) return <LoadingScreen />;
    if (error?.status === 403) return <Navigate to="/login" state={{ from: location }} replace />;
    if (error) return <p>Error: {error.message}</p>;
    return (
        <>
            <Selector2
                label="Employee"
                title={"Employee:"}
                description={"Please Select an Employee"}
                data={users}
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                name="userEmp"
            />
            {checkIns.map((location, index) => {
                return (
                    <>
                    <h1 className="text-6xl text-center">{index < 2 ? checks[index] : "More Checks"}</h1>
                        <h1 className="text-4xl text-center">
                            {new Date(location.createdAt).toLocaleString('en-GB', {
                                timeZone: 'Africa/Cairo', // Replace with your actual timezone if needed
                                hour12: false,
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit'
                            })}
                        </h1>
                        <MapLocation position={[location.latitude, location.longitude]} />
                    </>
                )
            })}
        </>
    )
}

export default ViewCheckInOut;