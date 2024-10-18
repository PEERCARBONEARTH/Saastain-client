import { useCallback } from "react";
import { useApi } from "./useApi";
import { IStationaryEquipment } from "@/types/EquipmentMobility";
import { IApiEndpoint, IApiResponse } from "@/types/Api";

type TSaveStationaryEquipment = Pick<IStationaryEquipment, "equipmentName" | "fuelState" | "fuelType" | "fuelUnit" | "category" | "accessibility"> & {
	userId: string;
	companyId: string;
	branchId?: string;
};

const useEquipmentMobilityUtils = () => {
	const { post, del } = useApi();

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

	return { saveNewStationaryEquipment, removeStationaryEquipmentItem };
};

export default useEquipmentMobilityUtils;
