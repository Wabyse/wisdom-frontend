const TmsSingleDataTemplate = ({title, value, cardAdditionalCSS="", valueAdditionalCSS="", titleAdditionalCSS="bg-gradient-to-b from-wisdomLighterOrange to-wisdomLightOrange"}) => {
    return (
        <div className={cardAdditionalCSS}>
            <div className={`text-white text-center rounded p-2 ${titleAdditionalCSS}`}>
                {title}
            </div>
            <div className={`border-black p-2 border-2 rounded text-center font-bold mt-2 ${valueAdditionalCSS}`}>{value}</div>
        </div>
    )
}

export default TmsSingleDataTemplate;