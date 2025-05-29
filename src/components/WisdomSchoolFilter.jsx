import { useEffect, useState } from "react";
import { fetchSchools } from "../services/data";
import Selector2 from "./Selector2";
import LoadingScreen from "./LoadingScreen";
import { useLocation, Navigate } from "react-router-dom";

const WisdomSchoolFilter = ({ onSchoolChange }) => {
    const location = useLocation();
    const [schools, setSchools] = useState([]);
    const [selectedSchool, setSelectedSchool] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleSchoolChange = (e) => {
        const value = e.target.value;
        setSelectedSchool(value);
        if (onSchoolChange) {
            onSchoolChange(value); // call parent callback
        }
    };

    useEffect(() => {
        const loadSchools = async () => {
            try {
                const loadedSchools = await fetchSchools();
                const filteredSchools = loadedSchools.filter(school => school.id === 1 || school.id === 2);
                setSchools(filteredSchools);
            } catch (err) {
                console.error("API Error:", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        }

        loadSchools();
    }, []);

    if (loading) return <LoadingScreen />;
    if (error?.status === 403) return <Navigate to="/login" state={{ from: location }} replace />;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <>
            <Selector2
                label="school"
                title={":مدرسة"}
                description={"الرجاء اختيار مدرسة"}
                data={schools}
                value={selectedSchool}
                onChange={handleSchoolChange}
                name="name"
                selectCSS="text-end"
            />
        </>
    )
}

export default WisdomSchoolFilter;