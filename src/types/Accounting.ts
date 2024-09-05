export enum AccountingReportPeriod {
	ONE_MONTH = "one-month",
	TWO_MONTHS = "two-months",
	THREE_MONTHS = "three-months",
	SIX_MONTHS = "six-months",
	ONE_YEAR = "one-year",
	TWO_YEARS = "two-years",
	THREE_YEARS = "three-years",
	CURRENT_YEAR = "current-year",
}

export interface IScopesData {
	scopeOne: {
		bioEnergy: number;
		fuels: number;
		fugitive: number;
		processEmission: number;
		fleet: number;
	};
	scopeTwo: {
		electricityTotal: number;
		heatAndSteamTotal: number;
		coolingTotal: number;
	};
}
