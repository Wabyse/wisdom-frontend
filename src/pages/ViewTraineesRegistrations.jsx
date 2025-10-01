import React, { useEffect, useState } from "react";
import NewNavbar from "../components/NewNavbar";
import { fetchTraineesRegistrations } from "../services/data";
import { cairoDate } from "../utils/cairoDate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";

const ViewTraineesRegistrations = () => {
    const [data, setData] = useState([]);
    const [registerCount, setRegisterCount] = useState(0);
    const [page, setPage] = useState("general");
    const [unfilteredData, setUnfilteredData] = useState([]);

    const togglePage = () => {
        if (page === "general") {
            setPage("detailed");
        } else {
            setPage("general");
        }
    }

    const uniqueCount = (arr) => {
        const seen = new Set(arr.map(item => item.id_number));
        return seen.size;
    };

    // Simulate fetch from backend
    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetchTraineesRegistrations();
                setUnfilteredData(response);
                setRegisterCount(uniqueCount(response));
                const grouped = Object.values(
                    response.reduce((acc, item) => {
                        const normalizedKey =
                            item.certification === "حاصل علي شهادة جامعية" ||
                                item.certification === "طالب جامعي"
                                ? "جامعي"
                                : "غير جامعي";

                        const key = `${item.curriculum.code}|${item.org.name}|${normalizedKey}`;

                        if (!acc[key]) {
                            acc[key] = {
                                curriculum: item.curriculum.code,
                                org: item.org.name,
                                category: normalizedKey,
                                items: [],
                            };
                        }

                        acc[key].items.push(item);

                        return acc;
                    }, {})
                );

                grouped.sort((a, b) => {
                    // 1. Sort by organization name
                    const orgCompare = a.org.localeCompare(b.org);
                    if (orgCompare !== 0) return orgCompare;

                    // 2. If same org, sort by curriculum code
                    const curriculumCompare = a.curriculum.localeCompare(b.curriculum);
                    if (curriculumCompare !== 0) return curriculumCompare;

                    // 3. If same curriculum, sort by category ("جامعي" first)
                    if (a.category === b.category) return 0;
                    return a.category === "جامعي" ? -1 : 1;
                });

                // (Optional) ✅ Sort inside each items array if needed
                grouped.forEach(group => {
                    group.items.sort((a, b) => a.certification.localeCompare(b.certification));
                });
                setData(grouped);
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
                <div className="flex gap-4 items-center mb-4">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Users Information:
                    </h1>
                    <h1 className="text-xl font-bold text-gray-800">
                        (count: {registerCount})
                    </h1>
                    <button onClick={togglePage}><FontAwesomeIcon icon={faArrowLeft} /></button>
                    <h1 className="font-bold">{page}</h1>
                    <button onClick={togglePage}><FontAwesomeIcon icon={faArrowRight} /></button>
                </div>
                <div className="overflow-x-auto flex flex-col gap-6">
                    {page === "general" ?
                        <table className="w-full border border-gray-200 rounded-lg">
                            <thead className="bg-gray-200 text-gray-700">
                                <tr>
                                    <th className="py-2 px-4 border">ID</th>
                                    <th className="py-2 px-4 border">Registered At</th>
                                    <th className="py-2 px-4 border">Full Name</th>
                                    <th className="py-2 px-4 border">Whatsapp</th>
                                    <th className="py-2 px-4 border">Phone</th>
                                    <th className="py-2 px-4 border">Organization</th>
                                    <th className="py-2 px-4 border">Certification</th>
                                    <th className="py-2 px-4 border">Course</th>
                                </tr>
                            </thead>
                            <tbody>
                                {unfilteredData.length > 0 ? (
                                    unfilteredData.map((user, index) => (
                                        <tr
                                            key={index}
                                            className="hover:bg-gray-50 transition duration-150 text-center"
                                        >
                                            <td className="py-2 px-4 border">{index + 1}</td>
                                            <td className="py-2 px-4 border">{cairoDate(user.createdAt).split(",")[0].trim()}</td>
                                            <td className="py-2 px-4 border">{user.first_name} {user.second_name} {user.third_name} {user.fourth_name}</td>
                                            <td className="py-2 px-4 border">{`+2${user.whatsapp}`}</td>
                                            <td className="py-2 px-4 border">{`+2${user.phone}`}</td>
                                            <td className="py-2 px-4 border">{user.org.name}</td>
                                            <td className="py-2 px-4 border">{user.certification}</td>
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
                        : data.map(group => (
                            <table className="w-full border border-gray-200 rounded-lg">
                                <thead className="bg-gray-200 text-gray-700">
                                    <tr>
                                        <th className="py-2 px-4 border">ID</th>
                                        <th className="py-2 px-4 border">Organization</th>
                                        <th className="py-2 px-4 border">Course</th>
                                        <th className="py-2 px-4 border">Certification</th>
                                        <th className="py-2 px-4 border">Full Name</th>
                                        <th className="py-2 px-4 border">Whatsapp</th>
                                        <th className="py-2 px-4 border">Phone</th>
                                        <th className="py-2 px-4 border">Registered At</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {group.items.length > 0 ? (
                                        group.items.map((user, index) => (
                                            <tr
                                                key={index}
                                                className="hover:bg-gray-50 transition duration-150 text-center"
                                            >
                                                <td className="py-2 px-4 border">{index + 1}</td>
                                                <td className="py-2 px-4 border">{user.org.name}</td>
                                                <td className="py-2 px-4 border">{user.curriculum.code}</td>
                                                <td className="py-2 px-4 border">{user.certification}</td>
                                                <td className="py-2 px-4 border">{user.first_name} {user.second_name} {user.third_name} {user.fourth_name}</td>
                                                <td className="py-2 px-4 border">{`+2${user.whatsapp}`}</td>
                                                <td className="py-2 px-4 border">{`+2${user.phone}`}</td>
                                                <td className="py-2 px-4 border">{cairoDate(user.createdAt).split(",")[0].trim()}</td>
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
                        ))}
                </div>
            </div>
        </div>
    );
}

export default ViewTraineesRegistrations;