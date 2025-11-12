import { BrowserRouter as Router, Routes } from "react-router-dom";
import { EbdaEduRoutes } from "./routes/EbdaEduRoutes";
import { EbdaEduSystemRoutes } from "./routes/EbdaEduSystem";
import { NeqatyRoutes } from "./routes/NeqatyRoutes";
import { WisdomRoutes } from "./routes/WisdomRoutes";
import { Toaster } from "react-hot-toast";
import { WatomsRoutes } from "./routes/WatomsRoutes";
import { WabysRoutes } from "./routes/WabysRoutes";

function App() {
  return (
    <div className="font-sans">
      {/* Global Toaster */}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#0a183d",
            color: "#fff",
            fontSize: "0.9rem",
          },
        }}
      />
      <Router>
        <Routes>
          {/* Ebda Edu's main website */}
          {EbdaEduRoutes()}
          {/* Ebda Edu's main system */}
          {EbdaEduSystemRoutes()}
          {/* Neqaty's system */}
          {NeqatyRoutes()}
          {/* Wabys' system */}
          {WabysRoutes()}
          {/* Wisdom's system */}
          {WisdomRoutes()}
          {/* Watoms' system */}
          {WatomsRoutes()}
        </Routes>
      </Router>
    </div>
  );
}

export default App;