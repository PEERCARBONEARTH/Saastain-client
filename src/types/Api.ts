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

	VENDOR_INTEREST = "vendor/interest",
	VENDOR_INTEREST_DETAILS = "vendor/interest/by-id",
	VENDOR_PROFILE_REGISTER = "vendor/register",

	GET_GREEN_PRODUCT_CATEGORIES = "product/get-product-categories",
	GET_SDGS = "product/get-sdgs",

	ADD_PRODUCT = "product/add-product",
	//GET_VENDOR_PRODUCTS = "product/get-products/vendor"
	GET_VENDOR_PRODUCTS = "product/get-products",
	GET_VENDOR_PRODUCTS_BY_ID = "product/get-product-by-id",

	// Orders
	GET_ORDERS_BY_VENDOR = "orders/by-vendor",
	GET_ORDER_DETAILS = "orders/details",
	GET_ORDER_TIMELINES = "orders/timeline/all",
	GET_ORDER_SITE_VISIT_SCHEDULE = "orders/site-visit/get-by-order",
	UPDATE_NEW_QUOTATION = "orders/update/new-quotation",
	SAVE_NEW_ORDER_TIMELINE = "orders/timeline/new",
	GET_QUOTATION_ITEM = "orders/quotations/one"
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
