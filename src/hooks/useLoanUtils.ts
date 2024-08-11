import { useCallback } from "react";
import { useApi } from "./useApi";
import { IApiEndpoint, IApiResponse } from "@/types/Api";
import { ILoanApplication } from "@/types/Loan";

type TInitialLoanApplication = {
	companyName: string;
	companyWebsite?: string;
	nameOfContactPerson: string;
	emailOfContactPerson: string;
	phoneNoOfContactPerson: string;
	titleOfContactPerson: string;
	companyLocation: string;
	appliedBy: string;
	companyId: string;
	productId: string;
	orderId: string;
};

type LoanAppStepOneDataUpdate = Omit<TInitialLoanApplication, "companyLocation" | "appliedBy" | "companyId" | "productId" | "orderId"> & {
	loanApplicationId: string;
};

type LoanAppStepTwoDataUpdate = {
	companyLocation: string;
	noOfEmployees: string;
	countriesOfOperation: string[];
	loanApplicationId: string;
};

type LoanAppStepThreeDataUpdate = {
	totalRevenue: string;
	financialDocuments: { documentUrl: string; documentName: string; documentType: string; createdAt: string; updatedAt: string }[];
	totalAssets: string;
	totalLiabilities: string;
	yearsOfAuditedFinancialStatements: string;
	yearsOfOperatingTrackRecord: string;
	loanApplicationId: string;
};

type UpdateLoanDataStepItem = LoanAppStepOneDataUpdate | LoanAppStepTwoDataUpdate | LoanAppStepThreeDataUpdate;

const useLoanUtils = () => {
	const { post, put } = useApi();

	const initialLoanApplication = useCallback(
		async (data: TInitialLoanApplication) => {
			const resp = await post<IApiResponse<ILoanApplication>>({ endpoint: IApiEndpoint.APPLY_LOAN_INITIAL, data });

			return resp.data;
		},
		[post]
	);

	const updateLoanInfo = useCallback(
		async (data: UpdateLoanDataStepItem) => {
			const resp = await put<IApiResponse>({ endpoint: IApiEndpoint.UPDATE_LOAN_APPLICATION, data });

			return resp.data;
		},
		[put]
	);

	const updateLoanToApplied = useCallback(
		async (loanId: string, orderId: string) => {
			const resp = await put<IApiResponse>({ endpoint: `${IApiEndpoint.UPDATE_LOAN_APPLICATION_TO_APPLIED}/${loanId}/${orderId}` as IApiEndpoint });

			return resp.data;
		},
		[put]
	);

	return { initialLoanApplication, updateLoanInfo, updateLoanToApplied };
};

export default useLoanUtils;
