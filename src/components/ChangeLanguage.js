import { useLanguage } from "../context/LanguageContext";
import ChangeLanguageBtn from "../styles/ChangeLanguageBtn.module.css";

export default function ChangeLanguage({ additionalCSS = "" }) {
  const { language, setLanguage } = useLanguage();

  return (
    <div>
      <button type="button" className={`${ChangeLanguageBtn.language} ${additionalCSS}`} onClick={() => setLanguage(!language)}>
          {language ? "AR" : "EN"}
        </button>
    </div>
  );
}