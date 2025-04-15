import style from "../styles/Navbar.module.css";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import GovLogo from "../assets/NewLogoGovEbda.png";
import watoms2 from "../assets/watoms2.jpg";
import wisdom from "../assets/wisdom.png";
import { useState } from "react";
// this is comment test

const Navbar = ({ children, showNavigate = true, img, length = "w-[370px]", upload = false }) => {
  const { setUserCode } = useAuth();
  // const [profile, setProfile] = useState("hidden");
  // const [profileHover, setProfileHover] = useState(false);
  const { userCode } = useAuth();
  // const [current, setCurrent] = useState(0);
  const [mobile, setMobile] = useState(false);
  // const [typedTitle, setTypedTitle] = useState("");
  // const [typedSubtitle, setTypedSubtitle] = useState("");
  const navigate = useNavigate();
  const loggingOut = async () => {
    localStorage.removeItem("token");
    setUserCode(null);
    window.location.href = "/login";
  };

  // const viewProfile = () => {
  //   setProfileHover(true);
  //   setProfile("");
  // }

  // const hideProfile = () => {
  //   setProfileHover(false);
  //   setProfile("hidden");
  // }

  // const slides = [
  //   {
  //     id: 1,
  //     image: img,
  //     title: "Explore Nature",
  //     subtitle: "Discover the beauty of the world around you.",
  //   },
  //   {
  //     id: 2,
  //     image:
  //       "https://static.vecteezy.com/system/resources/previews/001/871/388/non_2x/illustration-of-hours-and-schedules-to-improve-company-performance-company-profits-increasing-on-chart-women-and-men-workers-designed-for-website-web-landing-page-apps-ui-ux-poster-flyer-free-vector.jpg",
  //     title: "City Lights",
  //     subtitle: "Experience the energy of urban life.",
  //   },
  //   {
  //     id: 3,
  //     image:
  //       "https://www.talentlms.com/blog/wp-content/uploads/2024/06/Performance-Management-Process_15May2024b_big.png",
  //     title: "Mountain Adventure",
  //     subtitle: "Reach new heights and conquer your fears.",
  //   },
  // ];

  const navItem = (label, path) => (
    <button
      onClick={() => {
        navigate(path);
        setMobile(false);
      }}
      className={`relative bg-transparent text-black rounded-none shadow-none border-none px-2 py-1 group`}
    >
      <span
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
        {label}
      </span>
    </button>
  );

  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     setCurrent((prev) => (prev + 1) % img.length);
  //   }, 5000);

  //   return () => clearInterval(timer);
  // }, [img]);

  // useEffect(() => {
  //   const { title, description } = img[current];
  //   let titleIndex = 0;
  //   let subtitleIndex = 0;

  //   setTypedTitle("");
  //   setTypedSubtitle("");

  //   let titleTimer = null;
  //   let subtitleTimer = null;

  //   function typeTitle() {
  //     titleTimer = setInterval(() => {
  //       setTypedTitle((prev) => {
  //         const next = prev + title.charAt(titleIndex);
  //         titleIndex++;
  //         if (titleIndex >= title.length) {
  //           clearInterval(titleTimer);
  //         }
  //         return next;
  //       });
  //     }, 50);
  //   }

  //   function typeSubtitle() {
  //     subtitleTimer = setInterval(() => {
  //       setTypedSubtitle((prev) => {
  //         const next = prev + description.charAt(subtitleIndex);
  //         subtitleIndex++;
  //         if (subtitleIndex >= description.length) {
  //           clearInterval(subtitleTimer);
  //         }
  //         return next;
  //       });
  //     }, 30);
  //   }

  //   typeTitle();
  //   const subtitleDelay = setTimeout(typeSubtitle, 600);

  //   // Cleanup
  //   return () => {
  //     clearInterval(titleTimer);
  //     clearInterval(subtitleTimer);
  //     clearTimeout(subtitleDelay);
  //   };
  // }, [current, img]);

  return (
    <div
      className={`w-full flex flex-col ${upload ? "h-[75px] bg-gray-500" : "h-[600px]"} bg-cover bg-center m-0 transition-all duration-1000 ease-in-out`}
      style={{
        // backgroundImage: upload ? "none" : `url(${img[current].image})`,
        backgroundColor: upload ? "gray" : "none"
      }}
    >
      <div className="w-full flex justify-between items-center px-4 py-2">
        <div className="flex items-center gap-2">
          {showNavigate ? <img className="w-[15%]" src={wisdom} alt="Wabys Logo" /> : <img className="w-[8%]" src={watoms2} alt="Wabys Logo" />}
          {showNavigate ? null : (
            <img
              className="w-16 border-l-2 border-black pl-2"
              src={GovLogo}
              alt="Wabys Logo"
            />
          )}
        </div>

        <div
          className={`hidden md:flex items-center gap-4 bg-white py-2 px-2 rounded-full shadow-lg shadow-black/30 ${length}`}
        >
          {showNavigate
            ? navItem("PMS", "/pms")
            : navItem("PMS", "/watoms/pms")}
          {showNavigate
            ? navItem("DMS", "/dms")
            : navItem("DMS", "/watoms/dms")}
          {showNavigate
            ? navItem("TMS", "/tms")
            : navItem("TMS", "/watoms/tms")}
          <div className="flex items-center gap-2">
            <div className={`flex justify-evenly items-center`}>{children}</div>
            <div className="bg-white text-center p-2 rounded-full font-bold w-10 h-10 border-2 border-gray-300 flex items-center justify-center">
              {userCode || "Guest"}
            </div>
            <button
              onClick={loggingOut}
              className={`relative inline-block px-4 py-2 font-bold text-white rounded-full overflow-hidden bg-watomsBlue hover:bg-wisdomOrange ${style["nav-button"]}`}
            >
              <span className="relative z-10 transition-colors duration-400">
                Logout
              </span>
            </button>
          </div>
        </div>

        <div className="md:hidden">
          <button onClick={() => setMobile(!mobile)}>
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
      {/* <div className={`h-full ${mobile ? "hidden" : "flex"} flex-col justify-center p-51 ${upload ? "hidden" : ""}`}>
        <div className="text-black text-5xl">
          <span className="inline-block bg-white shadow-lg shadow-black/30 px-2 py-3 rounded">
            {typedTitle}
          </span>
        </div>
        <div className="text-black text-2xl mt-4">
          <span className="inline-block bg-white shadow-lg shadow-black/30 px-2 rounded">
            {typedSubtitle}
          </span>
        </div>
      </div> */}

      {mobile && (
        <div className="md:hidden w-screen flex flex-col gap-2 bg-white px-4 py-4 shadow-md">
          {showNavigate
            ? navItem("PMS", "/pms")
            : navItem("PMS", "/watoms/pms")}
          {showNavigate
            ? navItem("DMS", "/dms")
            : navItem("DMS", "/watoms/dms")}
          {showNavigate
            ? navItem("TMS", "/tms")
            : navItem("TMS", "/watoms/tms")}
          <div className="flex flex-col items-center gap-2">{children}</div>
          <div className="bg-white flex justify-center items-center text-center p-2 w-[50px] h-[50px] rounded-full font-bold border-2 border-gray-300 mx-auto">
            {userCode || "Guest"}
          </div>
          <button
            onClick={loggingOut}
            className="bg-gray-300 hover:bg-gray-400 py-2 px-4 rounded mx-auto"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default Navbar;
