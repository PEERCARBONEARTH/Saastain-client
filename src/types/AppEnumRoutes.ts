export const enum AppEnumRoutes {
	AUTH_LOGIN = "/auth/login",
	AUTH_FORGOT_PASSWORD = "/auth/forgot-password",
	AUTH_RESET_PASSWORD = "/auth/reset-password",
	AUTH_REGISTER = "/auth/register",
	CREATE_COMPANY = "/auth/create-company",
	AUTH_LOGOUT = '/auth/logout',

	APP_DASHBOARD = "/dashboard",
	APP_PROFILE = "/profile",

	APP_DATA_LIST = "/accounting/data-list",
	APP_ADD_DATA = "/accounting/add-data",

	APP_USER_PROFILE = "/company/users/profile",
	APP_USERS = "/company/users",

	APP_COMPANY = "/company/profile",

	APP_COMPANY_USER_ACCEPT_INVITE = "invites/company",

	APP_LOAN_REQUESTS = "/green-finance/loans",
	APP_LOAN_REQUESTS_APPLY = "/green-finance/loans/apply",
	APP_LOAN_REQUESTS_VIEW = "/green-finance/loans/view",

	APP_ANALYTICS_EMISSION_REPORTS = "/analytics/emission-reports",
	APP_ANALYTICS_GHG_REPORTS = "/analytics/ghg-reports",

	APP_ACTION_PLAN_NET_ZERO = "/action-plan/net-zero",

	APP_MARKETPLACE = "/green-finance/marketplace",
	APP_MARKETPLACE_VIEW = "/green-finance/marketplace/view",

	APP_NOTIFICATIONS = "/notifications",

	APP_LOBBY = "/lobby",
	APP_ONBOARDING_COMPANY = '/onboarding'
}
