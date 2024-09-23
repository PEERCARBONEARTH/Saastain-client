import { IConfiguration } from "@/types/Configuration";
import { useCallback, useEffect, useState } from "react";
import { useApi } from "./useApi";
import { IApiEndpoint, IApiResponse } from "@/types/Api";

const useConfigData = (id: string) => {
	const [config, setConfig] = useState<IConfiguration>(null);
	const { get } = useApi();

	const fetchData = async () => {
		if (typeof id !== "string") {
			setConfig(null);
			return;
		}

		try {
			const resp = await get<IApiResponse<IConfiguration>>({ endpoint: `${IApiEndpoint.GET_CONFIG_BY_COMPANY}/${id}` as IApiEndpoint });

			const rawResp = resp.data;

			if (rawResp.status === "success") {
				setConfig(rawResp.data);
			} else {
				setConfig(null);
			}
		} catch (err) {
			console.log("Unloaded Config ERR", err);
		}
	}

	useEffect(() => {
		fetchData();
	}, [id]);

	return { data: config };
};

export default useConfigData;
