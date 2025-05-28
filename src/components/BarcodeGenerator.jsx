import React, { useRef } from "react";
import Barcode from 'react-barcode';

const BarcodeGenerator = ({ userId, name }) => {
    const canvasRef = useRef(null);
    const url = `https://ebda-edu.com/checkin?user_id=${userId}`;

    const handleDownload = () => {
        const svg = canvasRef.current?.querySelector("svg");
        if (!svg) return;

        const serializer = new XMLSerializer();
        const source = serializer.serializeToString(svg);
        const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });

        const url = URL.createObjectURL(blob);
        const downloadLink = document.createElement("a");
        downloadLink.href = url;
        downloadLink.download = `Bar_Code_${name}.svg`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="text-center m-4 border p-4 rounded shadow flex flex-col justify-center items-center">
            <h3>Name: {name}</h3>
            <div ref={canvasRef}>
                <Barcode value={url} format="CODE128" />
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

export default BarcodeGenerator;