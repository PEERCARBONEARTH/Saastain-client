export interface IVehicleEmissionData {
	id: string;
	createdAt: string;
	updatedAt: string;
	make: string;
	model: string;
	co2e_gm: number;
	co2e_kg: number;
	unitDistance?: string;
}
