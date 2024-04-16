import { useCallback } from "react";
import { useApi } from "./useApi";
import { IApiEndpoint, IApiResponse } from "@/types/Api";
import { CreateCompanyFormValues } from "@/types/Forms";

const useCompanyUtils = () => {
	const { post } = useApi();

	const createCompany = useCallback(async ({ userId, companyName, primaryEmail, location, description, phoneNo }: CreateCompanyFormValues) => {
		const response = await post<IApiResponse>({
			endpoint: IApiEndpoint.CREATE_COMPANY,
			data: { userId, companyName, primaryEmail, phoneNo, location, description },
			checkAuth: true,
		});
		return response.data;
	}, []);

	return {
		createCompany,
	};
};

export default useCompanyUtils;
