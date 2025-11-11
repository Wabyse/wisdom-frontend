import { Route } from "react-router-dom";
import Home from "../pages/Home";
import HomeServicesTraining from "../pages/HomeServicesTraining";
import HomeEVOTS from "../pages/HomeEVOTS";
import HomeCareers from "../pages/HomeCareers";
import HomeAboutUs from "../pages/HomeAboutUs";
import HomeContactUs from "../pages/HomeContactUs";
import WatomsTraineesRegistration from "../pages/WatomsTraineesRegistration";

export const EbdaEduRoutes = () => [
    <Route path="/" element={<Home />} />,
    <Route path="/services/training" element={<HomeServicesTraining />} />,
    <Route path="/evots" element={<HomeEVOTS />} />,
    <Route path="/careers" element={<HomeCareers />} />,
    <Route path="/aboutus" element={<HomeAboutUs />} />,
    <Route path="/contactus" element={<HomeContactUs />} />,
    <Route path="/vtc-trainees-registration" element={<WatomsTraineesRegistration />} />,
];