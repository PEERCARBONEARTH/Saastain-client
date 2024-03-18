import { IApiResponse, IApiEndpoint } from "@/types/Api";
import CredentialsProvider from "next-auth/providers/credentials";
import { apiClient } from "./api-client";
import { AUTH_SECRET } from "@/env";
import { AuthOptions } from "next-auth";
import { LoginFormValues } from "@/types/Forms";

export const nextAuthOptions: AuthOptions = {
	session: {
		strategy: "jwt",
		maxAge: 2 * 24 * 60 * 60, //  days
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
				const { email, password } = credentials;

				try {
					const resp = await apiClient.post<IApiResponse<any>>({
						endpoint: IApiEndpoint.LOGIN,
						data: { email, password },
						checkAuth: false,
					});

					if (resp.data?.status === "success") {
						const userInfo = resp.data?.data?.userData;

						// check if account is active
						if (userInfo?.accountStatus !== "active") {
							throw new Error("Your account is not active! Please contact SaaStain support for assistance or try again later.");
						}

						// // confirm if company is available or not
						// if (!userInfo?.company) {
						// 	throw new Error("You are not associated with any company! Please contact SaaStain support for assistance or try again later.");
						// }

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
					
					throw new Error(err?.response?.data?.msg || err?.message || "Invalid Credentials!");
				}
			},
		}),
	
	],
	pages: {
		signIn: "/auth/login",
		error: "/auth/login",
	},
};
