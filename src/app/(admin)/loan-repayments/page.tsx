import { Metadata } from "next";
import AppLoanRepayments from "./AppLoanRepayments";

export const metadata: Metadata = {
	title: "Loan Repayments",
};

export default function page() {
	return <AppLoanRepayments />;
}
