import { useCallback } from "react";
import { useApi } from "./useApi";
import { IApiEndpoint, IApiResponse } from "@/types/Api";
import { ICompany } from "@/types/Company";
import { IUser } from "@/types/User";

const useCompanyUtils = () => {
	const { post, get } = useApi();

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

	return { adminCreateCompany, adminUpdateUserWithCompany, getAllCompanies };
};

export default useCompanyUtils;
