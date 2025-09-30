import React, { useEffect, useState } from "react";
import { fetchEmployeesRoles, fetchManagerEvaluationTemplate, fetchSchools, fetchVtcEmployees } from "../services/data";
import NewNavbar from "../components/NewNavbar";
import { submitManagerEvaluation, submitMangerComment, submitOrgTaskAvg, updateEmployeeEvaluation } from "../services/dashboard";
import Popup from "../components/Popup";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import person from '../assets/person.jpg';
import { fetchEmployeeEvaluation } from "../services/specificData";

const WatomsEvaluateManagers = () => {
    const navigate = useNavigate();
    const [organizations, setOrganizations] = useState([]);
    const [pureEmployees, setPureEmployees] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [roles, setRoles] = useState([]);
    const [selectedOrg, setSelectedOrg] = useState("");
    const [selectedRole, setSelectedRole] = useState("");
    const [selectedEmployee, setSelectedEmployee] = useState("");
    const [selectedMonth, setSelectedMonth] = useState("");
    const [data, setData] = useState([]);
    const [scores, setScores] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [evaluatedData, setEvaluatedData] = useState([]);
    const [taskAvg, setTaskAvg] = useState(null);
    const [form, setForm] = useState({
        comment: "",
        type: "",
        date: "",
    });
    const [submittimg, setSubmittimg] = useState(false);

    const handleCommentChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (submittimg) return;
        setSubmittimg(true);
        if (form.comment === "" || form.type === "" || form.date === "" || selectedEmployee === "") {
            toast.error('الرجاء اختيار مدير المركز و تسجيل الملاحظة و النوع و التاريخ')
        } else {
            const data = {
                comment: form.comment,
                type: form.type,
                date: form.date,
                employee_id: selectedEmployee
            }
            await submitMangerComment(data);
            setSubmittimg(false);
            setSubmitted(true);
        }
    };

    useEffect(() => {
        const loadSpecificEvaluation = async () => {
            const response = await fetchEmployeeEvaluation(Number(selectedEmployee), Number(selectedMonth));
            setEvaluatedData(response)
        }

        if (selectedEmployee !== "" && selectedMonth !== "") loadSpecificEvaluation();
    }, [selectedEmployee, selectedMonth])

    const closePopup = () => {
        setSubmitted(false)
        navigate('/watoms');
    };

    useEffect(() => {
        const loadData = async () => {
            const [template, schools, loadEmployees, roles] = await Promise.all([
                fetchManagerEvaluationTemplate(),
                fetchSchools(),
                fetchVtcEmployees(),
                fetchEmployeesRoles(),
            ]);

            setData(template);

            setOrganizations(schools.filter(org => ![1, 2, 12, 14].includes(org.id)));

            setEmployees(loadEmployees);
            setPureEmployees(loadEmployees);

            // roles with renamed titles
            const renameTitles = {
                Teacher: "مدرب",
                ADMIN: "اداري",
                Manager: "مدير مركز",
                "General Manager": "مدير مركز اخر",
                VtcSupervisor: "مشرف",
            };
            const filteredRoles = roles.filter(r =>
                [1, 29, 30, 32, 33].includes(r.id)
            );
            setRoles(filteredRoles.map(r => ({
                ...r,
                title: renameTitles[r.title] || r.title,
            })));
        };

        loadData();
    }, []);

    useEffect(() => {
        const filterEmployees = () => {
            let filtered = pureEmployees;

            if (selectedOrg) {
                filtered = filtered.filter(emp => emp.employee.organization_id === Number(selectedOrg));
            }

            if (selectedRole) {
                filtered = filtered.filter(emp => emp.employee.role_id === Number(selectedRole));
            }

            setEmployees(filtered);
        };

        filterEmployees();
    }, [selectedOrg, selectedRole, pureEmployees]);



    const handleScoreChange = (value, id) => {
        setScores((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const submitTaskAvg = async (e) => {
        e.preventDefault();
        if (selectedOrg === "" || selectedMonth === "" || !taskAvg) {
            toast.error("الرجاء اختيار الشهر و المركز و اضافة التقييم")
        }
        const data = {
            organization_id: Number(selectedOrg),
            date: Number(selectedMonth),
            score: Number(taskAvg)
        }
        const response = await submitOrgTaskAvg(data);
        if (response) setSubmitted(true)
    }

    const handleConfirm = async (e) => {
        e.preventDefault();
        if (Object.keys(scores).length !== 18) {
            toast.error("Please fill all statements");
        } else {
            const payload = {
                employee_id: Number(selectedEmployee),
                date: Number(selectedMonth),
                evaluations: data.map((cat, cIdx) => ({
                    id: cat.id,
                    title: cat.title,
                    statements: cat.statements.map((st, sIdx) => ({
                        id: st.id,
                        score: Number(scores[st.id]) || 0,
                    })),
                })),
            };

            await submitManagerEvaluation(payload)
            setSubmitted(true);
        }
    };
    const handleEdit = async (e) => {
        e.preventDefault();
        if (Object.keys(scores).length !== 18) {
            toast.error("Please fill all statements");
        } else {
            const payload = {
                employee_id: Number(selectedEmployee),
                date: Number(selectedMonth),
                evaluations: data.map((cat, cIdx) => ({
                    title: cat.title,
                    statements: cat.statements.map((st, sIdx) => ({
                        id: st.id,
                        score: Number(scores[st.id]) || 0,
                    })),
                })),
            };

            await updateEmployeeEvaluation(payload)
            setSubmitted(true);
        }
    };
    const handleDelete = (e) => {
        e.preventDefault();

        const payload = {
            organization_id: selectedOrg,
            month: selectedMonth,
            evaluations: data.map((cat, cIdx) => ({
                title: cat.title,
                statements: cat.statements.map((st, sIdx) => ({
                    title: st.title,
                    score: scores[`${cIdx}-${sIdx}`] || 0,
                    max_score: st.max_score,
                })),
            })),
        };

        console.log("Submit Payload:", payload);

        // Send to backend
        // fetch("/api/save-evaluation", { method: "POST", body: JSON.stringify(payload) })
    };

    return (
        <>
            <Toaster />
            <NewNavbar />
            <div className="max-w-5xl mx-auto p-6">
                <h1 className="text-2xl font-bold mb-6 text-center">
                    نموذج التقييم الشهري لموظفي المراكز
                </h1>
                <form className="space-y-6">
                    <div className="flex w-full gap-4">
                        <div className="w-1/4 flex justify-center items-center">
                            <img className="w-32" src={person} alt="" />
                        </div>
                        <div className="w-3/4">
                            <div className="flex gap-4">
                                {/* Employees Role Selector */}
                                <div className="w-1/2">
                                    <label className="block mb-2 text-end font-bold">الوظيفة</label>
                                    <select
                                        value={selectedRole}
                                        onChange={(e) => setSelectedRole(e.target.value)}
                                        className="w-full border rounded-lg p-2"
                                        dir="rtl"
                                        required
                                    >
                                        <option value="">الرجاء اختيار الوظيفة</option>
                                        {roles.map((role) => (
                                            <option key={role.id} value={role.id}>
                                                {role.title}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Organization Selector */}
                                <div className="w-1/2">
                                    <label className="block mb-2 text-end font-bold">المركز</label>
                                    <select
                                        value={selectedOrg}
                                        onChange={(e) => setSelectedOrg(e.target.value)}
                                        className="w-full border rounded-lg p-2"
                                        dir="rtl"
                                        required
                                    >
                                        <option value="">الرجاء اختيار مركز</option>
                                        {organizations.map((org) => (
                                            <option key={org.id} value={org.id}>
                                                {org.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                {/* Month Selector */}
                                <div className="w-1/2">
                                    <label className="block mb-2 font-bold text-end">الشهر</label>
                                    <select
                                        value={selectedMonth}
                                        onChange={(e) => setSelectedMonth(e.target.value)}
                                        className="w-full border rounded-lg p-2"
                                        dir="rtl"
                                        required
                                    >
                                        <option value="">الرجاء اختيار الشهر</option>
                                        {Array.from({ length: 12 }).map((_, i) => (
                                            <option key={i + 1} value={i + 1}>
                                                {new Date(0, i).toLocaleString("ar", { month: "long" })}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Employees Selector */}
                                <div className="w-1/2">
                                    <label className="block mb-2 text-end font-bold">الموظف</label>
                                    <select
                                        value={selectedEmployee}
                                        onChange={(e) => setSelectedEmployee(e.target.value)}
                                        className="w-full border rounded-lg p-2"
                                        dir="rtl"
                                        required
                                    >
                                        <option value="">الرجاء اختيار الموظف</option>
                                        {employees.map((emp) => (
                                            <option key={emp.employee.id} value={emp.employee.id}>
                                                {emp.employee.first_name} {emp.employee.middle_name} {emp.employee.last_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 mb-6">
                        {evaluatedData.length === 0 && <button
                            type="button"
                            onClick={handleConfirm}
                            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
                        >
                            تأكيد
                        </button>}
                        <button
                            type="button"
                            onClick={handleEdit}
                            className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600"
                        >
                            تعديل
                        </button>
                        <button
                            type="button"
                            onClick={handleDelete}
                            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
                        >
                            حذف
                        </button>
                    </div>

                    {/* Categories & Statements */}
                    {evaluatedData.length !== 0 && <h1 className="text-center">This month has already been evaluated you can update or delete it</h1>}
                    {data.map((category, cIdx) => (
                        <div key={cIdx} className="border rounded-lg p-4 shadow">
                            <h2 className="text-lg font-semibold mb-4 text-end">{category.title}</h2>
                            <div className="space-y-3">
                                {category.statements.map((st, sIdx) => (
                                    <div
                                        key={sIdx}
                                        className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-3 gap-3"
                                    >
                                        {/* Scores on the left, reversed order */}
                                        <div className="flex flex-wrap gap-2 flex-row-reverse justify-start">
                                            {Array.from({ length: st.max_score }).map((_, score) => {
                                                const value = st.max_score - score; // 10 → 1
                                                const isSelected = scores[st.id] === value;

                                                return (
                                                    <button
                                                        key={value}
                                                        type="button"
                                                        onClick={() => handleScoreChange(value, st.id)}
                                                        className={`w-10 h-10 rounded-full flex items-center justify-center border text-sm
                                                        ${isSelected
                                                                ? "bg-blue-600 text-white border-blue-600"
                                                                : "bg-white text-gray-700 border-gray-300"
                                                            }
                                                        hover:bg-blue-100 transition`}
                                                    >
                                                        {value}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                        {/* Title on the right */}
                                        <span className="font-medium text-right">{st.title}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </form>
                <form onSubmit={submitTaskAvg} className="flex items-center gap-3 my-4 justify-center">
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-1 rounded-md hover:bg-blue-700"
                    >
                        حفظ
                    </button>
                    <input
                        id="taskRate"
                        type="number"
                        className="border rounded-md px-2 py-1 w-24 text-center"
                        placeholder="0"
                        onChange={(e) => setTaskAvg(e.target.value)}
                    />
                    <label htmlFor="taskRate" className="font-medium">
                        معدل انجاز المهام
                    </label>
                </form>
                <div className="w-full mx-auto mt-10 p-6 bg-white shadow rounded-lg">
                    <h2 className="text-xl font-bold mb-4 text-center">إضافة ملاحظة لمدير المركز</h2>
                    <form onSubmit={handleCommentSubmit} className="space-y-4">
                        {/* Textbox */}
                        <div>
                            <label className="block mb-1 font-medium text-gray-700 text-right">الملاحظة</label>
                            <input
                                type="text"
                                name="comment"
                                value={form.comment}
                                onChange={handleCommentChange}
                                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-end"
                                placeholder="أدخل الملاحظة"
                                required
                            />
                        </div>

                        {/* Select */}
                        <div>
                            <label className="block mb-1 font-medium text-gray-700 text-right">النوع</label>
                            <select
                                name="type"
                                value={form.type}
                                onChange={handleCommentChange}
                                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                dir="rtl"
                                required
                            >
                                <option value="">اختر النوع</option>
                                <option value="ايجابي">إيجابي</option>
                                <option value="سلبي">سلبي</option>
                            </select>
                        </div>

                        {/* Date */}
                        <div>
                            <label className="block mb-1 font-medium text-gray-700 text-right">التاريخ</label>
                            <input
                                type="date"
                                name="date"
                                value={form.date}
                                onChange={handleCommentChange}
                                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={submittimg}
                            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                        >
                            حفظ
                        </button>
                    </form>
                </div>
            </div>
            <Popup
                isOpen={submitted}
                onClose={closePopup}
                message={"Form has been submitted successfully"}
            />
        </>
    )
}

export default WatomsEvaluateManagers;