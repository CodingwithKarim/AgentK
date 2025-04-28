/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          chatBg: {
            light: "rgba(255,255,255,0.3)",
            dark: "rgba(32,32,35,0.6)",
          },
        },
      },
    },
    variants: {
      extend: {
        outline: ['focus-visible'],
        ringWidth: ['focus-visible'],
        borderColor: ['focus-visible'],
      },
    },
  }