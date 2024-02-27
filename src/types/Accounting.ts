import { ICompany } from "./Company";

type ScopeOneQueryFuelKeys = "fuel" | "fuelState" | "unit" | "value";

type ScopeOneQueryFleetValues = "TypeLevel1" | "TypeLevel2" | "fuel" | "unit" | "value";

export type IScopeOneQueryFuel = Record<ScopeOneQueryFuelKeys, string | number> | {};

export type IScopeOneQueryFleet = Record<ScopeOneQueryFleetValues, string | number> | {};

type ScopeTwoQueryElectricityKeys = "EmissionSource" | "country" | "unit" | "isRenewable" | "value";

export type TRenewable = "true" | "false";

export type IScopeTwoQueryElectricity = Record<ScopeTwoQueryElectricityKeys, string | number | TRenewable> | {};

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

export interface IScopeOneProcessEmission {
	id: string;
	createdAt: string;
	updatedAt: string;
	emissionSource: string;
	emissionName: string;
	wasteGas: string;
	unit: string;
	gasAmount: number;
	c02KgRemoved?: number;
}

export interface IScopeOneFleet {
	id: string;
	createdAt: string;
	updatedAt: string;
	typeLevel1: string;
	typeLevel2: string;
	fuelType: string;
	distanceCovered: number;
	c02KgEmitted: number;
	c02KgRemoved?: number;
}

export interface IScopeOneFugitiveEmission {
	id: string;
	createdAt: string;
	updatedAt: string;
	emissionSource: string;
	emissionName: string;
	emissionGas: string;
	unit: string;
	gasEmitted: number;
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
	scopeOneFuels?: IScopeOneFuels;
	scopeOneVehicles?: IScopeOneFleet;
	scopeOneProcessEmission?: IScopeOneProcessEmission;
	scopeOneFugitive?: IScopeOneFugitiveEmission;
}

export enum ScopeOneComponentKeys {
	FUELS = "scopeOneFuels",
	FLEET = "scopeOneVehicles",
	PROCESS_EMISSION = "scopeOneProcessEmission",
	FUGITIVE_EMISSION = "scopeOneFugitive",
}

export type IScopeOneComponent = Record<ScopeOneComponentKeys, IScopeOneFleet | IScopeOneFugitiveEmission | IScopeOneProcessEmission | IScopeOneFuels>;

export interface IScopeTwoElectricity {
	id: string;
	createdAt: string;
	updatedAt: string;
	emissionSource: string;
	units: string;
	amount: number;
	country?: string;
	totalEmissions?: number;
	c02KgRemoved?: number;
}

export enum ScopeTwoCategory {
	ELECTRICITY = "electricity",
	HEAT_AND_STEAM = "heat_and_steam",
	COOLING = "cooling",
}

export interface IScopeTwo {
	id: string;
	createdAt: string;
	updatedAt: string;
	scope: ScopeVariant;
	category: ScopeTwoCategory;
	date: string;
	company: ICompany;
	scopeTwoElectricity: IScopeTwoElectricity;
}
