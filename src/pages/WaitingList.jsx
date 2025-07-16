import { useEffect, useState } from "react";
import { fetchWaitingUserNumber } from "../services/data";

const WaitingList = () => {
    const [userNumber, setUserNumber] = useState(null);
    useEffect(() => {
        const loadWaitingNumber = async () => {
            const response = await fetchWaitingUserNumber();
            setUserNumber(response?.id);
        }

        loadWaitingNumber();
    }, [])
    return (
        <div className="w-full min-h-screen flex justify-center items-center">
        <h1 className="text-6xl">{userNumber}</h1>
        </div>
    )
}

export default WaitingList;