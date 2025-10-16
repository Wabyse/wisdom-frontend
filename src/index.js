import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { AuthProvider } from "./context/AuthContext";
import { LanguageProvider } from "./context/LanguageContext";
import '@fortawesome/fontawesome-svg-core/styles.css';
import { AdminAuthProvider } from "./context/AdminAuthContext";
import { EbdaEduAuthProvider } from "./context/EbdaEduAuthContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AuthProvider>
    <AdminAuthProvider>
      <EbdaEduAuthProvider>
        <LanguageProvider>
          <App />
        </LanguageProvider>
      </EbdaEduAuthProvider>
    </AdminAuthProvider>
  </AuthProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
