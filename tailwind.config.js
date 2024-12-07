/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors:{
        "white-color": "var(--white-color)",
        "black-color": "var(--black-color)",
        "primary-red": "var(--primary-red)",
        "primary-blue": "var(--primary-blue)",
        "primary-yellow": "var(--primary-yellow)",
        "primary-light-white":"var(--primary-light-white)",
        "primary-dark-white":"var(--primary-dark-white)",
        "primary-green": "var(--primary-green)",
        "input-gray":"var(--input-gray)",
        "background-color":"var(--background-color)",
        "footer-color":"var(--footer-color)",
        "menu-text-color":"var(--menu-text-color)",
        "table-buttons-color":"var(--table-buttons-color)",
        "table-header-bg":"var(--table-header-bg)",
        "search-box-background":"var(--search-box-background)",
        "light-black-color":"var(--light-black-color)",
      }
    },
  },
  plugins: [],
}

