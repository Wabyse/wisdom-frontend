import React, { useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";

const QRCodeGenerate = () => {
    const canvasRef = useRef(null);
    const url = `https://ebda-edu.com/QRCode/waitingList`;

    const handleDownload = () => {
        const canvas = canvasRef.current?.querySelector("canvas");
        if (!canvas) return;

        const pngUrl = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.href = pngUrl;
        downloadLink.download = `QR_Code_Waiting_List.png`;
        downloadLink.click();
    };

    return (
        <div className="text-center m-4 border p-4 rounded shadow flex flex-col justify-center items-center">
            <div ref={canvasRef}>
                <QRCodeCanvas value={url} size={180} />
            </div>
            <p className="text-sm mt-2">{url}</p>
            <button
                onClick={handleDownload}
                className="mt-2 px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
                Download QR
            </button>
        </div>
    );
};

export default QRCodeGenerate;