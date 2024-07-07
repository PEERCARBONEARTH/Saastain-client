import { IWaitlist } from "@/types/Waitlist";
import { useCallback } from "react";
import { useApi } from "./useApi";
import { IApiEndpoint, IApiResponse } from "@/types/Api";

const useWaitlistUtils = () => {
	const { post } = useApi();

	const addToWaitlist = useCallback(async (data: Omit<IWaitlist, "id" | "createdAt" | "updatedAt" | "status">) => {
		const resp = await post<IApiResponse<IWaitlist>>({ endpoint: IApiEndpoint.WAITLIST, data });

		return resp.data;
	}, []);

	return { addToWaitlist };
};

export default useWaitlistUtils;
