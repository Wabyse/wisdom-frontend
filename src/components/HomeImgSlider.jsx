import { useState } from 'react';
import img1 from '../assets/test8.jpg';
import img2 from '../assets/test9.jpg';
import img3 from '../assets/test7.jpg';

const HomeImgSlider = () => {
    const [activeIndex, setActiveIndex] = useState(1);
    const images = [img1, img2, img3];

    return (
        <div className="flex">
            <div className="flex w-[70%] h-[90vh] items-center justify-center overflow-hidden my-4">
                {images.map((img, index) => (
                    <div
                        key={index}
                        className={`relative overflow-hidden rounded-3xl transition-all duration-700 ease-in-out 
              ${index === activeIndex ? 'w-[50%]' : 'w-[20%]'} 
              h-full cursor-pointer mx-2`}
                        onMouseEnter={() => setActiveIndex(index)}
                    >
                        <img
                            src={img}
                            alt={`slide-${index}`}
                            className="w-full h-full object-cover object-center transition-all duration-700"
                        />
                    </div>
                ))}
            </div>
            <div className="w-[30%] h-[90vh] bg-white flex flex-col items-center justify-center">
                <h1 className='text-4xl font-bold'>EBDA EDU for training and education</h1>
                <button className="md:p-4 p-2 bg-wisdomOrange hover:bg-wisdomDarkOrange hover:text-white text-white self-start mt-2">Read More</button>
            </div>
        </div>
    );
};

export default HomeImgSlider;
