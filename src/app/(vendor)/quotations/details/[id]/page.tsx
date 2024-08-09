import { Metadata } from "next";
import QuoteDetails from "./QuoteDetails";

export const metadata: Metadata = {
	title: "Quote Details",
};

export default function page({ params }: { params: { id: string } }) {
	return <QuoteDetails id={params.id} />;
}
