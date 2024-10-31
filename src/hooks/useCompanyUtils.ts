import { useCallback } from "react";
import { useApi } from "./useApi";
import { IApiEndpoint, IApiResponse } from "@/types/Api";
import { CreateCompanyFormValues } from "@/types/Forms";
import { ICompany } from "@/types/Company";

const useCompanyUtils = () => {
	const { post } = useApi();

	const createCompany = useCallback(async ({ userId, companyName, primaryEmail, location, description, phoneNo }: CreateCompanyFormValues) => {
		const response = await post<IApiResponse<ICompany>>({
			endpoint: IApiEndpoint.CREATE_COMPANY,
			data: { userId, companyName, primaryEmail, phoneNo, location, description },
			checkAuth: true,
		});
		return response.data;
	}, []);

	const updateCompanyProfile = useCallback(
		async (data: Partial<ICompany>) => {
			const resp = await post<IApiResponse<ICompany>>({ endpoint: IApiEndpoint.UPDATE_COMPANY_PROFILE, data });

			return resp.data;
		},
		[post]
	);

	return {
		createCompany,
		updateCompanyProfile,
	};
};

export default useCompanyUtils;
