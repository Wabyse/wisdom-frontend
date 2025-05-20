import React, { useEffect, useState } from "react";
import QRCodeGenerator from "../components/QRCodeGenerator";
import { fetchUsers } from "../services/data";
import { useAuth } from "../context/AuthContext";
import DenyAccessPage from "../components/DenyAccessPage";

const QRList = () => {
    const { userInfo } = useAuth();
    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        const loadEmployees = async () => {
            try {
                const data = await fetchUsers(userInfo);
                const ebdaEdu = data.filter(user => user.employee?.organization_id === 3 && user.code !== 1 && user.code !== 4)
                setEmployees(ebdaEdu);
            } catch (error) {
                console.error("Failed to fetch users:", error);
            }
        };

        loadEmployees();
    }, [userInfo]);

    if (userInfo.code !== 3) return <DenyAccessPage homePage='/' />;

    return (
        <div className="p-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {employees.map((user) => (
                <QRCodeGenerator key={user.id} userId={user.id} name={`${user.employee?.employee_first_name} ${user.employee?.employee_middle_name} ${user.employee?.employee_last_name}`} />
            ))}
        </div>
    );
};

export default QRList;
