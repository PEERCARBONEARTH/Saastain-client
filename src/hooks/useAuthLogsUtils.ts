import { useCallback } from "react";
import { useApi } from "./useApi";
import axios from "axios";
import { IAuthLog } from "@/types/AuthLog";
import { AuthProvider } from "@/types/User";
import { IApiEndpoint, IApiResponse } from "@/types/Api";

type ISaveAuthLogData = Pick<IAuthLog, "email" | "status">;

const useAuthLogsUtils = () => {
	const { post } = useApi();

	const getIP = async () => {
		try {
			const resp = await axios.get("https://api.ipify.org?format=json");

			return resp.data?.ip;
		} catch (err) {
			console.log(err);
			return null;
		}
	};

	const saveNewAuthLog = useCallback(async (info: ISaveAuthLogData) => {
		try {
			const ip = await getIP();

			const data = {
				...info,
				ipAddr: ip ?? "192.000.000.000",
				authProvider: AuthProvider.EMAIL,
			};

			const resp = await post<IApiResponse>({
				endpoint: IApiEndpoint.SAVE_AUTH_LOG,
				data,
				checkAuth: false,
			});

			return resp.data;
		} catch (err) {
			console.log(err);
			return null;
		}
	}, []);

	return { saveNewAuthLog };
};

export default useAuthLogsUtils;
