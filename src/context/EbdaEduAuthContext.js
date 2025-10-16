import { createContext, useContext, useState, useEffect } from "react";

const EbdaEduAuthContext = createContext();

export const EbdaEduAuthProvider = ({ children }) => {
  const [ebdaToken, setEbdaToken] = useState(() => {
    const storedData = localStorage.getItem("ebdaEduAuthData");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      if (Date.now() > parsedData.expiry) {
        localStorage.removeItem("ebdaEduAuthData");
        return null;
      }
      return parsedData.ebdaToken;
    }
    return null;
  });

  const [ebdaUserInfo, setEbdaUserInfo] = useState(() => {
    const storedData = localStorage.getItem("ebdaEduAuthData");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      if (Date.now() > parsedData.expiry) {
        localStorage.removeItem("ebdaEduAuthData");
        return null;
      }
      return parsedData.ebdaUserInfo;
    }
    return null;
  });

  // Handle expiry and auto logout
  useEffect(() => {
    const storedData = localStorage.getItem("ebdaEduAuthData");

    if (storedData) {
      const parsedData = JSON.parse(storedData);
      const timeLeft = parsedData.expiry - Date.now();

      if (timeLeft > 0) {
        const timeoutId = setTimeout(() => {
          localStorage.removeItem("ebdaEduAuthData");
          setEbdaToken(null);
          setEbdaUserInfo(null);
          window.location.href = "/login";
        }, timeLeft);

        return () => clearTimeout(timeoutId);
      } else {
        localStorage.removeItem("ebdaEduAuthData");
        setEbdaToken(null);
        setEbdaUserInfo(null);
        window.location.href = "/login";
      }
    }
  }, []); // run once on mount

  // Save new token & info to localStorage with expiry
  useEffect(() => {
    if (ebdaToken && ebdaUserInfo) {
      const expiryTime = Date.now() + 60 * 60 * 1000; // 1 hour
      const authData = { ebdaToken, ebdaUserInfo, expiry: expiryTime };
      localStorage.setItem("ebdaEduAuthData", JSON.stringify(authData));
    } else {
      localStorage.removeItem("ebdaEduAuthData");
    }
  }, [ebdaToken, ebdaUserInfo]);

  const logout = () => {
    localStorage.removeItem("ebdaEduAuthData");
    setEbdaToken(null);
    setEbdaUserInfo(null);
    window.location.href = "/login";
  };

  return (
    <EbdaEduAuthContext.Provider
      value={{ ebdaToken, setEbdaToken, ebdaUserInfo, setEbdaUserInfo, logout }}
    >
      {children}
    </EbdaEduAuthContext.Provider>
  );
};

export const useEbdaEduAuth = () => useContext(EbdaEduAuthContext);