import { Metadata } from "next";
import LoanItemDetails from "./LoanItemDetails";

export const metadata: Metadata = {
	title: "Loan Details",
};

export default async function page(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    return <LoanItemDetails id={params.id} />;
}
