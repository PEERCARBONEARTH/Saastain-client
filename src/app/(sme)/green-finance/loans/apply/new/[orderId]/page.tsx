import { Metadata } from "next";
import NewLoanApplication from "./NewLoanApplication";

export const metadata: Metadata = {
	title: "Apply Loan",
};

export default function page({ params }: { params: { orderId: string } }) {
	return <NewLoanApplication {...params} />
}
