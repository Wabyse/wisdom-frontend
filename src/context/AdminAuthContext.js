import { createContext, useContext, useState, useEffect } from "react";

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [adminToken, setAdminToken] = useState(() => {
    const storedData = localStorage.getItem("adminAuthData");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      if (Date.now() > parsedData.expiry) {
        localStorage.removeItem("adminAuthData");
        return null;
      }
      return parsedData.token;
    }
    return null;
  });

  const [adminInfo, setAdminInfo] = useState(() => {
    const storedData = localStorage.getItem("adminAuthData");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      if (Date.now() > parsedData.expiry) {
        localStorage.removeItem("adminAuthData");
        return null;
      }
      return parsedData.adminInfo;
    }
    return null;
  });

  useEffect(() => {
    const storedData = localStorage.getItem("adminAuthData");

    if (storedData) {
      const parsedData = JSON.parse(storedData);
      const timeLeft = parsedData.expiry - Date.now();

      if (timeLeft > 0) {
        const timeoutId = setTimeout(() => {
          localStorage.removeItem("adminAuthData");
          setAdminToken(null);
          setAdminInfo(null);
          window.location.href = "/neqaty/login";
        }, timeLeft);

        return () => clearTimeout(timeoutId);
      } else {
        localStorage.removeItem("adminAuthData");
        setAdminToken(null);
        setAdminInfo(null);
        window.location.href = "/neqaty/login";
      }
    }
  }, []);

  useEffect(() => {
    if (adminToken && adminInfo) {
      const expiryTime = Date.now() + 60 * 60 * 1000;
      const authData = { token: adminToken, adminInfo, expiry: expiryTime };
      localStorage.setItem("adminAuthData", JSON.stringify(authData));
    } else {
      localStorage.removeItem("adminAuthData");
    }
  }, [adminToken, adminInfo]);

  return (
    <AdminAuthContext.Provider value={{ adminToken, setAdminToken, adminInfo, setAdminInfo }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AdminAuthContext);