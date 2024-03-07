export enum RequestHeader {
	AUTHORIZATION = "Authorization",
}

interface IApiSuccessResponse<T> {
	status: "success";
	msg: string;
	data?: T;
}
interface IApiErrorResponse {
	status: "error" | "failure" | "not-ready";
	msg: string;
}

export type IApiResponse<T = any> = IApiSuccessResponse<T> | IApiErrorResponse;

export const enum IApiEndpoint {
	LOGIN = "auth/login",
	VERIFY_EMAIL = "auth/verify-email",
	REQUEST_PASSWORD_RESET = "auth/request-password-reset",
	VERIFY_PASSWORD_RESET_TOKEN = "auth/verify-reset-password-token",
	RESET_PASSWORD = "auth/reset-password",

	GET_USERS = "users",
	USER_PROFILE = "users/info",
	CREATE_USER = "users",
	CREATE_COMPANY_ADMIN = "users/company-admin",
	CREATE_USER_BY_ADMIN = "users/admin/new-user",
	SUSPEND_ACCOUNT = "users/admin/suspend-user",
	ACTIVATE_ACCOUNT = "users/admin/activate-user",
	MARK_USER_ACCOUNT_AS_DELETED = "users/admin/mark-user-as-deleted",
	MARK_ACCOUNT_AS_VERIFIED = "users/admin/mark-user-as-verified",
	GET_COMPANY_USERS = "users/company",
	UPDATE_USER_TO_ADMIN = "users/admin/update-user-to-admin",
	UPDATE_USER_TO_SYSTEM_ADMIN = "users/admin/update-user-to-system-admin",
	GET_COMPANY_USERS_PAGINATED = "users/company/fetch-with-filters",

	CREATE_COMPANY = "company",
	GET_COMPANIES = "company",
	GET_COMPANY = "company/profile",
	ADMIN_CREATE_COMPANY = "company/admin/create",
	ADMIN_UPDATE_USER_WITH_COMPANY = "company/admin/add-user-to-company",

	WAITLIST = "waitlist",

	SCOPE_ONE_QUERY_FUELS = "scope-one/fuels/query",
	SCOPE_ONE_QUERY_FLEET = "scope-one/vehicles/query",

	SCOPE_ONE_SAVE_FUELS = "scope-one/fuels/save",
	SCOPE_ONE_SAVE_FLEET = "scope-one/vehicles/save",
	SCOPE_ONE_SAVE_PROCESS_EMISSION = "scope-one/process-emission/save",
	SCOPE_ONE_SAVE_FUGITIVE_EMISSION = "scope-one/fugitive/save",

	GET_SCOPE_ONE_DATA_COMPANY_WITH_FETCH = "scope-one/company/fetch",
	GET_SCOPE_ONE_DATA_COMPANY_WITH_FETCH_AND_PAGINATION = "scope-one/company/fetch-with-filters",

	SCOPE_TWO_SAVE_HEAT_AND_STEAM = "scope-two/heat-and-steam/save",
	SCOPE_TWO_SAVE_ELECTRICITY = "scope-two/electricity/save",

	SCOPE_TWO_QUERY_ELECTRICITY = "scope-two/electricity/query",

	GET_SCOPE_TWO_DATA_COMPANY_WITH_FETCH = "scope-two/company/fetch",
	GET_SCOPE_TWO_DATA_COMPANY_WITH_FETCH_AND_PAGINATION = "scope-two/company/fetch-with-filters",

	GET_TOTAL_SCOPE_ONE_DATA_BY_YEAR = "scopes-data/total-scope-one-data-for-company-by-year",
	GET_TOTAL_SCOPE_TWO_DATA_BY_YEAR = "scopes-data/total-scope-two-data-for-company-by-year",

	GET_TOTAL_SCOPE_ONE_DATA_BY_YEAR_MONTHLY = "scopes-data/total-monthly-scope-one-data-for-company-by-year",
	GET_TOTAL_SCOPE_TWO_DATA_BY_YEAR_MONTHLY = "scopes-data/total-monthly-scope-two-data-for-company-by-year",

	DOWNLOAD_EMISSIONS_REPORT = "scopes-data/reports",

	INVITES = "invites",
	INVITES_COMPANY = "invites/company/all",
	INVITES_COMPANY_PAGINATED = "invites/company/paginated",
	NEW_COMPANY_USER_INVITE = "invites/company/new/user",
	ACCEPT_INVITE = "invites/company/accept",
	GET_INVITE_INFO = "invites/info/code",
	REJECT_INVITE = "invites/company/reject",
	REVOKE_INVITE = "invites/revoke",
}

export interface IMethodParams {
	endpoint: IApiEndpoint;
	queryParams?: Object;
	signal?: AbortSignal;
	data?: any;
	checkAuth?: boolean;
	customHeaders?: Record<string, string>;
}

export const getEndpoint = (endpoint: IApiEndpoint) => `/${endpoint}`;
