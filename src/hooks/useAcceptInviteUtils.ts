import { IApiResponse } from "@/types/Api"
import { useApi } from "./useApi"

const useAcceptInviteUtils = () => {
    const {post} = useApi()

    const acceptInvite = async (token:string) =>{
        const response = await post<IApiResponse>({
            endpoint: 'accept-invite',
            data: {token},
            checkAuth: false
        })
}