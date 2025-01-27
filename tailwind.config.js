export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        blackColor: "#15171C",
      },
    },
  },
  plugins: [],
  darkMode: ["selector", '[data-bs-theme="dark"]'],
};
