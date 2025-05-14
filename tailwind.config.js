// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx,html}"],
  theme: {
    extend: {
      colors: {
        wisdomLightOrange: "#fd5f1c",
        wisdomOrange: "#d34102",
        wisdomDarkOrange: "#c63b00",
        formColor: "rgb(230, 235, 239)",
        watomsBlue: "#001c56",
        watomsLightBlue: "#0d3486",
        wisdomNewOrange: "#eb5812",
      },
      fontFamily: {
        sans: ['"Cairo"', 'ui-sans-serif', 'system-ui'],
      },
      animation: {
        overlaySlide: "overlaySlide 3s linear infinite",
      },
      keyframes: {
        overlaySlide: {
          "0%": { top: "-100%" },
          "100%": { top: "100%" },
        },
      },
    },
  },
  plugins: [],
};
