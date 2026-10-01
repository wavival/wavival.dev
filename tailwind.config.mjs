/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        surface: "var(--surface)",
        line: "var(--line)",
        "line-2": "var(--line-2)",
        tint: "var(--tint)",
        ink: "var(--text)",
        muted: "var(--muted)",
        link: "var(--link)",
        "link-h": "var(--link-h)",
        blue: "var(--blue)",
        "blue-text": "var(--blue-text)",
        btn: "var(--btn)",
        "btn-h": "var(--btn-h)",
        ok: "var(--ok)",
      },
      fontFamily: {
        display: ["Raleway", "sans-serif"],
        body: ["Poppins", "sans-serif"],
      },
      maxWidth: {
        container: "var(--container)",
      },
      borderRadius: {
        control: "var(--radius-control)",
      },
      spacing: {
        gut: "var(--gut)",
        sec: "var(--sec)",
        nav: "var(--nav-h)",
      },
    },
  },
  plugins: [],
};
