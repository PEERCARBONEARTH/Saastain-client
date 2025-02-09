import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { LoginFormValues } from "@/types/Forms";
import { API_URL, AUTH_SECRET } from "@/env";
import { IApiEndpoint, IApiResponse } from "@/types/Api";
import { IUser, SystemRole } from "@/types/User";
import { CompanyStatus } from "@/types/Company";
import { InvalidCredentialsAuthError } from "./auth-errors";
import { AuthErrorConstants } from "@/types/Auth";

export const { auth, handlers, signIn, signOut } = NextAuth({
	providers: [
		Credentials({
			name: "Credentials",
			credentials: {},
			async authorize(credentials: LoginFormValues) {
				const { email, password } = credentials;

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

					if (userInfo?.accountStatus !== "active") {
						throw new InvalidCredentialsAuthError(AuthErrorConstants.INACTIVE_ACCOUNT);
					}

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
						throw new InvalidCredentialsAuthError(AuthErrorConstants.NO_COMPANY_ACCOUNT);
					}

					if (userInfo?.company?.companyStatus !== CompanyStatus.ACTIVE) {
						throw new InvalidCredentialsAuthError(AuthErrorConstants.INACTIVE_COMPANY);
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
					throw new InvalidCredentialsAuthError(AuthErrorConstants.INVALID_CREDENTIALS);
				}
			},
		}),
	],
	session: {
		strategy: "jwt",
		maxAge: 2 * 24 * 60 * 60,
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
	pages: {
		signIn: "/auth/login",
		error: "/auth/login",
	},
});
