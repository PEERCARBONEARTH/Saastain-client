import { Metadata } from "next";
import FinancialInformationDetails from "./FinancialInformationDetails";

export const metadata: Metadata = {
	title: "Financial Information - Apply Loan",
};

export default function page({ params }: { params: { loanId: string } }) {
	return <FinancialInformationDetails {...params} />;
}
