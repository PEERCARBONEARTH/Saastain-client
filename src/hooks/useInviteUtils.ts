import { useCallback } from "react";
import { useApi } from "./useApi";
import { IApiEndpoint, IApiResponse } from "@/types/Api";
import { IInvite } from "@/types/Invite";

const useInviteUtils = () => {
	const { post } = useApi();

	const inviteUserToCompany = useCallback(async (name: string, email: string, userRole: string) => {
		const resp = await post<IApiResponse<IInvite>>({ endpoint: IApiEndpoint.NEW_COMPANY_USER_INVITE, data: { name, email, userRole } });

		return resp.data;
	}, []);

	return { inviteUserToCompany };
};

export default useInviteUtils;
