import { useState, useEffect } from "react";
import "../styles/Pms.css";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { fetchForms } from "../services/pms";
import newPms from "../assets/newPms.jpg";

const roleArMapping = {
  QM: "إدارة الجودة والتطوير المستمر",
  T: "أداء المدرب",
  C: "المنهج",
  GL: "الحوكمة والقيادة",
  W: "بيئة العمل",
  TE: "بيئة التدريب",
  SP: "التخطيط الاستراتيجي والعمليات",
  AP: "أداء المسؤولين",
  TC: "مدير المركز",
  SS: "الخدمة الاجتماعية",
  TA: "إنجازات المتدرب",
  PD: "التنمية المهنية",
  AD: "الادارة"
};

const TomsPms = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [forms, setForms] = useState([]);
  const [pd, setPd] = useState([]);
  const [dailyOperations, setDailyOperations] = useState([]);

  const navigate = useNavigate(); //for navigate to another page (component)

  const handleClick = (id, ar_name) => {
    navigate(`/watoms/pms/form/${id}`, {
      state: { formArName: ar_name },
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
        const rawData = await fetchForms();
        const filtertomsForms = rawData.filter(filter => filter.type !== '360 Individual Assessment' && filter.type !== '360 Curriculum Assessment' && filter.type !== 'normal' )

        const groupedData = [];

        filtertomsForms.forEach((item) => {
          const codeKey2 = item.code.split(" | ")[1];
          const codeKey = roleArMapping[codeKey2] || null;

          let existingGroup = groupedData.find(
            (group) => group.code === codeKey
          );

          if (!existingGroup) {
            existingGroup = {
              id: item.id,
              code: codeKey,
              forms: [],
            };
            groupedData.push(existingGroup);
          }

          existingGroup.forms.push({
            id: item.id,
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
      <Navbar showNavigate={false}></Navbar>
      <ul className="formsAr">
        {forms.map((type) => (
          <li key={type.id} className="categories">
            <button className="category">{type.code}</button>

            <ul className="dropdownAr">
              {type.forms.map((form) => (
                <li
                  key={form.id}
                  className="dropdown-item"
                  onClick={() => handleClick(form.id, form.ar_name)}
                >
                  {form.ar_name}
                </li>
              ))}
            </ul>
          </li>
        ))}
        <li key="Daily Operations" className="categories">
          <button className="category">الأشراف اليومي</button>

          <ul className="dropdownAr">
            <li
              key="Student Absence"
              className="dropdown-item"
              onClick={() => handleTraineeAbsenceClick()}
            >
              غياب المتدرب
            </li>
            <li
              key="School Incident"
              className="dropdown-item"
              onClick={() => handleInistituteIncidentClick()}
            >
              وقائع المركز
            </li>
            {dailyOperations.map((type) =>
              type.forms.map((form) => (
                <li
                  key={form.id}
                  className="dropdown-item"
                  onClick={() => handleClick(form.id, form.ar_name)}
                >
                  {form.ar_name}
                </li>
              ))
            )}
          </ul>
        </li>
        <li key="PD" className="categories">
          <button className="category">التنمية المهنية</button>

          <ul className="dropdownAr">
            <li
              key="Interview"
              className="dropdown-item"
              onClick={() => handleInterviewClick()}
            >
              مقابلات شخصية
            </li>
            <li
              key="test"
              className="dropdown-item"
              onClick={() => handleTestClick()}
            >
              إختبار تربوي
            </li>
            {pd.map((type) =>
              type.forms.map((form) => (
                <li
                  key={form.id}
                  className="dropdown-item"
                  onClick={() =>
                    handleClick(form.id, form.ar_name)
                  }
                >
                  {form.ar_name}
                </li>
              ))
            )}
          </ul>
        </li>
      </ul>
      <img
        className="newPms"
        width="20%"
        src={newPms}
        alt="company logo"
      ></img>
    </>
  );
};

export default TomsPms;
