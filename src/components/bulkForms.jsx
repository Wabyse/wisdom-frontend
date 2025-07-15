import { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { fetchAllTeachers, fetchForm, fetchForms } from "../services/pms";
import Selectors from "./Selectors";
import { ASSESSOR_TYPE, ORGANIZATIONS_TYPE } from "../constants/constants";
import { fetchCurriculums, fetchSchools, fetchStudents, bulkCurriculumForms, bulkEnvironmentForms } from "../services/data";

const BulkForms = () => {
    const { userInfo } = useAuth();
    const didMount = useRef(false);
    const [selectedOrgType, setSelectedOrgType] = useState("");
    const [forms, setForms] = useState([]);
    const [formQuestions, setFormQuestions] = useState([]);
    const [selectedFormId, setSelectedFormId] = useState("");
    const [selectedForm, setSelectedForm] = useState(null);
    const [selectedAssessor, setSelectedAssessor] = useState("");
    const [schools, setSchools] = useState([]);
    const [selectedSchool, setSelectedSchool] = useState("");
    const [students, setStudents] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [curriculums, setCurriculums] = useState([]);
    const [bulkData, setBulkData] = useState([]);

    const selectOrganization = (e) => {
        setSelectedOrgType(e.target.value)
    }

    const selectForm = (e) => {
        setSelectedFormId(Number(e.target.value))
        const form = forms.find(form => form.id === Number(e.target.value));
        setSelectedForm(form);
    }

    const selectAssessor = (e) => {
        setSelectedAssessor(e.target.value)
    }

    const selectSchool = (e) => {
        setSelectedSchool(e.target.value)
    }


    useEffect(() => {
        const loadForms = async () => {
            try {
                const response = await fetchForms(userInfo);
                let filteredForms;
                if (selectedOrgType === "School") {
                    filteredForms = response.filter(form => form.en_name !== "test");
                } else if (selectedOrgType === "Institution") {
                    filteredForms = response.filter(form => form.en_name === "test");
                } else {
                    filteredForms = response;
                }
                setForms(filteredForms);
            } catch (err) {

            }
        }
        const loadOrganizations = async () => {
            try {
                const response = await fetchSchools();
                setSchools(response);
            } catch (err) {

            }
        }
        const loadStudents = async () => {
            try {
                const response = await fetchStudents();
                setStudents(response);
            } catch (err) {

            }
        }
        const loadTeachers = async () => {
            try {
                const response = await fetchAllTeachers();
                setTeachers(response);
            } catch (err) {

            }
        }
        const loadCurriculums = async () => {
            try {
                const response = await fetchCurriculums();
                setCurriculums(response);
            } catch (err) {

            }
        }
        loadForms();
        loadOrganizations();
        loadStudents();
        loadTeachers();
        loadCurriculums();
    }, [selectedOrgType]);

    useEffect(() => {
        if (didMount.current) {
            if (selectedFormId) {
                const loadForm = async () => {
                    try {
                        const response = await fetchForm({ formId: selectedFormId });
                        console.log(response)
                        setFormQuestions(response);
                    } catch (err) { }
                };
                loadForm();
            }
        } else {
            didMount.current = true;
        }
    }, [selectedFormId]);

    const downloadTraineeTemplate = () => {
        let entity_name;
        let headers = [];

        if (selectedForm.type === "360 Individual Assessment" || selectedForm.type === "ClassRoom Observation") {
            entity_name = 'Assessee Name';
            headers = [['Assessor Name', entity_name], ['', '']];
        } else if (selectedForm.type === "360 Curriculum Assessment" || selectedForm.type === "curriculum") {
            entity_name = 'Curriculum Name';
            headers = [['Assessor Name', entity_name, 'Organization'], ['', '', '']];
        } else if (selectedForm.type === "normal" || selectedForm.type === "normal2") {
            entity_name = 'Organization Name';
            headers = [['Assessor Name', entity_name], ['', '']];
        }

        // Add dynamic form question headers
        const questionTitles = formQuestions.map((q, index) => q.label || q.en_label || `Q${index + 1}`);
        headers[0].push(...questionTitles); // Add to first row
        headers[1].push(...Array(questionTitles.length).fill('')); // Empty row below

        const worksheet = XLSX.utils.aoa_to_sheet([['TEMPLATE: FORMS'], [], ...headers]);
        console.log(questionTitles)

        worksheet['!cols'] = [
            { wch: 15 }, // Assessor
            { wch: 17 }, // Entity
            ...(selectedForm.type === "curriculum" || selectedForm.type === "360 Curriculum Assessment" ? [{ wch: 17 }] : []),
            ...questionTitles.map(() => ({ wch: 20 })) // Questions
        ];

        // Optional supporting sheets
        const organizationOptions = [...schools.map(school => [school.name])];
        const studentOptions = students.map(student => [
            student.user_id || '',
            `${student.first_name} ${student.middle_name} ${student.last_name}`,
            student.class?.name || '',
            student.school?.name || ''
        ]);
        const teacherOptions = teachers.map(teacher => [
            teacher.id || '',
            `${teacher.employee.first_name} ${teacher.employee.middle_name} ${teacher.employee.last_name}`,
        ]);
        const curriculumOptions = curriculums.map(curriculum => [
            curriculum.id || '',
            curriculum.code || '',
        ]);

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'TraineeTemplate');
        XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(organizationOptions), 'Organizations');
        XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(studentOptions), 'Students');
        XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(teacherOptions), 'Teachers');
        XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(curriculumOptions), 'Curriculums');

        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(blob, 'TraineeTemplate.xlsx');
    };

