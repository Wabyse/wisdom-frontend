// Components
import NewNavbar from "../../../components/NewNavbar";
// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartSimple, faFolderPlus, faPen, faPlus, faQrcode, faX } from "@fortawesome/free-solid-svg-icons";
// Images
import application from '../../../assets/ksaApplication.jpg';
import person from '../../../assets/person.jpg';
import passport from '../../../assets/passport.jpg';
// tools
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
// APIs
import { fetchCurriculums, fetchSchools } from "../../../services/data";
import { createCandidateUser, fetchAllCandidates, updateCandidateUser } from "../../../services/watoms/watomsData";
// libraries
import toast, { Toaster } from "react-hot-toast";
// static data
import { COUNTRYS } from "../../../constants/constants";
// utils
import { normalDate } from "../../../utils/normalDate";
import { extractDate } from "../../../utils/extractDate";
import { extractTime } from "../../../utils/extractTime";

const WatomsProfessionalExamination = () => {
    const navigate = useNavigate();
    const [inputsType, setInputsType] = useState("");
    const [vtcs, setVtcs] = useState([]);
    const [courses, setCourses] = useState([]);
    const [candidates, setCandidates] = useState([]);
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        id_number: "",
        passport_number: "",
        email: "",
        organization_id: "",
        category: "",
        candidate_id: "",
        phone_number: "",
        recommended_country: "",
        self_test_date: "",
        personal_test_date: "",
        theory_test_date: "",
        self_test_time: "",
        personal_test_time: "",
        theory_test_time: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "phone_number") {
            if (value.length > 11) {
                toast.error("الرجاء كتابة رقم صحيح مكون من أحد عشر رقمًا");
            } else if (/^\d*$/.test(value)) {
                setFormData((prev) => ({ ...prev, [name]: value }));
            } else {
                toast.error("الرجاء كتابة رقم صحيح مكون من أحد عشر رقمًا");
                setFormData((prev) => ({ ...prev, [name]: "" }));
            }
        } else if (name === "id_number") {
            if (value.length > 14) {
                toast.error("الرجاء كتباه رقم صحيح مكون من اربع عشر رقم")
            } else if (/^\d*$/.test(value)) {
                setFormData((prev) => ({ ...prev, [name]: value }));
            } else {
                toast.error("الرجاء كتباه رقم صحيح مكون من اربع عشر رقم")
                setFormData((prev) => ({ ...prev, [name]: "" }));
            }
        } else if (name === "passport_number") {
            if (/^\d*$/.test(value)) {
                setFormData((prev) => ({ ...prev, [name]: value }));
            } else {
                toast.error("الرجاء كتباه رقم صحيح")
                setFormData((prev) => ({ ...prev, [name]: "" }));
            }
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    useEffect(() => {
        const loadData = async () => {
            const response = await fetchSchools();
            const filteredOrgs = response.filter(org => org.id !== 12 && org.id !== 14 && org.id !== 1 && org.id !== 2);
            setVtcs(filteredOrgs)
        }

        const loadCurriculums = async () => {
            const response = await fetchCurriculums();
            const filteredCurriculums = response.filter(course => course.id !== 1 && course.id !== 2 && course.id !== 3 && course.id !== 13 && course.id !== 14 && course.id !== 15 && course.id !== 16 && course.id !== 17 && course.id !== 18 && course.id !== 48 && course.id !== 49 && course.id !== 50 && course.id !== 51 && course.id !== 53);
            setCourses(filteredCurriculums);
        }

        const loadCandidates = async () => {
            const response = await fetchAllCandidates();
            setCandidates(response);
        }

        loadData();
        loadCurriculums();
        loadCandidates();
    }, []);

    useEffect(() => {
        if (selectedCandidate) {
            setFormData(prev => ({
                ...prev,
                organization_id: selectedCandidate.organization_id || "",
                category: selectedCandidate.category || "",
                candidate_id: selectedCandidate.candidate_id || "",
                phone_number: selectedCandidate.phone_number || "",
                name: selectedCandidate.name || "",
                id_number: selectedCandidate.id_number || "",
                passport_number: selectedCandidate.passport_number || "",
                email: selectedCandidate.email || "",
                recommended_country: selectedCandidate.recommended_country || "",
                self_test_date: extractDate(selectedCandidate.self_test_date),
                personal_test_date: extractDate(selectedCandidate.personal_test_date),
                theory_test_date: extractDate(selectedCandidate.theory_test_date),
                self_test_time: extractTime(selectedCandidate.self_test_date),
                personal_test_time: extractTime(selectedCandidate.personal_test_date),
                theory_test_time: extractTime(selectedCandidate.theory_test_date),
            }));
        }
    }, [selectedCandidate]);


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.id_number || !formData.passport_number || !formData.email || !formData.organization_id || !formData.category || !formData.candidate_id || !formData.phone_number || !formData.recommended_country || !formData.self_test_date || !formData.personal_test_date || !formData.theory_test_date) {
            alert("Please fill all required fields before saving.");
            return;
        }

        if (inputsType === "add") {
            try {
                const response = await createCandidateUser(formData);

                // ✅ Simple popup with returned code and password
                alert(`Candidate created successfully!\n\nUser Code: ${response.code}\nPassword: ${response.password}`);

                // Optionally close the popup after success
                setInputsType("");
                setFormData({
                    name: "",
                    id_number: "",
                    passport_number: "",
                    email: "",
                    organization_id: "",
                    category: "",
                    candidate_id: "",
                    phone_number: "",
                    recommended_country: "",
                    self_test_date: "",
                    personal_test_date: "",
                    theory_test_date: "",
                })
            } catch (error) {
                console.error("Error creating candidate:", error);
                alert(`Failed to create candidate: ${error.response?.data?.message || "Server error"}`);
            }
        } else if (inputsType === "edit") {
            try {
                await updateCandidateUser(formData, selectedCandidate?.id);

                // ✅ Simple popup with returned code and password
                toast.success("Candidate updated successfully!");

                // Optionally close the popup after success
                setInputsType("");
                setSelectedCandidate(formData)
            } catch (error) {
                console.error("Error creating candidate:", error);
                alert(`Failed to create candidate: ${error.response?.data?.message || "Server error"}`);
            }
        }
    };

    return (
        <>
            <Toaster />
            <NewNavbar
                shareStatus={false}
                darkmodeStatus={false}
                searchType={"pe"}
                searchedData={candidates}
                onSelectSearchItem={(item) => setSelectedCandidate(item)}
            >
                <div className="flex gap-3">
                    {inputsType !== "" && <button
                        className="rounded-full w-10 h-10 flex justify-center items-center bg-white/80 hover:bg-gray-200 shadow transition-all"
                        title="Cancel"
                        onClick={() => {
                            setInputsType(""); setFormData({
                                name: "",
                                id_number: "",
                                passport_number: "",
                                email: "",
                                organization_id: "",
                                category: "",
                                candidate_id: "",
                                phone_number: "",
                                recommended_country: "",
                                self_test_date: "",
                                personal_test_date: "",
                                theory_test_date: "",
                            })
                        }}
                    >
                        <FontAwesomeIcon
                            icon={faX}
                            className="text-xl text-watomsBlue"
                        />
                    </button>}
                    {inputsType !== "" && <button
                        type="submit"
                        className="w-10 h-10 text-sm text-white bg-[#0a183d] hover:bg-[#15285e] rounded-full font-bold transition"
                        onClick={handleSubmit}
                    >
                        حفظ
                    </button>}
                    <button
                        className="rounded-full w-10 h-10 flex justify-center items-center bg-white/80 hover:bg-gray-200 shadow transition-all"
                        title="QRCode Scan"
                    >
                        <FontAwesomeIcon
                            icon={faQrcode}
                            className="text-xl text-watomsBlue"
                        />
                    </button>
                    <button
                        className="rounded-full w-10 h-10 flex justify-center items-center bg-white/80 hover:bg-gray-200 shadow transition-all"
                        title="Edit Candidate's data"
                        onClick={() => { selectedCandidate ? setInputsType("edit") : toast.error("الرجاء اختيار متقدم") }}
                    >
                        <FontAwesomeIcon
                            icon={faPen}
                            className="text-xl text-watomsBlue"
                        />
                    </button>
                    <button
                        className="rounded-full w-10 h-10 flex justify-center items-center bg-white/80 hover:bg-gray-200 shadow transition-all"
                        title="Add New Candidate"
                        onClick={() => setInputsType("add")}
                    >
                        <FontAwesomeIcon
                            icon={faFolderPlus}
                            className="text-xl text-watomsBlue"
                        />
                    </button>
                    <button
                        className="rounded-full w-10 h-10 flex justify-center items-center bg-white/80 hover:bg-gray-200 shadow transition-all"
                        title="Dashboard"
                        onClick={() => navigate('/watoms/pe/dashboard')}
                    >
                        <FontAwesomeIcon
                            icon={faChartSimple}
                            className="text-xl text-watomsBlue"
                        />
                    </button>
                </div>
            </NewNavbar>
            <div className="w-full h-[88vh] flex bg-[#0a183d]">
                {/* left side bar navigator */}
                <div className="w-[10%] bg-white/55 flex flex-col justify-evenly items-center">
                    <div>اجراءات الحوكمة</div>
                    <div className="w-[90%] h-[12%] flex justify-center items-center text-yellow-400 text-sm text-center bg-gray-500 px-2 rounded-xl border-blue-600 border-2">ملفات تاكيد الهوية</div>
                    <button onClick={() => navigate('/watoms/pe/tests-confirmation')} className="w-[90%] h-[12%] flex flex-col justify-center items-center text-yellow-400  text-sm text-center bg-[#0a183d] hover:bg-gray-500 px-2 rounded-xl border-blue-600 border-2">ملفات تاكيد الاختبارات</button>
                    <button onClick={() => navigate('/watoms/pe/practical-test')} className="w-[90%] h-[12%] flex flex-col justify-center items-center text-yellow-400  text-sm text-center bg-[#0a183d] hover:bg-gray-500 px-2 rounded-xl border-blue-600 border-2">تقييم مراقبين الجودة والحوكمة</button>
                    <button onClick={() => navigate('/watoms/pe/soft-test')} className="w-[90%] h-[12%] flex flex-col justify-center items-center text-yellow-400  text-sm text-center bg-[#0a183d] hover:bg-gray-500 px-2 rounded-xl border-blue-600 border-2">اختبارات المرشحين</button>
                    <button onClick={() => navigate('/watoms/pe/cognitive-test')} className="w-[90%] h-[12%] flex flex-col justify-center items-center text-yellow-400  text-sm text-center bg-[#0a183d] hover:bg-gray-500 px-2 rounded-xl border-blue-600 border-2">مؤشرات تحليل الأداء العام</button>
                </div>
                {/* user's details */}
                <div className="w-[90%] flex justify-center items-center">
                    <div className="w-[95%] h-[95%] flex border-white border-2 rounded-xl">
                        {/* application and import documents */}
                        <div className="w-[35%] flex flex-col items-center gap-5 pt-6">
                            {/* application */}
                            <div className="w-[77%] border-white border-2 rounded-xl">
                                <img className="rounded-xl" src={application} alt="" />
                            </div>
                            {/* import documents */}
                            <div className="w-[77%] flex gap-2 text-white text-sm">
                                <div className="relative flex-1 flex justify-center items-center text-center hover:bg-gray-500 cursor-pointer border-white border-2 px-2 py-1 rounded-xl">
                                    <button className="absolute -top-2 -right-2 rounded-full w-5 h-5 flex justify-center items-center bg-white/80 hover:bg-gray-200 shadow transition-all" >
                                        <FontAwesomeIcon icon={faPlus} className="text-sm text-gray-500" />
                                    </button>
                                    صورة المتقدم مع البطاقة الشخصية
                                </div>
                                <div className="relative flex-1 flex justify-center items-center text-center hover:bg-gray-500 cursor-pointer border-white border-2 px-2 py-1 rounded-xl">
                                    <button className="absolute -top-2 -right-2 rounded-full w-5 h-5 flex justify-center items-center bg-white/80 hover:bg-gray-200 shadow transition-all" >
                                        <FontAwesomeIcon icon={faPlus} className="text-sm text-gray-500" />
                                    </button>
                                    صورة المتقدم مع الباسبور السفر
                                </div>
                                <div className="relative flex-1 flex justify-center items-center text-center hover:bg-gray-500 cursor-pointer border-white border-2 px-2 py-1 rounded-xl">
                                    <button className="absolute -top-2 -right-2 rounded-full w-5 h-5 flex justify-center items-center bg-white/80 hover:bg-gray-200 shadow transition-all" >
                                        <FontAwesomeIcon icon={faPlus} className="text-sm text-gray-500" />
                                    </button>
                                    صورة مع تذكرة الاختبار
                                </div>
                            </div>
                        </div>
                        {/* user's data and passport */}
                        <div className="w-[65%] flex flex-col items-center gap-4">
                            {/* user's data */}
                            {(inputsType === "" && !selectedCandidate) ?
                                <div className="w-full flex justify-center gap-2 mt-6">
                                    <div className="w-[40%] flex flex-col gap-1">
                                        <div className="flex gap-1">
                                            <div className="w-3/5 h-7 flex justify-center items-center text-center bg-white rounded border-white border-2">-----</div>
                                            <div className="w-2/5 h-7 flex justify-center items-center text-center text-white rounded border-white border-2">مركز الاختبار</div>
                                        </div>
                                        <div className="flex gap-1">
                                            <div className="w-3/5 h-7 flex justify-center items-center text-center bg-white rounded border-white border-2">-----</div>
                                            <div className="w-2/5 h-7 flex justify-center items-center text-center text-white rounded border-white border-2">الفئة</div>
                                        </div>
                                        <div className="flex gap-1">
                                            <div className="w-3/5 h-7 flex justify-center items-center text-center bg-white rounded border-white border-2">-----</div>
                                            <div className="w-2/5 h-7 flex justify-center items-center text-center text-white rounded border-white border-2">رقم الممتحن</div>
                                        </div>
                                        <div className="flex gap-1">
                                            <div className="w-3/5 h-7 flex justify-center items-center text-center bg-white rounded border-white border-2">-----</div>
                                            <div className="w-2/5 h-7 flex justify-center items-center text-center text-white rounded border-white border-2">رقم الموبيل</div>
                                        </div>
                                    </div>
                                    <div className="w-[40%] flex flex-col gap-1">
                                        <div className="flex gap-1">
                                            <div className="w-3/5 h-7 flex justify-center items-center text-center bg-white rounded border-white border-2">-----</div>
                                            <div className="w-2/5 h-7 flex justify-center items-center text-center text-white rounded border-white border-2">الاسم</div>
                                        </div>
                                        <div className="flex gap-1">
                                            <div className="w-3/5 h-7 flex justify-center items-center text-center bg-white rounded border-white border-2">-----</div>
                                            <div className="w-2/5 h-7 flex justify-center items-center text-center text-white rounded border-white border-2">الرقم القومي</div>
                                        </div>
                                        <div className="flex gap-1">
                                            <div className="w-3/5 h-7 flex justify-center items-center text-center bg-white rounded border-white border-2">-----</div>
                                            <div className="w-2/5 h-7 flex justify-center items-center text-center text-white rounded border-white border-2">رقم جواز السفر</div>
                                        </div>
                                        <div className="flex gap-1">
                                            <div className="w-3/5 h-7 flex justify-center items-center text-center bg-white rounded border-white border-2">-----</div>
                                            <div className="w-2/5 h-7 flex justify-center items-center text-center text-white rounded border-white border-2">البريد الالكتروني</div>
                                        </div>
                                    </div>
                                    <div className="w-[19%] flex justify-center items-center">
                                        <img className="w-[75%] rounded-xl" src={person} alt="" />
                                    </div>
                                </div> :
                                (inputsType === "" && selectedCandidate) ?
                                    <div className="w-full flex justify-center gap-2 mt-6">
                                        <div className="w-[40%] flex flex-col gap-1">
                                            <div className="flex gap-1">
                                                <div className="w-3/5 h-7 flex justify-center items-center text-center bg-white rounded border-white border-2">{vtcs.filter(vtc => vtc.id === Number(selectedCandidate?.organization_id))[0].name}</div>
                                                <div className="w-2/5 h-7 flex justify-center items-center text-center text-white rounded border-white border-2">مركز الاختبار</div>
                                            </div>
                                            <div className="flex gap-1">
                                                <div className="w-3/5 h-7 flex justify-center items-center text-center bg-white rounded border-white border-2">{courses.filter(course => course.id === Number(selectedCandidate?.category))[0].code}</div>
                                                <div className="w-2/5 h-7 flex justify-center items-center text-center text-white rounded border-white border-2">الفئة</div>
                                            </div>
                                            <div className="flex gap-1">
                                                <div className="w-3/5 h-7 flex justify-center items-center text-center bg-white rounded border-white border-2">{selectedCandidate?.candidate_id}</div>
                                                <div className="w-2/5 h-7 flex justify-center items-center text-center text-white rounded border-white border-2">رقم الممتحن</div>
                                            </div>
                                            <div className="flex gap-1">
                                                <div className="w-3/5 h-7 flex justify-center items-center text-center bg-white rounded border-white border-2">{selectedCandidate?.phone_number}</div>
                                                <div className="w-2/5 h-7 flex justify-center items-center text-center text-white rounded border-white border-2">رقم الموبيل</div>
                                            </div>
                                        </div>
                                        <div className="w-[40%] flex flex-col gap-1">
                                            <div className="flex gap-1">
                                                <div className="w-3/5 h-7 flex justify-center items-center text-center bg-white rounded border-white border-2">{selectedCandidate?.name}</div>
                                                <div className="w-2/5 h-7 flex justify-center items-center text-center text-white rounded border-white border-2">الاسم</div>
                                            </div>
                                            <div className="flex gap-1">
                                                <div className="w-3/5 h-7 flex justify-center items-center text-center bg-white rounded border-white border-2">{selectedCandidate?.id_number}</div>
                                                <div className="w-2/5 h-7 flex justify-center items-center text-center text-white rounded border-white border-2">الرقم القومي</div>
                                            </div>
                                            <div className="flex gap-1">
                                                <div className="w-3/5 h-7 flex justify-center items-center text-center bg-white rounded border-white border-2">{selectedCandidate?.passport_number}</div>
                                                <div className="w-2/5 h-7 flex justify-center items-center text-center text-white rounded border-white border-2">رقم جواز السفر</div>
                                            </div>
                                            <div className="flex gap-1">
                                                <div className="w-3/5 h-7 flex justify-center items-center text-center bg-white rounded border-white border-2">{selectedCandidate?.email}</div>
                                                <div className="w-2/5 h-7 flex justify-center items-center text-center text-white rounded border-white border-2">البريد الالكتروني</div>
                                            </div>
                                        </div>
                                        <div className="w-[19%] flex justify-center items-center">
                                            <img className="w-[75%] rounded-xl" src={person} alt="" />
                                        </div>
                                    </div> :
                                    inputsType === "add" ?
                                        <div className="w-full flex justify-center gap-2 mt-6">
                                            <div className="w-[40%] flex flex-col gap-1">
                                                <div className="flex gap-1">
                                                    <select
                                                        name="organization_id"
                                                        value={formData.organization_id}
                                                        onChange={handleChange}
                                                        className="w-3/5 h-7 text-sm text-center bg-white rounded border-white border-2 p-0"
                                                        required
                                                    >
                                                        <option value="">اختر الجهة</option>
                                                        {vtcs.map(org => (
                                                            <option key={org.id} value={org.id}>
                                                                {org.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <div className="w-2/5 h-7 flex justify-center items-center text-center text-white rounded border-white border-2">مركز الاختبار</div>
                                                </div>
                                                <div className="flex gap-1">
                                                    <select
                                                        name="category"
                                                        value={formData.category}
                                                        onChange={handleChange}
                                                        className="w-3/5 h-7 text-sm text-center bg-white rounded border-white border-2 p-0"
                                                        required
                                                    >
                                                        <option value="">اختر الفئة</option>
                                                        {courses.map(course => (
                                                            <option key={course.id} value={course.id}>
                                                                {course.code}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <div className="w-2/5 h-7 flex justify-center items-center text-center text-white rounded border-white border-2">الفئة</div>
                                                </div>
                                                <div className="flex gap-1">
                                                    <input className="w-3/5 h-7 flex justify-center items-center text-center bg-white rounded border-white border-2" name="candidate_id" placeholder="ادخل رقم الممتحن" value={formData.candidate_id} onChange={handleChange} required />
                                                    <div className="w-2/5 h-7 flex justify-center items-center text-center text-white rounded border-white border-2">رقم الممتحن</div>
                                                </div>
                                                <div className="flex gap-1">
                                                    <input className="w-3/5 h-7 flex justify-center items-center text-center bg-white rounded border-white border-2" name="phone_number" placeholder="ادخل رقم الهاتف" value={formData.phone_number} onChange={handleChange} />
                                                    <div className="w-2/5 h-7 flex justify-center items-center text-center text-white rounded border-white border-2">رقم الموبيل</div>
                                                </div>
                                            </div>
                                            <div className="w-[40%] flex flex-col gap-1">
                                                <div className="flex gap-1">
                                                    <input className="w-3/5 h-7 flex justify-center items-center text-center bg-white rounded border-white border-2" name="name" placeholder="ادخل الاسم" value={formData.name} onChange={handleChange} required />
                                                    <div className="w-2/5 h-7 flex justify-center items-center text-center text-white rounded border-white border-2">الاسم</div>
                                                </div>
                                                <div className="flex gap-1">
                                                    <input className="w-3/5 h-7 flex justify-center items-center text-center bg-white rounded border-white border-2" name="id_number" placeholder="ادخل الرقم القومي" value={formData.id_number} onChange={handleChange} />
                                                    <div className="w-2/5 h-7 flex justify-center items-center text-center text-white rounded border-white border-2">الرقم القومي</div>
                                                </div>
                                                <div className="flex gap-1">
                                                    <input className="w-3/5 h-7 flex justify-center items-center text-center bg-white rounded border-white border-2" name="passport_number" placeholder="ادخل رقم الجواز السفر" value={formData.passport_number} onChange={handleChange} />
                                                    <div className="w-2/5 h-7 flex justify-center items-center text-center text-white rounded border-white border-2">رقم جواز السفر</div>
                                                </div>
                                                <div className="flex gap-1">
                                                    <input className="w-3/5 h-7 flex justify-center items-center text-center bg-white rounded border-white border-2" name="email" type="email" placeholder="ادخل البريد الإلكتروني" value={formData.email} onChange={handleChange} />
                                                    <div className="w-2/5 h-7 flex justify-center items-center text-center text-white rounded border-white border-2">البريد الالكتروني</div>
                                                </div>
                                            </div>
                                            <div className="w-[19%] flex justify-center items-center">
                                                <img className="w-[75%] rounded-xl" src={person} alt="" />
                                            </div>
                                        </div> :
                                        inputsType === "edit" && selectedCandidate &&
                                        <div className="w-full flex justify-center gap-2 mt-6">
                                            <div className="w-[40%] flex flex-col gap-1">
                                                {/* organization */}
                                                <div className="flex gap-1">
                                                    <select
                                                        name="organization_id"
                                                        value={formData.organization_id}
                                                        onChange={handleChange}
                                                        className="w-3/5 h-7 text-sm text-center bg-white rounded border-white border-2 p-0"
                                                        required
                                                    >
                                                        <option value="">اختر الجهة</option>
                                                        {vtcs.map(org => (
                                                            <option key={org.id} value={org.id}>
                                                                {org.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <div className="w-2/5 h-7 flex justify-center items-center text-center text-white rounded border-white border-2">مركز الاختبار</div>
                                                </div>
                                                {/* course */}
                                                <div className="flex gap-1">
                                                    <select
                                                        name="category"
                                                        value={formData.category}
                                                        onChange={handleChange}
                                                        className="w-3/5 h-7 text-sm text-center bg-white rounded border-white border-2 p-0"
                                                        required
                                                    >
                                                        <option value="">اختر الفئة</option>
                                                        {courses.map(course => (
                                                            <option key={course.id} value={course.id}>
                                                                {course.code}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <div className="w-2/5 h-7 flex justify-center items-center text-center text-white rounded border-white border-2">الفئة</div>
                                                </div>
                                                {/* candidate id */}
                                                <div className="flex gap-1">
                                                    <input className="w-3/5 h-7 flex justify-center items-center text-center bg-white rounded border-white border-2" name="candidate_id" placeholder="ادخل رقم الممتحن" value={formData.candidate_id} onChange={handleChange} required />
                                                    <div className="w-2/5 h-7 flex justify-center items-center text-center text-white rounded border-white border-2">رقم الممتحن</div>
                                                </div>
                                                {/* phone number */}
                                                <div className="flex gap-1">
                                                    <input className="w-3/5 h-7 flex justify-center items-center text-center bg-white rounded border-white border-2" name="phone_number" placeholder="ادخل رقم الهاتف" value={formData.phone_number} onChange={handleChange} />
                                                    <div className="w-2/5 h-7 flex justify-center items-center text-center text-white rounded border-white border-2">رقم الموبيل</div>
                                                </div>
                                            </div>
                                            <div className="w-[40%] flex flex-col gap-1">
                                                {/* name */}
                                                <div className="flex gap-1">
                                                    <input className="w-3/5 h-7 flex justify-center items-center text-center bg-white rounded border-white border-2" name="name" placeholder="ادخل الاسم" value={formData.name} onChange={handleChange} required />
                                                    <div className="w-2/5 h-7 flex justify-center items-center text-center text-white rounded border-white border-2">الاسم</div>
                                                </div>
                                                {/* id number */}
                                                <div className="flex gap-1">
                                                    <input className="w-3/5 h-7 flex justify-center items-center text-center bg-white rounded border-white border-2" name="id_number" placeholder="ادخل الرقم القومي" value={formData.id_number} onChange={handleChange} />
                                                    <div className="w-2/5 h-7 flex justify-center items-center text-center text-white rounded border-white border-2">الرقم القومي</div>
                                                </div>
                                                {/* passport number */}
                                                <div className="flex gap-1">
                                                    <input className="w-3/5 h-7 flex justify-center items-center text-center bg-white rounded border-white border-2" name="passport_number" placeholder="ادخل رقم الجواز السفر" value={formData.passport_number} onChange={handleChange} />
                                                    <div className="w-2/5 h-7 flex justify-center items-center text-center text-white rounded border-white border-2">رقم جواز السفر</div>
                                                </div>
                                                {/* email */}
                                                <div className="flex gap-1">
                                                    <input className="w-3/5 h-7 flex justify-center items-center text-center bg-white rounded border-white border-2" name="email" type="email" placeholder="ادخل البريد الإلكتروني" value={formData.email} onChange={handleChange} />
                                                    <div className="w-2/5 h-7 flex justify-center items-center text-center text-white rounded border-white border-2">البريد الالكتروني</div>
                                                </div>
                                            </div>
                                            <div className="w-[19%] flex justify-center items-center">
                                                <img className="w-[75%] rounded-xl" src={person} alt="" />
                                            </div>
                                        </div>
                            }
                            <div className="w-full flex gap-2">
                                {/* passport */}
                                <img className="rounded-xl w-[73%] max-h-[57vh]" src={passport} alt="" />
                                {/* dates and recommended country */}
                                {(inputsType === "" && !selectedCandidate) ?
                                    <div className="w-[25%] flex flex-col gap-4">
                                        <div className="flex flex-col gap-1">
                                            <div className="w-full text-center text-white rounded border-white border-2">الدولة المرشح لها المتقدم</div>
                                            <div className="w-full text-center bg-white rounded border-white border-2 py-2">-----</div>
                                        </div>
                                        <div className="w-full h-0 border-b-2 border-white" />
                                        <div className="flex flex-col gap-1">
                                            <div className="w-full text-center text-white rounded border-white border-2">توقيت الاختبار العملي</div>
                                            <div className="w-full text-center bg-white rounded border-white border-2 py-2">-----</div>
                                        </div>
                                        <div className="w-full h-0 border-b-2 border-white" />
                                        <div className="flex flex-col gap-1">
                                            <div className="w-full text-center text-white rounded border-white border-2">⁠توقيت الاختبار النظري</div>
                                            <div className="w-full text-center bg-white rounded border-white border-2 py-2">-----</div>
                                        </div>
                                        <div className="w-full h-0 border-b-2 border-white" />
                                        <div className="flex flex-col gap-1">
                                            <div className="w-full text-center text-white rounded border-white border-2">توقيت اختبار السمات والكفاءة</div>
                                            <div className="w-full text-center bg-white rounded border-white border-2 py-2">-----</div>
                                        </div>
                                    </div> :
                                    (inputsType === "" && selectedCandidate) ?
                                        <div className="w-[25%] flex flex-col gap-4">
                                            <div className="flex flex-col gap-1">
                                                <div className="w-full text-center text-white rounded border-white border-2">الدولة المرشح لها المتقدم</div>
                                                <div className="w-full text-center bg-white rounded border-white border-2 py-2">{selectedCandidate?.recommended_country}</div>
                                            </div>
                                            <div className="w-full h-0 border-b-2 border-white" />
                                            <div className="flex flex-col gap-1">
                                                <div className="w-full text-center text-white rounded border-white border-2">توقيت الاختبار العملي</div>
                                                <div className="w-full text-center bg-white rounded border-white border-2 py-2">{normalDate(selectedCandidate?.self_test_date)}</div>
                                            </div>
                                            <div className="w-full h-0 border-b-2 border-white" />
                                            <div className="flex flex-col gap-1">
                                                <div className="w-full text-center text-white rounded border-white border-2">توقيت الاختبار النظري</div>
                                                <div className="w-full text-center bg-white rounded border-white border-2 py-2">{normalDate(selectedCandidate?.personal_test_date)}</div>
                                            </div>
                                            <div className="w-full h-0 border-b-2 border-white" />
                                            <div className="flex flex-col gap-1">
                                                <div className="w-full text-center text-white rounded border-white border-2">توقيت اختبار السمات والكفاءة</div>
                                                <div className="w-full text-center bg-white rounded border-white border-2 py-2">{normalDate(selectedCandidate?.theory_test_date)}</div>
                                            </div>
                                        </div> :
                                        inputsType === "add" ?
                                            <div className="w-[25%] flex flex-col gap-4">
                                                <div className="flex flex-col gap-1">
                                                    <div className="w-full text-center text-white rounded border-white border-2">الدولة المرشح لها المتقدم</div>
                                                    <select
                                                        name="recommended_country"
                                                        value={formData.recommended_country}
                                                        onChange={handleChange}
                                                        className="w-full text-center bg-white rounded border-white border-2 py-2"
                                                        required
                                                    >
                                                        <option value="">الدولة الموصى بها</option>
                                                        {COUNTRYS.map(country => (
                                                            <option key={country} value={country}>
                                                                {country}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="w-full h-0 border-b-2 border-white" />
                                                <div className="flex flex-col gap-1">
                                                    <div className="w-full text-center text-white rounded border-white border-2">توقيت الاختبار العملي</div>
                                                    <div className="w-full flex gap-2">
                                                        <input
                                                            id="self_test_date"
                                                            name="self_test_date"
                                                            type="date"
                                                            value={formData.self_test_date}
                                                            onChange={handleChange}
                                                            className="flex-1 w-[45%] text-sm text-center bg-white rounded border-white border-2 py-2"
                                                        />
                                                        <input
                                                            id="self_test_time"
                                                            name="self_test_time"
                                                            type="time"
                                                            value={formData.self_test_time}
                                                            onChange={handleChange}
                                                            className="flex-1 w-[45%] text-sm text-center bg-white rounded border-white border-2 py-2"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="w-full h-0 border-b-2 border-white" />
                                                <div className="flex flex-col gap-1">
                                                    <div className="w-full text-center text-white rounded border-white border-2">⁠توقيت الاختبار النظري</div>
                                                    <div className="w-full flex gap-2">
                                                        <input
                                                            id="personal_test_date"
                                                            name="personal_test_date"
                                                            type="date"
                                                            value={formData.personal_test_date}
                                                            onChange={handleChange}
                                                            className="flex-1 w-[45%] text-sm text-center bg-white rounded border-white border-2 py-2"
                                                        />
                                                        <input
                                                            id="personal_test_time"
                                                            name="personal_test_time"
                                                            type="time"
                                                            value={formData.personal_test_time}
                                                            onChange={handleChange}
                                                            className="flex-1 w-[45%] text-sm text-center bg-white rounded border-white border-2 py-2"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="w-full h-0 border-b-2 border-white" />
                                                <div className="flex flex-col gap-1">
                                                    <div className="w-full text-center text-white rounded border-white border-2">توقيت اختبار السمات والكفاءة</div>
                                                    <div className="w-full flex gap-2">
                                                        <input
                                                            id="theory_test_date"
                                                            name="theory_test_date"
                                                            type="date"
                                                            value={formData.theory_test_date}
                                                            onChange={handleChange}
                                                            className="flex-1 w-[45%] text-sm text-center bg-white rounded border-white border-2 py-2"
                                                        />
                                                        <input
                                                            id="theory_test_time"
                                                            name="theory_test_time"
                                                            type="time"
                                                            value={formData.theory_test_time}
                                                            onChange={handleChange}
                                                            className="flex-1 w-[45%] text-sm text-center bg-white rounded border-white border-2 py-2"
                                                        />
                                                    </div>
                                                </div>
                                            </div> :
                                            inputsType === "edit" && selectedCandidate &&
                                            <div className="w-[25%] flex flex-col gap-4">
                                                <div className="flex flex-col gap-1">
                                                    <div className="w-full text-center text-white rounded border-white border-2">الدولة المرشح لها المتقدم</div>
                                                    <select
                                                        name="recommended_country"
                                                        value={formData.recommended_country}
                                                        onChange={handleChange}
                                                        className="w-full text-center bg-white rounded border-white border-2 py-2"
                                                        required
                                                    >
                                                        <option value="">الدولة الموصى بها</option>
                                                        {COUNTRYS.map(country => (
                                                            <option key={country} value={country}>
                                                                {country}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="w-full h-0 border-b-2 border-white" />
                                                <div className="flex flex-col gap-1">
                                                    <div className="w-full text-center text-white rounded border-white border-2">توقيت الاختبار العملي</div>
                                                    <div className="w-full flex gap-2">
                                                        <input
                                                            id="self_test_date"
                                                            name="self_test_date"
                                                            type="date"
                                                            value={formData.self_test_date}
                                                            onChange={handleChange}
                                                            className="flex-1 w-[45%] text-center bg-white rounded border-white border-2 py-2"
                                                        />
                                                        <input
                                                            id="self_test_time"
                                                            name="self_test_time"
                                                            type="time"
                                                            value={formData.self_test_time}
                                                            onChange={handleChange}
                                                            className="flex-1 w-[45%] text-center bg-white rounded border-white border-2 py-2"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="w-full h-0 border-b-2 border-white" />
                                                <div className="flex flex-col gap-1">
                                                    <div className="w-full text-center text-white rounded border-white border-2">⁠توقيت الاختبار النظري</div>
                                                    <div className="w-full flex gap-2">
                                                        <input
                                                            id="personal_test_date"
                                                            name="personal_test_date"
                                                            type="date"
                                                            value={formData.personal_test_date}
                                                            onChange={handleChange}
                                                            className="flex-1 w-[45%] text-center bg-white rounded border-white border-2 py-2"
                                                        />
                                                        <input
                                                            id="personal_test_time"
                                                            name="personal_test_time"
                                                            type="time"
                                                            value={formData.personal_test_time}
                                                            onChange={handleChange}
                                                            className="flex-1 w-[45%] text-center bg-white rounded border-white border-2 py-2"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="w-full h-0 border-b-2 border-white" />
                                                <div className="flex flex-col gap-1">
                                                    <div className="w-full text-center text-white rounded border-white border-2">توقيت اختبار السمات والكفاءة</div>
                                                    <div className="w-full flex gap-2">
                                                        <input
                                                            id="theory_test_date"
                                                            name="theory_test_date"
                                                            type="date"
                                                            value={formData.theory_test_date}
                                                            onChange={handleChange}
                                                            className="flex-1 w-[45%] text-center bg-white rounded border-white border-2 py-2"
                                                        />
                                                        <input
                                                            id="theory_test_time"
                                                            name="theory_test_time"
                                                            type="time"
                                                            value={formData.theory_test_time}
                                                            onChange={handleChange}
                                                            className="flex-1 w-[45%] text-center bg-white rounded border-white border-2 py-2"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default WatomsProfessionalExamination;