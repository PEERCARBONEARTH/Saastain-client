import { IGreenProduct } from "@/types/GreenProduct";
import { useApi } from "./useApi";
import { useCallback } from "react";
import { IApiEndpoint, IApiResponse } from "@/types/Api";

export type ISaveGreenProduct = Omit<IGreenProduct, "id" | "createdAt" | "updatedAt" | "vendor"> & { vendorId: string };

const useProductUtils = () => {
	const { post } = useApi();

	const saveNewGreenProduct = useCallback(async (data: ISaveGreenProduct) => {
		const resp = await post<IApiResponse>({ endpoint: IApiEndpoint.ADD_PRODUCT, data });

		return resp.data;
	}, []);

	return { saveNewGreenProduct };
};

export default useProductUtils;
