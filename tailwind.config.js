const merge = require("lodash/merge");
const commonUiConfig = require("@govtechsg/tradetrust-ui-components/build/tailwind");

module.exports = merge(commonUiConfig, {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./node_modules/@govtechsg/tradetrust-ui-components/src/**/*.tsx"],
  theme: {
    container: (theme) => ({
      center: true,
      padding: theme("spacing.4"),
    }),
    fontFamily: {
      sans: ["Gilroy-Medium", "sans-serif"],
      display: ["Gilroy-Medium", "sans-serif"],
      body: ["Gilroy-Medium", "sans-serif"],
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
});
