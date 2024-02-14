/** @type {import('next').NextConfig} */

const withSerwist = require("@serwist/next").default({
	disable: process.env.NODE_ENV === "development",
	swSrc: "src/sw.ts",
	swDest: "public/sw.js",
	register: true,
});

module.exports = withSerwist({
	swcMinify: true,
	output: "standalone",
});
