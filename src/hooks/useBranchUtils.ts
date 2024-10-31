import { useCallback } from "react";
import { useApi } from "./useApi";
import { IApiEndpoint, IApiResponse } from "@/types/Api";
import { IBranch } from "@/types/Company";

type TBulkAddBranches = {
	companyId: string;
	dataItems: {
		name: string;
		type: string;
		address: string;
	}[];
};

const useBranchUtils = () => {
	const { post } = useApi();

	const addBranchToCompany = useCallback(
		async (name: string, type: string, address: string, companyId: string) => {
			const resp = await post<IApiResponse<IBranch>>({ endpoint: IApiEndpoint.CREATE_NEW_COMPANY_BRANCH, data: { name, type, address, companyId } });

			return resp.data;
		},
		[post]
	);

	const bulkAddBranchesToCompany = useCallback(
		async (data: TBulkAddBranches) => {
			const resp = await post<IApiResponse<Record<string, any>>>({ endpoint: IApiEndpoint.CREATE_NEW_BRANCHES_BULK, data });

			return resp.data;
		},
		[post]
	);

	return { addBranchToCompany, bulkAddBranchesToCompany };
};

export default useBranchUtils;
