/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      fontFamily: {
        mono: ["Ubuntu mono", "monospace"],
        extra: ["Inter"],
      },
    },
  },
  plugins: [],
};
