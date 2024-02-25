import { useCallback } from "react";
import { useApi } from "./useApi";
import { IScopeOneFleet, IScopeOneFuels, IScopeOneQueryFleet, IScopeOneQueryFuel } from "@/types/Accounting";
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

	return {
		queryFuelsInfo,
		saveFuelsInfo,
		queryFleetInfo,
		saveFleetInfo,
	};
};

export default useAccountingDataUtils;
