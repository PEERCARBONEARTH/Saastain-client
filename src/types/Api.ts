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
	GET_COMPANY_BRANCHES = "company/branches/company",
	CREATE_NEW_COMPANY_BRANCH = "company/branches/new",
	DELETE_COMPANY_BRANCH = "company/branch/remove",

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

	// GET SCOPE TWO DATA ITEMS
	GET_SCOPE_TWO_ELECTRICTY_DATA = "scope-two/get/electricity-data",

	// GET SCOPE ONE DATA ITEMS
	GET_SCOPE_ONE_VEHICLE_EMISSIONS_DATA = "scope-one/get/vehicles-emissions",
	GET_SCOPE_ONE_PROCESS_EMISSIONS_DATA = "scope-one/get/process-emissions",
	GET_SCOPE_ONE_FUGITIVE_EMISSIONS_DATA = "scope-one/get/fugitive-emissions",
	GET_SCOPE_ONE_FUELS_EMISSIONS_DATA = "scope-one/get/fuel-emissions",

	// UPDATE ACCOUNTING DATA
	UPDATE_SCOPE_TWO_ELECTRICITY_DATA = "scope-two/update/electricity-data",
	UPDATE_SCOPE_TWO_HEAT_AND_COOLING_DATA = "scope-two/update/heat-and-cooling-data",

	// UPDATE SCOPE ONE ACCOUNTING DATA
	UPDATE_SCOPE_ONE_VEHICLE_EMISSIONS_DATA = "scope-one/update/vehicles-emissions",
	UPDATE_SCOPE_ONE_PROCESSING_EMISSIONS_DATA = "scope-one/update/process-emissions",
	UPDATE_SCOPE_ONE_FUGITIVE_EMISSIONS_DATA = "scope-one/update/fugitive-emissions",
	UPDATE_SCOPE_ONE_FUEL_EMISSIONS_DATA = "scope-one/update/fuel-emissions",

	// BULK SAVE SCOPE TWO DATA
	BULK_SAVE_SCOPE_TWO_ELECTRICITY_DATA = "scope-two/electricity/save/bulk",
	BULK_SAVE_SCOPE_TWO_HEAT_AND_COOLING_DATA = "scope-two/heat-and-cooling/save/bulk",

	// BULK SAVE SCOPE ONE DATA
	BULK_SAVE_SCOPE_ONE_VEHICLE_EMISSIONS_DATA = "scope-one/bulk/vehicles-emissions/save",
	BULK_SAVE_SCOPE_ONE_FUGITIVE_EMISSIONS_DATA = "scope-one/bulk/fugitive-emissions/save",
	BULK_SAVE_SCOPE_ONE_PROCESSING_EMISSIONS_DATA = "scope-one/bulk/process-emissions/save",
	BULK_SAVE_SCOPE_ONE_FUEL_EMISSIONS_DATA = "scope-one/bulk/fuel-emissions/save",

	GET_GREEN_PRODUCTS = "product/get-products",
	GET_GREEN_PRODUCT_BY_ID = "product/get-product-by-id",

	// Orders
	CREATE_NEW_RFQ = "orders/rfq/new",
	CREATE_NEW_RFQ_BY_ORDER = "orders/rfq/order/new",
	GET_RFQS_BY_ORDER = "orders/rfq/all",
	GET_RFQS_BY_PRODUCT = "orders/rfq/by-product/all",

	GET_ORDERS_BY_COMPANY = "orders/by-company",
	GET_ALL_ORDERS = "orders",
	GET_ORDER_DETAILS = "orders/details",
	GET_QUOTATIONS_BY_ORDER = "orders/quotations/all",
	SAVE_NEW_ORDER_TIMELINE = "orders/timeline/new",
	GET_ORDER_TIMELINES = "orders/timeline/all",
	GET_QUOTATION_ITEM_BY_ORDER = "orders/quotations/one",
	SME_ACCEPT_QUOTATION = "orders/update/sme/accept-quote-and-order",
	SME_REJECT_QUOTATION = "orders/update/sme/reject-quote-and-order",

	APPLY_LOAN_INITIAL = "loan-applications/new",
	UPDATE_LOAN_APPLICATION = "loan-applications/new/update",
	GET_LOAN_APPLICATION_DETAILS = "loan-applications/details",
	UPDATE_LOAN_APPLICATION_TO_APPLIED = "loan-applications/update/status-applied",
	GET_LOAN_APPLICATION_ITEM_BY_ORDER = "loan-applications/get-loan/by-order",
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
