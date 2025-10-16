import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import DenyAccessPage from "../components/DenyAccessPage";
import { fetchUsers, getCheckInOut } from "../services/data";
import LoadingScreen from "../components/LoadingScreen";
import { Navigate, useLocation } from "react-router-dom";
import { cairoDate } from "../utils/cairoDate";

const today = new Date().toISOString().split('T')[0];

const ViewCheckInOut = () => {
    const { userInfo } = useAuth();
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [users, setUsers] = useState([]);
    const [userCheckInMap, setUserCheckInMap] = useState({});
    const [selectedDate, setSelectedDate] = useState(today);

    useEffect(() => {
        const loadUsersAndCheckIns = async () => {
            try {
                const fetchedUsers = await fetchUsers(userInfo);
                const ebdaEmp = fetchedUsers.filter(emp => emp.employee?.organization_id === 3 && emp.id !== 125 && emp.id !== 174 && emp.id !== 217 && emp.id !== 274 && emp.id !== 275 && emp.id !== 277);
                setUsers(ebdaEmp);

                const checkInData = {};

                for (const user of ebdaEmp) {
                    try {
                        const response = await getCheckInOut({ user_id: Number(user.id) });
                        const filteredResponse = response.filter(check => filterDate(check.createdAt, selectedDate))
                        checkInData[user.id] = filteredResponse || [];
                    } catch (err) {
                        console.warn(`No check-in/out for user ${user.id}`);
                        checkInData[user.id] = [];
                    }
                }

                setUserCheckInMap(checkInData);
            } catch (err) {
                console.error("API Error:", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        loadUsersAndCheckIns();
    }, [selectedDate]);

    const filterDate = (fetchedDate, requiredDate) => {
        const cairoNow = new Date(requiredDate).toLocaleDateString("en-GB", {
            timeZone: "Africa/Cairo",
        });

        const targetDate = new Date(fetchedDate).toLocaleDateString("en-GB", {
            timeZone: "Africa/Cairo",
        });

        return cairoNow === targetDate;
    };


    if (userInfo.employee_role !== "Software Developer" && userInfo.employee_role !== "CEO" && userInfo.user_role !== "Operations Excellence Lead") return <DenyAccessPage homePage='/' />;
    if (loading) return <LoadingScreen />;
    if (error?.status === 403) return <Navigate to="/login" state={{ from: location }} replace />;
    if (error) return <p>Error: {error.message}</p>;
    if (userInfo?.code === 1452 || userInfo?.code === 1476) return <DenyAccessPage homePage='/watoms/dashboard' />;
    if (userInfo?.code === 1475) return <DenyAccessPage homePage='/watoms/news' />;
    if (userInfo?.code === 1310) return <DenyAccessPage homePage='/wisdom/dashboard' />;
    return (
        <>
            <div className="flex flex-col">
                <label className="text-center text-3xl font-bold">Date</label>
                <input type="date" className="w-fit self-center border-blue-600 border-4 rounded p-2" defaultValue={today} onChange={(e) => setSelectedDate(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4 m-5">
                {users.map(user => {
                    const checkIns = userCheckInMap[user.id] || [];

                    return (
                        <div key={user.user_id} className="bg-slate-200 rounded-lg p-4 shadow-md shadow-gray-500 flex flex-col items-center justify-center">
                            <h1 className="text-center font-bold text-2xl mb-2">
                                {user.employee.employee_first_name} {user.employee.employee_middle_name} {user.employee.employee_last_name}
                            </h1>

                            {checkIns.length > 0 ? (
                                checkIns.map((location, index) => (
                                    <div key={index} className="mb-4">
                                        <h2 className="text-lg font-semibold text-center text-green-700">
                                            Checks
                                        </h2>
                                        <button className="text-center hover:text-blue-600" onClick={() => window.open(`https://www.google.com/maps?q=${location.latitude},${location.longitude}`, "_blank")}>
                                            {cairoDate(location.createdAt)}
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center italic text-gray-600">No check-in/out data available Today</p>
                            )}
                        </div>
                    );
                })}
            </div>
        </>
    );

}

export default ViewCheckInOut;