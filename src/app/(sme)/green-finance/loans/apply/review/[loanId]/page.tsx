import { Metadata } from "next";
import LoanReview from "./LoanReview";

export const metadata: Metadata = {
	title: "Confirm Details",
};

export default async function page(props: { params: Promise<{ loanId: string }> }) {
    const params = await props.params;
    return <LoanReview {...params} />;
}
