import { useEffect, useState } from "react";
import { fetchSchools } from "../services/data";
import Selector2 from "./Selector2";
import LoadingScreen from "./LoadingScreen";
import { useLocation, Navigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

const WisdomSchoolFilter = ({ onSchoolChange }) => {
    const location = useLocation();
    const [schools, setSchools] = useState([]);
    const [selectedSchool, setSelectedSchool] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { language } = useLanguage();

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
        <div className="flex flex-col items-center bg-white rounded-full shadow-lg p-4 md:min-w-[320px] min-w-full">
            <label className="font-extrabold text-lg mb-2 text-[#F05A1A] tracking-wide" htmlFor="institution">{language ? "Institution:" : ":المركز"}</label>
            <Selector2
                label="school"
                title=""
                description={language ? "please select a school" : "الرجاء اختيار مدرسة"}
                data={schools}
                value={selectedSchool}
                onChange={handleSchoolChange}
                name="name"
                selectCSS="rounded-full shadow-md focus:ring-2 focus:ring-[#F05A1A] border-2 border-gray-200 focus:border-[#F05A1A] px-6 py-2 text-lg"
            />
        </div>
    )
}

export default WisdomSchoolFilter;