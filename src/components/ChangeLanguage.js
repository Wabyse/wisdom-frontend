import { useLanguage } from "../context/LanguageContext";
// import ChangeLanguageBtn from "../styles/ChangeLanguageBtn.module.css";

export default function ChangeLanguage({ additionalCSS = "" }) {
  const { language, setLanguage } = useLanguage();

  return (
    <div>
      <button type="button" className={`px-5 py-2 mr-[2%] rounded cursor-pointer bg-gray-700 text-white hover:bg-gray-300 hover:text-black ${additionalCSS}`} onClick={() => setLanguage(!language)}>
          {language ? "AR" : "EN"}
        </button>
    </div>
  );
}