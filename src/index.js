import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { AuthProvider } from "./context/AuthContext";
import { GlobalProvider } from "./context/GlobalContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AuthProvider>
    <GlobalProvider>
      <App />
    </GlobalProvider>
  </AuthProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
