import { useEffect, useState } from "react";
import { fetchSchools } from "../services/data";
import Selector2 from "./Selector2";
import LoadingScreen from "./LoadingScreen";
import { useLocation, Navigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

const WatomsInstitutionFilters = ({ onVtcChange }) => {
    const location = useLocation();
    const [vtcs, setVtcs] = useState([]);
    const [selectedVtc, setSelectedVtc] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { language } = useLanguage();

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
        <div className="flex flex-col items-center bg-white rounded-full shadow-lg p-4 md:min-w-[320px] min-w-full">
            <label className="font-extrabold text-lg mb-2 text-[#F05A1A] tracking-wide" htmlFor="institution">{language ? "Institution:" : ":المركز"}</label>
            <Selector2
                label="institution"
                title=""
                description={language ? "please select a vtc" : "الرجاء اختيار مركز"}
                data={vtcs}
                value={selectedVtc}
                onChange={handleVtcChange}
                name="name"
                selectCSS="rounded-full shadow-md focus:ring-2 focus:ring-[#F05A1A] border-2 border-gray-200 focus:border-[#F05A1A] px-6 py-2 text-lg text-center"
            />
        </div>
    )
}

export default WatomsInstitutionFilters;