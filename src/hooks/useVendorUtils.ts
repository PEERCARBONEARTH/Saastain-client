import { IVendorInterest } from "@/types/VendorInterest";
import { useCallback } from "react";
import { useApi } from "./useApi";
import { IApiEndpoint, IApiResponse } from "@/types/Api";

type SaveVendorInterest = Omit<IVendorInterest, "id" | "status" | "createdAt" | "updatedAt">;

type SaveVendorProfile = Omit<IVendorInterest, "id" | "status" | "website" | "createdAt" | "updatedAt"> & {
	password: string;
	interestId: string;
};

const useVendorUtils = () => {
	const { post, get } = useApi();

	const addNewInterest = useCallback(async (data: SaveVendorInterest) => {
		const response = await post<IApiResponse<IVendorInterest>>({
			endpoint: IApiEndpoint.VENDOR_INTEREST,
			data,
			checkAuth: false,
		});

		return response.data;
	}, []);

	const getInterestDetails = useCallback(async (id: string) => {
		const resp = await get<IApiResponse<IVendorInterest>>({
			endpoint: `${IApiEndpoint.VENDOR_INTEREST_DETAILS}/${id}` as IApiEndpoint,
		});

		return resp.data;
	}, []);

	const registerNewVendor = useCallback(async (data: SaveVendorProfile) => {
		const response = await post<IApiResponse<any>>({
			endpoint: IApiEndpoint.VENDOR_PROFILE_REGISTER,
			data,
			checkAuth: false,
		});

		return response.data;
	}, []);

	return { addNewInterest, getInterestDetails, registerNewVendor };
};

export default useVendorUtils;
