import { Metadata } from "next";
import AppLoanRequests from "./AppLoanRequests";

export const metadata: Metadata = {
	title: "Loan Requests",
};
export default function page() {
	return <AppLoanRequests />;
}
