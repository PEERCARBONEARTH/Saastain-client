import { IApiResponse, IApiEndpoint } from "@/types/Api";
import CredentialsProvider from "next-auth/providers/credentials";
import { API_URL, AUTH_SECRET } from "@/env";
import { LoginFormValues } from "@/types/Forms";
import { IUser } from "@/types/User";
import { NextAuthConfig } from "next-auth";
import { FirestoreAdapter } from "@auth/firebase-adapter";
import { authFirestore } from "./auth-firestore";

export const nextAuthOptions: NextAuthConfig = {
	session: {
		strategy: "jwt",
		maxAge: 2 * 24 * 60 * 60, //2 days
	},
	secret: process.env.AUTH_SECRET ?? AUTH_SECRET,
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
	adapter: FirestoreAdapter(authFirestore),
	providers: [
		CredentialsProvider({
			name: "Credentials",
			credentials: {},
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

						// check if account is active
						if (userInfo?.accountStatus !== "active") {
							throw new Error("Your account is not active! Please contact SaaStain support for assistance or try again later.");
						}

						// confirm if company is available or not
						if (!userInfo?.company && !userInfo.isCompanyAdmin) {
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
						};

						const { password, ...rest } = newUser;

						return rest;
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
