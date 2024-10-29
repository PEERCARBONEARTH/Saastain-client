import type { Config } from "tailwindcss";
const { nextui } = require("@nextui-org/react");

const config: Config = {
	content: ["./public/index.html", "./app/**/*.{ts,tsx,js,jsx}", "./src/**/*.{js,ts,tsx,jsx}", "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			fontFamily: {
				nunito: ["Nunito", "sans-serif"],
			},
			colors: {
				"saastain-brown": "#CFA16C",
				"saastain-green": "#133726",
				"saastain-gray": "#A7B3A7",
			},
		},
	},
	plugins: [
		nextui({
			darkMode: true,
			themes: {
				saastain: {
					extend: "light",
					colors: {
						primary: {
							50: "#dfeeea",
							100: "#b1d6cb",
							200: "#81bcaa",
							300: "#56a28a",
							400: "#3c8f75",
							500: "#2b7c62",
							600: "#277057",
							700: "#22614a",
							800: "#1c523d",
							900: "#133726",
							grey: "#A7B3A7",
							brown: "#CC8830",
							green: "#A7B3A7",
							DEFAULT: "#5e896e",
							foreground: "#FFFEFF",
						},
						"saastain-brown": "#CFA16C",
						"saastain-green": "#133726",
						"saastain-gray": "#A7B3A7",
					},
				},
			},
		}),
	],
};
export default config;
