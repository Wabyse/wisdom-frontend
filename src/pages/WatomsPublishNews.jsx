import { useState } from "react";

const WatomsPublishNews = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [image, setImage] = useState(null);
    const [category, setCategory] = useState(""); // new dropdown state

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setImage(URL.createObjectURL(e.target.files[0]));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log({ title, description, date, image, category });
        alert("Form submitted!");
    };

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
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full p-2 rounded-lg border border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 text-end"
                        required
                    >
                        <option value="" disabled>
                            اختر القسم
                        </option>
                        <option value="1">القسم 1</option>
                        <option value="2">القسم 2</option>
                        <option value="3">القسم 3</option>
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
                    className="bg-yellow-400 text-black font-bold py-2 rounded-lg hover:bg-yellow-300 transition"
                >
                    نشر
                </button>
            </form>
        </div>
    );
}

export default WatomsPublishNews;