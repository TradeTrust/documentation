const merge = require("lodash/merge");
const commonUiConfig = require("@govtechsg/tradetrust-ui-components/build/tailwind");

module.exports = merge(commonUiConfig, {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./node_modules/@govtechsg/tradetrust-ui-components/src/**/*.tsx"],
  theme: {
    container: (theme) => ({
      center: true,
      padding: theme("spacing.4"),
    }),
    extend: {
      colors: {
        blue: {
          DEFAULT: "#2D5FAA",
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
});
