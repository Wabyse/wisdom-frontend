import { useEffect, useState } from "react";
import { fetchSchools } from "../services/data";
import Selector2 from "./Selector2";
import LoadingScreen from "./LoadingScreen";
import { useLocation, Navigate } from "react-router-dom";

const WatomsManagerFilter = ({ onManagerChange }) => {
    const location = useLocation();
    const [managers, setManagers] = useState([]);
    const [selectedManager, setSelectedManagers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleManagerChange = (e) => {
        const value = e.target.value;
        setSelectedManagers(value);
        if (onManagerChange) {
            onManagerChange(value); // call parent callback
        }
    };

    useEffect(() => {
        const loadManagers = async () => {
            try {
                const loadedManagers = await fetchSchools();
                const filteredManagers = loadedManagers.filter(manager => manager.id !== 1 && manager.id !== 2);
                setManagers(filteredManagers);
            } catch (err) {
                console.error("API Error:", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        }

        loadManagers();
    }, []);

    if (loading) return <LoadingScreen />;
    if (error?.status === 403) return <Navigate to="/login" state={{ from: location }} replace />;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <>
            <Selector2
                label="manager"
                title={":مدير المركز"}
                description={"الرجاء اختيار مدير مركز"}
                data={managers}
                value={selectedManager}
                onChange={handleManagerChange}
                name="name"
                selectCSS="text-end"
            />
        </>
    )
}

export default WatomsManagerFilter;