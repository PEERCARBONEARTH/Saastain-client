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
		}),
	],
};
export default config;
