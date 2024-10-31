import { useCallback } from "react";
import { useApi } from "./useApi";
import { IApiEndpoint, IApiResponse } from "@/types/Api";

const useConfigUtils = () => {
	const { post } = useApi();
	const initCompanyConfig = useCallback(
		async (companyId: string) => {
			const data = { companyId };
			const resp = await post<IApiResponse>({ endpoint: IApiEndpoint.INIT_COMPANY_CONFIGURATION, data });
			return resp.data;
		},
		[post]
	);

	return { initCompanyConfig };
};

export default useConfigUtils;
