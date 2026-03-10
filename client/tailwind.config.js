import { content as _content, plugin } from "flowbite-react/tailwind";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["src/**/*.{js,jsx,ts,tsx}", _content()],
  theme: {
    extend: {},
  },
  plugins: [plugin()],
};