import { useCallback } from "react";
import { useApi } from "./useApi";
import { IApiEndpoint, IApiResponse } from "@/types/Api";
import { IVehicleEmissionData } from "@/types/VehicleEmissions";

const useEquipmentMobilityUtils = () => {
	const { get, post } = useApi();

	const getVehicleModelsByMake = useCallback(
		async (make: string) => {
			const resp = await get<IApiResponse<{ models: string[] }>>({ endpoint: IApiEndpoint.MOBILITY_QUERY_MODELS_BY_MAKE, queryParams: { make } });

			return resp.data;
		},
		[get]
	);

	const addNewModelToMake = useCallback(
		async (data: Pick<IVehicleEmissionData, "make" | "model">) => {
			const resp = await post<IApiResponse>({ endpoint: IApiEndpoint.MOBILITY_ADD_NEW_MODEL_TO_MAKE, data });

			return resp.data;
		},
		[post]
	);

	const createNewVehicleEmissionData = useCallback(
		async (data: Omit<IVehicleEmissionData, "id" | "createdAt" | "updatedAt">) => {
			const resp = await post<IApiResponse<IVehicleEmissionData>>({ endpoint: IApiEndpoint.VEHICLE_EMISSIONS_CREATE, data });

			return resp.data;
		},
		[post]
	);

	return { getVehicleModelsByMake, addNewModelToMake, createNewVehicleEmissionData };
};

export default useEquipmentMobilityUtils;
