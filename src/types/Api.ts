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
	REQUEST_PASSWORD_RESET = "auth/request-password-reset",
	VERIFY_PASSWORD_RESET_TOKEN = "auth/verify-reset-password-token",
	RESET_PASSWORD = "auth/reset-password",

	GET_USERS = "users",
	USER_PROFILE = "users/info",
	CREATE_USER = "users",
	CREATE_USER_BY_ADMIN = "users/admin/new-user",
	SUSPEND_ACCOUNT = "users/admin/suspend-user",
	ACTIVATE_ACCOUNT = "users/admin/activate-user",
	MARK_USER_ACCOUNT_AS_DELETED = "users/admin/mark-user-as-deleted",
	MARK_ACCOUNT_AS_VERIFIED = "users/admin/mark-user-as-verified",
	GET_COMPANY_USERS = "users/company",
	UPDATE_USER_TO_ADMIN = "users/admin/update-user-to-admin",
	UPDATE_USER_TO_SYSTEM_ADMIN = "users/admin/update-user-to-system-admin",

	GET_COMPANIES = "company",
	GET_COMPANY = "company/profile",
	ADMIN_CREATE_COMPANY = "company/admin/create",
	ADMIN_UPDATE_USER_WITH_COMPANY = "company/admin/add-user-to-company",

	WAITLIST = "waitlist",
}

export interface IMethodParams {
	endpoint: IApiEndpoint;
	queryParams?: Object;
	signal?: AbortSignal;
	data?: any;
	checkAuth?: boolean;
}

export const getEndpoint = (endpoint: IApiEndpoint) => `/${endpoint}`;
