import { IApiResponse, IApiEndpoint } from "@/types/Api";
import CredentialsProvider from "next-auth/providers/credentials";
import { AUTH_SECRET } from "@/env";
import { LoginFormValues } from "@/types/Forms";
import { IUser, SystemRole } from "@/types/User";
import { AuthOptions } from "next-auth";
import { apiClient } from "./api-client";

export const nextAuthOptions: AuthOptions = {
	session: {
		strategy: "jwt",
		maxAge: 2 * 24 * 60 * 60, //2 days
	},
	secret: process.env.NEXTAUTH_SECRET ?? AUTH_SECRET,
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
					const response = await apiClient.post<
						IApiResponse<{
							userData: IUser;
							accessToken: string;
						}>
					>({ endpoint: IApiEndpoint.LOGIN, data: { email, password } });

					const data = response.data;

					if (data?.status === "success") {
						const userInfo = data?.data?.userData;

						// console.log(userInfo)

						// check if account is active
						if (userInfo?.accountStatus !== "active") {
							throw new Error("Your account is not active! Please contact SaaStain support for assistance or try again later.");
						}

						// confirm if company is available or not
						// if (!userInfo?.company || !userInfo.isCompanyAdmin) {
						// 	// If we've a user as company admin, allow them to authenticated
						// 	throw new Error("You are not associated with any company! Please contact SaaStain support for assistance or try again later.");
						// }
						if (!userInfo?.company) {
							// check if its a company admin
							if (userInfo?.isCompanyAdmin || userInfo?.systemRole === SystemRole.ADMIN || userInfo?.systemRole === SystemRole.SYSTEM_ADMIN) {
								// create session but specify that isOnboardingComplete to false
								const token = data?.data?.accessToken;
								// tokens expire in 2 days, we need to store the expiration date
								const expirationDate = new Date();
								expirationDate.setDate(expirationDate.getDate() + 2);
								const newUser = {
									...userInfo,
									token,
									tokenExpiresAt: expirationDate,
									isOnboardingComplete: false,
								} satisfies IUser;

								const { password, ...rest } = newUser;

								return rest;
							}
							// If we've a user as company admin, allow them to authenticated
							throw new Error("You are not associated with any company! Please contact SaaStain support for assistance or try again later.");
						}

						const token = data?.data?.accessToken;
						// tokens expire in 2 days, we need to store the expiration date
						const expirationDate = new Date();
						expirationDate.setDate(expirationDate.getDate() + 2);

						// TODO: Implement refresh token logic both on the client and server

						const newUser = {
							...userInfo,
							token,
							tokenExpiresAt: expirationDate,
							isOnboardingComplete: true,
						} satisfies IUser;

						const { password, ...rest } = newUser;

						return rest;
					} else {
						throw new Error(data?.msg);
					}
				} catch (err) {
					console.log("err", err);
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
