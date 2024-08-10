import { Metadata } from "next";
import UpdateQuoteDetailsPage from "./UpdateQuoteDetailsPage";

export const metadata: Metadata = {
	title: "Update Quote Details",
};

export default function Page({ params }: { params: { orderId: string, quoteId: string } }) {
	return <UpdateQuoteDetailsPage {...params} />;
}
