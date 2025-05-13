import { useState, useEffect } from "react";
import "../styles/Pms.css";
import { useNavigate, Navigate, useLocation } from "react-router-dom";
import { fetchForms } from "../services/pms";
import { useLanguage } from "../context/LanguageContext";
import Navbar2 from "../components/Navbar2";
import CollapsibleSection from "../components/CollapsibleSection";
import { useAuth } from "../context/AuthContext";
import LoadingScreen from "../components/LoadingScreen";
import { WISDOM_PMS_AR_LIST, PMS_DISCREPTION, WISDOM_PMS_EN_LIST, WISDOM_PMS_FORMS_LOGOS, WISDOM_PMS_HERO_INFO, WISDOM_PMS_ROLE_PERMISSION, WSIDOM_PMS_FORMS_ORDER } from "../constants/constants";

const Pms = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [forms, setForms] = useState([]);
  const [pd, setPd] = useState([]);
  const [dailyOperations, setDailyOperations] = useState([]);
  const { language } = useLanguage();
  const { userInfo } = useAuth();

  const navigate = useNavigate(); //for navigate to another page (component)

  const handleClick = (id, en_name, ar_name, code, reviewee) => {
    navigate(`/pms/form/${id}`, {
      state: { formEnName: en_name, formArName: ar_name, lang: language, code, reviewee },
    });
  };

  const handleTeacherSubstitutionClick = () => {
    navigate(`/pms/teacher-substitutions`);
  };

  const handleTeacherLatnessClick = () => {
    navigate(`/pms/teacher-latness`);
  };

  const handleStudentAbsenceClick = () => {
    navigate(`/pms/student-absence`);
  };

  const handleSchoolIncidentClick = () => {
    navigate(`/pms/school-incident`);
  };

  const handleInterviewClick = () => {
    navigate(`/pms/interview`);
  };

  const handleStudentBehaviorClick = () => {
    navigate(`/pms/student-behavior`);
  };

  const handleTestClick = () => {
    navigate(`/pms/test`);
  };

  useEffect(() => {
    const loadForms = async () => {
      try {
        const rawData = await fetchForms(userInfo);
        const filtertomsForms = rawData.filter(
          (filter) =>
            filter.type !== "ClassRoom Observation" &&
            filter.type !== "curriculum" &&
            filter.type !== "normal2"
        );

        const groupedData = [];

        filtertomsForms.forEach((item) => {
          const codeKey2 = item.code.split(" | ")[1];
          const codePermission = item.code.split(" | ")[0];
          const codePermission2 = WISDOM_PMS_ROLE_PERMISSION[codePermission] || null;
          const codeKey = WISDOM_PMS_EN_LIST[codeKey2] || null;
          const codeAr = WISDOM_PMS_AR_LIST[codeKey2] || null;
          const codeKey3 = WISDOM_PMS_ROLE_PERMISSION[codeKey2] || null;
          if (codePermission2 === userInfo.user_role || (codePermission2 === "Employee" && userInfo.user_role !== "Student") || (codePermission2 === "Self" && codeKey === userInfo.user_role) || (codePermission2 === "Self" && codeKey === "Teacher" && userInfo.user_role === "Head of Department (HOD)") || (codePermission === "Cl" && userInfo.user_role === "Head of Department (HOD)") || userInfo.user_role === "Operations Excellence Lead") {
            let existingGroup = groupedData.find(
              (group) => group.code === codeKey
            );

            if (!existingGroup) {
              existingGroup = {
                id: item.id,
                code: codeKey,
                reviewee: codeKey3,
                codeAr: codeAr,
                forms: [],
              };
              console.log(codeKey)
              groupedData.push(existingGroup);
            }

            existingGroup.forms.push({
              id: item.id,
              en_name: item.en_name,
              ar_name: item.ar_name,
              permission: codePermission2,
            });
          }
        });

        const generalForms = groupedData.filter(
          (filteredData) => filteredData.code !== "PD"
        );
        const filteredGeneralForms = generalForms.filter(
          (filteredData) => filteredData.code !== "Daily Operations"
        );
        const filter1 = groupedData.filter(
          (testData) => testData.code === "PD"
        );
        const filter2 = groupedData.filter(
          (testData) => testData.code === "Daily Operations"
        );

        const newForms = WSIDOM_PMS_FORMS_ORDER
          .map((id) => filteredGeneralForms[id])
          .filter((f) => f !== undefined); // ✅ Prevent crash
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
      <Navbar2 showNavigate={true} img={WISDOM_PMS_HERO_INFO} length={userInfo.user_role === "Student" || userInfo.user_role === "Trainee" ? "w-[380px]" : "w-[520px]"} Page="PMS" description={PMS_DISCREPTION}>
        <ul
          className={`hidden md:grid md:grid-cols-1 md:auto-rows-fr list-none md:text-start ${language ? "text-start" : "text-end"} md:h-[85vh]`}
        >
          {userInfo.user_role === "Teacher" || userInfo.user_role === "Head of Department (HOD)" || userInfo.user_role === "Operations Excellence Lead" || userInfo.user_role === "Academic Principle" ? <li
            key="PD"
            className={`relative group md:border-0 md:p-0 hover:text-lg hover:text-wisdomLightOrange text-black p-2 border-b-2 ${language ? "text-start" : "text-end"
              } border-black m-2`}
          >
            <button className="font-bold">
              {language ? (
                <>{WISDOM_PMS_FORMS_LOGOS[9]} PD</>
              ) : (
                <>التنمية المهنية {WISDOM_PMS_FORMS_LOGOS[9]}</>
              )}
            </button>

            <ul className="hidden group-hover:block absolute top-0 right-full list-none p-0 shadow-md shadow-black/10 rounded min-w-[400px] z-[1000]">
              {userInfo.user_role === "Operations Excellence Lead" || userInfo.user_role === "Academic Principle" ?
                <><li
                  key="Interview"
                  className="p-2.5 text-black cursor-pointer bg-white border-t border-black hover:bg-white text-base"
                  onClick={() => handleInterviewClick()}
                >
                  {language ? "Interview" : "مقابلات شخصية"}
                </li>
                  <li
                    key="test"
                    className="p-2.5 text-black cursor-pointer bg-white border-t border-black hover:bg-white text-base"
                    onClick={() => handleTestClick()}
                  >
                    {language ? "Test" : "إختبار تربوي"}
                  </li></>
                : null}
              {pd.map((type) =>
                language
                  ? type.forms.map((form) => (
                    <li
                      key={form.id}
                      className="p-2.5 text-black cursor-pointer bg-white border-t border-black hover:bg-white text-base"
                      onClick={() =>
                        handleClick(form.id, form.en_name, form.ar_name, type.permission, type.reviewee)
                      }
                    >
                      {form.en_name}
                    </li>
                  ))
                  : type.forms.map((form) => (
                    <li
                      key={form.id}
                      className="p-2.5 text-black cursor-pointer bg-white border-t border-black hover:bg-white text-base"
                      onClick={() =>
                        handleClick(form.id, form.en_name, form.ar_name, type.permission, type.reviewee)
                      }
                    >
                      {form.ar_name}
                    </li>
                  ))
              )}
            </ul>
          </li> : null}
          {userInfo.user_role === "Supervisor" || userInfo.user_role === "Student Affairs Officer" || userInfo.user_role === "Operations Excellence Lead" ? <li
            key="Daily Operations"
            className={`relative group hover:text-lg hover:text-wisdomLightOrange text-black md:border-0 md:p-0 p-2 border-b-2 ${language ? "text-start" : "text-end"
              } border-black m-2`}
          >
            <button className="font-bold">
              {language ? (
                <>{WISDOM_PMS_FORMS_LOGOS[8]} Daily Operations</>
              ) : (
                <>الأشراف المدرسي {WISDOM_PMS_FORMS_LOGOS[8]}</>
              )}
            </button>

            <ul className="hidden group-hover:block absolute top-0 right-full list-none p-0 shadow-md shadow-black/10 rounded min-w-[400px] z-[1000]">
              {userInfo.user_role === "Supervisor" || userInfo.user_role === "Operations Excellence Lead" ? <>
                <li
                  key="Teacher Substitutions"
                  className="p-2.5 text-black cursor-pointer bg-white border-t border-black hover:bg-white text-base"
                  onClick={() => handleTeacherSubstitutionClick()}
                >
                  {language ? "Teacher Substitutions" : "الأحتياطي"}
                </li>
                <li
                  key="Teacher Latness"
                  className="p-2.5 text-black cursor-pointer bg-white border-t border-black hover:bg-white text-base"
                  onClick={() => handleTeacherLatnessClick()}
                >
                  {language ? "Teacher Latness" : "تأخير المعلم"}
                </li>
                <li
                  key="School Incident"
                  className="dropdown-item text-base"
                  onClick={() => handleSchoolIncidentClick()}
                >
                  {language ? "School Incident" : "حوادث المدرسة"}
                </li></> : null}
              {userInfo.user_role === "Student Affairs Officer" || userInfo.user_role === "Operations Excellence Lead" ? <li
                key="Student Absence"
                className="dropdown-item text-base"
                onClick={() => handleStudentAbsenceClick()}
              >
                {language ? "Student Absence" : "غياب الطالب"}
              </li> : null}
              {dailyOperations.map((type) =>
                language
                  ? type.forms.map((form) => (
                    <li
                      key={form.id}
                      className="dropdown-item text-base"
                      onClick={() =>
                        handleClick(form.id, form.en_name, form.ar_name, type.permission, type.reviewee)
                      }
                    >
                      {form.en_name}
                    </li>
                  ))
                  : type.forms.map((form) => (
                    <li
                      key={form.id}
                      className="dropdown-item text-base"
                      onClick={() =>
                        handleClick(form.id, form.en_name, form.ar_name, type.permission, type.reviewee)
                      }
                    >
                      {form.ar_name}
                    </li>
                  ))
              )}
            </ul>
          </li> : null}
          {forms.map((type, index) => (
            <li
              key={type.id}
              className={`relative group md:border-0 hover:text-lg hover:text-wisdomLightOrange text-black md:p-0 p-2 border-b-2 border-black m-2 ${language ? "text-start" : "text-end"
                }`}
            >
              <button className="font-bold">
                {language ? (
                  <>
                    {WISDOM_PMS_FORMS_LOGOS[WSIDOM_PMS_FORMS_ORDER[index]]} {type.code}
                  </>
                ) : (
                  <>
                    {type.codeAr} {WISDOM_PMS_FORMS_LOGOS[WSIDOM_PMS_FORMS_ORDER[index]]}
                  </>
                )}
              </button>

              <ul className="hidden group-hover:block absolute top-0 right-full list-none p-0 shadow-md shadow-black/10 rounded min-w-[400px] z-[1000]">
                {language
                  ? type.forms.map((form) => (
                    <li
                      key={form.id}
                      className="dropdown-item text-base"
                      onClick={() =>
                        handleClick(form.id, form.en_name, form.ar_name, form.permission, type.reviewee)
                      }
                    >
                      {form.en_name}
                    </li>
                  ))
                  : type.forms.map((form) => (
                    <li
                      key={form.id}
                      className="dropdown-item text-base"
                      onClick={() =>
                        handleClick(form.id, form.en_name, form.ar_name, form.permission, type.reviewee)
                      }
                    >
                      {form.ar_name}
                    </li>
                  ))}
              </ul>
            </li>
          ))}
          {userInfo.user_role === "Social Worker" || userInfo.user_role === "Operations Excellence Lead" ? <li
            key="Student behavior"
            className={`relative group md:border-0 md:p-0 hover:text-wisdomLightOrange text-black p-2 border-b-2 border-black m-2 ${!language && "text-end"}`}
          >
            <button className="font-bold">
              {language ? (
                <>{WISDOM_PMS_FORMS_LOGOS[7]} Student behavior</>
              ) : (
                <>سلوك الطالب {WISDOM_PMS_FORMS_LOGOS[7]}</>
              )}
            </button>

            <ul className="hidden group-hover:block absolute top-0 right-full list-none p-0 shadow-md shadow-black/10 rounded min-w-[400px] z-[1000]">
              {language ? (
                <li
                  key="StudentBehavior"
                  className="dropdown-item text-base"
                  onClick={() => handleStudentBehaviorClick()}
                >
                  Student behavior
                </li>
              ) : (
                <li
                  key="StudentBehavior"
                  className="dropdown-item text-base"
                  onClick={() => handleStudentBehaviorClick()}
                >
                  سلوك الطالب
                </li>
              )}
            </ul>
          </li> : null}
        </ul >
        <ul className="md:hidden grid grid-cols-1 md:grid-cols-5 list-none p-[1%] m-[4%] shadow-lg shadow-black/30 md:text-start text-center">
          {forms.map((type) => (
            <div key={type.id} className="flex justify-center w-full">
              <CollapsibleSection
                title={language ? type.code : type.codeAr}
                language={language}
              >
                <div className="w-full text-center max-w-[600px]">
                  {type.forms.map((form, index) => (
                    <div key={form.id} className="w-full mb-4">
                      <button
                        className="text-[18px] w-full text-center"
                        onClick={() =>
                          handleClick(
                            form.id, form.en_name, form.ar_name
                            , form.permission, type.reviewee
                          )
                        }
                      >
                        {language ? form.en_name : form.ar_name}
                      </button>
                    </div>
                  ))}
                </div>
              </CollapsibleSection>
            </div>
          ))}
          <div key="PD" className="flex justify-center w-full">
            <CollapsibleSection
              title={language ? "PD" : "التنمية المهنية"}
              language={language}
            >
              <div className="w-full text-center max-w-[600px]">
                {language ? (
                  <div key="Interview" className="w-full mb-4">
                    <button
                      className="text-[18px] w-full text-center"
                      onClick={() => handleInterviewClick()}
                    >
                      Interview
                    </button>
                  </div>
                ) : (
                  <div key="Interview" className="w-full mb-4">
                    <button
                      className="text-[18px] w-full text-center"
                      onClick={() => handleInterviewClick()}
                    >
                      مقابلات شخصية
                    </button>
                  </div>
                )}
                {language ? (
                  <div key="test" className="w-full mb-4">
                    <button
                      className="text-[18px] w-full text-center"
                      onClick={() => handleInterviewClick()}
                    >
                      Test
                    </button>
                  </div>
                ) : (
                  <div key="test" className="w-full mb-4">
                    <button
                      className="text-[18px] w-full text-center"
                      onClick={() => handleInterviewClick()}
                    >
                      إختبار تربوي
                    </button>
                  </div>
                )}
                {pd.map((type) =>
                  type.forms.map((form) =>
                    language ? (
                      <div key={form.id} className="w-full mb-4">
                        <button
                          className="text-[18px] w-full text-center"
                          onClick={() => handleClick(form.id, form.en_name, form.ar_name, form.permission, type.reviewee)}
                        >
                          {form.en_name}
                        </button>
                      </div>
                    ) : (
                      <div key={form.id} className="w-full mb-4">
                        <button
                          className="text-[18px] w-full text-center"
                          onClick={() => handleClick(form.id, form.en_name, form.ar_name, form.permission, type.reviewee)}
                        >
                          {form.ar_name}
                        </button>
                      </div>
                    )
                  )
                )}
              </div>
            </CollapsibleSection>
          </div>
          <div key="Daily Operations" className="flex justify-center w-full">
            <CollapsibleSection
              title={language ? "Daily Operations" : "الأشراف المدرسي"}
              language={language}
            >
              <div className="w-full text-center max-w-[600px]">
                <div key="Teacher Substitutions" className="w-full mb-4">
                  <button
                    className="text-[18px] w-full text-center"
                    onClick={() => handleTeacherSubstitutionClick()}
                  >
                    {language ? "Teacher Substitutions" : "الأحتياطي"}
                  </button>
                </div>
                <div key="Teacher Latness" className="w-full mb-4">
                  <button
                    className="text-[18px] w-full text-center"
                    onClick={() => handleTeacherLatnessClick()}
                  >
                    {language ? "Teacher Latness" : "تأخير المعلم"}
                  </button>
                </div>
                <div key="Student Absence" className="w-full mb-4">
                  <button
                    className="text-[18px] w-full text-center"
                    onClick={() => handleStudentAbsenceClick()}
                  >
                    {language ? "Student Absence" : "غياب الطالب"}
                  </button>
                </div>
                <div key="School Incident" className="w-full mb-4">
                  <button
                    className="text-[18px] w-full text-center"
                    onClick={() => handleSchoolIncidentClick()}
                  >
                    {language ? "School Incident" : "حوادث المدرسة"}
                  </button>
                </div>
                {dailyOperations.map((type) =>
                  type.forms.map((form) =>
                    language ? (
                      <div key={form.id} className="w-full mb-4">
                        <button
                          className="text-[18px] w-full text-center"
                          onClick={() => handleClick(form.id, form.ar_name, form.permission, type.reviewee)}
                        >
                          {form.en_name}
                        </button>
                      </div>
                    ) : (
                      <div key={form.id} className="w-full mb-4">
                        <button
                          className="text-[18px] w-full text-center"
                          onClick={() => handleClick(form.id, form.ar_name, form.permission, type.reviewee)}
                        >
                          {form.ar_name}
                        </button>
                      </div>
                    )
                  )
                )}
              </div>
            </CollapsibleSection>
          </div>
          <div key="Student behavior" className="flex justify-center w-full">
            <CollapsibleSection
              title={language ? "Student behavior" : "سلوك الطالب"}
              language={language}
            >
              <div className="w-full text-center max-w-[600px]">
                <div key="StudentBehavior" className="w-full mb-4">
                  <button
                    className="text-[18px] w-full text-center"
                    onClick={() => handleStudentBehaviorClick()}
                  >
                    {language ? "StudentBehavior" : "سلوك الطالب"}
                  </button>
                </div>
              </div>
            </CollapsibleSection>
          </div>
        </ul>
      </Navbar2 >
    </>
  );
};

export default Pms;