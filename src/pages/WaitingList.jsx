import { useEffect, useState } from "react";
import { fetchWaitingUserNumber } from "../services/data";
import ebdaedu from '../assets/ebad-edu.png';
import gov from '../assets/Gov.png';
import { useNavigate } from "react-router-dom";

const WaitingList = () => {
    const navigate = useNavigate();
    const [userNumber, setUserNumber] = useState(null);
    useEffect(() => {
        const loadWaitingNumber = async () => {
            const response = await fetchWaitingUserNumber();
            setUserNumber(response?.id);
        }

        loadWaitingNumber();
    }, [])
    return (
        <div className="w-full min-h-screen flex flex-col justify-between items-center py-8">
            <button className="self-start ml-2 font-bold text-xl" onClick={() => navigate('/')}>&lt; ebda-edu</button>
            {/* Centered Text */}
            <div className="flex-1 flex flex-col justify-center items-center">
                <h1 className="text-2xl">Your Number is:</h1>
                <h1 className="text-6xl">{userNumber}</h1>
            </div>

            {/* Images at the bottom */}
            <div className="flex space-x-4 justify-center">
                <img src={ebdaedu} alt="Ebdaedu logo" className="md:w-[150px] w-[90px]" />
                <img src={gov} alt="Gov logo" className="md:w-[20%] w-[20%]" />
            </div>
        </div>
    )
}

export default WaitingList;