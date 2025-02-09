import { Metadata } from "next";
import LoanRequestDetails from "./LoanRequestDetails";

export const metadata: Metadata = {
	title: "Loan Details",
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    return <LoanRequestDetails {...params} />;
}
