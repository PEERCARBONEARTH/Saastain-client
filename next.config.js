/** @type {import('next').NextConfig} */

const nextConfig = {
	swcMinify: true,
	output: "standalone",
};

module.exports = async () => {
	const withSerwist = (await import("@serwist/next")).default({
		cacheOnNavigation: true,
		disable: process.env.NODE_ENV === "development",
		swSrc: "src/sw.ts",
		swDest: "public/sw.js",
		register: true,
	});

	return withSerwist(nextConfig);
};
