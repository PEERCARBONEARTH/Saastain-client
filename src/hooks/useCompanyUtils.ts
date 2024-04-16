import { useCallback } from "react"
import { useApi } from "./useApi"
import { IApiEndpoint, IApiResponse } from "@/types/Api"

const useCompanyUtils = () => {
    const {post} = useApi()

    const createCompany = useCallback  (async (userId: string, companyName: string, primaryName: string, phoneNo: string, location: string, description: string) => {
        const response = await post<IApiResponse>({
            endpoint: IApiEndpoint.CREATE_COMPANY,
            data: {userId, companyName, primaryName, phoneNo, location, description},
            checkAuth: true
        })
        return response.data
    }, [])

    return {
        createCompany
    } 
}

export default useCompanyUtils;