import { useCallback } from "react";
import { useApi } from "./useApi";
import { IApiEndpoint, IApiResponse } from "@/types/Api";

const useSubscriptionUtils = () => {
	const { post } = useApi();

	const createCheckoutSession = useCallback(
		async (lookup_key: string) => {
			const resp = await post<IApiResponse>({ endpoint: IApiEndpoint.SUBSCRIPTIONS_CREATE_CHECKOUT_SESSION, data: { lookup_key } });

			return resp.data;
		},
		[post]
	);

	return { createCheckoutSession };
};

export default useSubscriptionUtils;
