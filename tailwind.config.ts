import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'home': "url('/image.png')",
        'land': "url('/honkai-star-wallpaper-astral-express.jpg')",
      },
    },
  },
  plugins: [],
} satisfies Config;
