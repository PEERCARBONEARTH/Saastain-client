import { Metadata } from "next";
import FinancialInformationDetails from "./FinancialInformationDetails";

export const metadata: Metadata = {
	title: "Financial Information - Apply Loan",
};

export default async function page(props: { params: Promise<{ loanId: string }> }) {
    const params = await props.params;
    return <FinancialInformationDetails {...params} />;
}
