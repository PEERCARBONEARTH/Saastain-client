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

	const createStripeCustomer = useCallback(
		async (companyId: string, userId: string, email: string) => {
			const resp = await post<IApiResponse<string>>({ endpoint: IApiEndpoint.SUBSCRIPTIONS_CREATE_CUSTOMER, data: { companyId, userId, email } });

			return resp.data;
		},
		[post]
	);

	const createSubscriptionCheckoutSession = useCallback(
		async (priceId: string, stripeCustomerId: string) => {
			const resp = await post<IApiResponse<string>>({ endpoint: IApiEndpoint.SUBSCRIPTIONS_CREATE_CHECKOUT_SESSION_01, data: { priceId, stripeCustomerId } });

			return resp.data;
		},
		[post]
	);

	const createPortalSession = useCallback(
		async (stripeCustomerId: string) => {
			const resp = await post<IApiResponse<string>>({ endpoint: IApiEndpoint.SUBSCRIPTIONS_CREATE_PORTAL_SESSION, data: { stripeCustomerId: stripeCustomerId } });

			return resp.data;
		},
		[post]
	);

	return { createCheckoutSession, createStripeCustomer, createSubscriptionCheckoutSession, createPortalSession };
};

export default useSubscriptionUtils;
