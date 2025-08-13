import ebdaeduLogo from '../assets/ebad-edu.png';
import golLogo from '../assets/Gov.png';

const WatomsTraineesRegistrationNavbar = () => {
    return (
        <div className="flex justify-between items-center py-12 md:px-14 px-4">
            <img src={ebdaeduLogo} alt='ebda edu logo' className='md:w-28 w-16' />
            <div className='border-l-2 border-black p-1 h-12' />
            <h1 className='text-white md:text-5xl text-lg font-bold'>استمارة تقييم متدرب</h1>
            <div className='border-l-2 border-black p-1 h-12' />
            <img src={golLogo} alt='gol logo' className='md:w-28 w-16' />
        </div>
    )
}

export default WatomsTraineesRegistrationNavbar;