import { ExpirationPlugin, NetworkFirst, Serwist } from "serwist";
import { PAGES_CACHE_NAME, defaultCache } from "@serwist/next/worker";

const serwist = new Serwist({
	skipWaiting: true,
	clientsClaim: true,
	navigationPreload: true,
	runtimeCaching: [
		{
			matcher: ({ request, url: { pathname }, sameOrigin }) => request.headers.get("RSC") === "1" && request.headers.get("Next-Router-Prefetch") === "1" && sameOrigin && !pathname.startsWith("/api/"),
			// NEW: an initialized instance.
			handler: new NetworkFirst({
				cacheName: PAGES_CACHE_NAME.rscPrefetch,
				plugins: [
					new ExpirationPlugin({
						maxEntries: 32,
						maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
					}),
				],
			}),
		},
		{
			matcher: ({ request, url: { pathname }, sameOrigin }) => request.headers.get("RSC") === "1" && sameOrigin && !pathname.startsWith("/api/"),
			// NEW: an initialized instance.
			handler: new NetworkFirst({
				cacheName: PAGES_CACHE_NAME.rsc,
				plugins: [
					new ExpirationPlugin({
						maxEntries: 32,
						maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
					}),
				],
			}),
		},
		{
			matcher: ({ request, url: { pathname }, sameOrigin }) => request.headers.get("Content-Type")?.includes("text/html") && sameOrigin && !pathname.startsWith("/api/"),
			// NEW: an initialized instance.
			handler: new NetworkFirst({
				cacheName: PAGES_CACHE_NAME.html,
				plugins: [
					new ExpirationPlugin({
						maxEntries: 32,
						maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
					}),
				],
			}),
		},

		...defaultCache,
	],
});

serwist.addEventListeners();
