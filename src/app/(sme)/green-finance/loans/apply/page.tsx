import { Metadata } from "next";
import ApplyLoan from "./ApplyLoan";

export const metadata: Metadata = {
	title: "Apply For Loan",
};

export default function page() {
	return <ApplyLoan />;
}
