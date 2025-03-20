import { createContext, useContext, useEffect, useState } from "react";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => { //true for english, false for arabic
    // Load from localStorage on first load
    const storedLang = localStorage.getItem("language");
    return storedLang === null ? true : storedLang === "true";
  });

  // Save to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

// Custom hook for easy use
export function useLanguage() {
  return useContext(LanguageContext);
}