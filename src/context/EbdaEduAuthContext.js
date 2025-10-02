import { createContext, useContext, useState, useEffect } from "react";

const EbdaEduAuthContext = createContext();

export const EbdaEduAuthProvider = ({ children }) => {
  const [ebdaEduCode, setEbdaEduCode] = useState(() => {
    const storedData = localStorage.getItem("ebdaEduAuthData");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      if (Date.now() > parsedData.expiry) {
        localStorage.removeItem("ebdaEduAuthData");
        return null;
      }
      return parsedData.ebdaEduCode;
    }
    return null;
  });

  const [ebdaEduInfo, setEbdaEduInfo] = useState(() => {
    const storedData = localStorage.getItem("ebdaEduAuthData");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      if (Date.now() > parsedData.expiry) {
        localStorage.removeItem("ebdaEduAuthData");
        return null;
      }
      return parsedData.ebdaEduInfo;
    }
    return null;
  });

  useEffect(() => {
    const storedData = localStorage.getItem("ebdaEduAuthData");

    if (storedData) {
      const parsedData = JSON.parse(storedData);
      const timeLeft = parsedData.expiry - Date.now();

      if (timeLeft > 0) {
        const timeoutId = setTimeout(() => {
          localStorage.removeItem("ebdaEduAuthData");
          setEbdaEduCode(null);
          setEbdaEduInfo(null);
          window.location.href = "/ebda-edu/login";
        }, timeLeft);

        return () => clearTimeout(timeoutId);
      } else {
        localStorage.removeItem("ebdaEduAuthData");
        setEbdaEduCode(null);
        setEbdaEduInfo(null);
        window.location.href = "/ebda-edu/login";
      }
    }
  }, []); // only runs on mount

  useEffect(() => {
    if (ebdaEduCode && ebdaEduInfo) {
      const expiryTime = Date.now() + 60 * 60 * 1000;
      const authData = { ebdaEduCode, ebdaEduInfo, expiry: expiryTime };
      localStorage.setItem("ebdaEduAuthData", JSON.stringify(authData));
    } else {
      localStorage.removeItem("ebdaEduAuthData");
    }
  }, [ebdaEduCode, ebdaEduInfo]);

  const logout = () => {
    localStorage.removeItem("ebdaEduAuthData");
        setEbdaEduCode(null);
        setEbdaEduInfo(null);
    window.location.href = "/ebda-edu/login";
  };

  return (
    <EbdaEduAuthContext.Provider value={{ ebdaEduCode, setEbdaEduCode, ebdaEduInfo, setEbdaEduInfo, logout }}>
      {children}
    </EbdaEduAuthContext.Provider>
  );
};

export const useEbdaEduAuth = () => useContext(EbdaEduAuthContext);