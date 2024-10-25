import { useSession } from "next-auth/react";
import useConfigData from "./useConfigData";
import { useCompanyConfigStore } from "./store/useCompanyConfigStore";
import { useEffect } from "react";

const useLoadCompanyConfig = () => {
	const { data: session, status } = useSession();
	const { data: configInfo } = useConfigData(session?.user?.company?.id);


	const { setConfig } = useCompanyConfigStore();

	useEffect(() => {
		if (status === "loading") {
			return;
		}

		if (status === "unauthenticated") {
			return;
		}

		if (!configInfo) {
			return;
		}

		setConfig(configInfo);
	}, [status, session, configInfo]);
};

export default useLoadCompanyConfig;
