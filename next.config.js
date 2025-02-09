const { PHASE_DEVELOPMENT_SERVER, PHASE_PRODUCTION_BUILD } = require("next/constants");

/** @type {import('next').NextConfig} */
const nextConfig = {
	output: "standalone",
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "firebasestorage.googleapis.com",
				port: "",
			},
		],
	},
	experimental: {
		optimizePackageImports: ["date-fns", "react-icons/*", "lucide-react"]
	},
};

/** @type {(phase: string, defaultConfig: import("next").NextConfig) => Promise<import("next").NextConfig>} */
module.exports = async (phase) => {
	if (phase === PHASE_DEVELOPMENT_SERVER || phase === PHASE_PRODUCTION_BUILD) {
		const withSerwist = (await import("@serwist/next")).default({
			cacheOnNavigation: true,
			disable: process.env.NODE_ENV === "development",
			swSrc: "src/sw.ts",
			swDest: "public/sw.js",
			register: true,
		});
		return withSerwist(nextConfig);
	}

	return nextConfig;
};
