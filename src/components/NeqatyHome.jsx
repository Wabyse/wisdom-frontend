import { useNavigate } from "react-router-dom";

const NeqatyHome = () => {
    const navigate = useNavigate();

    return (
        <div className="flex items-center justify-center md:h-[80vh] h-[60vh] w-full">
            <div className="flex flex-col md:flex-row md:justify-evenly md:w-full gap-6">
                <button
                    className="bg-wisdomOrange text-white md:text-4xl text-xl py-2 px-6 rounded shadow-sm shadow-wisdomLightOrange"
                    onClick={() => navigate('/neqaty/schools')}
                >
                    School
                </button>
                <button
                    className="bg-wisdomOrange text-white md:text-4xl text-xl py-2 px-6 rounded shadow-sm shadow-wisdomLightOrange"
                    onClick={() => navigate('/neqaty/vtcs')}
                >
                    VTC
                </button>
            </div>
        </div>
    );
};

export default NeqatyHome;
