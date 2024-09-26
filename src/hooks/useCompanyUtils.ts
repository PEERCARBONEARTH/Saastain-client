import { useCallback } from "react";
import { useApi } from "./useApi";
import { IApiEndpoint, IApiResponse } from "@/types/Api";
import { CompanyStatus, ICompany } from "@/types/Company";
import { IUser } from "@/types/User";

const useCompanyUtils = () => {
	const { post, get, del, patch } = useApi();

	const adminCreateCompany = useCallback(async (info: Omit<ICompany, "id"> & { userId: string | null }) => {
		const resp = await post<IApiResponse<ICompany>>({ endpoint: IApiEndpoint.ADMIN_CREATE_COMPANY, data: info });

		return resp.data;
	}, []);

	const adminUpdateUserWithCompany = useCallback(async (userId: string, companyId: string) => {
		const resp = await post<IApiResponse<IUser>>({ endpoint: IApiEndpoint.ADMIN_UPDATE_USER_WITH_COMPANY, data: { userId, companyId } });

		return resp.data;
	}, []);

	const getAllCompanies = useCallback(async () => {
		const resp = await get<IApiResponse<ICompany[]>>({ endpoint: IApiEndpoint.GET_COMPANIES });

		return resp.data;
	}, []);

	const updateCompanyAsDeleted = useCallback(
		async (id: string) => {
			const resp = await del<IApiResponse>({ endpoint: `${IApiEndpoint.UPDATE_COMPANY_AS_DELETED}/${id}` as IApiEndpoint });

			return resp.data;
		},
		[del]
	);

	const updateCompanyStatus = useCallback(
		async (id: string, status: CompanyStatus) => {
			const resp = await patch<IApiResponse>({ endpoint: `${IApiEndpoint.UPDATE_COMPANY_STATUS}/${id}/${status}` as IApiEndpoint });

			return resp.data;
		},
		[patch]
	);

	return { adminCreateCompany, adminUpdateUserWithCompany, getAllCompanies, updateCompanyAsDeleted, updateCompanyStatus };
};

export default useCompanyUtils;
