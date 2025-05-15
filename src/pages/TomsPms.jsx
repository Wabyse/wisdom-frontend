import { useState, useEffect, useRef } from "react";
import "../styles/Pms.css";
import { useNavigate, Navigate, useLocation } from "react-router-dom";
import { fetchForms } from "../services/pms";
import CollapsibleSection from "../components/CollapsibleSection";
import Navbar2 from "../components/Navbar2";
import { useAuth } from "../context/AuthContext";
import LoadingScreen from "../components/LoadingScreen";
import { PMS_DISCREPTION, WATOMS_PMS_FORMS_LOGOS, WATOMS_PMS_FORMS_ORDER, WATOMS_PMS_HERO_INFO, WATOMS_PMS_LIST, WATOMS_PMS_ROLE_PERMISSION } from "../constants/constants";

const TomsPms = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [forms, setForms] = useState([]);
  const [pd, setPd] = useState([]);
  const [dailyOperations, setDailyOperations] = useState([]);
  const { userInfo } = useAuth();
  const [hoveredButtonId, setHoveredButtonId] = useState(null);
  const [openUpwardButtonId, setOpenUpwardButtonId] = useState(null);
  const buttonsRefs = useRef({});

  const navigate = useNavigate(); //for navigate to another page (component)

  const handleHover = (id, length) => {
    const button = buttonsRefs.current[id];
    if (button) {
      const rect = button.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;

      if (spaceBelow < 200 && spaceAbove > spaceBelow && length !== 1) {
        setOpenUpwardButtonId(id); // Open upward
      } else {
        setOpenUpwardButtonId(null); // Open downward
      }
    }
    setHoveredButtonId(id);
  };

  const handleLeave = () => {
    setHoveredButtonId(null);
    setOpenUpwardButtonId(null);
  };


  const handleClick = (id, ar_name, code, reviewee) => {
    navigate(`/watoms/pms/form/${id}`, {
      state: { formArName: ar_name, code: code, reviewee },
    });
  };

  const handleTraineeAbsenceClick = () => {
    navigate(`/watoms/pms/trainee-absence`);
  };

  const handleInistituteIncidentClick = () => {
    navigate(`/watoms/pms/inistitute-incident`);
  };

  const handleInterviewClick = () => {
    navigate(`/watoms/pms/interview`);
  };

  const handleTestClick = () => {
    navigate(`/watoms/pms/test`);
  };

  useEffect(() => {
    const loadForms = async () => {
      try {
        const rawData = await fetchForms(userInfo);
        const filtertomsForms = rawData.filter(
          (filter) =>
            filter.type !== "360 Individual Assessment" &&
            filter.type !== "360 Curriculum Assessment" &&
            filter.type !== "normal"
        );

        const groupedData = [];

        filtertomsForms.forEach((item) => {
          const codeKey2 = item.code.split(" | ")[1];
          const codePermission = item.code.split(" | ")[0];
          const codePermission2 = WATOMS_PMS_ROLE_PERMISSION[codePermission] || null;
          const codeKey = WATOMS_PMS_LIST[codeKey2] || null;
          const codeKey3 = WATOMS_PMS_ROLE_PERMISSION[codeKey2] || null;

          if (codePermission2 === userInfo.user_role || (codePermission2 === "Self" && codeKey3 === userInfo.user_role) || userInfo.user_role === "Operations Excellence Lead" || (codePermission === "MGR" && userInfo.user_role === "Manager") || (codePermission === "AD" && userInfo.user_role === "ADMIN") || (codePermission === "T" && userInfo.user_role === "Teacher") || (codePermission === "OEL" && userInfo.user_role === "Operations Excellence Lead") || (codePermission === "TR" && userInfo.user_role === "Student")) {
            let existingGroup = groupedData.find(
              (group) => group.code === codeKey
            );

            if (!existingGroup) {
              existingGroup = {
                id: item.id,
                code: codeKey,
                reviewee: codeKey3,
                forms: [],
              };
              groupedData.push(existingGroup);
            }

            existingGroup.forms.push({
              id: item.id,
              ar_name: item.ar_name,
              permission: codePermission2,
            });
          }
        });

        const generalForms = groupedData.filter(
          (filteredData) => filteredData.code !== "التنمية المهنية"
        );
        const filteredGeneralForms = generalForms.filter(
          (filteredData) => filteredData.code !== "Daily Operations"
        );
        const filter1 = groupedData.filter(
          (testData) => testData.code === "التنمية المهنية"
        );
        const filter2 = groupedData.filter(
          (testData) => testData.code === "Daily Operations"
        );
        const newForms = WATOMS_PMS_FORMS_ORDER.map((id) => filteredGeneralForms[id]).filter((f) => f !== undefined);
        setForms(newForms);
        setPd(filter1);
        setDailyOperations(filter2);
      } catch (err) {
        console.error("API Error:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadForms();
  }, [userInfo]);

  if (loading) return <LoadingScreen />;
  if (error?.status === 403) return <Navigate to="/login" state={{ from: location }} replace />;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <Navbar2 showNavigate={false} img={WATOMS_PMS_HERO_INFO} Page="PMS" description={PMS_DISCREPTION}>
        <ul className="hidden md:grid md:grid-cols-1 md:auto-rows-fr list-none md:text-start text-center md:h-[80vh]">
          {pd.length > 0 || userInfo.user_role === "Manager" || userInfo.user_role === "Operations Excellence Lead" || userInfo.user_role === "Trainer" || userInfo.user_role === "Teacher" ? <li
            key="PD"
            className="m-2 relative hover:text-lg hover:text-wisdomLightOrange text-black group md:border-0 md:p-0 p-2 border-b-2 text-end border-black"
          >
            <button
              className="font-bold"
            >
              التنمية المهنية
              {WATOMS_PMS_FORMS_LOGOS[10]}
            </button>

            <ul className="hidden group-hover:block absolute top-0 right-full list-none p-0 shadow-md shadow-black/10 rounded min-w-[400px] z-50">
              {userInfo.user_role === "Manager" || userInfo.user_role === "Operations Excellence Lead" ? <li
                key="Interview"
                className="dropdown-item text-base"
                onClick={() => handleInterviewClick()}
              >
                مقابلات شخصية
              </li> : null}
              {userInfo.user_role === "Trainer" || userInfo.user_role === "Teacher" || userInfo.user_role === "Operations Excellence Lead" ? <li
                key="test"
                className="dropdown-item text-base"
                onClick={() => handleTestClick()}
              >
                إختبار تربوي
              </li> : null}
              {pd.map((type) =>
                type.forms.map((form) => (
                  <li
                    key={form.id}
                    className="dropdown-item text-base"
                    onClick={() => handleClick(form.id, form.ar_name, form.permission, type.reviewee)}
                  >
                    {form.ar_name}
                  </li>
                ))
              )}
            </ul>
          </li> : null}
          {(userInfo.user_role === "Trainer" || userInfo.user_role === "Operations Excellence Lead") ?
            <li
              key="Daily Operations"
              className="m-2 relative group md:border-0 md:p-0 hover:text-lg hover:text-wisdomLightOrange text-black p-2 border-b-2 text-end border-black"
            >
              <button
                className="font-bold"
              >
                الأشراف اليومي
                {WATOMS_PMS_FORMS_LOGOS[11]}
              </button>
              <ul className="hidden group-hover:block absolute top-0 right-full list-none p-0 shadow-md shadow-black/10 rounded min-w-[400px] z-50">
                {userInfo.user_role === "Trainer" || userInfo.user_role === "Operations Excellence Lead" ?
                  <>
                    <li
                      key="Student Absence"
                      className="dropdown-item text-base"
                      onClick={() => handleTraineeAbsenceClick()}
                    >
                      غياب المتدرب
                    </li>
                    <li
                      key="School Incident"
                      className="dropdown-item text-base"
                      onClick={() => handleInistituteIncidentClick()}
                    >
                      وقائع المركز
                    </li>
                  </>
                  : null}
              </ul>
            </li>
            : null}
          {forms.map((type, index) => (
            <li
              key={type.id}
              className="relative group hover:text-lg hover:text-wisdomLightOrange text-black md:border-0 md:p-0 p-2 border-b-2 border-black m-2 text-end"
              onMouseEnter={() => handleHover(type.id, type.forms.length)}
              onMouseLeave={handleLeave}
              ref={(el) => (buttonsRefs.current[type.id] = el)}
            >
              <button className="font-bold">
                {type.code}
                {WATOMS_PMS_FORMS_LOGOS[WATOMS_PMS_FORMS_ORDER[index]]}
              </button>

              {hoveredButtonId === type.id && (
                <ul
                  className={`block absolute right-full list-none p-0 shadow-md shadow-black/10 rounded min-w-[400px] z-50 ${openUpwardButtonId === type.id ? "bottom-0" : "top-0"
                    }`}
                >
                  {type.forms.map((form) => (
                    <li
                      key={form.id}
                      className="dropdown-item text-base"
                      onClick={() => handleClick(form.id, form.ar_name, form.permission, type.reviewee)}
                    >
                      {form.ar_name}
                    </li>
                  ))}
                </ul>
              )}
            </li>

          ))}
        </ul>
        <ul className="md:hidden grid grid-cols-1 md:grid-cols-5 list-none p-[1%] m-[4%] shadow-lg shadow-black/30 md:text-start text-center">
          {forms.map((type) => (
            <div key={type.code} className="flex justify-center w-full">
              <CollapsibleSection title={type.code} language={false}>
                <div className="w-full text-center max-w-[600px]">
                  {type.forms.map((form) => (
                    <div key={form.id} className="w-full mb-4">
                      <button
                        className="text-[18px] w-full text-center"
                        onClick={() => handleClick(form.id, form.ar_name, form.permission, type.reviewee)}
                      >
                        {form.ar_name}
                      </button>
                    </div>
                  ))}
                </div>
              </CollapsibleSection>
            </div>
          ))}
          <div key="Daily Operations" className="flex justify-center w-full">
            <CollapsibleSection title="الأشراف اليومي" language={false}>
              <div className="w-full text-center max-w-[600px]">
                <div key="Student Absence" className="w-full mb-4">
                  <button
                    className="text-[18px] w-full text-center"
                    onClick={() => handleTraineeAbsenceClick()}
                  >
                    غياب المتدرب
                  </button>
                </div>
                <div key="School Incident" className="w-full mb-4">
                  <button
                    className="text-[18px] w-full text-center"
                    onClick={() => handleInistituteIncidentClick()}
                  >
                    وقائع المركز
                  </button>
                </div>
              </div>
              {dailyOperations.map((type) =>
                type.forms.map((form) => (
                  <div key={form.id} className="w-full mb-4">
                    <button
                      className="text-[18px] w-full text-center"
                      onClick={() => handleClick(form.id, form.ar_name, form.permission, type.reviewee)}
                    >
                      {form.ar_name}
                    </button>
                  </div>
                ))
              )}
            </CollapsibleSection>
          </div>
          <div key="PD" className="flex justify-center w-full">
            <CollapsibleSection title="التنمية المهنية" language={false}>
              <div className="w-full text-center max-w-[600px]">
                <div key="Interview" className="w-full mb-4">
                  <button
                    className="text-[18px] w-full text-center"
                    onClick={() => handleInterviewClick()}
                  >
                    مقابلات شخصية
                  </button>
                </div>
                <div key="test" className="w-full mb-4">
                  <button
                    className="text-[18px] w-full text-center"
                    onClick={() => handleTestClick()}
                  >
                    إختبار تربوي
                  </button>
                </div>
              </div>
              {pd.map((type) =>
                type.forms.map((form) => (
                  <div key={form.id} className="w-full mb-4">
                    <button
                      className="text-[18px] w-full text-center"
                      onClick={() => handleClick(form.id, form.ar_name, form.permission, type.reviewee)}
                    >
                      {form.ar_name}
                    </button>
                  </div>
                ))
              )}
            </CollapsibleSection>
          </div>
        </ul>
      </Navbar2>
    </>
  );
};

export default TomsPms;