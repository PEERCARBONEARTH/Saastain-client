export const enum AuthErrorConstants {
	/**
	 * Error for general invalid credentials
	 * @description `Invalid Credentials`
	 */
	INVALID_CREDENTIALS = "invalid_credentials",
	/**
	 * Error for inactive user accounts
	 * @description `Your account is not active! Please contact SaaStain support for assistance or try again later.`
	 */
	INACTIVE_ACCOUNT = "inactive_account",
	/**
	 * Error for accounts with company associated
	 * @description `You are not associated with any company! Please contact SaaStain support for assistance or try again later.`
	 */
	NO_COMPANY_ACCOUNT = "no_company_account",
	/**
	 * Error for Inactive Company
	 * @description `You can't access the SaaStain Platform at the moment, kindly contact support for assistance or try again later`
	 */
	INACTIVE_COMPANY = "inactive_company",
}
