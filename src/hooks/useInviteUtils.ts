import { IApiEndpoint, IApiResponse } from "@/types/Api"
import { useApi } from "./useApi"
import { useCallback } from "react"
import { IInvite } from "@/types/Invite"

const useInviteUtils = () => {
    const {post, get} = useApi()

    const inviteUserToCompany = useCallback(async (name: string, email: string, userRole: string) => {
		const resp = await post<IApiResponse<IInvite>>({ endpoint: IApiEndpoint.NEW_COMPANY_USER_INVITE, data: { name, email, userRole } });

		return resp.data;
	}, []);

    const acceptInvite = useCallback (async (inviteCode: string, password:string) => {
        const response = await post<IApiResponse>({
            endpoint: IApiEndpoint.ACCEPT_INVITE,
            data: {inviteCode, password},
            checkAuth: false
        })
        return response.data
    }, [])

    const getInviteInfo = useCallback (async (queryVals: { code: string }) => {
        const response = await get<IApiResponse<IInvite>>({
            endpoint: IApiEndpoint.GET_INVITE_INFO,
            queryParams: {code : queryVals.code},
            checkAuth: false
        })
        return response.data
    }, [])

    const rejectInvite = useCallback (async (inviteCode: string) => {
        const response = await post<IApiResponse>({
            endpoint: IApiEndpoint.REJECT_INVITE,
            data: {inviteCode},
            checkAuth: false
        })
        return response.data
    }, [])

    return{
        acceptInvite,
        getInviteInfo,
        rejectInvite,
        inviteUserToCompany
    }


}

export default useInviteUtils;