const handleBulkFileUpload = (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();

  reader.onload = (evt) => {
    const bstr = evt.target.result;
    const wb = XLSX.read(bstr, { type: "binary" });
    const wsname = wb.SheetNames[0];
    const ws = wb.Sheets[wsname];
    const data = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });

    console.log("Raw Excel Data:", data.slice(0, 5)); // show top 5 rows

    const parsedData = data.slice(3).map((row, i) => {
      const assessor_id = Number(row[0]);
      const organization_id = Number(row[1]);

      if (!assessor_id || !organization_id) {
        console.warn(`❌ Skipping row ${i + 4} — missing required ID(s)`, row);
        return null;
      }

      console.log(formQuestions)
      const form_results = row.slice(3).map((score, index) => ({
        score: Number(score),
        id: formQuestions[index]?.question_id || null,
      })).filter(entry => !isNaN(entry.score) && entry.id !== null);

      if (form_results.length === 0) {
        console.warn(`⚠️ No valid form results for row ${i + 4}`, row);
      }

      return {
        assessor_id,
        organization_id,
        form_results,
      };
    }).filter(entry => entry !== null);

    console.log("✅ Parsed Bulk Data:", parsedData);
    setBulkData(parsedData);
  };

  reader.readAsBinaryString(file);
};

    const submitBulkData = async () => {
        try {
            const response = await bulkEnvironmentForms(bulkData); // Make sure to import this
            console.log("Bulk API response:", response);

            if (response?.created > 0) {
                alert(`✅ Successfully submitted ${response.created} entries.`);
            } else {
                alert("⚠️ Submission succeeded, but no entries were created.");
            }
        } catch (err) {
            console.error("Bulk API error:", err);
            alert("❌ Failed to submit bulk data. Please check your file and try again.");
        }
    };

    return (
        <div className="rounded shadow-lg shadow-slate-300 w-[58%] mx-auto p-4">
            <h1 className="font-bold text-2xl">Bulk data for forms (wisdom / watoms)</h1>
            <Selectors
                label="organization"
                title="Step 1: Select an organization"
                description="Please Select an organization"
                data={ORGANIZATIONS_TYPE}
                value={selectedOrgType}
                onChange={(e) => selectOrganization(e)}
            />
            {selectedOrgType && <Selectors
                label="school"
                title={selectedOrgType === "School" ? "Step 2: Select a school" : "Step 2: Select an institution"}
                description="Please Select a school / institution"
                data={schools}
                value={selectedSchool}
                onChange={(e) => selectSchool(e)}
                name="name"
            />}
            {selectedOrgType && selectedSchool && <Selectors
                label="Forms"
                title="Step 3: Select a form"
                description="Please Select a form"
                data={forms}
                value={selectedFormId}
                onChange={(e) => selectForm(e)}
                selectCSS="text-end"
                name="ar"
            />}
            {selectedFormId && <Selectors
                label="Assessor Type"
                title="Step 4: Select an assessor"
                description="Please Select an assessor"
                data={ASSESSOR_TYPE}
                value={selectedAssessor}
                onChange={(e) => selectAssessor(e)}
            />}
            {selectedFormId && <div className="mb-6">
                <h2 className="text-lg text-gray-700 mb-2 font-bold">Step 5: Download Template</h2>
                <button
                    onClick={downloadTraineeTemplate}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded transition"
                >
                    Download Excel Template
                </button>
            </div>}
            {selectedFormId && (
                <>
                    <div className="mb-6">
                        <h2 className="text-lg font-bold text-gray-700 mb-2">Step 6: Upload Filled Excel</h2>
                        <input
                            type="file"
                            accept=".xlsx, .xls"
                            onChange={handleBulkFileUpload}
                            className="border border-gray-300 rounded px-3 py-2 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-green-100 file:text-green-700"
                        />
                    </div>

                    {bulkData.length > 0 && (
                        <div className="mb-6">
                            <h2 className="text-lg font-medium text-gray-700 mb-2">Step 3: Submit to API</h2>
                            <button
                                onClick={submitBulkData}
                                className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded transition"
                            >
                                Submit Bulk Data
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

export default BulkForms;