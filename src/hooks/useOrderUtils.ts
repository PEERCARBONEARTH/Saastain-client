import { useCallback } from "react";
import { useApi } from "./useApi";
import { IApiEndpoint, IApiResponse } from "@/types/Api";
import { IOrder } from "@/types/Order";

interface CreateOrderType {
	productId: string;
	requestedBy: string;
	vendorId: string;
	companyId: string;
}

interface SaveNewOrderTimelineType {
	orderId: string;
	code: string;
	title: string;
	description: string;
	otherData?: string;
}

const useOrderUtils = () => {
	const { post, put } = useApi();

	const createNewRFQ = useCallback(
		async (data: CreateOrderType) => {
			const resp = await post<IApiResponse<IOrder>>({ endpoint: IApiEndpoint.CREATE_NEW_RFQ, data });

			return resp.data;
		},
		[post]
	);

	const createRFQForOrder = useCallback(
		async (data: CreateOrderType & { orderId: string }) => {
			const resp = await post<IApiResponse>({ endpoint: IApiEndpoint.CREATE_NEW_RFQ_BY_ORDER, data });

			return resp.data;
		},
		[post]
	);

	const saveNewOrderTimeline = useCallback(
		async (data: SaveNewOrderTimelineType) => {
			const resp = await post<IApiResponse>({ endpoint: IApiEndpoint.SAVE_NEW_ORDER_TIMELINE, data });

			return resp.data;
		},
		[post]
	);

	const smeAcceptQuotation = useCallback(
		async (orderId: string, quoteId: string) => {
			const resp = await put<IApiResponse>({ endpoint: `${IApiEndpoint.SME_ACCEPT_QUOTATION}/${orderId}/${quoteId}` as IApiEndpoint });

			return resp.data;
		},
		[put]
	);

	const smeRejectQuotation = useCallback(
		async (orderId: string) => {
			const resp = await put<IApiResponse>({ endpoint: `${IApiEndpoint.SME_REJECT_QUOTATION}/${orderId}` as IApiEndpoint });

			return resp.data;
		},
		[put]
	);

	return { createNewRFQ, createRFQForOrder, saveNewOrderTimeline, smeAcceptQuotation, smeRejectQuotation };
};

export default useOrderUtils;
