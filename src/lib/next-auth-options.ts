import { IApiResponse, IApiEndpoint } from "@/types/Api";
import CredentialsProvider from "next-auth/providers/credentials";
import { apiClient } from "./api-client";
import { AUTH_SECRET } from "@/env";
import { AuthOptions } from "next-auth";
import { LoginFormValues } from "@/types/Forms";

export const nextAuthOptions: AuthOptions = {
	session: {
		strategy: "jwt",
		maxAge: 2 * 24 * 60 * 60, // 30 days
	},
	secret: AUTH_SECRET,
	callbacks: {
		async jwt({ token, user, trigger, session }) {
			if (user) {
				token.user = user;
			}

			if (trigger === "update") {
				token = { ...token, ...session };
			}

			return token;
		},

		async session({ session, token }: any) {
			session.user = token.user;

			return session;
		},
	},
	providers: [
		CredentialsProvider({
			name: "Credentials",
			credentials: {},
			async authorize(credentials: LoginFormValues) {
				const { phoneNo, password } = credentials;

				try {
					const resp = await apiClient.post<IApiResponse<any>>({
						endpoint: IApiEndpoint.LOGIN,
						data: { phoneNo, password },
						checkAuth: false,
					});

					// console.log(resp.data, "69");

					if (resp.data?.status === "success") {
						const userInfo = resp.data?.data?.user;

						const token = resp.data?.data?.accessToken;
						// tokens expire in 2 days, we need to store the expiration date 
						const expirationDate = new Date();
						expirationDate.setDate(expirationDate.getDate() + 2);

                        // TODO: Implement refresh token logic both on the client and server

						const newUser = {
							...userInfo,
							token,
							tokenExpiresAt: expirationDate,
						};

						const { password, ...rest } = newUser;

						return rest;
					} else {
						throw new Error(resp.data?.msg);
					}
				} catch (err) {
					throw new Error(err?.response?.data?.msg || err?.message || "An error occurred");
				}
			},
		}),
	],
	pages: {
		signIn: "/auth/login",
		error: "/auth/login",
	},
};
