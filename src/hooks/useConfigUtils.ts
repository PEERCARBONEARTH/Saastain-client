import { useCallback } from "react";
import { useApi } from "./useApi";
import { IApiEndpoint, IApiResponse } from "@/types/Api";

type UpdateSubModuleAccessBody = {
	moduleName: string;
	subModuleName: string;
	isActive: boolean;
};

const useConfigUtils = () => {
	const { post, put } = useApi();

	const initCompanyConfig = useCallback(
		async (companyId: string) => {
			const data = { companyId };
			const resp = await post<IApiResponse>({ endpoint: IApiEndpoint.INIT_COMPANY_CONFIGURATION, data });
			return resp.data;
		},
		[post]
	);

	const updateSubModuleAccess = useCallback(
		async (companyId: string, data: UpdateSubModuleAccessBody) => {
			const resp = await put<IApiResponse>({ endpoint: `${IApiEndpoint.UPDATE_CONFIG_SUBMODULE_COMPANY}/${companyId}` as IApiEndpoint, data });

			return resp.data;
		},
		[put]
	);

	return { initCompanyConfig, updateSubModuleAccess };
};

export default useConfigUtils;
