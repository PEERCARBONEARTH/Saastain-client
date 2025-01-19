import { Metadata } from "next";
import MarketplaceItemDetails from "./MarketplaceItemDetails";

export const metadata: Metadata = {
	title: "Item Details",
};

export default async function page(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    return <MarketplaceItemDetails id={params.id} />;
}
