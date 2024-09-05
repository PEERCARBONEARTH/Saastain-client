export enum LoanType {
	GreenLoans = "green-loans",
	GreenMutualFunds = "green-mutual-funds",
	GreenBonds = "green-bonds",
	BlueBonds = "blue-bonds",
}

export enum LoanStatus {
	DRAFT = "draft",
	APPLIED = "applied",
	IN_PROGRESS = "in-progress",
	IN_REVIEW = "in-review",
	APPROVED = "approved",
	REJECTED = "rejected",
	REVERTED = "reverted",
	DISBURSED = "disbursed",
}



export interface ILoanRequest {
	id: string;
	createdAt: string;
	updatedAt: string;
	status: LoanStatus;
	product: {
	  name: string;
	};
	order: {
	  id: string;
	  quoteDetails: {
		totalCost: string;
	  }[];
	};
  }