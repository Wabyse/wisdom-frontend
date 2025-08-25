import { useLanguage } from "../context/LanguageContext";

const Uploading = () => {
    const { language } = useLanguage();
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 z-0 bg-black/50 backdrop-blur-sm pointer-events-none" />

            <button
                type="button"
                className="relative z-10 inline-flex items-center gap-2 rounded-md bg-wisdomOrange px-4 py-2 text-white shadow disabled:opacity-80"
                disabled
            >
                <svg
                    className="h-10 w-10 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    />
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                </svg>
                {language ? "Please Wait" : "برجاء الانتظار"}
            </button>
        </div>
    )
}

export default Uploading;