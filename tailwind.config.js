module.exports = {
  purge: ["./src/**/*.ts", "./src/**/*.tsx"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    container: (theme) => ({
      center: true,
      padding: theme("spacing.4"),
    }),
    extend: {
      colors: {
        blue: {
          DEFAULT: "#375BE2",
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
