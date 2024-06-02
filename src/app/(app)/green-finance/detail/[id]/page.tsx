import { Metadata } from "next";
import MarketplaceItemDetails from "./MarketplaceItemDetails";

export const metadata: Metadata = {
	title: "Item Details",
};

export default function page({ params }: { params: { id: string } }) {
	return <MarketplaceItemDetails id={params.id} />;
}
