import { useState } from "react";
import TmsChatPage from "./TmsChatPage";

const TmsChatAccess = ({ title, value, cardAdditionalCSS = "", valueAdditionalCSS = "" }) => {
    const [chat, setChat] = useState(false)

    const closeModal = () => {
        setChat(false);
    }

    return (
        <div className={cardAdditionalCSS}>
            <div className="bg-gradient-to-b from-wisdomLighterOrange to-wisdomLightOrange text-white text-center rounded p-2">
                {title}
            </div>
            <button onClick={() => setChat(true)} className={`border-black p-2 border-2 rounded text-center font-bold mt-2 w-full hover:bg-wisdomDarkOrange hover:border-wisdomDarkOrange hover:text-white ${valueAdditionalCSS}`}>Click to Open Chat</button>
            {chat && <TmsChatPage onClose={closeModal} />}
        </div>
    )
}

export default TmsChatAccess;