import { useEffect, useState } from "react";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { fetchClasses, fetchSchools, fetchSpecializations } from "../services/data";
import { ORGANIZATIONS_PASSWORD_CODE } from "../constants/constants";
import { signUpBulkUsers } from "../services/auth";

const BulkTraineesUsers = () => {
    const [schools, setSchools] = useState([]);
    const [classes, setClasses] = useState([]);
    const [specializations, setSpecializations] = useState([]);
    const [studentsData, setStudentsData] = useState([]);
    const [, setTemplateType] = useState("");
    const [apiResponseData, setApiResponseData] = useState([]);

    useEffect(() => {
        const loadOrg = async () => {
            try {
                const response = await fetchSchools();
                setSchools(response)
            } catch (err) {

            }
        }

        const loadClass = async () => {
            try {
                const response = await fetchClasses();
                setClasses(response)
            } catch (err) {

            }
        }

        const loadSpecialization = async () => {
            try {
                const response = await fetchSpecializations();
                setSpecializations(response);
            } catch (err) {

            }
        }

        loadOrg();
        loadClass();
        loadSpecialization();
    }, [])

    const downloadTraineeTemplate = () => {
        const headers = [
            ['FirstName', 'MiddleName', 'LastName', 'Institution', 'Email', 'Class', 'Specialization'],
            ['', '', '', '', '', '', ''],
        ];

        const institutionOptions = [
            ...schools.map(school => [school.name])
        ];

        const courseOptions = [
            ...classes.map(className => [className.name])
        ];

        const specializationOptions = [
            ...specializations.map(specialization => [specialization.name])
        ];

        const worksheet = XLSX.utils.aoa_to_sheet([['TEMPLATE: TRAINEE'], [], ...headers]);

        worksheet['!cols'] = [
            { wch: 17 },
            { wch: 15 },
            { wch: 15 },
            { wch: 20 },
            { wch: 40 },
            { wch: 20 },
            { wch: 20 },
        ];

        const secondSheet = XLSX.utils.aoa_to_sheet(institutionOptions);
        secondSheet['!cols'] = [{ wch: 20 }];

        const thirdSheet = XLSX.utils.aoa_to_sheet(courseOptions);
        thirdSheet['!cols'] = [{ wch: 20 }];

        const fourthSheet = XLSX.utils.aoa_to_sheet(specializationOptions);
        fourthSheet['!cols'] = [{ wch: 20 }];

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'TraineeTemplate');
        XLSX.utils.book_append_sheet(workbook, secondSheet, 'Institutions');
        XLSX.utils.book_append_sheet(workbook, thirdSheet, 'Classes');
        XLSX.utils.book_append_sheet(workbook, fourthSheet, 'Specializations');

        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(blob, 'TraineeTemplate.xlsx');
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = (evt) => {
            const bstr = evt.target.result;
            const wb = XLSX.read(bstr, { type: 'binary' });

            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];

            // Read and extract template type from A1
            const templateTypeRaw = ws['A1']?.v || '';
            const typeOfTemplate = templateTypeRaw.replace('TEMPLATE: ', '').trim().toUpperCase();

            if (typeOfTemplate !== 'TRAINEE') {
                alert('Invalid template uploaded. Please use the official TraineeTemplate.');
                return;
            } else {
                setTemplateType(typeOfTemplate)
            }

            const data = XLSX.utils.sheet_to_json(ws, { range: 2, defval: "" }); // defval ensures empty cells are ""
            // Define required fields except Email
            const requiredFields = ['FirstName', 'MiddleName', 'LastName', 'Institution', 'Class', 'Specialization'];

            // Filter out invalid rows
            const invalidRows = data.filter((row, index) =>
                requiredFields.some(field => !row[field]?.toString().trim())
            );

            // If any rows are invalid, show error and stop
            if (invalidRows.length > 0) {
                alert(`Upload failed. There are ${invalidRows.length} invalid row(s) missing required fields.`);
                return;
            }
            const updatedStudents = data.map(student => {
                const organization = schools.find(school => school.name === student.Institution);
                const organization_id = organization ? organization.id : null;
                const randomNumber = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
                const password = organization ? ORGANIZATIONS_PASSWORD_CODE[organization.name] + "@" + randomNumber : null;
                const selectedClass = classes.find(className => className.name === student.Class);
                const class_id = selectedClass ? selectedClass.id : null;
                const specialization = specializations.find(spec => spec.name === student.Specialization);
                const specialization_id = specialization ? specialization.id : null;
                const { Specialization, Class, Institution, ...rest } = student; // 👈 remove 'unwantedKey'

                const updatedStudent = {
                    first_name: rest.FirstName,
                    middle_name: rest.MiddleName,
                    last_name: rest.LastName,
                    organization_id,
                    password,
                    email: student.Email === "" ? "test@test.com" : student.Email,
                    user_role_id: 19,
                    class_id,
                    specialization_id
                };

                return updatedStudent;
            });

            setStudentsData(updatedStudents);
            console.log('Parsed Excel Data:', data);
        };

        reader.readAsBinaryString(file);
    };

    const testApi = async () => {
        try {
            const response = await signUpBulkUsers(studentsData);
            console.log("API Response:", response);
            setApiResponseData(response);
            console.log("API Response:", response);
        } catch (err) {
            console.error("Failed to send data:", err);
        }
    };

    const downloadApiResponseExcel = () => {
        if (!apiResponseData.length) {
            alert("No API data to export.");
            return;
        }

        const worksheet = XLSX.utils.json_to_sheet(apiResponseData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "CreatedUsers");

        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(blob, 'CreatedUsers.xlsx');
    };

    return (
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg">
            <h1 className="text-2xl font-semibold mb-6 text-gray-800">Students / Trainees Bulk User Upload</h1>

            {/* Download Template */}
            <div className="mb-6">
                <h2 className="text-lg font-medium text-gray-700 mb-2">Step 1: Download Template</h2>
                <button
                    onClick={downloadTraineeTemplate}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded transition"
                >
                    Download Excel Template
                </button>
            </div>

            {/* Upload File */}
            <div className="mb-6">
                <h2 className="text-lg font-medium text-gray-700 mb-2">Step 2: Upload Filled Excel</h2>
                <input
                    type="file"
                    accept=".xlsx, .xls"
                    onChange={handleFileUpload}
                    className="border border-gray-300 rounded px-3 py-2 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-blue-100 file:text-blue-700"
                />
            </div>

            {/* Submit to API */}
            <div className="mb-6">
                <h2 className="text-lg font-medium text-gray-700 mb-2">Step 3: Submit Data</h2>
                <button
                    onClick={testApi}
                    className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded transition"
                >
                    Upload
                </button>
            </div>

            {/* Download Created Users */}
            {Array.isArray(apiResponseData) && apiResponseData.length > 0 && (
                <div className="mb-4">
                    <h2 className="text-lg font-medium text-gray-700 mb-2">Step 4: Export Created Users</h2>
                    <button
                        onClick={downloadApiResponseExcel}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded transition"
                    >
                        Download Created Users
                    </button>
                </div>
            )}
        </div>
    );
};

export default BulkTraineesUsers;