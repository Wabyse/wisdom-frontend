import { useEffect, useState } from "react";
import background from "../assets/registrationBackground.png";
import WatomsTraineesRegistrationNavbar from "../components/WatomsTraineeRegistrationNavbar";
import { fetchCurriculums, fetchSchools, insertTraineeForm } from "../services/data";
import { INSTITUTION_COURSE_RELATION, KNOWN_US, TRAINEES_CERTIFICATES } from "../constants/constants";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const WatomsTraineesRegistration = () => {
    const navigate = useNavigate();
    const [vtcs, setVtcs] = useState([]);
    const [courses, setCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [selectedFirstName, setSelectedFirstName] = useState("");
    const [selectedSecondName, setSelectedSecondName] = useState("");
    const [selectedThirdName, setSelectedThirdName] = useState("");
    const [selectedFourthName, setSelectedFourthName] = useState("");
    const [selectedVtc, setSelectedVtc] = useState("");
    const [selectedAge, setSelectedAge] = useState("");
    const [selectedCourse, setSelectedCourse] = useState("");
    const [selectedGov, setSelectedGov] = useState("");
    const [selectedCertificate, setSelectedCertificate] = useState("");
    const [selectedMail, setSelectedMail] = useState("");
    const [selectedSchool, setSelectedSchool] = useState("");
    const [selectedKnown, setSelectedKnown] = useState("");
    const [selectedNumber, setSelectedNumber] = useState("");
    const [selectedNotes, setSelectedNotes] = useState("");
    const [selectedWhatsapp, setSelectedWhatsapp] = useState("");

    const submitForm = async (e) => {
        e.preventDefault();
        if (!selectedFirstName || !selectedSecondName || !selectedThirdName || !selectedFourthName || !selectedVtc || !selectedAge || !selectedCourse || !selectedGov || !selectedCertificate || !selectedSchool || !selectedKnown || !selectedNumber || !selectedWhatsapp) {
            toast.error("الرجاء ملئ كل البيانات");
        }
        const formData = {
            first_name: selectedFirstName,
            second_name: selectedSecondName,
            third_name: selectedThirdName,
            fourth_name: selectedFourthName,
            birth_date: selectedAge,
            vtc: selectedVtc,
            gov: selectedGov,
            course: selectedCourse,
            email: selectedMail,
            certification: selectedCertificate,
            school: selectedSchool,
            known_us: selectedKnown,
            phone: selectedNumber,
            whatsapp: selectedWhatsapp,
            notes: selectedNotes ? selectedNotes : null
        }
        try {
            await insertTraineeForm(formData);
            toast.success('تم التسجيل');
            navigate('/')
        } catch (err) {
            console.error(err);
        }
    }

    const handleCourseClick = () => {
        if (!selectedVtc) {
            toast.error("الرجاء اختيار المركز اولا");
        }
    };

    useEffect(() => {
        const loadVtcs = async () => {
            try {
                const response = await fetchSchools();
                // const filteringVtcs = response.filter(vtc => vtc.authority_id === 2)
                // console.log(filteringVtcs)
                setVtcs(response);
            } catch (err) {
                console.error(err);
            }
        }

        const loadCourse = async () => {
            try {
                const response = await fetchCurriculums();
                setCourses(response);
            } catch (err) {
                console.error(err);
            }
        }

        loadVtcs();
        loadCourse();
    }, [])

    useEffect(() => {
        if (selectedVtc !== "") {
            const selectedCourses = INSTITUTION_COURSE_RELATION[selectedVtc];
            const filteringCourses = courses.filter(course => selectedCourses.includes(course.id))
            setFilteredCourses(filteringCourses);
        }
    }, [selectedVtc, courses])

    return (
        <div
            style={{
                backgroundImage: `url(${background})`,
                backgroundAttachment: "fixed",
                backgroundSize: "cover",
                backgroundPosition: "center",
                minHeight: "100vh",
            }}
        >
            <Toaster />
            {/* Navbar */}
            <WatomsTraineesRegistrationNavbar />
            {/* Main form */}
            <div className="flex justify-center gap-4">
                <form className="w-[80%] border-black border-2 rounded-3xl flex flex-col justify-center" onSubmit={submitForm}>
                    <div className="w-[89%] mt-2 flex flex-col self-center gap-2">
                        <label className="bg-gradient-to-b from-purple-900 to-purple-500 text-white rounded-xl w-full text-center py-2">اسم المتدرب رباعي</label>
                        <div className="w-full flex gap-2 md:flex-row flex-col">
                            <input type="text" className="bg-transparent py-2 border-purple-400 border-2 rounded-xl md:w-1/4 w-full text-sm text-center text-white" placeholder="الاسم العائلي" onChange={(e) => setSelectedFourthName(e.target.value)} />
                            <input type="text" className="bg-transparent py-2 border-purple-400 border-2 rounded-xl md:w-1/4 w-full text-sm text-center text-white" placeholder="اسم الجد" onChange={(e) => setSelectedThirdName(e.target.value)} />
                            <input type="text" className="bg-transparent py-2 border-purple-400 border-2 rounded-xl md:w-1/4 w-full text-sm text-center text-white" placeholder="اسم الاب" onChange={(e) => setSelectedSecondName(e.target.value)} />
                            <input type="text" className="bg-transparent py-2 border-purple-400 border-2 rounded-xl md:w-1/4 w-full text-sm text-center text-white" placeholder="الاسم الشخصي" onChange={(e) => setSelectedFirstName(e.target.value)} />
                        </div>
                    </div>
                    <div className="flex justify-evenly md:flex-row flex-col">
                        <div className="md:w-2/5 w-[90%] flex flex-col items-start mx-auto gap-2 p-2 min-h-fit">
                            <label className="bg-gradient-to-b from-purple-900 to-purple-500 text-white rounded-xl w-full text-center py-2">مركز التدريب المراد الالتحاق به</label>
                            <select id="vtc" name="vtc" className="text-center w-full rounded-xl bg-transparent h-10 border-purple-400 border-2 p-1 text-white" onChange={(e) => setSelectedVtc(e.target.value)}>
                                <option value="" disabled selected>
                                    الرجاء اختيار المركز
                                </option>
                                {vtcs.map((vtc) => (
                                    <option key={vtc.id} value={vtc.id} className="text-black">
                                        {vtc.name}
                                    </option>
                                ))}
                            </select>
                            <label className="bg-gradient-to-b from-purple-900 to-purple-500 text-white rounded-xl w-full text-center py-2">التخصص المطلوب</label>
                            <select id="course" name="course" className={`text-center w-full rounded-xl bg-transparent h-10 border-purple-400 border-2 p-1 text-white`} onChange={(e) => setSelectedCourse(e.target.value)} onClick={handleCourseClick}>
                                <option value="" disabled selected>
                                    الرجاء اختيار التخصص
                                </option>
                                {filteredCourses.map((course) => (
                                    <option key={course.id} value={course.id} className="text-black">
                                        {course.code}
                                    </option>
                                ))}
                            </select>
                            <label className="bg-gradient-to-b from-purple-900 to-purple-500 text-white rounded-xl w-full text-center py-2">المؤهل</label>
                            <select id="certificate" name="certificate" className="text-center w-full rounded-xl bg-transparent h-10 border-purple-400 border-2 p-1 text-white" onChange={(e) => setSelectedCertificate(e.target.value)}>
                                <option value="" disabled selected>
                                    الرجاء اختيار المؤهل
                                </option>
                                {TRAINEES_CERTIFICATES.map((certificate) => (
                                    <option key={certificate} value={certificate} className="text-black">
                                        {certificate}
                                    </option>
                                ))}
                            </select>
                            <label className="bg-gradient-to-b from-purple-900 to-purple-500 text-white rounded-xl w-full text-center py-2">عرفتنا منين</label>
                            <select id="knownus" name="knownus" className="text-center w-full rounded-xl bg-transparent h-10 border-purple-400 border-2 p-1 text-white" onChange={(e) => setSelectedKnown(e.target.value)}>
                                <option value="" disabled selected>
                                    كيف علمت بنا
                                </option>
                                {KNOWN_US.map((knownUs) => (
                                    <option key={knownUs} value={knownUs} className="text-black">
                                        {knownUs}
                                    </option>
                                ))}
                            </select>
                            <label className="bg-gradient-to-b from-purple-900 to-purple-500 text-white rounded-xl w-full text-center py-2">ملاحظات</label>
                            <input type="text" className="bg-transparent py-2 border-purple-400 border-2 rounded-xl w-full text-sm text-center" placeholder="ملاحظات" onChange={(e) => setSelectedNotes(e.target.value)} />
                        </div>
                        <div className="md:w-2/5 w-[90%] flex flex-col items-start mx-auto gap-2 p-2 min-h-fit">
                            <label className="bg-gradient-to-b from-purple-900 to-purple-500 text-white rounded-xl w-full text-center py-2">تاريخ ميلادك</label>
                            <input type="date" className="bg-transparent py-2 border-purple-400 border-2 rounded-xl w-full text-sm text-center text-white" placeholder="تاريخ ميلادك" onChange={(e) => setSelectedAge(e.target.value)} />
                            <label className="bg-gradient-to-b from-purple-900 to-purple-500 text-white rounded-xl w-full text-center py-2">المحافظة</label>
                            <input type="text" className="bg-transparent py-2 border-purple-400 border-2 rounded-xl w-full text-sm text-center" placeholder="المحافظة" onChange={(e) => setSelectedGov(e.target.value)} />
                            <label className="bg-gradient-to-b from-purple-900 to-purple-500 text-white rounded-xl w-full text-center py-2">البريد الالكتروني</label>
                            <input type="email" className="bg-transparent py-2 border-purple-400 border-2 rounded-xl w-full text-sm text-center" placeholder="البريد الالكتروني" onChange={(e) => setSelectedMail(e.target.value)} />
                            <label className="bg-gradient-to-b from-purple-900 to-purple-500 text-white rounded-xl w-full text-center py-2">{selectedCertificate ? selectedCertificate === "حاصل علي شهادة الاعدادية" || selectedCertificate === "حاصل علي شهادة الثانوية" ? "اسم المدرسة" : selectedCertificate === "طالب جامعي" || selectedCertificate === "حاصل علي شهادة جامعية" ? "اسم الجامعة" : "اسم الدبلوم" : "اسم المدرسة / الجامعة"}</label>
                            <input type="text" className="bg-transparent py-2 border-purple-400 border-2 rounded-xl w-full text-sm text-center" placeholder="اسم المدرسة / الجامعة" onChange={(e) => setSelectedSchool(e.target.value)} />
                            <label className="bg-gradient-to-b from-purple-900 to-purple-500 text-white rounded-xl w-full text-center py-2">رقم للتواصل تلفونيا</label>
                            <input type="text" className="bg-transparent py-2 border-purple-400 border-2 rounded-xl w-full text-sm text-center" placeholder="رقم للتواصل الكترونيا" onChange={(e) => setSelectedNumber(e.target.value)} />
                            <label className="bg-gradient-to-b from-purple-900 to-purple-500 text-white rounded-xl w-full text-center py-2">الواتساب</label>
                            <input type="text" className="bg-transparent py-2 border-purple-400 border-2 rounded-xl w-full text-sm text-center" placeholder="الواتساب" onChange={(e) => setSelectedWhatsapp(e.target.value)} />
                        </div>
                    </div>
                    <button type="submit" className="text-white bg-gradient-to-l from-purple-900 to-purple-500 hover:from-purple-500 hover:to-purple-900 rounded w-fit p-2 self-center mb-2">تسجيل</button>
                </form>
            </div>
        </div>
    );
};

export default WatomsTraineesRegistration;