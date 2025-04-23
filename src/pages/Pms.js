import { useState, useEffect } from "react";
import "../styles/Pms.css";
import { useNavigate } from "react-router-dom";
import { fetchForms } from "../services/pms";
import { useLanguage } from "../context/LanguageContext";
import Navbar2 from "../components/Navbar2";
import CollapsibleSection from "../components/CollapsibleSection";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClipboard,
  faBriefcase,
  faBook,
  faUserTie,
  faIdCardClip,
  faIdCard,
  faIdBadge,
  faAddressCard,
  faBuilding,
  faSchool,
} from "@fortawesome/free-solid-svg-icons";
import pms1 from "../assets/pms1.jpg";
import pms2 from "../assets/pms2.jpg";
import pms3 from "../assets/pms3.jpg";
import { useAuth } from "../context/AuthContext";
import LoadingScreen from "../components/LoadingScreen";

const roleMapping = {
  T: "Teacher",
  AC: "Academic Principle",
  C: "Curriculum",
  H: "HOD",
  EDU: "Edu Environment",
  EX: "Executive Principle",
  SPEC: "Specialist",
  W: "Work Enivornment",
  DO: "Daily Operations",
  PD: "PD",
};

const pmsDesc = "This module drives organizational success by setting clear goals, tracking progress, and offering feedback. It supports data-driven decisions for talent development, performance improvement, and strategic goal achievement, boosting efficiency and effectiveness."

const formLogo = [
  <FontAwesomeIcon icon={faUserTie} />,
  <FontAwesomeIcon icon={faBook} />,
  <FontAwesomeIcon icon={faIdCard} />,
  <FontAwesomeIcon icon={faBuilding} />,
  <FontAwesomeIcon icon={faSchool} />,
  <FontAwesomeIcon icon={faIdBadge} />,
  <FontAwesomeIcon icon={faAddressCard} />,
  <FontAwesomeIcon icon={faIdCardClip} />,
  <FontAwesomeIcon icon={faClipboard} />,
  <FontAwesomeIcon icon={faBriefcase} />,
];

const orderedForms2 = [0, 2, 4, 6, 5, 1, 3];

const roleArMapping = {
  T: "مدرس",
  AC: "المدير الاكاديمي",
  C: "المناهج",
  H: "مدير القطاع",
  EDU: "البيئة التعليمية",
  EX: "المدير التنفيذي",
  SPEC: "المتخصص",
  W: "بيئة العمل",
  DO: "الأشراف المدرسي",
  PD: "التنمية المهنية",
};

const rolePermission = {
  T: "Teacher",
  HOD: "Head of Department (HOD)",
  AC: "Academic Principle",
  EX: "Executive Manager",
  S: "Student",
  Self: "Self",
  Cl: "Teacher",
  QA: "Quality Officer",
  ML: "Line Supervisor",
  E: "Employee",
  AD: "ADMIN",
  OEL: "Operations Excellence Lead"
};

