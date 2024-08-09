import { API_URL } from "@/env";
import { createAxiosClient } from "./create-axios-client";
import { getSession } from "next-auth/react";

const axiosClient = createAxiosClient({
	options: {
		baseURL: API_URL,
		timeout: 60000,
		headers: {
			"Content-Type": "application/json",
		},
	},
	getAuthToken: async () => {
		// const isServer = typeof window === "undefined";

		const session = await getSession();

		if (!session) {
			return null;
		}

		return session.user?.token;
	},
});

export default axiosClient;
