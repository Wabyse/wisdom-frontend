import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { fetchStudents, studentTeacherFormBulk } from "../services/data";
import { fetchAllTeachers } from "../services/pms";

const BulkStudentTeacherForm = () => {
  const [studentsData, setStudentsData] = useState([]);
  const [apiResponseData, setApiResponseData] = useState([]);
  const [studentsList, setStudentsList] = useState([]);
  const [teachersList, setTeachersList] = useState([]);

  const questionIdArray = [
    146, 147, 148, 149, 150, 151, 152, 153, 154,
    155, 156, 157, 158, 159, 160, 161, 162, 164
  ];

  useEffect(() => {
    const loadAndSetUsers = async () => {
      try {
        const students = await fetchStudents();
        const filteredStudents = students.filter(s => s.school_id === 1);
        const studentMapped = filteredStudents.map(student => ({
          name: `${student.first_name} ${student.middle_name} ${student.last_name}`.trim(),
          id: student.user_id
        }));
        setStudentsList(studentMapped);

        const teachers = await fetchAllTeachers();
        const filteredTeachers = teachers.filter(t => t.employee?.organization_id === 1);
        const teacherMapped = filteredTeachers.map(teacher => ({
          name: `${teacher.employee.first_name} ${teacher.employee.middle_name} ${teacher.employee.last_name}`.trim(),
          id: teacher.id
        }));
        setTeachersList(teacherMapped);
      } catch (err) {
        console.error("Error fetching students/teachers:", err);
      }
    };

    loadAndSetUsers();
  }, []);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });

      const parsedData = data.slice(1).map((row) => {
        const studentName = row[0]?.toString().trim();
        const teacherName = row[1]?.toString().trim();

        const studentMatch = studentsList.find(s => s.name === studentName);
        const teacherMatch = teachersList.find(t => t.name === teacherName);

        const student_user_id = studentMatch?.id || null;
        const teacher_user_id = teacherMatch?.id || null;

        console.log(row)

        const form_results = row.slice(2).map((value, index) => ({
          score: Number(value),
          id: questionIdArray[index] || null
        })).filter(entry => !isNaN(entry.score) && entry.id !== null);

        return {
          student_user_id,
          teacher_user_id,
          form_results
        };
      }).filter(row =>
        row.student_user_id && row.teacher_user_id && row.form_results.length > 0
      );

      setStudentsData(parsedData);
      console.log("Parsed Uploaded Data:", parsedData);
    };

    reader.readAsBinaryString(file);
  };

  const submitToApi = async () => {
    try {
      console.log(studentsData)
      const response = await studentTeacherFormBulk(studentsData);
      console.log("API Response:", response);
      setApiResponseData(response);
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

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "CreatedUsers.xlsx");
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg">
      <h1 className="text-2xl font-semibold mb-6 text-gray-800">Bulk Student Scores Upload</h1>

      {/* Students */}
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-700 mb-2">Fetched Students (Name + ID)</h2>
        <ul className="list-disc ml-6 text-sm text-gray-700 max-h-40 overflow-y-auto">
          {studentsList.map((student, i) => (
            <li key={i}>{student.name} — ID: {student.id}</li>
          ))}
        </ul>
      </div>

      {/* Teachers */}
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-700 mb-2">Fetched Teachers (Name + ID)</h2>
        <ul className="list-disc ml-6 text-sm text-gray-700 max-h-40 overflow-y-auto">
          {teachersList.map((teacher, i) => (
            <li key={i}>{teacher.name} — ID: {teacher.id}</li>
          ))}
        </ul>
      </div>

      {/* Upload Excel */}
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-700 mb-2">Step 1: Upload Excel File</h2>
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileUpload}
          className="border border-gray-300 rounded px-3 py-2 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-blue-100 file:text-blue-700"
        />
      </div>

      {/* Submit */}
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-700 mb-2">Step 2: Submit to API</h2>
        <button
          onClick={submitToApi}
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded transition"
        >
          Upload Data
        </button>
      </div>

      {/* Download response */}
      {Array.isArray(apiResponseData) && apiResponseData.length > 0 && (
        <div className="mb-4">
          <h2 className="text-lg font-medium text-gray-700 mb-2">Step 3: Export API Response</h2>
          <button
            onClick={downloadApiResponseExcel}
            className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded transition"
          >
            Download API Response
          </button>
        </div>
      )}
    </div>
  );
};

export default BulkStudentTeacherForm;