const CustomCircularProgressBar = ({ value, size = 64, stroke = 8, color = 'url(#circularBlueGradient)', bg = '#444652', textColor = '#fff' }) => {
    const radius = (size - stroke) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference * (1 - value / 100);
    return (
        <svg width={size} height={size} style={{ display: 'block', zIndex: 2, position: 'relative' }}>
            <defs>
                <linearGradient id="circularBlueGradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#3fd8ff" />
                    <stop offset="100%" stopColor="#0072ff" />
                </linearGradient>
            </defs>
            {/* خلفية الدائرة */}
            <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={bg}
                strokeWidth={stroke}
                fill="none"
            />
            {/* دائرة النسبة */}
            <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={color}
                strokeWidth={stroke}
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 0.7s cubic-bezier(.4,2,.6,1)' }}
            />
            {/* النسبة في المنتصف */}
            <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dy="0.35em"
                fontSize={size * 0.32}
                fontWeight="bold"
                fill={textColor}
                style={{ textShadow: '0 1px 4px #222' }}
            >
                {Math.round(value)}%
            </text>
        </svg>
    );
}

export default CustomCircularProgressBar;