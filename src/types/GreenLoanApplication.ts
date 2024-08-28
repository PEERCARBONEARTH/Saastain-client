import { ICompany } from "./Company";
import { IGreenProduct } from "./GreenProduct";
import { IOrder } from "./Order";
import { IUser } from "./User";

export enum GreenLoanStatus {
	DRAFT = "draft",
	APPLIED = "applied",
	IN_PROGRESS = "in-progress",
	IN_REVIEW = "in-review",
	APPROVED = "approved",
	REJECTED = "rejected",
	REVERTED = "reverted",
	DISBURSED = "disbursed",
}

export interface IGreenLoanApplication {
	id: string;
	createdAt: string;
	updatedAt: string;
	companyName: string;
	companyWebsite?: string;
	nameOfContactPerson: string;
	emailOfContactPerson: string;
	phoneNoOfContactPerson: string;
	titleOfContactPerson: string;
	companyLocation: string;
	noOfEmployees?: string;
	countriesOfOperation?: string[];
	totalRevenue?: string;
	financialDocuments?: { documentUrl: string; documentName: string; documentType: string; createdAt: string; updatedAt: string }[];
	totalAssets?: string;
	totalLiabilities?: string;
	yearsOfAuditedFinancialStatements?: string;
	yearsOfOperatingTrackRecord?: string;
	totalBaselineEmissions?: { totalEmission: string; accountingPeriod: string; documentUrl: string }[];
	product?: IGreenProduct;
	appliedBy?: IUser;
	status: GreenLoanStatus;
	approvedBy?: IUser;
	company?: ICompany;
	order?: IOrder;
	climateRiskData?: { riskLevel: string; score: number; documentUrl?: string; mapUrl: string; addedOn?: string }[];
}
