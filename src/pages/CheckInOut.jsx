import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { sendCheckInOut } from "../services/data";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";

const CheckInOut = () => {
    const [searchParams] = useSearchParams();
    const userId = searchParams.get("user_id");
    const navigate = useNavigate();

    const [status, setStatus] = useState("Getting your location...");
    const [locationError, setLocationError] = useState(false);

    const onClose = () => {
        navigate('/');
    };

    useEffect(() => {
        if (!userId) {
            setStatus("No user ID provided in the URL.");
            setLocationError(true);
            return;
        }

        if (!navigator.geolocation) {
            setStatus("Geolocation is not supported by your browser.");
            setLocationError(true);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const payload = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    user_id: Number(userId)
                };

                try {
                    await sendCheckInOut(payload);
                    setStatus("Thank You");
                } catch (error) {
                    console.error("API Error:", error);
                    setStatus("Error Happened");
                    setLocationError(true);
                }
            },
            (error) => {
                console.error("Geolocation Error:", error);
                let msg = "";
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        msg = "Location access denied. Please enable it in your browser settings.";
                        break;
                    case error.POSITION_UNAVAILABLE:
                        msg = "Location information is unavailable.";
                        break;
                    case error.TIMEOUT:
                        msg = "Location request timed out.";
                        break;
                    default:
                        msg = "Unknown error getting location.";
                        break;
                }
                setStatus(msg);
                setLocationError(true);
            }
        );
    }, [userId]);

    useEffect(() => {
        if (status === "Thank You") {
            const timer = setTimeout(() => navigate('/'), 3000);
            return () => clearTimeout(timer);
        }
    }, [status]);

    const isLoading = status === "Getting your location...";
    const isSuccess = status === "Thank You";

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-12 rounded-lg shadow-md text-center flex flex-col gap-4 min-w-[300px] justify-center items-center">
                {isLoading ? (
                    <svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                    </svg>
                ) : isSuccess ? (
                    <FontAwesomeIcon className="text-green-600 text-4xl" icon={faCircleCheck} />
                ) : locationError ? (
                    <FontAwesomeIcon className="text-yellow-400 text-4xl" icon={faTriangleExclamation} />
                ) : null}

                <p className={`${isLoading ? 'text-gray-400 animate-pulse' : ''}`}>{status}</p>

                {!isLoading && (
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-wisdomOrange text-white rounded hover:bg-wisdomDarkOrange"
                    >
                        Close
                    </button>
                )}
            </div>
        </div>
    );
};

export default CheckInOut;
