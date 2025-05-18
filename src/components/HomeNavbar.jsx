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
  let dropdownTimeout;

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

  return (
    <div className="flex py-5 px-10 justify-between w-full">
      <div className="w-[30%]">
        <img
          src={ebda}
          alt=""
          className='md:w-[20%] w-[50%] cursor-pointer'
          onClick={() => navigateTo('/')}
        />
      </div>

      {/* Desktop Menu */}
      <div className="md:flex hidden max-w-[70%] justify-between border-wisdomOrange border-2">
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
          <button className={`hover:bg-wisdomOrange hover:text-white py-4 px-8 h-full ${current === 'services' ? "bg-white text-black font-bold" : "text-white"}`}>
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
        <button onClick={() => navigateTo('/evots')} className={`hover:bg-wisdomOrange hover:text-white py-4 px-8 ${current === 'evots' ? "bg-white text-black font-bold" : "text-white"}`}>EVOTS</button>
        <button onClick={openPopup} className={`hover:bg-wisdomOrange hover:text-white py-4 px-8 ${current === 'careers' ? "bg-white text-black font-bold" : "text-white"}`}>Careers</button>
        <button onClick={() => navigateTo('/aboutus')} className={`hover:bg-wisdomOrange hover:text-white py-4 px-8 ${current === 'aboutus' ? "bg-white text-black font-bold" : "text-white"}`}>About Us</button>
        <button onClick={() => navigateTo('/contactus')} className={`hover:bg-wisdomOrange hover:text-white py-4 px-8 ${current === 'contactus' ? "bg-white text-black font-bold" : "text-white"}`}>Contact Us</button>
        {/* <button onClick={() => navigateTo('/evots')} className={`hover:bg-wisdomOrange hover:text-white py-4 px-8 ${current === 'evots' ? "bg-white text-black font-bold" : "text-white"}`}>EVOTS</button>
        <button onClick={() => navigateTo('/careers')} className={`hover:bg-wisdomOrange hover:text-white py-4 px-8 ${current === 'careers' ? "bg-white text-black font-bold" : "text-white"}`}>Careers</button>
        <button onClick={() => navigateTo('/aboutus')} className={`hover:bg-wisdomOrange hover:text-white py-4 px-8 ${current === 'aboutus' ? "bg-white text-black font-bold" : "text-white"}`}>About Us</button>
        <button onClick={() => navigateTo('/contactus')} className={`hover:bg-wisdomOrange hover:text-white py-4 px-8 ${current === 'contactus' ? "bg-white text-black font-bold" : "text-white"}`}>Contact Us</button> */}
        <button onClick={openPopup} className="bg-wisdomOrange hover:bg-wisdomDarkOrange p-4 text-white">Call Now!</button>
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden w-[50%] flex flex-col self-end justify-end items-end">
        <button onClick={mobile ? closeMobile : toggleMobile} className='mb-2'>
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {mobile && (
          <div
            className={`
              md:hidden flex flex-col max-w-[70%] justify-between border-wisdomOrange border-2
              transition-all duration-300 ease-in transform bg-black bg-opacity-80
              ${animateIn ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
            `}
          >
            <button onClick={() => navigateTo('/services/training')} className="hover:bg-wisdomOrange py-4 text-white">Training Services</button>
            <button onClick={openPopup} className="hover:bg-wisdomOrange py-4 text-white">Education Services</button>
            <button onClick={() => navigateTo('/evots')} className={`hover:bg-wisdomOrange hover:text-white py-4 ${current === 'evots' ? "bg-white text-black font-bold" : "text-white"}`}>EVOTS</button>
            <button onClick={openPopup} className={`hover:bg-wisdomOrange hover:text-white py-4 ${current === 'careers' ? "bg-white text-black font-bold" : "text-white"}`}>Careers</button>
            <button onClick={() => navigateTo('/aboutus')} className={`hover:bg-wisdomOrange hover:text-white py-4 ${current === 'aboutus' ? "bg-white text-black font-bold" : "text-white"}`}>About Us</button>
            <button onClick={() => navigateTo('/contactus')} className={`hover:bg-wisdomOrange hover:text-white py-4 ${current === 'contactus' ? "bg-white text-black font-bold" : "text-white"}`}>Contact Us</button>
            <button onClick={openPopup} className="bg-wisdomOrange hover:bg-wisdomDarkOrange p-4 text-white">Call Now!</button>
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