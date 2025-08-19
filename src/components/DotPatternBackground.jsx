const DotPatternBackground = ({
  id = "dots",         // unique pattern id
  color = "#555",      // dot color
  radius = 2,          // dot radius
  gap = 12,            // distance between dots (pattern width/height)
}) => {
  return (
    <svg
      width="100%"
      height="100%"
      style={{ position: "absolute", inset: 0, zIndex: 0 }}
    >
      <defs>
        <pattern
          id={id}
          x="0"
          y="0"
          width={gap}
          height={gap}
          patternUnits="userSpaceOnUse"
        >
          <circle cx={radius} cy={radius} r={radius} fill={color} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
};

export default DotPatternBackground;