import { useCallback } from "react";
import { useApi } from "./useApi";
import { IApiEndpoint, IApiResponse } from "@/types/Api";
import { IBranch } from "@/types/Company";

const useBranchUtils = () => {
	const { post } = useApi();

	const addBranchToCompany = useCallback(async (name: string, type: string, address: string) => {
		const resp = await post<IApiResponse<IBranch>>({ endpoint: IApiEndpoint.CREATE_NEW_COMPANY_BRANCH, data: { name, type, address } });

		return resp.data;
	}, []);

	return { addBranchToCompany};
};

export default useBranchUtils;
