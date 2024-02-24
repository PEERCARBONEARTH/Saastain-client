import { ICompany } from "./Company";

type ScopeOneQueryFuelKeys = "fuel" | "fuelState" | "unit" | "value";

export type IScopeOneQueryFuel = Record<ScopeOneQueryFuelKeys, string | number> | {};

export type IScopeOneQueryFuelResponse1 = {
	factor: number;
	fuel: string;
	fuelState: string;
	unit: string;
};

export interface IScopeOneFuels {
    id: string;
    createdAt: string;
    updatedAt: string;
	emissionSource: string;
	equipmentName: string;
	fuelState: string;
	fuelType: string;
	fuelUnit: string;
	fuelAmount: number;
	c02KgEmitted: number;
	c02KgRemoved?: number;
}

export enum ScopeVariant {
	SCOPE_ONE = "Scope 1",
	SCOPE_TWO = "Scope 2",
	SCOPE_THREE = "Scope 3",
}

export enum ScopeOneCategory {
	STATIONARY_COMBUSTION = "Stationary Combustion",
	FLEET_EMISSION = "Fleet Emission",
	FUGITIVE_EMISSION = "Fugitive Emission",
	PROCESS_EMISSION = "Process Emission",
}

export interface IScopeOne {
	id: string;
	createdAt: string;
	updatedAt: string;
    scope: ScopeVariant;
    category: ScopeOneCategory;
    date: string;
    company: ICompany;
    scopeOneFuels?: IScopeOneFuels[];
}
