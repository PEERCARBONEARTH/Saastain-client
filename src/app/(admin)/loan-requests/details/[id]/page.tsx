import { Metadata } from "next";
import LoanRequestDetails from "./LoanRequestDetails";

export const metadata: Metadata = {
	title: "Loan Details",
};

export default function Page({ params }: { params: { id: string } }) {
	return <LoanRequestDetails {...params} />;
}
