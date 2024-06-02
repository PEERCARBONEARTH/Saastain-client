const { PHASE_DEVELOPMENT_SERVER, PHASE_PRODUCTION_BUILD } = require("next/constants");

const nextConfig = {
	swcMinify: true,
	output: "standalone",
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
