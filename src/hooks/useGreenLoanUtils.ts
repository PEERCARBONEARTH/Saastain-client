import { useCallback } from "react";
import { useApi } from "./useApi";
import { IApiEndpoint, IApiResponse } from "@/types/Api";

interface IUpdateBaselineData {
	totalEmission: string;
	accountingPeriod: string;
	documentUrl: string;
}

interface IUpdateClimateRiskData {
	riskLevel: string;
	score: number;
	documentUrl: string;
	mapUrl: string;
	addedOn?: string;
}

const useGreenLoanUtils = () => {
	const { put } = useApi();

	const updateEmissionBaselineDocument = useCallback(
		async (loanId: string, data: IUpdateBaselineData) => {
			const resp = await put<IApiResponse>({ endpoint: `${IApiEndpoint.UPDATE_EMISSIONS_DOCUMENT}/${loanId}` as IApiEndpoint, data });

			return resp.data;
		},
		[put]
	);

	const updateClimateRiskDocument = useCallback(
		async (loanId: string, data: IUpdateClimateRiskData) => {
			const resp = await put<IApiResponse>({ endpoint: `${IApiEndpoint.UPDATE_CLIMATE_RISK_DOCUMENT}/${loanId}` as IApiEndpoint, data });

			return resp.data;
		},
		[put]
	);

	return { updateEmissionBaselineDocument, updateClimateRiskDocument };
};

export default useGreenLoanUtils;
