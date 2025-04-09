import { useState, useEffect } from "react";
import "../styles/Pms.css";
import { useNavigate } from "react-router-dom";
import { fetchForms } from "../services/pms";
import CollapsibleSection from "../components/CollapsibleSection";
import Navbar2 from "../components/Navbar2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClipboard,
  faBriefcase,
  faBook,
  faUserTie,
  faIdCardClip,
  faIdCard,
  faAddressCard,
  faBuilding,
  faSchool,
  faStar,
  faUsersLine,
  faRuler,
} from "@fortawesome/free-solid-svg-icons";
import pms1 from "../assets/pms1.jpg";
import pms2 from "../assets/pms2.jpg";
import pms3 from "../assets/pms3.jpg";

const roleArMapping = {
  QM: "إدارة الجودة",
  T: "المدرب",
  C: "المناهج",
  GL: "الحوكمة والقيادة",
  W: "بيئة العمل",
  TE: "بيئة التدريب",
  SP: "التخطيط الاستراتيجي",
  AP: "الاداريين",
  TC: "مدير",
  SS: "العمليات",
  TA: "المتدرب",
  PD: "التنمية المهنية",
  AD: "الادارة",
};

const formLogo = [
  <FontAwesomeIcon icon={faUsersLine} />,
  <FontAwesomeIcon icon={faBuilding} />,
  <FontAwesomeIcon icon={faAddressCard} />,
  <FontAwesomeIcon icon={faSchool} />,
  <FontAwesomeIcon icon={faStar} />,
  <FontAwesomeIcon icon={faUserTie} />,
  <FontAwesomeIcon icon={faBook} />,
  <FontAwesomeIcon icon={faRuler} />,
  <FontAwesomeIcon icon={faIdCard} />,
  <FontAwesomeIcon icon={faIdCardClip} />,
  <FontAwesomeIcon icon={faBriefcase} />,
  <FontAwesomeIcon icon={faClipboard} />,
];

const orderedForms2 = [4, 1, 2, 6, 8, 3, 0, 5, 9, 7];

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
        const filtertomsForms = rawData.filter(
          (filter) =>
            filter.type !== "360 Individual Assessment" &&
            filter.type !== "360 Curriculum Assessment" &&
            filter.type !== "normal"
        );

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
        const orderedForms = [4, 1, 2, 6, 8, 3, 0, 5, 9, 7];
        const newForms = orderedForms.map((id) => filteredGeneralForms[id]);
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
  }, []);

  const imgs = [
    {
      img: pms1,
      title: "نظرة متكاملة",
      description:
        "لاداء الافراد و المؤسسة و الوصول للاعتماد الدولي",
    },
    {
      img: pms2,
      title: "تنسيق شامل",
      description:
        "للبيانات و تقارير الاداء من خلال شاشات احصائية دقيقة شاملة",
    },
    {
      img: pms3,
      title: "تطوير متكامل",
      description:
        "للاداء الفني و التشغيل و الاداري و المدربين و المتدربين",
    },
  ];

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <Navbar2 showNavigate={false} img={imgs} length="w-[370px]" Page="PMS">
        <ul className="hidden md:grid md:grid-cols-1 md:auto-rows-fr list-none md:text-start text-center md:h-[80vh]">
          <li
            key="PD"
            className="m-2 relative group md:border-0 md:p-0 p-2 border-b-2 text-end border-black"
          >
            <button
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
            >
              التنمية المهنية
              {formLogo[10]}
            </button>

            <ul className="hidden group-hover:block absolute top-0 right-full list-none p-0 shadow-md shadow-black/10 rounded min-w-[400px] z-50">
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
                    onClick={() => handleClick(form.id, form.ar_name)}
                  >
                    {form.ar_name}
                  </li>
                ))
              )}
            </ul>
          </li>
          {forms.map((type, index) => (
            <li
              key={type.id}
              className="relative group md:border-0 md:p-0 p-2 border-b-2 border-black m-2 text-end"
            >
              <button
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
              >
                {type.code}
                {formLogo[orderedForms2[index]]}
              </button>

              <ul className="hidden group-hover:block absolute top-0 right-full list-none p-0 shadow-md shadow-black/10 rounded min-w-[400px] z-50">
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
          <li
            key="Daily Operations"
            className="m-2 relative group md:border-0 md:p-0 p-2 border-b-2 text-end border-black"
          >
            <button
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
            >
              الأشراف اليومي
              {formLogo[11]}
            </button>

            <ul className="hidden group-hover:block absolute top-0 right-full list-none p-0 shadow-md shadow-black/10 rounded min-w-[400px] z-50">
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
                        onClick={() => handleClick(form.id, form.ar_name)}
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
                      onClick={() => handleClick(form.id, form.ar_name)}
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
                      onClick={() => handleClick(form.id, form.ar_name)}
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
      {/* <ul className="hidden md:grid grid-cols-1 md:grid-cols-5 list-none p-[1%] mx-[4%] my-1 shadow-lg shadow-black/30 md:text-start text-center">
        {forms.map((type) => (
          <li
            key={type.id}
            className="relative group md:border-0 md:p-0 p-2 border-b-2 border-black m-2 text-center"
          >
            <button className="md:border-b-2 border-0 border-black">
              {type.code}
            </button>

            <ul className="hidden group-hover:block absolute top-0 right-full list-none p-0 shadow-md shadow-black/10 rounded min-w-[400px] z-[1000]">
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
        <li
          key="Daily Operations"
          className="m-2 relative group md:border-0 md:p-0 p-2 border-b-2 text-center border-black"
        >
          <button className="md:border-b-2 border-0 border-black">
            الأشراف اليومي
          </button>

          <ul className="hidden group-hover:block absolute top-full left-0 list-none p-0 shadow-md shadow-black/10 rounded min-w-[400px] z-[1000]">
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
        <li
          key="PD"
          className="m-2 relative group md:border-0 md:p-0 p-2 border-b-2 text-center border-black"
        >
          <button className="md:border-b-2 border-0 border-black">
            التنمية المهنية
          </button>

          <ul className="hidden group-hover:block absolute top-full left-0 list-none p-0 shadow-md shadow-black/10 rounded min-w-[400px] z-[1000]">
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
                  onClick={() => handleClick(form.id, form.ar_name)}
                >
                  {form.ar_name}
                </li>
              ))
            )}
          </ul>
        </li>
      </ul> */}
      {/* <img
        className="w-full h-[54vh] hidden md:block md:absolute md:bottom-0"
        src={newPms}
        alt="company logo"
      ></img> */}
    </>
  );
};

export default TomsPms;
