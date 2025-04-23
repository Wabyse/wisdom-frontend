import wabys from "../assets/wabys.png";
import style from "../styles/Loading.module.css";

const LoadingScreen = () => {
    return (
        <div className="bg-formColor w-full h-screen flex justify-center items-center">
            <div className="relative w-[25%] aspect-[4/1]">
                {" "}
                <div
                    className={`w-full h-full ${style["animated-mask"]}`}
                    style={{
                        WebkitMaskImage: `url(${wabys})`,
                        maskImage: `url(${wabys})`,
                        WebkitMaskRepeat: "no-repeat",
                        maskRepeat: "no-repeat",
                        WebkitMaskSize: "contain",
                        maskSize: "contain",
                        WebkitMaskPosition: "center",
                        maskPosition: "center",
                    }}
                />
            </div>
        </div>
    )
}

export default LoadingScreen;