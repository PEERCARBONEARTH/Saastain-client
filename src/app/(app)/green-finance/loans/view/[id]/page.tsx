import { Metadata } from "next";
import LoanItemDetails from "./LoanItemDetails";

export const metadata: Metadata = {
	title: "Loan Details",
};

export default function page({ params }: { params: { id: string } }) {
	return <LoanItemDetails id={params.id} />;
}
