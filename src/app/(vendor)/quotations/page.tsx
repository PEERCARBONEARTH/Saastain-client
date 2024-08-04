import { Metadata } from "next";
import QuotationsPage from "./QuotationsPage";

export const metadata: Metadata = {
    title: "Quotations"
}

export default function page() {
	return <QuotationsPage />
}
