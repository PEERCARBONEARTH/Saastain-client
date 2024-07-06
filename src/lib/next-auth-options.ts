import { IApiResponse, IApiEndpoint } from "@/types/Api";
import CredentialsProvider from "next-auth/providers/credentials";
import { IUser } from "@/types/User";
import { AuthOptions } from "next-auth";
import { LoginFormValues } from "@/types/Forms";
import { API_URL, AUTH_SECRET } from "@/env";

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
			// @ts-expect-error
			async authorize(credentials: LoginFormValues) {
				const { email, password } = credentials;

				try {
					const response = await fetch(`${API_URL}/${IApiEndpoint.LOGIN}`, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({ email, password }),
					});

					

					const data = (await response.json()) as IApiResponse<{
						userData: IUser;
						accessToken: string;
					}>;


					if (data?.status === "success") {
						const userInfo = data?.data?.userData;

						// console.log(userInfo)

						// check if account is active
						if (userInfo?.accountStatus !== "active") {
							throw new Error("Your account is not active! Please contact SaaStain support for assistance or try again later.");
						}

						// check if user has completed onboarding
						if (!userInfo?.vendorProfile && !userInfo?.isCompanyAdmin) {
							throw new Error("You have not completed your onboarding! Please ensure you have completed your onboarding before logging in. If you have any issues, please contact SaaStain support for assistance.");
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

						return newUser;
					} else {
						throw new Error(data?.msg);
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
