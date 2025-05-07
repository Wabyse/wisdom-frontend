import { useState } from 'react';
import ebda from '../assets/ebad-edu.png';
import Popup from "../components/Popup";

const HomeNabvar = () => {
  const [notAvailable, setNotAvailable] = useState(false);

  const openPopup = () => setNotAvailable(true);

  const closePopup = () => setNotAvailable(false);

  return (
    <div className="flex py-5 px-10 justify-between">
      <div className="w-[30%]">
        <img src={ebda} alt="" className='w-[20%]' />
      </div>
      <div className="flex max-w-[70%] justify-between border-wisdomOrange border-2">
        <button onClick={openPopup} className="hover:bg-wisdomOrange text-white py-4 px-8">Services</button>
        <button onClick={openPopup} className="hover:bg-wisdomOrange text-white py-4 px-8">EVOTS</button>
        <button onClick={openPopup} className="hover:bg-wisdomOrange text-white py-4 px-8">Careers</button>
        <button onClick={openPopup} className="hover:bg-wisdomOrange text-white py-4 px-8">About Us</button>
        <button onClick={openPopup} className="hover:bg-wisdomOrange text-white py-4 px-8">Contact Us</button>
        <button onClick={openPopup} className="bg-wisdomOrange hover:bg-wisdomDarkOrange p-4 text-white">Call Now!</button>
      </div>
      <Popup
        isOpen={notAvailable}
        onClose={closePopup}
        message="This page is under maintenance"
        button="close"
        form={false}
      />
    </div>
  )
};

export default HomeNabvar;
