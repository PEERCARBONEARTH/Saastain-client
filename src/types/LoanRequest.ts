export enum LoanType {
	GreenLoans = "green-loans",
	GreenMutualFunds = "green-mutual-funds",
	GreenBonds = "green-bonds",
	BlueBonds = "blue-bonds",
}

export enum LoanStatus {
	Cancelled = "cancelled",
	InProgress = "in-progress",
	Completed = "completed",
	Pending = "pending",
}

export interface IDummyLoanRequest {
	id: string;
	loanType: LoanType;
	status: LoanStatus;
	total: number;
	startDate: string;
	endDate: string;
}
