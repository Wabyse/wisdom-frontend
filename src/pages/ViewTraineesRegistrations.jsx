import React, { useEffect, useState } from "react";
import NewNavbar from "../components/NewNavbar";
import { fetchTraineesRegistrations } from "../services/data";
import { cairoDate } from "../utils/cairoDate";

const ViewTraineesRegistrations = () => {
    const [data, setData] = useState([]);

    // Simulate fetch from backend
    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetchTraineesRegistrations();
                setData(response);
            } catch (err) {
                console.error("Error fetching data:", err);
            }
        }
        fetchData();
    }, []);

    return (
        <div className="min-h-screen max-w-screen bg-gray-100 flex flex-col md:gap-4 gap-52 items-center">
            <NewNavbar
                searchStatus={false}
                darkmodeStatus={false}
                shareStatus={false}
            />
            <div className="bg-white shadow-lg rounded-2xl p-6 w-[95%]">
                <h1 className="text-2xl font-bold mb-4 text-gray-800">
                    Users Information
                </h1>
                <div className="overflow-x-auto">
                    <table className="w-full border border-gray-200 rounded-lg">
                        <thead className="bg-gray-200 text-gray-700">
                            <tr>
                                <th className="py-2 px-4 border">Registered At</th>
                                <th className="py-2 px-4 border">Full Name</th>
                                <th className="py-2 px-4 border">Whatsapp</th>
                                <th className="py-2 px-4 border">Phone</th>
                                <th className="py-2 px-4 border">Certification</th>
                                <th className="py-2 px-4 border">Organization</th>
                                <th className="py-2 px-4 border">Course</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.length > 0 ? (
                                data.map((user, index) => (
                                    <tr
                                        key={index}
                                        className="hover:bg-gray-50 transition duration-150"
                                    >
                                        <td className="py-2 px-4 border">{cairoDate(user.createdAt)}</td>
                                        <td className="py-2 px-4 border">{user.first_name} {user.second_name} {user.third_name} {user.fourth_name}</td>
                                        <td className="py-2 px-4 border">{`+2${user.whatsapp}`}</td>
                                        <td className="py-2 px-4 border">{`+2${user.phone}`}</td>
                                        <td className="py-2 px-4 border">{user.certification}</td>
                                        <td className="py-2 px-4 border">{user.org.name}</td>
                                        <td className="py-2 px-4 border">{user.curriculum.code}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center py-4 text-gray-500">
                                        No data available
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default ViewTraineesRegistrations;