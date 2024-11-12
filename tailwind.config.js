/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      spacing: {
        108: "27rem",
        120: "30rem",
        132: "33rem",
        144: "36rem",
        156: "38rem",
        168: "40rem",
        180: "42rem",
        192: "44rem",
      },
    },
  },
  plugins: [],
};
