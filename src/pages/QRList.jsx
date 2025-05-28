import React, { useEffect, useState } from "react";
import QRCodeGenerator from "../components/QRCodeGenerator";
import { fetchUsers } from "../services/data";
import { useAuth } from "../context/AuthContext";
import DenyAccessPage from "../components/DenyAccessPage";
import BarcodeGenerator from "../components/BarcodeGenerator";

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
        // <div className="p-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <div className="flex justify-center">

            {/* {employees.map((user) => (
                <BarcodeGenerator key={user.id} userId={user.id} name={`${user.employee?.employee_first_name} ${user.employee?.employee_middle_name} ${user.employee?.employee_last_name}`} />
            ))} */}
            <BarcodeGenerator key={employees[0].id} userId={employees[0].id} name={`${employees[0].employee?.employee_first_name} ${employees[0].employee?.employee_middle_name} ${employees[0].employee?.employee_last_name}`} />
        </div>
    );
};

export default QRList;