const Pms = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [forms, setForms] = useState([]);
  const [pd, setPd] = useState([]);
  const [dailyOperations, setDailyOperations] = useState([]);
  const { language } = useLanguage();
  const { userInfo } = useAuth();

  const navigate = useNavigate(); //for navigate to another page (component)

  const handleClick = (id, en_name, ar_name, code) => {
    navigate(`/pms/form/${id}`, {
      state: { formEnName: en_name, formArName: ar_name, lang: language, code },
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
        const rawData = await fetchForms();
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
          const codePermission2 = rolePermission[codePermission] || null;
          const codeKey = roleMapping[codeKey2] || null;
          const codeAr = roleArMapping[codeKey2] || null;
          if (codePermission2 === userInfo.user_role || (codePermission2 === "Employee" && userInfo.user_role !== "Student") || (codePermission2 === "Self" && codeKey === userInfo.user_role) || (codePermission2 === "Self" && codeKey === "Teacher" && userInfo.user_role === "Head of Department (HOD)") || (codePermission === "Cl" && userInfo.user_role === "Head of Department (HOD)") || userInfo.user_role === "Operations Excellence Lead") {
            let existingGroup = groupedData.find(
              (group) => group.code === codeKey
            );

            if (!existingGroup) {
              existingGroup = {
                id: item.id,
                code: codeKey,
                permission: codePermission2 === "Self" ? codeKey : codePermission2,
                codeAr: codeAr,
                forms: [],
              };
              groupedData.push(existingGroup);
            }

            existingGroup.forms.push({
              id: item.id,
              en_name: item.en_name,
              ar_name: item.ar_name,
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

        const orderedForms = [0, 2, 4, 6, 5, 1, 3];
        const newForms = orderedForms
          .map((id) => filteredGeneralForms[id])
          .filter((f) => f !== undefined); // ✅ Prevent crash
        setForms(newForms);
        setPd(filter1);
        setDailyOperations(filter2);
      } catch (err) {
        console.error("API Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadForms();
  }, [userInfo]);


  const imgs = [
    {
      img: pms1,
      title: "Progress Tracking",
      description:
        "Easily monitor team and individual growth towards key objectives.",
    },
    {
      img: pms2,
      title: "Insightful Metrics",
      description:
        "Understand performance deeply with data that drives smarter decisions.",
    },
    {
      img: pms3,
      title: "Resources Optimization",
      description:
        "Maximize efficiency, Ensue optimal allocation, Reduce costs",
    },
  ];

  if (loading) return <LoadingScreen />;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <Navbar2 showNavigate={true} img={imgs} length={userInfo.user_role === "Student" || userInfo.user_role === "Trainee" ? "w-[230px]" : "w-[520px]" } Page="PMS" description={pmsDesc}>
        <ul
          className={`hidden md:grid md:grid-cols-1 md:auto-rows-fr list-none md:text-start ${language ? "text-start" : "text-end"
            } md:h-[85vh]`}
        >
          {userInfo.user_role === "Teacher" || userInfo.user_role === "Head of Department (HOD)" || userInfo.user_role === "Operations Excellence Lead" ? <li
            key="PD"
            className={`relative group md:border-0 md:p-0 hover:text-lg hover:text-wisdomLightOrange text-black p-2 border-b-2 ${language ? "text-start" : "text-end"
              } border-black m-2`}
          >
            <button className="font-bold">
              {language ? (
                <>{formLogo[9]} PD</>
              ) : (
                <>التنمية المهنية {formLogo[9]}</>
              )}
            </button>

            <ul className="hidden group-hover:block absolute top-0 right-full list-none p-0 shadow-md shadow-black/10 rounded min-w-[400px] z-[1000]">
              {userInfo.user_role === "Operations Excellence Lead" || userInfo.user_role === "Academic Principle" ?
                <><li
                  key="Interview"
                  className="dropdown-item text-base"
                  onClick={() => handleInterviewClick()}
                >
                  {language ? "Interview" : "مقابلات شخصية"}
                </li>
                  <li
                    key="test"
                    className="dropdown-item text-base"
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
                      className="dropdown-item text-base"
                      onClick={() =>
                        handleClick(form.id, form.en_name, form.ar_name, form)
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
                        handleClick(form.id, form.en_name, form.ar_name, form.code)
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
            {/* <button
              className="font-bold relative z-10
              after:content-['']
              after:absolute
              after:left-0
              after:-bottom-[3px]
              after:h-[3px]
              after:rounded
              after:w-full
              after:bg-watomsBlue
              after:transform
              after:scale-x-0
              after:origin-left
              after:transition-transform
              after:duration-300
              group-hover:after:scale-x-100
            "
            > */}
            <button className="font-bold">
              {language ? (
                <>{formLogo[8]} Daily Operations</>
              ) : (
                <>الأشراف المدرسي {formLogo[8]}</>
              )}
            </button>

            <ul className="hidden group-hover:block absolute top-0 right-full list-none p-0 shadow-md shadow-black/10 rounded min-w-[400px] z-[1000]">
              {userInfo.user_role === "Supervisor" || userInfo.user_role === "Operations Excellence Lead" ? <>
                <li
                  key="Teacher Substitutions"
                  className="dropdown-item text-base"
                  onClick={() => handleTeacherSubstitutionClick()}
                >
                  {language ? "Teacher Substitutions" : "الأحتياطي"}
                </li>
                <li
                  key="Teacher Latness"
                  className="dropdown-item text-base"
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
                        handleClick(form.id, form.en_name, form.ar_name, form.code)
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
                        handleClick(form.id, form.en_name, form.ar_name, form.code)
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
                    {formLogo[orderedForms2[index]]} {type.code}
                  </>
                ) : (
                  <>
                    {type.codeAr} {formLogo[orderedForms2[index]]}
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
                        handleClick(form.id, form.en_name, form.ar_name, type.permission)
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
                        handleClick(form.id, form.en_name, form.ar_name, form.code)
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
            className="relative group md:border-0 md:p-0 hover:text-wisdomLightOrange text-black p-2 border-b-2 text-right border-black m-2"
          >
            <button className="font-bold">
              {language ? (
                <>{formLogo[7]} Student behavior</>
              ) : (
                <>سلوك الطالب {formLogo[7]}</>
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
                            form.id,
                            language ? form.en_name : form.ar_name
                            , form.code
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
                          onClick={() => handleClick(form.id, form.ar_name, form.code)}
                        >
                          {form.en_name}
                        </button>
                      </div>
                    ) : (
                      <div key={form.id} className="w-full mb-4">
                        <button
                          className="text-[18px] w-full text-center"
                          onClick={() => handleClick(form.id, form.ar_name, form.code)}
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
                          onClick={() => handleClick(form.id, form.ar_name, form.code )}
                       >
                          {form.en_name}
                        </button>
                      </div>
                    ) : (
                      <div key={form.id} className="w-full mb-4">
                        <button
                          className="text-[18px] w-full text-center"
                          onClick={() => handleClick(form.id, form.ar_name, form.code)}
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
      {/* <ul className={language ? "forms" : "formsAr"}>
        {forms.map((type) => (
          <li key={type.id} className="categories">
            <button className="category">
              {language ? type.code : type.codeAr}
            </button>

            <ul className={language ? "dropdown" : "dropdownAr"}>
              {language
                ? type.forms.map((form) => (
                    <li
                      key={form.id}
                      className="dropdown-item"
                      onClick={() =>
                        handleClick(form.id, form.en_name, form.ar_name, form.code)
                      }
                    >
                      {form.en_name}
                    </li>
                  ))
                : type.forms.map((form) => (
                    <li
                      key={form.id}
                      className="dropdown-item"
                      onClick={() =>
                        handleClick(form.id, form.en_name, form.ar_name, form.code)
                      }
                    >
                      {form.ar_name}
                    </li>
                  ))}
            </ul>
          </li>
        ))}
        <li key="Daily Operations" className="categories">
          <button className="category">
            {language ? "Daily Operations" : "الأشراف المدرسي"}
          </button>

          <ul className={language ? "dropdown" : "dropdownAr"}>
            {language ? (
              <li
                key="Teacher Substitutions"
                className="dropdown-item"
                onClick={() => handleTeacherSubstitutionClick()}
              >
                Teacher Substitutions
              </li>
            ) : (
              <li
                key="Teacher Substitutions"
                className="dropdown-item"
                onClick={() => handleTeacherSubstitutionClick()}
              >
                الأحتياطي
              </li>
            )}
            {language ? (
              <li
                key="Teacher Latness"
                className="dropdown-item"
                onClick={() => handleTeacherLatnessClick()}
              >
                Teacher Latness
              </li>
            ) : (
              <li
                key="Teacher Latness"
                className="dropdown-item"
                onClick={() => handleTeacherLatnessClick()}
              >
                تأخير المعلم
              </li>
            )}
            {language ? (
              <li
                key="Student Absence"
                className="dropdown-item"
                onClick={() => handleStudentAbsenceClick()}
              >
                Student Absence
              </li>
            ) : (
              <li
                key="Student Absence"
                className="dropdown-item"
                onClick={() => handleStudentAbsenceClick()}
              >
                غياب الطالب
              </li>
            )}
            {language ? (
              <li
                key="School Incident"
                className="dropdown-item"
                onClick={() => handleSchoolIncidentClick()}
              >
                School Incident
              </li>
            ) : (
              <li
                key="School Incident"
                className="dropdown-item"
                onClick={() => handleSchoolIncidentClick()}
              >
                حوادث المدرسة
              </li>
            )}
            {dailyOperations.map((type) =>
              language
                ? type.forms.map((form) => (
                    <li
                      key={form.id}
                      className="dropdown-item"
                      onClick={() =>
                        handleClick(form.id, form.en_name, form.ar_name, form.code)
                      }
                    >
                      {form.en_name}
                    </li>
                  ))
                : type.forms.map((form) => (
                    <li
                      key={form.id}
                      className="dropdown-item"
                      onClick={() =>
                        handleClick(form.id, form.en_name, form.ar_name, form.code)
                      }
                    >
                      {form.ar_name}
                    </li>
                  ))
            )}
          </ul>
        </li>
        <li key="PD" className="categories">
          <button className="category">
            {language ? "PD" : "التنمية المهنية"}
          </button>

          <ul className={language ? "dropdown" : "dropdownAr"}>
            {language ? (
              <li
                key="Interview"
                className="dropdown-item"
                onClick={() => handleInterviewClick()}
              >
                Interview
              </li>
            ) : (
              <li
                key="Interview"
                className="dropdown-item"
                onClick={() => handleInterviewClick()}
              >
                مقابلات شخصية
              </li>
            )}
            {language ? (
              <li
                key="test"
                className="dropdown-item"
                onClick={() => handleTestClick()}
              >
                Test
              </li>
            ) : (
              <li
                key="test"
                className="dropdown-item"
                onClick={() => handleTestClick()}
              >
                إختبار تربوي
              </li>
            )}
            {pd.map((type) =>
              language
                ? type.forms.map((form) => (
                    <li
                      key={form.id}
                      className="dropdown-item"
                      onClick={() =>
                        handleClick(form.id, form.en_name, form.ar_name, form.code)
                      }
                    >
                      {form.en_name}
                    </li>
                  ))
                : type.forms.map((form) => (
                    <li
                      key={form.id}
                      className="dropdown-item"
                      onClick={() =>
                        handleClick(form.id, form.en_name, form.ar_name, form.code)
                      }
                    >
                      {form.ar_name}
                    </li>
                  ))
            )}
          </ul>
        </li>
        <li key="Student behavior" className="categories">
          <button className="category">
            {language ? "Student behavior" : "سلوك الطالب"}
          </button>

          <ul className={language ? "dropdown" : "dropdownAr"}>
            {language ? (
              <li
                key="StudentBehavior"
                className="dropdown-item"
                onClick={() => handleStudentBehaviorClick()}
              >
                Student behavior
              </li>
            ) : (
              <li
                key="StudentBehavior"
                className="dropdown-item"
                onClick={() => handleStudentBehaviorClick()}
              >
                سلوك الطالب
              </li>
            )}
          </ul>
        </li>
      </ul> */}
    </>
  );
};

export default Pms;
