import type { Config } from "tailwindcss";
const { nextui } = require("@nextui-org/react");

const config: Config = {
	content: ["./public/index.html", "./app/**/*.{ts,tsx,js,jsx}", "./src/**/*.{js,ts,tsx,jsx}", "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			extend: {
				fontFamily: {
					nunito: ["Nunito", "sans-serif"],
				},
			},
		},
	},
	plugins: [
		nextui({
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
							DEFAULT: "#669679",
							foreground: "#ffffff",
						},
					},
				},
			},
		}),
	],
};
export default config;