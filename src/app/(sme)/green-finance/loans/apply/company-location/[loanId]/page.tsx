import { Metadata } from "next";
import CompanyLocationDetails from "./CompanyLocationDetails";

export const metadata: Metadata = {
	title: "Company Location - Apply Loan",
};

export default function page({ params }: { params: { loanId: string } }) {
	return <CompanyLocationDetails {...params} />;
}
