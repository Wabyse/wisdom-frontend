import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userCode, setUserCode] = useState(() => {
    const storedData = localStorage.getItem("authData");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      if (Date.now() > parsedData.expiry) {
        localStorage.removeItem("authData");
        return null;
      }
      return parsedData.userCode;
    }
    return null;
  });

  const [userInfo, setUserInfo] = useState(() => {
    const storedData = localStorage.getItem("authData");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      if (Date.now() > parsedData.expiry) {
        localStorage.removeItem("authData");
        return null;
      }
      return parsedData.userInfo;
    }
    return null;
  });

  useEffect(() => {
    const storedData = localStorage.getItem("authData");

    if (storedData) {
      const parsedData = JSON.parse(storedData);
      const timeLeft = parsedData.expiry - Date.now();

      if (timeLeft > 0) {
        const timeoutId = setTimeout(() => {
          localStorage.removeItem("authData");
          setUserCode(null);
          setUserInfo(null);
          window.location.href = "/login";
        }, timeLeft);

        return () => clearTimeout(timeoutId);
      } else {
        localStorage.removeItem("authData");
        setUserCode(null);
        setUserInfo(null);
        window.location.href = "/login";
      }
    }
  }, []); // only runs on mount

  useEffect(() => {
    if (userCode && userInfo) {
      const expiryTime = Date.now() + 60 * 60 * 1000;
      const authData = { userCode, userInfo, expiry: expiryTime };
      localStorage.setItem("authData", JSON.stringify(authData));
    } else {
      localStorage.removeItem("authData");
    }
  }, [userCode, userInfo]);

  return (
    <AuthContext.Provider value={{ userCode, setUserCode, userInfo, setUserInfo }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);