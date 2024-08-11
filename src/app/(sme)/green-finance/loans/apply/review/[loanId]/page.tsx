import { Metadata } from "next";
import LoanReview from "./LoanReview";

export const metadata: Metadata = {
	title: "Confirm Details",
};

export default function page({ params }: { params: { loanId: string } }) {
	return <LoanReview {...params} />;
}
