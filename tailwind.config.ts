import type { Config } from "tailwindcss";
const { heroui } = require("@heroui/react");

const config: Config = {
	content: ["./public/index.html", "./app/**/*.{ts,tsx,js,jsx}", "./src/**/*.{js,ts,tsx,jsx}", "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			fontFamily: {
				nunito: ["Nunito", "sans-serif"],
			},
		},
	},
	plugins: [
		heroui({
			darkMode: true,
			themes: {
				"saastain": {
					extend: "light",
					colors: {
						primary: {
							50: "#e6f2ed",
							100: "#c3dfd1",
							200: "#a0cbb5",
							300: "#81b69a",
							400: "#70a688",
							500: "#669679",
							600: "#5e896e",
							700: "#557961",
							800: "#4c6955",
							900: "#3d4c40",
							grey: "#A7B3A7",
							brown: "#CFA16C",
							green: "#014737",
							DEFAULT: "#669679",
							foreground: "#ffffff",
						},
						"saastain-brown": "#CFA16C",
						"saastain-green": "#5E896E",
						"saastain-gray": "#A7B3A7",
					},
				},
			},
		}),
	],
};
export default config;
