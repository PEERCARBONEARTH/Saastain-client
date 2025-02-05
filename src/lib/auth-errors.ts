import { AuthErrorConstants } from "@/types/Auth";
import { AuthError } from "next-auth";

/**
 * Custom Error Class for Next Auth for general invalid credentials with Custom Messages
 * @description `Invalid Credentials`
 */
export class InvalidCredentialsAuthError extends AuthError {
	code = AuthErrorConstants.INVALID_CREDENTIALS;
	constructor(message: AuthErrorConstants) {
		super(message);
		this.code = message;
	}
}

export const AuthErrorMap = {
	[AuthErrorConstants.INVALID_CREDENTIALS]: "Invalid Credentials",
	[AuthErrorConstants.INACTIVE_ACCOUNT]: "Your account is not active! Please contact SaaStain support for assistance or try again later.",
	[AuthErrorConstants.INACTIVE_COMPANY]: "You can't access the SaaStain Platform at the moment, kindly contact support for assistance or try again later",
	[AuthErrorConstants.NO_COMPANY_ACCOUNT]: "You are not associated with any company! Please contact SaaStain support for assistance or try again later.",
};
