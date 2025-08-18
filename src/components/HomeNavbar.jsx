import { useState } from 'react';
import ebda from '../assets/ebad-edu.png';
import Popup from "../components/Popup";
import { useNavigate } from "react-router-dom";

const HomeNabvar = ({ current, setViewValue }) => {
  const navigate = useNavigate();
  const [notAvailable, setNotAvailable] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const [showServicesDropdown, setShowServicesDropdown] = useState(false);
  const [showTestDropdown, setShowTestDropdown] = useState(false);
  const [hoveredLang, setHoveredLang] = useState(null); // 'arabic' or 'english'
  let dropdownTimeout;
  let dropdownTimeout2;

  const openPopup = () => setNotAvailable(true);
  const closePopup = () => setNotAvailable(false);
  const navigateTo = (url) => navigate(url);

  const toggleMobile = () => {
    setMobile(true);
    setViewValue(false);
    setTimeout(() => setAnimateIn(true), 10); // trigger animation
  };

  const closeMobile = () => {
    setAnimateIn(false);
    setViewValue(true);
    setTimeout(() => setMobile(false), 300); // wait for animation to end
  };

  const items = {
    arabic: [
      { text: "اجهزة منزلية", url: "https://docs.google.com/forms/d/e/1FAIpQLSc3PeLHTXmx0V_TYZ4N0fTZ83IPT1Zf2H8C4ncfpPYQvkPE7g/viewform" },
      { text: "صيانة محمول", url: "https://docs.google.com/forms/d/e/1FAIpQLSdKH8JvLUu8lofAktTn975Ix5nWsl4JXUY_G6oZYXbABhixDA/viewform" },
      { text: "طاقة شمسية", url: "https://docs.google.com/forms/d/e/1FAIpQLSfIMwldsfnfF8HfRl5jNadAx50su3UmeIqEx7swvJTYlPfzxw/viewform" },
      { text: "ميكانيكا سيارات", url: "https://docs.google.com/forms/d/e/1FAIpQLSfIMrsEcKQ9J1OhHJnDHk1zG9wCNrkpxsmN1f2FPJop-lPpfQ/viewform" },
      { text: "تفصيل و خياطة", url: "https://forms.gle/9irwaVmu8ewBkQ2T6" }
    ],
    english: [
      { text: "Home Appliances Maintenance", url: "https://docs.google.com/forms/d/e/1FAIpQLSexD9SALHhpeaTaKjlI8tqEpNNBt2ny0Z0bXNs0E0L4HpXnxw/viewform?usp=header" },
      { text: "Mobile Electronics", url: "https://docs.google.com/forms/d/e/1FAIpQLSfUQdXi1p8m4IC6U0a-TYgydI6-Lg6uyXV3psuok93ngl8xCw/viewform?usp=header" },
      { text: "PV and Electricity", url: "https://docs.google.com/forms/d/e/1FAIpQLScX8VXDCefcRcWrAVumUK449fo-Nv4uplgnI3iRSAW7yFBvdg/viewform?usp=header" },
      { text: "Car Mechanics", url: "https://docs.google.com/forms/d/e/1FAIpQLSdge2JpdUv8xUVtVPfptA7REr97iPkiK6ktIWgtun2804HXUg/viewform?usp=header" },
      { text: "Tailoring and Sewing", url: "https://forms.gle/9irwaVmu8ewBkQ2T6" }
    ]
  };

  return (
    <div>
      <div className="flex py-5 px-10 justify-between w-full">
        <div className="w-[25%]">
          <img
            src={ebda}
            alt=""
            className='md:w-24 w-14 md:h-20 h-12 cursor-pointer'
            onClick={() => navigateTo('/')}
          />
        </div>

        {/* Desktop Menu */}
        <div className="md:flex hidden max-w-[75%] justify-between border-wisdomOrange border-2">
          <div
            className="relative"
            onMouseEnter={() => {
              clearTimeout(dropdownTimeout);
              setShowServicesDropdown(true);
            }}
            onMouseLeave={() => {
              dropdownTimeout = setTimeout(() => {
                setShowServicesDropdown(false);
              }, 200); // 1 second delay
            }}
          >
            <button className={`hover:bg-wisdomOrange hover:text-white py-4 px-8 h-full ${current === 'services' ? "bg-white text-black font-bold" : "text-black"}`}>
              Services
            </button>
            {showServicesDropdown && (
              <div className="absolute left-0 mt-1 bg-slate-200 text-black shadow-md rounded-md z-50">
                <ul className="w-40 py-2">
                  <li
                    onClick={() => navigateTo('/services/training')}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    Training
                  </li>
                  <li
                    onClick={openPopup}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    Education
                  </li>
                </ul>
              </div>
            )}
          </div>
          <div
            className="relative"
            onMouseEnter={() => {
              clearTimeout(dropdownTimeout2);
              setShowTestDropdown(true);
            }}
            onMouseLeave={() => {
              dropdownTimeout2 = setTimeout(() => {
                setShowTestDropdown(false);
                setHoveredLang(null);
              }, 200);
            }}
          >
            <button className={`hover:bg-wisdomOrange hover:text-white py-4 px-8 h-full ${current === 'services' ? "bg-white text-black font-bold" : "text-black"}`}>
              Placement Test
            </button>

            {showTestDropdown && (
              <div className="absolute left-0 mt-1 bg-slate-200 text-black shadow-md rounded-md z-50 flex">
                {/* Language options (column 1) */}
                <ul className="w-40 py-2 border-r border-gray-300">
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onMouseEnter={() => setHoveredLang('arabic')}
                  >
                    العربية
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onMouseEnter={() => setHoveredLang('english')}
                  >
                    English
                  </li>
                </ul>

                {/* Submenu options (column 2) */}
                {hoveredLang && (
                  <ul className="w-64 py-2">
                    {items[hoveredLang].map((item, index) => (
                      <li key={index} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {item.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
          <button onClick={() => navigateTo('/evots')} className={`hover:bg-wisdomOrange hover:text-white py-4 px-8 ${current === 'evots' ? "bg-white text-black font-bold" : "text-black"}`}>EVOTS</button>
          <button onClick={openPopup} className={`hover:bg-wisdomOrange hover:text-white py-4 px-8 ${current === 'careers' ? "bg-white text-black font-bold" : "text-black"}`}>Careers</button>
          <button onClick={() => navigateTo('/aboutus')} className={`hover:bg-wisdomOrange hover:text-white py-4 px-8 ${current === 'aboutus' ? "bg-white text-black font-bold" : "text-black"}`}>About Us</button>
          <button onClick={() => navigateTo('/contactus')} className={`hover:bg-wisdomOrange hover:text-white py-4 px-8 ${current === 'contactus' ? "bg-white text-black font-bold" : "text-black"}`}>Contact Us</button>
          <button onClick={() => navigateTo('/vtc-trainees-registration')} className={`hover:bg-wisdomOrange hover:text-white py-4 px-8 ${current === 'trainee' ? "bg-white text-black font-bold" : "text-black"}`}>تسجيل متدربين</button>
          {/* <button onClick={() => navigateTo('/evots')} className={`hover:bg-wisdomOrange hover:text-white py-4 px-8 ${current === 'evots' ? "bg-white text-black font-bold" : "text-black"}`}>EVOTS</button>
        <button onClick={() => navigateTo('/careers')} className={`hover:bg-wisdomOrange hover:text-white py-4 px-8 ${current === 'careers' ? "bg-white text-black font-bold" : "text-black"}`}>Careers</button>
        <button onClick={() => navigateTo('/aboutus')} className={`hover:bg-wisdomOrange hover:text-white py-4 px-8 ${current === 'aboutus' ? "bg-white text-black font-bold" : "text-black"}`}>About Us</button>
        <button onClick={() => navigateTo('/contactus')} className={`hover:bg-wisdomOrange hover:text-white py-4 px-8 ${current === 'contactus' ? "bg-white text-black font-bold" : "text-black"}`}>Contact Us</button> */}
          <button onClick={() => navigateTo('/wabys')} className="bg-wisdomOrange hover:bg-wisdomDarkOrange p-4 text-white">ًWabys</button>
        </div>
        <button onClick={mobile ? closeMobile : toggleMobile} className='mb-2 md:hidden'>
          <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden w-full flex flex-col self-end justify-end items-end">
        {mobile && (
          <div
            className={`
              md:hidden flex flex-wrap max-w-full justify-between border-wisdomOrange border-2
              transition-all duration-300 ease-in transform bg-black bg-opacity-80
              ${animateIn ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
            `}
          >
            <button onClick={() => navigateTo('/services/training')} className="hover:bg-wisdomOrange py-4 text-white w-[50%] border-gray-700 border-2">Training Services</button>
            <button onClick={openPopup} className="hover:bg-wisdomOrange py-4 text-white w-[50%] border-gray-700 border-2">Education Services</button>
            <button onClick={() => navigateTo('/evots')} className={`hover:bg-wisdomOrange hover:text-white w-[50%] border-gray-700 border-2 py-4 ${current === 'evots' ? "bg-white text-white w-[50%] border-gray-700 border-2 font-bold" : "text-white w-[50%] border-gray-700 border-2"}`}>EVOTS</button>
            <button onClick={openPopup} className={`hover:bg-wisdomOrange hover:text-white w-[50%] border-gray-700 border-2 py-4 ${current === 'careers' ? "bg-white text-white w-[50%] border-gray-700 border-2 font-bold" : "text-white w-[50%] border-gray-700 border-2"}`}>Careers</button>
            <button onClick={() => navigateTo('/aboutus')} className={`hover:bg-wisdomOrange hover:text-white w-[50%] border-gray-700 border-2 py-4 ${current === 'aboutus' ? "bg-white text-white w-[50%] border-gray-700 border-2 font-bold" : "text-white w-[50%] border-gray-700 border-2"}`}>About Us</button>
            <button onClick={() => navigateTo('/contactus')} className={`hover:bg-wisdomOrange hover:text-white w-[50%] border-gray-700 border-2 py-4 ${current === 'contactus' ? "bg-white text-white w-[50%] border-gray-700 border-2 font-bold" : "text-white w-[50%] border-gray-700 border-2"}`}>Contact Us</button>
            <button onClick={() => navigateTo('/vtc-trainees-registration')} className={`hover:bg-wisdomOrange hover:text-white w-[50%] border-gray-700 border-2 py-4 ${current === 'contactus' ? "bg-white text-white w-[50%] border-gray-700 border-2 font-bold" : "text-white w-[50%] border-gray-700 border-2"}`}>تسجيل متدربين</button>
            <button onClick={() => navigateTo('/wabys')} className="bg-wisdomOrange hover:bg-wisdomDarkOrange p-4 text-white w-[50%] border-gray-700 border-2">Wabys</button>
          </div>
        )}
      </div>

      <Popup
        isOpen={notAvailable}
        onClose={closePopup}
        message="This page is under maintenance"
        button="close"
        form={false}
      />
    </div>
  );
};

export default HomeNabvar;