import { Metadata } from "next";
import CompanyLocationDetails from "./CompanyLocationDetails";

export const metadata: Metadata = {
	title: "Company Location - Apply Loan",
};

export default async function page(props: { params: Promise<{ loanId: string }> }) {
    const params = await props.params;
    return <CompanyLocationDetails {...params} />;
}
