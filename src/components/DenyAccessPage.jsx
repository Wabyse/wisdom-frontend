import wabys from "../assets/wabys.png";
import { useNavigate } from "react-router-dom";

const DenyAccessPage = ({ homePage='/pms' }) => {
    const navigate = useNavigate();
    return (
        <>
            <div className="bg-formColor w-full h-screen flex flex-col justify-center items-center">
                <img
                    className="w-[25%]"
                    src={wabys}
                    alt=""
                />
                <h1 className="text-8xl font-bold">401</h1>
                <h1 className="text-5xl text-center text-watomsBlue">You are not authorized to view this page.</h1>
                <h1 className="text-5xl text-center text-watomsBlue">Please contact your administrator if you believe this is an error.</h1>
                <button className="bg-wisdomOrange hover:bg-wisdomDarkOrange text-white rounded p-2 m-4" onClick={() => navigate(homePage)}>Go Back</button>
            </div>
        </>
    )
}

export default DenyAccessPage;