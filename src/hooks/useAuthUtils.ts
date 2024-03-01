import { IApiEndpoint, IApiResponse } from "@/types/Api";
import { useApi } from "./useApi";
import { useCallback } from "react";

const useAuthUtils = () => {
    const {post} = useApi()


    const verifyEmail = useCallback (async (token:string, id: string) =>{
        const response = await post<IApiResponse>({
            endpoint: IApiEndpoint.VERIFY_EMAIL,
            data: {token, id},
            checkAuth: false
        })
        return response.data
    }, [])

    const requestPasswordReset = useCallback (async (email:string) =>{
        const response = await  post<IApiResponse>({
            endpoint: IApiEndpoint.REQUEST_PASSWORD_RESET,
            data: {email},
            checkAuth: false
        })
        return response.data

    }, [])

    const verifyPasswordResetToken = useCallback (async (token:string, id: string) =>{
        const response = await post<IApiResponse>({
            endpoint: IApiEndpoint.VERIFY_PASSWORD_RESET_TOKEN,
            data: {token, id},
            checkAuth: false
        })
        return response.data
    }, [])

    const resetPassword = useCallback (async (token:string, password:string, userId: string) =>{
        const response = await post<IApiResponse>({
            endpoint: IApiEndpoint.RESET_PASSWORD,
            data: {token, password, userId},
            checkAuth: false
        })
        return response.data
    }, [])

    return{
        requestPasswordReset,
        verifyPasswordResetToken,
        resetPassword, 
        verifyEmail
    }
}

export default useAuthUtils;
