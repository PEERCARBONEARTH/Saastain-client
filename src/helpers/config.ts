import { IConfiguration } from "@/types/Configuration";

const defaultModules = {
	Overview: {
		Dashboard: true,
	},
	Accounting: {
		"Add Data": true,
		"Data List": true,
	},
	Analytics: {
		"GHG Analytics": false,
		"ESG Reports": false,
	},
	ActionPlan: {
		"Net Zero": false,
		"My Projects": false,
	},
	GreenFinancing: {
		Marketplace: false,
		"Loan Requests": false,
	},
	Company: {
		Profile: true,
		Users: false,
		Notifications: false,
	},
};

export const defaultConfigForCompany = {
    id: "default",
    createdAt: "1970-01-01",
    updatedAt: "1970-01-01",
    modules: defaultModules,
    users: {},
    company: null
} as IConfiguration
