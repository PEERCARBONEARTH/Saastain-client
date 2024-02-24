import { useCallback } from "react";
import { useApi } from "./useApi";
import { IScopeOneFuels, IScopeOneQueryFuel } from "@/types/Accounting";
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

	return {
		queryFuelsInfo,
		saveFuelsInfo,
	};
};

export default useAccountingDataUtils;
