import React, { createContext, useState } from "react";

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [language, setLanguage] = useState({ status: true });

  return (
    <GlobalContext.Provider value={{ language, setLanguage }}>
      {children}
    </GlobalContext.Provider>
  );
};
