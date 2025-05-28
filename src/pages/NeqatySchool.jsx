import { useEffect, useState } from "react";
import { fetchSchools, fetchStudents } from "../services/data";
import LoadingScreen from "../components/LoadingScreen";
import { Navigate, useLocation } from "react-router-dom";
import Selector2 from "../components/Selector2";
import { useAdminAuth } from "../context/AdminAuthContext";
import NeqatyNavbar from "../components/NeqatyNavbar";
import { fetchSchoolPoints, updateUserPoints } from "../services/neqaty";
import { fetchAllTeachers } from "../services/pms";
import toast, { Toaster } from "react-hot-toast";

const NeqatySchool = () => {
    const { adminInfo } = useAdminAuth();
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [schools, setSchools] = useState([]);
    const [selectedSchool, setSelectedSchool] = useState("");
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
        const loadSchools = async () => {
            try {
                const loadedSchools = await fetchSchools();
                const filteredSchools = loadedSchools.filter(
                    (school) => school.id === 1 || school.id === 2
                );
                setSchools(filteredSchools);
            } catch (err) {
                console.error("API Error:", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        loadSchools();
    }, []);

    useEffect(() => {
        const loadUsers = async () => {
            try {
                if (selectedFilter === "Teachers") {
                    const loadedTeachers = await fetchAllTeachers();
                    const filteredTeachers = loadedTeachers.filter(
                        (teacher) => teacher.employee?.organization_id === Number(selectedSchool)
                    );
                    setUsers(filteredTeachers);
                } else if (selectedFilter === "Students") {
                    const loadedStudents = await fetchStudents();
                    const filteredStudents = loadedStudents.filter(
                        (student) => student.school_id === Number(selectedSchool)
                    );
                    setUsers(filteredStudents);
                }
            } catch (err) {
                console.error("API Error:", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        if (selectedSchool) {
            loadUsers();
        }
    }, [selectedFilter, selectedSchool]);

    useEffect(() => {
        const loadSchoolPoints = async () => {
            try {
                const loadedSchoolPoints = await fetchSchoolPoints();
                setPoints(loadedSchoolPoints);
            } catch (err) {
                console.error("API Error:", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        if (selectedUser) {
            loadSchoolPoints();
        }
    }, [selectedUser]);

    const rewards = points?.filter((point) => point.type === "school_reward");
    const punishments = points?.filter((point) => point.type === "school_punishment");

    const handlePointToggle = (value) => {
        setSelectedPoints((prev) =>
            prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
        );
    };

    if (loading) return <LoadingScreen />;
    if (error?.status === 403)
        return <Navigate to="/login" state={{ from: location }} replace />;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <>
            <Toaster />
            <NeqatyNavbar />
            <Selector2
                label="schools"
                title={"Schools:"}
                description={"Please Select a School"}
                data={schools}
                value={selectedSchool}
                onChange={(e) => setSelectedSchool(e.target.value)}
                name="name"
            />
            {selectedSchool !== "" && (
                <div className="flex justify-evenly w-full mt-4 gap-6">
                    <button
                        className="bg-wisdomOrange text-white md:text-3xl text-xl py-2 px-6 rounded shadow-sm shadow-wisdomLightOrange"
                        onClick={() => setSelectedFilter("Teachers")}
                    >
                        Teachers
                    </button>
                    <button
                        className="bg-wisdomOrange text-white md:text-3xl text-xl py-2 px-6 rounded shadow-sm shadow-wisdomLightOrange"
                        onClick={() => setSelectedFilter("Students")}
                    >
                        Students
                    </button>
                </div>
            )}
            {selectedFilter === "Teachers" && (
                <Selector2
                    label="teacher"
                    title={"Teachers:"}
                    description={"Please Select a Teacher"}
                    data={users}
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                    name="user"
                />
            )}
            {selectedFilter === "Students" && (
                <Selector2
                    label="student"
                    title={"Students:"}
                    description={"Please Select a Student"}
                    data={users}
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                    name="userStd"
                />
            )}

            {points.length > 0 && (
                <div className="md:grid-cols-2 gap-8 mt-10 px-6 flex justify-evenly">
                    <div>
                        <h2 className="text-xl font-semibold mb-3 text-green-700">School Rewards</h2>
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
                        <h2 className="text-xl font-semibold mb-3 text-red-700">School Punishments</h2>
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
    );
};

export default NeqatySchool;