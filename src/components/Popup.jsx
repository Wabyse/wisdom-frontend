import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";

function Popup({ isOpen, onClose, message, button = "تم", form = true }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-12 rounded-lg shadow-md text-center flex flex-col gap-4">
                {form ? <FontAwesomeIcon className='text-green-600 text-4xl' icon={faCircleCheck} /> :
                    <FontAwesomeIcon className='text-yellow-400 text-4xl' icon={faTriangleExclamation} />}
                <p>{message}</p>
                <button
                    onClick={onClose}
                    className="px-4 py-2 bg-wisdomOrange text-white rounded hover:bg-wisdomDarkOrange"
                >
                    {button}
                </button>
            </div>
        </div>
    );
}

export default Popup;