import { useState } from 'react';
import ebda from '../assets/ebad-edu.png';
import Popup from "../components/Popup";
import { useNavigate } from "react-router-dom";

const HomeNabvar = ({ current, setViewValue }) => {
  const navigate = useNavigate();
  const [notAvailable, setNotAvailable] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);

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
        <button onClick={openPopup} className="hover:bg-wisdomOrange py-4 px-8 text-white">Services</button>
        <button onClick={openPopup} className={`hover:bg-wisdomOrange hover:text-white py-4 px-8 ${current === 'evots' ? "bg-white text-black font-bold" : "text-white"}`}>EVOTS</button>
        <button onClick={openPopup} className={`hover:bg-wisdomOrange hover:text-white py-4 px-8 ${current === 'careers' ? "bg-white text-black font-bold" : "text-white"}`}>Careers</button>
        <button onClick={openPopup} className={`hover:bg-wisdomOrange hover:text-white py-4 px-8 ${current === 'aboutus' ? "bg-white text-black font-bold" : "text-white"}`}>About Us</button>
        <button onClick={openPopup} className={`hover:bg-wisdomOrange hover:text-white py-4 px-8 ${current === 'contactus' ? "bg-white text-black font-bold" : "text-white"}`}>Contact Us</button>
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
              transition-all duration-300 ease-in transform
              ${animateIn ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
            `}
          >
            <button onClick={openPopup} className="hover:bg-wisdomOrange py-4 px-8 text-white">Services</button>
            <button onClick={() => navigateTo('/evots')} className={`hover:bg-wisdomOrange hover:text-white py-4 px-8 ${current === 'evots' ? "bg-white text-black font-bold" : "text-white"}`}>EVOTS</button>
            <button onClick={() => navigateTo('/careers')} className={`hover:bg-wisdomOrange hover:text-white py-4 px-8 ${current === 'careers' ? "bg-white text-black font-bold" : "text-white"}`}>Careers</button>
            <button onClick={() => navigateTo('/aboutus')} className={`hover:bg-wisdomOrange hover:text-white py-4 px-8 ${current === 'aboutus' ? "bg-white text-black font-bold" : "text-white"}`}>About Us</button>
            <button onClick={() => navigateTo('/contactus')} className={`hover:bg-wisdomOrange hover:text-white py-4 px-8 ${current === 'contactus' ? "bg-white text-black font-bold" : "text-white"}`}>Contact Us</button>
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