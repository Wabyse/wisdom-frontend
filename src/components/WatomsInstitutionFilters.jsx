import { useEffect, useState } from "react";
import { fetchSchools } from "../services/data";
import Selector2 from "./Selector2";
import LoadingScreen from "./LoadingScreen";
import { useLocation, Navigate } from "react-router-dom";

const WatomsInstitutionFilters = ({ onVtcChange }) => {
    const location = useLocation();
    const [vtcs, setVtcs] = useState([]);
    const [selectedVtc, setSelectedVtc] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleVtcChange = (e) => {
        const value = e.target.value;
        setSelectedVtc(value);
        if (onVtcChange) {
            onVtcChange(value); // call parent callback
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

    if (loading) return <LoadingScreen />;
    if (error?.status === 403) return <Navigate to="/login" state={{ from: location }} replace />;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <>
            <Selector2
                label="vtc"
                title={":المركز"}
                description={"الرجاء اختيار مركز"}
                data={vtcs}
                value={selectedVtc}
                onChange={handleVtcChange}
                name="name"
                selectCSS="text-end"
            />
        </>
    )
}

export default WatomsInstitutionFilters;