import { useEffect, useState } from "react";
import { fetchSchools, fetchVtcEmployees } from "../services/data";
import LoadingScreen from "../components/LoadingScreen";
import { Navigate, useLocation } from "react-router-dom";
import Selector2 from "../components/Selector2";
import { useAdminAuth } from "../context/AdminAuthContext";
import NeqatyNavbar from "../components/NeqatyNavbar";
import { fetchVtcPoints, updateUserPoints } from "../services/neqaty";
import { fetchAllTeachers } from "../services/pms";
import toast, { Toaster } from "react-hot-toast";

const NeqatyVtc = () => {
    const { adminInfo } = useAdminAuth();
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [Vtcs, setVtcs] = useState([]);
    const [selectedVtc, setSelectedVtc] = useState("");
    const [selectedFilter, setSelectedFilter] = useState("");
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState("");
    const [points, setPoints] = useState([]);
    const [selectedPoints, setSelectedPoints] = useState([]);

    const submitPoints = async () => {
        try {
            for (const point of selectedPoints) {
                const data = {
                    admin_id: adminInfo.id,
                    user_id: Number(selectedUser),
                    point
                };
                await updateUserPoints(data);
            }

            toast.success("All points submitted successfully");
        } catch (error) {
            toast.error("There was an error submitting points");
        }
    };

    useEffect(() => {
        const loadVtcs = async () => {
            try {
                const loadedVtcs = await fetchSchools();
                const filteredVtcs = loadedVtcs.filter(vtc => vtc.id !== 1 && vtc.id !== 2);
                setVtcs(filteredVtcs);
            } catch (err) {
                console.error("API Error:", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        }

        loadVtcs();
    }, []);

    useEffect(() => {
        const loadUsers = async () => {
            try {
                if (selectedFilter === "Employees") {
                    const loadedEmployees = await fetchVtcEmployees();
                    console.log(loadedEmployees)
                    const filteredEmployees = loadedEmployees.filter(
                        (employee) => employee.employee?.organization_id === Number(selectedVtc)
                    );
                    setUsers(filteredEmployees);
                } else if (selectedFilter === "Trainers") {
                    const loadedTeachers = await fetchAllTeachers();
                    const filteredTeachers = loadedTeachers.filter(
                        (teacher) => teacher.employee?.organization_id === Number(selectedVtc)
                    );
                    setUsers(filteredTeachers);
                }
            } catch (err) {
                console.error("API Error:", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        if (selectedVtc) {
            loadUsers();
        }
    }, [selectedFilter, selectedVtc]);

    useEffect(() => {
        const loadVtcPoints = async () => {
            try {
                const loadedVtcPoints = await fetchVtcPoints();
                setPoints(loadedVtcPoints);
            } catch (err) {
                console.error("API Error:", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        if (selectedUser) {
            loadVtcPoints();
        }
    }, [selectedUser]);

    const rewards = points?.filter((point) => point.type === "vtc_reward");
    const punishments = points?.filter((point) => point.type === "vtc_punishment");

    const handlePointToggle = (value) => {
        setSelectedPoints((prev) =>
            prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
        );
    };

    if (loading) return <LoadingScreen />;
    if (error?.status === 403) return <Navigate to="/login" state={{ from: location }} replace />;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <>
            <Toaster />
            <NeqatyNavbar />
            <Selector2
                label="vtc"
                title={"Vtcs:"}
                description={"Please Select a Vtc"}
                data={Vtcs}
                value={selectedVtc}
                onChange={(e) => setSelectedVtc(e.target.value)}
                name="name"
            />
            {selectedVtc !== "" && (
                <div className="flex justify-evenly w-full mt-4 gap-6">
                    <button
                        className="bg-wisdomOrange text-white md:text-3xl text-xl py-2 px-6 rounded shadow-sm shadow-wisdomLightOrange"
                        onClick={() => setSelectedFilter("Employees")}
                    >
                        Employees
                    </button>
                    <button
                        className="bg-wisdomOrange text-white md:text-3xl text-xl py-2 px-6 rounded shadow-sm shadow-wisdomLightOrange"
                        onClick={() => setSelectedFilter("Trainers")}
                    >
                        Trainers
                    </button>
                </div>
            )}
            {selectedFilter === "Employees" && (
                <Selector2
                    label="employee"
                    title={"Employees:"}
                    description={"Please Select an Employee"}
                    data={users}
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                    name="user"
                />
            )}
            {selectedFilter === "Trainers" && (
                <Selector2
                    label="trainer"
                    title={"Trainers:"}
                    description={"Please Select a Trainer"}
                    data={users}
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                    name="user"
                />
            )}
            {points.length > 0 && (
                <div className="md:grid-cols-2 gap-8 mt-10 px-6 flex justify-evenly">
                    <div>
                        <h2 className="text-xl font-semibold mb-3 text-green-700">Vtc Rewards</h2>
                        {rewards.map((reward) => (
                            <label key={reward.id} className="flex items-center gap-2 mb-2">
                                <input
                                    type="checkbox"
                                    value={reward.name}
                                    checked={selectedPoints.includes(reward.id)}
                                    onChange={() => handlePointToggle(reward.id)}
                                    className="accent-green-600"
                                />
                                <span>{reward.name}</span>
                            </label>
                        ))}
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold mb-3 text-red-700">Vtc Punishments</h2>
                        {punishments.map((punishment) => (
                            <label key={punishment.id} className="flex items-center gap-2 mb-2">
                                <input
                                    type="checkbox"
                                    value={punishment.name}
                                    checked={selectedPoints.includes(punishment.id)}
                                    onChange={() => handlePointToggle(punishment.id)}
                                    className="accent-red-600"
                                />
                                <span>{punishment.name}</span>
                            </label>
                        ))}
                    </div>
                </div>
            )}
            {points.length > 0 && <div className="flex justify-center items-center"><button type="submit" onClick={submitPoints} className="p-2 bg-wisdomLightOrange rounded text-white hover:bg-wisdomOrange">Submit</button></div>}
        </>
    )
}

export default NeqatyVtc;