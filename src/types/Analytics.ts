export enum ScopeDataKeys {
	CURRENT_YEAR = "current-year",
	BASE_YEAR = "base-year",
}

export interface ScopeOneDataValues {
	bioEnergy: number;
	fuels: number;
	fugitive: number;
	processEmission: number;
	fleet: number;
}

export interface ScopeTwoDataValues {
	electricityTotal: number;
	heatAndSteamTotal: number;
	cooling: number;
	year: number;
}

export type TScopeOneDataTotals = {
	[ScopeDataKeys.CURRENT_YEAR]: ScopeOneDataValues;
	[ScopeDataKeys.BASE_YEAR]: ScopeOneDataValues;
};


export type TScopeTwoDataTotals = {
	[ScopeDataKeys.CURRENT_YEAR]: ScopeTwoDataValues;
	[ScopeDataKeys.BASE_YEAR]: ScopeTwoDataValues;
};