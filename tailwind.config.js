module.exports = {
  content: [`./src/**/*.{js,jsx,ts,tsx}`],
  theme: {
    container: (theme) => ({
      center: true,
      padding: theme("spacing.4"),
    }),
    extend: {
      colors: {
        blue: {
          DEFAULT: "#3B8CC5",
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
