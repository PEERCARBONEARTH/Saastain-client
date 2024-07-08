import { IGreenCategory } from "@/types/GreenCategory";
import { useCallback } from "react";
import { useApi } from "./useApi";
import { IApiEndpoint, IApiResponse } from "@/types/Api";
import { ISDG } from "@/types/SDG";

type SaveGreenCategory = Pick<IGreenCategory, "title" | "description">;

type SaveSDGItem = Pick<ISDG, "imgUrl" | "title" | "description">;

const useGreenProductUtils = () => {
	const { post } = useApi();

	const addGreenProductCategory = useCallback(async (data: SaveGreenCategory) => {
		const resp = await post<IApiResponse>({ endpoint: IApiEndpoint.ADD_GREEN_PRODUCT_CATEGORY, data });

		return resp.data;
	}, []);

	const addSDGItem = useCallback(async (data: SaveSDGItem) => {
		const resp = await post<IApiResponse>({ endpoint: IApiEndpoint.ADD_SDG_ITEM, data });

		return resp.data;
	}, []);

	return { addGreenProductCategory, addSDGItem };
};

export default useGreenProductUtils;
