const defaults = require("tailwindcss/defaultTheme");

module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["montserrat", ...defaults.fontFamily.sans],
        itc: ["itc-avant-garde-gothic-pro", "sans-serif"],
      },
      colors: {
        darkBlue: {
          DEFAULT: "#1A1F32"
        },
        viviBlue: {
          DEFAULT: "#3c65ac"
        },
        viviRed: {
          DEFAULT: "#68313f",
        },
        viviGreen: {
          DEFAULT: "#3f6831",
        },
        grayBlue: {
          DEFAULT: "#292E41"
        }
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
  ],
}