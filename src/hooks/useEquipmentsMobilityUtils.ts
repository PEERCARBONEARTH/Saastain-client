import { useCallback } from "react";
import { useApi } from "./useApi";
import { IFleetMobility, IStationaryEquipment } from "@/types/EquipmentMobility";
import { IApiEndpoint, IApiResponse } from "@/types/Api";

type TSaveStationaryEquipment = Pick<IStationaryEquipment, "equipmentName" | "fuelState" | "fuelType" | "fuelUnit" | "category" | "accessibility"> & {
	userId: string;
	companyId: string;
	branchId?: string;
};

type TSaveFleetMobility = Pick<IFleetMobility, "make" | "accessibility" | "category"> & {
	model: string;
	userId: string;
	companyId: string;
	branchId?: string;
};

const useEquipmentMobilityUtils = () => {
	const { post, del, get } = useApi();

	const saveNewStationaryEquipment = useCallback(
		async (data: TSaveStationaryEquipment) => {
			const resp = await post<IApiResponse<IStationaryEquipment>>({ endpoint: IApiEndpoint.SAVE_NEW_STATIONARY_EQUIPMENT_ITEM, data });

			return resp.data;
		},
		[post]
	);

	const removeStationaryEquipmentItem = useCallback(
		async (id: string) => {
			const resp = await del<IApiResponse>({ endpoint: `${IApiEndpoint.REMOVE_STATIONARY_EQUIPMENT_ITEM}/${id}` as IApiEndpoint });

			return resp.data;
		},
		[del]
	);

	const getVehicleModelsByMake = useCallback(
		async (make: string) => {
			const resp = await get<IApiResponse<{ models: string[] }>>({ endpoint: IApiEndpoint.MOBILITY_QUERY_MODELS_BY_MAKE, queryParams: { make } });

			return resp.data;
		},
		[get]
	);

	const saveFleetMobilityItem = useCallback(
		async (data: TSaveFleetMobility) => {
			const resp = await post<IApiResponse<IFleetMobility>>({ endpoint: IApiEndpoint.MOBILITY_SAVE_NEW, data });

			return resp.data;
		},
		[post]
	);

	const removeMobilityItem = useCallback(
		async (id: string) => {
			const resp = await del<IApiResponse<undefined>>({ endpoint: `${IApiEndpoint.MOBILITY_REMOVE_ITEM}/${id}` as IApiEndpoint });

			return resp.data;
		},
		[del]
	);

	return { saveNewStationaryEquipment, removeStationaryEquipmentItem, getVehicleModelsByMake, saveFleetMobilityItem, removeMobilityItem };
};

export default useEquipmentMobilityUtils;
