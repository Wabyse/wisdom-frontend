import { useEffect, useState } from "react";
import { fetchSchools } from "../services/data";
import { insertNews } from "../services/admins";
import DenyAccessPage from "../components/DenyAccessPage";
import { useAuth } from "../context/AuthContext";

const WatomsPublishNews = () => {
    const { userInfo } = useAuth();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [image, setImage] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [organization, setOrganization] = useState(""); // new dropdown state
    const [vtcs, setVtcs] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const loadVtcs = async () => {
            const response = await fetchSchools();
            setVtcs(response);
        }
        loadVtcs();
    }, [])

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setImage(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!imageFile) {
            alert("الرجاء اختيار صورة");
            return;
        }

        setIsSubmitting(true);
        
        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('description', description);
            formData.append('date', date);
            formData.append('organization_id', Number(organization));
            formData.append('image', imageFile);
            await insertNews(formData);
            alert("تم نشر الخبر بنجاح!");
            
            // Reset form
            setTitle("");
            setDescription("");
            setDate("");
            setImage(null);
            setImageFile(null);
            setOrganization("");
            
        } catch (error) {
            console.error("Error submitting news:", error);
            alert("حدث خطأ أثناء نشر الخبر");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (userInfo?.code === 1475) return <DenyAccessPage homePage='/watoms/news' />;
    if (userInfo?.code === 1310) return <DenyAccessPage homePage='/wisdom/dashboard' />;

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-900">
            <form
                onSubmit={handleSubmit}
                className="bg-gray-800 p-6 rounded-2xl shadow-lg w-full max-w-md flex flex-col gap-4"
            >
                <h1 className="text-2xl font-bold text-yellow-400 text-center">
                    نشر اخبار مشروع واتمز
                </h1>

                {/* Title */}
                <div>
                    <label className="block text-gray-300 mb-1 text-end">العنوان</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-2 rounded-lg border border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 text-end"
                        placeholder="ادخل العنوان"
                        required
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block text-gray-300 mb-1 text-end">التفاصيل</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows="3"
                        className="w-full p-2 rounded-lg border border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 text-end"
                        placeholder="ادخل التفاصيل"
                        required
                    />
                </div>

                {/* Date */}
                <div>
                    <label className="block text-gray-300 mb-1 text-end">التاريخ</label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full p-2 rounded-lg border border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        required
                    />
                </div>

                {/* Dropdown */}
                <div>
                    <label className="block text-gray-300 mb-1 text-end">القسم</label>
                    <select
                        value={organization}
                        onChange={(e) => setOrganization(e.target.value)}
                        className="w-full p-2 rounded-lg border border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 text-end"
                        required
                    >
                        <option value="" disabled>
                            اختر القسم
                        </option>
                        {vtcs.map(vtc => (
                            <option value={vtc.id}>{vtc.name}</option>
                        ))}
                    </select>
                </div>

                {/* Image Upload */}
                <div>
                    <label className="block text-gray-300 mb-1 text-end">رفع صورة</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full text-gray-300"
                        dir="rtl"
                    />
                    {image && (
                        <div className="mt-2 flex justify-center">
                            <img
                                src={image}
                                alt="Preview"
                                className="w-32 h-32 object-cover rounded-lg border border-gray-600"
                            />
                        </div>
                    )}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-yellow-400 text-black font-bold py-2 rounded-lg hover:bg-yellow-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? "جاري النشر..." : "نشر"}
                </button>
            </form>
        </div>
    );
}

export default WatomsPublishNews;