import { useCallback } from "react";
import { useApi } from "./useApi";
import { IScopeOneFleet, IScopeOneFuels, IScopeOneFugitiveEmission, IScopeOneProcessEmission, IScopeOneQueryFleet, IScopeOneQueryFuel, IScopeTwoElectricity, IScopeTwoQueryElectricity } from "@/types/Accounting";
import { IApiEndpoint, IApiResponse } from "@/types/Api";

const useAccountingDataUtils = () => {
	const { get, post } = useApi();

	const queryFuelsInfo = useCallback(async <T = any>(queryVals: IScopeOneQueryFuel) => {
		const resp = await get<IApiResponse<Array<T> | T>>({ endpoint: IApiEndpoint.SCOPE_ONE_QUERY_FUELS, queryParams: queryVals });

		return resp.data;
	}, []);

	const saveFuelsInfo = useCallback(async (data: Omit<IScopeOneFuels, "id" | "createdAt" | "updatedAt"> & { date: string; CompanyId: string }) => {
		const resp = await post<IApiResponse<IScopeOneFuels>>({ endpoint: IApiEndpoint.SCOPE_ONE_SAVE_FUELS, data });

		return resp.data;
	}, []);

	const queryFleetInfo = useCallback(async <T = any>(queryVals: IScopeOneQueryFleet) => {
		const resp = await get<IApiResponse<Array<T> | T>>({ endpoint: IApiEndpoint.SCOPE_ONE_QUERY_FLEET, queryParams: queryVals });

		return resp.data;
	}, []);

	const saveFleetInfo = useCallback(async (data: Omit<IScopeOneFleet, "id" | "createdAt" | "updatedAt"> & { date: string; CompanyId: string }) => {
		const resp = await post<IApiResponse<IScopeOneFleet>>({ endpoint: IApiEndpoint.SCOPE_ONE_SAVE_FLEET, data });

		return resp.data;
	}, []);

	const saveProcessEmission = useCallback(async (data: Omit<IScopeOneProcessEmission, "id" | "createdAt" | "updatedAt"> & { date: string; CompanyId: string }) => {
		const resp = await post<IApiResponse<IScopeOneProcessEmission>>({ endpoint: IApiEndpoint.SCOPE_ONE_SAVE_PROCESS_EMISSION, data });

		return resp.data;
	}, []);

	const saveFugitiveEmission = useCallback(async (data: Omit<IScopeOneFugitiveEmission, "id" | "createdAt" | "updatedAt"> & { date: string; CompanyId: string }) => {
		const resp = await post<IApiResponse<IScopeOneFugitiveEmission>>({ endpoint: IApiEndpoint.SCOPE_ONE_SAVE_FUGITIVE_EMISSION, data });

		return resp.data;
	}, []);

	const saveHeatAndSteam = useCallback(async (data: Omit<IScopeTwoElectricity, "id" | "createdAt" | "updatedAt"> & { date: string; CompanyId: string }) => {
		const resp = await post<IApiResponse<IScopeTwoElectricity>>({ endpoint: IApiEndpoint.SCOPE_TWO_SAVE_HEAT_AND_STEAM, data });

		return resp.data;
	}, []);

	const queryElectricityInfo = useCallback(async <T = any>(queryVals: IScopeTwoQueryElectricity) => {
		const resp = await get<IApiResponse<Array<T> | T>>({ endpoint: IApiEndpoint.SCOPE_TWO_QUERY_ELECTRICITY, queryParams: queryVals });

		return resp.data;
	}, []);

	const saveElectricityInfo = useCallback(async (data: Omit<IScopeTwoElectricity, "id" | "createdAt" | "updatedAt"> & { date: string; CompanyId: string }) => {
		const resp = await post<IApiResponse<IScopeTwoElectricity>>({ endpoint: IApiEndpoint.SCOPE_TWO_SAVE_ELECTRICITY, data });

		return resp.data;
	}, []);

	return {
		queryFuelsInfo,
		saveFuelsInfo,
		queryFleetInfo,
		saveFleetInfo,
		saveProcessEmission,
		saveFugitiveEmission,
		saveHeatAndSteam,
		queryElectricityInfo,
		saveElectricityInfo,
	};
};

export default useAccountingDataUtils;
