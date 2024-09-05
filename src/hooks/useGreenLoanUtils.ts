import { useCallback } from "react";
import { useApi } from "./useApi";
import { IApiEndpoint, IApiResponse } from "@/types/Api";
import { SLAType } from "@/types/GreenLoanApplication";

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

interface IAddDocusealDocumentToken {
	type: SLAType;
	documentName: string;
	loanId: string;
	initialEmailAccess: string;
	documentUrl: string;
}

const useGreenLoanUtils = () => {
	const { put, post } = useApi();

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

	const updateLoanToApprovedTest = useCallback(
		async (loanId: string) => {
			const resp = await put<IApiResponse>({ endpoint: `${IApiEndpoint.UPDATE_LOAN_TO_APPROVED}/${loanId}` as IApiEndpoint });

			return resp.data;
		},
		[put]
	);

	const requestDocusealDocument = useCallback(
		async (data: IAddDocusealDocumentToken) => {
			const resp = await post<IApiResponse<string>>({ endpoint: IApiEndpoint.REQUEST_LOAN_DOCUSEAL_TOKEN, data });

			return resp.data;
		},
		[post]
	);

	return { updateEmissionBaselineDocument, updateClimateRiskDocument, updateLoanToApprovedTest, requestDocusealDocument };
};

export default useGreenLoanUtils;
