// Components
import NewNavbar from "../../../components/NewNavbar";
// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartSimple, faFolderPlus, faPen, faPlus, faQrcode, faXmark } from "@fortawesome/free-solid-svg-icons";
// Images
import application from '../../../assets/ksaApplication.jpg';
import person from '../../../assets/person.jpg';
import passport from '../../../assets/passport.jpg';
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchSchools } from "../../../services/data";
import { createCandidateUser, fetchExaminerData } from "../../../services/watoms/watomsData";

const WatomsProfessionalExamination = () => {
    const navigate = useNavigate();
    const [addCandidatePageStatus, setAddCandidatePageStatus] = useState(false);
    const [vtcs, setVtcs] = useState([]);

    useEffect(() => {
        const loadData = async () => {
            const response = await fetchSchools()
            const filteredOrgs = response.filter(org => org.id !== 12 && org.id !== 14 && org.id !== 1 && org.id !== 2);
            setVtcs(filteredOrgs)
        }

        loadData();
    }, [])

    const AddCandidatePage = () => {
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
        });

        const handleChange = (e) => {
            const { name, value } = e.target;
            setFormData((prev) => ({ ...prev, [name]: value }));
        };
        
        const handleSubmit = async (e) => {
            e.preventDefault();

            if (!formData.name || !formData.id_number || !formData.email || !formData.organization_id) {
                alert("Please fill all required fields before saving.");
                return;
            }

            try {
                const response = await createCandidateUser(formData);

                // ✅ Simple popup with returned code and password
                alert(`✅ Candidate created successfully!\n\nUser Code: ${response.code}\nPassword: ${response.password}`);

                // Optionally close the popup after success
                setAddCandidatePageStatus(false);
            } catch (error) {
                console.error("❌ Error creating candidate:", error);
                alert(`Failed to create candidate: ${error.response?.data?.message || "Server error"}`);
            }
        };

        return (
            <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
                <div className="relative bg-white w-full max-w-2xl rounded-xl shadow-lg p-6 overflow-y-auto max-h-[90vh]">
                    {/* Close Button */}
                    <button
                        onClick={() => setAddCandidatePageStatus(false)}
                        className="absolute top-3 right-3 text-gray-700 hover:text-black"
                    >
                        <FontAwesomeIcon icon={faXmark} size="xl" />
                    </button>

                    <h2 className="text-center text-lg font-bold mb-4 text-[#0a183d]">
                        إضافة مرشح جديد
                    </h2>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 text-sm">
                        <input name="id_number" placeholder="رقم القومي" value={formData.id_number} onChange={handleChange} className="text-end border rounded-md p-2" />
                        <input name="name" placeholder="الاسم" value={formData.name} onChange={handleChange} required className="text-end border rounded-md p-2" />

                        <input name="passport_number" placeholder="رقم الجواز السفر" value={formData.passport_number} onChange={handleChange} className="text-end border rounded-md p-2" />
                        <input name="email" type="email" placeholder="البريد الإلكتروني" value={formData.email} onChange={handleChange} className="text-end border rounded-md p-2" />

                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full text-end border rounded-md p-2 bg-white"
                            required
                        >
                            <option value="">اختر الفئة</option>
                            <option value="تجارة">تجارة</option>
                            <option value="سباكة">سباكة</option>
                            <option value="كهرباء">كهرباء</option>
                            <option value="طاقة شمسية">طاقة شمسية</option>
                            <option value="خراطة">خراطة</option>
                            <option value="أجهزة منزلية">أجهزة منزلية</option>
                        </select>
                        <select
                            name="organization_id"
                            value={formData.organization_id}
                            onChange={handleChange}
                            className="w-full text-end border rounded-md p-2 bg-white"
                            required
                        >
                            <option value="">اختر الجهة</option>
                            {vtcs.map(org => (
                                <option key={org.id} value={org.id}>
                                    {org.name}
                                </option>
                            ))}
                        </select>

                        <input name="recommended_country" placeholder="الدولة الموصى بها" value={formData.recommended_country} onChange={handleChange} className="text-end border rounded-md p-2" />
                        <input name="phone_number" placeholder="رقم الهاتف" value={formData.phone_number} onChange={handleChange} className="text-end border rounded-md p-2" />

                        <label className="col-span-2 text-xs text-gray-500 mt-2">
                            مواعيد الاختبارات:
                        </label>

                        <div className="col-span-2 grid grid-cols-2 gap-4 mt-2 text-end">
                            <div className="flex flex-col">
                                <label htmlFor="self_test_date" className="text-xs font-semibold text-gray-600 mb-1">
                                    توقيت اختبار القدرات المعرفية (CAT)
                                </label>
                                <input
                                    id="self_test_date"
                                    name="self_test_date"
                                    type="date"
                                    value={formData.self_test_date}
                                    onChange={handleChange}
                                    className="border rounded-md p-2 text-end"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="personal_test_date" className="text-xs font-semibold text-gray-600 mb-1">
                                    توقيت اختبار السمات الشخصية (OCEAN)
                                </label>
                                <input
                                    id="personal_test_date"
                                    name="personal_test_date"
                                    type="date"
                                    value={formData.personal_test_date}
                                    onChange={handleChange}
                                    className="border rounded-md p-2 text-end"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="theory_test_date" className="text-xs font-semibold text-gray-600 mb-1">
                                    توقيت اختبار المعارف الفنية (JCT)
                                </label>
                                <input
                                    id="theory_test_date"
                                    name="theory_test_date"
                                    type="date"
                                    value={formData.theory_test_date}
                                    onChange={handleChange}
                                    className="border rounded-md p-2 text-end"
                                />
                            </div>
                        </div>

                        <div className="col-span-2 flex justify-center mt-4">
                            <button
                                type="submit"
                                className="bg-[#0a183d] hover:bg-[#15285e] text-white px-6 py-2 rounded-md font-bold transition"
                            >
                                حفظ المرشح
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

    return (
        <>
            <NewNavbar
                shareStatus={false}
            >
                <div className="flex gap-3">
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
                        title="QRCode Scan"
                    >
                        <FontAwesomeIcon
                            icon={faPen}
                            className="text-xl text-watomsBlue"
                        />
                    </button>
                    <button
                        className="rounded-full w-10 h-10 flex justify-center items-center bg-white/80 hover:bg-gray-200 shadow transition-all"
                        title="Add New Candidate"
                        onClick={() => setAddCandidatePageStatus(true)}
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
                    <button onClick={() => navigate('/watoms/pe/personal-test')} className="w-[90%] h-[12%] flex flex-col justify-center items-center text-yellow-400  text-sm text-center bg-[#0a183d] hover:bg-gray-500 px-2 rounded-xl border-blue-600 border-2">اختبار السمات الشخصية و السلوكية<p>OCEAN</p></button>
                    <button onClick={() => navigate('/watoms/pe/theoretical-test')} className="w-[90%] h-[12%] flex flex-col justify-center items-center text-yellow-400  text-sm text-center bg-[#0a183d] hover:bg-gray-500 px-2 rounded-xl border-blue-600 border-2">اختبار المعارف الفنية المتخصص <p>JCT</p></button>
                    <button onClick={() => navigate('/watoms/pe/practical-test')} className="w-[90%] h-[12%] flex flex-col justify-center items-center text-yellow-400  text-sm text-center bg-[#0a183d] hover:bg-gray-500 px-2 rounded-xl border-blue-600 border-2">اختبار المهارات الفنية المتخصصة<p>PST</p></button>
                    <button onClick={() => navigate('/watoms/pe/soft-test')} className="w-[90%] h-[12%] flex flex-col justify-center items-center text-yellow-400  text-sm text-center bg-[#0a183d] hover:bg-gray-500 px-2 rounded-xl border-blue-600 border-2">اختبار المهارات الوظيفية الناعمة<p>SJT</p></button>
                    <button onClick={() => navigate('/watoms/pe/cognitive-test')} className="w-[90%] h-[12%] flex flex-col justify-center items-center text-yellow-400  text-sm text-center bg-[#0a183d] hover:bg-gray-500 px-2 rounded-xl border-blue-600 border-2">اختبار القدرات المعرفية الاساسية<p>CAT</p></button>
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
                            <div className="w-full flex justify-center gap-2 mt-6">
                                <div className="w-[40%] flex flex-col gap-1">
                                    <div className="flex gap-1">
                                        <div className="w-3/5 text-center bg-white rounded border-white border-2">مركز الشرابية</div>
                                        <div className="w-2/5 text-center text-white rounded border-white border-2">مركز الاختبار</div>
                                    </div>
                                    <div className="flex gap-1">
                                        <div className="w-3/5 text-center bg-white rounded border-white border-2">تجارة (1)</div>
                                        <div className="w-2/5 text-center text-white rounded border-white border-2">الفئة</div>
                                    </div>
                                    <div className="flex gap-1">
                                        <div className="w-3/5 text-center bg-white rounded border-white border-2">74211</div>
                                        <div className="w-2/5 text-center text-white rounded border-white border-2">رقم الممتحن</div>
                                    </div>
                                    <div className="flex gap-1">
                                        <div className="w-3/5 text-center bg-white rounded border-white border-2">0110659889</div>
                                        <div className="w-2/5 text-center text-white rounded border-white border-2">رقم الموبيل</div>
                                    </div>
                                </div>
                                <div className="w-[40%] flex flex-col gap-1">
                                    <div className="flex gap-1">
                                        <div className="w-3/5 text-center bg-white rounded border-white border-2">محمد احمد سيد محمد</div>
                                        <div className="w-2/5 text-center text-white rounded border-white border-2">الاسم</div>
                                    </div>
                                    <div className="flex gap-1">
                                        <div className="w-3/5 text-center bg-white rounded border-white border-2">52841342967245</div>
                                        <div className="w-2/5 text-center text-white rounded border-white border-2">الرقم القومي</div>
                                    </div>
                                    <div className="flex gap-1">
                                        <div className="w-3/5 text-center bg-white rounded border-white border-2">284-87197187</div>
                                        <div className="w-2/5 text-center text-white rounded border-white border-2">رقم جواز السفر</div>
                                    </div>
                                    <div className="flex gap-1">
                                        <div className="w-3/5 text-center bg-white rounded border-white border-2">test@gmail.com</div>
                                        <div className="w-2/5 text-center text-white rounded border-white border-2">البريد الالكتروني</div>
                                    </div>
                                </div>
                                <div className="w-[19%] flex justify-center items-center">
                                    <img className="w-[75%] rounded-xl" src={person} alt="" />
                                </div>
                            </div>
                            <div className="w-full flex gap-2">
                                {/* passport */}
                                <img className="rounded-xl w-[73%]" src={passport} alt="" />
                                {/* dates */}
                                <div className="w-[25%] flex flex-col gap-4">
                                    <div className="flex flex-col gap-1">
                                        <div className="w-full text-center text-white rounded border-white border-2">الدولة المرشح لها المتقدم</div>
                                        <div className="w-full text-center bg-white rounded border-white border-2 py-2">السعودية</div>
                                    </div>
                                    <div className="w-full h-0 border-b-2 border-white" />
                                    <div className="flex flex-col gap-1">
                                        <div className="w-full text-center text-white rounded border-white border-2">توقيت اختبار النفسي</div>
                                        <div className="w-full text-center bg-white rounded border-white border-2 py-2">26-10-2025 19:46</div>
                                    </div>
                                    <div className="w-full h-0 border-b-2 border-white" />
                                    <div className="flex flex-col gap-1">
                                        <div className="w-full text-center text-white rounded border-white border-2">توقيت اختبار الشخصي</div>
                                        <div className="w-full text-center bg-white rounded border-white border-2 py-2">26-10-2025 19:46</div>
                                    </div>
                                    <div className="w-full h-0 border-b-2 border-white" />
                                    <div className="flex flex-col gap-1">
                                        <div className="w-full text-center text-white rounded border-white border-2">توقيت اختبار النظري</div>
                                        <div className="w-full text-center bg-white rounded border-white border-2 py-2">26-10-2025 19:46</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {addCandidatePageStatus && <AddCandidatePage />}
        </>
    )
}

export default WatomsProfessionalExamination;