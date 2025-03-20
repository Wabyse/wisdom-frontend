import { useState, useEffect } from "react";
import "../styles/Pms.css";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { fetchForms } from "../services/pms";
import ChangeLanguage from "../components/ChangeLanguage";
import { useLanguage } from "../context/LanguageContext";

const roleMapping = {
  T: "Teacher",
  AC: "Academic Principle",
  C: "Curriculum",
  H: "HOD",
  EDU: "Educational Environment",
  EX: "Executive Principle",
  SPEC: "Specialist",
  W: "Work Enivornment",
  DO: "Daily Operations",
  PD: "PD",
};

const roleArMapping = {
  T: "مدرس",
  AC: "المدير الاكاديمي",
  C: "المنهج",
  H: "مدير القطاع",
  EDU: "البيئة التعليمية",
  EX: "المدير التنفيذي",
  SPEC: "المتخصص",
  W: "بيئة العمل",
  DO: "الأشراف المدرسي",
  PD: "التنمية المهنية",
};

const Pms = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [forms, setForms] = useState([]);
  const [pd, setPd] = useState([]);
  const [dailyOperations, setDailyOperations] = useState([]);
  const { language } = useLanguage();

  const navigate = useNavigate(); //for navigate to another page (component)

  const handleClick = (id, en_name, ar_name) => {
    navigate(`/pms/form/${id}`, {
      state: { formEnName: en_name, formArName: ar_name, lang: language },
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

        const groupedData = [];

        rawData.forEach((item) => {
          const codeKey2 = item.code.split(" | ")[1];
          const codeKey = roleMapping[codeKey2] || null;
          const codeAr = roleArMapping[codeKey2] || null;

          let existingGroup = groupedData.find(
            (group) => group.code === codeKey
          );

          if (!existingGroup) {
            existingGroup = {
              id: item.id,
              code: codeKey,
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
        setForms(filteredGeneralForms);
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
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <Navbar>
        <ChangeLanguage />
      </Navbar>
      <ul className={language ? "forms" : "formsAr"}>
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
                        handleClick(form.id, form.en_name, form.ar_name)
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
                        handleClick(form.id, form.en_name, form.ar_name)
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
                        handleClick(form.id, form.en_name, form.ar_name)
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
                        handleClick(form.id, form.en_name, form.ar_name)
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
                المقابلة
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
                الاختبار
              </li>
            )}
            {pd.map((type) =>
              language
                ? type.forms.map((form) => (
                    <li
                      key={form.id}
                      className="dropdown-item"
                      onClick={() =>
                        handleClick(form.id, form.en_name, form.ar_name)
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
                        handleClick(form.id, form.en_name, form.ar_name)
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
      </ul>
    </>
  );
};

export default Pms;
