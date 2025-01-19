import { Metadata } from "next";
import NewLoanApplication from "./NewLoanApplication";

export const metadata: Metadata = {
	title: "Apply Loan",
};

export default async function page(props: { params: Promise<{ orderId: string }> }) {
    const params = await props.params;
    return <NewLoanApplication {...params} />
}
