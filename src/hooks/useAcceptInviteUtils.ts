import { IApiEndpoint, IApiResponse } from "@/types/Api"
import { useApi } from "./useApi"
import { useCallback } from "react"

const useAcceptInviteUtils = () => {
    const {post} = useApi()

    const acceptInvite = useCallback (async (inviteCode: string, password:string) => {
        const response = await post<IApiResponse>({
            endpoint: IApiEndpoint.ACCEPT_INVITE,
            data: {inviteCode, password},
            checkAuth: false
        })
        return response.data
    }, [])

    const getInviteInfo = useCallback (async (inviteCode: string) => {
        const response = await post<IApiResponse>({
            endpoint: IApiEndpoint.GET_INVITE_INFO,
            data: {inviteCode},
            checkAuth: false
        })
        return response.data
    }, [])

    return{
        acceptInvite,
        getInviteInfo
    }


}

export default useAcceptInviteUtils;